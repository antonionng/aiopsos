import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import {
  COURSE_LEVELS,
  COURSE_LEVEL_DESCRIPTIONS,
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  DIMENSION_LABELS,
  RESPONDENT_ROLE_LABELS,
  type CourseLevel,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Academy | AIOPSOS",
  description:
    "Facilitated AI literacy courses by role. Every course is delivered live by a trainer, with attendance, submissions and grades recorded.",
  alternates: { canonical: "/courses" },
};

export const dynamic = "force-dynamic";

function isCourseLevel(value: string | undefined): value is CourseLevel {
  return !!value && (COURSE_LEVELS as readonly string[]).includes(value);
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;
  const activeLevel = isCourseLevel(level) ? level : null;

  const allCourses = await fetchPublishedCourses();
  const courses = activeLevel
    ? allCourses.filter((c) => c.level === activeLevel)
    : allCourses;

  return (
    <div>
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          The Academy
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Courses are matched to the gaps your assessment finds, then delivered
          live by a trainer, in person or online. The platform records who
          attended, what they submitted and how they were graded. It does not
          replace the trainer.
        </p>
      </header>

      {/* Level filter */}
      <nav className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeLevel
              ? "border-border text-muted-foreground hover:text-foreground"
              : "border-foreground bg-foreground text-background"
          }`}
        >
          All levels
        </Link>
        {COURSE_LEVELS.map((lvl) => (
          <Link
            key={lvl}
            href={`/courses?level=${lvl}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeLevel === lvl
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {COURSE_LEVEL_LABELS[lvl]}
          </Link>
        ))}
      </nav>

      {activeLevel && (
        <p className="mb-8 text-sm text-muted-foreground">
          {COURSE_LEVEL_DESCRIPTIONS[activeLevel]}
        </p>
      )}

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No published courses at this level yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
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
          maps the gaps onto this catalogue, by department and by role. It takes
          about five minutes per person.
        </p>
        <Link
          href="/register"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Run an assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
