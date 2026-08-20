-- ============================================================
-- 022: Evidence packs
--
-- The artefact the buyer actually pays for: a dated record of the
-- measures an organisation took and the evidence for them.
--
-- `payload` is a frozen snapshot. A pack regenerated for a past
-- period must never change, so nothing here is recomputed from
-- live tables at read time - the same reason certificates carry
-- their own snapshot in 021.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS evidence_packs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  period_start  date NOT NULL,
  period_end    date NOT NULL,
  generated_by  uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  generated_at  timestamptz NOT NULL DEFAULT now(),
  payload       jsonb NOT NULL DEFAULT '{}',
  storage_path  text,
  CHECK (period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_evidence_packs_org ON evidence_packs(org_id);
CREATE INDEX IF NOT EXISTS idx_evidence_packs_period ON evidence_packs(org_id, period_start, period_end);

-- ── RLS ──────────────────────────────────────────────────────
-- An evidence pack aggregates the whole organisation's training and
-- usage record, so it is an admin artefact rather than an employee
-- one. Participants see their own certificate, not the pack.

ALTER TABLE evidence_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read evidence packs" ON evidence_packs;
CREATE POLICY "Admins read evidence packs"
  ON evidence_packs FOR SELECT
  USING (
    public.academy_user_role() = 'super_admin'
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager'))
  );

DROP POLICY IF EXISTS "Admins generate evidence packs" ON evidence_packs;
CREATE POLICY "Admins generate evidence packs"
  ON evidence_packs FOR INSERT
  WITH CHECK (
    public.academy_user_role() = 'super_admin'
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager'))
  );

-- Deliberately no UPDATE policy. A pack is a dated record; correcting
-- one means generating a new pack for the same period, not editing the
-- old one. Deletion stays with super_admin.
DROP POLICY IF EXISTS "Super admins delete evidence packs" ON evidence_packs;
CREATE POLICY "Super admins delete evidence packs"
  ON evidence_packs FOR DELETE
  USING (public.academy_user_role() = 'super_admin');
