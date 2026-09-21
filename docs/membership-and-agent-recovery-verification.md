# Membership lifecycle and agent recovery

10 September 2026.

## Implemented

- Removing a member detaches workspace access and revokes membership. It preserves the login identity, profile and learning evidence.
- Role and department changes are checked atomically against current membership. Managers cannot grant administrator roles; organisation administrators cannot alter platform billing overrides. Foreign departments, self-removal, owner removal and last-administrator removal are denied.
- An owner can hand ownership to an active administrator in the same workspace. The previous owner keeps administrator access. Both membership changes and ownership handover are attributed in audit records.
- New-account invitations use native single-use tokens, an Experrt acceptance page and personal password setup. Per-email reservations prevent competing invitation requests. Existing confirmed identities are not overwritten. Tokens stay in the URL fragment until acceptance.
- Agent start intent is saved separately from a queued draft. Scheduled recovery only considers explicitly started tasks with a queued state or expired lease. Recovery uses the original task owner's current authority, the existing atomic claim, budget/credit checks and three-attempt cap.
- Recovery runs in batches of two every five minutes. Cancelled, failed, completed and review-ready tasks never restart automatically. Access and lease ownership are checked between model steps and before saving a proposal. Failed tasks require an explicit user retry.

## Verification

- Transactional database tests passed for role escalation, ownership transfer, foreign department denial, invitation reservations, revocation and retained grades/identity. Transactions rolled back.
- Native invitation acceptance passed with synthetic accounts: session setup, used-token rejection, already-signed-in protection, malformed links, cross-origin requests, wrong workspace and revoked membership. No outbound emails were sent. Fixtures removed.
- Browser review verified the shared wordmark, purple styling and missing-link error on the acceptance page.
- Recovery policy tests passed. Database tests passed for duplicate-worker exclusion, new leases after interruption, stale proposal denial, cancellation, attempt cap and revoked task owner.
- Authenticated local scheduler tests closed an exhausted task and a revoked-owner task, left an unstarted draft untouched and safely handled a repeated invocation. No model calls were made. Fixtures removed.
- TypeScript and targeted lint passed before the final Activity copy changes; final release verification follows those changes.

## Operational controls and remaining limits

CRON_SECRET authenticates the recovery endpoint. LEARNING_AGENT_RECOVERY_ENABLED controls rollout. The route bypasses browser-session middleware only for this exact scheduler URL and validates its own secret. Disable the flag and redeploy to pause recovery. Saved tasks remain intact.

This is database-backed restart recovery, not a full workflow engine. Cancellation is checked at model-step boundaries and before persistence, not immediately during a single provider request. A crashed generation may incur provider usage before its usage record is saved; atomic credit reservation and reconciliation remain unfinished. Five-minute scheduling is an intended interval, not a latency guarantee. Monitor scheduler failures and queue age before promising a service objective.

Existing confirmed users joining additional organisations, invitation resend/expiry management UI, granular trainer/finance roles and multi-workspace switching remain unfinished. The current profile context is retained during migration. Email delivery itself was not exercised against real recipients. Password setup uses the existing reset-password flow.

## Final verification additions

All 210 automated tests pass, with TypeScript and targeted lint passing after the final edits. Existing settings avatar markup has one pre-existing image optimisation warning. A real AI-provider test recovered an expired lease, saved a review result on attempt two, wrote one usage record and debited its synthetic wallet once. A repeated invocation examined zero tasks. The synthetic account, workspace, wallet and usage records were cleaned up.

Background learning agents now require a verified funded wallet; unavailable credit data fails closed. This does not yet provide atomic cost reservations. Workspace capabilities are included in the agent's context so internal training is not treated as requiring client onboarding. Browser review confirmed owner labelling and team controls. Unsupported plan claims were removed and enquiry actions labelled accurately.

## Production release

Promoted deployment `dpl_G3W8RKwNvQTWRS2Ad6ZSrbLcKWwy`, https://aiadop-qw0ihkyn2-antonios-projects-8efda5f8.vercel.app, to experrt.com on 10 September 2026. Production build passed. Staged checks: invitation page 200 with non-indexing/referrer/share metadata, incomplete invitation 400, unauthenticated scheduler 401. Live checks: invitation page 200 with expected content and unauthenticated scheduler 401. Initial five-minute error-log scan returned no entries. This is a short post-release observation, not a service reliability guarantee.

Both COHORT_MEMBERSHIP_GUARDS_ENABLED and LEARNING_AGENT_RECOVERY_ENABLED are persisted in Production configuration; the existing CRON_SECRET remains in place. The deployed cron schedule targets recovery every five minutes. Local authenticated scheduler and real-model acceptance tests passed; a naturally scheduled production invocation has not yet been observed in this release record.
