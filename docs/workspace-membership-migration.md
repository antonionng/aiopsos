# Workspace membership migration design

Status: additive membership foundation applied and verified. Existing application authorisation remains profile-scoped. Multi-workspace switching is not enabled. 9 September 2026.

## Current coupling found in the audit

- components/layout/current-org-context.tsx reads user_profiles.role and org_id once for navigation.
- components/layout/sidebar.tsx switches a platform operator by updating user_profiles.org_id.
- lib/lms/server.ts obtains its actor through lib/cohorts.ts and passes only the actor ID to lms_command.
- Database learning commands, delivery and discussion routines resolve authorisation from the current user profile.

Changing the switcher alone would leave UI and database permissions describing different workspaces. Do not expose multiple memberships until the command and read paths agree on context.

## Target contract

An account is a person. An organisation membership grants a role in one organisation. Platform support privileges are separate from ordinary membership. Provider-client relationships grant narrowly defined delivery access, not membership of each other's workspaces.

Introduce organisation_memberships with unique (user_id, org_id), status, role, created_at and revocation history. Record invitations separately with expiry, inviter and the proposed scope. Retain user_profiles for personal information and platform role, and retain its current organisation temporarily only for legacy compatibility.

The active workspace must be request-scoped. A validated workspace cookie can select an organisation, but must never itself grant authority. Every server request revalidates active membership. Every mutation carries an explicit organisation context into its database operation, which revalidates the actor's authority there. Do not rely on a client-provided role or a previously cached membership decision.

## Safe rollout sequence

1. Add memberships and backfill only existing profile memberships, retaining current behaviour. Do not invent membership of provider clients or automatically grant platform administrators private learner access.
2. Inventory all profile-based permissions, direct Supabase reads and service-role endpoints. Convert them to a shared membership-aware actor contract and matching row-level policies before enabling switching.
3. Add an authenticated workspace-list and switch API. The switch endpoint validates membership and writes active context; it never changes the user's personal profile or global role.
4. Pass explicit active context to LMS, cohort, discussion, records, billing and agent commands. Revalidate authority for deferred agent execution and approvals.
5. Enable the multi-workspace interface after ordinary-role tests pass. Flush workspace-specific UI state when context changes. Tabs must not display data fetched under a previous context.
6. Complete invite acceptance, expiry, resend, revocation, deactivation and owner-transfer rules. Require at least one active owner before transferring or removing ownership.
7. Retire legacy profile-scoped authorisation only after every read and mutation path has been converted and verified.

## Acceptance scenarios

- One account is a learner in Client A and a trainer in Provider B without duplicate login identities.
- Two browser tabs can hold explicit contexts without a profile mutation silently changing the other tab's authority.
- A removed member cannot act using an old cookie, queued task or approval.
- A provider-client connection does not expose unrelated rosters, billing or submissions.
- An owner cannot remove the last owner accidentally.
- Changing active workspace cannot reuse old page data, search results or cached agent sources.
- Existing standalone cohorts, public catalogue and personal learning records remain reachable by their authorised users during migration.

This migration precedes broader cross-workspace agent execution and delegated finance roles.

## Foundation implemented

- `organisation_memberships` holds independent owner, admin, manager, trainer, learner and finance roles with active, suspended and revoked states. Only learner, manager, admin and proven owner roles are backfilled. Trainer and finance are schema roles, not newly enabled application permissions.
- Existing profile assignments and explicit organisation ownership are mirrored by database triggers. A platform operator selecting an organisation does not create membership. Provider-client connections do not create membership.
- Direct memberships are separate from the compatibility mirror. A profile update cannot reactivate a revoked direct membership.
- `organisation_membership_events` records creation, role/status changes and removal. Ordinary clients cannot write memberships or read the audit log.
- `list_workspace_memberships()` derives the person from the authenticated session and returns only their active memberships. The read-only `/api/workspaces/memberships` endpoint uses this function and returns `switchingEnabled: false` with private, no-store caching.
- The migration backfilled 43 active memberships, matching all 43 proven legacy relationships, with zero unexpected grants.

## Verification evidence

`supabase/tests/organisation_memberships.sql` passed against the database in a rolled-back transaction. It checks independent learner/trainer roles, own-row visibility, denied insert/update/delete, denied audit and sync access, platform-operator isolation, same-session revocation, legacy role/move synchronisation, direct-membership revocation preservation, explicit ownership and anonymous denial. No synthetic users remain. TypeScript, endpoint ESLint and the production build passed. The existing authenticated provider/client/learner acceptance flow also passed, including submissions, review, live progress and record isolation. The new API passed authenticated learner/provider role, isolation and private-cache checks.

These checks validate the new membership subsystem. Revoking a membership now blocks core LMS commands and agent lease/proposal operations. Other legacy application paths, including billing and some delivery reads, still require conversion; membership revocation is not yet a platform-wide access control. Do not offer membership editing, invitations or switching until that coordinated cutover is complete. No new last-owner transfer workflow is exposed in this phase.

## Cutover inventory

See `workspace-permission-inventory.md` for the source locations still referencing profiles. Some references are personal information reads rather than authority; classify each before conversion. Required conversion order: database command/RLS contract, shared server actor, direct server/client reads, deferred agent execution, billing and reporting, then switcher and invitation UI. No client UI flag can substitute for those checks.

## Learning command and agent guard increment

- Core LMS calls now pass an explicit organisation ID through `lms_command_scoped`. A database guard locks and validates the current profile and membership before command execution. The old command entry point is guarded too, including proposal application and idempotent replay.
- During compatibility mode the requested organisation must still match the profile. Suspended/revoked memberships and ordinary-role discrepancies fail closed. Existing platform-operator authority is preserved separately; this increment creates no extra operator membership or grants.
- The shared learning actor checks membership for dependent LMS routes. Assistant tools retain the request's workspace context rather than silently following a later profile switch.
- Task dispatch and the agent runner revalidate manager access before work. The agent rechecks each model step and before saving. A database trigger validates the original task owner's authority atomically on lease acquisition and proposal persistence, including old worker entry points. Failed/cancelled cleanup remains possible.
- Database tests cover wrong-workspace commands, revoked legacy commands, revoked new and old claim paths, and blocked proposal persistence after suspension. These checks do not require model calls or AI credits.

Full membership switching remains disabled. Cohort-specific RPCs, billing, other direct reads and granular trainer/finance capabilities remain separate migration work. A role removed during an already in-flight model request cannot retract data already sent; subsequent guarded steps and proposal persistence are blocked.

## Current implementation status, 10 September 2026

Later increments have shipped membership lifecycle controls, protected owner transfer, invitation acceptance, cohort/billing revocation guards, deferred-agent checks, atomic result accounting and the resource guards described in resource-membership-verification.md. Earlier foundation-only limitations above describe their original release stage. Full multi-workspace switching and granular trainer/finance capabilities are still not enabled; profile-scoped compatibility remains in use.
