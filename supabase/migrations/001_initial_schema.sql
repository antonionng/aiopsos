-- AI Adoption OS: Full database schema

-- Organisations
create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default '',
  size text not null default '',
  logo_url text,
  created_at timestamptz not null default now()
);

-- Departments
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  type text not null check (type in (
    'engineering','sales','operations','leadership',
    'marketing','legal','hr','finance','product','support'
  ))
);

-- User profiles (linked to Supabase Auth)
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organisations(id) on delete set null,
  department_id uuid references departments(id) on delete set null,
  role text not null default 'user' check (role in ('admin','manager','user')),
  email text not null,
  name text not null default ''
);

-- Assessments
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  created_by uuid not null references user_profiles(id),
  title text not null default 'AI Readiness Assessment',
  status text not null default 'draft' check (status in ('draft','active','completed')),
  created_at timestamptz not null default now()
);

-- Assessment responses
create table if not exists assessment_responses (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  user_id uuid not null references user_profiles(id),
  department_id uuid not null references departments(id),
  capability_score numeric(3,2) not null default 0,
  integration_score numeric(3,2) not null default 0,
  governance_score numeric(3,2) not null default 0,
  automation_score numeric(3,2) not null default 0,
  raw_answers jsonb not null default '{}',
  submitted_at timestamptz not null default now()
);

-- Recommendations
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  assessment_id uuid references assessments(id) on delete set null,
  model_routing jsonb not null default '[]',
  control_layer jsonb not null default '{}',
  generated_at timestamptz not null default now()
);

-- Roadmaps
create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  assessment_id uuid references assessments(id) on delete set null,
  phases jsonb not null default '[]',
  generated_at timestamptz not null default now()
);

-- Conversations (AI chat)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  org_id uuid not null references organisations(id) on delete cascade,
  model text not null default 'gpt-4o',
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  tokens_used int not null default 0,
  model text not null default '',
  cost numeric(10,6) not null default 0,
  created_at timestamptz not null default now()
);

-- Usage logs
create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references user_profiles(id),
  department_id uuid references departments(id),
  model text not null,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  cost numeric(10,6) not null default 0,
  endpoint text not null default '',
  created_at timestamptz not null default now()
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references user_profiles(id),
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Prompt templates
create table if not exists prompt_templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organisations(id) on delete cascade,
  department_type text not null,
  title text not null,
  content text not null,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_departments_org on departments(org_id);
create index if not exists idx_user_profiles_org on user_profiles(org_id);
create index if not exists idx_assessments_org on assessments(org_id);
create index if not exists idx_assessment_responses_assessment on assessment_responses(assessment_id);
create index if not exists idx_conversations_user on conversations(user_id);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_usage_logs_org on usage_logs(org_id);
create index if not exists idx_usage_logs_created on usage_logs(created_at);
create index if not exists idx_audit_logs_org on audit_logs(org_id);

-- Row-Level Security
alter table organisations enable row level security;
alter table departments enable row level security;
alter table user_profiles enable row level security;
alter table assessments enable row level security;
alter table assessment_responses enable row level security;
alter table recommendations enable row level security;
alter table roadmaps enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table usage_logs enable row level security;
alter table audit_logs enable row level security;
alter table prompt_templates enable row level security;

-- RLS Policies: users see their own org's data
create policy "Users view own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "Users update own profile" on user_profiles
  for update using (auth.uid() = id);

create policy "Users view own org" on organisations
  for select using (
    id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users view org departments" on departments
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users view org assessments" on assessments
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Admins manage assessments" on assessments
  for all using (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users submit responses" on assessment_responses
  for insert with check (user_id = auth.uid());

create policy "Users view own responses" on assessment_responses
  for select using (
    user_id = auth.uid() or
    assessment_id in (
      select a.id from assessments a
      join user_profiles u on u.org_id = a.org_id
      where u.id = auth.uid() and u.role in ('admin','manager')
    )
  );

create policy "Users view org recommendations" on recommendations
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users view org roadmaps" on roadmaps
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users view own conversations" on conversations
  for select using (user_id = auth.uid());

create policy "Users manage own conversations" on conversations
  for all using (user_id = auth.uid());

create policy "Users view own messages" on messages
  for select using (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  );

create policy "Users insert messages" on messages
  for insert with check (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  );

create policy "Users view org usage" on usage_logs
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users view org audit logs" on audit_logs
  for select using (
    org_id in (
      select org_id from user_profiles where id = auth.uid() and role in ('admin','manager')
    )
  );

create policy "Users view prompt templates" on prompt_templates
  for select using (
    org_id is null or
    org_id in (select org_id from user_profiles where id = auth.uid())
  );
