-- ============================================================
-- 011: Assessment invites — campaign distribution tracking
-- Tracks individual email invites per assessment for campaign
-- monitoring, reminders, and completion tracking.
-- Idempotent — safe to run multiple times.
-- ============================================================

-- 1. Invites table
create table if not exists assessment_invites (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  org_id        uuid not null references organisations(id) on delete cascade,
  email         text not null,
  name          text not null default '',
  department    text not null default '',
  status        text not null default 'pending'
                  check (status in ('pending','sent','opened','completed','bounced')),
  sent_at       timestamptz,
  reminded_at   timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- 2. Indexes
create index if not exists idx_invites_assessment on assessment_invites(assessment_id);
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invites_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_invites_unique ON assessment_invites(assessment_id, email);
  END IF;
END $$;

-- 3. RLS
alter table assessment_invites enable row level security;

DROP POLICY IF EXISTS "Admins manage org invites" ON assessment_invites;
CREATE POLICY "Admins manage org invites" ON assessment_invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Super admins view all invites" ON assessment_invites;
CREATE POLICY "Super admins view all invites" ON assessment_invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
