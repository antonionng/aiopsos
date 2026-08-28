import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import { getSector } from "@/lib/sectors";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { CatalogueFilters } from "@/components/courses/catalogue-filters";
import { CourseCardGrid } from "@/components/courses/course-card";
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_DESCRIPTIONS,
  COURSE_LEVELS,
  COURSE_LEVEL_DESCRIPTIONS,
  COURSE_SECTOR_LABELS,
  COURSE_SECTOR_SLUGS,
  courseSectorFromSlug,
  type CourseCategory,
  type CourseLevel,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

function isCourseLevel(value: string | undefined): value is CourseLevel {
  return !!value && (COURSE_LEVELS as readonly string[]).includes(value);
}

function isCourseCategory(value: string | undefined): value is CourseCategory {
  return !!value && (COURSE_CATEGORIES as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = courseSectorFromSlug(slug);
  const entry = sector ? getSector(sector) : undefined;
  if (!sector || !entry) return { title: "Sector not found" };

  const canonical = `/courses/sector/${COURSE_SECTOR_SLUGS[sector]}`;
  return {
    title: entry.headline,
    description: entry.intro,
    alternates: { canonical },
    openGraph: {
      title: `${entry.headline} | Experrt`,
      description: entry.intro,
      url: canonical,
    },
  };
}

export default async function SectorCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ sector: string }>;
  searchParams: Promise<{ level?: string; category?: string }>;
}) {
  const { sector: slug } = await params;
  const sector = courseSectorFromSlug(slug);
  const entry = sector ? getSector(sector) : undefined;
  if (!sector || !entry) notFound();

  const { level, category } = await searchParams;
  const activeLevel = isCourseLevel(level) ? level : null;
  const activeCategory = isCourseCategory(category) ? category : null;

  const allCourses = await fetchPublishedCourses();
  const matching = allCourses.filter(
    (c) =>
      (!activeLevel || c.level === activeLevel) &&
      (!activeCategory || c.category === activeCategory)
  );

  // Tagged first, because those are the ones where the sector changes the
  // day. Untagged courses are not filler: they are the ones that run the
  // same way whoever is in the room, and saying so is more honest than
  // quietly tagging all thirty-four and calling it a sector curriculum.
  const forSector = matching.filter((c) => c.sectors.includes(sector));
  const anySector = matching.filter((c) => c.sectors.length === 0);
  const sectorHours = forSector.reduce((sum, c) => sum + c.duration_hours, 0);
  const label = COURSE_SECTOR_LABELS[sector];

  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/courses" className="transition-colors hover:text-foreground">
          Courses
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{label}</span>
      </nav>

      <header className="mb-10">
        <p className="mb-3 text-sm font-medium text-brand">{label}</p>
        <h1 className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {entry.headline}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {entry.intro}
        </p>
      </header>

      <CatalogueFilters
        active={{ category: activeCategory, level: activeLevel, sector }}
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

      <section className="mb-14">
        <h2 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
          Built around {label.toLowerCase()} work
        </h2>
        <p className="mb-6 text-xs text-muted-foreground">
          {forSector.length} course{forSector.length === 1 ? "" : "s"} ·{" "}
          {sectorHours} facilitated hours
        </p>

        {forSector.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing in this sector matches that subject and level
              combination. Clear a filter above, or look at the courses that
              run for any sector below.
            </p>
          </div>
        ) : (
          <CourseCardGrid courses={forSector} />
        )}
      </section>

      <section className="mb-14 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em]">
          What this sector brings into the room
        </h2>
        <dl className="space-y-5">
          {entry.tensions.map((tension) => (
            <div key={tension.title}>
              <dt className="mb-1 text-sm font-semibold">{tension.title}</dt>
              <dd className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {tension.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {anySector.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
            Also runs for any sector
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            These work the same way whoever is in the room. They are still
            delivered on your own material, so they are no less specific to
            you - the sector simply is not what changes them.
          </p>
          <CourseCardGrid courses={anySector} />
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
          Which of these does your organisation actually need?
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The readiness assessment scores each person across five dimensions
          and maps the gaps onto this catalogue, by department and by role.
          Five minutes per person, and it answers the question with a
          measurement rather than a guess.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Run an assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-foreground/30"
          >
            Talk to us about {label.toLowerCase()}
          </Link>
        </div>
      </section>
    </div>
  );
}
