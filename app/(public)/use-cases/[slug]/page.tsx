import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import { COURSE_TITLES } from "@/lib/published-course-slugs";
import {
  getUseCase,
  getUseCases,
  useCaseCourseSlugs,
} from "@/lib/use-cases";
import type { Course } from "@/lib/types";
import { useCasePageMetadata } from "@/lib/public-share-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getUseCase(slug);
  if (!entry) return { title: "Use case not found" };
  return useCasePageMetadata(entry);
}

function CourseChip({ slug, course }: { slug: string; course?: Course }) {
  const title = course?.title ?? COURSE_TITLES[slug];
  if (!title) return null;

  return (
    <Link
      href={`/courses/${slug}`}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground/30"
    >
      {title}
      {course && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {course.duration_hours}h
        </span>
      )}
    </Link>
  );
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getUseCase(slug);
  if (!entry) notFound();

  const catalogue = await fetchPublishedCourses();
  const courseBySlug = new Map(catalogue.map((c) => [c.slug, c]));
  const citedSlugs = useCaseCourseSlugs(entry);

  const others = getUseCases().filter((e) => e.slug !== entry.slug);

  return (
    <article>
      <Link
        href="/use-cases"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All use cases
      </Link>

      <header className="mb-12">
        <p className="mb-3 text-sm font-medium text-brand">
          {entry.kind === "audience" ? "By organisation" : "By function"}
        </p>
        <h1 className="mb-3 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {entry.name}
        </h1>
        <p className="mb-4 text-xl font-medium tracking-[-0.01em] text-foreground/80">
          {entry.headline}
        </p>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {entry.intro}
        </p>
      </header>

      <section className="mb-14 space-y-6">
        {entry.examples.map((example, index) => (
          <div
            key={example.title}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 className="mb-4 text-lg font-semibold tracking-[-0.01em]">
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {example.title}
            </h2>
            <div className="mb-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  The situation
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {example.scenario}
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  In practice
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {example.inPractice}
                </p>
              </div>
            </div>
            {example.courseSlugs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                <span className="text-xs text-muted-foreground">
                  Trained in:
                </span>
                {example.courseSlugs.map((courseSlug) => (
                  <CourseChip
                    key={courseSlug}
                    slug={courseSlug}
                    course={courseBySlug.get(courseSlug)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="mb-14 rounded-2xl border-2 border-brand/20 bg-card p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
              Start with the measurement, not the course list
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The {citedSlugs.length} courses cited above are a starting point.
              The assessment scores your teams across five dimensions and
              recommends training against the gaps it actually finds.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Run an assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em]">
            Other use cases
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/use-cases/${other.slug}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {other.navLabel}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
