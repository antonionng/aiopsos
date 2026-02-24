-- Migration 002: Assessment links, pending responses, super_admin role, Previsico seed

-- 1. Extend user_profiles role check to include super_admin
alter table user_profiles drop constraint if exists user_profiles_role_check;
alter table user_profiles add constraint user_profiles_role_check
  check (role in ('super_admin', 'admin', 'manager', 'user'));

-- 2. Assessment links (shareable public URLs tied to an org)
create table if not exists assessment_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  created_by uuid not null references user_profiles(id),
  token text not null unique,
  title text not null default 'AI Readiness Assessment',
  description text not null default '',
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_assessment_links_org on assessment_links(org_id);
create unique index if not exists idx_assessment_links_token on assessment_links(token);

-- 3. Pending responses (pre-signup assessment results)
create table if not exists pending_responses (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references assessment_links(id) on delete cascade,
  raw_answers jsonb not null default '{}',
  capability_score numeric(3,2) not null default 0,
  integration_score numeric(3,2) not null default 0,
  governance_score numeric(3,2) not null default 0,
  automation_score numeric(3,2) not null default 0,
  session_token text not null unique,
  claimed_by uuid references user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_pending_responses_link on pending_responses(link_id);
create index if not exists idx_pending_responses_session on pending_responses(session_token);

-- 4. RLS for assessment_links
alter table assessment_links enable row level security;

-- Public can read active links by token
create policy "Public read active links" on assessment_links
  for select using (active = true);

-- Admins manage their org's links
create policy "Admins manage org links" on assessment_links
  for all using (
    org_id in (
      select org_id from user_profiles
      where id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- 5. RLS for pending_responses
alter table pending_responses enable row level security;

-- Allow anonymous inserts (public assessment flow)
create policy "Public insert pending responses" on pending_responses
  for insert with check (true);

-- Allow reading by session_token (handled via service role in API) or by claimed user
create policy "Users read own claimed responses" on pending_responses
  for select using (claimed_by = auth.uid());

-- Allow updates (claiming) via service role
create policy "Public update pending responses" on pending_responses
  for update using (true);

-- 6. Super admin can view all organisations
create policy "Super admins view all orgs" on organisations
  for select using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Super admin can view all user profiles
create policy "Super admins view all profiles" on user_profiles
  for select using (
    exists (
      select 1 from user_profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

-- Super admin can view all assessments
create policy "Super admins view all assessments" on assessments
  for select using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Super admin can view all assessment responses
create policy "Super admins view all responses" on assessment_responses
  for select using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- 7. Seed Previsico as first organisation
insert into organisations (id, name, industry, size)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Previsico',
  'Climate Tech',
  '51-200'
) on conflict (id) do nothing;

-- 8. Trigger to auto-promote ag@experrt.com to super_admin
create or replace function promote_super_admin()
returns trigger as $$
begin
  if NEW.email = 'ag@experrt.com' then
    NEW.role := 'super_admin';
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_promote_super_admin on user_profiles;
create trigger trg_promote_super_admin
  before insert or update on user_profiles
  for each row execute function promote_super_admin();
