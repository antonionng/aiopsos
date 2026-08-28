/**
 * Topics are a closed set on purpose. A free-text tag field on eleven
 * articles becomes fourteen near-duplicate tags by article thirty, and the
 * index filter stops being useful the moment that happens.
 */
export const INSIGHT_TOPICS = [
  "AI literacy",
  "Commissioning",
  "Adoption",
  "Measurement",
  "Robotics",
] as const;

export type InsightTopic = (typeof INSIGHT_TOPICS)[number];

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  dek: string;
  publishedAt: string;
  topic: InsightTopic;
  relatedCourseSlugs: string[];
  body: string;
};
