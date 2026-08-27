import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { fetchPublishedCourses } from "@/lib/courses";
import {
  LITERACY_MAPPED_COURSES,
  LITERACY_PAGE,
  literacyCourseTitle,
} from "@/lib/money-pages";
import { getPublicSiteUrl } from "@/lib/site";
import {
  StructuredData,
  ORGANISATION_LD,
  educationalOccupationalProgramLd,
  faqPageLd,
} from "@/components/structured-data";
import {
  CopyBlocks,
  FaqList,
  LinkedCopy,
  ProgrammeCtas,
} from "@/components/marketing/faq-list";

const SITE_URL = getPublicSiteUrl();
const CANONICAL = `${SITE_URL}/ai-literacy-training`;

export const metadata: Metadata = {
  title: LITERACY_PAGE.title,
  description: LITERACY_PAGE.description,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${LITERACY_PAGE.title} | Experrt`,
    description: LITERACY_PAGE.description,
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    title: `${LITERACY_PAGE.title} | Experrt`,
    description: LITERACY_PAGE.description,
  },
};

export const dynamic = "force-dynamic";

export default async function AiLiteracyTrainingPage() {
  const catalogue = await fetchPublishedCourses();
  const bySlug = new Map(catalogue.map((course) => [course.slug, course]));

  const mapped = LITERACY_MAPPED_COURSES.map((entry) => {
    const live = bySlug.get(entry.slug);
    return {
      slug: entry.slug,
      title: live?.title ?? literacyCourseTitle(entry.slug),
      hours: live?.duration_hours ?? entry.hours,
      audience: entry.audience,
    };
  });

  return (
    <article>
      <StructuredData data={ORGANISATION_LD} />
      <StructuredData
        data={educationalOccupationalProgramLd({
          path: "/ai-literacy-training",
          name: LITERACY_PAGE.title,
          description: LITERACY_PAGE.description,
          courses: mapped.map((course) => ({
            slug: course.slug,
            title: course.title,
          })),
        })}
      />
      <StructuredData data={faqPageLd(LITERACY_PAGE.faqs)} />

      <header className="mb-12">
        <p className="mb-3 text-sm font-medium text-brand">Programme</p>
        <h1 className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {LITERACY_PAGE.h1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {LITERACY_PAGE.standfirst}
        </p>
      </header>

      <div className="mb-12 space-y-10">
        <CopyBlocks blocks={[LITERACY_PAGE.whoFor, LITERACY_PAGE.whyNow]} />

        {LITERACY_PAGE.whyNow.links.length > 0 && (
          <ul className="max-w-2xl space-y-2">
            {LITERACY_PAGE.whyNow.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  {link.label}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
          {LITERACY_PAGE.engagement.heading}
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {LITERACY_PAGE.engagement.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="mb-2 text-xs text-muted-foreground">
                0{index + 1}
              </p>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <LinkedCopy text={step.body} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
          Mapped courses
        </h2>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Hours below are the live catalogue durations. This page does not
          invent a new timetable.
        </p>
        <ul className="space-y-3">
          {mapped.map((course) => (
            <li key={course.slug}>
              <Link
                href={`/courses/${course.slug}`}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-foreground/30"
              >
                <span>
                  <span className="block text-sm font-semibold">
                    {course.title}
                  </span>
                  {course.audience && (
                    <span className="text-xs text-muted-foreground">
                      {course.audience}
                    </span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {course.hours}h
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CopyBlocks blocks={[LITERACY_PAGE.pay]} />

      <div className="mt-12 mb-12">
        <FaqList faqs={LITERACY_PAGE.faqs} />
      </div>

      <section className="rounded-2xl border-2 border-brand/20 bg-card p-8">
        <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
          Book a conversation
        </h2>
        <p className="mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Scope, dates and the record the programme should produce. Contact{" "}
          <a
            href="mailto:ag@experrt.com"
            className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            ag@experrt.com
          </a>
          .
        </p>
        <ProgrammeCtas />
      </section>
    </article>
  );
}
