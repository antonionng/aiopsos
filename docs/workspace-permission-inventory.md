# Workspace permission conversion inventory

Generated from current source, 9 September 2026. A profile reference is an audit candidate, not proof of a permission defect. Existing SQL migrations are historical; inspect live function and policy definitions before replacing them.

Multi-workspace switching remains disabled until each authority path is converted and tested.

## app/api

- `app/api/admin/insights/route.ts`: lines 44
- `app/api/admin/links/[id]/route.ts`: lines 9
- `app/api/admin/links/route.ts`: lines 10
- `app/api/ai-policies/[id]/route.ts`: lines 12
- `app/api/ai-policies/generate/route.ts`: lines 18
- `app/api/ai-policies/route.ts`: lines 12
- `app/api/approvals/route.ts`: lines 11, 22, 36, 64, 84, 118, 124
- `app/api/assessment/[id]/aggregated/route.ts`: lines 24, 162
- `app/api/assessment/[id]/campaign/route.ts`: lines 19
- `app/api/assessment/[id]/courses/route.ts`: lines 34
- `app/api/assessment/[id]/invite/csv/route.ts`: lines 14
- `app/api/assessment/[id]/invite/route.ts`: lines 24
- `app/api/assessment/[id]/link/route.ts`: lines 36
- `app/api/assessment/[id]/remind/route.ts`: lines 24
- `app/api/assessment/[id]/responses/[responseId]/route.ts`: lines 19
- `app/api/assessment/ensure/route.ts`: lines 29
- `app/api/assessment/public-submit/route.ts`: lines 135, 189
- `app/api/assessment/route.ts`: lines 13, 36, 93
- `app/api/assessment/score/route.ts`: lines 28, 80, 107
- `app/api/auth/register/route.ts`: lines 93, 129
- `app/api/billing/route.ts`: lines 15, 69
- `app/api/certificates/issue/route.ts`: lines 136
- `app/api/chat/route.ts`: lines 246
- `app/api/cohorts/[id]/enrol/route.ts`: lines 110
- `app/api/cohorts/[id]/export/route.ts`: lines 55, 105, 140, 178
- `app/api/cohorts/[id]/progress/route.ts`: lines 38, 71
- `app/api/cohorts/[id]/route.ts`: lines 49, 66
- `app/api/conversations/[id]/finalize/route.ts`: lines 78
- `app/api/conversations/route.ts`: lines 49
- `app/api/cron/session-reminders/route.ts`: lines 68, 88
- `app/api/knowledge/route.ts`: lines 10, 34, 86
- `app/api/lms/programmes/[id]/progress/route.ts`: lines 26, 64
- `app/api/org/assessment-summary/route.ts`: lines 18
- `app/api/org/learning-overview/route.ts`: lines 18, 33
- `app/api/org/members/[id]/route.ts`: lines 23
- `app/api/org/members/[id]/training-record/route.ts`: lines 21
- `app/api/organisation/route.ts`: lines 33, 83, 163, 189
- `app/api/personas/route.ts`: lines 10, 34, 73
- `app/api/profile/route.ts`: lines 16, 67
- `app/api/projects/route.ts`: lines 40
- `app/api/prompts/route.ts`: lines 10, 34, 70
- `app/api/public/assess/[token]/signup/route.ts`: lines 128
- `app/api/public/enquiries/route.ts`: lines 84
- `app/api/roadmap/route.ts`: lines 28
- `app/api/sessions/[id]/attendance/route.ts`: lines 31, 46
- `app/api/super-admin/audit/route.ts`: lines 11, 64
- `app/api/super-admin/billing/orgs/[id]/route.ts`: lines 11
- `app/api/super-admin/billing/orgs/route.ts`: lines 10
- `app/api/super-admin/invoices/[id]/route.ts`: lines 11
- `app/api/super-admin/invoices/route.ts`: lines 11
- `app/api/super-admin/plans/route.ts`: lines 15
- `app/api/super-admin/revenue/route.ts`: lines 11
- `app/api/super-admin/settings/route.ts`: lines 10
- `app/api/super-admin/tenants/[id]/route.ts`: lines 10, 41, 115
- `app/api/super-admin/tenants/route.ts`: lines 10, 34, 58
- `app/api/super-admin/tour/route.ts`: lines 44
- `app/api/super-admin/usage/route.ts`: lines 11
- `app/api/super-admin/users/[id]/route.ts`: lines 11, 57
- `app/api/super-admin/users/route.ts`: lines 11, 41
- `app/api/team/[id]/route.ts`: lines 10, 33, 72, 102
- `app/api/team/route.ts`: lines 10, 29, 75, 96
- `app/api/upload/avatar/route.ts`: lines 55
- `app/api/upload/logo/route.ts`: lines 16
- `app/api/usage/route.ts`: lines 13, 117
- `app/api/user/results/route.ts`: lines 149

## lib

- `lib/assess-claim.ts`: lines 94, 100, 111
- `lib/can-update-org.ts`: lines 12
- `lib/cohorts.ts`: lines 126, 160, 213
- `lib/companions.ts`: lines 321, 369
- `lib/email.ts`: lines 68, 339
- `lib/evidence-pack.ts`: lines 27, 117, 215, 363, 437
- `lib/lms/agent.ts`: lines 30
- `lib/member-record.ts`: lines 12, 50, 99
- `lib/resolve-user-context.ts`: lines 20
- `lib/supabase/ensure-profile.ts`: lines 6, 18, 25

## components

- `components/layout/current-org-context.tsx`: lines 30
- `components/layout/sidebar.tsx`: lines 44
- `components/layout/user-avatar-menu.tsx`: lines 40

## app/dashboard

- `app/dashboard/(chat)/chat/page.tsx`: lines 22
- `app/dashboard/(control)/assessment/page.tsx`: lines 108
- `app/dashboard/(control)/recommend/page.tsx`: lines 143
- `app/dashboard/(control)/roadmap/page.tsx`: lines 118
- `app/dashboard/layout.tsx`: lines 26


## Verified resource conversion, 10 September 2026

`app/api/knowledge/route.ts`, `app/api/personas/route.ts` and `app/api/prompts/route.ts` still read a profile during compatibility mode, but now validate that observed organisation through `current_workspace_access`. Their three underlying tables require matching current organisation and active membership through restrictive policies. `app/api/knowledge/[id]/download/route.ts` follows the same boundary and disallows direct client storage reads. This is verified revocation enforcement, not migration to request-scoped multi-workspace context.

## Reporting boundaries verified, 10 September 2026

Five reporting routes now check current membership and the observed role: org/assessment-summary, org/learning-overview, assessment/[id]/aggregated, org/members/[id], and org/members/[id]/training-record. Member detail/export also recheck before releasing the response. Latest assessment reads in lib/member-record.ts are constrained by the assessment's organisation. These remain compatibility-mode profile reads, not complete multi-workspace conversion.

## Campaign API boundaries, 10 September 2026

Assessment list/create/delete, campaign invitation statistics, invite sending, CSV preview, reminders, assessment links and response deletion now validate current membership and the observed role. Sending loops recheck immediately before each email call. Existing role requirements are preserved. These are API compatibility guards; remaining direct assessment RLS/command migration and atomic mutation authorisation are still open.

## Assessment service transactions, 10 September 2026

Assessment POST/DELETE and response DELETE now use assessment_manage with explicit actor and organisation. It validates membership under lock and scopes target records inside the write transaction. Earlier API checks remain for readable errors. Invitation/reminder/link writes remain candidates for equivalent transactional authorisation and durable delivery design.
