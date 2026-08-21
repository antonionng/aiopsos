import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { fetchCourseBySlug } from "@/lib/courses";
import { insightForCourse } from "@/lib/insights/catalog";
import { StructuredData, courseLd } from "@/components/structured-data";
import { CourseEnquiryForm } from "@/components/course-enquiry-form";
import { CourseArtwork } from "@/components/course-artwork";
import {
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  DIMENSION_LABELS,
  RESPONDENT_ROLE_LABELS,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchCourseBySlug(slug);
  if (!result) return { title: "Course not found" };

  const { course } = result;
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.summary,
      type: "article",
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchCourseBySlug(slug);
  if (!result) notFound();

  const { course, modules } = result;
  const moduleHours = modules.reduce((sum, m) => sum + m.duration_hours, 0);
  const relatedInsight = insightForCourse(course.slug);

  return (
    <article>
      <StructuredData data={courseLd(course)} />
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All courses
      </Link>

      <header className="mb-10">
        <div className="mb-6 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
          <CourseArtwork category={course.category} className="h-24 w-32" />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
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

        <h1 className="mb-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {course.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {course.summary}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-10">
          {course.learning_outcomes.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em]">
                What participants can do afterwards
              </h2>
              <ul className="space-y-2.5">
                {course.learning_outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {modules.length > 0 && (
            <section>
              <h2 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
                Modules
              </h2>
              <p className="mb-5 text-xs text-muted-foreground">
                {modules.length} modules, {moduleHours} facilitated hours.
              </p>
              <ol className="space-y-3">
                {modules.map((module) => (
                  <li
                    key={module.id}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold">
                        <span className="mr-2 text-muted-foreground">
                          {module.position}.
                        </span>
                        {module.title}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {module.duration_hours} hrs
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {module.summary}
                    </p>
                    {module.outcomes.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {module.outcomes.map((outcome) => (
                          <li
                            key={outcome}
                            className="flex gap-2 text-xs text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    )}
                    {module.lab_url && (
                      <a
                        href={module.lab_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-brand"
                      >
                        Hands-on lab
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.01em]">
              How it is delivered
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A facilitator runs the course live, {" "}
              {course.delivery_modes
                .map((mode) => (DELIVERY_MODE_LABELS[mode] ?? mode).toLowerCase())
                .join(" or ")}
              . Attendance is taken per session, participants submit work
              against the modules above, and a facilitator grades it. Those
              records stay with the organisation and can be exported.
            </p>
          </section>

          {relatedInsight && (
            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
                Further reading
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                <Link
                  href={`/insights/${relatedInsight.slug}`}
                  className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  {relatedInsight.title}
                </Link>
                {" "}
                is the public briefing that sits next to this course.
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold">At a glance</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Level</dt>
                <dd>{COURSE_LEVEL_LABELS[course.level]}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Duration</dt>
                <dd>{course.duration_hours} facilitated hours</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Delivery</dt>
                <dd>
                  {course.delivery_modes
                    .map((mode) => DELIVERY_MODE_LABELS[mode] ?? mode)
                    .join(", ")}
                </dd>
              </div>
              {course.target_roles.length > 0 && (
                <div>
                  <dt className="mb-1 text-xs text-muted-foreground">Who it is for</dt>
                  <dd>
                    {course.target_roles
                      .map((r) => RESPONDENT_ROLE_LABELS[r] ?? r)
                      .join(", ")}
                  </dd>
                </div>
              )}
              {course.target_dimensions.length > 0 && (
                <div>
                  <dt className="mb-1 text-xs text-muted-foreground">
                    Assessment gaps it addresses
                  </dt>
                  <dd>
                    {course.target_dimensions
                      .map((d) => DIMENSION_LABELS[d] ?? d)
                      .join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div id="request" className="scroll-mt-24 rounded-2xl border-2 border-brand/20 bg-card p-6">
            <h2 className="mb-1 text-sm font-semibold">Run this for your team</h2>
            <CourseEnquiryForm
              courseSlug={course.slug}
              courseTitle={course.title}
              source="course_page"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Not sure this is the right course? The assessment scores your
              teams and tells you which ones they need.
            </p>
            <Link
              href="/register"
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Run an assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
