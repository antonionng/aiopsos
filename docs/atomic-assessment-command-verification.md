# Atomic assessment commands

10 September 2026.

The service-only assessment_manage function validates and locks the actor's current profile and membership through lms_assert_workspace, checks the action's role, scopes the assessment to the explicit organisation, and performs its write within the same transaction. It covers creation, assessment deletion and response deletion. Administrator requirements for creation/deletion and manager access for response deletion are preserved. Ordinary authenticated clients cannot execute the function directly.

Application routes now call this function rather than checking access and issuing a separate service-role write. The obsolete create fallback that silently omitted template_id was removed. Missing records, invalid input and permission failures receive distinct response statuses. The command does not introduce request-level idempotency for creation; a new create request still represents a new assessment.

Synthetic database verification passed for successful create/delete/response deletion, repeated missing-response rejection, foreign-assessment rejection, learner denial, same-session revoked-owner denial and denied direct-client execution. The protected assessment survived denied deletion. TypeScript, targeted lint and the 210-test suite pass. No emails or model calls were made. The schema change is additive; no production customer records were used for testing.

These commands do not yet cover invitation record writes, reminder delivery or link creation. Multi-workspace switching remains disabled until the remaining application context migration is complete.

Production build and promotion completed for dpl_3ehezrf4DNP1VhxcJbQsQvt5NaUg (aiadop-7swkfa60u). Staged signed-out assessment access redirected to authentication (307). Live checks returned 200 for the public site and 307 for signed-out assessment access. Synthetic fixture cleanup completed.
