# Insights and contact release

Published 9 September 2026 to https://www.experrt.com.
Deployment: `dpl_Z8aEhL2wFdUjafwNzKpbH5niRRAW`.

## Reader journey

Find a practical guide through search or the Insights hub, use its template or example, then explore a relevant course, take the gated learning check or send an enquiry. The contact route records the referring article when the reader follows an article's contact link.

## Content

Twelve original guides added, bringing the catalogue to 23. New guides cover training needs analysis, a 30-day adoption pilot, Copilot training, workplace prompts, a training business case, LMS selection, blended learning, AI champions, use-case prioritisation, a skills matrix, training proposals and a first workshop agenda.

Each new guide has a distinct practical purpose, relevant internal links and today's actual publication date. Worked examples and calculations are explicitly illustrative. No invented customer results, keyword volumes or ranking improvements are claimed.

Content lives in `lib/insights/articles/growth-guides.ts` and is registered through the existing catalogue. That catalogue feeds page generation, the sitemap, RSS and related-content links.

The approach follows [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Product-specific references in the Copilot article link to [Microsoft's Scenario Library](https://adoption.microsoft.com/en-us/scenario-library/) and [administrator adoption guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-enablement-resources). The prioritisation guide distinguishes its suggested worksheet from the [NIST AI risk framework](https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-resources).

## Experience

- Branded Insights hero, three curated starting paths, search and topic filters.
- Public articles remain readable without registration. The learning check continues to gate results with name, email and capture consent.
- Article contents navigation, visible organisation authorship, relevant learning check calls to action and dynamic image URLs in Article structured data.
- Contact form offers four enquiry types, tailored message guidance, optional organisation and team size, and explicit next steps.
- Inline errors preserve entered data. Successful submissions replace the form with a focused confirmation and the reply address.
- Enquiry type, team size and article referral are included in the saved enquiry message. Organisation uses its existing dedicated field. Marketing remains off.

## Verification

- 191 unit tests passed; targeted lint and TypeScript checks passed.
- Hosted production build passed and promotion succeeded.
- All 12 live articles returned 200 with one H1, correct canonical URLs, social metadata, Article schema, matching contents anchors and contact referral links.
- Every new guide appeared in the live sitemap and RSS feed. Unknown article returned 404.
- Browser search narrowed the catalogue to the matching Copilot guide; article navigation reached the contact form with its source parameter.
- Contact submitted successfully in development and production. Database checks confirmed organisation, enquiry type, team size, article referral and marketing off. Synthetic enquiries were closed.
- Live whitespace-only message was rejected; inputs remained available, and correction succeeded with the confirmation focused.
- Phone-sized screenshots at 390px showed no horizontal overflow on either page.
- The isolated browser's network-abort simulation stalled and was closed. It is not counted as a passed connection-failure test; live server-validation recovery and successful capture were independently verified.

## Growth measurement

The topic selection reflects reader tasks and buying questions, not a measured keyword-volume study. Search Console query data and conversion baselines remain necessary to evaluate results and prioritise the next batch. Article referral capture is direct-link context, not full multi-touch attribution. No subscriber campaign was sent by this release.
