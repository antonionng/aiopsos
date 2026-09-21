# Experrt inbound release

Released 9 September 2026 to https://www.experrt.com.

Deployment: `dpl_DyZ6iL57zH4rZFaWDrtaz3kMA3k7`. Production promotion confirmed by Vercel.

## Delivered

- Public learning check now requests name, email and explicit data-capture consent before unlocking results and the downloadable snapshot. Organisation is optional. Marketing consent is separate and unchecked.
- Answers, server-validated scores, scope and consent are stored with the enquiry. The enquiry workspace displays answers and marketing status.
- Contact enquiries are saved before email notifications. Repeated requests with the same identifier cannot create duplicate leads. Save failures show an error rather than a false success.
- Email templates use the citrus, violet and ink brand palette and updated learning language. Email provider errors are surfaced to calling code. Notification failures do not discard saved leads.
- New favicon, SVG icon and Apple icon. Social images are generated dynamically with page titles/descriptions; course images use the same brand treatment.
- Homepage structured data, page metadata, canonical URLs, assessment indexing and sitemap entries updated. Privacy copy explains assessment capture and optional marketing consent.
- Fonts are served locally. The production build uses the verified webpack build path.

## Verification

- Production build passed. All 182 unit tests passed. Targeted lint returned no errors; one normal email image warning remains.
- Assistant, content editor and task-dispatch regression checks passed.
- Transactional LMS database checks passed for tenant isolation, idempotency, publishing, client consent, learning, grading and evidence.
- Ten live public pages returned HTTP 200, one H1, titles, canonical URLs on www.experrt.com and social-image metadata.
- Live robots, sitemap, favicon, SVG icon, Apple icon and dynamic PNG returned HTTP 200 with appropriate content types.
- Anonymous private learning workspace redirected to login.
- Live browser journey completed four questions, reached the gate, saved details with marketing unchecked and displayed the expected 3.0/5 result.
- Live contact integration checks confirmed malformed input rejection, concurrent retry deduplication and durable storage. Incomplete assessment submissions were rejected. Synthetic enquiries were marked closed.

Email inbox delivery was not independently verified. Successful capture means the enquiry is saved; it does not guarantee delivery to an inbox. Marketing opt-in is recorded, not a claim that an automated nurture campaign has been configured.

## SEO and inbound follow-up

The supplied X article informed the review, especially its technical audit, search-intent and internal-link suggestions. Its ranking promises are not evidence for Experrt. Local business and city-page tactics need a real business/location fit.

Next, establish a Search Console baseline for impressions, queries, clicks and indexed pages. Use actual query evidence to prioritise useful course, use-case and insight content, strengthen relevant internal links and measure contact/assessment conversions. Search Console data was not available in this release, so no rankings or traffic gains are claimed.

## Remaining LMS work

This release improves inbound readiness; it does not complete every enterprise LMS capability. The existing enterprise completion plan still identifies durable agent recovery, SSO/SCIM, content interoperability, unified completion/credential rules, integrated billing acceptance checks and discussion pagination/moderation as further work. Do not advertise these as completed integrations.

See [enterprise completion plan](enterprise-lms-completion-plan.md) and [LMS implementation notes](lms-implementation-and-next-steps.md) for the detailed backlog.
