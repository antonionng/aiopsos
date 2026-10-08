# Direct assessment membership policies

10 September 2026.

Applied assessment_membership_policies as an additive database migration. Restrictive policies supplement the existing role grants. Assessment records require current workspace membership. Response reads require active current membership while preserving an active learner's own historical responses; inserts and updates require an assessment and department in the current organisation. Invitations require matching organisation and assessment ownership. Link mutations require current membership.

Assessment links are organisation/template records, not assessment rows. The initial migration attempt incorrectly assumed an assessment_id column on links and was rejected atomically; the corrected migration was applied successfully. Public active-link reads are intentionally unchanged for anonymous and signed-in visitors, so a learner from another company can still open a public assessment. This does not claim public-link enumeration or service-role mutations have been redesigned.

Direct authenticated database tests passed for active assessment access, four own historical responses across companies, denied cross-company invitation creation, revoked reads of assessments/responses/invitations, denied revoked assessment creation/deletion and link updates, and public-link reads by anonymous and unrelated authenticated visitors. No emails were sent. The migration is live without an application deployment. Multi-workspace switching remains disabled; atomic service-role assessment mutation checks remain unfinished.

Synthetic fixture cleanup completed, including the invitation, public test link, assessments, organisations and accounts. No production customer learning data was changed.
