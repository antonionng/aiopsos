import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { getSelfServeCourseMeta } from "@/lib/self-serve/catalog-meta";
import { breadcrumbLd, faqLd } from "@/lib/self-serve/seo";
import { formatCourseHours } from "@/lib/self-serve/landing";
import type { Faq } from "@/lib/self-serve/seo";

function toFaqs(pairs: ReadonlyArray<readonly [string, string]>): Faq[] {
  return pairs.map(([question, answer]) => ({ question, answer }));
}

const MARKDOWN_LINK = /\[([^\]]+)\]\((\/[^)]+)\)/g;

/** Pack copy uses markdown links in a few body paragraphs. */
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKDOWN_LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      <Link key={`${match[2]}-${index}`} href={match[2]}>
        {match[1]}
      </Link>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function CourseCard({ slug, blurb }: { slug: string; blurb: string }) {
  const course = getSelfServeCourseMeta(slug);
  if (!course) return null;
  return (
    <article className="ex-lander-course">
      <h3>
        <Link href={`/learn/${course.slug}`}>{course.title}</Link>
      </h3>
      <p className="ex-lander-course-meta">
        £{course.priceGbp} · {formatCourseHours(course.hours)} · Certificate included
      </p>
      <p>{blurb}</p>
      <p>
        <Link className="ex-text-link" href={`/learn/${course.slug}`}>
          Take this course for £{course.priceGbp}
        </Link>
      </p>
    </article>
  );
}

export function LanderShell({
  crumbs,
  h1,
  intro,
  faqs,
  children,
  stamp,
}: {
  crumbs: { name: string; path: string }[];
  h1: string;
  intro: readonly string[];
  faqs: ReadonlyArray<readonly [string, string]>;
  children: React.ReactNode;
  stamp?: string;
}) {
  const faqItems = toFaqs(faqs);
  return (
    <main className="ex-landing ex-lander">
      <StructuredData data={faqLd(faqItems)} />
      <StructuredData data={breadcrumbLd(crumbs)} />
      <article className="ex-wide">
        <p className="ex-product-crumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.path}>
              {index > 0 ? <span aria-hidden="true"> / </span> : null}
              <Link href={crumb.path}>{crumb.name}</Link>
            </span>
          ))}
        </p>
        <h1>{h1}</h1>
        {stamp ? <p className="ex-lander-stamp">{stamp}</p> : null}
        {intro.map((paragraph) => (
          <p key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
        {children}
        <section aria-labelledby="lander-faq">
          <h2 id="lander-faq">Questions</h2>
          <dl className="ex-lander-faq">
            {faqItems.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </main>
  );
}

export function LanderParagraph({ text }: { text: string }) {
  return (
    <p>
      <RichText text={text} />
    </p>
  );
}

export function LanderCourseList({
  courses,
}: {
  courses: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="ex-lander-courses">
      {courses.map(([slug, blurb]) => (
        <CourseCard key={slug} slug={slug} blurb={blurb} />
      ))}
    </div>
  );
}

export function LanderCta({
  href,
  label,
  note,
  secondaryHref,
  secondaryLabel,
}: {
  href: string;
  label: string;
  note?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <p className="ex-lander-cta">
      <Link className="ex-button ex-button-dark" href={href}>
        {label}
      </Link>
      {secondaryHref && secondaryLabel ? (
        <Link className="ex-text-link" href={secondaryHref}>
          {secondaryLabel}
        </Link>
      ) : null}
      {note ? <span className="ex-hint">{note}</span> : null}
    </p>
  );
}
