# Unified programme delivery

Implemented 16 September 2026 for the provider, client, trainer, reviewer and learner journey.

## Experience

`/dashboard/programmes` is the shared starting point. Each programme has one persistent workspace at `/dashboard/programmes/[id]`, with its name, the current user's responsibility, a focused next action. The highlighted stage reflects the next task, not a claim that every earlier stage is finished.

Managers and trainers use Overview, Learners, Sessions and Outcomes. Learners use Learn, Schedule and Progress. Panel reviewers have project reviews and outcomes. Access checks are enforced on the server, independently of these menus.

Preparation, learner assignment, live-group setup, attendance, learning, uploads, rubric assessment, pathway decisions and reporting remain inside this workspace. Old learning and delivery entry points redirect into it. Content authoring and organisation-wide administration remain supporting areas.

The interface uses compact programme headers, restrained colour, consistent panels and buttons, and collapsed setup forms. Learners resume unfinished available activities. Waiting for assessment or a pathway decision has a distinct next-step message.

## Delivery capabilities

- Versioned assessment plans with provider and client approval before release.
- Accepted, programme-specific trainer and panel invitations, with immediate revocation.
- Entry assessments, common learning, selected pathways and final-project gates.
- Private evidence files linked to immutable submission attempts.
- Criterion scores, feedback, revision checks and independent final-project reviews.
- Live sessions and attendance in the programme, with stale-update conflicts.
- Programme discussion for assigned learners and accepted trainers.
- Evidence-based entry/final skill comparisons, readiness decisions, CSV and printable reports.

## Verification

- 227 automated tests passed, including next-action and skill-comparison cases.
- TypeScript and targeted lint checks passed.
- Production build passed, with the existing middleware deprecation warning.
- Transactional database tests passed for approvals, roles, gates, evidence, assessment, panel independence, readiness authority, learner isolation, revocation and idempotent submission replay.
- Real API checks using synthetic accounts passed for the assessment lifecycle, attendance conflicts, combined pathway progress, evidence reports, private-file isolation and revoked access.
- Browser checked manager and learner navigation, sessions, sample evidence submission and narrow-screen layout. This is targeted verification, not a complete accessibility or cross-browser audit.

## Deployment and practical boundaries

Database migrations were applied to the Supabase project configured by this app, `ecxsqzvhsydpgstvvxxo`. The local Supabase CLI project link points elsewhere and was deliberately not used for migration application. The frontend was deployed and promoted on 17 September 2026 as `dpl_2iVvjE52t3ET2rq9e5PSzgmRdH7V` at https://www.experrt.com. Before promotion, authenticated checks passed for provider, trainer, bank, panel and learner scopes, evidence isolation, reporting, sessions, saved templates and cross-organisation access. Local development remains available on port 3014.

Video meetings and executable SQL/Python labs still use external HTTPS tools. Experrt coordinates the work and captures submitted evidence; it does not run a banking lab or video classroom. Uploads are limited to 4 MB per file and ten files per attempt. Trainer invitations are in-app and require an existing verified account. No invitation emails were sent.

Published course content is required before creating a programme. Released assessment plans are fixed; material changes need a new programme/version workflow. Existing certificate rules remain separate from assessed readiness, and readiness does not guarantee placement. The printable report uses browser printing, not a generated PDF service.

Synthetic test organisations, accounts and programme records remain labelled as demonstrations. They were not deleted. No real bank learner evidence was used.

## L&D programme builder

The guided builder at `/dashboard/programmes/new` supports saved organisation templates, content blocks and activities, target-role descriptions, resource content, stage mapping, weighted rubric criteria, panel requirements and preview. Managers can create separate unreleased deliveries from one design. Atomic creation, revision conflicts, tenant isolation and idempotent replay are verified with synthetic accounts.

## Private lab AI review

Current work adds attempt-specific private AI drafts, supported text/code and notebook-source extraction, evidence coverage, editable rubric suggestions and explicit human publication. Drafts are restricted to provider managers and accepted trainers. Learners, bank sponsors and panel reviewers cannot retrieve them. Uploading evidence or generating a draft never passes a lab. Static review does not execute code. The original draft and published human assessment are separate records. See `emft-programme-platform-blueprint.md` for proposal coverage and scaling gaps.
