import type { FaqItem } from "../json-ld.ts";

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

export type InsightCta = {
  heading: string;
  blurb: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  dek: string;
  /** Visible H1 when it must differ from the document title. */
  h1?: string;
  publishedAt: string;
  topic: InsightTopic;
  relatedCourseSlugs: string[];
  body: string;
  /**
   * Structured FAQs for on-page copy and FAQPage JSON-LD. generateMetadata
   * does not read the markdown body, so a FAQ that lives only in `body`
   * never reaches the schema.
   */
  faqs?: readonly FaqItem[];
  /** End-of-article CTA. Defaults to /contact for briefings that still use it. */
  cta?: InsightCta;
};
