import { article as euAiAct } from "./articles/eu-ai-act-article-4-literacy-for-ld.ts";
import { article as unusedLicences } from "./articles/unused-ai-licences-training-gap.ts";
import { article as commissionTraining } from "./articles/how-to-commission-workforce-ai-training.ts";
import { article as roboticsOps } from "./articles/robotics-training-is-an-ops-problem.ts";
import { article as verification } from "./articles/ai-output-verification-at-work.ts";
import { article as whatLiteracy } from "./articles/what-ai-literacy-actually-means-at-work.ts";
import { article as inPersonVsLms } from "./articles/in-person-ai-training-vs-lms.ts";
import { article as managersNotChampions } from "./articles/managers-not-champions-ai-adoption.ts";
import { article as measureStuck } from "./articles/how-to-measure-if-ai-training-stuck.ts";
import { article as cobotShift } from "./articles/cobot-training-for-the-shift-not-the-integrator.ts";
import { article as directorJudgement } from "./articles/technology-judgement-for-nontechnical-directors.ts";
import { COURSE_TITLES } from "../published-course-slugs.ts";
import { INSIGHT_TOPICS, type InsightArticle, type InsightTopic } from "./types.ts";

const PUBLISHED: InsightArticle[] = [
  euAiAct,
  unusedLicences,
  commissionTraining,
  roboticsOps,
  verification,
  whatLiteracy,
  inPersonVsLms,
  managersNotChampions,
  measureStuck,
  cobotShift,
  directorJudgement,
];

export function getPublishedInsights(): InsightArticle[] {
  return [...PUBLISHED].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0
  );
}

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return PUBLISHED.find((article) => article.slug === slug);
}

export function insightWordCount(article: InsightArticle): number {
  return article.body.split(/\s+/).filter(Boolean).length;
}

/**
 * Reading time in whole minutes.
 *
 * 220 words per minute rather than the blog-standard 200: these are short,
 * dense business briefings read by people deciding whether to keep reading,
 * and rounding up a five minute piece to seven costs us the click. Never
 * returns 0, because "0 min read" reads as broken.
 */
export function insightReadingMinutes(article: InsightArticle): number {
  return Math.max(1, Math.round(insightWordCount(article) / 220));
}

/** Topics that actually have a published article behind them, in canon order. */
export function getInsightTopics(): InsightTopic[] {
  const used = new Set(getPublishedInsights().map((article) => article.topic));
  return INSIGHT_TOPICS.filter((topic) => used.has(topic));
}

export function getInsightsByTopic(topic: InsightTopic): InsightArticle[] {
  return getPublishedInsights().filter((article) => article.topic === topic);
}

/**
 * The pieces either side of this one, for the end-of-article navigation.
 *
 * The list runs newest first, so the *next* index is the older article.
 * Named from the reader's point of view rather than the array's: "older" and
 * "newer" are unambiguous where "next" and "previous" are not.
 */
export function adjacentInsights(slug: string): {
  older?: InsightArticle;
  newer?: InsightArticle;
} {
  const all = getPublishedInsights();
  const index = all.findIndex((article) => article.slug === slug);
  if (index === -1) return {};
  return { newer: all[index - 1], older: all[index + 1] };
}

/**
 * Up to `limit` other articles worth reading after this one. Same topic
 * first, then most recent, so a robotics reader is not handed three
 * governance notes.
 */
export function relatedInsights(
  article: InsightArticle,
  limit = 2
): InsightArticle[] {
  const others = getPublishedInsights().filter((a) => a.slug !== article.slug);
  const sameTopic = others.filter((a) => a.topic === article.topic);
  const rest = others.filter((a) => a.topic !== article.topic);
  return [...sameTopic, ...rest].slice(0, limit);
}

export function relatedCoursesFor(article: InsightArticle): {
  slug: string;
  title: string;
}[] {
  return article.relatedCourseSlugs.map((slug) => ({
    slug,
    title: COURSE_TITLES[slug] ?? slug,
  }));
}

/** One related article for a course page. First published match wins. */
export function insightForCourse(courseSlug: string): InsightArticle | undefined {
  return getPublishedInsights().find((article) =>
    article.relatedCourseSlugs.includes(courseSlug)
  );
}
