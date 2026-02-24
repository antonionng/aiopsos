-- ============================================================
-- 015: Make assessment_responses.department_id nullable
-- Public assessment signups may not always have a department.
-- Idempotent — safe to run multiple times.
-- ============================================================

ALTER TABLE assessment_responses
  ALTER COLUMN department_id DROP NOT NULL;
