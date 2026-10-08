# Wonderlab launch review

Prepared on 7 October 2026 for content release `2026-10-07.1`.

The public preview and a paid launch have different acceptance requirements. The current release contains 24 missions, 96 activities and four free games. Membership is £20 per month per child and includes all 24 missions. This document records technical evidence and provides a procedure for collecting the remaining evidence. It does not record unperformed family tests or confer legal, educational or provider approval.

## Verified environment

The user selected the existing Experrt environment. Vercel project `aiadop` (`prj_bLm98DEyKwWInDAAlpWSOmGZDBjv`) serves `experrt.com` and `www.experrt.com`. The local application uses Supabase project `aiopsos` (`ecxsqzvhsydpgstvvxxo`). The Supabase CLI's linked project is different, so do not use an unqualified database push.

Read-only checks of the Experrt database found all nine Wonderlab tables with row-level security enabled and no direct SELECT privilege for either `anon` or `authenticated`. The server validates ownership before using its service role. The health report showed no active or pending memberships, paid orders, successful generations or deletion requests. These are observations at the review time, not an ongoing guarantee.

Vercel environment metadata identifies its production Stripe credentials as LIVE. No test-mode Stripe key is configured locally or listed in the project's development/preview environment. No credentials were printed or copied and no live checkout, payment, refund or database mutation was performed during this review. The Wonderlab commerce and child-generation launch flags are absent from the inspected production environment.

## Repeatable technical checks

Run these from the repository root:

```sh
node --experimental-strip-types --test lib/wonderlab/*.test.ts
node --env-file=.env.local --experimental-strip-types scripts/wonderlab-preflight.mts
node --env-file=.env.local --experimental-strip-types scripts/wonderlab-preflight.mts --target=commerce
node --env-file=.env.local --experimental-strip-types scripts/wonderlab-preflight.mts --target=ai
node --env-file=.env.local --experimental-strip-types scripts/wonderlab-health.mts
```

Preflight does not contact a provider or change settings. Its preview check expects paid checkout and child generation to remain closed. Its commerce and AI checks deliberately exit unsuccessfully when required configuration is missing. A passing configuration check is not evidence that an operator review actually occurred. The health command reads aggregate operational data from the configured project and must be pointed at the verified project.

The isolated route tests execute the actual application handlers and SQL migrations with simulated authentication, Stripe and OpenAI transports. They cover household isolation, parent reauthentication, interrupted/conflicting saves, export access after expiry, duplicate checkout, server prices and terms versions, payment retries, renewals, refunds, expired access and generation allowances. They do not verify an actual email delivery, Stripe-hosted checkout, deployed webhook or cross-device browser session.

Guided generation now rejects incomplete, refused, overlong, marked-up or externally linked responses before storage or allowance charging. Missing or invalid token usage is rejected. Moderation must succeed before a response is shown. The API sends only reviewed lesson text and an enumerated choice; submitted extra text and profile identifiers are excluded. Tests verify that failures do not consume the allowance and a repeated successful request does not charge twice. Format checks and moderation still require age-specific output evaluation.

## Payment and family acceptance run

Use a test-mode Stripe key and test webhook signing secret from the same Experrt Stripe account. Keep the production key and existing live webhook unchanged. Use an isolated local or preview server for test events. Do not point a Stripe test listener at the production webhook. Use synthetic parent accounts with an owned test mailbox and fictional child nicknames. Mark test records clearly; do not inspect or modify real family records.

Record the deployment commit, content version, Stripe test event IDs, dates, browser/device and observed result for each row. Keep passwords, signing secrets and child work out of the evidence file.

| Journey | Required observation |
| --- | --- |
| Parent registers and follows the confirmation email | The link returns to the family area and the verified parent can unlock it. |
| Parent creates two child profiles | Purchases and progress remain assigned to the chosen profile. Children have no email account. |
| Parent opens child play, then returns to family settings | Family settings require password reauthentication. Another browser's child session cannot authorise a different household. |
| Parent submits checkout twice | One pending membership is reused. Stripe displays £20 GBP monthly, one child and the correct recurring terms. |
| Browser returns before a paid invoice webhook | No paid access is granted by the redirect alone. |
| A paid invoice arrives, then the same event is replayed | All 24 entitlements appear once, for the selected child, with the paid period and no duplicate reward or allowance reset. |
| A lesson is saved, the parent signs out, and another device signs in | The saved checkpoint and private creation return. A stale device's save cannot overwrite a newer revision silently. |
| Renewal succeeds and its invoice is replayed | Access extends by the invoice period. Successful-generation allowances reset once. |
| Renewal fails | The paid-through date is not extended. The family sees the payment state. |
| Parent cancels renewal | Renewal is cancelled and paid play remains available until the paid period ends. |
| Full refund arrives before or after fulfilment | The refunded period cannot grant access. A later, separately paid period remains valid when an older invoice is refunded. |
| Expiry occurs | Paid play and generation stop; parent exports remain available. |
| Parent requests deletion | Pending checkout is resolved first. On an accepted request, renewal is cancelled, play is paused, AI is disabled and play sessions are revoked. Operational erasure is tracked separately. |
| Provider fails, moderation blocks or allowance runs out | The authored alternative remains playable. Failed or blocked responses do not spend the success allowance. |
| Adult learner purchases an existing course | The existing adult route and webhook fulfilment still behave as before. |

Do not mark this run passed until the observed evidence exists. Test-mode credentials and an owned test mailbox are still required.

## Family pilot

Use the four free games first: Robot Rescue for ages 4–6, Creature Creator for ages 7–10, Prompt Repair Shop for ages 11–13 and Launch Studio for ages 14–16. Arrange sessions through the parent. Obtain appropriate participation consent and assent. Keep notes under anonymous session codes and age bands. Recording video or audio is unnecessary for the initial pilot.

Tell the learner: “You can try things, change your mind and ask for help. We are checking whether the game explains itself clearly.” For younger children, the adult reads or plays narration and supports using the controls without choosing the answers. Stop if the learner wants to stop.

1. Before playing, ask the learner to explain what they think the game asks them to do.
2. Observe the first action without prompting. Note unclear controls, unfamiliar words and help needed.
3. Let the learner make and repair a mistake. Ask what changed and why the new attempt might work.
4. At the fresh final challenge, avoid supplying the answer. Ask the learner to explain their choice in their own words or through a demonstration.
5. Ask how the game relates to using AI. Younger learners should recognise that Pip follows fixed instructions in this game and that AI can make mistakes; older learners should explain why a convincing answer still needs checking.
6. Test the relevant device and preferences, including touch, keyboard, narration off and reduced motion. Check refresh/resume and export separately.
7. Ask the parent which skill they observed and whether £20 per month for the whole library seems worthwhile. Ask about the membership, not the superseded £20-per-lesson offer.

Record: session code; age band; mission/version; device and preferences; whether the goal was understood; exact point where help was needed; repair explanation; independent final-challenge demonstration; enjoyment and fatigue; parent feedback; defect and proposed change. Record duration including pauses and adult help. A sticker or successful click sequence alone is not proof of understanding.

The initial duration targets remain unvalidated. Expand to every mission using `wonderlab-curriculum-review.md`. Obtain human educational review across all 24 before offering the library for sale. Revise confusing instructions and retest affected games with families before signing off.

## Decisions and evidence still needed

| Item | Evidence needed | Current status |
| --- | --- | --- |
| Brand | Name and trade mark clearance for Wonderlab by Experrt in the launch markets. | Not recorded. |
| Learning and value | Completed family notes across all four bands; human review of all 24 missions; observed duration and monthly value feedback. | Pilot procedure and review matrix prepared. No family results claimed. |
| Consumer terms | Reviewed recurring-price, renewal, cancellation, digital-content consent, refunds, trader details and complaint procedure; publish the approved version. | The public page is explicitly prelaunch. |
| Child privacy | Data-protection impact assessment, parent/child notices, age-assurance decision, processor and international-transfer review. | Implementation evidence is available; review is not recorded. |
| Retention and erasure | Approved retention periods, a working erasure process, treatment of billing records and backups, ownership of the request queue, and a tested deletion response. | Requests pause access; actual erasure is not implemented as an automated flow. |
| Guided AI | Provider project/endpoint retention evidence, approved model, actual pricing, age-specific output evaluation, incident escalation and cost measurements. | Generation remains disabled. A boolean flag is not provider evidence. |
| Payments | Successful test-mode acceptance run above, webhook delivery monitoring and support ownership. | Isolated handler/SQL tests exist; real provider run is pending. |
| Release scope | Scoped review of Wonderlab and shared navigation/webhook changes, with an adult-journey regression check. | A separate Wonderlab checkout has been prepared and its production build passed. Unrelated work stays in the original checkout. |

The ICO's [Children's Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/) are the reference for the child-data review. The provider's [under-18 guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance) requires additional safeguards for minors and addresses zero retention before processing personal data of children under 13 or the applicable age of digital consent. `store:false` and parent permission are not substitutes for the required configuration or review.

## Release order

First release a reviewed preview with the four free games and the paid/AI gates closed. Complete the payment acceptance run, family pilot and outstanding reviews, then publish the approved notices and terms. Record the evidence, reviewer and date for each gate before setting its corresponding environment flag. Verify the deployed environment after every change. Enable guided AI separately only when its own requirements have been met.

## Verification recorded in this pass

- 45 Wonderlab and public-route tests passed in the isolated checkout. This includes 38 Wonderlab tests and seven route tests.
- 13 existing adult Stripe payment/transaction regression tests passed in the original workspace.
- Targeted lint and TypeScript checks passed; the isolated Next.js production build passed.
- Preview preflight passed. Commerce and AI preflight correctly reported the missing launch configuration.
- Browser verification of the isolated build confirmed the membership landing page, revised privacy/access explanation and an animated Robot Rescue route reaching its first reward. No browser error was recorded during that game check.
- Earlier four-game playthrough and tablet checks remain documented in `wonderlab-arcade-review.md`; this pass did not repeat every mission in a browser.
