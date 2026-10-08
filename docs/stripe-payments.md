# Direct Stripe payments

New course purchases, cohort card payments and credit top-ups use direct Stripe Checkout. Organisation invoices remain available through the existing invoice workflow. Existing Mooov callbacks and payment records are retained for payments already started; no new checkout route calls Mooov.

## Configuration

Set these server environment variables on the deployment and local development environment:

- `STRIPE_SECRET_KEY`: the Stripe account's secret key. Use test credentials while verifying the integration.
- `STRIPE_WEBHOOK_SECRET`: the signing secret for this application's webhook endpoint, not the API key. A Stripe CLI forwarding session has its own signing secret.
- `NEXT_PUBLIC_APP_URL`: the site's HTTPS origin. Local development may use an HTTP localhost origin.

Hosted Checkout does not require a publishable key in the browser. The existing server Stripe SDK creates the session and the browser follows its URL.

Register `/api/stripe/webhook` on the same Stripe account and environment as the secret key, with these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `charge.refunded`
- `customer.subscription.updated` and `customer.subscription.deleted` for existing subscription records

The webhook checks the signature against the raw request body, retrieves authoritative Checkout session details and only fulfils a paid session. Errors in fulfilment return HTTP 503 so Stripe can retry. Partial refunds do not reverse an entire credit pack or pause a course; full refunds do. Manual refund requests are made in Stripe's dashboard; this work does not initiate any refunds.

## Database rollout

Apply the staged course-commerce migration first, then `supabase/migrations/20261002094146_stripe_direct_payments.sql`. The second migration adds Stripe identifiers, a processor marker and purchase snapshots without renaming the historical `mooov_payments` table. Its existing credit-ledger foreign keys and revenue reads remain intact. New rows have `provider='stripe'`; historical rows default to `mooov`.

Credit/cohort reservations and event fulfilment use service-only database functions. Prices and credit quantities come from server records. Repeated clicks reuse a pending session, repeated callbacks do not fulfil twice, and a failed wallet update rolls back the event receipt so a retry is safe. Course orders retain their separate transactional enrolment handler. An expired Checkout is marked voided and can be replaced on the next attempt.

Both migrations were applied on 2 October 2026 to the app's `aiopsos` Supabase project (`ecxsqzvhsydpgstvvxxo`). Remote migration history records `agent_course_commerce` as `20261002101450` and `stripe_direct_payments` as `20261002101455`; the repository SQL files retain their original creation timestamps. Verified the Stripe columns, service-only function permissions and row-level security on all four new tables.

Vercel production already contains `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `NEXT_PUBLIC_APP_URL`. This check confirmed variable names, without reading or changing their values. Local environment files do not contain Stripe credentials. No payments were sent, and the deployed Stripe account and webhook delivery have not been tested. Test the complete flow in Stripe test mode and verify successful payment, unpaid completion, duplicate webhook, temporary database failure, expiry, full refund and another learner's access before enabling course sales.

The existing Supabase CLI link in `supabase/.temp/project-ref` points to the older `AIOS` project (`oukbxuqaguwkkyevddee`), rather than the database configured in `.env.local`. These migrations were applied through the authenticated Supabase connector to the verified app project. Re-link the CLI to the intended database before using any linked migration command; do not blindly push the repository's historical migrations.

The security advisor reported informational notices for the new service-only tables because they intentionally have no browser policies. Both browser roles have no table privileges. Other advisor warnings concern existing functions and Auth settings, outside these migrations.

`AGENT_COURSE_COMMERCE_ENABLED` remains off by default. Course sales also require a reviewed, active offer, released assessment plan, accepted reviewer and course terms. The switch to Stripe does not bypass these course release requirements.

## Verification

Run `npm test` and `npx tsc --noEmit`. Stripe tests use controlled SDK responses and isolated PostgreSQL; they are not proof of a working deployed Stripe account connection.

The combined release was deployed and promoted to production on 2 October 2026 as `dpl_CQoAptHtaBWHWY3Td7M76YJv9W5s`. It preserves the previously deployed self-paced courses, certificates and individual/team Stripe fulfilment handlers alongside the new agent-course promotion and direct credit/cohort payments. All 655 tests, TypeScript and targeted lint checks passed. Deployed checks confirmed the homepage, new Foundations page, existing paid course page and illustration return HTTP 200, the internal review page returns HTTP 404, and an invalid Stripe webhook signature returns HTTP 400. No actual payment was made; agent-course offers remain inactive.

Official references: [Checkout sessions](https://docs.stripe.com/api/checkout/sessions/create), [Checkout fulfilment](https://docs.stripe.com/checkout/fulfillment), and [webhook signatures](https://docs.stripe.com/webhooks/signature).
