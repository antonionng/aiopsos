# Cohort and billing membership release

Status: approved, migrated, verified and published on 10 September 2026. Production guards are enabled. The rollout flag is saved in Vercel Production configuration for future deployments. The production release is aiadop-k5ekbo9h7 (dpl_A7Yrk1QvQsSxCkpDnxQJ6fe2A6mf).

## Exact proposed scope

Add a restrictive current-membership check to these 13 tables: cohorts, sessions, enrolments, attendance, submissions, grades, certificates, credit_wallets, credit_ledger, billing_invoices, billing_invoice_lines, mooov_payments and usage_logs. Existing row policies remain and still determine record-level reach, including provider/client and facilitator access. No access grant is widened. Public anonymous policy behaviour and service webhook processing are unchanged.

Guard two existing privileged functions, lms_live_delivery and cohort_wall, and add versions accepting explicit workspace context. Add a signed-in current_workspace_access function that rejects revoked/suspended membership, stale role and wrong workspace context. Preserve existing platform-operator access separately from membership.

The server release uses the guarded actor for cohorts, sessions, registers, submissions, grades, certificates, evidence packs, invoice downloads and credit purchases. Billing reads and platform billing/invoice administration check current access. Existing role and ownership checks remain. Learning delivery and wall callers pass explicit workspace context when the release flag is enabled.

## Evidence and limits

Final TypeScript compilation and targeted ESLint checks passed, including the disabled rollout flag. The rollback also passed in the isolated database and removed all 13 added policies. The disposable test container was removed afterward. The actual proposed migration passed in a network-isolated disposable PostgreSQL 16 database, with synthetic profiles/memberships and reduced tables/policies. The checks cover active baseline visibility, unchanged isolation from unrelated rows, wrong workspace, stale role, revoked reads and denied writes on all 13 tables, and old/new RPC guard denial.

The isolated RPC bodies are stubs and the baseline row policies are reduced fixtures. This is not a complete replica or proof of every production provider/client/facilitator path. The test is saved in supabase/tests/cohort-billing-guards-isolated.sql and is intended for an empty disposable database only. It sends no emails, creates no payments and uses no AI credits.

## Release and recovery

After explicit production approval: apply 20260909131714_cohort_billing_membership_guards.sql, run guarded live acceptance tests using synthetic accounts (including provider/client/trainer and billing denial), enable COHORT_MEMBERSHIP_GUARDS_ENABLED=true in a staged app deployment, verify, then promote. Keep switching disabled.

If verified access regresses, first disable the release flag and then apply the reviewed rollback in supabase/rollbacks/cohort_billing_membership_guards.sql. The rollback removes only this release's policies/functions and restores the two prior RPC guard locations; it removes no business records. It must not run automatically or against later changed function definitions.

Multi-workspace switching, invitations, delegated finance roles and full payment lifecycle verification remain outside this increment. This release does not promise to stop an external payment request already in flight when access is revoked.

## Live acceptance results, 10 September 2026

The real migrated database passed the authenticated provider/client/learner course, assignment, submission, review, attendance, grade and progress regression. The additional cohort/billing suite passed provider/client row isolation, invoice visibility, billing audience restrictions, learner purchase denial, and cross-organisation access for an explicitly assigned trainer. Revoking the provider or trainer membership immediately denied cohort and invoice rows, wallets, billing API access, credit checkout and wall access using the existing sessions. No payment requests or messages were sent. Synthetic invoice and account/workspace fixtures were cleaned up.

The source upload was rejected twice by automatic approval review. Its final stated requirement is explicit permission for the application source/assets payload to the external Vercel destination, notwithstanding the earlier approval for server enablement. Read-only verification mapped experrt.com to the existing aiadop project (prj_bLm98DEyKwWInDAAlpWSOmGZDBjv, team_tyiuaDaKUtT2oBq7EfVQUFtZ). The dry-run manifest identified 629 source/assets files totalling 9,689,094 bytes; environment files, .git, output and verification fixtures were excluded. No workaround upload was attempted. The remaining approval is to upload this release to that Vercel project, verify the staged build with the guard flag enabled, and promote to experrt.com.

## Deployment completed, 10 September 2026

The user explicitly approved the source/assets upload to the existing aiadop Vercel project and publication to experrt.com. The production build passed and was staged with COHORT_MEMBERSHIP_GUARDS_ENABLED=true. An isolated synthetic learner received HTTP 200 with only plan information while active, then HTTP 403 using the same session after membership revocation. The flag was also saved to the project's Production environment so future deployments retain these guards. The verified deployment was promoted successfully. The same revoked session received HTTP 403 from https://experrt.com/api/billing, confirming the live release enforces the guard. The temporary fixture was cleaned up. Prior upload-rejection notes above are historical and resolved.

Multi-workspace switching remains disabled. This release completes the approved cohort/billing guard increment, not the remaining granular-role, invitation and workspace-context migration.
