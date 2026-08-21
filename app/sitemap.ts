import type { MetadataRoute } from "next";
import { buildPublicSitemap } from "@/lib/public-sitemap";
import { getPublicSiteUrl } from "@/lib/site";
import { fetchCourseSlugsForSitemap } from "@/lib/supabase/public";

/**
 * Marketing pages, published courses, and published insights.
 *
 * This file must not call cookies() or the SSR Supabase client. Catching a
 * cookies() error still 500s the route in Next.js, which is what production
 * was doing when the catalogue fetch failed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courseSlugs = await fetchCourseSlugsForSitemap();
  return buildPublicSitemap({
    baseUrl: getPublicSiteUrl(),
    courseSlugs,
  });
}
