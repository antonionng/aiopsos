-- ============================================================
-- 017: AI Policies
-- Lets admins create, edit, and publish AI usage policies.
-- All org members can read published policies.
-- Idempotent - safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_policies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  title         text NOT NULL,
  content       text NOT NULL DEFAULT '',
  category      text NOT NULL DEFAULT 'general',
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_policies_org ON ai_policies(org_id);

ALTER TABLE ai_policies ENABLE ROW LEVEL SECURITY;

-- All org members can read published policies
DROP POLICY IF EXISTS "Org members read published policies" ON ai_policies;
CREATE POLICY "Org members read published policies"
  ON ai_policies FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Admins have full CRUD
DROP POLICY IF EXISTS "Admins manage policies" ON ai_policies;
CREATE POLICY "Admins manage policies"
  ON ai_policies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
        AND org_id = ai_policies.org_id
        AND role IN ('admin', 'super_admin')
    )
  );
