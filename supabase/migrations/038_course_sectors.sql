-- ============================================================
-- 038: Course sectors
--
-- A third browse axis for the catalogue, alongside `category`
-- (subject) and `level`. `sectors` lists the sectors a course is
-- *distinctively* built for, and drives /courses/sector/[sector]
-- plus the sector filter on /courses.
--
-- Deliberately sparse. A course is tagged only where the sector
-- changes what the day in the room looks like: the material
-- worked through, the constraints, the people who need to be
-- there. Roughly a quarter of the catalogue stays untagged and is
-- presented as running for any sector, because a course claiming
-- special relevance to all eight sectors tells a reader nothing.
--
-- Values are constrained to the eight in lib/constants.ts
-- (COURSE_SECTORS). Keep the two in step.
--
-- Idempotent - safe to run multiple times. The tagging UPDATE
-- sets the same array on a re-run.
-- ============================================================

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS sectors text[] NOT NULL DEFAULT '{}';

-- Reject a typo at write time rather than letting it surface as an
-- empty sector page. NOT VALID would let existing rows escape, and
-- there are none to escape, so validate immediately.
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_sectors_known;
ALTER TABLE courses ADD CONSTRAINT courses_sectors_known CHECK (
  sectors <@ ARRAY[
    'financial_services',
    'healthcare',
    'manufacturing',
    'public_sector',
    'professional_services',
    'retail',
    'logistics',
    'education'
  ]::text[]
);

CREATE INDEX IF NOT EXISTS idx_courses_sectors ON courses USING GIN (sectors);

-- ── Tagging ──────────────────────────────────────────────────
-- Content note: as with 020, 024 and 033, this is a starting
-- point for the training team to edit, not fixed curriculum.

UPDATE courses SET sectors = v.sectors::text[], updated_at = now()
FROM (VALUES
  -- Robotics: the plant, the warehouse and the people on the shift.
  ('working-alongside-a-cobot',                        '{manufacturing,logistics}'),
  ('running-and-troubleshooting-a-robotic-cell',       '{manufacturing}'),
  ('warehouse-and-logistics-automation-in-practice',   '{logistics,retail,manufacturing}'),
  ('vision-systems-and-automated-inspection',          '{manufacturing,healthcare}'),
  ('robotics-what-it-can-and-cannot-do',               '{manufacturing,logistics,healthcare}'),
  ('specifying-a-robotics-deployment',                 '{manufacturing,logistics}'),
  ('safety-risk-and-compliance-for-robotic-workcells', '{manufacturing,logistics}'),
  ('preparing-your-team-for-automation',               '{manufacturing,logistics,retail}'),
  ('robotics-investment-and-operating-model',          '{manufacturing,logistics,retail}'),

  -- Oversight and responsible use: heaviest where a decision has to
  -- be explained to a regulator, an auditor or a member of the public.
  ('ai-governance-and-oversight-for-managers',         '{financial_services,healthcare,public_sector,professional_services}'),
  ('responsible-ai-use-at-work',                       '{financial_services,healthcare,public_sector,professional_services,education}'),
  ('ai-strategy-and-oversight-for-executives',         '{financial_services,healthcare,public_sector}'),
  ('everyday-security-for-busy-teams',                 '{financial_services,healthcare,public_sector,professional_services,education}'),

  -- Applied AI, where the sector changes the material in the room.
  ('ai-for-analysis-and-reporting',                    '{financial_services,professional_services,public_sector}'),
  ('ai-for-customer-facing-teams',                     '{retail,financial_services,public_sector}'),
  ('writing-and-communicating-with-ai',                '{professional_services,public_sector,education}'),
  ('building-ai-assistants-for-your-team',             '{professional_services,financial_services,retail}'),
  ('sponsoring-an-ai-literacy-programme',              '{public_sector,financial_services,healthcare,education}'),
  ('measuring-ai-adoption-and-value',                  '{financial_services,professional_services}'),

  -- Technology adoption.
  ('data-you-can-actually-use',                        '{financial_services,retail,logistics}'),
  ('from-spreadsheets-to-systems',                     '{financial_services,professional_services,manufacturing}'),
  ('automating-the-work-nobody-wants',                 '{financial_services,professional_services,public_sector,logistics}'),
  ('technology-for-non-technical-leaders',             '{public_sector,education,healthcare}'),
  ('digital-change-without-the-theatre',               '{public_sector,financial_services,healthcare,education}'),
  ('choosing-technology-well',                         '{public_sector,professional_services}'),
  ('running-a-rollout-that-sticks',                    '{healthcare,public_sector,financial_services,education}')

  -- Untagged, and correctly so: ai-foundations-for-every-role,
  -- prompting-and-output-verification, embedding-ai-in-daily-workflows,
  -- ai-tooling-and-integration-clinic, ai-in-the-executive-workflow,
  -- leading-an-ai-ready-team, running-an-ai-champions-network and
  -- getting-value-from-tools-you-already-own. These run the same way
  -- whoever is in the room, and every sector page lists them as such.
) AS v(slug, sectors)
WHERE courses.slug = v.slug
  AND courses.sectors IS DISTINCT FROM v.sectors::text[];
