import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { LITERACY_DISCLAIMER } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site";
import { sendSelfServePurchaseAlert, sendSelfServeReceipt } from "@/lib/email";
import { getSelfServeCourse } from "./catalog.ts";
import { isSelfServeCheckout, newAccessToken, newCertificateRef } from "./commerce.ts";
import { artefactAnswer, courseArtefact, emptyProgress } from "./engine.ts";
import type { BuildAnswer, CourseProgress, SelfServeCourse } from "./types.ts";

export type PurchaseRow = {
  id: string;
  course_slug: string;
  email: string | null;
  buyer_name: string | null;
  amount: number;
  currency: string;
  stripe_session_id: string;
  status: "pending" | "paid" | "failed" | "refunded";
  access_token: string | null;
  receipt_sent_at: string | null;
  paid_at: string | null;
  user_id: string | null;
};

const PURCHASE_COLUMNS =
  "id, course_slug, email, buyer_name, amount, currency, stripe_session_id, status, access_token, receipt_sent_at, paid_at, user_id";

export type SignedRecord = {
  slug: string;
  title: string;
  signedName: string;
  signedAt: string;
  ref: string;
  artefact: BuildAnswer | null;
  artefactTitle: string;
  artefactFields: { id: string; label: string }[];
  recordLine: string;
  disclaimer: string;
};

type ProgressRow = {
  purchase_id: string;
  lessons: CourseProgress["lessons"];
  signed_name: string | null;
  signed_at: string | null;
  certificate_ref: string | null;
  artefact: BuildAnswer | null;
};

export async function insertPendingPurchase(input: {
  courseSlug: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
}): Promise<void> {
  const { error } = await supabaseAdmin.from("self_serve_purchases").insert({
    course_slug: input.courseSlug,
    amount: input.amount,
    currency: input.currency,
    stripe_session_id: input.stripeSessionId,
    status: "pending",
  });
  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw new Error(error.message);
  }
}

export async function fulfillSelfServeSession(
  session: Stripe.Checkout.Session,
  options: { origin?: string } = {}
): Promise<PurchaseRow | null> {
  if (!isSelfServeCheckout(session.metadata)) return null;
  if (session.payment_status && session.payment_status !== "paid") return null;

  const slug = session.metadata?.course_slug;
  const course = slug ? getSelfServeCourse(slug) : undefined;
  if (!course) return null;

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    null;
  const buyerName = session.customer_details?.name ?? null;
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const existing = await findPurchaseBySession(session.id);
  const accessToken = existing?.access_token ?? newAccessToken();
  const paidAt = existing?.paid_at ?? new Date().toISOString();
  const signedInUser = session.metadata?.user_id || null;
  const userId = existing?.user_id ?? signedInUser;

  const { data, error } = await supabaseAdmin
    .from("self_serve_purchases")
    .upsert(
      {
        ...(existing?.id ? { id: existing.id } : {}),
        course_slug: course.slug,
        email,
        buyer_name: buyerName,
        amount: existing?.amount ?? course.priceGbp * 100,
        currency: (session.currency ?? "gbp").toUpperCase(),
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntent,
        stripe_customer_id: customerId,
        status: "paid",
        access_token: accessToken,
        paid_at: paidAt,
        ...(userId
          ? {
              user_id: userId,
              account_linked_at: new Date().toISOString(),
            }
          : {}),
      },
      { onConflict: "stripe_session_id" }
    )
    .select(PURCHASE_COLUMNS)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not record the purchase.");
  }

  const purchase = data as PurchaseRow;
  await supabaseAdmin.from("self_serve_progress").upsert(
    { purchase_id: purchase.id },
    { onConflict: "purchase_id", ignoreDuplicates: true }
  );

  if (!purchase.receipt_sent_at && purchase.email && purchase.access_token) {
    await sendPurchaseMail(purchase, course, options.origin);
  }

  return purchase;
}

async function sendPurchaseMail(
  purchase: PurchaseRow,
  course: SelfServeCourse,
  origin?: string
) {
  const base = (origin ?? getPublicSiteUrl()).replace(/\/$/, "");
  const learnUrl = `${base}/learn/${purchase.course_slug}?access=${purchase.access_token}`;
  const accountUrl = `${base}/learn/my-courses`;
  const amountGbp = purchase.amount / 100;
  const email = purchase.email as string;
  const hasAccount = Boolean(purchase.user_id) || (await accountExistsForEmail(email));
  const owned = await ownedCourseSlugs(email);

  const [receipt, alert] = await Promise.allSettled([
    sendSelfServeReceipt({
      email,
      name: purchase.buyer_name,
      courseSlug: course.slug,
      courseTitle: course.title,
      artefactTitle: courseArtefact(course)?.title ?? null,
      amountGbp,
      paidAt: purchase.paid_at,
      learnUrl,
      accountUrl,
      hasAccount,
      owned,
      origin: base,
    }),
    sendSelfServePurchaseAlert({
      email,
      name: purchase.buyer_name,
      courseTitle: course.title,
      amountGbp,
      paidAt: purchase.paid_at,
      hasAccount,
      stripeSessionId: purchase.stripe_session_id,
    }),
  ]);
  if (alert.status === "rejected") console.error("[self-serve] purchase alert failed", alert.reason);
  if (receipt.status === "rejected") {
    console.error("[self-serve] receipt mail failed", receipt.reason);
    return;
  }
  await supabaseAdmin
    .from("self_serve_purchases")
    .update({ receipt_sent_at: new Date().toISOString() })
    .eq("id", purchase.id)
    .is("receipt_sent_at", null);
}

/** Every course this address has paid for, so suggestions never offer one of them. */
export async function ownedCourseSlugs(email: string | null | undefined): Promise<string[]> {
  const address = normaliseEmail(email);
  if (!address) return [];
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select("course_slug")
    .ilike("email", address.replace(/[\\%_]/g, (c) => `\\${c}`))
    .eq("status", "paid");
  return [...new Set(((data as { course_slug: string }[] | null) ?? []).map((row) => row.course_slug))];
}

export async function findPurchaseBySession(
  sessionId: string
): Promise<PurchaseRow | null> {
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(PURCHASE_COLUMNS)
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  return (data as PurchaseRow | null) ?? null;
}

export async function findPaidPurchase(
  token: string,
  slug: string
): Promise<PurchaseRow | null> {
  if (!token) return null;
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(PURCHASE_COLUMNS)
    .eq("access_token", token)
    .eq("course_slug", slug)
    .eq("status", "paid")
    .maybeSingle();
  return (data as PurchaseRow | null) ?? null;
}

export async function findPaidPurchaseByToken(token: string): Promise<PurchaseRow | null> {
  if (!token) return null;
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(PURCHASE_COLUMNS)
    .eq("access_token", token)
    .eq("status", "paid")
    .maybeSingle();
  return (data as PurchaseRow | null) ?? null;
}

function normaliseEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/** Purchases made while signed in carry the user id; guest purchases match on the account email. */
export async function purchasesForUser(
  userId: string,
  email: string | null | undefined
): Promise<PurchaseRow[]> {
  const byUser = await supabaseAdmin
    .from("self_serve_purchases")
    .select(PURCHASE_COLUMNS)
    .eq("user_id", userId)
    .eq("status", "paid");
  const rows = new Map<string, PurchaseRow>();
  for (const row of (byUser.data as PurchaseRow[] | null) ?? []) rows.set(row.id, row);

  const address = normaliseEmail(email);
  if (address) {
    const byEmail = await supabaseAdmin
      .from("self_serve_purchases")
      .select(PURCHASE_COLUMNS)
      .ilike("email", address.replace(/[\\%_]/g, (c) => `\\${c}`))
      .is("user_id", null)
      .eq("status", "paid");
    for (const row of (byEmail.data as PurchaseRow[] | null) ?? []) rows.set(row.id, row);
  }
  return [...rows.values()].sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""));
}

export async function findUserPurchase(
  userId: string,
  email: string | null | undefined,
  slug: string
): Promise<PurchaseRow | null> {
  const rows = await purchasesForUser(userId, email);
  return rows.find((row) => row.course_slug === slug) ?? null;
}

export async function linkPurchasesToUser(
  userId: string,
  email: string | null | undefined
): Promise<number> {
  const rows = await purchasesForUser(userId, email);
  const unlinked = rows.filter((row) => !row.user_id).map((row) => row.id);
  if (unlinked.length === 0) return 0;
  const { error } = await supabaseAdmin
    .from("self_serve_purchases")
    .update({ user_id: userId, account_linked_at: new Date().toISOString() })
    .in("id", unlinked)
    .is("user_id", null);
  if (error) throw new Error(error.message);
  return unlinked.length;
}

export async function accountExistsForEmail(email: string | null | undefined): Promise<boolean> {
  const address = normaliseEmail(email);
  if (!address) return false;
  const { data } = await supabaseAdmin
    .from("user_profiles")
    .select("id")
    .ilike("email", address.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export async function findAccountIdForEmail(email: string | null | undefined): Promise<string | null> {
  const address = normaliseEmail(email);
  if (!address) return null;
  const { data } = await supabaseAdmin
    .from("user_profiles")
    .select("id")
    .ilike("email", address.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(1);
  return (data?.[0]?.id as string | undefined) ?? null;
}

export async function progressForPurchases(
  purchaseIds: string[]
): Promise<Map<string, CourseProgress>> {
  const out = new Map<string, CourseProgress>();
  if (purchaseIds.length === 0) return out;
  const { data } = await supabaseAdmin
    .from("self_serve_progress")
    .select("purchase_id, lessons, signed_name, signed_at, certificate_ref")
    .in("purchase_id", purchaseIds);
  for (const row of (data as ProgressRow[] | null) ?? []) {
    out.set(row.purchase_id, {
      lessons: row.lessons ?? {},
      signedName: row.signed_name ?? undefined,
      signedAt: row.signed_at ?? undefined,
      ref: row.certificate_ref ?? undefined,
    });
  }
  return out;
}

export async function loadProgress(purchaseId: string): Promise<CourseProgress> {
  const { data } = await supabaseAdmin
    .from("self_serve_progress")
    .select("lessons, signed_name, signed_at, certificate_ref")
    .eq("purchase_id", purchaseId)
    .maybeSingle();
  if (!data) return emptyProgress();
  const row = data as Pick<
    ProgressRow,
    "lessons" | "signed_name" | "signed_at" | "certificate_ref"
  >;
  return {
    lessons: row.lessons ?? {},
    signedName: row.signed_name ?? undefined,
    signedAt: row.signed_at ?? undefined,
    ref: row.certificate_ref ?? undefined,
  };
}

export async function saveProgress(
  purchaseId: string,
  progress: CourseProgress,
  course?: SelfServeCourse
): Promise<CourseProgress> {
  const artefact = course ? artefactAnswer(progress, courseArtefact(course)) : null;
  const { error } = await supabaseAdmin.from("self_serve_progress").upsert({
    purchase_id: purchaseId,
    lessons: progress.lessons,
    signed_name: progress.signedName ?? null,
    signed_at: progress.signedAt ?? null,
    certificate_ref: progress.ref ?? null,
    artefact,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return progress;
}

export async function signProgress(
  purchaseId: string,
  progress: CourseProgress,
  course?: SelfServeCourse
): Promise<CourseProgress> {
  const next = {
    ...progress,
    signedName: progress.signedName?.trim(),
    signedAt: progress.signedAt ?? new Date().toISOString(),
    ref: progress.ref ?? newCertificateRef(),
  };
  return saveProgress(purchaseId, next, course);
}

export async function findSignedRecord(ref: string): Promise<SignedRecord | null> {
  const normalised = ref.trim().toUpperCase();
  if (!normalised) return null;
  const { data } = await supabaseAdmin
    .from("self_serve_progress")
    .select("signed_name, signed_at, certificate_ref, artefact, purchase_id")
    .eq("certificate_ref", normalised)
    .maybeSingle();
  if (!data?.signed_name || !data.signed_at || !data.certificate_ref) return null;

  const { data: purchase } = await supabaseAdmin
    .from("self_serve_purchases")
    .select("course_slug")
    .eq("id", data.purchase_id)
    .maybeSingle();
  const course = purchase?.course_slug ? getSelfServeCourse(purchase.course_slug) : undefined;
  if (!course) return null;

  const resolved = courseArtefact(course);
  return {
    slug: course.slug,
    title: course.title,
    signedName: data.signed_name,
    signedAt: data.signed_at,
    ref: data.certificate_ref,
    artefact: (data.artefact as BuildAnswer | null) ?? null,
    artefactTitle: resolved?.title ?? "The signed work",
    artefactFields: resolved?.fields ?? [],
    recordLine: resolved?.recordLine ?? `Completed ${course.title}.`,
    disclaimer: LITERACY_DISCLAIMER,
  };
}

