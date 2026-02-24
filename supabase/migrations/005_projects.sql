-- Projects: ChatGPT-style project grouping with custom instructions and files

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  org_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  description text not null default '',
  instructions text not null default '',
  color text not null default '#6366f1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project files
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  file_size bigint not null default 0,
  uploaded_by uuid not null references user_profiles(id),
  created_at timestamptz not null default now()
);

-- Link conversations to projects
alter table conversations
  add column if not exists project_id uuid references projects(id) on delete set null;

-- Indexes
create index if not exists idx_projects_user on projects(user_id);
create index if not exists idx_projects_org on projects(org_id);
create index if not exists idx_project_files_project on project_files(project_id);
create index if not exists idx_conversations_project on conversations(project_id);

-- RLS
alter table projects enable row level security;
alter table project_files enable row level security;

create policy "Users view own projects" on projects
  for select using (user_id = auth.uid());

create policy "Users manage own projects" on projects
  for all using (user_id = auth.uid());

create policy "Users view project files" on project_files
  for select using (
    project_id in (select id from projects where user_id = auth.uid())
  );

create policy "Users manage project files" on project_files
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );
