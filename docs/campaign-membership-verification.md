# Assessment campaign access

10 September 2026.

Added current-membership and observed-role checks to seven assessment route files, covering nine actions: list, create, delete, campaign statistics, invite, CSV preview, remind, link and response deletion. Invitation and reminder loops recheck before each email call. These checks do not retract messages already sent or provide an atomic transaction with an external mail provider.

Campaign statistics now check the assessment belongs to the current company. A foreign or missing campaign returns 404 instead of a misleading empty success. Query errors return retryable failures instead of zero invitations.

Existing role requirements remain in place. This increment does not change public assessment availability or send any verification emails. It adds API guards, not the remaining database-level assessment policy and command conversion required before full workspace switching.

Verification passed for own-company campaign access, unrelated-company 404, learner 403, and same-session revocation denial for all nine actions. No active invitation or reminder send was invoked. The first connection-failed fixture and the fixture from a test-method mismatch were cleaned up. TypeScript and 210 regression tests pass; lint has only the pre-existing unused legacy fallback variable warning. Browser verification confirmed meaningful content without a framework error overlay.

Production build and promotion succeeded for dpl_2xywLmm7FAaDkRohLsy2mhYCkufo (aiadop-bq4bbc98n). The staged campaign endpoint redirected signed-out requests to authentication. All synthetic fixtures were cleaned up. Live availability and signed-out access checks also passed.
