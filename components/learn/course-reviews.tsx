import type { PublishedReview, ReviewSummary } from "@/lib/self-serve/reviews";

function Stars({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="ex-rating" role="img" aria-label={label ?? `${value} out of 5 stars`}>
      <span className="ex-rating-base">★★★★★</span>
      <span className="ex-rating-fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

export function CourseReviews({
  reviews,
  summary,
}: {
  reviews: PublishedReview[];
  summary: ReviewSummary;
}) {
  if (summary.count === 0) return null;
  return (
    <section className="ex-land-reviews" id="reviews" aria-labelledby="reviews-heading">
      <div className="ex-wide">
        <p className="ex-eyebrow">
          <span />
          REVIEWS FROM VERIFIED LEARNERS
        </p>
        <h2 id="reviews-heading">What people who finished the course say.</h2>
        <div className="ex-review-layout">
          <aside className="ex-review-summary">
            <strong>{summary.average.toFixed(1)}</strong>
            <Stars value={summary.average} />
            <p>
              {summary.count} review{summary.count === 1 ? "" : "s"}
            </p>
            <ol>
              {[5, 4, 3, 2, 1].map((star) => {
                const n = summary.distribution[star - 1];
                return (
                  <li key={star}>
                    <span>{star}★</span>
                    <span className="ex-review-bar">
                      <i style={{ width: `${summary.count ? (n / summary.count) * 100 : 0}%` }} />
                    </span>
                    <span>{n}</span>
                  </li>
                );
              })}
            </ol>
            <p className="ex-review-rule">
              Only people who completed the course and signed their record can review it. We do not
              edit reviews or pay for them.
            </p>
          </aside>
          <ul className="ex-land-review-grid">
            {reviews.slice(0, 12).map((review) => (
              <li key={review.id}>
                <Stars value={review.rating} />
                <p>{review.body}</p>
                <strong>{review.displayName}</strong>
                <span>
                  {review.role ? `${review.role} · ` : ""}
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="ex-verified-badge">✓ Verified learner</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
