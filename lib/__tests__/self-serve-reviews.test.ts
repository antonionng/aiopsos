import { test } from "node:test";
import assert from "node:assert/strict";

import { parseReview, reviewerName, summariseReviews } from "../self-serve/reviews.ts";

test("a learner can show a full name or a first name and initial", () => {
  assert.equal(reviewerName("Antonio Giugno", "full"), "Antonio Giugno");
  assert.equal(reviewerName("Antonio  de la Giugno", "initial"), "Antonio G.");
  assert.equal(reviewerName("Cher", "initial"), "Cher");
  assert.equal(reviewerName("  ", "initial"), "Verified learner");
});

test("the summary averages to one decimal place and counts each star", () => {
  const summary = summariseReviews([{ rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 9 }]);
  assert.equal(summary.count, 3);
  assert.equal(summary.average, 4.3);
  assert.deepEqual(summary.distribution, [0, 0, 0, 2, 1]);
  assert.equal(summariseReviews([]).average, 0);
});

test("a review needs a rating, enough words, and no links", () => {
  assert.ok("error" in parseReview({ rating: 0, body: "x".repeat(40) }));
  assert.ok("error" in parseReview({ rating: 5, body: "too short" }));
  assert.ok("error" in parseReview({ rating: 5, body: "Great course, see www.example.com for more" }));
  const ok = parseReview({ rating: 5, body: "  Really useful 👍 I use the card every week now.  ", role: " Analyst " });
  assert.ok("review" in ok);
  if ("review" in ok) {
    assert.equal(ok.review.body, "Really useful 👍 I use the card every week now.");
    assert.equal(ok.review.role, "Analyst");
    assert.equal(ok.review.nameStyle, "initial");
  }
});
