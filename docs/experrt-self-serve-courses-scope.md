# SCOPE ONLY: Experrt self-serve online courses (v1)

**Status:** Draft for Antonio. Not a build ticket. Nothing in this document is authorised to go live.

**Audience:** Antonio Giugno (Experrt / AI with Antonio) and the coordinator handing this over.

**Repo:** `antonionng/aiopsos` (source for experrt.com). Live Vercel project is `aiadop`. This branch must not be merged to `main` and must not be deployed to production.

**What this is:** Product and engineering scope for Experrt's own learner portal: people buy a course on Instagram or LinkedIn, pay, and take it alone. Facilitated / in-person programmes stay. Company course-authoring (white-label tenants creating their own courses) is **shelved**.

---

## Coordinator handoff

Give Antonio this file. It answers, in one place:

1. What we build (Experrt learner portal only).
2. How a learner buys and learns (pay-then-account).
3. How the homepage and `/courses` sell it.
4. Exactly ten self-serve courses, with prices and modules.
5. What already exists in this repo versus what to build, in phases.

Do **not**:

- Merge this branch to `main`.
- Promote a preview to production.
- Change the live Vercel project `aiadop`.
- Pitch Kumo seats, per-seat SaaS, or a multi-tenant CMS.
- Treat this PR as a shipping ticket.

---

## 1. Why this, and what it is not

Trichology Academy's self-serve courses are already converting (two purchases this month). Antonio wants the same passive-income pattern for Experrt, promoted on **AI with Antonio** Instagram and his LinkedIn, **alongside** in-person and facilitated programmes.

This repo today is a **facilitated academy**, not a player:

- Public catalogue at `/courses` is marketing + enquiry.
- Conversion closer on a course page is `CourseEnquiryForm` ("Run this for your team").
- Money is per-cohort, quoted by a human, paid by an organisation.
- README and insight copy are explicit: the platform is not a content host and not a SCORM player.
- The insight `in-person-ai-training-vs-lms` argues against a video library as the *workforce* product.

v1 does **not** replace that. It adds a second product line on the same brand and stack:

| Line | Buyer | Closer | Record |
| --- | --- | --- | --- |
| **Self-serve (this scope)** | Individual, often from Instagram / LinkedIn | Buy / start course | Personal progress + completion record |
| **Facilitated (already live)** | Organisation / L&D | Conversation, then cohort | Attendance, grades, evidence pack |

Copy rule that must survive implementation: a self-serve course is **skill and judgement**, not Article 4 compliance. Keep `LITERACY_DISCLAIMER` in `lib/constants.ts`. No certificate shop. No "this makes you compliant."

---

## 2. Product scope: Experrt learner portal (v1)

### 2.1 Catalog

Reuse the existing public routes. Do not invent `/academy` or a second site.

| Surface | Today | v1 |
| --- | --- | --- |
| `/courses` | 34 facilitated outlines, enquiry CTA, assessment CTA | Default view is **Latest courses** (the ten self-serve SKUs) with price and **Buy and start**. Facilitated catalogue remains a second filter / section. |
| `/courses/[slug]` | Outline + `CourseEnquiryForm` | Self-serve slugs: promise, modules, price, **Buy and start**. Facilitated slugs: keep enquiry. |
| `/courses/sector/[sector]` | Sector browse for facilitated | Leave as facilitated / org browse. Do not force self-serve into sector SEO in v1. |
| `/` homepage | Hero closer is `/contact` ("Book a conversation") | Hero / first commercial section sells self-serve. Course CTA is buy / start. Facilitated is secondary. |

Catalog rules:

- Public, no login.
- Sort "Latest" by `published_at` descending (new column; see data model).
- Card shows category artwork (`CourseArtwork`), level, hours, **price in GBP**, and a buy verb. Not "Course outline" for self-serve cards.
- Filter chips already exist (`CatalogueFilters`: subject, level). Add **Format**: Self-serve (default) | Facilitated.
- Related insight articles already map via `insightForCourse`. Keep that. Insights close on the course, not on `/contact`.

### 2.2 Checkout: pay then account

**Decision: pay then account.** Guest checkout is allowed. Email is required. Password is not required to buy.

Account-then-pay would reuse `/register`, which today creates an **organisation**, assigns `role: "admin"`, and is the B2B onboarding path (`app/api/auth/register/route.ts`). That is the wrong first screen for an Instagram buyer. It will lose the sale.

#### Why pay-then-account

- Social traffic is cold and mobile. A form that asks for organisation name before a card will not convert.
- Trichology's working pattern is buy first.
- Entitlement is the product. The account exists to resume the player, not to join a tenant.
- We already send branded mail through Resend. A magic link after payment is cheaper than Google OAuth in v1.

#### Happy path (guest)

1. Instagram / LinkedIn creative lands on `/courses/[slug]` (or homepage Latest card).
2. Buyer reads the promise, hours, and price. Primary button: **Buy and start** (£X).
3. Hosted checkout opens. Fields: email, card (and whatever the processor enables: Apple Pay, Google Pay). No password. No organisation name. No Calendly. No `/contact`.
4. Payment captures.
5. Webhook grants entitlement against that email and course.
6. Buyer receives two mails:
   - Receipt (processor + our branded confirmation).
   - **Open your course** magic link (Resend, same shell as `lib/emails/confirm-welcome.tsx`).
7. Magic link hits `/auth/callback` with `next=/learn/[slug]` (or first incomplete lesson).
8. If no user existed, we create one as a **learner** (not an org admin). If the email already has a session, we attach the entitlement.
9. Player starts. Progress is stored. Next visit: magic link again, or email + password if they set one from the player.

#### Happy path (already signed in)

1. Signed-in learner hits **Buy and start**.
2. Checkout pre-fills their email.
3. Webhook attaches entitlement to `auth.uid()`.
4. Redirect straight to `/learn/[slug]`. Receipt still goes to the buyer. Antonio still gets the ops alert.

#### Recoveries

| Case | Behaviour |
| --- | --- |
| Paid, closed the tab | Receipt mail has the magic link. `/login` "Email me a link" also works. |
| Paid twice | Webhook is idempotent on `payment_id`. Second charge refunds or is blocked at checkout if already entitled. |
| Same email, existing org admin | Grant the personal entitlement. Do not create a second org. Do not change their role. |
| Failed payment | Stay on the course page. No account created. |
| Wants a team run | Secondary link only: "Run this live for a team" → existing enquiry form. Never the primary closer. |

#### Auth choices for v1

| Method | v1 |
| --- | --- |
| Guest checkout (email + card) | **Yes. Default.** |
| Magic link after payment | **Yes.** Reuse Supabase `generateLink` + branded Resend. Already how signup confirmation works. |
| Email + password | Optional, set from the player or `/login`. Keep existing password pages. |
| Google | **Not v1.** Add in Phase 2 if magic-link friction shows up. |
| `/register` org signup | **Not** on the self-serve path. Leave it for assessment / org buyers. |

### 2.3 Auth and access

- Catalog and course marketing stay public (`lib/public-routes.ts` already allows `/courses` and `/courses/*`).
- `/learn/*` is **session + entitlement**. Add it as a gated path (sibling to `/dashboard`, or under it).
- Entitlement is a row: this user (or this email, claimed) paid for this course. No entitlement, no video, no checks.
- Resume: store `last_lesson_id` and per-lesson `completed_at`. `/learn/[slug]` opens the first incomplete lesson. `/dashboard/my-learning` already lists facilitated enrolments; extend it with a **Self-serve** block so one page is "where I left off."
- Do not force `user_profiles.org_id` to invent a fake company. Today `org_id` is `NOT NULL` (`001_initial_schema.sql`). v1 needs a learner path: either nullable `org_id` for this role, or a single shared "Experrt learners" holding org created in a migration (not per-buyer orgs). Prefer **one holding org** so existing RLS that assumes `org_id` does not explode. Name it internally. Never show it as a company the buyer "joined."

### 2.4 Course player

Not SCORM. Not a second LMS product. A quiet Experrt page.

**Layout (desktop):** left rail of modules / lessons; centre: video + transcript; right or below: the check for this lesson. **Mobile:** lesson title, player, check, then "Next."

**Structure:** Course → Module (3–6) → Lesson (video or short task). Existing `course_modules` is outline metadata only (`lib/courses.ts`, `lab_url` is an external link). v1 adds a `lessons` table under those modules.

**Progress:** percent of lessons completed. Reuse `components/ui/progress.tsx`. Show it on the player, the catalog card (if entitled), and My Learning.

**Interactive elements (cheap, filmable):**

- End-of-lesson **check**: 2–4 questions or a short written task (paste a verification note, pick the unsafe output).
- Must pass or complete the check to mark the lesson done and unlock the next (soft lock: they can revisit; they cannot skip the check).
- No essay grading. A written task is stored and auto-marked "submitted."
- No chatbot tutor in v1. Experrt AI stays the org workspace. It does not teach or grade this product (same rule as `lib/money-pages.ts`).

**Completion record:**

- When all lessons + required checks are done, issue a **record of completion** using the existing certificate pipeline (`lib/certification.ts`, `/verify/[ref]`, `CertificateIssuedEmail`).
- Eligibility for self-serve: 100% lessons complete and required checks passed. Not attendance. Not a facilitator grade.
- Snapshot must say it is a self-serve completion record, not a live-cohort certificate, and must carry `LITERACY_DISCLAIMER`.
- Cheap badge on My Learning: category artwork + "Completed" + verify link. No gold stars, no cartoon trophies.

### 2.5 Gamification (premium, not childish)

Match the brand: black, air, one type (Space Grotesk display, Inter body, amber brand). Think OpenAI / Grok-minimal, not Duolingo.

| Mechanic | Internal name | What the learner sees |
| --- | --- | --- |
| Points | `practice_score` | "Practice" as a quiet number. Not "XP." |
| Streak | `consecutive_days` | Small line under the player: "3 days in practice." Miss a day, it resets. No guilt email. |
| Standing | `standing` | Foundation → Practised → Fluent. Uses the same seniority language as `COURSE_LEVELS`, not bronze / silver / gold. |
| Unlocks | lesson / module lock | Next lesson after the check. Optional: Fluent standing unlocks a 15% code for the linked facilitated programme (Antonio can turn this off). |
| Completion | existing `certificates` | Record of completion + `/verify/[ref]`. |

Do **not** ship: leaderboards, avatars, confetti, daily quests, push nags, public profiles.

Tone: the player should feel like the homepage hero (horizon illustration, tracking-tight display type, lots of air), not like a gamified app chrome.

### 2.6 UI and design system

Reuse. Do not restyle.

| Token / piece | Where |
| --- | --- |
| Display type | `--font-display` / Space Grotesk, `tracking-[-0.03em]` |
| Body | Inter |
| Brand amber | `--brand` / `#b45309` |
| Category accents | `cat-ai`, `cat-technology`, `cat-robotics` |
| Artwork | `components/course-artwork.tsx` (network / layers / arm) |
| Cards | `rounded-2xl border border-border bg-card` (`CourseCard`) |
| Wordmark | `components/wordmark.tsx` |
| Nav / footer | `components/site-nav.tsx`, `components/public/site-footer.tsx` |
| Dark mode | existing `theme-provider` |

Player chrome: same public layout padding (`pt-14` under the fixed nav), same max width family as courses (`max-w-6xl` / `max-w-5xl`), no new colour palette.

### 2.7 Payments

**Use the rail this repo already charges on: Mooov hosted checkout, which fronts Stripe Checkout.** Do not reopen the transitional Stripe subscription webhook as the primary path.

Facts in the repo:

- `lib/mooov.ts` + `app/api/mooov/webhook/route.ts` are the live card path (credit packs and cohort fees).
- `app/api/stripe/webhook/route.ts` is marked **TRANSITIONAL** and only finishes old Stripe sessions.
- README still says "Payments: Stripe"; that is stale relative to the Mooov cutover.
- Amounts are integer pence, currency `GBP`.
- Receipts / PDFs already exist for invoices (`lib/invoices.ts`, `lib/pdf/invoice-document.tsx`).
- Ops alerts already default to **ag@experrt.com** (`lib/notify-email.ts`). `@kumohr.com` leftovers are forced back to that address. Do not pitch Kumo.

v1 payment design:

1. Course row carries `price_amount` (pence) and `currency` (`GBP`).
2. `POST /api/public/courses/[slug]/checkout` (new, public) creates a `mooov_payments` row with `purpose: 'self_serve_course'`, `course_id`, `buyer_email`, nullable `org_id`.
3. Redirect to Mooov hosted URL (Stripe Checkout UI for the buyer).
4. Webhook captures, grants entitlement, sends:
   - Buyer: receipt + magic link.
   - Antonio: short ops mail to `getNotifyEmail()` (course, amount, email, payment id). Reuse the enquiry-alert pattern in `lib/email.ts`.
5. Refunds: super_admin can void entitlement + refund via the existing processor tools. No self-serve refund button in v1.

If Mooov's schema cannot take a guest (today `mooov_payments.org_id` is `NOT NULL` and `purpose` is only `credit_pack` | `cohort`), do this in order:

1. Widen `purpose` and make `org_id` nullable **or** stamp the holding-org id.
2. Only if Mooov guest checkout is blocked in practice: Stripe Checkout Sessions **for this SKU only** (one-time payment, no `payment_method_types` hardcoding, `StripeClient` instance, webhook signature). Keep Mooov for org credits and cohorts.

VAT: do not enable Stripe Tax until Antonio has an active registration. Price bands below are **gross GBP to show on the page**; confirm tax treatment with him before Phase 1 goes to a preview he can pay on.

### 2.8 Admin (minimal)

Antonio is `super_admin` (`ag@experrt.com` is already the seeded owner).

v1 admin is **not** a CMS. He needs:

| Action | Where |
| --- | --- |
| See purchases | New block on `/dashboard/admin/revenue` (already shows credit packs + cohort sales) plus a simple table: date, email, course, amount, status. |
| Mark published | One toggle per self-serve course (`draft` / `published` / `retired` already exists on `courses.status`). Super-admin only. No module editor. |
| Unpublish | Same toggle. Player stays up for people who already paid. |

Out of v1: lesson editor, video upload UI, quiz builder, multi-tenant authoring, seat licences, discount engine beyond one optional facilitated-programme code.

Content for the ten courses is seeded in a migration (same pattern as `020_courses.sql`). Antonio films; an implementer pastes Mux/Cloudflare playback ids into the seed or a private env-backed table. No media binaries in git. No secrets in git.

---

## 3. Homepage and marketing surfaces

### 3.1 Information architecture

```text
/                          Hero sells self-serve. Latest courses. Facilitated secondary.
/courses                   Catalog. Default: self-serve Latest. Filter: Facilitated.
/courses/[slug]            Buy and start (self-serve) or enquiry (facilitated).
/learn/[slug]              Player. Session + entitlement.
/learn/[slug]/[lesson]     One lesson.
/dashboard/my-learning     Resume both lines.
/dashboard/admin/revenue   Purchases (Antonio).
/ai-literacy-training      Facilitated programme (unchanged closer rules).
/contact                   Enterprise / facilitated only. Never the course closer.
```

Nav: keep the **Academy** item pointing at `/courses` (`components/site-nav.tsx` and the homepage's duplicate `NAV_LINKS`). Do not add Calendly. Do not add a second top-level "Shop."

Footer Learn column already says "Courses" → `/courses`. After v1, that means Latest (buyable) first.

### 3.2 Homepage sketch

Keep the current branded design: horizon illustration, Space Grotesk headline, air, one primary type, amber pill CTA. Change **what the hero sells**, not the art direction.

```text
[ Wordmark ]  Experrt AI   AI literacy   Academy   Use cases   Insights   Sign in   [ Get started ]

                 We train people to use AI
                 with the judgement to check it.

                 Short courses you can buy and finish
                 on your own. Applied AI, Article 4
                 literacy, robotics as operations.

                 [ Start a course ]     Facilitated programmes

                 Latest courses
                 [ Verify the output      £99   Buy ]
                 [ Article 4 literacy     £129  Buy ]
                 [ Technology judgement   £199  Buy ]
                 All courses →

                 For teams
                 Live, in the room or online.
                 Attendance and a dated record.
                 [ See facilitated programmes ]
```

**Copy samples (no em dashes):**

Hero h1 (option A, value-first):

> We train people to use AI with the judgement to check it.

Hero standfirst:

> Short courses you buy and take yourself. Applied AI, Article 4 literacy, and robotics as an operations problem. Not a demo. Not a webinar you abandon.

Primary CTA: `Start a course` → `/courses`.

Secondary CTA: `Facilitated programmes` → `/ai-literacy-training` (not `/contact`).

Latest-courses section heading:

> Latest courses

Card CTA: `Buy and start`.

Facilitated band (below the fold):

> For teams that need a room, a facilitator, and a record. Live, on your work.

Do **not** use "Book a conversation", Calendly, or `/contact` as the closer on the hero or on a self-serve course card. `/contact` stays for enterprise and facilitated scoping only.

### 3.3 `/courses` sketch

Reuse `app/(public)/courses/page.tsx` layout (display h1, filters, card grid).

h1: `Courses`

Standfirst sample:

> Buy a course and start today. Or browse the live programmes we run for teams.

Default filter: **Self-serve**. Cards show price and `Buy and start`.

Facilitated filter: current cards ("Course outline") and the existing assessment band at the bottom.

### 3.4 Course detail sketch (self-serve)

Reuse `app/(public)/courses/[slug]/page.tsx` header (artwork band, category, level, hours). Replace the `#request` enquiry block with checkout for self-serve slugs.

```text
[ artwork ]
Applied AI   Practitioner   2.5 hrs   £99

Verify the output

You already use ChatGPT at work. This course
installs the checking habit so a plausible
answer does not leave your desk.

[ Buy and start · £99 ]

What you will do
  1. See how confident error happens
  2. Run a four-step check on your own work
  3. Write a verification note a colleague can reuse

Modules
  ...

After this
  The live course Prompting and Output Verification
  is the team version, in a room, on your files.

  Run this live for a team →  (enquiry, secondary)
```

### 3.5 Social

Creatives on Instagram and LinkedIn should deep-link to `/courses/[slug]`, not `/contact` and not `/register`. UTM on the checkout request so Antonio can see source on the revenue table (`utm_source=instagram` / `linkedin`).

---

## 4. Ten self-serve courses

These are **new SKUs** with new slugs so we do not collide with the 34 facilitated rows in `lib/published-course-slugs.ts`. Each row names the facilitated course or programme it ladders into.

All ten are designed so Antonio can **film or voice once** (talking head + screen + a worksheet). No live cohort required to fulfil.

Price bands are GBP, retail, v1 starting point. Final number is a single amount on the row (e.g. £99), not a slider.

### 4.1 Verify the output

| | |
| --- | --- |
| **Slug** | `verify-the-output` |
| **Title** | Verify the output |
| **Promise** | You already get an answer from ChatGPT or Copilot in under a minute. This course installs a short, repeatable check so a confident, plausible, wrong result does not reach a customer, a board pack, or a colleague. You will leave with a four-step routine and a verification note you can reuse on Monday. |
| **Target buyer** | Individual contributors and team leads who already use a general AI tool at work and have no standard for checking it. |
| **Length** | 2.5 hours |
| **Price band** | £79–£129 (pilot price: **£99**) |
| **Ladders into facilitated?** | Yes. `prompting-and-output-verification` (7 facilitated hours). |
| **Pilot** | **Yes. Phase 1 course.** Insight already exists: `/insights/ai-output-verification-at-work`. |

Modules:

1. How confident error happens (and why speed makes it worse).
2. A four-step check you can run in five minutes.
3. Prompts that make checking easier, not theatre.
4. Write a verification note a colleague can reuse.
5. What you still do not send (legal, personal, invented citations).

### 4.2 Article 4 literacy that matches the work

| | |
| --- | --- |
| **Slug** | `article-4-literacy-that-matches-the-work` |
| **Title** | Article 4 literacy that matches the work |
| **Promise** | Article 4 is a duty to take measures supporting AI literacy, not a certificate you can buy. This course tells you what the duty actually says, what a proportionate measure looks like by role, and what a dated record contains, so you stop shopping for a PDF that will not help you. |
| **Target buyer** | L&D, HR, risk, and transformation leads asked to "do something about Article 4." |
| **Length** | 2 hours |
| **Price band** | £99–£149 |
| **Ladders into facilitated?** | Yes. Programme page `/ai-literacy-training` and `sponsoring-an-ai-literacy-programme`. |

Modules:

1. What Article 4 requires (and what it does not).
2. Role-proportionate measures: handler, manager, sponsor.
3. What belongs in the record, and what a certificate cannot do.
4. A one-page plan you can take to a sponsor.

### 4.3 Put AI into the work you already do

| | |
| --- | --- |
| **Slug** | `put-ai-into-the-work-you-already-do` |
| **Title** | Put AI into the work you already do |
| **Promise** | Most people try AI on a toy task, then go back to email. This course picks three pieces of work you already own (a draft, a summary, a decision pack), runs them through a tool, and sets a weekly habit so the tool stays in the job rather than in a demo. |
| **Target buyer** | Practitioners with a licence and no habit. |
| **Length** | 3 hours |
| **Price band** | £99–£149 |
| **Ladders into facilitated?** | Yes. `embedding-ai-in-daily-workflows`. |

Modules:

1. Pick the work, not the tool.
2. Draft, summarise, decide: three patterns.
3. A weekly loop that survives a busy month.
4. When the tool is the wrong place to start.
5. Hand-off: what your manager should expect to see.

### 4.4 Technology judgement for directors

| | |
| --- | --- |
| **Slug** | `technology-judgement-for-directors` |
| **Title** | Technology judgement for directors |
| **Promise** | You do not need to become technical. You need a way to tell a real operating change from a slide. This course gives non-technical directors five questions for any AI or automation proposal, a way to read a vendor demo, and a standard for what "good" looks like after ninety days. |
| **Target buyer** | Non-technical directors and heads of function who sign or block spend. |
| **Length** | 2 hours |
| **Price band** | £149–£249 |
| **Ladders into facilitated?** | Yes. `technology-for-non-technical-leaders` and `choosing-technology-well`. |

Modules:

1. What you are actually being asked to buy.
2. Five questions that puncture a demo.
3. Risk, data, and who owns the failure.
4. A ninety-day test you can hold a sponsor to.

### 4.5 Managers, not champions

| | |
| --- | --- |
| **Slug** | `managers-not-champions` |
| **Title** | Managers, not champions |
| **Promise** | Champions do not make training stick. Managers do, in 1:1s and on the work they accept. This course shows line managers how to set a standard for AI use, review output without becoming the helpdesk, and tell whether last month's course is still in the job. |
| **Target buyer** | Line managers whose team "did the AI training" and reverted. |
| **Length** | 2.5 hours |
| **Price band** | £129–£199 |
| **Ladders into facilitated?** | Yes. `leading-an-ai-ready-team` and `running-a-rollout-that-sticks`. Insight: `/insights/managers-not-champions-ai-adoption`. |

Modules:

1. Why champions fail and managers do not have to.
2. A standard you can say out loud in a 1:1.
3. Reviewing AI-touched work without doing it yourself.
4. Signals the training has stuck (and what to do if it has not).
5. What to ask L&D for next, instead of another webinar.

### 4.6 The licences are paid for

| | |
| --- | --- |
| **Slug** | `the-licences-are-paid-for` |
| **Title** | The licences are paid for |
| **Promise** | Copilot, ChatGPT, and the rest are already on the bill. This course is how a practitioner or an ops lead turns an unused licence into three jobs the team actually runs, without buying another tool to feel like progress. |
| **Target buyer** | Ops, IT, and ambitious ICs sitting on unused seats. |
| **Length** | 2 hours |
| **Price band** | £79–£129 |
| **Ladders into facilitated?** | Yes. `getting-value-from-tools-you-already-own`. Insight: `/insights/unused-ai-licences-training-gap`. |

Modules:

1. Inventory what you already pay for (honestly).
2. Three jobs that belong in the existing tool.
3. Access, policy, and the quiet reasons people opt out.
4. A 30-day use plan you can show a budget holder.

### 4.7 Robotics is an operations problem

| | |
| --- | --- |
| **Slug** | `robotics-is-an-operations-problem` |
| **Title** | Robotics is an operations problem |
| **Promise** | A cell that looks good in a vendor video fails on the shift if nobody owns recovery, material flow, or the exception pile. This course is for people who specify or sponsor robotics, not people who build arms. You will leave able to write a one-page operating brief an integrator cannot hide behind. |
| **Target buyer** | Operations, plant, and logistics managers considering a cell or living with a bad one. |
| **Length** | 2.5 hours |
| **Price band** | £129–£199 |
| **Ladders into facilitated?** | Yes. `specifying-a-robotics-deployment` and `robotics-what-it-can-and-cannot-do`. Insight: `/insights/robotics-training-is-an-ops-problem`. |

Modules:

1. What the machine can do, and what the process must do.
2. Specifying outcomes, not a brand of arm.
3. Who owns the cell on a Tuesday night.
4. Safety, exceptions, and the pile the robot will not touch.
5. A one-page operating brief.

### 4.8 The shift, not the integrator

| | |
| --- | --- |
| **Slug** | `the-shift-not-the-integrator` |
| **Title** | The shift, not the integrator |
| **Promise** | Integrators leave. The shift stays. This course trains supervisors and operators to work alongside a cobot: start, stop, recover, and know when to call a human, without pretending they are robotics engineers. |
| **Target buyer** | Shift supervisors and operators who have (or will have) a cobot on the line. |
| **Length** | 2 hours |
| **Price band** | £79–£129 |
| **Ladders into facilitated?** | Yes. `working-alongside-a-cobot`. Insight: `/insights/cobot-training-for-the-shift-not-the-integrator`. |

Modules:

1. What a cobot is for on your shift (and what it is not).
2. Start, stop, recover: the three drills.
3. When to stop and call a person.
4. Handover notes the next shift can trust.

### 4.9 Numbers you can defend

| | |
| --- | --- |
| **Slug** | `numbers-you-can-defend` |
| **Title** | Numbers you can defend |
| **Promise** | AI will draft the chart. You still own the number. This course is how analysts and anyone who puts figures in front of a manager use a model for first-pass analysis without shipping a hallucinated total, a silent filter, or a chart that cannot be rebuilt. |
| **Target buyer** | Analysts, finance, and ops people who already paste spreadsheets into a chat tool. |
| **Length** | 2.5 hours |
| **Price band** | £99–£149 |
| **Ladders into facilitated?** | Yes. `ai-for-analysis-and-reporting`. |

Modules:

1. Where models invent a number (and how it looks plausible).
2. A rebuild test: if you cannot replay it, you cannot send it.
3. Charts, commentary, and the sentence that overclaims.
4. A working file: prompt, check, source, sign-off.
5. What never goes into the tool.

### 4.10 Everyday security for people who use AI

| | |
| --- | --- |
| **Slug** | `everyday-security-for-people-who-use-ai` |
| **Title** | Everyday security for people who use AI |
| **Promise** | Most leaks from AI use are ordinary: a client name in a prompt, a screenshot into a free tool, a setting nobody changed. This short course is the hygiene standard for anyone who pastes work into a model, without turning you into a security engineer. |
| **Target buyer** | Any employee already using a public or work AI tool. |
| **Length** | 1.5 hours |
| **Price band** | £59–£99 |
| **Ladders into facilitated?** | Yes. `everyday-security-for-busy-teams` and `responsible-ai-use-at-work`. |

Modules:

1. What you just pasted, and who can see it.
2. Settings that matter (retention, training, plugins).
3. A short red-list: names, files, and tools you do not use.
4. What to do in the first hour if something went out.

### 4.11 Ladder map (at a glance)

| Self-serve | Hours | Band (GBP) | Facilitated slug / programme |
| --- | --- | --- | --- |
| Verify the output | 2.5 | 79–129 | `prompting-and-output-verification` |
| Article 4 literacy that matches the work | 2 | 99–149 | `/ai-literacy-training`, `sponsoring-an-ai-literacy-programme` |
| Put AI into the work you already do | 3 | 99–149 | `embedding-ai-in-daily-workflows` |
| Technology judgement for directors | 2 | 149–249 | `technology-for-non-technical-leaders` |
| Managers, not champions | 2.5 | 129–199 | `leading-an-ai-ready-team` |
| The licences are paid for | 2 | 79–129 | `getting-value-from-tools-you-already-own` |
| Robotics is an operations problem | 2.5 | 129–199 | `specifying-a-robotics-deployment` |
| The shift, not the integrator | 2 | 79–129 | `working-alongside-a-cobot` |
| Numbers you can defend | 2.5 | 99–149 | `ai-for-analysis-and-reporting` |
| Everyday security for people who use AI | 1.5 | 59–99 | `everyday-security-for-busy-teams` |

---

## 5. Engineering plan (grounded in this repo)

### 5.1 What already exists

| Area | Exists | Notes |
| --- | --- | --- |
| Course catalogue DB | Yes | `courses`, `course_modules`. Global, Experrt-owned. RLS: anonymous reads `published`. Super-admin writes. Seeded in `020`, `024`, `033`, `038`. |
| Public catalog UI | Yes | `/courses`, `/courses/[slug]`, sector pages, OG images, JSON-LD. |
| Course cards / artwork | Yes | `components/courses/*`, `components/course-artwork.tsx`. |
| Enquiry → ops | Yes | `CourseEnquiryForm`, `course_enquiries`, mail to `ag@experrt.com`. **Keep as facilitated closer only.** |
| Auth | Yes | Supabase email + password. Magic-link style `generateLink` on register. **No Google.** `/register` creates an org + admin. |
| Learner dashboard | Partial | `/dashboard/my-learning` is **cohort sessions**, attendance %, certificates. |
| Certificates + verify | Yes | `lib/certification.ts`, issue/revoke APIs, `/verify/[ref]`, email. Built for attendance + grade. |
| Payments | Yes | **Mooov** (Stripe-hosted UI). Cohort + credit packs. Invoice path for contract orgs. Stripe webhook is transitional. |
| Admin revenue | Yes | `/dashboard/admin/revenue`, invoices, billing. No course-purchase table yet. |
| Publish UI | No | Status column + RLS only. Catalogue edits are SQL. |
| Course player | No | Explicit non-goal of the current product. |
| Lessons table | No | Modules are outlines. `lab_url` is an external link. |
| Lesson progress / quizzes | No | Quiz v2 (`013_quiz_v2.sql`) is the **assessment** product, not course content. |
| Gamification | No | |
| Tenant course authoring | No | Comment in `020` promised "migration 023"; `023` was an RLS fix. **Remains shelved.** |
| Kumo seats | No product | Only a notify-email guard for `@kumohr.com`. Do not pitch. |

### 5.2 What to build (v1)

1. Format + price on `courses` (or a child `course_offers` table) for the ten SKUs.
2. `lessons`, `course_enrollments` (self-serve), `lesson_progress`, `lesson_checks`.
3. Public checkout endpoint + webhook purpose `self_serve_course`.
4. Learner identity path (holding org or nullable `org_id`) + magic-link claim.
5. `/learn/[slug]` player + signed video URLs.
6. Homepage Latest section + catalog format filter + buy CTA.
7. My Learning self-serve block.
8. Revenue purchases table + publish toggle.
9. Completion records via existing certificates, with a distinct snapshot.
10. Practice score / streak / standing (small table, quiet UI).

### 5.3 Proposed data model

Reuse `courses` and `course_modules`. Do not reuse `enrolments` (that table is cohort-shaped: attendance, grades, facilitator). New tables keep the facilitated queries honest.

```text
courses                          (existing)
  + format            text        'facilitated' | 'self_serve'
  + price_amount      int         pence, null for facilitated
  + currency          text        default 'GBP'
  + published_at      timestamptz
  + ladders_to_slug   text        existing facilitated slug or programme path

course_modules                   (existing)
lessons                          (new)
  id, module_id, position
  title, summary
  content_kind        'video' | 'task'
  playback_id         text        Mux / Cloudflare id, not a raw secret
  duration_seconds    int
  check_spec          jsonb       questions or task prompt
  created_at

course_enrollments               (new, self-serve only)
  id, user_id, course_id
  status              'pending' | 'active' | 'completed' | 'refunded'
  source              'instagram' | 'linkedin' | 'web' | 'other'
  payment_id          text
  last_lesson_id      uuid
  practice_score      int
  consecutive_days    int
  last_practised_on   date
  standing            'foundation' | 'practised' | 'fluent'
  completed_at
  unique (user_id, course_id)

lesson_progress                  (new)
  enrollment_id, lesson_id
  started_at, completed_at
  check_passed        bool
  response            jsonb
  unique (enrollment_id, lesson_id)

mooov_payments                   (existing, widen)
  + purpose includes 'self_serve_course'
  + course_id
  + buyer_email
  org_id nullable or holding-org

certificates                     (existing)
  snapshot.kind = 'self_serve_completion'
```

RLS sketch:

- Published self-serve courses readable by anyone (same as today).
- Lessons readable only if the course is published **and** (user is entitled **or** super_admin). Marketing pages read module titles only, not `playback_id`.
- Enrollments and progress: owner or super_admin.
- Payments: service role write, super_admin read.

### 5.4 Route and API sketch

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/courses`, `/courses/[slug]` | Public (extend) |
| POST | `/api/public/courses/[slug]/checkout` | Public |
| POST | `/api/mooov/webhook` | HMAC (extend purpose) |
| GET | `/learn/[slug]`, `/learn/[slug]/[lesson]` | Session + entitlement |
| POST | `/api/learn/progress` | Session + entitlement |
| POST | `/api/learn/check` | Session + entitlement |
| GET | `/api/my-learning` | Session (extend) |
| PATCH | `/api/admin/courses/[id]/status` | Super-admin |
| GET | `/api/super-admin/revenue` | Super-admin (extend) |

Add `/learn` to `isSessionGatedPath` in `lib/public-routes.ts`. Checkout and (if used) Stripe webhook stay public like `/api/mooov/webhook`. Extend `lib/__tests__/public-routes.test.ts`.

### 5.5 Phased build

#### Phase 0: scaffolding (this document)

- Scope only.
- No player. No checkout. No new env secrets in the repo.
- Optional later: empty types and a `format` column behind a feature flag that defaults **off** on production. Prefer not to land even that until a build branch exists.

#### Phase 1: pilot, *Verify the output*

One course, real money on a **preview**, never on `aiadop` production until Antonio says so.

- Schema for the new tables + one seeded course (draft until he publishes).
- Checkout + webhook + magic link + player + one module of real video.
- Receipt to buyer, alert to `ag@experrt.com`.
- My Learning resume.
- Completion record.
- Homepage Latest can show the single pilot if published.
- Feature flag `SELF_SERVE_COURSES` default false on production.

Definition of a good Phase 1: Antonio can pay with a test card on a preview URL, open the course from the mail, finish it, and see the purchase on admin revenue.

#### Phase 2: ten courses and polish

- Seed the other nine (draft).
- Catalog format filter, prices on cards, Latest of three on the homepage.
- Checks, practice score, streak, standing.
- Publish toggle.
- UTM on purchases.
- Optional Google sign-in.
- Optional facilitated discount unlock.

#### Phase 3: shelved

Company / tenant course-authoring. White-label "companies create their own courses." Multi-tenant CMS. Partner-authored catalogues. Not scheduled.

### 5.6 Explicit non-goals for v1

- Production deploy, `main` merge, or any change to Vercel project `aiadop`.
- Company multi-tenant course creation.
- Kumo seats, per-seat licences, or reviving Basic/Pro/Enterprise as the offer.
- Calendly, `/contact`, or enquiry as the self-serve closer.
- SCORM, xAPI, or a generic LMS.
- Experrt AI as tutor or grader of these courses.
- Article 4 compliance claims or a certificate shop.
- Replacing facilitated cohorts, evidence packs, or the assessment funnel.
- Video files or API keys committed to git.
- Stripe Tax without a registration.
- Leaderboards, childish gamification, or public learner profiles.
- Native mobile apps.

---

## 6. Test plan and definition of done (for this scope, not for prod)

This section is how we know **the scope is complete**, not how we ship experrt.com.

### 6.1 Done for this document

- [x] Grounded in the current repo (routes, auth, Mooov/Stripe, catalogue, admin, mail).
- [x] Learner portal only; company authoring shelved.
- [x] Pay-then-account chosen, with a written happy path.
- [x] Homepage / `/courses` IA and copy samples; course closer is buy / start.
- [x] Exactly ten courses, each with promise, buyer, hours, modules, GBP band, ladder.
- [x] Phases 0–3 and non-goals, including no production deploy.
- [x] No secrets. No em dashes in user-facing copy samples.
- [x] Draft PR, docs only.

### 6.2 Tests an implementer must add in Phase 1 (preview)

| Layer | Cases |
| --- | --- |
| Unit | Entitlement grant is idempotent. Progress % math. Standing thresholds. Certificate snapshot includes disclaimer and `self_serve_completion`. `isPublicPath('/api/public/courses/x/checkout')`. Notify email still `ag@experrt.com` if `NOTIFY_EMAIL` is a `@kumohr.com` leftover. |
| RLS | Anonymous cannot read `playback_id`. Other users cannot read another learner's progress. Super-admin can. |
| Checkout | Guest pay → mail → magic link → player. Signed-in pay → player. Double submit does not double charge. Failed pay creates no entitlement. |
| Player | Resume opens the first incomplete lesson. Check required to complete. Unsigned user hitting `/learn` goes to login with `next=`. |
| Admin | Purchase appears with email, course, pence. Publish/unpublish hides the catalog card but not a paid player's access. |
| Copy | No `/contact` or Calendly on self-serve closers. No "compliant" / "Article 4 certificate" strings on the player or completion mail. |
| Browser | Homepage Latest → course → buy (test mode) → player, desktop and a mobile viewport. Facilitated course page still shows enquiry, not a fake price. |

### 6.3 What "done" is not

Passing the list above on a preview is not permission to promote `aiadop` or merge to `main`. Antonio signs off content, price, and tax before any production conversation.

---

## 7. Risks and open calls for Antonio

These are product calls, not blockers for this scope:

1. **Pilot price.** Scope assumes **£99** for *Verify the output*. He can move inside the band.
2. **VAT.** Confirm whether prices are inclusive and whether Experrt is registered to collect.
3. **Holding org vs nullable `org_id`.** Engineering prefers a single hidden holding org so current RLS keeps working.
4. **Video host.** Mux or Cloudflare Stream, signed playback. Not YouTube unlisted (leaks). Not files in this git repo.
5. **Hero copy.** Option A above is value-first and keeps robotics / Article 4 available in the standfirst. He may want his face or a specific line from AI with Antonio.
6. **Insight tension.** The in-person vs LMS article should later add one sentence: self-serve is for individuals; live remains the team record. Do not rewrite that article in this PR.

---

## 8. File map for the first build branch (later)

When a build is authorised, start here. Do not do this on the live project.

| Touch | Why |
| --- | --- |
| `supabase/migrations/039_*.sql` | New tables, widen `mooov_payments.purpose`, seed pilot as `draft`. |
| `lib/types.ts`, `lib/constants.ts`, `lib/courses.ts` | Format, price, fetch Latest. |
| `lib/public-routes.ts` + tests | Checkout public; `/learn` gated. |
| `app/(public)/courses/*`, `app/page.tsx` | Catalog + homepage Latest. Homepage has a **duplicate nav** (comment in file); change both or extract. |
| `app/learn/**` | Player. |
| `app/api/public/courses/[slug]/checkout` | Guest pay. |
| `app/api/mooov/webhook/route.ts` | New purpose. |
| `lib/email.ts`, `lib/emails/*` | Receipt + magic link + Antonio alert. |
| `app/dashboard/(control)/my-learning` | Resume. |
| `app/dashboard/(control)/admin/revenue` | Purchases + publish. |
| `components/courses/course-card.tsx` | Price + buy verb for self-serve. |

Do not edit Vercel project settings. Do not put keys in `.env` files that get committed. Local `.env.local` stays local (README already lists the pattern).

---

## 9. One-page summary for Antonio

We add a **buy-and-take** path on experrt.com for ten short courses you can film once. People coming from Instagram and LinkedIn pay first (guest, email + card), get a magic link, and resume in a player that looks like the current site. You see the purchase and you can publish or hide a course. Live programmes stay. Companies do not get a course builder.

First build, when you say go: **Verify the output** at £99, on a preview, not on production.
