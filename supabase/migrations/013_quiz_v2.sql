-- Migration: Quiz v2 - 5 dimensions, role selector, tools used
-- Replaces 4 dimension columns with 5 new ones and adds metadata fields.

-- ── assessment_responses ──

ALTER TABLE assessment_responses
  ADD COLUMN IF NOT EXISTS confidence_score numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS practice_score   numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tools_score      numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS responsible_score numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS culture_score    numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS respondent_role  text,
  ADD COLUMN IF NOT EXISTS tools_used       jsonb;

-- Migrate old data into new columns as a rough mapping
UPDATE assessment_responses
SET confidence_score  = capability_score,
    practice_score    = integration_score,
    tools_score       = ROUND((integration_score + automation_score) / 2, 2),
    responsible_score = governance_score,
    culture_score     = ROUND((capability_score + automation_score) / 2, 2)
WHERE confidence_score = 0
  AND practice_score = 0
  AND tools_score = 0
  AND responsible_score = 0
  AND culture_score = 0
  AND (capability_score > 0 OR integration_score > 0 OR governance_score > 0 OR automation_score > 0);

-- Drop legacy columns
ALTER TABLE assessment_responses
  DROP COLUMN IF EXISTS capability_score,
  DROP COLUMN IF EXISTS integration_score,
  DROP COLUMN IF EXISTS governance_score,
  DROP COLUMN IF EXISTS automation_score;

-- ── pending_responses (only if the table exists — it is created by migration 002) ──

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pending_responses') THEN
    ALTER TABLE pending_responses
      ADD COLUMN IF NOT EXISTS confidence_score  numeric(3,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS practice_score    numeric(3,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tools_score       numeric(3,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS responsible_score numeric(3,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS culture_score     numeric(3,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS respondent_role   text,
      ADD COLUMN IF NOT EXISTS tools_used        jsonb;

    UPDATE pending_responses
    SET confidence_score  = capability_score,
        practice_score    = integration_score,
        tools_score       = ROUND((integration_score + automation_score) / 2, 2),
        responsible_score = governance_score,
        culture_score     = ROUND((capability_score + automation_score) / 2, 2)
    WHERE confidence_score = 0
      AND practice_score = 0
      AND tools_score = 0
      AND responsible_score = 0
      AND culture_score = 0
      AND (capability_score > 0 OR integration_score > 0 OR governance_score > 0 OR automation_score > 0);

    ALTER TABLE pending_responses
      DROP COLUMN IF EXISTS capability_score,
      DROP COLUMN IF EXISTS integration_score,
      DROP COLUMN IF EXISTS governance_score,
      DROP COLUMN IF EXISTS automation_score;
  END IF;
END $$;
