-- Enterprise tier + premium feature metering

-- Update subscription_plans to allow enterprise tier
alter table subscription_plans
  drop constraint if exists subscription_plans_name_check;
alter table subscription_plans
  add constraint subscription_plans_name_check
  check (name in ('basic', 'pro', 'enterprise'));

-- Feature usage logs for metered premium features
create table if not exists feature_usage_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references user_profiles(id),
  feature text not null check (feature in ('voice', 'web_search', 'image_gen', 'deep_research')),
  units numeric(10,2) not null default 1,
  cost numeric(10,6) not null default 0,
  customer_charge numeric(10,6) not null default 0,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_feature_usage_org on feature_usage_logs(org_id);
create index if not exists idx_feature_usage_user on feature_usage_logs(user_id);
create index if not exists idx_feature_usage_feature on feature_usage_logs(feature);
create index if not exists idx_feature_usage_created on feature_usage_logs(created_at);
create index if not exists idx_feature_usage_org_feature_month
  on feature_usage_logs(org_id, feature, created_at);

-- RLS
alter table feature_usage_logs enable row level security;

create policy "Users view own org feature usage" on feature_usage_logs
  for select using (
    org_id in (select org_id from user_profiles where id = auth.uid())
  );

create policy "Users insert own feature usage" on feature_usage_logs
  for insert with check (user_id = auth.uid());
