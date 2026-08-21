import { createClient } from "@/lib/supabase/server";
import type { Course, CourseModule } from "@/lib/types";
import type { Dimension, RespondentRole } from "@/lib/constants";

/**
 * Server-side access to the academy catalogue.
 *
 * Everything here reads through the anon/SSR client so row-level security
 * decides what is visible: migration 020 exposes `published` courses to
 * anonymous visitors and restricts writes to super_admin. That is what lets
 * the public catalogue pages and the anonymous assessment results page share
 * these helpers with the authenticated dashboard.
 */

const COURSE_COLUMNS =
  "id, slug, title, summary, level, category, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status, created_by, created_at, updated_at";

const MODULE_COLUMNS =
  "id, course_id, position, title, summary, duration_hours, outcomes, lab_url, created_at";

/** PostgREST can hand back `numeric` as a string; jsonb as anything. */
function toCourse(row: Record<string, unknown>): Course {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    level: row.level as Course["level"],
    category: (row.category ?? "ai") as Course["category"],
    duration_hours: Number(row.duration_hours ?? 0),
    delivery_modes: (row.delivery_modes ?? []) as Course["delivery_modes"],
    learning_outcomes: Array.isArray(row.learning_outcomes)
      ? (row.learning_outcomes as string[])
      : [],
    target_roles: (row.target_roles ?? []) as RespondentRole[],
    target_dimensions: (row.target_dimensions ?? []) as Dimension[],
    status: row.status as Course["status"],
    created_by: (row.created_by as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function toModule(row: Record<string, unknown>): CourseModule {
  return {
    id: String(row.id),
    course_id: String(row.course_id),
    position: Number(row.position),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    duration_hours: Number(row.duration_hours ?? 0),
    outcomes: Array.isArray(row.outcomes) ? (row.outcomes as string[]) : [],
    lab_url: (row.lab_url as string | null) ?? null,
    created_at: String(row.created_at),
  };
}

/** The published catalogue, ordered for stable display. */
export async function fetchPublishedCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("status", "published")
    .order("level", { ascending: true })
    .order("title", { ascending: true });

  return (data ?? []).map((row) => toCourse(row as Record<string, unknown>));
}

/** One published course with its modules in running order, or null. */
export async function fetchCourseBySlug(
  slug: string
): Promise<{ course: Course; modules: CourseModule[] } | null> {
  const supabase = await createClient();

  const { data: courseRow } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!courseRow) return null;

  const course = toCourse(courseRow as Record<string, unknown>);

  const { data: moduleRows } = await supabase
    .from("course_modules")
    .select(MODULE_COLUMNS)
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  return {
    course,
    modules: (moduleRows ?? []).map((row) =>
      toModule(row as Record<string, unknown>)
    ),
  };
}

/** Every published slug, for static params and sitemaps. */
export async function fetchPublishedCourseSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("slug")
    .eq("status", "published");

  return (data ?? []).map((row) => String(row.slug));
}
