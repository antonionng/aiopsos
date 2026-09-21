# Learning agent credit settlement

10 September 2026.

## Behaviour

An explicitly started learning agent reserves credits after acquiring its execution lease and before contacting the model. The reservation and ledger entry share a database transaction and lock the organisation wallet. A second agent cannot reserve already-held funds. Retries of the same reservation must match the original pricing snapshot and do not debit again.

The reservation conservatively covers five model steps, each with the documented GPT-4o Mini context ceiling and the application's 6,500 output-token limit. Rates come from the application's model registry; markup and conversion are snapshotted from credit settings. The model's 128,000-token context ceiling was verified against https://developers.openai.com/api/docs/models/gpt-4o-mini on 10 September 2026. At the current default rates/settings this is a temporary 24-credit hold, not the final charge.

Confirmed usage settles once per execution lease: usage record, reservation return and final ledger debit commit together. A duplicate settlement returns the same usage ID; changed usage for an already-settled lease is rejected. Customer charges cannot exceed the hold. Any excess is recorded as a reconciliation exception. Billing labels the spendable balance as Available AI credits and separately shows active reservations when present.

Failures without confirmed usage return the hold with an explanatory reconciliation note. Holds abandoned for more than ten minutes are returned by the recovery worker once their execution has ended or their lease is stale. An interrupted provider request can still incur a provider cost; the platform does not silently bill the customer for unconfirmed usage. Reconciliation notes preserve that exception for investigation. Disabling the rollout flag also stops automated release, so operators must settle/release outstanding holds before retiring the path.

## Evidence

- Transactional database tests passed: repeated reservation, insufficient funds, repeated settlement, conflicting settlement rejection, one usage/ledger debit, abandoned hold release and service-only access.
- Two simultaneous reservations against insufficient shared funds admitted exactly one task. Two simultaneous settlements produced the same usage ID and one final debit.
- One real-model interrupted task recovered, reserved credits, produced a review result and settled. Available balance equalled initial credits minus the recorded final charge. A repeated recovery did not regenerate.
- All 210 existing automated tests, TypeScript and targeted lint passed. Synthetic workspaces, accounts, wallet/ledger and usage records were removed.

## Scope and limits

This path applies to learning agents under LEARNING_AGENT_CREDIT_HOLDS_ENABLED. Legacy chat and other generation routes still use their existing post-hoc metering; this is not a claim of global wallet reservation coverage. Stored provider cost uses configured token rates, not a reconciliation against the provider invoice or cached-token discounts. Full payment refunds, marketplace settlements, tax and invoice reconciliation remain separate work.

Reservation rows contain execution lease identifiers and are service-only. Billing exposes only the current authorised organisation's summed outstanding reserved amount; if that sum cannot be read completely, it displays unavailable rather than an incorrect zero. No payment or email was sent by these tests.

## Staged acceptance and release

Production build passed for deployment dpl_FLqHeHit6fGGMrNgkmLz6t5akXBJ (aiadop-hrbacv8ak). Authenticated staged tests verified a 76-credit available balance with a 24-credit reservation, excluding a second organisation's 60-credit hold. Learners received no wallet/history/reservation fields. Revoking the administrator's membership denied the same session with HTTP 403. Follow-up database tests also passed for missing lease expiry and charges above the reservation cap. Lookup indexes were added through a separate additive migration. The temporary fixtures were cleaned up.

This provides idempotency per execution attempt. If a generated result is lost after usage settlement but before proposal persistence, a later generation is a distinct attempt. Atomic persistence of output together with settlement remains a separate recovery improvement. No claim is made of exactly-once provider execution.

Promotion completed successfully for dpl_FLqHeHit6fGGMrNgkmLz6t5akXBJ. Live checks returned HTTP 200 for /courses/prompting-and-output-verification and HTTP 401 for an unauthenticated /api/cron/learning-agent-recovery request. The initial five-minute deployment error-log query returned no entries; this is a point-in-time check, not a long-term reliability claim. The credit-holds flag is enabled in Production. Synthetic acceptance accounts and records, plus their temporary session-header and response files, were removed.
