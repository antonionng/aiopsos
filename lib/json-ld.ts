import { getPublicSiteUrl } from "./site.ts";

const BASE_URL = getPublicSiteUrl();

/** The provider, referenced by every Course node via @id. */
export const ORGANISATION_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${BASE_URL}/#organisation`,
  name: "Experrt",
  url: BASE_URL,
  logo: `${BASE_URL}/experrt-logo.png`,
  description:
    "A training academy for applied AI, technology and robotics. Courses are facilitated live by a trainer, in person or online.",
  knowsAbout: [
    "Applied artificial intelligence",
    "AI literacy for the workforce",
    "Technology adoption",
    "Applied robotics",
    "EU AI Act Article 4",
  ],
};

export function courseLd(course: {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration_hours: number;
  delivery_modes: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${BASE_URL}/courses/${course.slug}`,
    url: `${BASE_URL}/courses/${course.slug}`,
    name: course.title,
    description: course.summary,
    educationalLevel: course.level,
    provider: { "@id": `${BASE_URL}/#organisation` },
    // Every course is facilitated live, which is the distinction worth
    // encoding: "blended" and "onsite" are the schema.org values a search
    // engine understands, and neither of them means self-paced video.
    hasCourseInstance: course.delivery_modes.map((mode) => ({
      "@type": "CourseInstance",
      courseMode:
        mode === "virtual" ? "online" : mode === "blended" ? "blended" : "onsite",
      courseWorkload: `PT${course.duration_hours}H`,
    })),
  };
}

export function articleLd(article: {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  h1?: string;
}) {
  const url = `${BASE_URL}/insights/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1 ?? article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: url,
    url,
    author: {
      "@type": "Organization",
      name: "Experrt",
      url: BASE_URL,
    },
    publisher: { "@id": `${BASE_URL}/#organisation` },
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageLd(faqs: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function webPageLd(page: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${BASE_URL}${page.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Experrt",
      url: BASE_URL,
    },
    publisher: { "@id": `${BASE_URL}/#organisation` },
  };
}

export function educationalOccupationalProgramLd(programme: {
  path: string;
  name: string;
  description: string;
  courses: readonly { slug: string; title: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: programme.name,
    description: programme.description,
    url: `${BASE_URL}${programme.path}`,
    provider: { "@id": `${BASE_URL}/#organisation` },
    hasCourse: programme.courses.map((course) => ({
      "@type": "Course",
      "@id": `${BASE_URL}/courses/${course.slug}`,
      url: `${BASE_URL}/courses/${course.slug}`,
      name: course.title,
    })),
  };
}
