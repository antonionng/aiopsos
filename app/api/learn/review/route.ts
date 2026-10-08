import { NextResponse } from "next/server";
import { sendReviewAlert } from "@/lib/email";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { currentLearner, findEntitledPurchase } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { loadProgress } from "@/lib/self-serve/records";
import { moderationSignature, reviewForPurchase } from "@/lib/self-serve/review-store";
import { parseReview, reviewerName } from "@/lib/self-serve/reviews";
import { getPublicSiteUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function signedPurchase(slug: unknown) {
  const course = typeof slug === "string" ? getSelfServeCourse(slug) : undefined;
  if (!course) return { error: "That course does not exist.", status: 404 } as const;
  const purchase = await findEntitledPurchase(course.slug);
  if (!purchase) return { error: "Only learners on this course can review it.", status: 403 } as const;
  const progress = await loadProgress(purchase.id);
  if (!progress.signedName || !progress.ref) {
    return { error: "Finish the course and sign your record, then leave a review.", status: 403 } as const;
  }
  return { course, purchase, signedName: progress.signedName } as const;
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  const found = await signedPurchase(slug);
  if ("error" in found) return NextResponse.json({ eligible: false, detail: found.error });
  const review = await reviewForPurchase(found.purchase.id);
  return NextResponse.json(
    {
      eligible: true,
      signedName: found.signedName,
      review: review
        ? {
            rating: review.rating,
            body: review.body,
            role: review.role,
            nameStyle: review.display_name === found.signedName.trim() ? "full" : "initial",
          }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const found = await signedPurchase(raw.slug);
  if ("error" in found) return NextResponse.json({ detail: found.error }, { status: found.status });

  const rl = rateLimit(`learn-review:${found.purchase.id}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { detail: "You have changed this review several times. Try again later." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const parsed = parseReview(raw);
  if ("error" in parsed) return NextResponse.json({ detail: parsed.error }, { status: 400 });
  const { review } = parsed;
  const previous = await reviewForPurchase(found.purchase.id);
  const user = await currentLearner();
  const displayName = reviewerName(found.signedName, review.nameStyle);

  const { data, error } = await supabaseAdmin
    .from("self_serve_reviews")
    .upsert(
      {
        purchase_id: found.purchase.id,
        user_id: user?.id ?? found.purchase.user_id,
        course_slug: found.course.slug,
        display_name: displayName,
        role: review.role,
        rating: review.rating,
        body: review.body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "purchase_id" }
    )
    .select("id, status")
    .single();
  if (error || !data) {
    console.error("[self-serve] review save", error);
    return NextResponse.json({ detail: "We could not save your review. Try again." }, { status: 500 });
  }

  if (!previous || previous.body !== review.body || previous.rating !== review.rating) {
    const base = getPublicSiteUrl().replace(/\/$/, "");
    const sig = moderationSignature(data.id, "hide");
    try {
      await sendReviewAlert({
        courseTitle: found.course.title,
        displayName,
        email: found.purchase.email ?? user?.email ?? "unknown",
        rating: review.rating,
        body: review.body,
        hideUrl: sig ? `${base}/api/learn/review/moderate?id=${data.id}&action=hide&sig=${sig}` : null,
        pageUrl: `${base}/learn/${found.course.slug}#reviews`,
      });
    } catch (mailError) {
      console.error("[self-serve] review alert", mailError);
    }
  }

  return NextResponse.json({ ok: true, status: data.status });
}

export async function DELETE(req: Request) {
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const found = await signedPurchase(raw.slug);
  if ("error" in found) return NextResponse.json({ detail: found.error }, { status: found.status });
  await supabaseAdmin.from("self_serve_reviews").delete().eq("purchase_id", found.purchase.id);
  return NextResponse.json({ ok: true });
}
