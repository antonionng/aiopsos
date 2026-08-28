"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatInsightDate } from "@/lib/insights/format";
import { cn } from "@/lib/utils";

/**
 * The filterable article list.
 *
 * Filtering happens in the browser rather than through a `?topic=` search
 * param, which keeps the index statically rendered and makes the chips
 * instant. It also avoids publishing five filtered URLs that are each a
 * subset of the canonical one, which is a duplicate-content problem we would
 * then have to solve with noindex tags.
 *
 * The trade is that a filtered view is not shareable. At eleven articles
 * nobody is sharing a filtered view.
 */

export type InsightCard = {
  slug: string;
  title: string;
  dek: string;
  publishedAt: string;
  topic: string;
  readingMinutes: number;
};

const ALL = "All";

export function InsightList({
  articles,
  topics,
}: {
  articles: InsightCard[];
  topics: string[];
}) {
  const [active, setActive] = useState<string>(ALL);

  const visible = useMemo(
    () =>
      active === ALL
        ? articles
        : articles.filter((article) => article.topic === active),
    [articles, active]
  );

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {[ALL, ...topics].map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setActive(topic)}
            aria-pressed={active === topic}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active === topic
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {topic}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {visible.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/insights/${article.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="font-medium text-brand">{article.topic}</span>
                <span aria-hidden>&middot;</span>
                <span>{formatInsightDate(article.publishedAt)}</span>
                <span aria-hidden>&middot;</span>
                <span>{article.readingMinutes} min read</span>
              </p>
              <h3 className="mb-2 text-lg font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand">
                {article.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {article.dek}
              </p>
              <span className="mt-auto inline-flex items-center text-sm font-medium text-foreground">
                Read
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nothing published under that topic yet.
        </p>
      )}
    </section>
  );
}
