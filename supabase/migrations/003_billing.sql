-- AI Adoption OS: Billing, features & plan expansion

-- Subscription plans lookup
create table if not exists subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('basic','pro')),
  stripe_price_id text,
  allowed_models jsonb not null default '[]',
  price_per_seat numeric(8,2) not null,
  currency text not null default 'GBP',
  created_at timestamptz not null default now()
);

-- Seed plans
insert into subscription_plans (name, allowed_models, price_per_seat, currency) values
  ('basic', '["gpt-4o-mini","claude-3-5-haiku-20241022","gemini-2.0-flash","mistral-small-latest"]', 39.00, 'GBP'),
  ('pro', '["gpt-5.3","gpt-4o","gpt-4o-mini","o3-mini","claude-opus-4.6","claude-sonnet-4-20250514","claude-3-5-haiku-20241022","gemini-2.0-flash","gemini-1.5-pro","mistral-large-latest","mistral-small-latest"]', 79.00, 'GBP')
on conflict (name) do nothing;

-- Extend organisations with billing columns
alter table organisations
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_plan_id uuid references subscription_plans(id),
  add column if not exists subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing','active','past_due','canceled','incomplete')),
  add column if not exists trial_ends_at timestamptz default (now() + interval '14 days'),
  add column if not exists seat_count int not null default 5;

-- Extend usage_logs with customer charge
alter table usage_logs
  add column if not exists customer_charge numeric(10,6) not null default 0;

-- Conversations: folder & pin support
alter table conversations
  add column if not exists folder text,
  add column if not exists pinned boolean not null default false;

-- Knowledge base files
create table if not exists knowledge_base_files (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  department_id uuid references departments(id) on delete set null,
  filename text not null,
  storage_path text not null,
  file_size bigint not null default 0,
  uploaded_by uuid not null references user_profiles(id),
  created_at timestamptz not null default now()
);

-- Saved prompts (personal + shared)
create table if not exists saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  org_id uuid not null references organisations(id) on delete cascade,
  title text not null,
  content text not null,
  is_shared boolean not null default false,
  created_at timestamptz not null default now()
);

-- Model personas (dept-specific AI assistants)
create table if not exists model_personas (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  department_type text,
  name text not null,
  description text not null default '',
  system_prompt text not null,
  icon text not null default 'bot',
  created_by uuid not null references user_profiles(id),
  created_at timestamptz not null default now()
);

-- Approval requests
create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  message_id uuid references messages(id) on delete set null,
  conversation_id uuid references conversations(id) on delete set null,
  requested_by uuid not null references user_profiles(id),
  reviewer_id uuid references user_profiles(id),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  comment text,
  content_preview text not null default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Indexes
create index if not exists idx_kb_files_org on knowledge_base_files(org_id);
create index if not exists idx_kb_files_dept on knowledge_base_files(department_id);
create index if not exists idx_saved_prompts_user on saved_prompts(user_id);
create index if not exists idx_saved_prompts_org on saved_prompts(org_id);
create index if not exists idx_model_personas_org on model_personas(org_id);
create index if not exists idx_approval_requests_org on approval_requests(org_id);
create index if not exists idx_approval_requests_status on approval_requests(status);
create index if not exists idx_conversations_folder on conversations(user_id, folder);

-- RLS
alter table subscription_plans enable row level security;
alter table knowledge_base_files enable row level security;
alter table saved_prompts enable row level security;
alter table model_personas enable row level security;
alter table approval_requests enable row level security;

-- RLS Policies
create policy "Anyone can read subscription plans" on subscription_plans
  for select using (true);

create policy "Users view org knowledge base" on knowledge_base_files
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users upload to org knowledge base" on knowledge_base_files
  for insert with check (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role in ('admin','manager')
    )
  );

create policy "Admins delete knowledge base files" on knowledge_base_files
  for delete using (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users view own and shared prompts" on saved_prompts
  for select using (
    user_id = auth.uid() or
    (is_shared = true and org_id in (select org_id from user_profiles where id = auth.uid()))
  );

create policy "Users manage own prompts" on saved_prompts
  for all using (user_id = auth.uid());

create policy "Users view org personas" on model_personas
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Admins manage personas" on model_personas
  for all using (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users view org approval requests" on approval_requests
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users create approval requests" on approval_requests
  for insert with check (requested_by = auth.uid());

create policy "Managers resolve approval requests" on approval_requests
  for update using (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role in ('admin','manager')
    )
  );
