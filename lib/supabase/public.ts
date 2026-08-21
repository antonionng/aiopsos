import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { FALLBACK_PUBLISHED_COURSE_SLUGS } from "../published-course-slugs.ts";

/**
 * Cookie-less anon client for crawler-facing reads.
 *
 * The SSR client in server.ts calls cookies(). Next.js treats a caught
 * cookies() error as a failed render, which is why sitemap.xml 500ed when
 * the catalogue fetch was wrapped in try/catch. This client never touches
 * the request store.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function fetchCourseSlugsForSitemap(): Promise<string[]> {
  const supabase = createPublicClient();
  if (!supabase) return [...FALLBACK_PUBLISHED_COURSE_SLUGS];

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("slug")
      .eq("status", "published");

    if (error || !data) return [...FALLBACK_PUBLISHED_COURSE_SLUGS];

    const slugs = data
      .map((row) => String((row as { slug?: string }).slug ?? "").trim())
      .filter(Boolean);

    return slugs.length > 0 ? slugs : [...FALLBACK_PUBLISHED_COURSE_SLUGS];
  } catch {
    return [...FALLBACK_PUBLISHED_COURSE_SLUGS];
  }
}
