import type { Metadata } from "next";
import { unsubscribedMetadata } from "@/lib/public-share-metadata";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { unsubscribeByToken } from "@/lib/insight-subscribers";
import { InsightResubscribeButton } from "@/components/public/insight-resubscribe-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = unsubscribedMetadata();

/**
 * The unsubscribe takes effect on load rather than behind a confirm button.
 * One click is what the footer promises and what the List-Unsubscribe header
 * commits us to. The undo below covers the mail client that prefetched it.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await unsubscribeByToken(token ?? "");

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
          If you are still getting the insights email, reply to it and we will
          take the address off by hand.
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

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold tracking-[-0.02em]">
        You are unsubscribed
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        {result.email} will get no more insights email from us. The articles
        stay public, so nothing is behind a subscription.
      </p>

      <div className="mb-10">
        <InsightResubscribeButton token={token ?? ""} />
      </div>

      <Link
        href="/insights"
        className="inline-flex items-center text-sm font-medium text-foreground hover:text-brand"
      >
        Read the insights without subscribing
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </div>
  );
}
