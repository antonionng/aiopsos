import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getInsightBySlug,
  getPublishedInsights,
  relatedCoursesFor,
} from "@/lib/insights/catalog";
import { formatInsightDate } from "@/lib/insights/format";
import { getPublicSiteUrl } from "@/lib/site";
import { InsightArticleBody } from "@/components/insight-article-body";
import {
  StructuredData,
  ORGANISATION_LD,
  articleLd,
} from "@/components/structured-data";

const SITE_URL = getPublicSiteUrl();

export function generateStaticParams() {
  return getPublishedInsights().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return { title: "Article not found" };

  const canonical = `${SITE_URL}/insights/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      title: article.title,
      description: article.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  const related = relatedCoursesFor(article);

  return (
    <article>
      <StructuredData data={ORGANISATION_LD} />
      <StructuredData data={articleLd(article)} />

      <Link
        href="/insights"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All insights
      </Link>

      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs text-muted-foreground">
          {formatInsightDate(article.publishedAt)}
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {article.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {article.dek}
        </p>
      </header>

      <InsightArticleBody markdown={article.body} />

      {related.length > 0 && (
        <aside className="mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 text-sm font-semibold">Related courses</h2>
          <ul className="space-y-2">
            {related.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center text-sm font-medium text-foreground hover:text-brand"
                >
                  {course.title}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <section className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-2 text-sm font-semibold">Book a conversation</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Experrt runs live, in-house cohorts. If this briefing matches a gap
          you already have, talk to us about scope, dates and the record the
          programme should produce.
        </p>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Contact Experrt
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
