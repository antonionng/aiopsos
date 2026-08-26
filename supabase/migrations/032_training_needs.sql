-- 032: a second assessment instrument (training needs).
--
-- Response rows learn which template produced them and carry their scores
-- as jsonb keyed by the template's own dimensions. The five legacy maturity
-- columns stay - every existing aggregate reads them - and stay 0 for
-- non-maturity rows, which aggregates must exclude via template_id.
-- Links carry the template so the share funnel can serve any instrument.
--
-- Idempotent; no new tables, RLS unchanged.

ALTER TABLE assessment_responses
  ADD COLUMN IF NOT EXISTS template_id text,
  ADD COLUMN IF NOT EXISTS dimension_scores jsonb;

ALTER TABLE pending_responses
  ADD COLUMN IF NOT EXISTS template_id text,
  ADD COLUMN IF NOT EXISTS dimension_scores jsonb;

ALTER TABLE assessment_links
  ADD COLUMN IF NOT EXISTS template_id text NOT NULL DEFAULT 'org-wide';

-- Aggregates filter maturity rows by template; a partial index keeps that
-- cheap without indexing the (majority, null) legacy rows.
CREATE INDEX IF NOT EXISTS idx_assessment_responses_template
  ON assessment_responses (template_id)
  WHERE template_id IS NOT NULL;
