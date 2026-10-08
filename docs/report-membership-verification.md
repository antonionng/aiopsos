# Staff reporting and assessment isolation

10 September 2026.

Five reporting routes now validate active membership and the observed profile role before reading workspace records: organisation assessment summary, learning overview, assessment aggregates, member record detail and member PDF export. Member detail and PDF routes recheck after read/render work before releasing the response. These checks use the existing compatibility-mode current-workspace function; they do not enable workspace switching or new roles.

The shared member-record query incorrectly selected `user_profiles.created_at`, a column absent from the database. That query error was treated as a missing member. The unsupported column was removed; the unknown joined date is returned as null. Database errors in member identity, assessment and delivery reads now produce an explicit retryable response rather than an empty record.

Latest maturity and training-needs lookups now join the owning assessment and constrain it to the requested organisation. A person's more recent response from a different company can no longer replace the current company's result in these staff records or PDFs. Personal cross-company learning history remains a separate permission design.

## Verification

Synthetic fixtures gave the same learner older scores in Company A and newer, different scores in Company B. Company A's administrator received only Company A's scores. The unrelated administrator received 404 and the learner received 403 from staff-record endpoints. The authorised export returned a valid PDF. Organisation staff reports and assessment aggregates loaded; learner requests to staff overview routes were denied. Revoking the administrator then denied the same session across all five routes with 403.

TypeScript and targeted lint passed. The regression suite passes 210 tests. Synthetic workspaces, accounts and assessments were removed. No email or model generation was needed. This increment does not resolve every legacy assessment mutation or database policy, nor the report pagination/large-volume completeness work.

Production build and promotion completed for dpl_2fidu1pmZ5KevgbHXwg7Gbcp69Lc (aiadop-3kguivmpw). Staged signed-out reporting redirected to authentication (307). Live checks returned 200 for the public site and 307 for signed-out reporting. No production customer assessment or member record was changed by verification.
