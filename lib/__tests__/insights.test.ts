import { test } from "node:test";
import assert from "node:assert/strict";

import {
  adjacentInsights,
  getInsightBySlug,
  getInsightTopics,
  getInsightsByTopic,
  getPublishedInsights,
  insightCta,
  insightForCourse,
  insightReadingMinutes,
  insightWordCount,
  relatedCoursesFor,
  relatedInsights,
} from "../insights/catalog.ts";
import { INSIGHT_TOPICS } from "../insights/types.ts";
import { articleLd, faqPageLd } from "../json-ld.ts";

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
    assert.equal(article.body.includes(" - "), false, `${article.slug} has an em dash`);
    assert.equal(article.title.includes(" - "), false);
    assert.equal(article.description.includes(" - "), false);
  }
});

test("each article links to named courses", () => {
  const expectedCourses: Record<string, string[]> = {
    "eu-ai-act-article-4-literacy-for-ld": [
      "sponsoring-an-ai-literacy-programme",
      "responsible-ai-use-at-work",
      "ai-foundations-for-every-role",
      "ai-governance-and-oversight-for-managers",
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
    if (
      slug === "eu-ai-act-article-4-literacy-for-ld" ||
      slug === "what-ai-literacy-actually-means-at-work" ||
      slug === "how-to-commission-workforce-ai-training" ||
      slug === "unused-ai-licences-training-gap"
    ) {
      assert.doesNotMatch(article.body, /\]\(\/contact(?:\?[^)]*)?\)/);
      assert.ok(article.body.includes("/ai-literacy-training"));
      if (slug === "eu-ai-act-article-4-literacy-for-ld") {
        assert.ok(article.body.includes("/ai-readiness-assessment"));
      } else {
        assert.ok(article.body.includes("ag@experrt.com"));
      }
    } else {
      assert.match(article.body, /\]\(\/contact\)/);
    }
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

// ---------------------------------------------------------------------------
// Topics, reading time, and the in-article navigation
// ---------------------------------------------------------------------------

test("every article carries a topic from the closed set", () => {
  for (const article of getPublishedInsights()) {
    assert.ok(
      INSIGHT_TOPICS.includes(article.topic),
      `${article.slug} has topic "${article.topic}", which is not in INSIGHT_TOPICS`
    );
  }
});

test("getInsightTopics returns only used topics, in canon order", () => {
  const topics = getInsightTopics();

  // Every returned topic has at least one article behind it, or the index
  // renders a filter chip that empties the list when pressed.
  for (const topic of topics) {
    assert.ok(
      getInsightsByTopic(topic).length > 0,
      `${topic} is offered as a filter but has no articles`
    );
  }

  const canonOrder = INSIGHT_TOPICS.filter((topic) => topics.includes(topic));
  assert.deepEqual(topics, canonOrder);
});

test("reading time is at least a minute and proportional to length", () => {
  for (const article of getPublishedInsights()) {
    const minutes = insightReadingMinutes(article);
    assert.ok(minutes >= 1, `${article.slug} reports ${minutes} min read`);
    assert.equal(minutes, Math.max(1, Math.round(insightWordCount(article) / 220)));
  }
});

test("adjacent insights walk the list in published order", () => {
  const all = getPublishedInsights();
  const newest = all[0];
  const oldest = all[all.length - 1];

  assert.equal(adjacentInsights(newest.slug).newer, undefined);
  assert.equal(adjacentInsights(newest.slug).older?.slug, all[1].slug);
  assert.equal(adjacentInsights(oldest.slug).older, undefined);
  assert.equal(
    adjacentInsights(oldest.slug).newer?.slug,
    all[all.length - 2].slug
  );

  // Adjacency is symmetric: the older neighbour's newer neighbour is us.
  const middle = all[Math.floor(all.length / 2)];
  const older = adjacentInsights(middle.slug).older;
  assert.ok(older);
  assert.equal(adjacentInsights(older.slug).newer?.slug, middle.slug);

  assert.deepEqual(adjacentInsights("no-such-article"), {});
});

test("related insights never include the article itself and prefer its topic", () => {
  for (const article of getPublishedInsights()) {
    const related = relatedInsights(article, 2);
    assert.ok(related.length > 0);
    assert.ok(related.length <= 2);
    assert.ok(
      related.every((other) => other.slug !== article.slug),
      `${article.slug} was offered as related to itself`
    );

    // Where the topic has other articles in it, the first suggestion is one
    // of them. A robotics reader handed two governance notes is the bug.
    const sameTopic = getInsightsByTopic(article.topic).filter(
      (other) => other.slug !== article.slug
    );
    if (sameTopic.length > 0) {
      assert.equal(related[0].topic, article.topic);
    }
  }
});

test("Article 4 L&D briefing is a literacy enquiry page, not a contact dump", () => {
  const article = getInsightBySlug("eu-ai-act-article-4-literacy-for-ld");
  assert.ok(article);
  assert.equal(
    article.title,
    "L&D has to evidence staff AI literacy under Article 4"
  );
  assert.equal(
    article.h1,
    "Article 4 of the EU AI Act asks Learning and Development to help staff understand the AI they already use."
  );
  assert.match(article.lede ?? "", /Europe's law for how companies use AI at work/);
  assert.match(article.lede ?? "", /Learning and Development/);
  assert.match(article.dek, /literacy duty, not a certificate/);
  assert.match(
    article.description,
    /duty to support AI literacy at work/
  );
  assert.doesNotMatch(article.body, /this month/);
  assert.match(article.body, /2 August 2026/);
  assert.match(article.body, /September/);
  assert.match(article.body, /Commission AI literacy Q&A/);
  assert.doesNotMatch(article.body, /EU AI Act compliant training/i);
  assert.doesNotMatch(article.body, /\bKumo\b/);
  assert.doesNotMatch(article.body, /£100,?000/);

  const faqs = article.faqs ?? [];
  assert.ok(faqs.length >= 5 && faqs.length <= 7);
  const faqText = faqs.map((faq) => `${faq.question} ${faq.answer}`).join("\n");
  assert.match(faqText, /certificate/i);
  assert.match(faqText, /not an Article 4 measure/i);
  assert.doesNotMatch(faqText, /\/contact/);

  const cta = insightCta(article);
  assert.equal(cta.primaryHref, "/ai-literacy-training");
  assert.equal(cta.secondaryHref, "/ai-readiness-assessment");
  assert.notEqual(cta.primaryHref, "/contact");
  assert.doesNotMatch(cta.primaryHref, /^\/contact/);
  assert.doesNotMatch(cta.blurb + cta.heading, /\/contact/);
  assert.match(cta.blurb, /ag@experrt\.com/);
  assert.match(article.body, /ag@experrt\.com/);

  const articleSchema = articleLd(article);
  assert.equal(articleSchema["@type"], "Article");
  assert.equal(articleSchema.headline, article.h1);
  assert.notEqual(articleSchema["@type"], "Course");

  const faqsSchema = faqPageLd(faqs);
  assert.equal(faqsSchema["@type"], "FAQPage");
  assert.equal(faqsSchema.mainEntity.length, faqs.length);
  assert.doesNotMatch(JSON.stringify(articleSchema), /"@type":"Course"/);
});

test("literacy-programme closers are the programme, not /contact", () => {
  for (const slug of [
    "what-ai-literacy-actually-means-at-work",
    "how-to-commission-workforce-ai-training",
    "unused-ai-licences-training-gap",
  ]) {
    const article = getInsightBySlug(slug);
    assert.ok(article, slug);
    assert.doesNotMatch(article.body, /\]\(\/contact(?:\?[^)]*)?\)/);
    assert.match(
      article.body,
      /If you want the programme scoped against the roles you already have/
    );
    assert.match(article.body, /\[AI literacy training\]\(\/ai-literacy-training\)/);
    assert.match(article.body, /\[ag@experrt\.com\]\(mailto:ag@experrt\.com\)/);
    assert.doesNotMatch(article.body, /\]\(\/contact\)/);

    const cta = insightCta(article);
    assert.equal(cta.primaryHref, "/ai-literacy-training", slug);
    assert.notEqual(cta.primaryHref, "/contact");
    assert.doesNotMatch(cta.primaryHref, /^\/contact/);
    assert.doesNotMatch(`${cta.blurb}${cta.heading}${cta.primaryLabel}`, /\/contact/);
    assert.match(cta.blurb, /ag@experrt\.com/);
    assert.equal(cta.secondaryHref, undefined);
  }

  const defaultCta = insightCta(
    getInsightBySlug("managers-not-champions-ai-adoption")!
  );
  assert.equal(defaultCta.primaryHref, "/contact");
});
