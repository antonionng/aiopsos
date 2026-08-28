import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getInsightTopics,
  getPublishedInsights,
  insightReadingMinutes,
} from "@/lib/insights/catalog";
import { formatInsightDate } from "@/lib/insights/format";
import { insightsIndexMetadata } from "@/lib/public-share-metadata";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";
import { InsightList, type InsightCard } from "@/components/public/insight-list";
import { InsightSubscribe } from "@/components/public/insight-subscribe";

export const metadata: Metadata = insightsIndexMetadata();

export default function InsightsIndexPage() {
  const articles = getPublishedInsights();
  const [featured, ...rest] = articles;
  const topics = getInsightTopics();

  const cards: InsightCard[] = rest.map((article) => ({
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    publishedAt: article.publishedAt,
    topic: article.topic,
    readingMinutes: insightReadingMinutes(article),
  }));

  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />

      <header className="mb-12 border-b border-border/60 pb-12">
        <p className="mb-4 text-xs font-medium tracking-wide text-brand">
          {articles.length} published briefings
        </p>
        <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Insights
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Briefings for the people who commission workforce AI, technology and
          robotics training. Written for L&D, HR, operations and transformation.
          Every piece is public. Drafts stay off this list.
        </p>
      </header>

      {/* The newest piece gets the full width rather than being the first of
          eleven identical cards. On an index this short, a reader who cannot
          tell what is new has no reason to come back. */}
      {featured && (
        <Link
          href={`/insights/${featured.slug}`}
          className="group mb-14 block rounded-3xl border border-border bg-card p-8 transition-colors hover:border-foreground/30 sm:p-10"
        >
          <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 font-medium text-brand">
              Latest
            </span>
            <span className="ml-1 font-medium text-brand">{featured.topic}</span>
            <span aria-hidden>&middot;</span>
            <span>{formatInsightDate(featured.publishedAt)}</span>
            <span aria-hidden>&middot;</span>
            <span>{insightReadingMinutes(featured)} min read</span>
          </p>
          <h2 className="mb-4 max-w-3xl text-2xl font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-brand sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {featured.dek}
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-foreground">
            Read the briefing
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}

      <InsightList articles={cards} topics={topics} />

      <div className="mt-14">
        <InsightSubscribe source="insights_index" />
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <h2 className="mb-2 text-base font-semibold tracking-[-0.01em]">
            Reading this because someone asked you to fix it
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Experrt runs live, in-house cohorts in applied AI, technology
            adoption and robotics. Tell us the gap and we will come back with
            scope, dates and what the programme would put on record.
          </p>
        </div>
        <Link
          href="/contact"
          className="group inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Talk to us
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>
    </div>
  );
}
