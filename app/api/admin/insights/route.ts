import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getInsightBySlug,
  getPublishedInsights,
  insightReadingMinutes,
} from "@/lib/insights/catalog";
import {
  confirmedSubscriberCount,
  listBroadcasts,
  listRecipientsFor,
  markSent,
  recordBroadcast,
  subscriberCounts,
} from "@/lib/insight-subscribers";
import { sendInsightArticleEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
// Sending is paced, so the default serverless budget is not enough.
export const maxDuration = 300;

/**
 * The list is small and Resend's per-second budget is not generous, so sends
 * go out two at a time with a pause between pairs. `MAX_PER_RUN` stops a
 * single request running past its own timeout once the list is larger than
 * the pacing allows: the run mails as many as it safely can, marks each one
 * as it goes, and the admin screen then shows the remainder so a second
 * press finishes the job. Nobody is mailed twice, and nothing is silently
 * dropped.
 */
const MAX_PER_RUN = 250;
const BATCH_SIZE = 2;
const BATCH_PAUSE_MS = 1100;

async function requireSuperAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  // Broadcasting reaches everyone who ever subscribed, so this is
  // super_admin only, not the usual admin-or-manager set.
  if (profile?.role !== "super_admin") return null;
  return profile;
}

export async function GET() {
  const supabase = await createClient();
  if (!(await requireSuperAdmin(supabase))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [counts, broadcasts] = await Promise.all([
    subscriberCounts(),
    listBroadcasts(),
  ]);

  const sentBySlug = new Map(broadcasts.map((b) => [b.article_slug, b]));

  return NextResponse.json({
    counts,
    articles: getPublishedInsights().map((article) => {
      const broadcast = sentBySlug.get(article.slug);
      return {
        slug: article.slug,
        title: article.title,
        topic: article.topic,
        publishedAt: article.publishedAt,
        readingMinutes: insightReadingMinutes(article),
        sentAt: broadcast?.sent_at ?? null,
        recipients: broadcast?.recipients ?? 0,
        failures: broadcast?.failures ?? 0,
      };
    }),
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const profile = await requireSuperAdmin(supabase);
  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const article = getInsightBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Unknown article." }, { status: 400 });
  }

  const recipients = await listRecipientsFor(article.slug, MAX_PER_RUN);
  if (recipients.length === 0) {
    const confirmed = await confirmedSubscriberCount();
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      remaining: 0,
      message:
        confirmed === 0
          ? "Nobody has confirmed a subscription yet, so nothing was sent."
          : "Everyone on the list already has this one. Nothing was sent.",
    });
  }

  const payload = {
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    topic: article.topic,
    readingMinutes: insightReadingMinutes(article),
  };

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (recipient) => {
        await sendInsightArticleEmail(
          recipient.email,
          payload,
          recipient.unsubscribe_token
        );
        // Marked only after the send resolves. Marking first would drop
        // anyone whose send then failed, and they would never get it.
        await markSent(recipient.id, article.slug);
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        sent += 1;
      } else {
        failed += 1;
        console.error("[insights] broadcast send failed", result.reason);
      }
    }

    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_PAUSE_MS));
    }
  }

  await recordBroadcast(article.slug, profile.id, sent, failed);

  const remaining = (await listRecipientsFor(article.slug, MAX_PER_RUN)).length;

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    remaining,
    message:
      remaining > 0
        ? `Sent ${sent}. ${remaining} still to go, press send again to continue.`
        : `Sent ${sent}${failed > 0 ? `, ${failed} failed` : ""}.`,
  });
}
