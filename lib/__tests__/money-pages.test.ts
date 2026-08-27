import { test } from "node:test";
import assert from "node:assert/strict";

import { getInsightBySlug } from "../insights/catalog.ts";
import {
  ASSESSMENT_PAGE,
  COURSE_SEO,
  LITERACY_MAPPED_COURSES,
  LITERACY_PAGE,
  getCourseSeo,
} from "../money-pages.ts";
import { COURSE_TITLES } from "../published-course-slugs.ts";
import { USE_CASE_SEO } from "../use-case-seo.ts";
import { getUseCase } from "../use-cases.ts";
import {
  educationalOccupationalProgramLd,
  faqPageLd,
  webPageLd,
} from "../json-ld.ts";

const COURSE_SLUGS = [
  "ai-foundations-for-every-role",
  "sponsoring-an-ai-literacy-programme",
  "leading-an-ai-ready-team",
  "getting-value-from-tools-you-already-own",
  "working-alongside-a-cobot",
  "warehouse-and-logistics-automation-in-practice",
] as const;

function allCopy(): string {
  const chunks: string[] = [
    LITERACY_PAGE.standfirst,
    ...LITERACY_PAGE.whoFor.paragraphs,
    ...LITERACY_PAGE.whyNow.paragraphs,
    ...LITERACY_PAGE.engagement.steps.map((step) => step.body),
    ...LITERACY_PAGE.pay.paragraphs,
    ...LITERACY_PAGE.faqs.map((faq) => `${faq.question} ${faq.answer}`),
    ASSESSMENT_PAGE.standfirst,
    ...ASSESSMENT_PAGE.whatItIs.paragraphs,
    ...ASSESSMENT_PAGE.whatItIsNot.paragraphs,
    ...ASSESSMENT_PAGE.after.paragraphs,
    ...ASSESSMENT_PAGE.faqs.map((faq) => `${faq.question} ${faq.answer}`),
  ];

  for (const seo of Object.values(COURSE_SEO)) {
    chunks.push(seo.title, seo.description);
    for (const block of seo.inserts) {
      chunks.push(...block.paragraphs);
    }
    chunks.push(...seo.faqs.map((faq) => `${faq.question} ${faq.answer}`));
  }
  for (const seo of Object.values(USE_CASE_SEO)) {
    chunks.push(seo.title, seo.description);
    for (const block of seo.sections) {
      chunks.push(...block.paragraphs);
    }
    chunks.push(...seo.faqs.map((faq) => `${faq.question} ${faq.answer}`));
  }

  return chunks.join("\n");
}

test("six live courses have title, insert copy, and five FAQs", () => {
  for (const slug of COURSE_SLUGS) {
    const seo = getCourseSeo(slug);
    assert.ok(seo, slug);
    assert.ok(seo.title.length > 0, slug);
    assert.ok(seo.description.length > 0, slug);
    assert.ok(seo.inserts.length >= 2, slug);
    assert.equal(seo.faqs.length, 5, slug);
  }
});

test("mapped literacy courses exist in the published catalogue", () => {
  for (const course of LITERACY_MAPPED_COURSES) {
    assert.ok(COURSE_TITLES[course.slug], course.slug);
  }
});

test("use-case overlays keep the four worked examples", () => {
  for (const slug of ["enterprise", "operations", "hr"] as const) {
    const entry = getUseCase(slug);
    assert.ok(entry, slug);
    assert.equal(entry.examples.length, 4, slug);
    assert.ok(USE_CASE_SEO[slug], slug);
    assert.equal(USE_CASE_SEO[slug].faqs.length, 5, slug);
  }
});

test("money-page copy never points at /dashboard", () => {
  assert.doesNotMatch(allCopy(), /\/dashboard/);
});

test("money-page copy does not claim Article 4 compliance or a certificate", () => {
  const text = allCopy();
  // Denials and FAQ questions are required. Fail only on an affirmative claim.
  assert.doesNotMatch(
    text,
    /\b(?:you are|we are|is now|will be|makes you)\s+(?:Article 4 )?compliant\b/i
  );
  assert.doesNotMatch(text, /Article 4 certified/i);
  assert.doesNotMatch(text, /earn a(?:n Article 4)? certificate/i);
  assert.doesNotMatch(text, /awarded a(?:n Article 4)? certificate/i);
});

test("further-reading slugs are live insights", () => {
  for (const seo of Object.values(COURSE_SEO)) {
    if (!seo.furtherReading) continue;
    const slug = seo.furtherReading.href.replace("/insights/", "");
    assert.ok(getInsightBySlug(slug), seo.furtherReading.href);
  }
});

test("literacy schema is a programme with hasCourse, not a credential", () => {
  const data = educationalOccupationalProgramLd({
    path: "/ai-literacy-training",
    name: LITERACY_PAGE.title,
    description: LITERACY_PAGE.description,
    courses: LITERACY_MAPPED_COURSES.map((course) => ({
      slug: course.slug,
      title: COURSE_TITLES[course.slug],
    })),
  });
  assert.equal(data["@type"], "EducationalOccupationalProgram");
  assert.equal(Array.isArray(data.hasCourse), true);
  assert.equal(data.hasCourse.length, 5);
  assert.equal("credential" in data, false);
  assert.equal("offers" in data, false);
  const serialised = JSON.stringify(data);
  assert.doesNotMatch(serialised, /compliant/i);
});

test("assessment schema is WebPage plus FAQPage, not Course", () => {
  const page = webPageLd({
    path: "/ai-readiness-assessment",
    name: ASSESSMENT_PAGE.title,
    description: ASSESSMENT_PAGE.description,
  });
  const faqs = faqPageLd(ASSESSMENT_PAGE.faqs);
  assert.equal(page["@type"], "WebPage");
  assert.equal(faqs["@type"], "FAQPage");
  assert.notEqual(page["@type"], "Course");
});
