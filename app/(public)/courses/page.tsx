import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { CourseArtwork } from "@/components/course-artwork";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_DESCRIPTIONS,
  COURSE_CATEGORY_LABELS,
  COURSE_LEVELS,
  COURSE_LEVEL_DESCRIPTIONS,
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  DIMENSION_LABELS,
  RESPONDENT_ROLE_LABELS,
  type CourseCategory,
  type CourseLevel,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Courses — applied AI, technology and robotics training",
  description:
    "Facilitated training courses in applied AI, technology adoption and applied robotics, by role and by level. Delivered live by a trainer, in person or online, with attendance and grades recorded.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Courses — applied AI, technology and robotics training | Experrt",
    description:
      "Facilitated live by a trainer, in person or online. Courses by role and by level.",
    url: "/courses",
  },
};

export const dynamic = "force-dynamic";

function isCourseLevel(value: string | undefined): value is CourseLevel {
  return !!value && (COURSE_LEVELS as readonly string[]).includes(value);
}

function isCourseCategory(value: string | undefined): value is CourseCategory {
  return !!value && (COURSE_CATEGORIES as readonly string[]).includes(value);
}

// Active filter pill takes its subject's hue, so the filter you applied and
// the badges on the matching cards visibly agree.
const CATEGORY_PILL_ACTIVE: Record<CourseCategory, string> = {
  ai: "border-cat-ai/40 bg-cat-ai-soft text-cat-ai",
  technology: "border-cat-technology/40 bg-cat-technology-soft text-cat-technology",
  robotics: "border-cat-robotics/40 bg-cat-robotics-soft text-cat-robotics",
};

const CATEGORY_BADGE: Record<CourseCategory, string> = {
  ai: "bg-cat-ai-soft text-cat-ai",
  technology: "bg-cat-technology-soft text-cat-technology",
  robotics: "bg-cat-robotics-soft text-cat-robotics",
};

/** Preserve the other filter when building a pill's href. */
function hrefFor(params: { category?: string | null; level?: string | null }) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.level) query.set("level", params.level);
  const qs = query.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string }>;
}) {
  const { level, category } = await searchParams;
  const activeLevel = isCourseLevel(level) ? level : null;
  const activeCategory = isCourseCategory(category) ? category : null;

  const allCourses = await fetchPublishedCourses();
  const courses = allCourses.filter(
    (c) =>
      (!activeLevel || c.level === activeLevel) &&
      (!activeCategory || c.category === activeCategory)
  );

  const totalHours = courses.reduce((sum, c) => sum + c.duration_hours, 0);

  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />
      <header className="mb-12">
        <h1 className="mb-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Training courses
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Applied AI, technology adoption and applied robotics — every course
          facilitated live by a trainer, in person or online, and worked
          through on your team&apos;s own material. Pick from the catalogue, or
          run the assessment first and let it tell you which teams need what.
        </p>
      </header>

      {/* Subject */}
      <nav className="mb-3 flex flex-wrap gap-2">
        <Link
          href={hrefFor({ level: activeLevel })}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeCategory
              ? "border-border text-muted-foreground hover:text-foreground"
              : "border-foreground bg-foreground text-background"
          }`}
        >
          All subjects
        </Link>
        {COURSE_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={hrefFor({ category: cat, level: activeLevel })}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeCategory === cat
                ? CATEGORY_PILL_ACTIVE[cat]
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {COURSE_CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </nav>

      {/* Level */}
      <nav className="mb-6 flex flex-wrap gap-2">
        <Link
          href={hrefFor({ category: activeCategory })}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            activeLevel
              ? "border-border/60 text-muted-foreground hover:text-foreground"
              : "border-foreground/40 text-foreground"
          }`}
        >
          All levels
        </Link>
        {COURSE_LEVELS.map((lvl) => (
          <Link
            key={lvl}
            href={hrefFor({ category: activeCategory, level: lvl })}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              activeLevel === lvl
                ? "border-foreground/40 text-foreground"
                : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {COURSE_LEVEL_LABELS[lvl]}
          </Link>
        ))}
      </nav>

      {activeCategory && (
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          {COURSE_CATEGORY_DESCRIPTIONS[activeCategory]}
        </p>
      )}
      {activeLevel && (
        <p className="mb-2 text-sm text-muted-foreground">
          {COURSE_LEVEL_DESCRIPTIONS[activeLevel]}
        </p>
      )}

      <p className="mb-8 text-xs text-muted-foreground">
        {courses.length} course{courses.length === 1 ? "" : "s"} ·{" "}
        {totalHours} facilitated hours
      </p>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing matches that combination yet. Try a different subject or
            level.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30"
            >
              <div className="flex h-20 items-center justify-center border-b border-border/60 bg-foreground/[0.02]">
                <CourseArtwork category={course.category} className="h-14 w-20" />
              </div>
              <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    CATEGORY_BADGE[course.category] ?? "bg-brand/10 text-brand"
                  }`}
                >
                  {COURSE_CATEGORY_LABELS[course.category] ?? course.category}
                </span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {COURSE_LEVEL_LABELS[course.level]}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {course.duration_hours} hrs
                </span>
                <span className="text-xs text-muted-foreground">
                  {course.delivery_modes
                    .map((mode) => DELIVERY_MODE_LABELS[mode] ?? mode)
                    .join(" / ")}
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
                {course.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {course.summary}
              </p>

              {course.target_dimensions.length > 0 && (
                <p className="mb-3 text-xs text-muted-foreground">
                  Addresses:{" "}
                  <span className="text-foreground/80">
                    {course.target_dimensions
                      .map((d) => DIMENSION_LABELS[d] ?? d)
                      .join(", ")}
                  </span>
                </p>
              )}

              {course.target_roles.length > 0 && (
                <p className="mb-4 inline-flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Users className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>
                    {course.target_roles
                      .map((r) => RESPONDENT_ROLE_LABELS[r] ?? r)
                      .join(", ")}
                  </span>
                </p>
              )}

              <span className="mt-auto inline-flex items-center text-sm font-medium text-foreground">
                Course outline
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-16 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
          Not sure which courses your teams need?
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The readiness assessment scores each person across five dimensions and
          maps the gaps onto this catalogue, by department and by role. Five
          minutes per person, and it is usually the cheapest way to find out
          that the team you assumed was fine is not.
        </p>
        <Link
          href="/register"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Run an assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
