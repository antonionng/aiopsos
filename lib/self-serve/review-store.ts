import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { summariseReviews, type PublishedReview, type ReviewSummary } from "@/lib/self-serve/reviews";

type ReviewRow = {
  id: string;
  purchase_id: string;
  display_name: string;
  role: string | null;
  rating: number;
  body: string;
  status: "published" | "hidden";
  created_at: string;
};

const COLUMNS = "id, purchase_id, display_name, role, rating, body, status, created_at";

function toPublished(row: ReviewRow): PublishedReview {
  return {
    id: row.id,
    displayName: row.display_name,
    role: row.role,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function courseReviews(
  slug: string
): Promise<{ reviews: PublishedReview[]; summary: ReviewSummary }> {
  const { data, error } = await supabaseAdmin
    .from("self_serve_reviews")
    .select(COLUMNS)
    .eq("course_slug", slug)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) {
    console.error("[self-serve] reviews read", error);
    return { reviews: [], summary: summariseReviews([]) };
  }
  const rows = (data ?? []) as ReviewRow[];
  return { reviews: rows.map(toPublished), summary: summariseReviews(rows) };
}

export async function reviewForPurchase(purchaseId: string) {
  const { data } = await supabaseAdmin
    .from("self_serve_reviews")
    .select(COLUMNS)
    .eq("purchase_id", purchaseId)
    .maybeSingle();
  return (data as ReviewRow | null) ?? null;
}

function moderationSecret(): string | null {
  return process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function moderationSignature(reviewId: string, action: "hide" | "show"): string | null {
  const secret = moderationSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`review:${action}:${reviewId}`).digest("hex");
}

export function verifyModeration(reviewId: string, action: "hide" | "show", signature: string): boolean {
  const expected = moderationSignature(reviewId, action);
  if (!expected || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
