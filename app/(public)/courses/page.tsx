import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { CatalogueFilters } from "@/components/courses/catalogue-filters";
import { CourseCardGrid } from "@/components/courses/course-card";
import { getSectors } from "@/lib/sectors";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_DESCRIPTIONS,
  COURSE_LEVELS,
  COURSE_LEVEL_DESCRIPTIONS,
  COURSE_SECTOR_LABELS,
  COURSE_SECTOR_SLUGS,
  type CourseCategory,
  type CourseLevel,
} from "@/lib/constants";
import { coursesIndexMetadata } from "@/lib/public-share-metadata";

export const metadata: Metadata = coursesIndexMetadata();

export const dynamic = "force-dynamic";

function isCourseLevel(value: string | undefined): value is CourseLevel {
  return !!value && (COURSE_LEVELS as readonly string[]).includes(value);
}

function isCourseCategory(value: string | undefined): value is CourseCategory {
  return !!value && (COURSE_CATEGORIES as readonly string[]).includes(value);
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
      <header className="mb-10">
        <h1 className="mb-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Training courses
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Applied AI, technology adoption and applied robotics - every course
          facilitated live by a trainer, in person or online, and worked
          through on your team&apos;s own material. Pick from the catalogue, or
          run the assessment first and let it tell you which teams need what.
        </p>
      </header>

      <CatalogueFilters
        active={{ category: activeCategory, level: activeLevel, sector: null }}
      />

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
        <CourseCardGrid courses={courses} />
      )}

      {/*
        The sector pills at the top of the page are a filter and read like
        one. This is the same eight sectors given room to say what they are
        for, which is what a reader arriving from a search for "AI training
        for banking" is actually looking for.
      */}
      <section className="mt-16">
        <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
          Browse by sector
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The catalogue is the catalogue. What changes by sector is the
          material the room works through, the constraints in it, and which
          courses matter most first. These pages say which, and why.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {getSectors().map((entry) => (
            <Link
              key={entry.sector}
              href={`/courses/sector/${COURSE_SECTOR_SLUGS[entry.sector]}`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <span>
                <span className="mb-1 block text-sm font-semibold">
                  {COURSE_SECTOR_LABELS[entry.sector]}
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {entry.tensions[0]?.title}
                </span>
              </span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

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
