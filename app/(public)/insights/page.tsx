import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedInsights } from "@/lib/insights/catalog";
import { formatInsightDate } from "@/lib/insights/format";
import { insightsIndexMetadata } from "@/lib/public-share-metadata";
import { StructuredData, ORGANISATION_LD } from "@/components/structured-data";

export const metadata: Metadata = insightsIndexMetadata();

export default function InsightsIndexPage() {
  const articles = getPublishedInsights();

  return (
    <div>
      <StructuredData data={ORGANISATION_LD} />
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Insights
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Briefings for the people who commission workforce AI, technology and
          robotics training. Written for L&D, HR, operations and transformation.
          Every piece is public. Drafts stay off this list.
        </p>
      </header>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/insights/${article.slug}`}
              className="group block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <p className="mb-2 text-xs text-muted-foreground">
                {formatInsightDate(article.publishedAt)}
              </p>
              <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
                {article.title}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {article.dek}
              </p>
              <span className="inline-flex items-center text-sm font-medium text-foreground">
                Read
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
