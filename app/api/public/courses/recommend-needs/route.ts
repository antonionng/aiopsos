import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPublishedCourses } from "@/lib/courses";
import { rankCoursesByNeed } from "@/lib/training-needs";
import { validateBody } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { COURSE_CATEGORIES, RESPONDENT_ROLES, COURSE_CATEGORY_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const needsRecommendSchema = z.object({
  needs: z.object({
    ai: z.number().min(0).max(5),
    technology: z.number().min(0).max(5),
    robotics: z.number().min(0).max(5),
  }),
  respondent_role: z.enum(RESPONDENT_ROLES).optional().nullable(),
});

/**
 * Course recommendations from a training-needs result. Same trust model as
 * the maturity recommend route: the caller sends back scores the submit
 * endpoint already gave them, and only the published catalogue is read.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`needsRecommend:${ip}`, RATE_LIMITS.api);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const validation = validateBody(needsRecommendSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { needs, respondent_role } = validation.data;
  const catalogue = await fetchPublishedCourses();
  const ranked = rankCoursesByNeed(needs, respondent_role ?? null, catalogue);

  return NextResponse.json({
    subjects: ranked.map((s) => ({
      category: s.category,
      label: COURSE_CATEGORY_LABELS[s.category],
      score: s.score,
      band: { id: s.band.id, label: s.band.label, description: s.band.description },
      courses: s.courses.map((c) => ({
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        level: c.level,
        category: c.category,
        duration_hours: c.duration_hours,
        delivery_modes: c.delivery_modes,
      })),
    })),
    categories: COURSE_CATEGORIES,
  });
}
