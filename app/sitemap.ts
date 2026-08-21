import type { MetadataRoute } from "next";
import { fetchPublishedCourseSlugs } from "@/lib/courses";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://experrt.com";

export const dynamic = "force-dynamic";

/**
 * Marketing pages plus every published course.
 *
 * Course pages are the long tail worth indexing: each one is a specific
 * subject a buyer searches for by name. Everything behind auth is excluded
 * here and in robots.ts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/docs", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  ].map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // A database that is unreachable at build time must not take the sitemap
  // down with it - the marketing routes are still worth serving.
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchPublishedCourseSlugs();
    courseRoutes = slugs.map((slug) => ({
      url: `${BASE_URL}/courses/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    courseRoutes = [];
  }

  return [...staticRoutes, ...courseRoutes];
}
