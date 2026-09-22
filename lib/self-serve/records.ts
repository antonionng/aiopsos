import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { LITERACY_DISCLAIMER } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site";
import { sendSelfServePurchaseAlert, sendSelfServeReceipt } from "@/lib/email";
import { getSelfServeCourse } from "./catalog.ts";
import { isSelfServeCheckout, newAccessToken, newCertificateRef } from "./commerce.ts";
import { emptyProgress } from "./engine.ts";
import type { BuildAnswer, CourseProgress } from "./types.ts";

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
};

export type SignedRecord = {
  slug: string;
  title: string;
  signedName: string;
  signedAt: string;
  ref: string;
  artefact: BuildAnswer | null;
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
      },
      { onConflict: "stripe_session_id" }
    )
    .select(
      "id, course_slug, email, buyer_name, amount, currency, stripe_session_id, status, access_token, receipt_sent_at, paid_at"
    )
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
    await sendPurchaseMail(purchase, course.title, options.origin);
  }

  return purchase;
}

async function sendPurchaseMail(
  purchase: PurchaseRow,
  courseTitle: string,
  origin?: string
) {
  const base = (origin ?? getPublicSiteUrl()).replace(/\/$/, "");
  const learnUrl = `${base}/learn/${purchase.course_slug}?access=${purchase.access_token}`;
  const amountGbp = purchase.amount / 100;
  try {
    await sendSelfServeReceipt({
      email: purchase.email as string,
      courseTitle,
      amountGbp,
      learnUrl,
    });
    await sendSelfServePurchaseAlert({
      email: purchase.email as string,
      courseTitle,
      amountGbp,
      stripeSessionId: purchase.stripe_session_id,
    });
    await supabaseAdmin
      .from("self_serve_purchases")
      .update({ receipt_sent_at: new Date().toISOString() })
      .eq("id", purchase.id)
      .is("receipt_sent_at", null);
  } catch (error) {
    console.error("[self-serve] receipt mail failed", error);
  }
}

export async function findPurchaseBySession(
  sessionId: string
): Promise<PurchaseRow | null> {
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select(
      "id, course_slug, email, buyer_name, amount, currency, stripe_session_id, status, access_token, receipt_sent_at, paid_at"
    )
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
    .select(
      "id, course_slug, email, buyer_name, amount, currency, stripe_session_id, status, access_token, receipt_sent_at, paid_at"
    )
    .eq("access_token", token)
    .eq("course_slug", slug)
    .eq("status", "paid")
    .maybeSingle();
  return (data as PurchaseRow | null) ?? null;
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
  progress: CourseProgress
): Promise<CourseProgress> {
  const artefact = artefactFromProgress(progress);
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
  progress: CourseProgress
): Promise<CourseProgress> {
  const next = {
    ...progress,
    signedName: progress.signedName?.trim(),
    signedAt: progress.signedAt ?? new Date().toISOString(),
    ref: progress.ref ?? newCertificateRef(),
  };
  return saveProgress(purchaseId, next);
}

function artefactFromProgress(progress: CourseProgress): BuildAnswer | null {
  const answer = progress.lessons["prompt-card"]?.answer;
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return null;
  return answer as BuildAnswer;
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

  return {
    slug: course.slug,
    title: course.title,
    signedName: data.signed_name,
    signedAt: data.signed_at,
    ref: data.certificate_ref,
    artefact: (data.artefact as BuildAnswer | null) ?? null,
    disclaimer: LITERACY_DISCLAIMER,
  };
}

