# Experrt enterprise LMS completion plan

9 September 2026. Working implementation contract, based on the current repository and verified local flows. This is a delivery plan, not a claim that the platform is enterprise-ready today.

## Product outcome

A training provider or enterprise can independently set up its workspace, invite the right people, create a mixed-format programme, sell or fund delivery, run training, review evidence, issue credentials and measure results. Learners have one clear place to act. Agents complete authorised work through the same recorded operations used by people.

Experrt's training company is the first provider customer. Platform administration remains separate from operating its academy. Marketing leads with the platform; academy and consulting demonstrate and support its use.

## Current baseline and honest gaps

Working foundations include versioned native courses, programmes, assignments, formative quizzes, written practical submissions, trainer reviews, attempt history, client connections, contextual AI, persistent agent proposals, approval controls, live cohorts, attendance, grades, certificates, branded HTML material downloads and programme/cohort walls. Existing billing includes wallets, usage, invoice views and checkout/webhook routes. Route existence does not establish that all billing lifecycle cases are verified.

The main gaps are the separate native course and academy/live-delivery models, single-organisation identity, incomplete role granularity, agent recovery after server restart, limited assessment types, fragmented analytics and incomplete end-to-end commercial acceptance testing. Social walls have no attachments, reactions or moderation yet and load only the latest 100 posts. Downloads are HTML with print-to-PDF, not generated PDF/PPTX/ZIP packs. No SSO/SCIM implementation was identified in the focused route audit.

## One product map

- Home: priorities and next actions for the active role and organisation.
- Learning: course library, programmes and live delivery with consistent navigation.
- People: teams, learners, trainers and explicitly connected client organisations.
- Records: progress, evidence, credentials and permission-scoped analytics.
- Settings: branding, roles, integrations, billing and organisation policies.
- Ask Experrt: persistent contextual agent; Activity: work in progress, approvals and exceptions.

Within a learner's programme: Overview, Learn, Sessions, Materials, Training wall and Results. A tab appears only when useful. Cohort and programme navigation must retain identity, progress and a clear return path. Studio is the authoring workspace, not another learner destination.

## Roles and company contexts

| Context / role | Owns | Must not receive automatically |
| --- | --- | --- |
| Platform operator | Service health, plans, authorised support, abuse handling | Every tenant's private conversations or learner evidence |
| Provider owner | Provider staff, catalogue, customers, delivery and revenue | Unrelated client rosters or employer content |
| Enterprise L&D owner | Workforce structure, budgets, policies and programmes | Provider intellectual property outside purchased scope |
| Client L&D manager | Allocations, own employees and results | Other client organisations in a shared delivery |
| Team manager | Named teams, approvals and team progress | Whole-company employee records |
| Author / subject expert | Assigned drafts and review comments | Billing or unrestricted learner data |
| Trainer / assessor | Assigned sessions and evidence review | Unassigned cohorts or private client administration |
| Learner / external delegate | Own learning, group collaboration, own results | Answer keys, private grades of peers, financial administration |
| Finance administrator | Orders, invoices, refunds, contracts and usage | Learner submissions unless separately authorised |

An organisation can both provide training and train its own staff. Use capabilities and memberships, not mutually exclusive company types. A provider-client connection is a commercial relationship, not unrestricted inherited access. Subsidiaries and departments require explicit scoped grants. Switching organisation changes context; it must not rewrite a person's primary membership as the long-term design.

## Delivery order and acceptance gates

### 1. Stable identity and coherent interface

Finish the shared identity bootstrap, role-specific loading states and persistent navigation. Replace the flat organisation dropdown with searchable memberships, a visible active context and recent workspaces. Introduce organisation memberships and scoped roles while preserving current profiles through a staged migration. Add invitation acceptance, expiry, resend, revocation, deactivation and ownership transfer. Support one person as learner in one client and trainer for another without duplicate identities.

Apply common page headers, spacing, filters, action priorities, forms, validation, empty states and keyboard focus to Home, Courses, Programmes, People, Records, Billing and Settings. Verify narrow mobile, tablet and desktop, light/dark themes, zoom and reduced motion. Accessibility target: WCAG 2.2 AA, validated rather than merely labelled.

Gate: repeated menu opens do not refetch identity or change role/navigation; browser history and direct links work; every role lands in the correct workspace; switching context never shows previous tenant data. An ordinary provider administrator can run the demo without super-admin rights.

### 2. Connect the full learning journey

Keep immutable course versions as the instructional source. Add an explicit mapping from academy catalogue entries to authored versions. A programme delivery links versions, audience, optional cohorts, sessions, due dates and completion rules. A shared delivery identifier connects assignments, cohort membership, material packs, activity submissions, discussions, attendance, certificates and reporting. Migrate through additive links and audited backfills; do not silently merge historical grades or rewrite published content.

Provide a guided flow: define outcome → choose or create content → choose self-paced/live/blended → select client/team → schedule → review learner experience → publish/assign. Show readiness checks for missing trainer, material, assessment, capacity, location and joining link. Handle timezone/DST, recurring sessions, cancellation, rescheduling, waitlists and trainer conflicts.

Gate: one learner follows a blended programme from invitation through lessons, workshop, lab, feedback and certificate with no duplicate enrolment. Trainer and employer see the same reconciled progress, scoped appropriately. Existing standalone cohorts keep working.

### 3. Complete authoring, materials and assessment

The AI creator produces an editable learning design: objectives, prerequisites, activities, source-backed explanations, worked examples, realistic datasets, learner worksheets, trainer guide, rubric, assessment and accessible material variants. Store generated artifacts with course version, source attribution, generation status and review history. Branding comes from Settings with explicit delivery/client overrides when allowed.

Add secure uploads and downloadable PDF/ZIP packs; then slides and supported external content formats based on customer need. Include captions/transcripts and accessible documents. Assessment needs question banks, randomisation, attempts, pass rules, rubrics, numeric grades where appropriate, accommodations, due dates, resubmission, moderation and appeals. Equipment operation remains subject to qualified observation and local authorisation.

Gate: generated content is substantive and reviewed, not empty templates; learner exports exclude answer keys; downloads are permission-checked; a learner can submit a file, receive rubric feedback, revise and see the retained history. Trainer-only guides are inaccessible to learners.

### 4. Collaboration and engagement

Unify the wall around the actual delivery membership. Add threaded pagination, reactions, attachments with scanning, announcements, pinning, edit history, moderation, reporting and explicit audience labels for mixed-client groups. Build an in-app notification inbox, preferences and digest policies. Calendar/email/Teams integrations require configured senders and consent-aware notification rules; no silent external messages from agents.

Gate: one client's private channel cannot be reached from another client; trainers can moderate assigned groups; removed learners lose access; cancelled/archived delivery follows a documented retention policy. No lost posts on retry or misleading empty states on failure.

### 5. Reliable agent operations

Use durable queued jobs with leases, heartbeats, retry/backoff, cancellation and dead-letter recovery. Persist the brief, plan, tool calls, evidence, outputs, approvals and usage against one task. All tools use the same authorisation and validation layer as manual operations. Scope source retrieval by actor, tenant and current delivery. Treat uploaded content as untrusted input.

Define permission tiers: read and analyse; create reversible drafts; propose changes; execute explicitly approved assignments/publication; financial and external communications require their own authority. Approval binds to an exact proposal revision, audience, estimated cost and expiry. Revalidate permissions at execution. Provide progress and recovery controls, cost reservation/reconciliation and refunds for failed billable operations where policy requires.

Gate: restart mid-task, duplicate events, timeouts, stale approvals, changed membership and exhausted credits never cause duplicate assignments, charges or publication. Evaluation cases cover factual grounding, task success, forbidden actions and clear limitations. Agent statements agree with stored state.

### 6. Analytics that lead to action

Define shared events and metric contracts before charts: invited, activated, assigned, started, attended, submitted, passed, completed, certified, expired, refunded and agent task outcomes. Record event time and processing time; reconcile projections against source records. Filters cover client, department, cohort, course version, date and delivery format.

Learners see next actions and their own achievement. Managers see coverage, overdue work and practical readiness. Providers see delivery utilisation, completion, client health and revenue. Enterprises see skills coverage, budget and programme effectiveness. Finance sees invoiced/collected/refunded amounts separately. Agent operators see success, review acceptance, latency, failure and cost. Avoid claiming causal ROI from completion alone.

Gate: each metric has a definition and drill-through, exports match screens, timezone boundaries are tested, missing data is explicit and cross-tenant aggregates respect permissions. Dashboards do not fabricate activity to look populated.

### 7. Monetisation and billing

Separate Experrt platform subscription/AI usage from a provider's sale of training to its clients. Decide payer ownership explicitly: provider pays platform; client can fund a delivery; a learner may purchase an eligible course. A platform fee does not imply Experrt collects and settles provider revenue.

Unify plan entitlements, active-seat rules, included usage, credit reservations, spend limits, trials, upgrades/downgrades, renewal, cancellation, grace periods and reactivation. Add purchase orders and invoice terms where required. Specify currency/tax ownership, invoice numbering, credits, refunds, partial cancellations and disputes. Any marketplace settlement requires a separately designed connected-payment-account flow and onboarding; do not infer it from existing checkout.

Gate: sandbox tests cover duplicate/out-of-order webhooks, failed payment, refund, cancellation, exhausted credits, seat changes and invoice reconciliation. Amounts reconcile to the ledger, unauthorised roles cannot change plans, and cancellation preserves required learning records. Pricing amounts and contracts remain commercial decisions, not hardcoded guesses.

### 8. Enterprise operations and integrations

Deliver SSO, provisioning/deprovisioning, team imports, public API/webhooks, integration secrets, audit export, retention/deletion workflows, data export, backup restoration, incident handling, rate limits, upload scanning, monitoring and environment separation. Establish supported content/interoperability standards explicitly; SCORM, xAPI and LTI need actual adapters and acceptance tests before marketing claims.

Define tenant support access as time-limited, scoped and audited. Assess data residency and contractual requirements with the relevant specialists. Set measurable service objectives, test representative volumes and document recovery procedures. Validate retention requirements before destructive cleanup.

Gate: restore an isolated backup; remove a user and verify revoked access; replay an integration safely; complete a security review and realistic load test; reconcile audit records for admin and agent changes.

## Release acceptance: complete stories, not isolated screens

1. Provider sets branding, adds author and trainer, connects two clients and publishes a programme.
2. Client accepts the relationship, assigns its own employees and sees only its own results.
3. Learner signs in on mobile, downloads branded materials, attends, posts, submits, revises and earns an eligible certificate.
4. Trainer runs the register, reviews evidence, moderates discussion and handles an absence/resit.
5. Enterprise runs an internal programme and a provider-delivered programme through the same learner experience.
6. Finance administrator upgrades the plan, buys usage, handles a failed payment and reconciles a refund in a sandbox.
7. Agent drafts a complete course, survives interruption and executes only the reviewed action once.
8. Departing user is deactivated, content ownership transferred and required records retained.
9. Wrong-tenant URLs, stale sessions and role changes consistently deny access without leaking content.
10. Every metric and export reconciles to source records; no fake completions, grades or revenue.

A milestone is done only when its story passes in the UI, API and permission tests with ordinary customer roles, responsive/accessibility checks, monitoring and recovery behaviour. Maintain a release evidence matrix with pass/fail, known limitations and accountable owner. Do not call the entire system enterprise-ready because the happy path works.

## Demo and cleanup

Primary tenant: Acme Test, formerly ZZ Single Email Test (delete me), ID 982cdf8b-361d-4e88-851e-0805b13158ce. Preserve its 7 authored courses, 4 programmes, 5 live cohorts and learning records. Preserve Sample · Northstar Services and Sample · Harbour Robotics because they demonstrate provider/client isolation and delivery. Re-seeding must reuse the manifest and never reset edits.

Other organisation names alone do not prove disposability. Before deletion, produce an exact ID manifest with users, assessments, learning records, content, uploads, wallet/ledger and invoice impact; distinguish auth-account deletion from tenant deletion; preserve an export and confirm the target list. No other tenants were deleted in this pass.

## Immediate next implementation

After the interface and demo cleanup, implement the explicit programme-to-cohort link and a single learner delivery view. That provides the shared identity needed for materials, walls, progress, agent actions and analytics. In parallel planning terms, define membership and billing contracts now so that this bridge does not bake in the current single-organisation limitation. Implement one release gate at a time and update this plan from actual verification.

## Implementation update: first connected-delivery increment

Approved cleanup is complete: six preserved organisations remain. Added a provider-owned programme-to-cohort link, explicit enrolment of assigned learners with a seat check, a learner Live sessions view and a permitted return link from cohort to course activities/materials. Mutations preserve existing enrolments and record delivery events. Repeated linking/enrolment creates no duplicates. Wrong actor, capacity, learner privilege and relinking checks passed transactionally with fixtures rolled back.

This is the first connection, not the whole blended-learning milestone. Completion/credential rules and the two discussion stores still remain separate; enrolment does not synchronise automatically after later programme assignment changes. Existing withdrawn enrolments are not silently reactivated. Linking is provider-managed and does not rewrite catalogue descriptions or authored course versions. Durable agents, integrated billing and the remaining release gates are still outstanding.

## Implementation update: combined progress reporting

Programme People & progress now combines course activity counts, practical review counts and linked live-group attendance, grades and certificate state. Learner My results includes only that person's live records, including when the learner also has manager privileges. Reports distinguish missing grades, incomplete registers, upcoming sessions, withdrawal, revocation and readiness for trainer review. Readiness does not issue a certificate or change stored completion.

The API reuses the authorised programme boundary, scopes client managers to their organisation, and paginates source reads in bounded batches. Eight progress-state tests passed. Isolated authenticated API tests verified provider/client reports, separate learner records, missing grades, attendance and answer-key exclusion; the unrelated-tenant denial returned 403 on a follow-up after a transient authentication failure. All synthetic verification accounts and records were removed. Browser checks confirmed the manager report's real sample counts. The production build passed before the final explicit personal-view scope refinement; final verification is tracked in the turn result.

## Implementation update: actionable programme journey

Added a shared, read-only journey interpretation across coursework and linked live groups. It distinguishes learner work, revision, trainer review, missing enrolment, live attendance/grade actions and certificate review. Passing thresholds does not issue a credential. All linked live groups must have recorded certificates before the combined journey reports completion; revoked credentials and withdrawn or cancelled groups remain actionable.

Learners see a compact next-action card in Learn & practise, with navigation to learning, sessions or results. Managers see the same state with the learner's record. Coursework-only completion labels now say so explicitly. Shared workspace identity has a recoverable error and retry state instead of silently loading indefinitely.

Sixteen state tests pass. Existing provider/client/learner API fixtures are used to check the new derived status, without changing enrolment or grading permissions. This increment does not implement multi-organisation memberships, automatic enrolment synchronisation, a new credential policy or durable agent scheduling. Those remain separate acceptance gates.

Journey verification outcome: ordinary provider and employer administrators saw both authorised learners; each learner saw only their own assignment; an unrelated administrator received 403; answer keys were absent. A learner with completed coursework and passing live records remained in certificate_review until issuance. Temporary fixtures were removed. Browser verification confirmed the compact next-action card and its Continue learning navigation. The public staged API required sign-in. Progress-state changes now refresh the card after submission as well as after a pass.

## Membership foundation increment, 9 September 2026

Applied the additive organisation membership schema and legacy synchronisation triggers. Verified 43 active records against 43 proven existing relationships with no extra grants. Added a session-scoped, read-only workspace membership API; switching remains explicitly disabled until legacy authorisation is converted. The database suite covers role separation, row isolation, denied mutations, same-session revocation, ownership, sync and audit history. The authenticated provider/client/learner delivery regression passed, including grading and records; the new endpoint passed learner/provider role and private-cache checks. Synthetic acceptance data was removed after testing.

The full multi-organisation migration is still incomplete: LMS and delivery RPCs, direct profile-scoped reads, billing and deferred agent execution must adopt explicit validated workspace context before memberships can control application access. See workspace-membership-migration.md and workspace-permission-inventory.md. No new membership-management or owner-transfer UI has been enabled.

## LMS context and agent authority increment, 9 September 2026

Core learning commands now receive an explicit organisation ID and revalidate current membership in the database. Old command entry points are guarded too. Suspended or revoked memberships cannot issue core learning commands, claim queued agent work or save agent proposals. The task owner's authority is checked atomically when leases and proposals are persisted; the runner checks the executing manager before work and between model steps.

Verification: transactional database denial tests passed; authenticated provider/client/learner delivery and record regression passed; a previously authenticated synthetic provider session received HTTP 403 immediately after revocation; TypeScript and targeted lint passed. No model generation was required for these permission tests. Test data was cleaned up. Multi-workspace switching remains disabled pending the remaining cohort, billing and direct-read migrations.

## Cohort and billing migration, 10 September 2026

User approved the exact 13-table/two-function scope. Migration applied; live provider/client/learner/trainer and billing access tests passed, including revoked-session denial. Test records were removed. Server release is verified locally with its rollout flag enabled. Production source upload was separately blocked by automatic approval review, requiring explicit permission for the app source/assets upload to the existing Vercel aiadop project before staging and promotion. No production app deployment was created in this increment. Full multi-workspace switching remains disabled.

## Cohort and billing server release completed, 10 September 2026

The user approved the explicit Vercel source upload and publication. Deployment aiadop-k5ekbo9h7 (dpl_A7Yrk1QvQsSxCkpDnxQJ6fe2A6mf) passed its production build, authenticated staged active/revoked checks, promotion and a live experrt.com revocation check. The guard flag is enabled on the deployment and persisted in Production configuration. Temporary test data was cleaned up. This resolves the deployment block recorded above. Multi-workspace switching is still disabled pending the remaining migration work.

## Membership lifecycle and agent recovery, 10 September 2026

Workspace-scoped removal now preserves identity and learning evidence. Atomic role/department changes, protected ownership handover, invitation reservations and native single-use invitation acceptance have passed database and authenticated tests. Settings reflects owner status and manager invitation limits. Unsupported SSO, fine-tuning and SLA claims were removed from plan cards; plan enquiry buttons now describe their actual sales-enquiry action.

Explicit task start intent is persisted for scheduled recovery. The worker revalidates the original owner, uses atomic execution leases, checks funded credits, respects cancelled/review/closed states and limits generation to three attempts. Activity distinguishes saved briefs from queued work and interruption. One real-provider recovery test completed, saved a review result, wrote one usage record and debited the synthetic wallet once; repeated recovery did not regenerate. Negative database and scheduler tests passed, and all synthetic fixtures were removed.

All 210 automated tests pass. A production metadata type error caught by the staged build was corrected before publication. Final deployment evidence is recorded in membership-and-agent-recovery-verification.md. Full granular roles, multi-workspace switching, invitation resend, atomic credit reservations, financial reconciliation and the other acceptance gates remain open.

## Agent credit reservation and settlement, 10 September 2026

Learning agent attempts now reserve funds before model execution and settle usage, ledger debit and unused reservation return in one database transaction. Repeated or simultaneous settlement requests cannot charge the same execution lease twice. Abandoned holds have a bounded recovery path and a reconciliation note when provider usage is unconfirmed. Charges are capped at the reserved amount. Billing distinguishes available credits from outstanding holds.

Verification passed for insufficient funds, concurrent reservations and settlements, malformed lease expiry, excess-usage cap, abandoned release, and one real model recovery. Staged authenticated Billing checks confirmed own-tenant amounts, no learner billing details and immediate revoked-session denial. The 210-test regression suite, typecheck, targeted lint and production build passed. See agent-credit-settlement.md for scope and release evidence. Legacy chat/feature metering and payment-provider invoice reconciliation remain separate work.

## Atomic agent output and accounting, 10 September 2026

Completed learning-agent output, task review state and credit settlement now share a transaction. Immutable results use the execution lease as identity; duplicate completion does not regenerate or rebill. Cancelled, replaced and revoked-owner results are retained privately without changing the live task. Tests verify rollback on accounting conflict, late released holds and missing proposals. This closes the previously documented settlement-before-proposal persistence gap once the completion transaction reaches the database. Partial generation checkpointing, self-service restoration of retained output, granular workspace roles and switching remain open. See agent-result-persistence.md for evidence and limits.

## Resource membership and private library, 10 September 2026

Knowledge files, prompts and personas now require current membership at both API and database boundaries. The previously missing knowledge bucket is private, with validated uploads and a membership-checked download gateway. Library controls match actual role permissions and errors are visible. Real synthetic API, database and storage tests passed, including revoked access and tenant isolation. Automatic AI indexing claims were removed because that pipeline is not implemented. Full workspace switching remains disabled. See resource-membership-verification.md.

## Staff records and assessment isolation, 10 September 2026

Fixed member records and PDF exports failing because their profile query selected a nonexistent created_at column. Unknown join dates are now null, and query failures are reported. Latest maturity and training-needs responses are constrained to the current company, even when the same person has newer responses elsewhere. Five report routes validate current membership/role, with a second check before member-record/PDF release. Synthetic API and valid-PDF tests passed, including foreign-tenant and revoked-session denial. See report-membership-verification.md. Full switching, remaining assessment mutation boundaries and large-volume report completeness remain open.

## Campaign API authority, 10 September 2026

Added current-membership and observed-role checks to nine campaign actions across seven route files. Send loops recheck before each email call. Foreign campaign statistics now return not found, and read failures are explicit. Synthetic own/foreign/learner and revoked-session checks passed without sending emails. Direct assessment policy/command migration and multi-workspace switching remain unfinished. Evidence is in campaign-membership-verification.md.

## Direct assessment policy restrictions, 10 September 2026

Added restrictive database policies for assessment workspace access, response membership and insertion scope, invitation ownership consistency, and link mutations. Existing public active-link reads remain available to anonymous and authenticated visitors, including visitors from another company. Active learners retain their own historical responses; revoked current membership blocks direct response access. This supplements existing role grants and API guards. Service-role mutation transactions and full multi-workspace switching are still separate migration work.

## Atomic assessment command boundary, 10 September 2026

Assessment creation/deletion and response deletion now use a service-only transaction that locks and validates actor membership, checks the appropriate role and scopes the target organisation before writing. Application routes use the transaction. Direct synthetic command tests passed for active/learner/revoked/foreign cases and missing records. Creation request idempotency, remaining campaign writes and full workspace switching are still open. See atomic-assessment-command-verification.md.
