-- ============================================================
-- 033: Catalogue expansion
--
-- Two things, both content:
--   1. Deepen the 23 existing courses: one further module each
--      (two for the tooling clinic, which was thin), one added
--      learning outcome, and durations updated to match the new
--      module sums.
--   2. Eleven new courses with full module plans, filling the
--      gaps in the catalogue: applied AI for specific kinds of
--      work (writing, customer-facing, analysis, assistants),
--      the manager layer of AI adoption (champions, measurement),
--      technology adoption (security habits, spreadsheet exit,
--      leadership change portfolio), and robotics (workforce
--      preparation, vision systems).
--
-- Content note: as with 020 and 024, this is a starting point for
-- the training team to edit, not fixed curriculum.
--
-- Idempotent - safe to run multiple times. Module appends use
-- ON CONFLICT DO NOTHING; outcome appends are guarded with @>;
-- duration updates set the same value on re-run.
-- ============================================================

-- ── 1a. Durations: each existing course grows by its new module ──

UPDATE courses SET duration_hours = v.hours::numeric, updated_at = now()
FROM (VALUES
  ('ai-foundations-for-every-role',                    '7.0'),
  ('prompting-and-output-verification',                '8.0'),
  ('embedding-ai-in-daily-workflows',                  '7.0'),
  ('ai-tooling-and-integration-clinic',                '6.0'),
  ('responsible-ai-use-at-work',                       '6.0'),
  ('leading-an-ai-ready-team',                         '10.0'),
  ('ai-governance-and-oversight-for-managers',         '7.0'),
  ('ai-strategy-and-oversight-for-executives',         '6.0'),
  ('ai-in-the-executive-workflow',                     '5.0'),
  ('sponsoring-an-ai-literacy-programme',              '5.0'),
  ('getting-value-from-tools-you-already-own',         '5.0'),
  ('automating-the-work-nobody-wants',                 '7.0'),
  ('data-you-can-actually-use',                        '7.0'),
  ('choosing-technology-well',                         '6.0'),
  ('running-a-rollout-that-sticks',                    '8.0'),
  ('technology-for-non-technical-leaders',             '5.0'),
  ('robotics-what-it-can-and-cannot-do',               '5.0'),
  ('working-alongside-a-cobot',                        '8.0'),
  ('running-and-troubleshooting-a-robotic-cell',       '8.0'),
  ('warehouse-and-logistics-automation-in-practice',   '7.0'),
  ('specifying-a-robotics-deployment',                 '8.0'),
  ('safety-risk-and-compliance-for-robotic-workcells', '7.0'),
  ('robotics-investment-and-operating-model',          '5.0')
) AS v(slug, hours)
WHERE courses.slug = v.slug
  AND courses.duration_hours IS DISTINCT FROM v.hours::numeric;

-- ── 1b. One further learning outcome per existing course ─────

UPDATE courses
SET learning_outcomes = learning_outcomes || v.extra::jsonb,
    updated_at = now()
FROM (VALUES
  ('ai-foundations-for-every-role',                    '["Plan your first week of unsupervised use before leaving the room"]'),
  ('prompting-and-output-verification',                '["Start a shared prompt library your team will actually reuse"]'),
  ('embedding-ai-in-daily-workflows',                  '["Keep the new workflow running after the novelty wears off"]'),
  ('ai-tooling-and-integration-clinic',                '["Leave with a prioritised access-gap list your IT team can action"]'),
  ('responsible-ai-use-at-work',                       '["Make the ambiguous calls with confidence rather than guesswork"]'),
  ('leading-an-ai-ready-team',                         '["Leave with a written 90-day plan for your own team"]'),
  ('ai-governance-and-oversight-for-managers',         '["Keep a register of team AI use that stands up to audit"]'),
  ('ai-strategy-and-oversight-for-executives',         '["Interrogate the next AI proposal that reaches the board"]'),
  ('ai-in-the-executive-workflow',                     '["Know exactly what senior material can and cannot enter a tool"]'),
  ('sponsoring-an-ai-literacy-programme',              '["Tell a working programme from one performing for the audit"]'),
  ('getting-value-from-tools-you-already-own',         '["Keep the licence estate honest with a quarterly review"]'),
  ('automating-the-work-nobody-wants',                 '["Keep an automation running when its author is on holiday"]'),
  ('data-you-can-actually-use',                        '["Stop the same data mess reforming in six months"]'),
  ('choosing-technology-well',                         '["Get the truth out of a vendor-supplied reference"]'),
  ('running-a-rollout-that-sticks',                    '["Turn each rollout into a better next one"]'),
  ('technology-for-non-technical-leaders',             '["Take a real proposal apart in the room, not just in theory"]'),
  ('robotics-what-it-can-and-cannot-do',               '["Learn from a deployment that failed as well as one that worked"]'),
  ('working-alongside-a-cobot',                        '["Run the daily checks that keep the cell safe to start"]'),
  ('running-and-troubleshooting-a-robotic-cell',       '["Hand a live issue to the next shift without losing its history"]'),
  ('warehouse-and-logistics-automation-in-practice',   '["Go into peak prepared rather than hopeful"]'),
  ('specifying-a-robotics-deployment',                 '["Sign a contract that still protects you in year two"]'),
  ('safety-risk-and-compliance-for-robotic-workcells', '["Know which changes to a cell reopen the risk assessment"]'),
  ('robotics-investment-and-operating-model',          '["Test a real investment case before someone signs it"]')
) AS v(slug, extra)
WHERE courses.slug = v.slug
  AND NOT courses.learning_outcomes @> v.extra::jsonb;

-- ── 1c. Appended modules for the existing courses ────────────

INSERT INTO course_modules (course_id, position, title, summary, duration_hours, outcomes)
SELECT c.id, m.position, m.title, m.summary, m.duration_hours, m.outcomes::jsonb
FROM (VALUES
  ('ai-foundations-for-every-role', 4, 'Your first week after the course', 'Each participant leaves with three named tasks for the following week and a simple way to check how they went.', 1.0, '["Leave with a concrete plan for your first unsupported week"]'),

  ('prompting-and-output-verification', 4, 'Building your prompt library', 'Turning the session''s best prompts into a shared, documented library the team can reuse.', 1.0, '["Contribute a documented prompt to a shared team library"]'),

  ('embedding-ai-in-daily-workflows', 4, 'Keeping the workflow alive', 'What makes rebuilt workflows quietly revert, and the small review habit that stops it.', 1.0, '["Set a review habit that stops the workflow reverting"]'),

  ('ai-tooling-and-integration-clinic', 3, 'Choosing by task, not habit', 'Matching task types to the tools in your stack, instead of defaulting to whichever one is open.', 1.0, '["Match a task to the right tool in your stack"]'),
  ('ai-tooling-and-integration-clinic', 4, 'Closing the access gaps', 'Turning the gaps found in the session into specific, routed requests that IT can actually action.', 1.0, '["Escalate a tooling gap as an actionable request"]'),

  ('responsible-ai-use-at-work', 4, 'The judgement calls, practised', 'A scenario clinic: ambiguous cases drawn from the organisation''s own work, argued to a decision in small groups.', 2.0, '["Argue an ambiguous case to a defensible decision"]'),

  ('leading-an-ai-ready-team', 5, 'Your 90-day team plan', 'Each manager leaves with a written plan for the next quarter: expectations, routines, and the first blocker to remove.', 2.0, '["Write a 90-day adoption plan for your own team"]'),

  ('ai-governance-and-oversight-for-managers', 4, 'The team AI register', 'Setting up a lightweight register of what the team uses AI for, that survives contact with a busy month.', 1.0, '["Set up a use register the team will maintain"]'),

  ('ai-strategy-and-oversight-for-executives', 4, 'The questions for your next board pack', 'Turning the session into the specific questions each executive will ask of the next AI proposal that reaches them.', 1.0, '["Leave with the questions to ask of the next AI proposal"]'),

  ('ai-in-the-executive-workflow', 4, 'Confidential material and senior use', 'What may and may not go into a tool at executive level, where the stakes of a leak are highest.', 1.0, '["Handle confidential material correctly in AI tools"]'),

  ('sponsoring-an-ai-literacy-programme', 4, 'Judging the programme a year on', 'The signs that a literacy programme is working, fading, or performing for the audit rather than the staff.', 1.0, '["Judge whether a running programme is actually working"]'),

  ('getting-value-from-tools-you-already-own', 4, 'A rolling review', 'A quarterly half-hour routine that keeps the licence estate honest without becoming a project.', 1.0, '["Set up a quarterly licence review that takes half an hour"]'),

  ('automating-the-work-nobody-wants', 4, 'When the automation breaks', 'Failure modes, monitoring that fits on a sticky note, and fixing it without its author in the room.', 1.0, '["Diagnose and restart a failed automation"]'),

  ('data-you-can-actually-use', 4, 'Keeping it clean', 'Why clean data decays, and the ownership and checks that stop the same mess reforming.', 1.0, '["Put checks in place that keep the dataset clean"]'),

  ('choosing-technology-well', 4, 'Reference calls that tell you something', 'Getting past the vendor-supplied happy customer: who to ask for, and the questions that surface the real experience.', 1.0, '["Run a reference call that surfaces the real experience"]'),

  ('running-a-rollout-that-sticks', 5, 'The rollout retrospective', 'Closing the loop: what the last rollout taught, captured while it can still shape the next one.', 1.0, '["Run a retrospective that improves the next rollout"]'),

  ('technology-for-non-technical-leaders', 4, 'A live proposal, taken apart', 'The group works a real, anonymised technology proposal through the course''s questions, end to end.', 1.0, '["Apply the full toolkit to a real proposal"]'),

  ('robotics-what-it-can-and-cannot-do', 4, 'Deployments up close', 'Walkthroughs of real deployments - one that paid back and one that did not - and what separated them.', 1.0, '["Explain what separated a successful deployment from a failed one"]'),

  ('working-alongside-a-cobot', 4, 'The daily checks', 'The start-of-shift routine: what to look at, what to log, and what means the cell does not start today.', 1.0, '["Run a start-of-shift check and act on what it finds"]'),

  ('running-and-troubleshooting-a-robotic-cell', 4, 'The shift handover', 'Handing a cell over mid-issue: the record and the conversation that stop the next shift starting from zero.', 1.0, '["Hand over a cell so the next shift keeps its history"]'),

  ('warehouse-and-logistics-automation-in-practice', 4, 'Peak, and what it breaks', 'What peak volume does to routing, queues and people, and how to prepare the site rather than survive it.', 1.0, '["Prepare the site for peak rather than surviving it"]'),

  ('specifying-a-robotics-deployment', 4, 'The contract clauses that matter later', 'Support, spares, response times and software escrow: the clauses whose absence is only discovered in year two.', 1.0, '["Insist on the clauses whose absence hurts in year two"]'),

  ('safety-risk-and-compliance-for-robotic-workcells', 4, 'When something changes', 'Management of change: the new gripper, the faster cycle, the moved fence - and which changes reopen the risk assessment.', 1.0, '["Recognise which changes reopen the risk assessment"]'),

  ('robotics-investment-and-operating-model', 4, 'The decision, rehearsed', 'The group works a live or recent investment case through the course''s tests and takes a position on it.', 1.0, '["Apply the course''s tests to a real investment case"]')
) AS m(slug, position, title, summary, duration_hours, outcomes)
JOIN courses c ON c.slug = m.slug
ON CONFLICT (course_id, position) DO NOTHING;

-- ── 2a. New AI courses ───────────────────────────────────────

INSERT INTO courses (slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'writing-and-communicating-with-ai',
    'Writing and Communicating With AI',
    'For people whose work is mostly words: emails, reports, proposals, minutes. Getting a first draft in seconds is easy; this is about editing it into something that sounds like you and stands up to a careful reader.',
    'practitioner', 'ai', 4.0, '{in_person,virtual}',
    '["Get a usable first draft of any routine document in minutes","Edit AI-drafted text into your own voice rather than shipping it raw","Summarise a long document without losing the point that matters","Spot the confident error before your reader does"]',
    '{individual_contributor,team_lead}',
    '{practice,confidence}',
    'published'
  ),
  (
    'ai-for-customer-facing-teams',
    'AI for Customer-Facing Teams',
    'For service, sales and support teams using AI with a customer on the other end. Faster replies and better preparation, with clear lines on what a customer must never get from a machine unchecked.',
    'practitioner', 'ai', 6.0, '{in_person,virtual,blended}',
    '["Prepare for a customer conversation in a fraction of the current time","Draft replies that are faster without becoming generic","Decide which messages must not leave without a human rewrite","Handle customer data lawfully when AI tools are in the loop"]',
    '{individual_contributor,team_lead,manager}',
    '{practice,responsible}',
    'published'
  ),
  (
    'ai-for-analysis-and-reporting',
    'AI for Analysis and Reporting',
    'Using AI to interrogate data and draft the report, without outsourcing the judgement. Built for the people who produce the numbers others rely on: analysts, finance, operations reporting.',
    'practitioner', 'ai', 6.0, '{in_person,virtual}',
    '["Use AI to explore a dataset and pressure-test your own reading of it","Check an AI-produced number back to source before it travels","Draft the narrative around the numbers in half the time","Know which analytical steps must stay in your hands"]',
    '{individual_contributor,team_lead}',
    '{tools,practice}',
    'published'
  ),
  (
    'building-ai-assistants-for-your-team',
    'Building AI Assistants for Your Team',
    'Beyond chat: building a named assistant that knows your team''s documents, follows your team''s rules, and does one job well. Participants build a working assistant on their own material during the course.',
    'practitioner', 'ai', 7.0, '{in_person,virtual,blended}',
    '["Scope a job that is narrow enough for an assistant to do well","Build a working assistant grounded in your team''s own documents","Write instructions that keep the assistant inside its remit","Test it against awkward cases and hand it to a colleague"]',
    '{individual_contributor,team_lead,manager}',
    '{tools,practice}',
    'published'
  ),
  (
    'running-an-ai-champions-network',
    'Running an AI Champions Network',
    'Champions programmes fail politely: volunteers are named, nothing changes. This is for the manager who owns the network - choosing the right people, giving them time and permission, and keeping it alive after month two.',
    'manager', 'ai', 5.0, '{in_person,virtual}',
    '["Choose champions for influence and appetite rather than job title","Give champions a remit their managers will actually honour","Run the routine that moves working practice between teams","Spot a stalling network early and restart it"]',
    '{team_lead,manager,director}',
    '{culture,practice}',
    'published'
  ),
  (
    'measuring-ai-adoption-and-value',
    'Measuring AI Adoption and Value',
    'Licence counts and login stats say nothing about whether work has changed. This course builds a measurement approach you can defend: a baseline, a small set of honest metrics, and a report your leadership will trust.',
    'manager', 'ai', 5.0, '{in_person,virtual}',
    '["Set a baseline before the next initiative rather than after it","Choose the few metrics that show changed work, not just logins","Separate time saved from value captured, and report both honestly","Present adoption to leadership without vanity numbers"]',
    '{manager,director}',
    '{culture,tools}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── 2b. New technology adoption courses ──────────────────────

INSERT INTO courses (slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'everyday-security-for-busy-teams',
    'Everyday Security for Busy Teams',
    'The security habits that survive a busy week, updated for a world where the phishing email is written by a machine and sounds exactly like your supplier. No fear, no jargon - just what to do and when.',
    'practitioner', 'technology', 4.0, '{in_person,virtual}',
    '["Spot the current generation of phishing, including AI-written and voice-cloned approaches","Handle passwords, passkeys and MFA without friction taking over","Move data in ways that do not create quiet exposure","Report a mistake fast, and know why reporting beats hiding"]',
    '{individual_contributor,team_lead,manager}',
    '{responsible,confidence}',
    'published'
  ),
  (
    'from-spreadsheets-to-systems',
    'From Spreadsheets to Systems',
    'Somewhere in your team a spreadsheet has quietly become the system: everyone depends on it, one person understands it, nothing backs it up. This course is about recognising that moment and moving on from it deliberately.',
    'practitioner', 'technology', 5.0, '{in_person,virtual}',
    '["Recognise when a spreadsheet has crossed from tool to system","Choose the smallest real system that replaces it","Move the data and the process without breaking the team that runs it","Retire the spreadsheet so it cannot quietly come back"]',
    '{individual_contributor,team_lead,manager}',
    '{tools,practice}',
    'published'
  ),
  (
    'digital-change-without-the-theatre',
    'Digital Change Without the Theatre',
    'A half-day for the executive team that owns a change portfolio. Fewer initiatives, honest sequencing, and permission to stop things - the unglamorous decisions that decide whether digital investment lands.',
    'leadership', 'technology', 4.0, '{in_person,virtual}',
    '["Cut a change portfolio to the number of things the organisation can absorb","Sequence initiatives around the teams that have to live them","Stop a failing programme early and take the credit for it","Recognise adoption debt before it becomes the next crisis"]',
    '{director,executive}',
    '{culture,confidence}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── 2c. New robotics courses ─────────────────────────────────

INSERT INTO courses (slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status)
VALUES
  (
    'preparing-your-team-for-automation',
    'Preparing Your Team for Automation',
    'The robot is the easy part. This course is for the managers whose people will work differently once it arrives: what to say and when, which roles change and how, and the skills plan that makes the change fair.',
    'manager', 'robotics', 5.0, '{in_person,virtual}',
    '["Tell your team what is changing before rumour does it for you","Map which roles change, which grow and which genuinely go","Build a skills path for the people the automation displaces","Keep experienced people whose knowledge the automated line still needs"]',
    '{team_lead,manager,director}',
    '{culture,confidence}',
    'published'
  ),
  (
    'vision-systems-and-automated-inspection',
    'Vision Systems and Automated Inspection',
    'Cameras that inspect every part sound simple until lighting drifts, false rejects pile up, and nobody trusts the reject bin. Hands-on with how inspection systems actually behave and how to keep them honest.',
    'practitioner', 'robotics', 5.0, '{in_person,blended}',
    '["Explain what a vision system checks and what it cannot see","Diagnose false rejects and false passes to their usual causes","Keep lighting, fixturing and calibration inside working limits","Decide when to retune the system and when to fix the process"]',
    '{individual_contributor,team_lead}',
    '{tools,practice}',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── 2d. Modules for the new courses ──────────────────────────

INSERT INTO course_modules (course_id, position, title, summary, duration_hours, outcomes)
SELECT c.id, m.position, m.title, m.summary, m.duration_hours, m.outcomes::jsonb
FROM (VALUES
  ('writing-and-communicating-with-ai', 1, 'Drafting without surrendering', 'First drafts and structure: getting the machine to do the typing while the thinking stays yours.', 1.0, '["Produce a structured first draft with AI assistance"]'),
  ('writing-and-communicating-with-ai', 2, 'Editing what it gives you', 'Voice, accuracy and cutting the filler, practised on the participants'' own documents.', 1.5, '["Edit an AI draft into your own voice"]'),
  ('writing-and-communicating-with-ai', 3, 'Summarising and briefing', 'Turning a long document into a short, faithful brief - and knowing what got lost on the way.', 1.0, '["Brief a colleague accurately from a long document"]'),
  ('writing-and-communicating-with-ai', 4, 'The reader''s test', 'The final check routine before anything AI-assisted leaves your outbox.', 0.5, '["Apply a final check before an AI-assisted document leaves you"]'),

  ('ai-for-customer-facing-teams', 1, 'Preparation in minutes', 'Account research, call preparation and history summaries, run on real accounts.', 1.5, '["Prepare for a customer conversation with AI assistance"]'),
  ('ai-for-customer-facing-teams', 2, 'Replies that still sound human', 'Drafting responses on real, anonymised tickets and threads without drifting into boilerplate.', 2.0, '["Draft a faster reply that keeps its human voice"]'),
  ('ai-for-customer-facing-teams', 3, 'The lines you do not cross', 'Customer data, promises, complaints and regulated statements: what never leaves unchecked.', 1.5, '["Identify the messages that require a human rewrite"]'),
  ('ai-for-customer-facing-teams', 4, 'Making it stick on a busy desk', 'Templates, shared prompts and the team routine that keeps quality up when volume spikes.', 1.0, '["Set up the shared assets that make the practice stick"]'),

  ('ai-for-analysis-and-reporting', 1, 'Asking better questions of data', 'Exploring a dataset with an assistant, and using it to challenge your own first reading.', 2.0, '["Use AI to pressure-test a reading of the data"]'),
  ('ai-for-analysis-and-reporting', 2, 'Verification before circulation', 'Tracing an AI-produced figure back to source, because the number will be quoted long after the caveat is forgotten.', 1.5, '["Verify an AI-produced figure back to source"]'),
  ('ai-for-analysis-and-reporting', 3, 'From numbers to narrative', 'Drafting the commentary around the numbers without letting the tool decide what they mean.', 1.5, '["Draft report commentary that you still stand behind"]'),
  ('ai-for-analysis-and-reporting', 4, 'What stays manual', 'The analytical steps that must not be delegated, and how to say so in your team''s process.', 1.0, '["Name the steps that stay in the analyst''s hands"]'),

  ('building-ai-assistants-for-your-team', 1, 'One job, done well', 'Scoping: the difference between an assistant that answers one question reliably and one that answers everything badly.', 1.5, '["Scope an assistant to a job it can do well"]'),
  ('building-ai-assistants-for-your-team', 2, 'Grounding it in your material', 'Connecting the assistant to the team''s real documents and testing what it does with them.', 2.0, '["Ground an assistant in your team''s own documents"]'),
  ('building-ai-assistants-for-your-team', 3, 'Rules it must follow', 'Writing instructions that hold: tone, boundaries, what to refuse, and when to hand back to a person.', 1.5, '["Write instructions that keep the assistant inside its remit"]'),
  ('building-ai-assistants-for-your-team', 4, 'Testing and handover', 'Awkward cases, edge inputs, and handing the assistant to a colleague who did not build it.', 2.0, '["Test an assistant against awkward cases and hand it over"]'),

  ('running-an-ai-champions-network', 1, 'Choosing the right people', 'Influence and appetite over job title: who actually moves practice in your organisation.', 1.0, '["Choose champions who will actually be followed"]'),
  ('running-an-ai-champions-network', 2, 'Remit, time and permission', 'What a champion is for, and the agreement with their manager that stops the role evaporating.', 1.5, '["Set a champion remit their manager will honour"]'),
  ('running-an-ai-champions-network', 3, 'The routine that spreads practice', 'A regular, lightweight forum that moves what works in one team into the next.', 1.5, '["Run a routine that moves practice between teams"]'),
  ('running-an-ai-champions-network', 4, 'Keeping it alive', 'The month-two slump: recognising it, and the restarts that work better than exhortation.', 1.0, '["Restart a stalling network"]'),

  ('measuring-ai-adoption-and-value', 1, 'What a baseline looks like', 'Measuring the work as it is now, before the next initiative makes the comparison impossible.', 1.5, '["Capture a defensible baseline"]'),
  ('measuring-ai-adoption-and-value', 2, 'Metrics that mean something', 'A small set of measures that show changed work, chosen against the vanity alternatives.', 1.5, '["Choose metrics that show changed work"]'),
  ('measuring-ai-adoption-and-value', 3, 'Time saved is not value captured', 'What happens to a saved hour, and how to report the difference honestly.', 1.0, '["Report time saved and value captured as different things"]'),
  ('measuring-ai-adoption-and-value', 4, 'Reporting up', 'The one-page adoption report a board will trust, built from the session''s own numbers.', 1.0, '["Build the adoption report your leadership will trust"]'),

  ('everyday-security-for-busy-teams', 1, 'The attacks as they look now', 'Current phishing, including AI-written mail and cloned voices, worked through real examples.', 1.5, '["Recognise current phishing including AI-assisted approaches"]'),
  ('everyday-security-for-busy-teams', 2, 'Locks that do not slow you down', 'Passwords, passkeys and MFA set up so that the secure path is also the convenient one.', 1.0, '["Set up authentication that is secure and fast"]'),
  ('everyday-security-for-busy-teams', 3, 'Data in motion', 'Sharing, sending and storing without creating the quiet exposures that surface a year later.', 1.0, '["Move data without creating quiet exposure"]'),
  ('everyday-security-for-busy-teams', 4, 'When something goes wrong', 'Reporting fast and without blame, because the cover-up always costs more than the click.', 0.5, '["Report a security mistake promptly"]'),

  ('from-spreadsheets-to-systems', 1, 'The spreadsheet audit', 'Finding the spreadsheets that have become systems, and being honest about which ones are load-bearing.', 1.5, '["Identify the load-bearing spreadsheets in your team"]'),
  ('from-spreadsheets-to-systems', 2, 'Choosing the replacement', 'The smallest real system that does the job, chosen against requirements rather than habit.', 1.5, '["Choose the smallest system that replaces it"]'),
  ('from-spreadsheets-to-systems', 3, 'The migration', 'Moving the data and the process while the work keeps running, with the team rather than to them.', 1.5, '["Plan a migration that does not break the team"]'),
  ('from-spreadsheets-to-systems', 4, 'Retiring it for good', 'Read-only, archived, and a named owner for the new thing - so the old file cannot quietly return.', 0.5, '["Retire a spreadsheet so it cannot come back"]'),

  ('digital-change-without-the-theatre', 1, 'How much change fits', 'The organisation''s real absorption capacity, and cutting the portfolio to match it.', 1.0, '["Size a change portfolio to what the organisation can absorb"]'),
  ('digital-change-without-the-theatre', 2, 'Sequencing and dependency', 'Ordering initiatives around the teams that have to live them, not the vendors delivering them.', 1.0, '["Sequence a portfolio around the affected teams"]'),
  ('digital-change-without-the-theatre', 3, 'Stopping things', 'The mechanics and politics of stopping a programme early, and why it should earn credit rather than blame.', 1.0, '["Stop a failing programme early and well"]'),
  ('digital-change-without-the-theatre', 4, 'Adoption debt', 'The gap between what was deployed and what is used, and reading it before it compounds.', 1.0, '["Recognise and account for adoption debt"]'),

  ('preparing-your-team-for-automation', 1, 'Saying it early and straight', 'The announcement conversation: what to say, when, and the vacuum that rumour fills if you wait.', 1.5, '["Communicate an automation change before rumour does"]'),
  ('preparing-your-team-for-automation', 2, 'Mapping the roles', 'Working through which roles change, which grow, and which genuinely go - honestly, on paper.', 1.5, '["Map role changes honestly across the team"]'),
  ('preparing-your-team-for-automation', 3, 'The skills path', 'A concrete route for the people whose current tasks the automation takes.', 1.0, '["Build a skills path for displaced tasks"]'),
  ('preparing-your-team-for-automation', 4, 'Keeping the knowledge', 'The experienced hands the automated line still depends on, and what keeps them.', 1.0, '["Retain the knowledge the automated line still needs"]'),

  ('vision-systems-and-automated-inspection', 1, 'What the camera actually sees', 'How inspection systems make a pass/fail decision, and the defects they are structurally blind to.', 1.5, '["Explain what a vision system can and cannot see"]'),
  ('vision-systems-and-automated-inspection', 2, 'False rejects and false passes', 'The usual causes - lighting, fixturing, product variation - traced on real reject data.', 1.5, '["Diagnose false rejects to their usual causes"]'),
  ('vision-systems-and-automated-inspection', 3, 'Keeping it in calibration', 'The drift that accumulates between audits, and the checks that catch it early.', 1.0, '["Keep a vision system inside working limits"]'),
  ('vision-systems-and-automated-inspection', 4, 'Retune or fix the process', 'When the system is wrong and when the process is - and why retuning to hide a process fault costs more later.', 1.0, '["Decide between retuning the system and fixing the process"]')
) AS m(slug, position, title, summary, duration_hours, outcomes)
JOIN courses c ON c.slug = m.slug
ON CONFLICT (course_id, position) DO NOTHING;
