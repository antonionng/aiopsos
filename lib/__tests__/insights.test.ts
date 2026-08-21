import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getInsightBySlug,
  getPublishedInsights,
  insightForCourse,
  insightWordCount,
  relatedCoursesFor,
} from "../insights/catalog.ts";

const REQUIRED_SLUGS = [
  "eu-ai-act-article-4-literacy-for-ld",
  "unused-ai-licences-training-gap",
  "how-to-commission-workforce-ai-training",
  "robotics-training-is-an-ops-problem",
  "ai-output-verification-at-work",
] as const;

test("five published insights with unique titles and descriptions", () => {
  const articles = getPublishedInsights();
  assert.equal(articles.length, 5);

  const slugs = articles.map((a) => a.slug).sort();
  assert.deepEqual(slugs, [...REQUIRED_SLUGS].sort());

  const titles = new Set(articles.map((a) => a.title));
  const descriptions = new Set(articles.map((a) => a.description));
  assert.equal(titles.size, 5);
  assert.equal(descriptions.size, 5);

  for (const article of articles) {
    assert.ok(article.title.length > 10);
    assert.ok(article.description.length > 40);
    assert.ok(article.dek.length > 10);
    assert.match(article.publishedAt, /^2026-08-1[7-9]$|^2026-08-2[01]$/);
  }
});

test("each article is 900-1400 words, one H1-free body, no em dashes", () => {
  for (const article of getPublishedInsights()) {
    const words = insightWordCount(article);
    assert.ok(
      words >= 900 && words <= 1400,
      `${article.slug} is ${words} words`
    );
    assert.equal(
      /(^|\n)# /.test(article.body),
      false,
      `${article.slug} has an H1`
    );
    assert.equal(article.body.includes("—"), false, `${article.slug} has an em dash`);
    assert.equal(article.title.includes("—"), false);
    assert.equal(article.description.includes("—"), false);
  }
});

test("each article links to named courses and contact", () => {
  const expectedCourses: Record<string, string[]> = {
    "eu-ai-act-article-4-literacy-for-ld": [
      "sponsoring-an-ai-literacy-programme",
      "responsible-ai-use-at-work",
    ],
    "unused-ai-licences-training-gap": [
      "getting-value-from-tools-you-already-own",
      "embedding-ai-in-daily-workflows",
    ],
    "how-to-commission-workforce-ai-training": [
      "sponsoring-an-ai-literacy-programme",
      "ai-governance-and-oversight-for-managers",
    ],
    "robotics-training-is-an-ops-problem": [
      "robotics-what-it-can-and-cannot-do",
      "specifying-a-robotics-deployment",
      "working-alongside-a-cobot",
    ],
    "ai-output-verification-at-work": [
      "prompting-and-output-verification",
      "ai-foundations-for-every-role",
    ],
  };

  for (const [slug, courses] of Object.entries(expectedCourses)) {
    const article = getInsightBySlug(slug);
    assert.ok(article, slug);
    assert.match(article.body, /\]\(\/contact\)/);
    for (const course of courses) {
      assert.ok(
        article.body.includes(`/courses/${course}`),
        `${slug} missing /courses/${course}`
      );
    }
    assert.deepEqual(relatedCoursesFor(article).map((c) => c.slug), courses);
  }
});

test("course pages can resolve one related insight", () => {
  const article = insightForCourse("working-alongside-a-cobot");
  assert.equal(article?.slug, "robotics-training-is-an-ops-problem");
  assert.equal(insightForCourse("not-a-course"), undefined);
});
