# experrt

**Assess your workforce, train them by role, and hold the documentation your regulator will ask for.**

`experrt` is the platform behind Experrt. It scores an organisation's AI
maturity, maps the gaps onto a catalogue of facilitated courses, records the
delivery of that training, and exports the result as a dated evidence pack.

## What it does

1. **Assess.** A five-minute assessment scores each respondent across five
   dimensions (`confidence`, `practice`, `tools`, `responsible`, `culture`) into
   six maturity tiers, tagged by department and respondent role. Distributed by
   email invite, shareable link or QR code.
2. **Recommend.** Gaps map deterministically onto the course catalogue, per
   person and per department. See `recommendCourses` in
   [`lib/recommendation-engine.ts`](lib/recommendation-engine.ts).
3. **Train.** Courses run live, in person or online, led by a facilitator. The
   platform schedules cohorts and records attendance, submissions and grades. It
   is not a content host and not a SCORM player.
4. **Evidence.** Training records are combined with observed post-training usage
   and exported as a frozen, dated pack.

Alongside this sits a governed AI workspace (chat, projects,
knowledge base, personas, policies, approvals), which is also where the observed
usage in the evidence pack comes from.

### What it does not claim

EU AI Act Article 4 requires providers and deployers to take measures supporting
AI literacy among staff. The European Commission's AI literacy Q&A is explicit
that no certificate is required and that no single generic course establishes
compliance by itself.

This platform therefore documents **role-proportionate measures and the records
evidencing them**. Nothing in the product, its generated documents or its
marketing copy may claim that the platform, a course or a certificate makes an
organisation compliant. See `LITERACY_DISCLAIMER` in
[`lib/constants.ts`](lib/constants.ts).

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4, shadcn/ui primitives in `components/ui` |
| Data | Supabase (Postgres + Auth + Storage), row-level security throughout |
| AI | `ai` SDK v6, OpenAI only |
| Payments | Stripe (checkout, portal, webhooks) |
| Email | Resend, with React components in `lib/emails` |
| PDF | `@react-pdf/renderer` |
| Validation | Zod v4 |
| Charts | Recharts |

## Layout

```
app/
  (public)/          Anonymous surfaces: assessment flow, course catalogue
  (auth)/            Login, register, password reset
  (company)/         About, contact
  (legal)/           Terms, privacy, cookies
  (resources)/       Docs, changelog, status
  dashboard/
    (chat)/          AI workspace
    (control)/       Assessment, results, analytics, billing, admin
  api/               Route handlers; api/public/* is unauthenticated
components/
  ui/                shadcn primitives - do not add another UI library
  charts/            Radar, heatmap, maturity gauge
lib/
  constants.ts       Dimensions, tiers, roles, course levels, plans
  scoring.ts         Assessment questions and score calculation
  recommendation-engine.ts   Model routing, control layer, course matching
  role-helpers.ts    Platform role model
  supabase/          server / client / admin / middleware clients
  emails/            Transactional email components
supabase/migrations/ Numbered, idempotent SQL
```

### Schema

Tenancy and identity: `organisations`, `departments`, `user_profiles`,
`audit_logs`.

Assessment: `assessments`, `assessment_responses`, `assessment_links`,
`assessment_invites`, `pending_responses`, `recommendations`, `roadmaps`.

Academy catalogue: `courses`, `course_modules`.

Delivery: `facilitators`, `cohorts`, `sessions`, `enrolments`, `attendance`,
`submissions`, `grades`, `certificates`, plus `session_reminders` for reminder
de-duplication.

Enquiries: `course_enquiries` — the only table anonymous visitors may write to.

Evidence: `evidence_packs`. The `payload` column is a frozen snapshot — a pack
regenerated for a past period must produce the same document, so nothing
downstream re-reads live tables. There is deliberately no UPDATE policy on it.

Governance: `ai_policies`, `approval_requests`.

Workspace: `conversations`, `messages`, `message_attachments`,
`message_feedback`, `model_personas`, `projects`, `project_files`,
`knowledge_base_files`, `saved_prompts`, `prompt_templates`.

Commercial: `subscription_plans`, `usage_logs`, `feature_usage_logs`.

## Local setup

Requires Node 22.6 or newer (the test runner relies on native TypeScript
stripping).

```bash
npm install
npm run dev
```

Create `.env.local` with the following. Provider keys are read implicitly by
the `ai` SDK, so they only need to be present in the environment.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — row-level security applies |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key. Server-side only, bypasses RLS |
| `NEXT_PUBLIC_APP_URL` | Public base URL, used in emails and share links |
| `OPENAI_API_KEY` | Models, image generation, voice. OpenAI is the only model provider — see `lib/model-router.ts` |
| `STRIPE_SECRET_KEY` | Billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `RESEND_API_KEY` | Transactional email |
| `EMAIL_FROM` | Sender address for transactional email |
| `NOTIFY_EMAIL` | Where contact-form and admin notifications go |
| `TAVILY_API_KEY` | Web search |
| `CRON_SECRET` | Shared secret for the scheduled jobs below. Without it they refuse to run |

Note that `.gitignore` excludes `.env*`, so there is no checked-in example file.

### Migrations

SQL lives in `supabase/migrations`, numbered and applied in order. Every
migration is idempotent — `IF NOT EXISTS` everywhere, and RLS policies are
dropped and recreated rather than altered — so re-running the directory is safe.

Apply with the Supabase CLI (`supabase db push`) or by running the files in
order against the project.

Any new table holding participant data must ship with RLS enabled in the same
migration that creates it, not in a follow-up.

### Scheduled jobs

`GET /api/cron/session-reminders` sends the 24-hour reminder for every session
starting tomorrow. Call it hourly from Vercel Cron or any scheduler, passing
`Authorization: Bearer $CRON_SECRET`. Its window deliberately overlaps between
runs so a missed run still catches the session; `session_reminders` is what
stops the overlap turning into duplicate email.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (also type-checks)
npm run lint    # eslint
npm test        # unit tests, node:test with native TS stripping
```

Tests live beside the code in `lib/__tests__`. They import with explicit `.ts`
extensions because Node's test runner resolves ESM specifiers literally.

Row-level security is tested separately, in SQL, because that is the level it
operates at. `supabase/tests/rls_cohorts.sql` asserts the negative cases —
an admin must not see another organisation's register, a facilitator reaches
only the cohorts they run, a participant cannot mark their own attendance. It
runs inside a transaction that is rolled back:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_public_catalogue.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_cohorts.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_evidence_packs.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_course_enquiries.sql
```

Point it at a branch or a local stack, never at production.

The whole chain, `001` through `021`, was applied from scratch to a fresh
Supabase project on 20 August 2026 and the RLS suite passed 15/15 against it.
Three things that exercise established are worth knowing:

- **Never name an RLS helper generically.** The academy helpers are prefixed
  `academy_` because `public.current_org_id()` already exists in at least one
  Supabase project this schema might land in, with a different body and about
  a hundred unrelated policies depending on it.
- **Do not revoke `EXECUTE` on those helpers**, whatever the Supabase linter
  advises. RLS evaluates policy expressions with the calling role's
  privileges, so revoking breaks every policy. See the note in `021`.
- **Never write an RLS policy on a table that selects from that same table.**
  Migration 002 did, on `user_profiles`, and it sat dormant until an anonymous
  read reached it and failed with `42P17: infinite recursion`. Ask a
  `SECURITY DEFINER` function instead — it runs as its owner and is not
  subject to the policy. Fixed in `023`.
- **`user_profiles.id` references `auth.users(id)`**, so the RLS test creates
  auth users before profiles. Note that `information_schema` hides that
  constraint, because `auth.users` is owned by another role — query
  `pg_constraint` if you need to check it.
