import { getPublishedInsights } from "@/lib/insights/catalog";
import { getPublicSiteUrl } from "@/lib/site";

/**
 * RSS for the insights.
 *
 * Worth the forty lines even in 2026: this audience includes analysts and
 * L&D newsletter editors who still aggregate by feed, and a feed costs
 * nothing to keep current because it is generated from the same catalogue
 * the pages are.
 *
 * The description carries the dek rather than the body. A feed that ships
 * the whole article gives a reader no reason to arrive on the page, and the
 * page is where the sign-up and the call to action live.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const siteUrl = getPublicSiteUrl();
  const articles = getPublishedInsights();
  const latest = articles[0];

  const items = articles
    .map((article) => {
      const url = `${siteUrl}/insights/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(`${article.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(article.topic)}</category>
      <description>${escapeXml(article.dek)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Experrt Insights</title>
    <link>${escapeXml(`${siteUrl}/insights`)}</link>
    <description>Briefings for the people who commission workforce AI, technology and robotics training.</description>
    <language>en-GB</language>
    <atom:link href="${escapeXml(`${siteUrl}/insights/rss.xml`)}" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${new Date(`${latest.publishedAt}T09:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
