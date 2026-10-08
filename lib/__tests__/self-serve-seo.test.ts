import { test } from "node:test";
import assert from "node:assert/strict";

import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";
import {
  TOPIC_HUBS,
  courseFaqs,
  courseMetaDescription,
  courseMetaTitle,
  isoDuration,
  selfServeCourseLd,
} from "../self-serve/seo.ts";
import { llmsFullTxt, llmsTxt } from "../llms.ts";
import { buildPublicSitemap } from "../public-sitemap.ts";

test("every course has a search title and a description made of whole sentences", () => {
  for (const course of SELF_SERVE_COURSES) {
    assert.ok(courseMetaTitle(course).startsWith(course.title));
    const description = courseMetaDescription(course);
    assert.match(description, /\.$/, course.slug);
    assert.ok(description.startsWith(course.promise.split(".")[0]), course.slug);
  }
});

test("course structured data carries price, workload, syllabus, and provider", () => {
  for (const course of SELF_SERVE_COURSES) {
    const ld = selfServeCourseLd(course);
    assert.equal(ld["@type"], "Course");
    assert.equal(ld.offers[0].priceCurrency, "GBP");
    assert.equal(ld.offers[0].price, course.priceGbp);
    assert.equal(ld.hasCourseInstance[0].courseMode, "Online");
    assert.equal(ld.syllabusSections.length, course.lessons?.length);
    assert.match(ld.provider["@id"], /#organisation$/);
  }
  assert.equal(isoDuration(2.5), "PT2H30M");
  assert.equal(isoDuration(3), "PT3H");
});

test("every course answers the questions buyers and answer engines ask", () => {
  for (const course of SELF_SERVE_COURSES) {
    const faqs = courseFaqs(course);
    assert.ok(faqs.length >= 6);
    for (const faq of faqs) {
      assert.match(faq.question, /\?$/);
      assert.match(faq.answer.trim(), /\.$/);
      assert.doesNotMatch(faq.answer, /[\u2014\u2013]/);
    }
    assert.ok(faqs.some((faq) => faq.answer.includes(`£${course.priceGbp}`)));
  }
});

test("the sitemap and llms.txt list the catalogue, every topic, and every course", () => {
  const base = "https://www.experrt.com";
  const urls = buildPublicSitemap({ baseUrl: base, courseSlugs: [] }).map((entry) => entry.url);
  const brief = llmsTxt(base);
  const full = llmsFullTxt(base);
  assert.ok(urls.includes(`${base}/learn`));
  for (const hub of TOPIC_HUBS) {
    assert.ok(urls.includes(`${base}/learn/topics/${hub.slug}`));
    assert.ok(brief.includes(`${base}/learn/topics/${hub.slug}`));
  }
  for (const course of SELF_SERVE_COURSES) {
    assert.ok(urls.includes(`${base}/learn/${course.slug}`), course.slug);
    assert.ok(brief.includes(`${base}/learn/${course.slug}`), course.slug);
    assert.ok(full.includes(`## ${course.title}`), course.slug);
  }
});
