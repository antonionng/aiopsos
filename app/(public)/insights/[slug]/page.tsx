import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import {
  adjacentInsights,
  getInsightBySlug,
  getPublishedInsights,
  insightReadingMinutes,
  relatedCoursesFor,
  relatedInsights,
} from "@/lib/insights/catalog";
import { formatInsightDate } from "@/lib/insights/format";
import { insightArticleMetadata } from "@/lib/public-share-metadata";
import { getPublicSiteUrl } from "@/lib/site";
import { InsightArticleBody } from "@/components/insight-article-body";
import { InsightShare } from "@/components/public/insight-share";
import { InsightSubscribe } from "@/components/public/insight-subscribe";
import { ReadingProgress } from "@/components/public/reading-progress";
import {
  StructuredData,
  ORGANISATION_LD,
  articleLd,
} from "@/components/structured-data";

export function generateStaticParams() {
  return getPublishedInsights().map((article) => ({ slug: article.slug }));
}

import { insightTopicPath } from "@/lib/insights/topics";

const SITE_URL = getPublicSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return { title: "Article not found" };
  return insightArticleMetadata(article);
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  const courses = relatedCoursesFor(article);
  const alsoRead = relatedInsights(article);
  const { older, newer } = adjacentInsights(article.slug);
  const url = `${SITE_URL}/insights/${article.slug}`;
  const sections = article.body.split("\n").flatMap((line, i) => line.startsWith("## ") ? [{ title: line.slice(3), id: `section-${i + 1}` }] : []);
  const contactHref = `/contact?from=${article.slug}`;

  return (
    <article>
      <StructuredData data={ORGANISATION_LD} />
      <StructuredData data={articleLd(article)} />
      <ReadingProgress />

      <Link
        href="/insights"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All insights
      </Link>

      <header className="mb-10 max-w-[68ch]">
        <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Link href={insightTopicPath(article.topic)} className="font-medium text-brand hover:underline">{article.topic}</Link>
          <span aria-hidden>&middot;</span>
          <time dateTime={article.publishedAt}>{formatInsightDate(article.publishedAt)}</time>
          <span aria-hidden>&middot;</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {insightReadingMinutes(article)} min read
          </span>
        </p>
        <h1 className="mb-5 text-3xl font-bold leading-[1.15] tracking-[-0.03em] sm:text-[2.75rem]">
          {article.title}
        </h1>
        <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
          {article.dek}
        </p>
        <p className="mb-5 text-sm text-muted-foreground">By <Link href="/about" className="font-medium underline underline-offset-4">Experrt</Link> · {article.topic === "AI implementation" ? "Implementation field guides" : "Practical learning guides"}</p>
        <InsightShare url={url} title={article.title} />
      </header>

      <hr className="mb-10 border-border/60" />

      <nav aria-label="In this guide" className="mb-10 max-w-[68ch] rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">In this guide</h2>
        <ol className="grid gap-3 text-sm sm:grid-cols-2">{sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="text-muted-foreground underline-offset-4 hover:text-brand hover:underline">{section.title}</a></li>)}</ol>
      </nav>
      <InsightArticleBody markdown={article.body.replaceAll("](/contact)", `](${contactHref})`)} />

      <aside className="mt-10 max-w-[68ch] rounded-3xl bg-[#201C29] p-7 text-[#FFFEFA]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#E4F477]">Your next useful move</p>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Find where learning could help you most.</h2>
        <p className="mb-5 text-sm leading-relaxed text-white/75">Take our short learning check. Enter your name and email after the questions to unlock your self-reported priorities. Marketing is optional.</p>
        <Link href="/assessment/start" className="inline-flex items-center gap-2 rounded-full bg-[#E4F477] px-5 py-3 text-sm font-semibold text-[#201C29]">Find my starting point <ArrowRight className="h-4 w-4" /></Link>
      </aside>

      <div className="mt-12 max-w-[68ch] border-t border-border/60 pt-8">
        <InsightShare url={url} title={article.title} />
      </div>

      {/* The list sign-up sits directly under the article rather than at the
          bottom of the page. Someone who has just read 1,500 words is at the
          most willing they will ever be; three cards later they are not. */}
      <div className="mt-10 max-w-[68ch]">
        <InsightSubscribe
          source="insights_article"
          sourceSlug={article.slug}
          heading="Get the next one"
          blurb="Get new Experrt briefings by email. Confirm your subscription first, and unsubscribe whenever you like."
        />
      </div>

      {(older || newer) && (
        <nav
          aria-label="More insights"
          className="mt-10 grid max-w-[68ch] gap-4 sm:grid-cols-2"
        >
          {newer ? (
            <Link
              href={`/insights/${newer.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <p className="mb-1.5 text-xs text-muted-foreground">Previous guide</p>
              <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                {newer.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link
              href={`/insights/${older.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 text-right transition-colors hover:border-foreground/30 sm:text-left"
            >
              <p className="mb-1.5 text-xs text-muted-foreground">Next guide</p>
              <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                {older.title}
              </p>
            </Link>
          )}
        </nav>
      )}

      {alsoRead.length > 0 && (
        <section className="mt-10 max-w-[68ch]">
          <h2 className="mb-4 text-sm font-semibold">Also worth reading</h2>
          <ul className="space-y-2">
            {alsoRead.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/insights/${other.slug}`}
                  className="group inline-flex items-baseline gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-xs text-brand">{other.topic}</span>
                  <span className="font-medium text-foreground group-hover:text-brand">
                    {other.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {courses.length > 0 && (
        <aside className="mt-10 max-w-[68ch] rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 text-sm font-semibold">
            Courses that cover this
          </h2>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group inline-flex items-center text-sm font-medium text-foreground hover:text-brand"
                >
                  {course.title}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <section className="mt-6 max-w-[68ch] rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-2 text-sm font-semibold">Book a conversation</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {article.topic === "AI implementation" ? "Bring us the workflow or product you want to build. Explore AI Labs for consulting, implementation and delivery." : "Tell us what you want to make possible. We’ll explore the training, learning platform or practical support that fits your next step."}
        </p>
        <Link
          href={article.topic === "AI implementation" ? "/ai-labs" : contactHref}
          className="group inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          {article.topic === "AI implementation" ? "Explore AI Labs" : "Contact Experrt"}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>
    </article>
  );
}
