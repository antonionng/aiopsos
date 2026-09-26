import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelfServeCourseCards } from "@/components/learn/course-cards";
import { LearnMarket } from "@/components/learn/learn-shell";
import { StructuredData } from "@/components/structured-data";
import { trackLabel } from "@/lib/self-serve/catalog";
import { courseStats } from "@/lib/self-serve/landing";
import {
  TOPIC_HUBS,
  breadcrumbLd,
  courseListLd,
  faqLd,
  hubBySlug,
  hubCourses,
} from "@/lib/self-serve/seo";
import { withSiteShareImages } from "@/lib/social-image";

export function generateStaticParams() {
  return TOPIC_HUBS.map((hub) => ({ topic: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const hub = hubBySlug(topic);
  if (!hub) return { title: "Topic not found", robots: { index: false, follow: false } };
  return withSiteShareImages({
    title: hub.metaTitle,
    description: hub.description,
    alternates: { canonical: `/learn/topics/${hub.slug}` },
    openGraph: { type: "website", title: hub.metaTitle, description: hub.description, url: `/learn/topics/${hub.slug}` },
    twitter: { title: hub.metaTitle, description: hub.description },
    robots: { index: true, follow: true },
  });
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const hub = hubBySlug(topic);
  if (!hub) notFound();
  const courses = hubCourses(hub);
  const seen = new Set<string>();
  const stats = courses
    .map((course) => courseStats(course)[0])
    .filter((stat) => stat && !seen.has(stat.href + stat.value) && seen.add(stat.href + stat.value))
    .slice(0, 3);
  const path = `/learn/topics/${hub.slug}`;

  return (
    <LearnMarket>
      <StructuredData data={courseListLd(courses, hub.title, path)} />
      <StructuredData data={faqLd(hub.faqs)} />
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Self-paced courses", path: "/learn" },
          { name: hub.title, path },
        ])}
      />
      <main className="ex-catalog">
        <p className="ex-product-crumb">
          <Link href="/learn">All self-paced courses</Link>
          <span aria-hidden="true"> / </span>
          {hub.title}
        </p>
        <div className="ex-eyebrow">
          <span />
          {courses.length} SELF-PACED COURSES
        </div>
        <h1 className="ex-plain-title">{hub.title}</h1>
        {hub.intro.map((paragraph) => (
          <p key={paragraph} className="ex-lede">
            {paragraph}
          </p>
        ))}
        {stats.length > 0 ? (
          <ul className="ex-topic-stats" aria-label="Market figures">
            {stats.map((stat) => (
              <li key={stat.href + stat.value}>
                <b>{stat.value}</b>
                <span>{stat.line}</span>
                <a href={stat.href} rel="noreferrer">
                  {stat.source}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <nav className="ss-filters" aria-label="Topics">
          <Link href="/learn">All</Link>
          {TOPIC_HUBS.map((item) => (
            <Link
              key={item.slug}
              href={`/learn/topics/${item.slug}`}
              aria-current={item.slug === hub.slug ? "page" : undefined}
            >
              {trackLabel(item.track)}
            </Link>
          ))}
        </nav>
        <SelfServeCourseCards courses={courses} />
        <section className="ex-land-faq ex-topic-faq" aria-labelledby="topic-faq">
          <h2 id="topic-faq">Questions about these courses</h2>
          <dl>
            {hub.faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="ex-catalog-foot">
          If your team would benefit from a trainer in the room, our trainer-led courses are listed on the{" "}
          <Link href="/courses#trainer-led">Academy</Link>.
        </p>
      </main>
    </LearnMarket>
  );
}
