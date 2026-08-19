-- ============================================================
-- 020: Academy course catalogue
-- Global (not org-owned) catalogue of facilitated courses, plus
-- their modules. Courses are the target of the assessment ->
-- training join: `target_dimensions` maps a weak assessment
-- dimension to a course, `target_roles` maps a respondent role.
--
-- Partner-authored, org-scoped courses arrive in migration 023.
-- Idempotent - safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text NOT NULL UNIQUE,
  title              text NOT NULL,
  summary            text NOT NULL DEFAULT '',
  level              text NOT NULL CHECK (level IN ('practitioner', 'manager', 'leadership')),
  duration_hours     numeric(4,1) NOT NULL DEFAULT 0,
  delivery_modes     text[] NOT NULL DEFAULT '{in_person,virtual}',
  learning_outcomes  jsonb NOT NULL DEFAULT '[]',
  target_roles       text[] NOT NULL DEFAULT '{}',
  target_dimensions  text[] NOT NULL DEFAULT '{}',
  status             text NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'retired')),
  created_by         uuid REFERENCES user_profiles(id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position        int NOT NULL,
  title           text NOT NULL,
  summary         text NOT NULL DEFAULT '',
  duration_hours  numeric(4,1) NOT NULL DEFAULT 0,
  outcomes        jsonb NOT NULL DEFAULT '[]',
  lab_url         text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, position)
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_dimensions ON courses USING GIN (target_dimensions);
CREATE INDEX IF NOT EXISTS idx_courses_roles ON courses USING GIN (target_roles);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);

-- ── RLS ──────────────────────────────────────────────────────
-- The catalogue is a public marketing surface (see app/(public)/courses),
-- so *published* rows are readable by anonymous visitors as well as
-- authenticated users. Drafts and retired courses stay internal.
-- Only super_admin may write.

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads published courses" ON courses;
CREATE POLICY "Anyone reads published courses"
  ON courses FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Super admins manage courses" ON courses;
CREATE POLICY "Super admins manage courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Anyone reads published course modules" ON course_modules;
CREATE POLICY "Anyone reads published course modules"
  ON course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
        AND courses.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Super admins manage course modules" ON course_modules;
CREATE POLICY "Super admins manage course modules"
  ON course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ── Starter catalogue ────────────────────────────────────────
-- Phase 1 ships no course-authoring UI (courses are super_admin
-- writable only), so the catalogue is seeded here. Content is a
-- starting point for the training team to edit, not fixed data.
-- Every course maps to at least one assessment dimension so that
-- recommendCourses() has something to rank.

INSERT INTO courses (slug, title, summary, level, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'ai-foundations-for-every-role',
    'AI Foundations for Every Role',
    'A facilitated introduction for staff who have little or no structured experience with AI tools. Participants leave having used AI on their own real work, with a clear view of what these systems can and cannot do.',
    'practitioner', 6.0, '{in_person,virtual}',
    '["Describe in plain language how a large language model produces an answer","Complete three tasks from your own role using an AI assistant","Recognise the common failure modes: fabrication, staleness, and confident error","Decide when a task is and is not appropriate for an AI tool"]',
    '{individual_contributor,team_lead}',
    '{confidence,practice}',
    'published'
  ),
  (
    'prompting-and-output-verification',
    'Prompting and Output Verification',
    'A working session on getting reliable results and, more importantly, on checking them. Built around the verification habits that separate occasional AI users from dependable ones.',
    'practitioner', 7.0, '{in_person,virtual}',
    '["Structure a prompt with role, context, constraints, and output format","Iterate on a weak result rather than abandoning it","Apply a repeatable verification routine to AI output before it leaves your desk","Document a prompt so a colleague can reuse it"]',
    '{individual_contributor,team_lead,manager}',
    '{confidence,responsible}',
    'published'
  ),
  (
    'embedding-ai-in-daily-workflows',
    'Embedding AI in Daily Workflows',
    'Moves participants from ad hoc use to repeatable practice. Each participant maps one of their own recurring workflows and rebuilds it with AI in the loop.',
    'practitioner', 6.0, '{in_person,virtual,blended}',
    '["Map a recurring workflow you own and identify where AI fits","Build and test a reusable prompt or template for that workflow","Measure the time and quality difference against your current method","Hand the workflow to a colleague and confirm they can run it"]',
    '{individual_contributor,team_lead}',
    '{practice,tools}',
    'published'
  ),
  (
    'ai-tooling-and-integration-clinic',
    'AI Tooling and Integration Clinic',
    'A short clinic for teams whose tools are in place but underused or disconnected. Run against your organisation''s actual toolset rather than a generic demo stack.',
    'practitioner', 4.0, '{in_person,virtual}',
    '["Inventory the AI tools available to you and what each is actually for","Connect an AI assistant to the documents and systems you work in","Choose the right tool for a task instead of defaulting to one","Escalate a tooling or access gap through the right channel"]',
    '{individual_contributor,team_lead,manager}',
    '{tools}',
    'published'
  ),
  (
    'responsible-ai-use-at-work',
    'Responsible AI Use at Work',
    'Covers the judgement calls staff face daily: what data may go into a tool, when a human must review, and how to record what was done. Delivered against your organisation''s own AI policy.',
    'practitioner', 4.0, '{in_person,virtual}',
    '["Classify what information may and may not be entered into an AI tool","Identify tasks that require a human decision maker","Recognise bias and unfair outcomes in AI-assisted work","Record AI involvement in a piece of work so it can be reviewed later"]',
    '{individual_contributor,team_lead,manager,director,executive}',
    '{responsible}',
    'published'
  ),
  (
    'leading-an-ai-ready-team',
    'Leading an AI-Ready Team',
    'For the managers who decide whether adoption sticks. Focuses on setting expectations, removing blockers, and building the team habits that survive after the training ends.',
    'manager', 8.0, '{in_person,virtual,blended}',
    '["Set realistic expectations for what AI changes in your team''s workload","Identify and remove the blockers stopping your team from using the tools","Run a team routine that surfaces and spreads what is working","Support staff who are anxious about AI without dismissing the concern"]',
    '{team_lead,manager,director}',
    '{culture,practice}',
    'published'
  ),
  (
    'ai-governance-and-oversight-for-managers',
    'AI Governance and Oversight for Managers',
    'The oversight duties that sit with line management: approving use cases, handling incidents, and keeping a record of what the team does with AI.',
    'manager', 6.0, '{in_person,virtual}',
    '["Apply your organisation''s AI policy to real requests from your team","Decide which AI-assisted outputs require review before they are used","Handle an AI-related incident and record it appropriately","Explain your team''s AI use to an internal auditor or risk function"]',
    '{manager,director}',
    '{responsible,culture}',
    'published'
  ),
  (
    'ai-strategy-and-oversight-for-executives',
    'AI Strategy and Oversight for Executives',
    'A half-day session for the board and executive team on where AI creates and destroys value, what the organisation is accountable for, and what to ask for in reporting.',
    'leadership', 5.0, '{in_person,virtual}',
    '["Distinguish AI investments that change unit economics from those that do not","State what your organisation is accountable for when it deploys AI","Set the reporting you need to see adoption and risk without vanity metrics","Sponsor an AI literacy programme that is proportionate to role and risk"]',
    '{director,executive}',
    '{confidence,culture,responsible}',
    'published'
  ),
  (
    'ai-in-the-executive-workflow',
    'AI in the Executive Workflow',
    'Senior leaders working on their own material rather than talking about AI in the abstract: board papers, briefing notes, analysis of a long document, and the tools that make it repeatable.',
    'leadership', 4.0, '{in_person,virtual}',
    '["Use an AI assistant on your own briefing and board material","Interrogate a long document you have been asked to approve","Set up the small number of tools that fit how you actually work","Judge when the output is good enough to put your name to"]',
    '{director,executive}',
    '{practice,tools}',
    'published'
  ),
  (
    'sponsoring-an-ai-literacy-programme',
    'Sponsoring an AI Literacy Programme',
    'For the executive or manager who has to commission workforce AI training and answer for it later. Covers scoping measures to role and risk, and what records to insist on.',
    'leadership', 4.0, '{in_person,virtual}',
    '["Scope AI literacy measures proportionately to role and risk","Commission training against a measured gap rather than a vendor pitch","Specify the records the programme must produce as it runs","Describe the measures your organisation has taken, without overclaiming what they establish"]',
    '{manager,director,executive}',
    '{culture,confidence}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO course_modules (course_id, position, title, summary, duration_hours, outcomes)
SELECT c.id, m.position, m.title, m.summary, m.duration_hours, m.outcomes::jsonb
FROM (VALUES
  ('ai-foundations-for-every-role', 1, 'What these systems actually do', 'A non-technical account of how a model produces an answer, and why that shape explains most of its failures.', 1.5, '["Explain a model output to a colleague without jargon"]'),
  ('ai-foundations-for-every-role', 2, 'Hands on with your own work', 'Participants bring three real tasks and work them through with an assistant, facilitated.', 3.0, '["Complete three role-relevant tasks with AI assistance"]'),
  ('ai-foundations-for-every-role', 3, 'Where not to use it', 'Boundaries: confidentiality, decisions that need a person, and tasks where AI is simply slower.', 1.5, '["Decide when a task is unsuitable for an AI tool"]'),

  ('prompting-and-output-verification', 1, 'Structuring a request', 'Role, context, constraints, format. Practised against weak prompts the group brings in.', 2.0, '["Rewrite a weak prompt into a structured one"]'),
  ('prompting-and-output-verification', 2, 'Iteration instead of abandonment', 'What to do with a poor first answer, and how to tell a fixable result from a dead end.', 2.0, '["Recover a usable result from a poor first answer"]'),
  ('prompting-and-output-verification', 3, 'Verification routines', 'Building a checking habit proportionate to the stakes of the work.', 3.0, '["Apply a verification routine before releasing AI-assisted work"]'),

  ('embedding-ai-in-daily-workflows', 1, 'Mapping a workflow you own', 'Each participant documents one recurring task end to end.', 1.5, '["Produce a written map of a recurring workflow"]'),
  ('embedding-ai-in-daily-workflows', 2, 'Rebuilding it with AI in the loop', 'Facilitated rebuild, with the trainer working alongside each participant.', 3.0, '["Build a reusable prompt or template for that workflow"]'),
  ('embedding-ai-in-daily-workflows', 3, 'Handover and measurement', 'Proving the workflow works for someone other than its author.', 1.5, '["Hand a workflow to a colleague who can run it unaided"]'),

  ('ai-tooling-and-integration-clinic', 1, 'What you already have', 'An honest inventory of the tools the organisation provides and what each is for.', 1.5, '["Inventory available AI tools and their intended use"]'),
  ('ai-tooling-and-integration-clinic', 2, 'Connecting tools to your work', 'Getting assistants pointed at the documents and systems people actually use.', 2.5, '["Connect an assistant to a real work source"]'),

  ('responsible-ai-use-at-work', 1, 'What may go in', 'Data classification applied to AI tools, using your organisation''s own policy.', 1.5, '["Classify information against your organisation''s AI policy"]'),
  ('responsible-ai-use-at-work', 2, 'What must come back to a person', 'Identifying decisions that cannot be delegated to a tool.', 1.5, '["Identify tasks requiring a human decision maker"]'),
  ('responsible-ai-use-at-work', 3, 'Leaving a record', 'Recording AI involvement so work can be reviewed after the fact.', 1.0, '["Record AI involvement in a piece of work"]'),

  ('leading-an-ai-ready-team', 1, 'Setting the expectation', 'What changes and what does not when a team adopts AI, and how to say so credibly.', 2.0, '["State realistic expectations to your team"]'),
  ('leading-an-ai-ready-team', 2, 'Removing the blockers', 'Access, time, permission, and fear. Diagnosing which one is actually binding.', 2.0, '["Diagnose and remove the binding blocker in your team"]'),
  ('leading-an-ai-ready-team', 3, 'Building the habit', 'A team routine that surfaces working practice and spreads it.', 2.0, '["Run a routine that spreads working practice"]'),
  ('leading-an-ai-ready-team', 4, 'Supporting the reluctant', 'Handling anxiety and job-security concerns without dismissing them.', 2.0, '["Hold a supportive conversation with a reluctant team member"]'),

  ('ai-governance-and-oversight-for-managers', 1, 'Applying the policy', 'Working real requests against your organisation''s AI policy.', 2.0, '["Apply your organisation''s AI policy to a live request"]'),
  ('ai-governance-and-oversight-for-managers', 2, 'Review and approval', 'Deciding what needs a second pair of eyes before it is used.', 2.0, '["Set a proportionate review threshold for your team"]'),
  ('ai-governance-and-oversight-for-managers', 3, 'Incidents and records', 'What to do when AI-assisted work goes wrong, and what an auditor will ask for.', 2.0, '["Handle and record an AI-related incident"]'),

  ('ai-strategy-and-oversight-for-executives', 1, 'Where the value is, and is not', 'Separating AI investments that change unit economics from those that do not.', 2.0, '["Assess an AI investment case on unit economics"]'),
  ('ai-strategy-and-oversight-for-executives', 2, 'What you are accountable for', 'Organisational accountability when AI systems are deployed, including staff literacy duties.', 1.5, '["State your organisation''s accountabilities for deployed AI"]'),
  ('ai-strategy-and-oversight-for-executives', 3, 'What to ask for in reporting', 'Specifying adoption and risk reporting that is not vanity metrics.', 1.5, '["Specify the AI reporting the board should receive"]'),

  ('ai-in-the-executive-workflow', 1, 'Your own material, not a demo', 'Participants bring real board papers and briefing notes and work them through.', 2.0, '["Work your own briefing material through an AI assistant"]'),
  ('ai-in-the-executive-workflow', 2, 'Interrogating a long document', 'Using AI to pull apart something you have been asked to approve.', 1.0, '["Interrogate a long document before approving it"]'),
  ('ai-in-the-executive-workflow', 3, 'A small, repeatable setup', 'Choosing the few tools that fit an executive workload and leaving the rest.', 1.0, '["Set up a repeatable personal AI toolset"]'),

  ('sponsoring-an-ai-literacy-programme', 1, 'Proportionate to role and risk', 'Deciding who needs what, and why a single generic course is not an answer.', 1.5, '["Scope literacy measures by role and risk"]'),
  ('sponsoring-an-ai-literacy-programme', 2, 'Commissioning against a measured gap', 'Buying training that answers an assessment rather than a sales deck.', 1.5, '["Commission training against a measured gap"]'),
  ('sponsoring-an-ai-literacy-programme', 3, 'The records to insist on', 'Attendance, assessment, credentials, and what an auditor will ask to see.', 1.0, '["Specify the records the programme must produce"]')
) AS m(slug, position, title, summary, duration_hours, outcomes)
JOIN courses c ON c.slug = m.slug
ON CONFLICT (course_id, position) DO NOTHING;
