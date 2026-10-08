# Public learning agent

The marketing entry point is `/learning-agent`. The working experience is `/learning-agent/chat`. A `brief` query parameter prefills the composer; it never triggers a paid model call by itself. The homepage and public navigation link to this flow.

## Guest execution

The agent uses the existing OpenAI model router and a tool loop capped at eight steps and 95 seconds. It can inspect the public catalogue, create one to four substantive Markdown materials, and check the created pack. It has no access to private learner or workspace records and cannot publish, enrol, charge or issue credentials. Materials remain drafts for the visitor to review.

An HTTP-only, same-site cookie identifies a private 12-hour session. Only the cookie hash is stored. The database atomically claims each generation and enforces three attempts per session, nine attempts per hashed network identifier per UTC day, and 200 attempts globally per UTC day. Attempts are consumed when work starts, including failed attempts. A two-minute fenced lease prevents concurrent generation and allows recovery after an interrupted worker. No anonymous database grants or public execution grants are used.

`x-vercel-forwarded-for` supplies the network identifier in production. Non-Vercel production traffic shares the conservative `unknown` bucket until a trusted proxy header is configured. Network identifiers are HMAC-hashed with the existing service credential. Missing storage or AI credentials fail closed.

The agent's ready assessment prompts for contact after usable content exists. The third attempt always exposes the delivery step when a pack exists. The visitor can also choose to email any completed pack earlier.

## Contact and delivery

The contact form records the visitor's name, email, optional organisation and explicit permission to send the pack and share their brief/materials with Experrt for follow-up. It does not opt them into newsletters. The first accepted submission freezes the recipient and prevents further generation. Repeated requests must contain the same contact details.

The lead is saved in `course_enquiries` with source `guest_agent`, including the brief and generated pack, before email delivery. Resend sends the full materials inline and as an editable `.md` attachment to the visitor, and sends the lead details and same materials to `ag@experrt.com`. The visitor email's reply-to is `ag@experrt.com`; the lead notification's reply-to is the visitor.

Separate idempotency keys and persisted acceptance receipts allow retrying partial delivery without duplicating emails. The mailbox quota allows at most three new guest deliveries per UTC day. The 12-hour session window is shorter than the provider's 24-hour idempotency window. The UI reports success only after both provider acceptances are recorded. Acceptance is not a guarantee of inbox delivery. Pending sends currently require the visitor to retry; the saved lead remains available to staff.

## Configuration and verification

Required environment variables are `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` and `RESEND_API_KEY`. `EMAIL_FROM` is optional and defaults to `Experrt <noreply@experrt.com>`. No new provider or dependency is needed. Apply the `guest_agent` migration before serving the endpoints.

Checks:

- `npm test`: public route boundaries, bounded inputs, explicit consent and usable pack content, alongside the existing suite.
- `node scripts/verification/guest-agent-check.cjs`: isolated full-pack delivery, lead routing, partial failures, retries and provider idempotency. No real mail is sent.
- `supabase/tests/guest_agent.sql`: transactional database checks of privileges, busy leases, three-attempt cap, network quota, frozen recipients and expiry. The transaction rolls back its test data.
- TypeScript, targeted ESLint and the Next.js production build.
- Browser verification of anonymous creation, visible materials, contact timing and mobile layout.

## Release compatibility check, 10 September 2026

The customer-facing page is live at https://www.experrt.com/learning-agent, with chat at `/learning-agent/chat`. Both returned HTTP 200 without Vercel authentication, and the public session endpoint returned the initial three-attempt guest state.

The live deployment checked was `dpl_EZb4JYXR3a3u1toaad7aq4ZrZuU1` (`aiadop-kc2gwz496`). Vercel source-file hashes matched the current marketing page, chat, styles, guest API routes, generation/delivery modules, public-route rules, LMS agent/dispatcher and billing guard code. The guest and current-membership database functions coexist.

Do not promote the earlier standalone guest preview `dpl_9xMjJgLNjAct3LXNELCzjNE5UgJa` (`aiadop-lqmi3rek2`) as a later combined release. The shared workspace now contains newer team-management routes, settings and member-lifecycle migrations than that snapshot. Those changes are preserved for their own verified release. The guest feature is already included in the live deployment, so no extra promotion was needed for this check.

No unmerged Git entries, conflict markers or whitespace errors were found. All 206 unit tests and TypeScript passed. The delivery, assistant, editor and task-dispatch verification scripts passed. The dispatcher harness was updated to model the current-membership check and verify revoked access cannot schedule work; this fixed an outdated test mock without weakening the application guard.
