import { caseStudies } from "./case-studies.ts";
import { INSIGHT_TOPIC_PAGES } from "./insights/topics.ts";
import { COURSE_SECTOR_SLUGS } from "./constants.ts";
import { getPublishedInsights } from "./insights/catalog.ts";
import { getSectors } from "./sectors.ts";
import { getUseCases } from "./use-cases.ts";
import { TOPIC_HUBS, allSelfServeCourses } from "./self-serve/seo.ts";

export type PublicSitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const LOGIN_ONLY_PATHS = [
  "/login",
  "/register",
  "/dashboard",
  "/blog",
  "/forgot-password",
  "/reset-password",
];

export function isLoginOnlyPath(pathname: string): boolean {
  return LOGIN_ONLY_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`)
  );
}

export function staticMarketingEntries(
  baseUrl: string,
  lastModified: Date
): PublicSitemapEntry[] {
  return [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/ai-labs", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/learning-agent", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/assessment/start", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/use-cases", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/experrt-ai", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/docs", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  ].map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

export function courseSitemapEntries(
  baseUrl: string,
  slugs: string[],
  lastModified: Date
): PublicSitemapEntry[] {
  return [...new Set(slugs)]
    .filter((slug) => slug.trim().length > 0)
    .map((slug) => ({
      url: `${baseUrl}/courses/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
}

export function useCaseSitemapEntries(
  baseUrl: string,
  lastModified: Date
): PublicSitemapEntry[] {
  return getUseCases().map((entry) => ({
    url: `${baseUrl}/use-cases/${entry.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export function sectorSitemapEntries(
  baseUrl: string,
  lastModified: Date
): PublicSitemapEntry[] {
  return getSectors().map((entry) => ({
    url: `${baseUrl}/courses/sector/${COURSE_SECTOR_SLUGS[entry.sector]}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
}

export function insightSitemapEntries(baseUrl: string): PublicSitemapEntry[] {
  return getPublishedInsights().map((article) => ({
    url: `${baseUrl}/insights/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export function selfServeSitemapEntries(
  baseUrl: string,
  lastModified: Date
): PublicSitemapEntry[] {
  return [
    { url: `${baseUrl}/learn`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    ...TOPIC_HUBS.map((hub) => ({
      url: `${baseUrl}/learn/topics/${hub.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...allSelfServeCourses().map((course) => ({
      url: `${baseUrl}/learn/${course.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

export function buildPublicSitemap(options: {
  baseUrl: string;
  courseSlugs: string[];
  lastModified?: Date;
}): PublicSitemapEntry[] {
  const lastModified = options.lastModified ?? new Date();
  const entries = [
    ...staticMarketingEntries(options.baseUrl, lastModified),
    ...["/case-studies", ...caseStudies.map(item => `/case-studies/${item.slug}`)].map(path => ({url: `${options.baseUrl}${path}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8})),
    ...courseSitemapEntries(options.baseUrl, options.courseSlugs, lastModified),
    ...selfServeSitemapEntries(options.baseUrl, lastModified),
    ...sectorSitemapEntries(options.baseUrl, lastModified),
    // This is a use-case URL utility, not a React hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ...useCaseSitemapEntries(options.baseUrl, lastModified),
    ...insightSitemapEntries(options.baseUrl),
    ...INSIGHT_TOPIC_PAGES.map(entry => ({url: `${options.baseUrl}/insights/topic/${entry.slug}`,lastModified,changeFrequency: "monthly" as const,priority: 0.7})),
  ];

  return entries.filter((entry) => {
    const path = new URL(entry.url).pathname;
    return !isLoginOnlyPath(path);
  });
}
