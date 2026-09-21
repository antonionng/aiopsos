# Experrt: product audit and overhaul proposal

9 September 2026 | Product, learning experience, management and messaging

Strategic update: the [agentic learning platform strategy](/Users/ant/aiopsos/EXPERrt-agentic-learning-platform-strategy.md) supersedes this document's academy-first positioning and commercial direction. The audit findings remain relevant. The updated scope serves training providers, enterprise L&D teams and the founder's own training company.

## Recommendation

Make Experrt a learning and capability management platform for teams adopting AI and robotics. Keep facilitated training at its centre, connect it to structured practice, and give managers a reliable record of what people can demonstrate.

The organising journey should be:

**Assess → Learn → Practise → Demonstrate → Improve**

The existing application supplies substantial foundations. The overhaul should connect and refocus them, extending the learning model where needed. A wholesale technical rewrite would add migration risk without solving the core product problem.

The proposed promise is: **Build the skills to put AI and robotics to work.**

## Audit scope and confidence

Reviewed the local application source, README, public homepage content, navigation, registration, learner page, management hub, learning overview, assessment and recommendation logic, training records, certificate rules, companion tools, usage calculations and catalogue migrations. Checked two current external product references for context.

This is a product and source audit. Authenticated screens, payments, permissions and integrations were not exercised in a browser. Course seed data does not establish that those courses or trainers are currently available. The deployed homepage and local navigation differ, so release parity needs verification before implementation. Existing unrelated workspace changes were left untouched.

Recommendations below distinguish implemented foundations from proposed additions. Timings are planning hypotheses, not delivery commitments. This document does not certify security, accessibility or regulatory compliance.

## What is worth preserving

| Foundation in the source | Why it matters | Direction |
|---|---|---|
| Organisation, department and role structure | Supports workforce learning and accountable management | Keep, with explicitly scoped manager access |
| AI readiness and subject training-needs assessments | Useful starting points for relevant training | Keep as separate diagnostic instruments |
| Course catalogue, modules, categories and sector mappings | AI, technology and robotics already have curriculum foundations | Organise into outcome-based pathways |
| Cohorts, sessions, enrolments, attendance, submissions and grades | Substantial training delivery infrastructure | Extend into a coherent programme workspace |
| Certificate eligibility and verification | Provides traceable course completion | Preserve existing meaning and historical records |
| Frozen evidence packs | Records remain stable after export | Extend through versioned snapshots |
| Role-specific AI companions with record-reading tools | Support can refer to real learning information | Embed in the task the learner or manager is doing |
| Department-level usage reporting and small-group suppression | An existing basis for privacy-conscious analytics | Keep separate from individual learning evidence |

Sources: [README](/Users/ant/aiopsos/README.md), [certificate logic](/Users/ant/aiopsos/lib/certification.ts), [companions](/Users/ant/aiopsos/lib/companions.ts), [practice reporting](/Users/ant/aiopsos/lib/practice-delta.ts).

## Audit findings

Priority 0 means resolve before amplifying the product promise. Priority 1 shapes the first overhaul release. Priority 2 builds the next layer of value.

| Priority | Finding and evidence | Implication | Recommended change |
|---|---|---|---|
| 0 | Homepage presents a free platform; hub and feature-gate copy still promotes Pro upgrades. Hub gating uses role checks in places where the sidebar also checks plans. | Buyers and paying users can receive conflicting access messages. Actual deployed entitlements need testing. | Establish one entitlement definition used by pricing, navigation, page states and server checks. Preserve existing commercial commitments. |
| 0 | Hub advertises Claude, Gemini and Mistral; model router is OpenAI-only. Feature previews also name unsupported providers. | The product promises capabilities its source does not supply. | Remove unsupported-provider copy and make approved capabilities the selling point. |
| 0 | Personal time saved equals weekly requests multiplied by 0.08 hours. Adoption score rewards model variety, request volume and token use. | These are activity proxies, not measured productivity or proficiency. | Remove them from learning success claims. Keep clearly labelled activity metrics in usage reporting. |
| 0 | Recommendation page derives data sensitivity from the responsible-use assessment score. | A person's survey answers cannot establish the sensitivity of documents or processes. | Capture data classification explicitly from an authorised owner; show unknown until classified. |
| 1 | Product identity spans academy, learning agent, model routing, governance and evidence. | Visitors must assemble the value proposition themselves. | One category and one learning journey, supported by distinct learner and manager views. |
| 1 | Sidebar groups learning under Intelligence and delivery under Tools; Stack Recommendation sits alongside My Learning. | Internal feature names dominate the user's task. | Replace with task-based navigation and separate personal learning from management. |
| 1 | My Learning principally displays cohorts, sessions, attendance, grades and certificates. Its empty state waits for an organisation booking. | Learners have little structured action between sessions or before booking. | Add a next action, pathway steps, practice brief and feedback queue. |
| 1 | My Learning catches load failure by setting an empty enrolment list, and does not check HTTP success before interpreting JSON. | Failure can look like no booked training. | Distinguish loading, no enrolment, access denied and service failure; supply recovery actions. |
| 1 | Management learning overview is nested inside an organisational usage-data condition. | Learning visibility is coupled to an unrelated data dependency. | Load learning independently; put management actions above AI activity. |
| 1 | Robotics has courses and subject-needs ranking, but no dedicated equipment-scoped competency record was found in the reviewed model. | Course completion alone cannot describe readiness for a particular workplace task. | Add observed practical evidence, task/equipment scope and supervised sign-off. |
| 1 | Readiness scoring is largely self-report; subject-need ranking filters by category and role and sorts partly by duration. | Personalisation is useful but less specific than a demonstrated-skills pathway. | Explain current matching. Add prerequisites, observed gaps and user goals before stronger claims. |
| 1 | Local and public homepage contain date-relative enforcement copy referring to August as this month. | Copy ages into an inaccurate time reference. | Remove date-relative urgency; separately verify any retained legal statement against current primary guidance. |
| 2 | Homepage defines its own navigation while a shared SiteNav also exists. | The two menus can drift. | Use one public navigation source and verify deep links across layouts. |

Evidence: [homepage](/Users/ant/aiopsos/app/page.tsx), [hub](/Users/ant/aiopsos/app/dashboard/(control)/hub/page.tsx), [sidebar](/Users/ant/aiopsos/components/layout/sidebar.tsx), [feature gates](/Users/ant/aiopsos/components/feature-gate.tsx), [model router](/Users/ant/aiopsos/lib/model-router.ts), [usage calculation](/Users/ant/aiopsos/app/api/usage/personal/route.ts), [recommendation page](/Users/ant/aiopsos/app/dashboard/(control)/recommend/page.tsx), [learner page](/Users/ant/aiopsos/app/dashboard/(control)/my-learning/page.tsx), [subject matching](/Users/ant/aiopsos/lib/training-needs.ts).

## Positioning and initial customer

Keep the Experrt name. Use **AI and robotics learning for the workplace** as the plain-language category. Describe management explicitly in supporting copy.

Recommended initial customer hypothesis: employers with an L&D or operations owner who need to train groups for identifiable workplace tasks. Validate this with existing customers before narrowing the market. Begin with one office AI pathway and one operational robotics pathway where trainer access and delivery capability already exist.

The buyer needs to decide what training to fund. The learner needs to know what to do next. The facilitator needs to teach and assess. The operations manager needs to understand who has demonstrated which task, under what conditions. Each should have a clear front door.

Technology adoption remains useful supporting curriculum within those pathways. Avoid giving a broad third category equal prominence in the top-level promise.

Microsoft Viva Learning already offers structured paths, assignments and learning aggregation. Universal Robots Academy offers e-learning, instructor-led learning and simulator-based training. Those capabilities establish useful reference points, rather than a reason to recreate their breadth. Experrt's proposed differentiation is the connection between role-specific training, workplace practice, human review and management evidence. This is a strategic hypothesis, not a claim of market uniqueness. Sources: [Microsoft Viva Learning](https://www.microsoft.com/en-us/microsoft-viva/learning), [Universal Robots Academy](https://academy.universal-robots.com/).

## Product structure

Public navigation: **How it works · AI learning · Robotics learning · For teams · Pricing**. Put resources and company material in secondary navigation. Use **Plan team training** as the primary commercial action and **Explore courses** as the secondary action.

Inside the application, offer a persistent switch between **My learning** and **Manage learning** for people entitled to both. Facilitators get a delivery workspace based on their existing facilitator relationship; do not turn facilitation into an incompatible tenancy role.

| Workspace | Main destinations | Opening screen |
|---|---|---|
| Learner | Home, My pathway, Practice, Sessions, My progress | Next task, upcoming session, feedback to act on |
| Manager | Overview, People & skills, Programmes, Reports, Settings | Decisions due, gaps, participation and evidence coverage |
| Facilitator | Today, My groups, Review work, Resources | Today's sessions and outstanding reviews |
| Platform operator | Existing commercial and platform administration | Isolated operational workspace |

Keep the AI coach accessible from the current page. Make general AI work a secondary workspace if it has proven demand. Move model routing and policies into relevant management settings. Integrate assessment results and recommendations into pathway planning. Preserve old links during migration.

## The learner experience

1. **Start with a goal.** Capture role, intended task, current experience and available learning time. An invite identifies the organisation; a learner should not need to create a new organisation merely to join training.
2. **Establish a starting point.** Present readiness questions as self-report. Add short task-based checks where appropriate. Explain why a pathway was suggested.
3. **Follow a pathway.** Every step shows its outcome, prerequisites, expected time, delivery mode and completion evidence. Users see why the next step matters.
4. **Learn with a facilitator.** Retain live teaching; add preparation, accessible reference material and a short recap. Supporting self-paced material is a deliberate extension of the current live-only product policy.
5. **Practise a real task.** Supply a brief, approved sample material, success criteria, hints and a submission action. Start with forms and files using the existing submission infrastructure.
6. **Receive useful feedback.** Show what met the criteria, what needs another attempt and who reviewed it. Let learners challenge or clarify a decision.
7. **Demonstrate and revisit.** Record assessed outcomes and schedule reassessment when a role, tool or workplace process changes.

The home page should have one dominant action: Continue your next step. Below it, show upcoming teaching, feedback, and an understandable view of progress. Keep browsing available without making the learner choose from the entire catalogue every visit.

## The management experience

The management home should answer: Who needs support? What needs a decision? What can we demonstrate?

Lead with a queue of pending enrolment requests, unassigned learners, overdue reviews and expiring practical sign-offs. Each row needs an owner, reason, due date and action.

Add a people-and-skills matrix with distinct states: not assessed, self-reported, learning, demonstrated, and review due. Every demonstrated state links to the supporting artefact, reviewer and date. Missing data must remain missing, never become a zero competence score.

A programme combines an audience, outcome, pathway, groups, timetable, facilitator, budget and reporting period. Managers can assign a programme by role or department and inspect progress without juggling unrelated pages.

Reports should separate participation, assessed performance, observed workplace application and commercial usage. Keep approved access to named training records distinct from aggregate AI usage reporting. A skills matrix should not expose private chat content or imply that usage volume is a performance ranking.

## Make AI and robotics distinct learning tracks

| Track | Example pathway | Evidence |
|---|---|---|
| AI at work | Foundations → useful instructions → verify outputs → apply to a role-specific task | Reviewed work sample, verification notes and assessor feedback |
| AI workflow design | Map a process → design an assisted workflow → handle exceptions → evaluate a pilot | Workflow brief, test cases and measured pilot observations |
| Robotics awareness | Understand capabilities → identify candidate tasks → evaluate a proposal | Task suitability assessment and investment assumptions |
| Robotics operations | Prerequisites → guided practice → supervised task → workplace sign-off | Observation checklist with equipment, task, assessor and scope |
| Robotics leadership | Select a use case → plan workforce changes → define acceptance → review results | Deployment plan, training coverage and agreed acceptance criteria |

These are proposed programme structures assembled from current curriculum themes and new practice steps. Validate trainer capacity and course availability before selling them.

For robotics, store equipment or workcell context, software/setup version where relevant, task, observation date, assessor, limitations and review date. Distinguish simulated practice from observed physical practice and from employer authorisation. Course certificates retain their current meaning. A completion badge must not silently become permission to operate machinery.

Start with partner training and evidence capture. Introduce simulator integrations only after a specific curriculum requires them. Universal Robots' existing simulator-based delivery illustrates a practical option to evaluate; it does not establish an integration or partnership with Experrt.

## Innovations with a clear purpose

| Idea | User value | First useful version | Later extension |
|---|---|---|---|
| Evidence-backed skills record | Understand exactly what someone demonstrated | Link skill, submission, rubric, reviewer and date | Scoped expiry and portable, user-controlled sharing |
| Contextual AI coach | Get help with the current step | Use assigned material and the learner's authorised records; cite sources | Adapt practice using recorded difficulties |
| Workplace missions | Transfer training into work | One task brief, one artefact and human feedback | Role-specific mission library and repeat practice |
| Readiness to assign work | Help managers choose the next development action | Show unmet prerequisites and incomplete evidence | Equipment and task-specific coverage planning |
| Curriculum review triggers | Keep learning relevant as tools change | Content owner, version and review date | Approved change notices generate targeted refresher assignments |

AI may explain, suggest and draft feedback. Human assessors own grades and practical sign-offs. Any future booking or reminder action needs a visible confirmation, appropriate permission, duplicate protection and an audit record. The current companion already has useful read tools; retain that foundation.

Avoid starting with a robot fleet console, a custom simulation engine, a broad course marketplace or many new agent personas. The first release needs a complete learning loop more than additional destinations.

## Messaging overhaul

### Brand system

Brand: **Experrt**

Category: **AI and robotics learning for the workplace**

Promise: **Build the skills to put AI and robotics to work.**

Short description: **Practical training and learning management for teams adopting AI and robotics.**

Future-state description, to publish when the pathway and practice experience ships: **Experrt connects expert-led training, guided practice and clear progress records, so people know what to learn next and managers can see the skills their teams have demonstrated.**

Use concrete outcomes, direct verbs and respectful language. Replace repeated dismissals of other learning formats with positive descriptions of this experience. Avoid using AI activity, self-confidence and demonstrated skill interchangeably.

### Homepage copy that fits the current foundation

**Headline**

Build the skills to put AI and robotics to work.

**Supporting copy**

Assess your team's training needs, learn with expert facilitators, and manage sessions, results and training records in one place.

**Primary action:** Plan team training

**Secondary action:** Explore courses

**Learning section**

Practical learning for the work ahead.

Explore training in applied AI and robotics, with supporting technology skills matched to your team's roles and priorities.

**Management section**

A clearer view of your team's learning.

Bring assessments, bookings, attendance and results together, so you can plan the next training step with the record in front of you.

**AI support section**

Help finding your next step.

Ask Experrt AI about your training record, course options and what to learn next. Your facilitator guides the teaching and assessment.

**Evidence section**

Training records you can explain.

Keep a dated record of participation, results and delivery, with evidence packs you can share when needed.

**Closing action**

Start with the work your team needs to do.

Tell us your goals and who needs training. We will help you identify a practical starting point.

Button: Plan team training

### Homepage order after the overhaul

Promise and two actions → illustrated learning journey → AI and robotics pathways → learner and manager product views → one authentic example of work and feedback → AI support → records and trust → pricing → final action.

Replace the long chat demonstration as the main product proof with the actual pathway and management screens. Use real customer evidence only with permission; otherwise label examples as illustrative.

### Interface and lifecycle copy for the proposed experience

| Moment | Copy | Action |
|---|---|---|
| Learner home | Your next step is ready. | Continue learning |
| Before first assessment | Tell us what you do and what you want to learn. We will use your answers to suggest a starting point. | Find my starting point |
| Suggested pathway | Suggested because you want to check AI outputs more confidently in your role. | View pathway |
| No booking | You have no sessions booked. Explore a pathway or ask your training manager about joining a group. | Explore pathways |
| Loading failure | We could not load your learning record. Please try again. | Try again |
| Practice task | Create a first draft, check the result, and explain what you changed. | Start practice |
| Submission | Your work has been submitted. Your facilitator will review it. | View submission |
| Review released | Your feedback is ready. Review the comments before your next step. | Read feedback |
| Enrolment request | Your request has been sent to your training manager. Your place is not confirmed yet. | View request |
| Confirmed session | Your place is confirmed. Check the time, location and preparation before the session. | View session |
| AI unavailable | Your organisation's AI allowance is currently unavailable. You can still access your learning materials and records. | Continue learning |
| Manager empty state | Build your team's learning plan. Start with an assessment or assign a programme. | Create a learning plan |
| Practical review due | This task record is due for review. Check its scope and arrange reassessment. | Review record |

Use Upcoming sessions, Training groups, Learning plan and Training records in user-facing labels. Keep specialist terms where their meaning is needed, with a short explanation. Standardise the assistant name to Experrt AI, described as a learning coach.

### Claims to retire or constrain

- Unsupported provider lists and model names in learner-facing promotion.
- Productivity claims calculated from request volume.
- Statements implying the assessment measures practical competence when it records self-report.
- Automatic-action promises before their workflows exist and have been verified.
- Blanket claims about personal privacy where authorised managers can inspect named learning records. Explain the distinction between records and private AI activity.
- Relative legal deadlines and implications that a certificate itself establishes compliance.
- Unbounded permanence claims such as free forever unless the business deliberately commits to them.

## Commercial model

First reconcile the current public offer with actual access rules. The published offer currently combines free platform access, paid facilitated training and metered AI use. Avoid silently replacing it with seat subscriptions.

A proposed sales structure is: **Team training**, **Ongoing development**, and **Robotics programmes**. Each should specify audience, learning outcomes, facilitation hours, practice support, assessment, recordkeeping, AI allowance and any equipment requirements. Final pricing needs delivery cost and customer validation; no defensible new price can be inferred from the repository.

A predictable AI allowance within a paid programme may make buying easier than presenting model-level costs as the main learning offer. Test its margin first. Show cost detail to budget owners, while explaining availability simply to learners.

## Visual and interaction direction

Retain the existing visual identity and category colours where they help recognition. Shift emphasis toward readable learning material, visible progress and clear actions. Use a calm, accessible default theme, with dark mode available. Reserve strong colour for the primary action and meaningful status.

The learner home uses a large next-step card, a compact pathway, and a session/feedback area. The manager home uses a decision queue above a skills matrix. The facilitator view prioritises session preparation and review work. Marketing shows these real product experiences.

For every new screen, specify keyboard operation, focus order, clear form errors, screen-reader labels, mobile behaviour and reduced-motion behaviour. Do not use colour alone to communicate proficiency. Check readable text sizes and contrast in rendered screens; source review alone cannot establish those results.

## Implementation approach

Keep the existing application stack and training records. Add the minimum missing learning entities: skills and versions, pathways and ordered steps, assignments, practice activities, rubric versions, and skill evidence. A programme groups the existing delivery objects. Robotics evidence adds context and an explicit authorisation record where the employer needs one.

Connect submissions and grades to skill evidence through reviewed mappings. Preserve source IDs, assessor and rubric version. Keep self-report, AI suggestions, human assessment and workplace authorisation as separate record types.

Use one server-authoritative permission and entitlement layer. Managers receive only their authorised population; facilitators retain access to their assigned groups across organisations. New participant-data tables need isolation rules immediately. Keep historical evidence packs immutable and version any new payload format.

Stage the new navigation and home screens behind a release flag. Backfill course-to-skill mappings only after curriculum review. Do not reinterpret old course grades as newly demonstrated competencies. Retain legacy links and ensure rollback returns users to the previous experience without losing new records.

## Delivery sequence and release gates

| Phase | Indicative window | Deliverable | Exit condition |
|---|---|---|---|
| 1. Establish trust | Weeks 1–2 | Claims and entitlement reconciliation, navigation vocabulary, honest metrics, loading states, explicit data classification | Current offer matches tested access; contradictory copy removed |
| 2. Complete one learning loop | Weeks 3–6 | Learner home, one AI pathway, practice submission, feedback, basic manager assignment view | A pilot learner completes the whole journey and a manager can inspect its evidence |
| 3. Run a robotics pilot | Weeks 7–10 | One partner-supported pathway, practical observation form, scoped sign-off and facilitator review queue | Assessor can distinguish preparation, simulation, physical observation and authorisation |
| 4. Improve and expand | Weeks 11–12 and onward | Reassessment, report improvements, content review ownership and pilot fixes | Customer feedback and observed outcomes justify expanding the catalogue |

Assumes a small product/design/engineering team with available facilitators. Integration procurement, hardware access and customer scheduling can materially change the sequence. A solo build should reduce scope rather than promise the same timetable.

Release verification must cover learner, manager, facilitator and administrator journeys; wrong-organisation access; entitlement states; failed loads; absent grades; resubmission; duplicate actions; accessibility; and preservation of existing certificates and frozen packs. Payment regression checks are required if the access or allowance model changes.

## Success measures and validation

Primary proposed measure: the proportion of assigned learners who complete a reviewed practical task within the programme period. Show the numerator, denominator, programme and rubric version.

Supporting measures: time to first useful learning action, assessment-to-assignment conversion, practice completion, review turnaround, reassessment outcome on comparable tasks, manager planning time and programme margin. For robotics, report evidence coverage and reviews due within the relevant task and equipment scope.

For any productivity claim, record a comparable baseline, task complexity, quality criteria and sample size. Treat before/after observations as observations unless the evaluation supports a causal claim.

Before expanding, test the proposed learner and manager screens with existing customers. Ask them to identify the next action, explain a learner's current status, assign training, find evidence and distinguish a course certificate from practical authorisation. Set quantitative targets after collecting a baseline; do not invent improvement percentages.

The first build should be one complete pathway with clear management and evidence. That gives Experrt a concrete demonstration of the future product and a basis for deciding what deserves investment next.
