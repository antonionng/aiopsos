import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getInsightBySlug,
  getPublishedInsights,
  insightForCourse,
  insightWordCount,
  relatedCoursesFor,
} from "../insights/catalog.ts";

const ORIGINAL_SLUGS = [
  "eu-ai-act-article-4-literacy-for-ld",
  "unused-ai-licences-training-gap",
  "how-to-commission-workforce-ai-training",
  "robotics-training-is-an-ops-problem",
  "ai-output-verification-at-work",
] as const;

const NEW_SLUGS = [
  "what-ai-literacy-actually-means-at-work",
  "in-person-ai-training-vs-lms",
  "managers-not-champions-ai-adoption",
  "how-to-measure-if-ai-training-stuck",
  "cobot-training-for-the-shift-not-the-integrator",
  "technology-judgement-for-nontechnical-directors",
] as const;

const REQUIRED_SLUGS = [...ORIGINAL_SLUGS, ...NEW_SLUGS] as const;

const EXPECTED_DATES: Record<string, string> = {
  "robotics-training-is-an-ops-problem": "2026-06-10",
  "what-ai-literacy-actually-means-at-work": "2026-06-17",
  "unused-ai-licences-training-gap": "2026-06-24",
  "in-person-ai-training-vs-lms": "2026-07-01",
  "ai-output-verification-at-work": "2026-07-08",
  "managers-not-champions-ai-adoption": "2026-07-15",
  "how-to-commission-workforce-ai-training": "2026-07-22",
  "how-to-measure-if-ai-training-stuck": "2026-07-29",
  "eu-ai-act-article-4-literacy-for-ld": "2026-08-05",
  "cobot-training-for-the-shift-not-the-integrator": "2026-08-12",
  "technology-judgement-for-nontechnical-directors": "2026-08-19",
};

test("eleven published insights with unique titles, descriptions, and dates", () => {
  const articles = getPublishedInsights();
  assert.equal(articles.length, 11);

  const slugs = articles.map((a) => a.slug).sort();
  assert.deepEqual(slugs, [...REQUIRED_SLUGS].sort());

  const titles = new Set(articles.map((a) => a.title));
  const descriptions = new Set(articles.map((a) => a.description));
  const dates = new Set(articles.map((a) => a.publishedAt));
  assert.equal(titles.size, 11);
  assert.equal(descriptions.size, 11);
  assert.equal(dates.size, 11);

  for (const article of articles) {
    assert.ok(article.title.length > 10);
    assert.ok(article.description.length > 40);
    assert.ok(article.dek.length > 10);
    assert.equal(article.publishedAt, EXPECTED_DATES[article.slug]);
    assert.match(article.publishedAt, /^2026-(06|07|08)-\d{2}$/);
    assert.ok(article.publishedAt <= "2026-08-21");
  }

  const originalNewest = articles
    .filter((a) => (ORIGINAL_SLUGS as readonly string[]).includes(a.slug))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))[0];
  assert.equal(originalNewest.slug, "eu-ai-act-article-4-literacy-for-ld");
  assert.equal(originalNewest.publishedAt, "2026-08-05");
});

test("published dates are weekly-ish, not a consecutive dump", () => {
  const dates = getPublishedInsights()
    .map((a) => a.publishedAt)
    .sort();
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(`${dates[i - 1]}T00:00:00Z`).getTime();
    const next = new Date(`${dates[i]}T00:00:00Z`).getTime();
    const days = (next - prev) / 86400000;
    assert.ok(days >= 6, `${dates[i - 1]} to ${dates[i]} is only ${days} days`);
    assert.ok(days <= 10, `${dates[i - 1]} to ${dates[i]} is ${days} days`);
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
    "what-ai-literacy-actually-means-at-work": [
      "ai-foundations-for-every-role",
      "responsible-ai-use-at-work",
      "sponsoring-an-ai-literacy-programme",
    ],
    "in-person-ai-training-vs-lms": [
      "embedding-ai-in-daily-workflows",
      "leading-an-ai-ready-team",
    ],
    "managers-not-champions-ai-adoption": [
      "leading-an-ai-ready-team",
      "ai-governance-and-oversight-for-managers",
    ],
    "how-to-measure-if-ai-training-stuck": [
      "ai-governance-and-oversight-for-managers",
      "embedding-ai-in-daily-workflows",
    ],
    "cobot-training-for-the-shift-not-the-integrator": [
      "working-alongside-a-cobot",
      "running-and-troubleshooting-a-robotic-cell",
      "safety-risk-and-compliance-for-robotic-workcells",
    ],
    "technology-judgement-for-nontechnical-directors": [
      "technology-for-non-technical-leaders",
      "choosing-technology-well",
      "ai-strategy-and-oversight-for-executives",
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

test("new articles link to related insights", () => {
  const expectedInsightLinks: Record<string, string> = {
    "what-ai-literacy-actually-means-at-work":
      "/insights/eu-ai-act-article-4-literacy-for-ld",
    "in-person-ai-training-vs-lms":
      "/insights/how-to-commission-workforce-ai-training",
    "managers-not-champions-ai-adoption":
      "/insights/what-ai-literacy-actually-means-at-work",
    "how-to-measure-if-ai-training-stuck":
      "/insights/managers-not-champions-ai-adoption",
    "cobot-training-for-the-shift-not-the-integrator":
      "/insights/robotics-training-is-an-ops-problem",
    "technology-judgement-for-nontechnical-directors":
      "/insights/unused-ai-licences-training-gap",
  };

  for (const [slug, href] of Object.entries(expectedInsightLinks)) {
    const article = getInsightBySlug(slug);
    assert.ok(article, slug);
    assert.ok(article.body.includes(href), `${slug} missing ${href}`);
  }
});

test("course pages can resolve one related insight", () => {
  const article = insightForCourse("working-alongside-a-cobot");
  assert.equal(article?.slug, "cobot-training-for-the-shift-not-the-integrator");
  assert.equal(insightForCourse("not-a-course"), undefined);
});
