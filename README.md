# aiopsos

**Assess your workforce, train them by role, and hold the documentation your regulator will ask for.**

`ai-adoption-os` is the platform behind AIOPSOS. It scores an organisation's AI
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

Alongside this sits a governed multi-model AI workspace (chat, projects,
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
| AI | `ai` SDK v6 with Anthropic, OpenAI, Google and Mistral providers |
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

Academy: `courses`, `course_modules`.

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
| `ANTHROPIC_API_KEY` | Anthropic models |
| `OPENAI_API_KEY` | OpenAI models, image generation, voice |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google models |
| `MISTRAL_API_KEY` | Mistral models |
| `STRIPE_SECRET_KEY` | Billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `RESEND_API_KEY` | Transactional email |
| `EMAIL_FROM` | Sender address for transactional email |
| `NOTIFY_EMAIL` | Where contact-form and admin notifications go |
| `TAVILY_API_KEY` | Web search |

Note that `.gitignore` excludes `.env*`, so there is no checked-in example file.

### Migrations

SQL lives in `supabase/migrations`, numbered and applied in order. Every
migration is idempotent — `IF NOT EXISTS` everywhere, and RLS policies are
dropped and recreated rather than altered — so re-running the directory is safe.

Apply with the Supabase CLI (`supabase db push`) or by running the files in
order against the project.

Any new table holding participant data must ship with RLS enabled in the same
migration that creates it, not in a follow-up.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (also type-checks)
npm run lint    # eslint
npm test        # unit tests, node:test with native TS stripping
```

Tests live beside the code in `lib/__tests__`. They import with explicit `.ts`
extensions because Node's test runner resolves ESM specifiers literally.
