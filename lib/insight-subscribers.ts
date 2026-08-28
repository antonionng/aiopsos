import { randomBytes } from "crypto";
import { supabaseAdmin } from "./supabase/admin";

/**
 * The insights mailing list.
 *
 * Every function here runs through the service-role client, never the SSR
 * one. `insight_subscribers` has RLS on with nothing granted to anon
 * deliberately (see migration 036): subscribing needs a read before a write,
 * to re-send a confirmation to a pending address rather than collide on the
 * unique email, and opening a read policy on a table of email addresses to
 * do that would be the wrong trade. The routes calling this are rate limited
 * and validate their input first.
 *
 * Kept out of `lib/insights/` on purpose. That directory is a pure module
 * imported by the sitemap and by the type-stripped test runner, and it must
 * not acquire a dependency on the database.
 */

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type SubscribeOutcome =
  /** New address, or a pending one that got another confirmation email. */
  | { kind: "confirmation_sent"; email: string; confirmToken: string }
  /** Already confirmed. Say nothing new and send nothing. */
  | { kind: "already_confirmed"; email: string }
  | { kind: "error"; message: string };

function newToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Addresses are matched lowercased and trimmed, so the unique index on
 * `email` is a real constraint rather than one that " Bob@X.com " walks past
 * to create a second row for the same person.
 */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function subscribe(
  rawEmail: string,
  source: string,
  sourceSlug: string | null
): Promise<SubscribeOutcome> {
  const email = normaliseEmail(rawEmail);

  const { data: existing, error: readError } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id, status, confirm_token")
    .eq("email", email)
    .maybeSingle();

  if (readError) return { kind: "error", message: readError.message };

  if (existing?.status === "confirmed") {
    return { kind: "already_confirmed", email };
  }

  // A pending row gets a fresh token rather than the old one. The first
  // confirmation email may be the one sitting in a spam folder, and a
  // rotated token means the stale link stops working once the new one is
  // used, which is what you want if the first email went to the wrong place.
  if (existing) {
    const confirmToken = newToken();
    const { error } = await supabaseAdmin
      .from("insight_subscribers")
      .update({
        confirm_token: confirmToken,
        status: "pending",
        source,
        source_slug: sourceSlug,
        unsubscribed_at: null,
      })
      .eq("id", existing.id);
    if (error) return { kind: "error", message: error.message };
    return { kind: "confirmation_sent", email, confirmToken };
  }

  const confirmToken = newToken();
  const { error } = await supabaseAdmin.from("insight_subscribers").insert({
    email,
    status: "pending",
    confirm_token: confirmToken,
    unsubscribe_token: newToken(),
    source,
    source_slug: sourceSlug,
  });

  if (error) return { kind: "error", message: error.message };
  return { kind: "confirmation_sent", email, confirmToken };
}

export async function confirmByToken(
  token: string
): Promise<{ email: string; unsubscribeToken: string } | null> {
  if (!token) return null;

  const { data } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id, email, status, unsubscribe_token")
    .eq("confirm_token", token)
    .maybeSingle();

  if (!data) return null;

  // Confirming twice is not an error. Email clients prefetch links, and a
  // reader who clicks their own confirmation a second time should see "you
  // are on the list", not a failure.
  if (data.status !== "confirmed") {
    const { error } = await supabaseAdmin
      .from("insight_subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })
      .eq("id", data.id);
    if (error) return null;
  }

  return { email: data.email, unsubscribeToken: data.unsubscribe_token };
}

export async function unsubscribeByToken(
  token: string
): Promise<{ email: string } | null> {
  if (!token) return null;

  const { data } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id, email")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!data) return null;

  const { error } = await supabaseAdmin
    .from("insight_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) return null;
  return { email: data.email };
}

/** Undo for the reader whose mail client prefetched the unsubscribe link. */
export async function resubscribeByToken(
  token: string
): Promise<{ email: string } | null> {
  if (!token) return null;

  const { data } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id, email")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!data) return null;

  const { error } = await supabaseAdmin
    .from("insight_subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      unsubscribed_at: null,
    })
    .eq("id", data.id);

  if (error) return null;
  return { email: data.email };
}

export type MailableSubscriber = {
  id: string;
  email: string;
  unsubscribe_token: string;
};

/**
 * Who still needs this article.
 *
 * Only confirmed rows are ever mailed; pending and unsubscribed never are.
 * Anyone already marked with this slug is skipped, which makes a broadcast
 * resumable rather than all-or-nothing: a run that dies halfway, or one
 * capped by `limit` because the list outgrew a single request, is finished
 * by pressing send again, and pressing send twice on a completed broadcast
 * mails nobody.
 */
export async function listRecipientsFor(
  articleSlug: string,
  limit: number
): Promise<MailableSubscriber[]> {
  const { data } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id, email, unsubscribe_token")
    .eq("status", "confirmed")
    .or(`last_sent_slug.is.null,last_sent_slug.neq.${articleSlug}`)
    .order("created_at", { ascending: true })
    .limit(limit);

  return data ?? [];
}

/** Written per recipient, immediately after their send succeeds. */
export async function markSent(id: string, articleSlug: string): Promise<void> {
  await supabaseAdmin
    .from("insight_subscribers")
    .update({ last_sent_slug: articleSlug, last_sent_at: new Date().toISOString() })
    .eq("id", id);
}

export async function confirmedSubscriberCount(): Promise<number> {
  const { count } = await supabaseAdmin
    .from("insight_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "confirmed");

  return count ?? 0;
}

export type BroadcastRecord = {
  article_slug: string;
  recipients: number;
  failures: number;
  sent_at: string;
};

export async function listBroadcasts(): Promise<BroadcastRecord[]> {
  const { data } = await supabaseAdmin
    .from("insight_broadcasts")
    .select("article_slug, recipients, failures, sent_at")
    .order("sent_at", { ascending: false });

  return data ?? [];
}

/**
 * One row per article, updated in place. A resumed broadcast adds to the
 * counts rather than creating a second row, so the admin screen shows one
 * line per article whatever it took to get it out.
 */
export async function recordBroadcast(
  articleSlug: string,
  sentBy: string | null,
  sent: number,
  failed: number
): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from("insight_broadcasts")
    .select("id, recipients, failures")
    .eq("article_slug", articleSlug)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("insight_broadcasts")
      .update({
        recipients: existing.recipients + sent,
        failures: existing.failures + failed,
        sent_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return;
  }

  await supabaseAdmin.from("insight_broadcasts").insert({
    article_slug: articleSlug,
    sent_by: sentBy,
    recipients: sent,
    failures: failed,
  });
}

export async function subscriberCounts(): Promise<
  Record<SubscriberStatus, number>
> {
  const counts: Record<SubscriberStatus, number> = {
    pending: 0,
    confirmed: 0,
    unsubscribed: 0,
  };

  const { data } = await supabaseAdmin
    .from("insight_subscribers")
    .select("status");

  for (const row of data ?? []) {
    const status = row.status as SubscriberStatus;
    if (status in counts) counts[status] += 1;
  }

  return counts;
}
