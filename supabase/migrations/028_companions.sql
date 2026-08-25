-- 028: role-based AI companions.
--
-- Conversations carry which companion they belong to, budget queries need a
-- per-user index on usage_logs, and the persona policies learn that
-- super_admin exists (previously only 'admin' could manage personas, so the
-- one role that could actually open the chat could not create one).
--
-- Idempotent throughout; safe to re-run.

-- ── conversations.companion ─────────────────────────────────────────────

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS companion text NOT NULL DEFAULT 'learning';

DO $$
BEGIN
  ALTER TABLE conversations
    ADD CONSTRAINT conversations_companion_check
    CHECK (companion IN ('learning', 'ld', 'insights'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversations_user_companion
  ON conversations (user_id, companion);

-- ── budget queries ──────────────────────────────────────────────────────

-- checkBudget sums usage_logs.cost per user since UTC midnight / month
-- start on every chat request; without this index that is a table scan.
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created
  ON usage_logs (user_id, created_at);

-- ── persona role fix ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins manage personas" ON model_personas;
CREATE POLICY "Admins manage personas" ON model_personas
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
