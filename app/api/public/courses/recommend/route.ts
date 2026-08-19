import { NextRequest, NextResponse } from "next/server";
import { fetchPublishedCourses } from "@/lib/courses";
import { rankCourses } from "@/lib/recommendation-engine";
import { courseRecommendSchema, validateBody } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Course recommendations for someone who has just finished the public
 * assessment and has no account yet. Takes the scores the submit endpoint
 * already returned to the browser, so it discloses nothing the caller does
 * not already hold, and reads only the published catalogue.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`courseRecommend:${ip}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const body = await req.json().catch(() => null);
  const validation = validateBody(courseRecommendSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { scores, respondent_role } = validation.data;

  // Respondents may skip the role question. Individual contributor is the
  // widest audience, so an unknown role gets the practitioner-facing courses
  // rather than nothing at all.
  const role = respondent_role ?? "individual_contributor";

  const catalogue = await fetchPublishedCourses();
  const matches = rankCourses(scores, role, catalogue);

  return NextResponse.json(
    {
      respondent_role: role,
      recommendations: matches.map(({ course, score, matched_dimensions }) => ({
        slug: course.slug,
        title: course.title,
        summary: course.summary,
        level: course.level,
        duration_hours: course.duration_hours,
        delivery_modes: course.delivery_modes,
        match_score: score,
        matched_dimensions,
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
