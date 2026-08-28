import type { Metadata } from "next";
import { subscriptionConfirmedMetadata } from "@/lib/public-share-metadata";
import Link from "next/link";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { confirmByToken } from "@/lib/insight-subscribers";
import { getPublishedInsights, insightReadingMinutes } from "@/lib/insights/catalog";
import { formatInsightDate } from "@/lib/insights/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = subscriptionConfirmedMetadata();

export default async function ConfirmSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await confirmByToken(token ?? "");

  if (!result) {
    return (
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center gap-2">
          <TriangleAlert className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-bold tracking-[-0.02em]">
            That link did not work
          </h1>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          Confirmation links are single use and are replaced whenever a fresh
          one is sent. Subscribe again from the insights page and use the newest
          email in your inbox.
        </p>
        <Link
          href="/insights"
          className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Back to insights
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  const latest = getPublishedInsights().slice(0, 3);

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Check className="h-5 w-5 text-emerald-500" />
        <h1 className="text-2xl font-bold tracking-[-0.02em]">
          You are on the list
        </h1>
      </div>
      <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
        {result.email} will get one email when a new briefing goes up. Every one
        of them carries an unsubscribe link, and it works on the first click.
      </p>

      <h2 className="mb-4 text-sm font-semibold">Start with these</h2>
      <ul className="space-y-3">
        {latest.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/insights/${article.slug}`}
              className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <p className="mb-1 text-xs text-muted-foreground">
                {formatInsightDate(article.publishedAt)} &middot;{" "}
                {insightReadingMinutes(article)} min read
              </p>
              <p className="text-sm font-semibold group-hover:text-brand">
                {article.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
