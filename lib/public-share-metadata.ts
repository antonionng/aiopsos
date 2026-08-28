import { getPublicSiteUrl } from "./site.ts";
import { withSiteShareImages } from "./social-image.ts";
import type { InsightArticle } from "./insights/types.ts";
import type { UseCaseEntry } from "./use-cases.ts";

/**
 * Page-level metadata for public marketing routes. Kept as plain objects so
 * node:test can assert every route that sets a title also keeps og:image.
 * Next Metadata is a structural superset of these returns.
 */

export function insightsIndexMetadata() {
  const site = getPublicSiteUrl();
  return withSiteShareImages({
    title: "Insights on workforce AI and robotics training",
    description:
      "Briefings for L&D, HR, operations and transformation leads commissioning in-house AI, technology and robotics training. No login required.",
    alternates: {
      canonical: `${site}/insights`,
      types: { "application/rss+xml": `${site}/insights/rss.xml` },
    },
    openGraph: {
      title: "Insights on workforce AI and robotics training",
      description:
        "Public briefings for people buying in-house AI and robotics training.",
      url: `${site}/insights`,
      type: "website",
    },
    robots: { index: true, follow: true },
  });
}

export function insightArticleMetadata(article: InsightArticle) {
  const site = getPublicSiteUrl();
  const canonical = `${site}/insights/${article.slug}`;
  return withSiteShareImages({
    title: article.title,
    description: article.description,
    alternates: {
      canonical,
      types: { "application/rss+xml": `${site}/insights/rss.xml` },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      title: article.title,
      description: article.description,
    },
    robots: { index: true, follow: true },
  });
}

export function coursesIndexMetadata() {
  return withSiteShareImages({
    title: "Courses - applied AI, technology and robotics training",
    description:
      "Facilitated training courses in applied AI, technology adoption and applied robotics, by subject, by level and by sector. Delivered live by a trainer, in person or online, with attendance and grades recorded.",
    alternates: { canonical: "/courses" },
    openGraph: {
      title: "Courses - applied AI, technology and robotics training | Experrt",
      description:
        "Facilitated live by a trainer, in person or online. Courses by subject, by level and by sector.",
      url: "/courses",
    },
  });
}

export function coursePageMetadata(course: { title: string; summary: string; slug: string }) {
  // Course pages have a local opengraph-image.tsx. Do not set images here —
  // Next would replace that generated card with the site default.
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: course.title,
      description: course.summary,
    },
  };
}

export function courseSectorMetadata(entry: { headline: string; intro: string }, slug: string) {
  const canonical = `/courses/sector/${slug}`;
  return withSiteShareImages({
    title: entry.headline,
    description: entry.intro,
    alternates: { canonical },
    openGraph: {
      title: `${entry.headline} | Experrt`,
      description: entry.intro,
      url: canonical,
    },
  });
}

export function experrtAiMetadata() {
  return withSiteShareImages({
    title: "Experrt AI - your very own learning agent",
    description:
      "An AI learning agent that knows each person's training record and acts on it: recommends the next course from measured gaps, maps a learning path, and works between the live sessions a facilitator runs. Structural privacy, capped spend, no grading - an agent your compliance team can approve.",
    alternates: { canonical: "/experrt-ai" },
    openGraph: {
      title: "Experrt AI - your very own learning agent",
      description:
        "It knows your training record, plans your path, and acts on it - between live facilitated sessions, never instead of them.",
      url: "/experrt-ai",
    },
  });
}

export function useCasesIndexMetadata() {
  return withSiteShareImages({
    title: "Use cases",
    description:
      "What facilitated AI, technology and robotics training looks like applied to your kind of organisation - enterprise or growing team - and to the function doing the work.",
    alternates: { canonical: "/use-cases" },
  });
}

export function useCasePageMetadata(entry: UseCaseEntry) {
  return withSiteShareImages({
    title: `${entry.name} - Use cases`,
    description: entry.headline,
    alternates: { canonical: `/use-cases/${entry.slug}` },
    openGraph: {
      title: `${entry.name} - Experrt use cases`,
      description: entry.headline,
      type: "article",
    },
  });
}

export function blogRedirectMetadata() {
  return withSiteShareImages({
    title: "Insights",
    robots: { index: false, follow: true },
    alternates: { canonical: "/insights" },
  });
}

export function verifyCertificateMetadata() {
  return withSiteShareImages({
    title: "Verify a certificate",
    description:
      "Check a certificate of completion issued through Experrt: course, dates, facilitator, attendance and grade.",
    robots: { index: false, follow: false },
  });
}

export function subscriptionConfirmedMetadata() {
  return withSiteShareImages({
    title: "Subscription confirmed",
    // A page reachable only with a one-time token has nothing to offer an
    // index, and the token would end up in the search result if it did.
    robots: { index: false, follow: false },
  });
}

export function unsubscribedMetadata() {
  return withSiteShareImages({
    title: "Unsubscribed",
    robots: { index: false, follow: false },
  });
}

export function termsMetadata() {
  return withSiteShareImages({
    title: "Terms of Service | Experrt",
    description: "Terms of Service for the Experrt enterprise AI adoption platform.",
  });
}

export function privacyMetadata() {
  return withSiteShareImages({
    title: "Privacy Policy | Experrt",
    description: "Privacy Policy for the Experrt enterprise AI adoption platform.",
  });
}

export function cookiesMetadata() {
  return withSiteShareImages({
    title: "Cookie Policy | Experrt",
    description: "Cookie Policy for the Experrt enterprise AI adoption platform.",
  });
}
