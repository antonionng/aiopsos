> Update, 9 September 2026: native LMS implementation now exists. See [current implementation and next steps](lms-implementation-and-next-steps.md) for the authoritative feature status.

# Design delivery and feature coverage

9 September 2026

## Positioning

Lead with the Experrt platform. Keep the academy and consulting prominently available as complementary offers. The homepage now provides distinct paths for the platform, learning with Experrt, and expert guidance.

The design uses violet, citrus, coral and blue; original generated editorial artwork; typographic course covers; expressive but bounded motion; and a light default theme. Existing saved theme preferences still apply. Reduced-motion settings are respected by the new experiences.

## Implemented in this change

- Redesigned homepage, shared navigation and platform metadata.
- Interactive explorer linking to existing assessment, cohort, learner, AI, document and evidence pages.
- Featured-course search and category filters, using known catalogue slugs. These filter featured courses, not the entire live catalogue.
- Provider and enterprise audience switch.
- Clearly labelled, local-only future programme preview. It does not invoke AI, create a programme, send messages or alter an account.
- New platform home introduction and learning-first manager overview.
- Refreshed control-area palette and navigation terminology.
- Learner welcome, next enrolled session, counts from actual learning data, course search and status filters.
- Explicit loading failure and retry states on My Learning, with cancelled requests ignored on unmount.
- Removal of random personal-usage fallback and usage-derived success cards from the home page.
- Removal of unsupported AI-provider promotion from the home page.
- Learning overview no longer depends on an AI usage response being available.

## Promise-to-product map

“Implemented foundation” means the relevant application route and supporting source exist. It does not mean all roles, integration credentials or live deployment states were verified in this change.

| Capability | Product destination | Status |
|---|---|---|
| Readiness and training-needs assessment | `/dashboard/assessment` | Implemented foundation |
| Course discovery | `/courses` | Implemented foundation; featured discovery redesigned |
| Training groups and live sessions | `/dashboard/cohorts` | Implemented foundation |
| Attendance and grading | Cohort register and grades routes | Implemented foundation |
| Personal learning and released feedback | `/dashboard/my-learning` | Implemented foundation; redesigned with real data |
| Record-aware AI assistance | `/dashboard/chat` | Implemented foundation; account access and allowance apply |
| Organisation document library | `/dashboard/knowledge` | Implemented foundation; access controls apply |
| Policies and approvals | `/dashboard/ai-policy`, `/dashboard/approvals` | Existing routes retained |
| Analytics | `/dashboard/analytics` | Existing route retained; no new competency claims |
| Evidence packs | `/dashboard/evidence` | Implemented foundation |
| Credential verification | `/verify/[ref]` | Implemented foundation |
| Billing and invoicing | Existing billing and invoice routes | Retained; no commercial or payment logic changed |
| Consulting and facilitated training | Contact and course routes | Existing enquiry destinations retained |
| Durable agents that create and coordinate programmes | Future programme workspace | Not implemented by this design change |
| Complete native course authoring and self-paced LMS | Future learning studio | Not implemented by this design change |
| Provider branding and full provider-client agreements | Future provider workspaces | Not implemented by this design change |
| Equipment-scoped robotics competency and authorisation | Future practical evidence workflow | Not implemented by this design change |
| Enterprise identity provisioning and packaged-content interoperability | Future integrations | Not implemented by this design change |

## Assets

Two original AI-generated images were created for this design and converted to WebP. They are illustrative artwork, not evidence of a customer or an actual workshop. Source originals remain in the generation output; project-owned web assets are in `public/images/learning`.

## Verification

- Production build, including TypeScript checking.
- Targeted lint of changed page and component files.
- Existing unit suite: 172 passed.
- Local homepage returned HTTP 200 before preview handoff.
- No authenticated browser interaction or visual browser QA was performed. Account-specific workflows still need role-based acceptance testing before release.
- No database migrations, external messages, payments or production deployment were performed.

The complete agentic LMS strategy remains a product roadmap. This delivery establishes the visual direction and improves existing app experiences; it must not be represented as completing every capability in that roadmap.
