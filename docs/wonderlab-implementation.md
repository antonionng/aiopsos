# Wonderlab by Experrt

## Implemented experience

`/wonderlab` provides the brand landing page; `/wonderlab/kids` and `/wonderlab/teens` provide four age levels. Each of the 24 mission pages explains its objective, activities, project, duration target and £20/month per-child membership. Four free activities are available at `/wonderlab/play/{slug}?demo=1`: robot-rescue, creature-creator, prompt-repair-shop and brief-builder. These links now open three-stage free games rather than a single quiz chapter. The four games are also listed at `/wonderlab/games`. Free-game checkpoints are anonymous stage numbers held in this browser tab’s session storage; they never enter the family database. A finished game awards a downloadable SVG discovery sticker.

The mission catalogue exported by `lib/wonderlab/catalog.ts` has 96 authored activities, explicit evidence and explanatory feedback, 24 project briefs, offline activities and parent outcomes. All 96 curriculum activities now use a visual game player: object placement into baskets, stepping-stone plans, scene building, action paths and an evidence board. Checkpoint controls and earned discoveries replace the vertical chapter list. The existing server evaluation and paid progress saving remain in place. Optional narration uses the locally packaged OpenAI Marin recordings for authored instructions, with browser speech as a fallback; the full text remains visible. Narration is generated from reviewed scripts before publication, not from child inputs. Teen creation is constrained to reviewed fictional briefs and enumerated directions; it does not send child-entered project text to the provider.

The supplied timings and £20/month value proposition require family validation. No family pilot, age-specific comprehension result or trademark clearance is claimed. The brand name remains provisional.

## Family and access model

A dedicated parent registration form creates a Supabase identity without requiring a workplace or organisation. It uses the project’s Supabase confirmation-email delivery, which must be verified in staging, and returns to the family page. Existing Experrt identities can sign in directly. Parents use existing verified Supabase authentication, then re-enter their password to obtain a 15-minute, opaque, HTTP-only parent-area session. An independent authentication client verifies the password without replacing the existing account session. OAuth-only parents need an account password before using this gate.

Opening a child profile creates a 12-hour opaque play session and revokes the parent-area session. Parent APIs require both verified account identity and the parent-area session. Play APIs require the currently authenticated parent identity to match the child-scoped session, an active profile and the matching paid entitlement. Signing out or switching parent accounts therefore stops the previous child session from authorising play. Unlocking the parent area revokes the current child play session, so background child tabs cannot continue saving while the parent changes family settings. Tokens are stored as SHA-256 hashes. Cookies use SameSite Strict and Secure in production. Mutations enforce same-origin requests and bounded bodies. The broader Experrt account session remains intact; this is an application-level Wonderlab parent gate, not device-level parental control.

Children use nicknames, avatars and a parent-confirmed band. They have no independent login or email. No public profiles, galleries or chat are implemented. Browser database roles have no privileges on Wonderlab records or privileged functions; server routes perform scope and ownership checks before service-role calls. Every new table has RLS enabled. Tests exercise the actual SQL grants and transactions in isolated PGlite.

Progress saves use optimistic revisions, serial client requests and server recomputation of activity checks. Concurrent-tab conflicts stop writes and offer export before reload. Earned completion remains recorded through replay. Creations can be downloaded as text. Ages 4–10 now have a twelve-square picture-making space with selectable objects, an eraser, optional written explanation and SVG picture export. Object positions and notes are saved within the private creation record. Worldbuilder Studio also offers this space. Game Concept Studio includes a branching-story editor with two playable paths, editable endings and a playtest loop. Other teen projects retain a written creation area. These are structured making tools, not freehand drawing or a general-purpose game engine. Parent summaries show demonstrated activities and the curriculum objective; project checks are learner/adult attestation, not AI grading.

An accepted deletion request pauses a profile and revokes its play sessions. A pending checkout must first be resolved and subscription renewal cancelled; the family area reports a failure instead of claiming that a blocked request has been accepted. Actual data erasure requires the operational deletion process. It is not represented as already erased. Parent exports remain available during processing and after lesson expiry. Record retention and deletion-response periods must be agreed and published before launch.

Marketing pages address parents: `lib/wonderlab/parent-copy.ts` leads with communication with AI, independent judgement, creative thinking and privacy, then explains the story or game that provides the practice and the creation to keep. All 24 descriptions distinguish the learning benefit from the activity. AI mistakes are described as confident but wrong, without attributing deliberate deception to the system. This copy can evolve without changing a purchased lesson’s instructions or answer keys.

## Purchased lesson versions

The initial curriculum is preserved in `lib/wonderlab/versions/2026-10-05.ts`. `catalog.ts` selects the current release for browsing and new purchases; `versions.ts` resolves the exact release recorded on an order for play, server marking, the child's map and parent export summaries. An unavailable version fails closed instead of silently marking old answers against a new lesson.

Once purchases exist, do not edit or remove their released content module. Create a new dated module and version identifier, add it to the version registry, and point the current catalogue at it. Keep older modules available while their purchases or retained exports need them. Changes that require withdrawing a lesson need an explicit support and refund process. Unknown versions and titles are never replaced with unrelated current lesson content.

## Migration and payments

Local migration: `supabase/migrations/20261005233138_wonderlab_family_learning.sql`. Applied to the verified app project `aiopsos` (`ecxsqzvhsydpgstvvxxo`) on 5 October 2026 at 23:31 UTC. The local filename matches the remote migration history. The CLI remains linked to a different project, `AIOS` (`oukbxuqaguwkkyevddee`); do not use an unqualified CLI push. Remote checks confirm all six tables have RLS enabled, browser roles have no table access, and the four functions are service-role-only and security-invoker. Security advisors report an informational [RLS enabled with no policies notice](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) for these intentionally server-only tables. No broad browser policy was added to suppress that notice. Existing unrelated database advisories were left outside this change.

The current model supersedes the initial one-off lesson offer: **£20 per month per child, all 24 courses included**, with unlimited authored-game replays during membership. Parents cancel monthly renewal in the reauthenticated family area; access continues until the end of the paid period. The parent selects the child, accepts the recurring price and reviewed terms, and requests immediate access. No age-band restriction applies to course access; the child’s actual age band and parental setting still control optional AI access. Each eligible course includes 30 successful guided generations per paid billing month, without rollover.

`20261006162727_wonderlab_monthly_memberships.sql` adds server-only membership, invoice and event records. Applied to the verified app project `ecxsqzvhsydpgstvvxxo` on 6 October 2026; the local filename matches remote migration history. Verification confirms RLS is enabled, browser table access and RPC execution are denied, and the RPC uses security-invoker. The only Wonderlab advisor notices are informational no-policy notices for these intentionally server-only tables. It retains legacy lesson orders while representing each membership course grant as a zero-value order with its own allowance. A partial unique index prevents simultaneous live memberships for one child. Stable checkout idempotency keys prevent duplicate sessions. The final server-controlled price is 2,000 pence GBP, quantity one, monthly recurring, tax inclusive; no coupons or extra automatic taxes are configured.

The signed Stripe webhook handles `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` and `charge.refunded`. Configure those event deliveries before opening membership checkout. Checkout returns and subscription status alone do not grant access. Verified full-price paid invoices atomically grant all 24 courses for the invoice’s period. Renewals reset each course allowance once and fail old pending generation requests before resetting. Failed payments never extend access. Full refunds revoke the refunded period, including when the refund precedes fulfilment; later paid periods are retained. Partial refunds do not revoke access. Canceled subscriptions cannot be resurrected by older events. Existing one-off purchase fulfilment remains for compatibility.

Local automated tests exercise migrations, checkout retries, ownership, price enforcement, cancellation, expiry, refunds before fulfilment, out-of-order delivery, quota resets, generation reservations and the legacy payment paths. End-to-end Stripe test-mode delivery and reviewed consumer terms are still launch requirements. No live payment was created during implementation.

## Launch controls

All flags default closed. Do not enable paid checkout or AI just to make a preview appear complete.

- `WONDERLAB_LAUNCH_REVIEWED=true`: use only after brand, family pilot, accessibility, child-data assessment and launch review are complete.
- `WONDERLAB_MEMBERSHIP_REVIEWED=true`: requires review of monthly consumer terms, Stripe recurring billing configuration and staging payment lifecycle tests. The original launch flag cannot accidentally enable the changed offer.
- `WONDERLAB_COMMERCE_ENABLED=true`: enables checkout only with both review flags and a nonempty `WONDERLAB_TERMS_VERSION`.
- `WONDERLAB_TERMS_VERSION`: the published reviewed terms version accepted by the purchaser and stored on the membership. The current `/wonderlab/terms` page is a clearly labelled prelaunch description and must be replaced with reviewed consumer and child-privacy terms first.
- `WONDERLAB_AI_ENABLED=true`, `WONDERLAB_ZERO_RETENTION_VERIFIED=true`, and `WONDERLAB_AI_MODEL`: all required, together with launch review, for live teen generation. Pin the currently approved flagship model after checking provider guidance and age-specific calibration. The retention flag is an operator attestation, not automatic proof of provider configuration.
- `WONDERLAB_AI_INPUT_USD_PER_MILLION` and `WONDERLAB_AI_OUTPUT_USD_PER_MILLION`: approved model rates used to record estimated successful-generation cost. Both must be configured before AI opens.
- Existing `OPENAI_API_KEY`, Stripe variables, Supabase variables and `NEXT_PUBLIC_APP_URL` are used server-side. Do not put secret keys in public variables.

Before enabling AI, confirm the account and endpoints meet the provider’s child-data and retention requirements. API `store:false` alone is not zero data retention. Only prewritten fictional prompts and enumerated choices leave the server; free text and profile identifiers do not. Output moderation is required before display. Generation reservations serialize each order, hold one in-flight request, count pending capacity toward the 30-success limit and expire after three minutes. Failed or blocked work consumes no success allowance. Forty attempts per hour per order limit repeated failures. Retried successful request IDs return the original result without another debit.

Operational monitoring should query order/event status, expired pending purchases, generation state and elapsed time, progress save failures and deletion requests. No advertising analytics or raw child content logging was added. Database timestamps support fulfilment and provider failure monitoring; the read-only `scripts/wonderlab-health.mts` report summarises payment state, generation success/failure, estimated successful-generation cost, latency, unfinished missions inactive for three days and deletion requests. Estimates exclude failed provider calls and are not invoices. Validate the model’s observed per-child monthly cost before launch.

## Remaining external acceptance

- Name/trademark clearance and family tests in all four age bands.
- Reviewed UK consumer terms, child privacy notice, DPIA/age assurance and retention/deletion operations.
- End-to-end staged parent account, purchase, webhook, refund and cross-device progress testing against the deployed backend.
- Provider configuration, output-safety calibration and cost measurement before live AI.
- Human educational review of all 24 lessons and validation of the proposed duration and price.

## Artwork provenance

Four original illustrations were generated with the built-in image-generation tool and copied to `public/images/wonderlab/{explorers,inventors,creators,studio}.png`. Pip and activity symbols are code-native vector UI graphics. Keep the original generated files in the Codex image library.

Shared prompt: “Use case: illustration-story. Asset type: wide landscape website world artwork for Wonderlab by Experrt. Original premium children's publishing illustration, confident dark ink outlines, warm cream background #fff9ee, violet #7046eb, aqua #68d9c2, golden orange #ffad58, gentle paper grain. Rich layered composition, playful tactile shapes, clean beautiful legibility, landscape 3:2. No lettering, no text, no logos, no watermark. Fill the image with the environment, suitable as a card or wide hero.”

Scene variants:

- Explorers: a soft whimsical island garden, rounded fruit trees, stepping stones, picnic basket, a cream and violet robot with a dark face screen and two aqua eyes waving hello; ages 4–6.
- Inventors: a floating invention island with a treehouse workshop, aqua river, orange bridge, friendly imaginary creatures and the robot; ages 7–10.
- Creators: a graphic-novel creative district with a purple observatory, orange studio buildings, aqua skate ramp, floating idea shapes and the robot; ages 11–13.
- Studio: a sophisticated futuristic design district with geometric architecture, a purple workshop, orange sculptural staircase, aqua terraces and an abstract sun; editorial screenprint style for ages 14–16.

## Verification recorded for this implementation

- Full repository test suite after the game-player continuation: 730 passed, zero failures. The session route test uses a fixed clock so machine sleep cannot expire a test parent session midway through an assertion.
- TypeScript and targeted ESLint: passed.
- Optimised Next.js production build: passed, including all 24 statically generated mission pages. Build performed in an isolated temporary preview workspace to preserve the existing developer server.
- Browser verification: landing page, all four free activities, correct/incorrect feedback, completion, mobile game layout (390px with no horizontal overflow), and parent sign-in gate.
- Parent-copy continuation: all 24 lesson cards, four age introductions, home page and lesson details lead with learning benefits. Desktop and 390px mobile browser checks passed, including the Kids, Teens, home and representative detail pages with no horizontal overflow.
- Running application returns 401 for unauthenticated family, progress and checkout calls on the canonical local preview origin. Requests from a mismatched origin are rejected with 403.
- Authenticated route checks now execute the actual family, session, progress and checkout handlers against the real migration in isolated PGlite. Cookie, identity-provider and Stripe transports are simulated. These verify account switching, household isolation, parent reauthentication, deletion revocation, private exports after expiry, server marking, optimistic conflicts, price enforcement, duplicate checkout and closed launch gates.
- Real purchases, confirmation emails, authenticated family API flows against a deployed database and live AI were not executed. No real child data was used.
- Local production preview: `http://localhost:3003/wonderlab`. The canonical `localhost` origin is required for local mutations; Next internally normalises its request URL to that hostname, so the `127.0.0.1` alias does not pass the same-origin guard.

## Game experience added on 6 October 2026

- Robot Rescue: animated route execution, river collisions, a key-and-door objective and a changed bridge for the final challenge.
- Creature Creator: an illustrated creature changes as features are fitted. Three habitats require different feature pairs.
- Prompt Repair Shop: a machine-building puzzle with audience, source and length controls, visible draft changes and specific repair feedback. Responses are authored simulations.
- Launch Studio, accessed through the Brief Builder sample: an interactive poster editor in which learners inspect, keep, correct or remove claims using supplied source cards.
- All four age levels are linked directly from both audience pages, with older/younger world cards at the end and a dedicated Play games navigation item.
- Read-aloud, optional reward sound, visible feedback, unlimited retries, keyboard/touch controls and reduced-motion handling are provided. No leaderboard, timer, advertising or purchases were added inside the games.
- Game completion celebrates the activity. It does not establish independent competence. The family pilot remains necessary to assess comprehension, enjoyment and suitability, especially for ages 4–6.

Game verification: pure engine checks cover valid routes, off-map/river collisions, key requirements, all three habitat designs, incorrect prompt components and all evidence-verdict combinations. All four free games passed browser playthroughs of their three stages and awarded their final stickers. Incorrect routes, unsuitable creature features, unsupported prompt instructions and incorrect evidence verdicts produced repair feedback. Refresh retained the saved stage. Shared mission controls were checked with fictional local fixtures for sorting, sequencing, evidence selection and picture placement; picture export was available after making a creation. Robot Rescue passed a 390px mobile layout check with no horizontal overflow and controls at least 44px in each dimension; pressing Enter on a focused arrow added a step and enabled play. Browser errors were empty. These checks do not replace family testing or claim a browser playthrough of every authored mission.

### Educational copy review, 7 October 2026

The current catalogue now uses copy release `2026-10-07.1`. Its 96 activity headings use complete instructional sentences. Expanded situations define unfamiliar terms and explain what learners should compare, choose and check. The archived release remains available, and activity identifiers, answer keys and option identifiers are unchanged.

The four free games, shared player, creation tools, parent pages, membership descriptions and family learning summaries now use connected educational explanations. The teen transfer challenge explicitly teaches that clear AI instructions do not guarantee a correct answer. Completed coaching panels describe what was learned rather than asking the learner to run an already completed test. Short navigation labels, object names and game titles remain concise.

Regenerated 133 static narration clips. All 406 current scripts have matching local MP3s. Validation passed: 27 game, curriculum, version, API and narration tests; Wonderlab lint; TypeScript and the production build. Browser review covered all four free-game age levels, the complete prompt-game journey with wrong and correct transfer answers, and the completed creature coaching state. The younger and teen views were checked at a 768px tablet width without horizontal overflow. The homepage was refreshed on localhost:3003. This copy review does not replace comprehension testing with children and families.

### Release-readiness continuation, 7 October 2026

Guided generation now validates a complete provider finish state, absence of refusal/tool calls, a maximum of 250 words, plain text without HTML or explicit links, and valid token usage. Invalid output is rejected before moderation/storage and consumes no success allowance. Age-specific system instructions distinguish ages 11–13 from 14–16. Blank cost rates and model names cannot enable generation. Shared pure configuration checks power both server launch gates and the new read-only preflight script.

Additional route tests verify provider input minimisation, age/parent/entitlement gates, failed-request release, successful-request idempotency, exhausted allowances, and the actual Stripe membership event handler against isolated SQL. Retrieved invoice records, rather than the incoming event's amount, determine access. Tests also exercise partial/full refunds and late payment events. These use simulated provider transports, not live services.

The launch review and 24-mission educational review matrix are in `docs/wonderlab-launch-review.md` and `docs/wonderlab-curriculum-review.md`. They contain a concrete family pilot, payment acceptance run and outstanding review evidence. They deliberately leave family results and legal/provider sign-off pending.

An isolated Wonderlab preview checkout was prepared at `/Users/ant/.codex/worktrees/wonderlab-preview/aiopsos`, based on `bc7e7f4`. It includes Wonderlab source/assets, its two migrations, documentation, scripts and PGlite dependency. Shared changes are limited to Wonderlab navigation, public route/audio access, sitemap/robots entries and webhook dispatch. Unrelated adult-course, billing, email and homepage edits remain in the original workspace. The isolated production build passed. No production settings were enabled and no remote push or deployment was performed.
