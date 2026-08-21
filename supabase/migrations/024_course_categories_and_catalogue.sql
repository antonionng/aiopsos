-- ============================================================
-- 024: Course categories, and a catalogue across all three
--
-- The academy teaches applied AI, technology adoption and applied
-- robotics. `category` is the browse axis for that, deliberately
-- separate from `target_dimensions`: those say which assessment gap
-- a course closes, this says what the course is about.
--
-- Content note: this seeds a working catalogue so the site reflects
-- the positioning. It is a starting point for the training team to
-- edit, not fixed curriculum.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'ai';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'courses_category_check'
  ) THEN
    ALTER TABLE courses ADD CONSTRAINT courses_category_check
      CHECK (category IN ('ai', 'technology', 'robotics'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- Everything seeded by 020 is an AI course; the default already covers it,
-- but be explicit so a re-run cannot drift.
UPDATE courses SET category = 'ai'
WHERE category IS NULL OR category = '';

-- ── Technology adoption ──────────────────────────────────────

INSERT INTO courses (slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'getting-value-from-tools-you-already-own',
    'Getting Value From the Tools You Already Own',
    'Most organisations have more unused capability sitting inside licences they already pay for than in anything they are about to buy. This is a working audit of what you have, what it can do, and what to switch on first.',
    'practitioner', 'technology', 4.0, '{in_person,virtual}',
    '["Inventory the capability inside the licences your organisation already holds","Identify the three features that would save your team the most time this month","Turn one of them on and use it on real work during the session","Make the case for a licence you should drop"]',
    '{individual_contributor,team_lead,manager}',
    '{tools}',
    'published'
  ),
  (
    'automating-the-work-nobody-wants',
    'Automating the Work Nobody Wants',
    'The recurring, manual, low-judgement tasks that quietly consume a working week. Participants map one, automate it during the session, and leave with it running.',
    'practitioner', 'technology', 6.0, '{in_person,virtual,blended}',
    '["Identify which of your recurring tasks are worth automating and which are not","Build a working automation for one of them during the session","Test it against the awkward cases rather than only the happy path","Hand it over so it does not become something only you can fix"]',
    '{individual_contributor,team_lead}',
    '{tools,practice}',
    'published'
  ),
  (
    'data-you-can-actually-use',
    'Data You Can Actually Use',
    'Why the report is wrong, and what to do about it. Covers the unglamorous work that decides whether anything downstream - dashboards, automation, AI - can be trusted.',
    'practitioner', 'technology', 6.0, '{in_person,virtual}',
    '["Diagnose why two reports of the same thing disagree","Clean and structure a real dataset your team depends on","Set up a source of truth people will actually use","Recognise when a spreadsheet has outgrown itself"]',
    '{individual_contributor,team_lead}',
    '{tools,practice}',
    'published'
  ),
  (
    'choosing-technology-well',
    'Choosing Technology Well',
    'For the manager who has to pick between three vendors and live with the answer. Covers evaluation against your own requirements rather than the vendor''s demo script.',
    'manager', 'technology', 5.0, '{in_person,virtual}',
    '["Write requirements that describe your problem rather than a product","Run a structured evaluation that survives contact with a sales team","Ask the questions a demo is designed to avoid","Plan the exit before you sign the entry"]',
    '{manager,director}',
    '{tools,responsible}',
    'published'
  ),
  (
    'running-a-rollout-that-sticks',
    'Running a Rollout That Sticks',
    'Most technology failures are adoption failures. This is about the twelve weeks after go-live: who champions it, what you measure, and how to tell early that it is not landing.',
    'manager', 'technology', 7.0, '{in_person,virtual,blended}',
    '["Plan a rollout around the people who have to change how they work","Identify and support the group that will decide whether it sticks","Measure adoption rather than deployment","Recognise a failing rollout in week three instead of month six"]',
    '{team_lead,manager,director}',
    '{culture,practice}',
    'published'
  ),
  (
    'technology-for-non-technical-leaders',
    'Technology for Non-Technical Leaders',
    'Enough understanding to ask good questions and not be sold to. For directors and executives who sign off technology decisions without a technical background.',
    'leadership', 'technology', 4.0, '{in_person,virtual}',
    '["Ask the four questions that expose a weak technology proposal","Read a technical recommendation for the assumptions it is hiding","Judge build-versus-buy without needing to be an engineer","Set the reporting that tells you whether an investment is working"]',
    '{director,executive}',
    '{confidence,tools}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Applied robotics ─────────────────────────────────────────

INSERT INTO courses (slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'robotics-what-it-can-and-cannot-do',
    'Robotics: What It Can and Cannot Do',
    'A grounded introduction for people whose work is about to involve a robot. Separates what the technology genuinely does well from what the trade press implies, using real deployments and real failure modes.',
    'practitioner', 'robotics', 4.0, '{in_person,virtual}',
    '["Describe in plain terms what a robot is good at and where it struggles","Recognise the tasks in your own operation that suit automation","Identify the hidden costs that make a promising case uneconomic","Ask a vendor a question their demo does not answer"]',
    '{individual_contributor,team_lead,manager}',
    '{confidence,tools}',
    'published'
  ),
  (
    'working-alongside-a-cobot',
    'Working Alongside a Cobot',
    'Collaborative robots share a workspace with people, which makes them an operational and behavioural question rather than only a technical one. Hands-on with the daily reality: starting it, guiding it, stopping it, and knowing when not to.',
    'practitioner', 'robotics', 7.0, '{in_person,blended}',
    '["Start, guide and safely stop a collaborative robot","Set up a simple repeatable task and verify it runs correctly","Recognise the conditions where a cobot should not be used","Escalate a fault rather than improvising a fix"]',
    '{individual_contributor,team_lead}',
    '{confidence,practice}',
    'published'
  ),
  (
    'running-and-troubleshooting-a-robotic-cell',
    'Running and Troubleshooting a Robotic Cell',
    'For the people who own the cell on a shift. Covers the routine - changeovers, first-off checks, common faults - and the judgement of when to fix, when to stop, and when to call someone.',
    'practitioner', 'robotics', 7.0, '{in_person,blended}',
    '["Run a changeover and verify the first piece before committing a batch","Diagnose the faults that account for most unplanned downtime","Decide correctly between recovering, stopping and escalating","Keep a maintenance record that is useful to the next shift"]',
    '{individual_contributor,team_lead}',
    '{practice,tools}',
    'published'
  ),
  (
    'warehouse-and-logistics-automation-in-practice',
    'Warehouse and Logistics Automation in Practice',
    'Automated storage, mobile robots and conveyor systems as they actually behave in a working site: at peak, with awkward stock, and when one unit goes down mid-shift.',
    'practitioner', 'robotics', 6.0, '{in_person,virtual}',
    '["Explain how the automation on your site routes work and where it queues","Handle the exceptions that automation reliably creates","Keep throughput when a unit is out of service","Spot the process change that would help more than more hardware"]',
    '{individual_contributor,team_lead,manager}',
    '{practice,tools}',
    'published'
  ),
  (
    'specifying-a-robotics-deployment',
    'Specifying a Robotics Deployment',
    'The document that decides whether a deployment succeeds is written before anyone quotes for it. Covers requirements, integrator selection, acceptance testing, and the clauses people wish they had insisted on.',
    'manager', 'robotics', 7.0, '{in_person,virtual}',
    '["Write a specification in terms of your process rather than a product","Evaluate integrators on the questions they ask you","Define acceptance criteria you can actually test on the day","Plan for the throughput you have at peak, not on average"]',
    '{manager,director}',
    '{tools,responsible}',
    'published'
  ),
  (
    'safety-risk-and-compliance-for-robotic-workcells',
    'Safety, Risk and Compliance for Robotic Workcells',
    'The duties that sit with whoever runs the cell: risk assessment, guarding and interlocks, safe systems of work, and the records an inspector will ask to see. Delivered against your own site.',
    'manager', 'robotics', 6.0, '{in_person}',
    '["Carry out a risk assessment for a workcell on your own site","Explain what guarding, interlocks and stop categories are protecting against","Write a safe system of work people will follow rather than sign","Keep the records that evidence your controls"]',
    '{team_lead,manager,director}',
    '{responsible,culture}',
    'published'
  ),
  (
    'robotics-investment-and-operating-model',
    'Robotics Investment and the Operating Model',
    'A half-day for the people signing the cheque. Where the payback actually comes from, what it costs to run once the integrator leaves, and who in your organisation owns it on a Tuesday.',
    'leadership', 'robotics', 4.0, '{in_person,virtual}',
    '["Build a business case that survives the second year","Account for the running costs that rarely appear in a proposal","Decide who owns the asset, the skills and the downtime","Set the reporting that tells you whether it is earning its keep"]',
    '{director,executive}',
    '{culture,responsible}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Modules ──────────────────────────────────────────────────

INSERT INTO course_modules (course_id, position, title, summary, duration_hours, outcomes)
SELECT c.id, m.position, m.title, m.summary, m.duration_hours, m.outcomes::jsonb
FROM (VALUES
  ('getting-value-from-tools-you-already-own', 1, 'What you are already paying for', 'A licence-by-licence walk through what the organisation holds and what each one can actually do.', 1.5, '["Inventory the capability inside your existing licences"]'),
  ('getting-value-from-tools-you-already-own', 2, 'The three worth switching on', 'Picking the features with the shortest path to saved time, and turning one on during the session.', 1.5, '["Enable and use one high-value feature on real work"]'),
  ('getting-value-from-tools-you-already-own', 3, 'What to drop', 'Making the case to stop paying for something nobody uses.', 1.0, '["Build the case to retire an unused licence"]'),

  ('automating-the-work-nobody-wants', 1, 'Finding the right task', 'Which recurring work repays automation, and which is better fixed by deleting the process.', 1.5, '["Judge whether a task is worth automating"]'),
  ('automating-the-work-nobody-wants', 2, 'Building it', 'Facilitated build of a working automation on the participant''s own task.', 3.0, '["Build a working automation end to end"]'),
  ('automating-the-work-nobody-wants', 3, 'Awkward cases and handover', 'Testing against the exceptions, and documenting it so it is not yours forever.', 1.5, '["Test the exceptions and hand the automation over"]'),

  ('data-you-can-actually-use', 1, 'Why the numbers disagree', 'Tracing two conflicting reports back to their sources.', 1.5, '["Diagnose a disagreement between two reports"]'),
  ('data-you-can-actually-use', 2, 'Cleaning and structuring', 'Hands-on with a real dataset the participants depend on.', 3.0, '["Clean and structure a real working dataset"]'),
  ('data-you-can-actually-use', 3, 'A source of truth', 'Agreeing where the number lives and who owns it.', 1.5, '["Establish a source of truth people will use"]'),

  ('choosing-technology-well', 1, 'Requirements, not products', 'Writing down the problem before looking at any vendor.', 1.5, '["Write requirements describing your problem"]'),
  ('choosing-technology-well', 2, 'Running the evaluation', 'Scoring against your own criteria and controlling the demo.', 2.0, '["Run a structured vendor evaluation"]'),
  ('choosing-technology-well', 3, 'Contract and exit', 'Data portability, renewal terms, and the clauses that matter later.', 1.5, '["Plan the exit before signing"]'),

  ('running-a-rollout-that-sticks', 1, 'Who has to change', 'Mapping the rollout onto the people whose work actually changes.', 2.0, '["Map a rollout onto the people it affects"]'),
  ('running-a-rollout-that-sticks', 2, 'Champions and blockers', 'Finding the group that decides adoption, and what they need.', 2.0, '["Identify and equip the group that decides adoption"]'),
  ('running-a-rollout-that-sticks', 3, 'Measuring adoption', 'Metrics that show use rather than deployment.', 1.5, '["Measure adoption rather than deployment"]'),
  ('running-a-rollout-that-sticks', 4, 'Reading the early signals', 'Spotting a failing rollout while it can still be fixed.', 1.5, '["Diagnose a struggling rollout early"]'),

  ('technology-for-non-technical-leaders', 1, 'Four questions', 'The questions that expose a weak proposal regardless of the technology.', 1.5, '["Ask the questions that expose a weak proposal"]'),
  ('technology-for-non-technical-leaders', 2, 'Reading a recommendation', 'Finding the assumptions underneath a technical case.', 1.5, '["Surface the assumptions in a technical recommendation"]'),
  ('technology-for-non-technical-leaders', 3, 'What to ask for in reporting', 'Specifying the small number of numbers worth seeing.', 1.0, '["Specify reporting that shows whether it is working"]'),

  ('robotics-what-it-can-and-cannot-do', 1, 'What a robot is good at', 'Capability and its limits, using real deployments rather than promotional video.', 1.5, '["Describe realistic robot capability and limits"]'),
  ('robotics-what-it-can-and-cannot-do', 2, 'Finding candidate tasks', 'Which parts of your own operation actually suit automation.', 1.5, '["Identify suitable tasks in your own operation"]'),
  ('robotics-what-it-can-and-cannot-do', 3, 'The costs nobody quotes', 'Integration, changeover, maintenance and the ongoing skills bill.', 1.0, '["Account for the costs a proposal omits"]'),

  ('working-alongside-a-cobot', 1, 'Start, guide, stop', 'Hands-on with the basic operating cycle and the stop conditions.', 2.5, '["Operate a collaborative robot safely"]'),
  ('working-alongside-a-cobot', 2, 'Setting a repeatable task', 'Teaching a simple task and verifying it runs correctly.', 3.0, '["Set up and verify a repeatable task"]'),
  ('working-alongside-a-cobot', 3, 'When not to use it', 'The conditions where a cobot is the wrong answer, and escalation.', 1.5, '["Recognise when a cobot should not be used"]'),

  ('running-and-troubleshooting-a-robotic-cell', 1, 'The routine', 'Start-up, changeover and first-off verification.', 2.5, '["Run a changeover and verify the first piece"]'),
  ('running-and-troubleshooting-a-robotic-cell', 2, 'Common faults', 'The small number of causes behind most unplanned downtime.', 3.0, '["Diagnose the most common causes of downtime"]'),
  ('running-and-troubleshooting-a-robotic-cell', 3, 'Fix, stop, or escalate', 'Judgement under production pressure, and the handover record.', 1.5, '["Decide correctly between fixing, stopping and escalating"]'),

  ('warehouse-and-logistics-automation-in-practice', 1, 'How work flows', 'Routing, queuing and where the bottleneck really is.', 2.0, '["Explain how automation routes and queues work"]'),
  ('warehouse-and-logistics-automation-in-practice', 2, 'Exceptions', 'The awkward stock and odd orders automation creates work from.', 2.0, '["Handle the exceptions automation creates"]'),
  ('warehouse-and-logistics-automation-in-practice', 3, 'Degraded running', 'Keeping throughput when a unit is down mid-shift.', 2.0, '["Maintain throughput with a unit out of service"]'),

  ('specifying-a-robotics-deployment', 1, 'Specifying the process', 'Describing what must happen rather than what to buy.', 2.5, '["Write a process-led specification"]'),
  ('specifying-a-robotics-deployment', 2, 'Choosing an integrator', 'Judging a partner by the questions they ask you.', 2.0, '["Evaluate an integrator properly"]'),
  ('specifying-a-robotics-deployment', 3, 'Acceptance', 'Criteria you can test on the day, at peak rather than average.', 2.5, '["Define testable acceptance criteria"]'),

  ('safety-risk-and-compliance-for-robotic-workcells', 1, 'Risk assessment', 'Carrying one out on a real cell on the participants'' own site.', 2.5, '["Complete a workcell risk assessment"]'),
  ('safety-risk-and-compliance-for-robotic-workcells', 2, 'Guarding and stop categories', 'What the physical and control measures are actually protecting against.', 2.0, '["Explain guarding, interlocks and stop categories"]'),
  ('safety-risk-and-compliance-for-robotic-workcells', 3, 'Records', 'A safe system of work people follow, and evidence of your controls.', 1.5, '["Produce records that evidence your controls"]'),

  ('robotics-investment-and-operating-model', 1, 'Where payback comes from', 'Separating a case that works from one that works only in year one.', 1.5, '["Build a business case that survives year two"]'),
  ('robotics-investment-and-operating-model', 2, 'The running cost', 'Maintenance, spares, downtime and the skills you now need.', 1.5, '["Account for the true running cost"]'),
  ('robotics-investment-and-operating-model', 3, 'Who owns it', 'Assigning the asset, the skills and the downtime to someone real.', 1.0, '["Assign ownership of asset, skills and downtime"]')
) AS m(slug, position, title, summary, duration_hours, outcomes)
JOIN courses c ON c.slug = m.slug
ON CONFLICT (course_id, position) DO NOTHING;
