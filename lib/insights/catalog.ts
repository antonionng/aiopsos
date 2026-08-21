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
import type { InsightArticle } from "./types.ts";

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
