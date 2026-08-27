import { getPublishedInsights } from "./insights/catalog.ts";
import { getUseCases } from "./use-cases.ts";

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
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
    {
      path: "/ai-literacy-training",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/ai-readiness-assessment",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
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

export function insightSitemapEntries(baseUrl: string): PublicSitemapEntry[] {
  return getPublishedInsights().map((article) => ({
    url: `${baseUrl}/insights/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export function buildPublicSitemap(options: {
  baseUrl: string;
  courseSlugs: string[];
  lastModified?: Date;
}): PublicSitemapEntry[] {
  const lastModified = options.lastModified ?? new Date();
  const entries = [
    ...staticMarketingEntries(options.baseUrl, lastModified),
    ...courseSitemapEntries(options.baseUrl, options.courseSlugs, lastModified),
    ...useCaseSitemapEntries(options.baseUrl, lastModified),
    ...insightSitemapEntries(options.baseUrl),
  ];

  return entries.filter((entry) => {
    const path = new URL(entry.url).pathname;
    return !isLoginOnlyPath(path);
  });
}
