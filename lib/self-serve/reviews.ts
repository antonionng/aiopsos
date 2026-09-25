export type ReviewNameStyle = "full" | "initial";

export type PublishedReview = {
  id: string;
  displayName: string;
  role: string | null;
  rating: number;
  body: string;
  createdAt: string;
};

export type ReviewSummary = {
  count: number;
  average: number;
  distribution: [number, number, number, number, number];
};

export type ReviewInput = {
  rating: number;
  body: string;
  role: string | null;
  nameStyle: ReviewNameStyle;
};

export const REVIEW_MIN = 20;
export const REVIEW_MAX = 1200;

/** "Antonio Giugno" becomes "Antonio G." when the learner prefers not to show a full name. */
export function reviewerName(signedName: string, style: ReviewNameStyle): string {
  const parts = signedName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Verified learner";
  if (style === "full" || parts.length === 1) return parts.join(" ").slice(0, 80);
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last.charAt(0).toUpperCase()}.`.slice(0, 80);
}

export function summariseReviews(reviews: { rating: number }[]): ReviewSummary {
  const distribution: ReviewSummary["distribution"] = [0, 0, 0, 0, 0];
  let total = 0;
  for (const review of reviews) {
    const rating = Math.round(review.rating);
    if (rating < 1 || rating > 5) continue;
    distribution[rating - 1] += 1;
    total += rating;
  }
  const count = distribution.reduce((sum, n) => sum + n, 0);
  return {
    count,
    average: count ? Math.round((total / count) * 10) / 10 : 0,
    distribution,
  };
}

/** Returns a cleaned review, or the sentence to show the learner when it cannot be saved. */
export function parseReview(raw: unknown): { review: ReviewInput } | { error: string } {
  const input = (raw ?? {}) as Record<string, unknown>;
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Choose a rating from one to five stars." };
  }
  const body = typeof input.body === "string" ? input.body.replace(/\s+\n/g, "\n").trim() : "";
  if (body.length < REVIEW_MIN) {
    return { error: `Write at least ${REVIEW_MIN} characters so other people know what you found.` };
  }
  if (body.length > REVIEW_MAX) {
    return { error: `Keep the review under ${REVIEW_MAX} characters.` };
  }
  if (/https?:\/\/|www\./i.test(body)) {
    return { error: "Reviews cannot include links." };
  }
  const role =
    typeof input.role === "string" && input.role.trim() ? input.role.trim().slice(0, 80) : null;
  const nameStyle: ReviewNameStyle = input.nameStyle === "full" ? "full" : "initial";
  return { review: { rating, body, role, nameStyle } };
}
