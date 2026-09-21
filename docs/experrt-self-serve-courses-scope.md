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
4. Forty self-serve courses: ten in AI, ten in technology, ten in robotics, ten in HR transformation.
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
| **Self-serve (this scope)** | Individual from Instagram or LinkedIn. Four tracks: AI, technology, robotics, HR transformation. Ten courses each. | Buy / start course | Personal progress + completion record |
| **Facilitated (already live)** | Organisation / L&D | Conversation, then cohort | Attendance, grades, evidence pack |

Copy rule that must survive implementation: a self-serve course is **skill and judgement**, not Article 4 compliance. Keep `LITERACY_DISCLAIMER` in `lib/constants.ts`. No certificate shop. No "this makes you compliant."

---

## 2. Product scope: Experrt learner portal (v1)

### 2.1 Catalog

Reuse the existing public routes. Do not invent `/academy` or a second site.

| Surface | Today | v1 |
| --- | --- | --- |
| `/courses` | 34 facilitated outlines, enquiry CTA, assessment CTA | Default view is the four self-serve tracks (ten courses each) with price and **Buy and start**. Facilitated catalogue remains a second filter. |
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
- Entitlement is a row: this user (or this email, claimed) paid for this course. No entitlement, no lesson text, no practice.
- Resume: store `last_lesson_id` and per-lesson `completed_at`. `/learn/[slug]` opens the first incomplete lesson. `/dashboard/my-learning` already lists facilitated enrolments; extend it with a **Self-serve** block so one page is "where I left off."
- Do not force `user_profiles.org_id` to invent a fake company. Today `org_id` is `NOT NULL` (`001_initial_schema.sql`). v1 needs a learner path: either nullable `org_id` for this role, or a single shared "Experrt learners" holding org created in a migration (not per-buyer orgs). Prefer **one holding org** so existing RLS that assumes `org_id` does not explode. Name it internally. Never show it as a company the buyer "joined."

### 2.4 Course player

Not SCORM. Not a video library with a worksheet taped on. A quiet Experrt page where the **writing is the course** and the learner does the work before they move on.

**Decision (Antonio, 21 Sep 2026):** text and interaction ship first. He will film, but filming must not gate launch. A lesson is complete with no video. When a film exists, it is added to that lesson and the learner can watch it. They can also skip it.

**Jump straight in.** After payment the magic link opens lesson 1 on the theory, not an intro, not a trailer, not a "how to use this player" screen. If they already have an account, checkout returns them to the same place.

**Every lesson has the same three beats:**

| Beat | Required? | What it is |
| --- | --- | --- |
| **Theory** | Always | One decision, then the mechanism in plain words, then one worked example. Technical enough to be true. Short enough to follow in one sitting. |
| **Watch** | Only if filmed | Antonio's walkthrough of the same lesson. Rendered only when `playback_id` is set. No empty player. No "video coming soon" placeholder. |
| **Do the work** | Always | They mark, build, or check a real object. The lesson is not done until that check passes. |

**Layout:** one reading column, not a dashboard. The lesson moves through frames (read, watch only if filmed, do the work). The lesson index is a panel they open, not a permanent sidebar. Detail is in 2.4a. Phone and desktop use the same column; the phone just has less air.

**Structure:** Course → Module (3–6) → Lesson (theory + practice, video optional). Existing `course_modules` is outline metadata only (`lib/courses.ts`, `lab_url` is an external link). v1 adds a `lessons` table under those modules. Lesson body is markdown in the database, seeded like the catalogue. Not a file in git full of media.

**Progress:** percent of lessons whose practice is done. Watching is not progress. Skipping a film is not a fail. Reuse `components/ui/progress.tsx` on the player, the catalog card (if entitled), and My Learning.

**Depth that is easy to follow.** Each lesson opens with the decision in one sentence. The next part is the mechanism: how a model invents a clause, how a prompt is structured, how a cell stops, how a people-data paste leaks. One worked example shows that mechanism on a real object. A term is named once, in a single plain line, then used precisely. No chapter, no pep talk, no tour. If they can follow the example, they can do the task.

**Interactivity (on the object, not beside it):**

- **Mark.** They tap a sentence in the example. It highlights. They mark it pass or fail. The reason appears under that sentence.
- **Choose.** Two drafts sit side by side. They pick one. The difference is revealed on the page.
- **Order.** They put the steps of a check or a recovery in sequence. A wrong order explains why that step cannot come first.
- **Build.** The artefact grows line by line as each part passes. They watch the prompt card, the brief, or the shift card form in front of them.
- **Check their own.** They bring their work. Named fields must be filled. Where a rule exists (all four checks marked, role and output format both present, a refusal test written), `Continue` stays off until the rule passes. An empty box does not count.

Wrong answers stay on the page with the reason. They retry. No timer, no lives, no score out of ten. No chatbot tutor in v1. Experrt AI does not teach or grade this product.

**Validation before a certificate.** The last frame of the course shows their artefact back to them as the finished object. They confirm each required part and sign it: their name, and that they would use it on Monday. The certificate is issued only after that confirmation and only after every required check has passed. Clicking through does not earn it.

The course leaves them holding that artefact. That is why the price is real before any film exists.

Soft lock: they can reread any earlier lesson. They cannot open the next lesson until the check on this one passes.

**Value bar (a lesson fails this if any line is false):**

1. It teaches one decision, not a tour of features.
2. The mechanism is technically true, shown on one example, and readable in one sitting. Aim under 800 words.
3. The practice uses their material or a realistic artefact from the job in the course promise.
4. A wrong answer teaches the miss. It does not say "try again" with no reason.
5. Video, when it arrives, walks the same decision and the same artefact. It does not add a second curriculum.
6. A free post cannot hand them the same result. The lesson is the work, not a summary of the work.
7. `Continue` is impossible until the check passes. The certificate is impossible until every check has passed and they have signed the artefact.

**Adding film later (no rebuild):**

- Super admin pastes a playback id and a duration on a lesson that is already published.
- Next page load shows Watch above the theory. Progress, answers, and saved tasks stay put.
- No "new video" email in v1. The player is the announcement.
- Buyers who finished the course can reopen the lesson and watch. Completion is not revoked and not re-required.

### 2.4a The interface is the lesson

The screen is part of what they paid for. It should feel like stepping into the homepage: horizon, one type, a lot of air. It should not feel like a training admin tool with the lesson pasted in the middle.

**Focused shell.** On `/learn`, the marketing links (Academy, Insights, Pricing) step back. Left on the bar: the wordmark, the course title in small muted type, and a 1px brand hairline showing how much of the course is done. That hairline is the insight reading bar (`components/public/reading-progress.tsx`) driven by lessons finished, not by scroll. "Lessons" opens the index over the page and closes when they pick one. The default is the column.

**One column.** Lesson title in Space Grotesk, `tracking-[-0.03em]`. Body in Inter, about the width of an insight (`max-w-2xl`), with real vertical space between ideas. Category colour shows once: the artwork, or a soft band behind the title. It does not become a row of badges inside the lesson.

**Three frames, one object.**

| Frame | What they see |
| --- | --- |
| Read | Title, one sentence, the theory. The worked example is typeset as the thing it is: an email, a line in a board pack, a one-page brief. Same card as the site (`rounded-2xl`, hairline border, `bg-card`). |
| Watch | Only when that lesson has a film. The film sits in the same card, the width of the column. No related-video strip. No autoplay with sound. One line under it: "This is the same method, on screen." They can move on without playing it. |
| Do the work | The same object again, now in their hands. Judgement means choosing between drafts that look like drafts. The reason appears under the choice in muted type. An applied task is a sheet with named lines, not a box labelled "Your answer". |

A right choice settles: the border goes quiet and the reason stays. A wrong choice shows the reason and remains so they can choose again. Nothing shakes. Nothing stamps a red X. There is no score out of ten on the frame.

For *AI Output Verification*, the sheet is four lines they fill and keep: source, date, names and numbers, would you sign it. Saving happens in place. That sheet is the artefact.

**Continue.** One pill at the end of the last frame, the same shape as the homepage CTA. The label is `Continue`. It enables when the practice is done, then opens the next lesson. The move is the homepage fade: opacity and a short rise, about half a second, via the `framer-motion` already on `app/page.tsx`. `useReducedMotion` makes that instant.

**The last page.** The final confirmation opens a still page. Their signed artefact. Then the certificate, set like a document, not a popup. Course artwork or the horizon illustration sits behind the type at low opacity, the way `SectionAnchor` sits behind homepage copy. No modal. No sound.

**Theme.** Use the tokens already in `app/globals.css`. Light is warm white and `#191919`. Dark is the existing deep black (`#0d0d0d` background, `#ececec` type). The player follows the site theme. It does not invent a third "learning" palette.

**Sound.** None in v1. Quiet is part of the room.

**Keep this out of the column, or the room collapses:**

- A fixed sidebar of modules, doughnuts, and "Mark as complete".
- An exam layout: question numbers, a Submit button, a percentage.
- A video on top and a worksheet underneath, which is the failure mode of this design.
- Toasts, stickers, or a streak mark on every frame. Practice and standing live on My Learning, and as one quiet line when they leave the lesson. Not in the reading measure.

**Certificate.** This is a designed object, earned, and publicly checkable. It uses the pipeline that already exists: `lib/certification.ts` for the rules shape, a frozen snapshot, `/verify/[ref]`, and `CertificateIssuedEmail`. Self-serve does not reuse the attendance-and-grade rule. It issues only when every required check has passed and the learner has signed the artefact.

What they receive:

- A page at `/verify/[ref]` in the same type and air as the lesson. Wordmark. Course title in Space Grotesk. Their name. The date. The name of the artefact they signed. The public reference. A line that anyone can use to confirm the record is genuine.
- A PDF of that same page, via the existing React PDF path (`lib/pdf/`), so they can keep it and send it.
- The mail they already know from cohort certificates, pointed at this record.
- A copyable line and the verify link for LinkedIn or a CV. v1 does not call a LinkedIn API.

What the certificate says: they completed this course and signed this artefact. It does not say they are compliant, qualified to the EU AI Act, or certified as a practitioner of a regulated profession. The snapshot carries `LITERACY_DISCLAIMER` wherever the course touches literacy or the Act.

My Learning shows the certificate as that document in miniature, with the verify link. No gold star, no cartoon trophy, no share-confetti.

Eligibility is checks passed plus the signed artefact. Not attendance. Not a facilitator grade. Not time on the page.

### 2.5 Gamification (premium, not childish)

Match the brand: black, air, one type (Space Grotesk display, Inter body, amber brand). Think OpenAI / Grok-minimal, not Duolingo.

| Mechanic | Internal name | What the learner sees |
| --- | --- | --- |
| Points | `practice_score` | "Practice" as a quiet number. Not "XP." |
| Streak | `consecutive_days` | Small line under the player: "3 days in practice." Miss a day, it resets. No guilt email. |
| Standing | `standing` | Foundation → Practised → Fluent. Uses the same seniority language as `COURSE_LEVELS`, not bronze / silver / gold. |
| Unlocks | lesson / module lock | Next lesson after the check. Optional: Fluent standing unlocks a 15% code for the linked facilitated programme (Antonio can turn this off). |
| Completion | existing `certificates` | Designed certificate, PDF, and `/verify/[ref]`. |

Do **not** ship: leaderboards, avatars, confetti, daily quests, push nags, public profiles.

These sit outside the reading column. The lesson itself stays a room. Practice, standing, and the streak are visible when they pause or finish, on My Learning and as one quiet line, in the same type as the rest of the site.

### 2.6 UI and design system

Same tokens, new composition. The catalog and homepage keep today's cards and nav. The lesson is the focused room in 2.4a, built from these pieces rather than a new visual language.

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

The lesson column uses the insight measure (`max-w-2xl`) under the same fixed bar offset (`pt-14`). The index panel and the end page can use the wider course measure (`max-w-5xl` / `max-w-6xl`). No new colour palette. Motion reuses the homepage fade and the reduced-motion check. The 1px progress hairline reuses the insight reading-bar pattern.

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
| Mark published | One toggle per self-serve course (`draft` / `published` / `retired` already exists on `courses.status`). Super-admin only. |
| Unpublish | Same toggle. Player stays up for people who already paid. |
| Attach a film | One field per lesson: playback id + duration. Empty means the lesson is text and practice only. Saving it does not reset anyone's progress. |

Out of v1: a full lesson editor, video upload UI, quiz builder, multi-tenant authoring, seat licences, discount engine beyond one optional facilitated-programme code.

Theory and practice are seeded in a migration, wave by wave. The first four social courses are written in full before they are published. The other thirty-six can sit as drafted outlines until their wave. (same pattern as `020_courses.sql`). Antonio writes or approves that prose before publish. Film is not in the seed. When a lesson is filmed, he (or an implementer) sets the playback id in the admin field. No media binaries in git. No secrets in git.

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

                 Courses you can start today.
                 AI. Technology. Robotics. HR.

                 Buy a course, open lesson 1, and do the work.
                 For the person who saw the post, and for the
                 team they go back to on Monday.

                 [ Browse courses ]     Facilitated programmes

                 AI                  Prompting, agents, real work
                 Technology          The tools you already pay for
                 Robotics            What they can do, and who runs them
                 HR transformation   Skills, hiring, learning, adoption

                 Start here
                 [ Prompt Engineering for Professional Work      £99   Buy ]
                 [ Robotics for Non-Engineers                    £99   Buy ]
                 [ AI for HR and People Teams                    £99   Buy ]

                 For teams
                 Live, in the room or online.
                 Attendance and a dated record.
                 [ See facilitated programmes ]
```

**Copy samples (no em dashes):**

Hero h1 (option A, value-first):

> Courses you can start today.

Hero standfirst:

> AI, technology, robotics, and HR transformation. Buy a course, open lesson 1, and do the work on something you already own. For the person who saw the post, and for the team they go back to on Monday.

Primary CTA: `Browse courses` → `/courses`. Track buttons go to `/courses?category=ai`, `technology`, `robotics`, and `hr`.

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

> Buy a course and start on the first lesson today. Read it, do the work, and watch a walkthrough where one has been filmed. Or browse the live programmes we run for teams.

Default filter: **Self-serve**. Cards show price and `Buy and start`.

Facilitated filter: current cards ("Course outline") and the existing assessment band at the bottom.

### 3.4 Course detail sketch (self-serve)

Reuse `app/(public)/courses/[slug]/page.tsx` header (artwork band, category, level, hours). Replace the `#request` enquiry block with checkout for self-serve slugs.

```text
[ artwork ]
Applied AI   Practitioner   2.5 hrs   £99

AI Output Verification

You already use ChatGPT at work. This course
installs the checking habit so a plausible
answer does not leave your desk.

[ Buy and start · £99 ]

You start on lesson 1 the moment you pay.
No intro. No waiting for a film date.

What you will do
  1. Read how confident error happens
  2. Run a four-step check on your own work
  3. Leave with a verification note a colleague can reuse

Walkthroughs
  Watch sits on a lesson only after it is filmed.
  The course is complete without them.

Modules
  ...

After this
  The live course Prompting and Output Verification
  is the team version, in a room, on your files.

  Run this live for a team →  (enquiry, secondary)
```

### 3.5 Social

A reel or a LinkedIn post names one course and links to `/courses/[slug]`. A series links to the track: `/courses?category=ai`, `technology`, `robotics`, or `hr`. Never `/contact` and never `/register`. UTM on the checkout request so Antonio can see which post sold (`utm_source=instagram` or `linkedin`).

First four to publish, one per audience, so inbound has somewhere to land:

1. Prompt Engineering for Professional Work
2. Getting Value from the Technology You Already Pay For
3. Robotics for Non-Engineers
4. AI for HR and People Teams

---

## 4. Forty self-serve courses

Four tracks, ten courses each. A person who sees a post should recognise themselves in one track and be able to buy in that session.

| Track | Who it is for | Where a post sends them |
| --- | --- | --- |
| AI | Anyone already using ChatGPT, Copilot, Claude, or a similar tool | `/courses?category=ai` |
| Technology | People who live in the tools the company already pays for | `/courses?category=technology` |
| Robotics | Curious professionals and operators, not only engineers | `/courses?category=robotics` |
| HR transformation | HR, L&D, and people managers | `/courses?category=hr` |

`hr` is a new value on `COURSE_CATEGORIES` in `lib/constants.ts`. AI, technology, and robotics already exist. Add one artwork in the same line family as `components/course-artwork.tsx`. Do not add a fifth colour system.

Titles are catalogue names a person can say out loud in a reel. They name the skill. They are the words on the card, the receipt, and the completion record.

Every course is written theory plus practice. Film is added later and is not required to publish. Prices are GBP bands. The number on the card is one price inside the band. Common courses sit at £79 to £149. Specialist courses sit higher. Nothing is priced like a tip sheet.

**A course is not publishable unless the buyer leaves with something they would otherwise pay a person to produce.** That is a prompt card, a verification note, an agent that has been tested, a specification, a selection standard, a skills plan, a shift card. A tour, an opinion, or "the future of" fails. If a reel could replace the course, the course is rewritten or cut before it goes on sale. Breadth is how we reach people. The artefact is why they do not regret paying.

The agent courses are not a coding bootcamp. A strong prompt still gets checked. Robotics here is for a general audience as well as operators. Facilitated programmes stay available as the team version.

Publish in waves. Do not wait for all forty scripts. The first post in each track needs one finished course behind it. See the four named in section 3.5.

### 4.1 AI

#### Prompt Engineering for Professional Work

You already get a weak answer because the brief was weak. This course shows you how to instruct a model the way you would brief a sharp colleague: role, context, constraints, and the shape of the output. You leave with a prompt card someone else on your team can run.

Buyer: anyone who uses a general AI tool at work and wants a better result tomorrow. Hours: 2.5. Price: £79–£129, card price **£99**. Social launch course for the AI track. Ladders into `prompting-and-output-verification`.

Modules:

1. Brief the model the way you would brief a colleague.
2. Role, context, constraints, and output format.
3. Fix a weak result instead of starting again.
4. A prompt card a colleague can reuse.
5. What you still check before it leaves your desk.

#### AI Output Verification

A fast answer is not a finished answer. You learn a four-step check so a confident, plausible, wrong result does not reach a customer, a manager, or a colleague. You leave with a verification note you can use on Monday.

Buyer: anyone who already pastes work into an AI tool. Hours: 2.5. Price: £79–£129. Ladders into `prompting-and-output-verification`.

Modules:

1. How confident error happens.
2. A four-step check you can run in five minutes.
3. Judge three real outputs: send, fix, or hold.
4. Write the verification note.
5. What you still do not send.

#### Applying AI in Daily Work

Pick three pieces of work you already own and put the tool inside them, then build a weekly habit so it does not die after the demo. You leave with a one-week plan.

Buyer: professionals with a licence and no habit. Hours: 2.5. Price: £79–£129. Ladders into `embedding-ai-in-daily-workflows`.

Modules:

1. Pick the work, not the tool.
2. Draft, summarise, decide.
3. A weekly loop that survives a busy month.
4. When the tool is the wrong place to start.

#### AI for Writing and Communication

Email, a slide narrative, a briefing note. You use AI to get to a draft faster, then you take back the judgement: audience, claim, and what you are willing to sign. You leave with one finished piece from your own week, and a short standard a colleague can apply to the next one.

Buyer: anyone who writes for other people at work. Hours: 2. Price: £79–£129. Ladders into `writing-and-communicating-with-ai`.

Modules:

1. What the model is good at in a first draft.
2. Audience, claim, and the sentence that overreaches.
3. Rewrite a real email or note from this week.
4. A standard you can hand a colleague.

#### Designing AI Agents for Business Workflows

An agent is a standing worker with one job, not a cleverer chat. You choose a repeating task, write the job so it cannot wander, and mark the step where a person has to say yes. You leave with a one-page agent brief.

Buyer: team leads and operators about to automate a task. Hours: 2.5. Price: £99–£149. Ladders into `building-ai-assistants-for-your-team`.

Modules:

1. What an agent is, and what is still just a prompt.
2. One job. Not a general assistant.
3. Tools you will grant, and actions you will not.
4. Where a person approves before anything is sent.
5. The one-page brief.

#### Setting Up and Supervising AI Agents

Take the brief and stand the agent up in a tool the organisation already pays for. Standing instructions, only the tools that job needs, and three tests, including the action it must refuse. You leave with a working setup and a supervision note.

Buyer: the person who will actually configure it. Not a software engineering course. Hours: 3. Price: £149–£199. Ladders into `ai-tooling-and-integration-clinic`.

Modules:

1. Turn the brief into standing instructions.
2. Connect only the tools that job needs.
3. Three tests: normal, missing fact, must refuse.
4. What you watch in the first two weeks.
5. A supervision note for when you are away.

#### AI for Customer Communications

Replies, proposals, and complaint acknowledgements are where a wrong sentence does the most damage. You learn three patterns and a send-or-hold rule. You leave with a note the team can reuse.

Buyer: customer service, sales, and account managers. Hours: 2.5. Price: £79–£129. Ladders into `ai-for-customer-facing-teams`.

Modules:

1. What can be sent to a customer.
2. Reply, proposal, complaint: three patterns.
3. The check before send.
4. Claims and the sentence that overpromises.
5. A send-or-hold note.

#### AI-Assisted Analysis and Reporting

The model will draft the chart. You still own the number. You learn how to use it for a first pass without shipping a total you cannot rebuild. You leave with a working file: prompt, check, source, sign-off.

Buyer: analysts, finance, and anyone who puts figures in front of a manager. Hours: 2.5. Price: £79–£129. Ladders into `ai-for-analysis-and-reporting`.

Modules:

1. Where a model invents a number.
2. If you cannot replay it, you cannot send it.
3. Charts and the sentence that overclaims.
4. A working file you can defend.

#### Secure Use of AI Tools at Work

You take the files, prompts, and tools your own team actually uses and decide what may be pasted, what must stay inside the company tool, and who is told if something goes out. You leave with a one-page rule written for those tools, plus a worked example of a paste you would now refuse.

Buyer: anyone whose team already puts real work into an AI tool. Hours: 2. Price: £79–£129. Ladders into `everyday-security-for-busy-teams`.

Modules:

1. What your team pasted last week, and who can see it.
2. The settings on the tools you actually have.
3. Write the rule: allowed, refused, and who to tell.
4. Run the rule on one real prompt and keep the result.

#### AI Literacy under the EU AI Act

Article 4 asks organisations to take measures so staff can use AI with some literacy. It is not a certificate you can buy. This course tells a working person what that duty means for their role, and what a sensible record looks like. You leave with a one-page plan, not a compliance claim.

Buyer: professionals and people managers who have been told to "do something about the AI Act". Hours: 2. Price: £79–£129. Ladders into `/ai-literacy-training` and `sponsoring-an-ai-literacy-programme`.

Modules:

1. What Article 4 asks for, in plain language.
2. What it does not give you.
3. A proportionate measure for your role.
4. A one-page plan you can show a sponsor.

### 4.2 Technology

#### Getting Value from the Technology You Already Pay For

The licences are on the bill. The team uses a fraction of them. You inventory what you already have and pick three jobs that belong in those tools, with no new purchase to feel like progress. You leave with a 30-day use plan. Social launch course for the technology track.

Buyer: operators, IT-adjacent staff, and anyone sitting on unused seats. Hours: 2. Price: £79–£129. Ladders into `getting-value-from-tools-you-already-own`.

Modules:

1. Inventory what you already pay for.
2. Three jobs that belong in the current tool.
3. Why people quietly opt out.
4. A 30-day plan a budget holder can read.

#### Choosing Technology for Your Team

A demo is not a decision. You learn how to compare tools against the work, the people who must use them, and the cost of switching. You leave with a one-page choice record.

Buyer: managers who are about to buy or renew a tool. Hours: 2. Price: £99–£149. Ladders into `choosing-technology-well`.

Modules:

1. The job the tool has to do.
2. Five questions that puncture a demo.
3. Switching cost, and who feels it.
4. A one-page choice record.

#### No-Code Automation for Everyday Work

Repeatable clicks, copy-paste between systems, the same weekly file. You build one small automation without writing software, and you write down what happens when it fails. You leave with that automation and a failure note.

Buyer: operators and coordinators who are tired of the same manual job. Hours: 2.5. Price: £79–£129. Ladders into `automating-the-work-nobody-wants`.

Modules:

1. Which task is worth automating.
2. A no-code path in tools you already have.
3. Build one and run it on real inputs.
4. What you do when it breaks.

#### From Spreadsheets to Simple Systems

The spreadsheet was fine until it became the system. You learn when to keep it, when to split it, and when a light tool should take over. You leave with a map of one workbook you actually depend on.

Buyer: operators, finance, and coordinators who run the business from a file. Hours: 2.5. Price: £79–£129. Ladders into `from-spreadsheets-to-systems`.

Modules:

1. What the workbook is really doing.
2. The parts that are dangerous to keep.
3. A simpler shape for the same job.
4. What you move, and what you leave.

#### Data Skills for People Who Are Not Analysts

You do not need to become an analyst. You need to trust a number enough to use it, and to know when you do not. You leave with a short checklist for any table someone sends you.

Buyer: managers and operators who consume reports. Hours: 2.5. Price: £79–£129. Ladders into `data-you-can-actually-use`.

Modules:

1. What the table is claiming.
2. Filters, dates, and the missing row.
3. A question you can ask before you act.
4. Your checklist.

#### Security Decisions for Non-Technical Teams

You review how your own team actually shares access, files, and logins, and you decide what would hurt if it failed tomorrow. You leave with a one-page exposure list and the three changes you will make this week, not a generic security lecture.

Buyer: managers and operators who are not in IT and still own the risk. Hours: 2. Price: £79–£129. Ladders into `everyday-security-for-busy-teams`.

Modules:

1. The accesses, files, and logins your team really uses.
2. Which failure would hurt this week.
3. Three changes you can make without an IT project.
4. The exposure list, and who owns each line.

#### Digital Change for Managers

Most rollouts fail in the week after go-live, not in the business case. You learn how to run a change people can feel in their work, without a theatre of town halls. You leave with a two-week manager plan.

Buyer: line managers in the middle of a tool change. Hours: 2. Price: £99–£149. Ladders into `digital-change-without-the-theatre`.

Modules:

1. What people are being asked to stop doing.
2. The first two weeks, in their actual work.
3. How you know it is being used.
4. A two-week plan.

#### Technology Decisions for Non-Technical Leaders

You sign or block spend without being the technical person in the room. You learn five questions for a proposal and a ninety-day test you can hold someone to. You leave with those questions written in your own words.

Buyer: directors and heads of function. Hours: 2. Price: £129–£199. Ladders into `technology-for-non-technical-leaders`.

Modules:

1. What you are actually being asked to buy.
2. Five questions for any proposal.
3. Risk, data, and who owns the failure.
4. A ninety-day test.

#### Connecting the Tools Your Team Already Uses

Work dies when someone retypes it from email into a sheet into a chat. You pick one real handoff and connect it with the tools you already pay for, then you write what still has to be done by a person. You leave with that connection running and a one-page map of the handoff.

Buyer: operators and team leads who move the same information between systems every week. Hours: 2.5. Price: £99–£149. Ladders into `automating-the-work-nobody-wants`.

Modules:

1. Name the handoff and what it costs in hours.
2. Connect it with tools you already have.
3. Run it on this week's real inputs.
4. Write what a person must still check.
5. The map: source, step, owner, failure.

#### Running a Technology Rollout

You have the tool. You do not have the habit. This course is how a manager or project lead gets a rollout out of the slide and into the job, with a date, an owner, and a sign that it stuck. You leave with a rollout sheet for one tool.

Buyer: the person named as the rollout lead. Hours: 2. Price: £99–£149. Ladders into `running-a-rollout-that-sticks`.

Modules:

1. The behaviour you are trying to change.
2. Who has to do it, by when.
3. Support in the first month, then stop.
4. The sign that it stuck.

### 4.3 Robotics

These are for a general audience as well as people on a site. A reel can sell the first three without assuming the viewer runs a factory. The later courses go deeper for operators and sponsors. Facilitated robotics programmes remain the team version.

#### Robotics for Non-Engineers

You take one real process, or a full worked case if you are not on a site yet, and decide what a robot could take, what a person must keep, and what would make the idea a bad buy. You leave with a go or not-yet brief a director could read. Social launch course for the robotics track. It is a decision, not an introduction.

Buyer: managers and professionals who will be asked for a view and are not engineers. Hours: 2.5. Price: £79–£129, card price **£99**. Ladders into `robotics-what-it-can-and-cannot-do`.

Modules:

1. What the machine can take in this process.
2. What it cannot see, hold, or decide.
3. The exception a person still owns.
4. The cost of being wrong.
5. A go or not-yet brief.

#### Collaborative Robots at Work

A cobot next to a person is an operations question: start, stop, recover, and when to call someone. You leave with the three drills and a handover note.

Buyer: supervisors, operators, and managers who will work near one. Hours: 2. Price: £79–£129. Ladders into `working-alongside-a-cobot`.

Modules:

1. What it is for on a shift.
2. Start, stop, recover.
3. When to stop and call a person.
4. A handover the next shift can trust.

#### Where a Robot Belongs in the Process

You mark one process task by task: robot, person, or not yet. You price the mistake of automating the wrong step. You leave with that marked process and a recommendation you could defend in a meeting.

Buyer: operations managers and team leads looking at a real flow. Hours: 2.5. Price: £99–£149. Ladders into `preparing-your-team-for-automation`.

Modules:

1. Break the process into tasks.
2. Mark each one: robot, person, or not yet.
3. The step that looks easy and is not.
4. What the mistake would cost.
5. The recommendation.

#### Preparing a Team for Automation

The machine is the easy part. The team needs to know what changes on Monday. You leave with a preparation brief: who is affected, what they must be able to do, and what you will not pretend.

Buyer: managers introducing automation to people who did not ask for it. Hours: 2. Price: £79–£129. Ladders into `preparing-your-team-for-automation`.

Modules:

1. Who is affected, by name of role.
2. What they must be able to do.
3. What you will stop asking them to do.
4. A preparation brief.

#### Warehouse and Logistics Automation

Goods in, storage, pick, pack, goods out. You learn which jobs automation actually takes in a warehouse, and which ones it makes worse if the process is messy. You leave with a one-page map of one flow.

Buyer: warehouse, logistics, and operations managers. Hours: 2.5. Price: £99–£149. Ladders into `warehouse-and-logistics-automation-in-practice`.

Modules:

1. The flow, before the machine.
2. Where automation pays, and where it does not.
3. Exceptions and the pile it will not touch.
4. A one-page map.

#### Specifying a Robotics Project

Write what you need the cell to do so a vendor cannot hide behind a video. Outcomes, volume, exceptions, and who owns it on a Tuesday night. You leave with a one-page specification.

Buyer: operations managers about to talk to an integrator. Hours: 2.5. Price: £129–£199. Ladders into `specifying-a-robotics-deployment`.

Modules:

1. Outcomes, not a brand of arm.
2. Volume, exceptions, and uptime.
3. Who owns it when it stops.
4. A one-page specification.

#### Robotics Safety and Risk

The rules are not a poster. You learn the questions a non-specialist must ask about a robotic workplace: guarding, stops, people in the zone, and what "safe enough" is not. You leave with a question list for the next walk of the floor.

Buyer: supervisors and managers accountable for a cell, not safety engineers. Hours: 2. Price: £99–£149. Ladders into `safety-risk-and-compliance-for-robotic-workcells`.

Modules:

1. How people and machines share a space.
2. Stops, zones, and the boring failures.
3. Questions for a floor walk.
4. What you escalate the same day.

#### Running a Robotic Cell

Start of shift, running, stop, recover, hand over. You practise the operating rhythm of a cell so it does not depend on the person who installed it. You leave with a shift card.

Buyer: team leaders who will run the cell. Hours: 2.5. Price: £99–£149. Ladders into `running-and-troubleshooting-a-robotic-cell`.

Modules:

1. Start of shift.
2. What normal looks like.
3. Recover, then escalate.
4. A shift card.

#### Vision Systems and Automated Inspection

Cameras that pass or fail a part. You learn what they are good at, how they fail quietly, and what a person must still look at. You leave with an inspection brief.

Buyer: quality and operations people living with, or buying, inspection automation. Hours: 2. Price: £99–£149. Ladders into `vision-systems-and-automated-inspection`.

Modules:

1. What the camera is judging.
2. How a quiet failure looks.
3. What a person still checks.
4. An inspection brief.

#### Robotics Investment Decisions

A capital request for robots is a bet on a process, not on a brand. You learn how to read the payback, the operating cost, and the staffing change. You leave with five questions for the next proposal.

Buyer: directors and senior managers who will sign. Hours: 2. Price: £129–£199. Ladders into `robotics-investment-and-operating-model`.

Modules:

1. The process you are buying, not the machine.
2. Payback, uptime, and people.
3. Five questions for the proposal.
4. What good looks like after ninety days.

### 4.4 HR transformation

For HR, L&D, and people managers. This is the LinkedIn audience. The courses are about using AI and technology inside the people function, and about making adoption stick in the rest of the organisation.

#### AI for HR and People Teams

The daily work of HR: a policy draft, a job description, an employee letter, a note for a manager. You put AI inside that work and you learn what must still be yours. You leave with three patterns and a hold list. Social launch course for this track.

Buyer: HR advisors, people partners, and coordinators. Hours: 2.5. Price: £79–£129, card price **£99**. Ladders into `ai-foundations-for-every-role` for the wider workforce, and into the HR track that follows.

Modules:

1. Which HR tasks are safe to draft.
2. Three patterns from your own week.
3. What you never paste.
4. A hold list for the team.

#### EU AI Act Literacy for HR and L&D

You have been asked what the organisation is doing about AI literacy. This course is the people-function version: who needs what, by role, and what a record contains. It does not make anyone compliant. You leave with a role map and a record outline.

Buyer: HR and L&D leads. Hours: 2. Price: £99–£149. Ladders into `sponsoring-an-ai-literacy-programme`.

Modules:

1. What Article 4 asks of an employer.
2. A role map: who needs which measure.
3. What a record contains.
4. What you will not claim.

#### Redesigning Workplace Learning

Stop buying a library nobody opens. You redesign one programme so people do the work, not just attend. You leave with a one-page learning design for a real skill in your organisation.

Buyer: L&D and anyone who commissions training. Hours: 2.5. Price: £99–£149. Ladders into `sponsoring-an-ai-literacy-programme`.

Modules:

1. Why people finish nothing.
2. A skill, a task, and a check.
3. Redesign one real programme.
4. How a manager will see it in the work.

#### Hiring and Selection with AI

Drafting a job post is the easy part. Judging candidates with a model in the loop is where it goes wrong. You learn what AI may draft, what a person must decide, and how to keep a fair process. You leave with a selection standard.

Buyer: recruiters and hiring managers. Hours: 2.5. Price: £99–£149. No direct facilitated twin yet. It can lead into `responsible-ai-use-at-work`.

Modules:

1. What a model may draft.
2. What a person must decide.
3. Bias, notes, and the audit trail.
4. A selection standard.

#### Performance and Feedback with AI

A model can draft the words. The judgement about a person stays with the manager. You learn a safe way to prepare feedback, and the lines you do not cross. You leave with a preparation sheet.

Buyer: people managers and HR supporting them. Hours: 2. Price: £79–£129. No direct facilitated twin yet.

Modules:

1. What you may draft.
2. What you must have seen yourself.
3. Prepare one real conversation.
4. A preparation sheet.

#### AI Adoption for Line Managers

Training fails when the manager does not change what they accept. You learn how to set a standard, review AI-touched work, and tell whether last month's course is still in the job. You leave with a 1:1 standard.

Buyer: line managers. Hours: 2.5. Price: £99–£149. Ladders into `leading-an-ai-ready-team`.

Modules:

1. The standard you can say out loud.
2. Review the work without doing it yourself.
3. Signs it has stuck.
4. What you ask L&D for next.

#### Building a Workforce Skills Plan

You cannot train everyone in everything. You pick the few skills the next two quarters actually need, by role, and you sequence them. You leave with a one-page skills plan.

Buyer: HR and L&D planning a year. Hours: 2. Price: £99–£149. Ladders into `measuring-ai-adoption-and-value`.

Modules:

1. The work that is changing.
2. Skills by role, not a generic catalogue.
3. What you will not train this quarter.
4. A one-page plan.

#### HR Operations with AI

Contracts admin, case notes, onboarding checklists, the questions that arrive every week. You take one HR operation and put a checked AI step inside it. You leave with that workflow written down.

Buyer: HR operations and coordinators. Hours: 2. Price: £79–£129. Ladders into `embedding-ai-in-daily-workflows`.

Modules:

1. Pick one repeating HR operation.
2. The step a model may take.
3. The step a person must keep.
4. Write the workflow.

#### Employee Data, Privacy and AI

People data is not a prompt. You learn what HR may use a tool for, what must never be pasted, and how to answer a manager who wants to "just run the team through ChatGPT". You leave with a red-list for the people team.

Buyer: HR, people partners, and anyone handling employee data. Hours: 2. Price: £99–£149. Ladders into `responsible-ai-use-at-work`.

Modules:

1. What counts as people data.
2. The red-list.
3. How to answer the manager.
4. A team rule you can issue.

#### Measuring Whether Training Stuck

Attendance is not a result. You learn a small set of signs that a course is still in the work two weeks later, and how to report that without a vanity dashboard. You leave with a measurement sheet for one programme.

Buyer: L&D and HR business partners. Hours: 2. Price: £79–£129. Ladders into `measuring-ai-adoption-and-value`.

Modules:

1. What you will stop counting.
2. Signs in the work, two weeks on.
3. A conversation with the manager.
4. A measurement sheet.

### 4.5 Catalogue at a glance

| Track | Course | Hours | Band (GBP) |
| --- | --- | --- | --- |
| AI | Prompt Engineering for Professional Work | 2.5 | 79–129 |
| AI | AI Output Verification | 2.5 | 79–129 |
| AI | Applying AI in Daily Work | 2.5 | 79–129 |
| AI | AI for Writing and Communication | 2 | 79–129 |
| AI | Designing AI Agents for Business Workflows | 2.5 | 99–149 |
| AI | Setting Up and Supervising AI Agents | 3 | 149–199 |
| AI | AI for Customer Communications | 2.5 | 79–129 |
| AI | AI-Assisted Analysis and Reporting | 2.5 | 79–129 |
| AI | Secure Use of AI Tools at Work | 2 | 79–129 |
| AI | AI Literacy under the EU AI Act | 2 | 79–129 |
| Technology | Getting Value from the Technology You Already Pay For | 2 | 79–129 |
| Technology | Choosing Technology for Your Team | 2 | 99–149 |
| Technology | No-Code Automation for Everyday Work | 2.5 | 79–129 |
| Technology | From Spreadsheets to Simple Systems | 2.5 | 79–129 |
| Technology | Data Skills for People Who Are Not Analysts | 2.5 | 79–129 |
| Technology | Security Decisions for Non-Technical Teams | 2 | 79–129 |
| Technology | Digital Change for Managers | 2 | 99–149 |
| Technology | Technology Decisions for Non-Technical Leaders | 2 | 129–199 |
| Technology | Connecting the Tools Your Team Already Uses | 2.5 | 99–149 |
| Technology | Running a Technology Rollout | 2 | 99–149 |
| Robotics | Robotics for Non-Engineers | 2.5 | 79–129 |
| Robotics | Collaborative Robots at Work | 2 | 79–129 |
| Robotics | Where a Robot Belongs in the Process | 2.5 | 99–149 |
| Robotics | Preparing a Team for Automation | 2 | 79–129 |
| Robotics | Warehouse and Logistics Automation | 2.5 | 99–149 |
| Robotics | Specifying a Robotics Project | 2.5 | 129–199 |
| Robotics | Robotics Safety and Risk | 2 | 99–149 |
| Robotics | Running a Robotic Cell | 2.5 | 99–149 |
| Robotics | Vision Systems and Automated Inspection | 2 | 99–149 |
| Robotics | Robotics Investment Decisions | 2 | 129–199 |
| HR transformation | AI for HR and People Teams | 2.5 | 79–129 |
| HR transformation | EU AI Act Literacy for HR and L&D | 2 | 99–149 |
| HR transformation | Redesigning Workplace Learning | 2.5 | 99–149 |
| HR transformation | Hiring and Selection with AI | 2.5 | 99–149 |
| HR transformation | Performance and Feedback with AI | 2 | 79–129 |
| HR transformation | AI Adoption for Line Managers | 2.5 | 99–149 |
| HR transformation | Building a Workforce Skills Plan | 2 | 99–149 |
| HR transformation | HR Operations with AI | 2 | 79–129 |
| HR transformation | Employee Data, Privacy and AI | 2 | 99–149 |
| HR transformation | Measuring Whether Training Stuck | 2 | 79–129 |

Card prices for the four social launch courses: Prompt Engineering £99, Getting Value from the Technology You Already Pay For £99, Robotics for Non-Engineers £99, AI for HR and People Teams £99. Each one produces a working artefact, not an overview.

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

1. Format + price on `courses` (or a child `course_offers` table) for the forty SKUs, with `hr` added to the category list.
2. `lessons`, `course_enrollments` (self-serve), `lesson_progress`, `lesson_checks`.
3. Public checkout endpoint + webhook purpose `self_serve_course`.
4. Learner identity path (holding org or nullable `org_id`) + magic-link claim.
5. `/learn/[slug]` player: markdown theory, practice, and a signed video URL only when that lesson has a playback id.
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
  body_md             text        theory, required, the spine of the lesson
  practice_spec       jsonb       judgement checks and/or applied task, required
  playback_id         text        null until filmed; Mux / Cloudflare id, not a secret
  video_seconds       int         null until filmed
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
  practice_passed     bool        gates the next lesson; video does not
  response            jsonb       choices, reasons shown, saved artefact
  video_started_at    timestamptz null if they never pressed play
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
- Lessons readable only if the course is published **and** (user is entitled **or** super_admin). Marketing pages read module titles only, not `body_md` and not `playback_id`. The buy page sells the promise and the outline, not the method.
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

#### Phase 1: pilot, *Prompt Engineering for Professional Work*

One course, the AI-track social hook, real money on a **preview**, never on `aiadop` production until Antonio says so. The artefact is a prompt card. The room is the same focused lesson described in 2.4a.

- Schema for the new tables + the full pilot seeded as `draft`: every module, theory, and practice. Zero videos required.
- Checkout + webhook + magic link + player that opens lesson 1 on the writing.
- Attach-film field, even if every playback id is still empty.
- Receipt to buyer, alert to `ag@experrt.com`.
- My Learning resume.
- Completion certificate earned only when every check has passed and the prompt card is signed. Verify page and PDF. Not earned by watching.
- Homepage Latest can show the single pilot if published.
- Feature flag `SELF_SERVE_COURSES` default false on production.

Definition of a good Phase 1: Antonio can pay with a test card on a preview URL, open lesson 1 from the mail into the focused room, follow one technical example without a lecture, mark or build on the object, be blocked by a wrong or empty check, finish, sign the prompt card, and receive a certificate page plus PDF that a second person can open at `/verify/[ref]`. The page must not claim compliance. He can see the purchase on admin revenue. If he has already filmed one lesson, pasting its playback id makes Watch appear in that same column without resetting the run. If the room feels like a form, or the certificate feels like a badge, Phase 1 is not done.

#### Phase 2: full catalogue and polish

- Publish the other three social launch courses, one each for technology, robotics, and HR, so every inbound audience has a buy button.
- Seed the remaining thirty-six as drafts and fill them in waves. Do not block the first posts on a full catalogue of forty scripts.
- Catalog format filter, prices on cards, Latest of three on the homepage.
- Practice score, streak, standing.
- Publish toggle.
- UTM on purchases.
- Attach films to any published lesson as they are recorded.
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
- Article 4 compliance claims, or a certificate that says the buyer is compliant. A completion certificate for a finished, checked course is in scope. A certificate for clicking through is not.
- Replacing facilitated cohorts, evidence packs, or the assessment funnel.
- Video files or API keys committed to git.
- Blocking publish, checkout, or lesson completion on a film that does not exist yet.
- Empty video players, "coming soon" slots, or a trailer before lesson 1.
- LMS chrome in the lesson: a permanent module sidebar, exam layout, score popups, sound, or confetti. The interface in 2.4a is the experience. A generic player with the text dropped in fails the phase.
- Stripe Tax without a registration.
- Leaderboards, childish gamification, or public learner profiles.
- Native mobile apps.
- Publishing forty empty course pages. A track goes on sale when its launch course has full text and practice.
- Overview courses, "future of" briefings, and tip sheets. If the buyer does not leave with an artefact they would otherwise pay someone to produce, it does not ship.
- A prompt-tricks list, a framework tutorial, or an agent that sends or changes customer work with no approval step.

---

## 6. Test plan and definition of done (for this scope, not for prod)

This section is how we know **the scope is complete**, not how we ship experrt.com.

### 6.1 Done for this document

- [x] Grounded in the current repo (routes, auth, Mooov/Stripe, catalogue, admin, mail).
- [x] Learner portal only; company authoring shelved.
- [x] Pay-then-account chosen, with a written happy path.
- [x] Homepage / `/courses` IA and copy samples; course closer is buy / start.
- [x] Forty courses, ten each in AI, technology, robotics, and HR transformation, with buyer, hours, modules, and GBP band. Four social launch courses named. Each course must leave an artefact a free post cannot replace.
- [x] Lessons are technically true and easy to follow. Checks block progress. A designed, verifiable certificate is issued only after the artefact is signed.
- [x] Text and practice are the course. Video is optional and can be attached after publish.
- [x] The lesson is a focused room (one column, frames, artefact sheet). The interface is part of the course, not a generic player.
- [x] Phases 0–3 and non-goals, including no production deploy.
- [x] No secrets. No em dashes in user-facing copy samples.
- [x] Draft PR, docs only.

### 6.2 Tests an implementer must add in Phase 1 (preview)

| Layer | Cases |
| --- | --- |
| Unit | Entitlement grant is idempotent. Progress % math. Standing thresholds. Certificate snapshot includes disclaimer and `self_serve_completion`. `isPublicPath('/api/public/courses/x/checkout')`. Notify email still `ag@experrt.com` if `NOTIFY_EMAIL` is a `@kumohr.com` leftover. |
| RLS | Anonymous cannot read `playback_id`. Other users cannot read another learner's progress. Super-admin can. |
| Checkout | Guest pay → mail → magic link → player. Signed-in pay → player. Double submit does not double charge. Failed pay creates no entitlement. |
| Player | Resume opens the first incomplete lesson on the theory, in the focused room, not on a video and not in a module sidebar. Practice required to complete. A lesson with a null playback id has no player chrome. Judgement reveals the reason in place. The sheet saves in place. `Continue` is one control. Reduced motion skips the fade. Pasting a playback id shows Watch in the same column and does not wipe `response`. Unsigned user hitting `/learn` goes to login with `next=`. |
| Admin | Purchase appears with email, course, pence. Publish/unpublish hides the catalog card but not a paid player's access. |
| Copy | No `/contact` or Calendly on self-serve closers. No "compliant" / "Article 4 certificate" strings on the player or completion mail. |
| Browser | Homepage Latest → course → buy (test mode) → focused lesson, desktop and a mobile viewport. Complete one judgement and the sheet. Confirm the end page is still, with the artefact and no popup. Facilitated course page still shows enquiry, not a fake price. |

### 6.3 What "done" is not

Passing the list above on a preview is not permission to promote `aiadop` or merge to `main`. Antonio signs off content, price, and tax before any production conversation.

---

## 7. Risks and open calls for Antonio

These are product calls, not blockers for this scope:

1. **Launch prices.** Scope assumes **£99** for each of the four launch courses. He can move inside the bands. The price is for the artefact, not for a short read.
2. **VAT.** Confirm whether prices are inclusive and whether Experrt is registered to collect.
3. **Holding org vs nullable `org_id`.** Engineering prefers a single hidden holding org so current RLS keeps working.
4. **Video host, when he films.** Mux or Cloudflare Stream, signed playback. Not YouTube unlisted (leaks). Not files in this git repo. Launch does not wait on this choice. The attach-film field can stay empty.
5. **Hero copy.** Option A above is value-first and names applied AI and Article 4. He may want his face or a specific line from AI with Antonio.
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

We add a **buy-and-start** path on experrt.com for forty short courses: ten in AI, ten in technology, ten in robotics, and ten in HR transformation. A post can point at a track or at one course. The first four on sale are Prompt Engineering for Professional Work, Getting Value from the Technology You Already Pay For, Robotics for Non-Engineers, and AI for HR and People Teams. Each lesson is written theory plus work the learner actually does (a judgement check, a task on their own material, or both). They land on lesson 1 the moment they pay, in a focused room: one column, the homepage's type and air, the example and the task as the same object. The screen is part of the course. You film when you can. A walkthrough is attached to that lesson afterwards and does not rewrite it. People coming from Instagram and LinkedIn pay first (guest, email + card) and get a magic link back into that room. You see the purchase and you can publish or hide a course. Live programmes stay. Companies do not get a course builder.

First build, when you say go: **Prompt Engineering for Professional Work** at £99, full text and practice, on a preview, not on production. The other three launch courses follow so each audience has a buy button when the posts go out. Film is welcome on day one and not required.
