# Experrt: scalable delivery of the EMFT graduate programme

Source: EMFT_Graduate_Programme_Antonio_Giugno (1).pptx, 24 slides, supplied 16 September 2026. This document maps the proposal to the inspected application. It does not imply that all proposed capabilities exist or are deployed.

## Product decision

Make a programme the persistent workspace. Configure the EMFT graduate programme as a versioned programme template. Reuse the same delivery and assessment services for other providers, clients, cohorts, schedules, roles and subjects.

Provider organisation -> client engagement -> programme template/version -> delivery cohort -> teaching groups and project teams -> scheduled activities -> evidence attempts -> assessed competencies -> recommendation -> client placement decision.

A teaching group determines timetable, trainer and track. A project team determines who shares a submission. These are separate memberships. People may attend both track-specific and shared sessions. A new cohort must not require copying code, editing SQL or recreating every lab manually.

## Requirements and current coverage

| Proposal requirement | Current inspected implementation | Reusable addition |
| --- | --- | --- |
| Target roles, seats and business-approved competency profiles (slides 2–3, 11, 15) | Programme brief, free-text target roles, activity rubrics and client approval | Structured role profiles, seat demand, required competency levels, mappings from each lab to skills and roles, profile approval and versioning |
| Selection, pre-assessment, interviews, accepted cohort and day-one baseline (slide 4) | Assigned learners and entry diagnostic | Candidate pipeline separate from enrolled learners, assessors, interview evidence, offer/acceptance and conversion to cohort |
| Two programme models and fallback (slides 5–6, 23) | Fixed baseline/core/pathway A/pathway B/capstone stages and individual routing | Configurable stages, teaching-group rules, cohort model choice and jointly approved changes with an audit record |
| 60 teaching days in three blocks across 14 calendar weeks, reset weeks and three showcases (slides 7–9) | Dated sessions, attendance and a simplified 12-week demo schedule | Calendar-aware programme runs with breaks, holidays, time zones, teaching-day templates, reset tasks, shared and parallel group sessions |
| Daily recap, teaching, individual lab, team challenge, review and reflection (slide 13) | Lessons, practice/observation activities, file submission and attendance | A single Today view assembling the scheduled activities, individual/team work and reflection; recurring daily templates |
| Individual lab upload, feedback and evidence (slides 13, 15–16) | Attempt-bound private uploads, published rubric scores, revision checks and learner feedback | Private AI draft review implemented in current work; next add persisted human drafts, assessor assignment, moderation and review turnaround |
| Team capstone plus individual questioning (slide 14) | Individual submissions and independent panel reviews | Teams of 3–4, membership snapshot per attempt, shared artefacts, contribution evidence, individual oral assessment and individual outcomes |
| Weighted capstone (slide 14) | Equal-weight criterion scores from 0–4 | Configurable criterion weights: technical 25%, business value 25%, risk/controls 20%, communication 15%, individual questioning 15% |
| Weighted role recommendation (slide 16 chart) | Entry/final skill comparison and readiness decision | Separate evidence weighting: foundation labs 35%, track split review 10%, track labs 30%, capstone 25%; configurable and bank-approved |
| Baseline measures progress but does not count toward recommendation (slide 16) | Baseline treated as diagnostic for progression; demo shows numeric entry/final comparison | Explicit diagnostic-only classification and exclusion from aggregate recommendation calculations |
| Joint track split and bank placement decision (slides 15–16, 21) | Trainer routing and provider readiness approval | Distinct decisions, named decision owners/delegates and joint review: trainer recommends, EMFT reviews, bank function head confirms placement |
| Team competitions and block recognition (slides 13, 17) | Visual milestones earned from reviewed work | Separate team challenge points and approved showcase recognition. Competition points must not feed competency scores or placement decisions |
| Signals followed by action (slide 18) | Pending/returned flags and manually recorded support decisions | Due dates, intervention rules, assigned case owner, same-day check-in task, coaching plan, due time, acknowledgement and resolution evidence |
| Weekly cohort report and function handover (slides 19, 21) | Current cohort view, printable/CSV outcomes, baseline/final comparisons | Scheduled report snapshots, cohort and function filters, progress trends, review backlog, interventions, named-role recommendation and editable 90-day plan |
| Observation, session feedback and between-block revisions (slide 15) | Attendance, discussion and released immutable plans | Delivery observation rubric, learner session feedback, approved version changes between blocks without rewriting prior assessments |
| Eight-week mobilisation (slide 22) | Programme setup and client/provider release approvals | Reusable mobilisation checklist, responsibilities, due dates, dataset validation, candidate intake and environment readiness gates |

The proposal's two sets of weights are different. Capstone criterion weights determine the capstone result. Evidence-category weights determine the recommendation. Neither is the diagnostic baseline. The proposed weights require final bank agreement before release.

## Unified experience

Learner navigation remains Learn, Schedule and Progress. Learn opens today's work or the last unfinished activity. The activity contains the brief, dataset, lab link, rubric, upload and submission receipt. The learner sees submitted, under review, feedback published and any required revision. Progress shows assessed competencies, useful milestones and the target role; it does not equate opening a lesson with demonstrating competence.

Trainer navigation remains Overview, Learners, Sessions and Outcomes. Overview surfaces today's teaching, review backlog and interventions. A learner or submission opens in the same workspace. Evidence, private AI insights and editable assessment stay together. Detailed findings remain collapsed until needed.

EMFT sees programme setup, staffing, cohort quality and client reporting. Bank function heads see their agreed profiles, relevant cohorts, review tasks and placement decisions. A specialist guest sees only assigned sessions or reviews. Permission scopes must eventually include client, cohort, track/function and assigned review, rather than broad access to every learner in the programme.

## Private AI review

Implemented workflow in the current change:

1. The learner submits an answer and attached evidence. Files bind to the immutable submission attempt.
2. The transaction queues a private review for that progress revision and released plan revision.
3. A background worker reads supported text/code or notebook cell source and generates rubric suggestions, evidence gaps, questions and draft feedback.
4. The trainer can apply suggestions into an editable form, choose the decision and explicitly publish after reviewing the evidence.
5. The learner receives the human-approved scores and feedback. Raw AI analysis stays private to the provider assessment team.

The original AI draft and final human assessment remain distinct. Concurrent workers cannot claim the same active job. Stale submission revisions cannot receive a new published assessment. AI failure leaves manual assessment available.

Current boundaries: static text review only, no code execution or authorship verification. Unsupported binary documents and unreadable/truncated evidence are flagged for human inspection. Per-job input/output limits, a provider daily cap, existing AI credit metering and a recovery job bound cost and retry behaviour. This is not a high-volume queue capacity claim.

Before a real bank rollout, agree the evidence processing policy, approved model/data-processing environment, retention and access arrangements. Synthetic evidence is used in this demonstration. Do not promise jurisdictional compliance or data residency from the current implementation alone.

## Scaling the application

Keep the present application and database foundation. Separate responsibilities through clear services and records before considering additional infrastructure.

- Templates and immutable versions: role profiles, curriculum, datasets, rubrics, weightings, completion rules and report definitions belong to reusable templates. Dates, trainers, groups and learners belong to a delivery cohort.
- Explicit records: introduce programme runs, teaching groups, teams, competency profiles, activity-to-competency mappings, submissions, assessments, intervention cases and placement decisions. Avoid growing an opaque programme JSON object to contain the entire operating model.
- Smaller reads: the current workspace RPC returns every learner's progress, history, files and reviews. Replace this with summary metrics, a paginated learner/review queue and one selected learner/submission detail request. Load session registers by session. Query and index by tenant, cohort, status and due date.
- Narrower locking: current delivery commands take a programme-wide transaction lock, including workspace reads. Retain conflict protection for approvals and evidence mutations, but remove read locks where safe and scope write locks to the affected record. Verify concurrent submission and assessor behaviour before changing locks.
- Durable background work: separate submission from AI analysis, report generation and notifications. Use leases, idempotency, bounded retries, dead-letter visibility and per-provider fairness. The current recovery batch of three jobs every five minutes is a fallback, not the target throughput for many cohorts.
- Evidence storage: keep private files in object storage and metadata in the database. Add file scanning/quarantine, richer extraction and versioned retention rules before broad document ingestion. Use short-lived scoped downloads. Record which extracted evidence each AI draft actually used.
- Reporting: derive reporting records from submission, assessment, attendance and decision events. Keep time-stamped weekly snapshots so historical reports remain reproducible after later resubmissions.
- Delivery operations: give reviewers explicit ownership and due dates. Track backlog age, marking turnaround and moderation consistency. More learners increase trainer workload as well as system load.
- Performance validation: define agreed active-cohort and concurrent-user targets, then test burst submissions, uploads, parallel reviews, report generation and tenant isolation. Do not label the platform enterprise-scale based on a 20-person demonstration.

Proposed capacity test, subject to commercial targets: 10 simultaneous cohorts of 20 graduates. At one individual lab per teaching day, this is 12,000 submissions over 60 teaching days, before resubmissions or team work. This is a test scenario, not measured capacity or a contracted service level.

## Delivery order and acceptance

1. Foundation: template/version, role profile, configurable stage and cohort/group model. Prove that a second client and cohort can be created through configuration with isolated data and their own calendar.
2. Daily delivery: Today view, dated labs, team challenges, reflections and private review workflow. Prove upload through published feedback with a resubmission, failed AI job and reassigned trainer.
3. Assessment validity: weighted rubrics, individual/team capstone, bank/EMFT review and diagnostic exclusion. Prove weights, evidence traceability, stale-revision rejection and separate individual outcomes on one shared project.
4. Programme operations: interventions, report snapshots, placement decision and 90-day handover. Prove each signal creates an owned task and reports distinguish submission, assessment, readiness and actual placement.
5. Scale and rollout: paginated reads, fair background processing, scoped access and load tests against agreed targets. Release to a pilot only after an end-to-end rehearsal with EMFT and the bank.

The next structural implementation should be the reusable programme template, cohort/group and role competency model. Adding more EMFT-specific navigation or treating the present 16-activity demo as the final curriculum would compound the fragmentation the user wants to remove.

## Build update following the L&D self-service requirement

The current change now includes `/dashboard/programmes/new`: a guided L&D builder for outcomes, target-role descriptions, learning blocks, lessons and practical activities, resource content, stage mapping, weighted rubric criteria, panel requirements and delivery preview. Draft templates persist per organisation with revision conflict checks. A manager can create separate programme deliveries from one saved template. Creation snapshots the design, remaps activity identifiers, creates private learning content versions and an unreleased assessment plan in one database transaction. It does not auto-approve the plan, enrol people or send messages.

Verified with synthetic accounts: manager-only access, cross-organisation denial, save/resume, conflicting edit rejection, idempotent programme creation and two isolated deliveries from one template. Programme-level recommendation weighting, structured competency matching, native team submissions, automated interventions, group scheduling and placement/90-day handover remain further work. Current weighted activity criteria do not implement those separate capabilities.
