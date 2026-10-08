import { test } from "node:test";
import assert from "node:assert/strict";
import { agentMarketingCourses } from "../always-on-agents/marketing.ts";
import { agentCourseMetadata, agentCourseGraph, agentCourseFaqs, agentCatalogueGraph, agentShareImage } from "../always-on-agents/seo.ts";
import { buildPublicSitemap } from "../public-sitemap.ts";
import { llmsTxt, llmsFullTxt } from "../llms.ts";
import robots from "../../app/robots.ts";

const base = "https://www.experrt.com";
test("every agent course has a unique canonical social image and public discovery links", () => {
  const urls = buildPublicSitemap({ baseUrl: base, courseSlugs: [] }).map(item => item.url);
  const brief = llmsTxt(base);
  const full = llmsFullTxt(base);
  const images = new Set<string>();
  for (const course of agentMarketingCourses) {
    const metadata = agentCourseMetadata(course, base);
    assert.equal(metadata.title.absolute, `${course.title} | Experrt Academy`);
    assert.equal(metadata.alternates.canonical, `${base}${course.href}`);
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.twitter.card, "summary_large_image");
    const image = metadata.openGraph.images[0];
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal(metadata.twitter.images[0], image.url);
    images.add(image.url);
    assert(urls.includes(metadata.alternates.canonical));
    assert(brief.includes(metadata.alternates.canonical));
    assert(full.includes(metadata.alternates.canonical));
    assert(full.includes(course.capstone));
  }
  assert.equal(images.size, 13);
  assert(urls.includes(`${base}/courses/agents`));
  assert.equal(new Set(urls).size, urls.length);
});
test("structured data reflects active pricing, visible FAQs and no invented ratings", () => {
  for (const course of agentMarketingCourses) {
    const open = agentCourseGraph(course, base, { amount: 9900, currency: "GBP", terms_url: `${base}/course-terms` });
    const closed = agentCourseGraph(course, base, null);
    assert.equal(open["@graph"][0].provider.name, "Experrt");
    assert.equal(open["@graph"][0].offers?.price, 99);
    assert.equal(open["@graph"][0].offers?.priceCurrency, "GBP");
    assert.equal("offers" in closed["@graph"][0], false);
    assert(!JSON.stringify(open).includes("aggregateRating"));
    assert.deepEqual(open["@graph"][2].mainEntity?.map(item => item.acceptedAnswer.text), agentCourseFaqs(course).map(faq => faq.answer));
  }
  assert.equal(agentCatalogueGraph(base).numberOfItems, 13);
  assert(agentShareImage("catalogue", base).url.includes("/og/catalogue"));
});
test("search and AI crawlers exclude private agent-course surfaces", () => {
  const rules = robots().rules;
  assert(Array.isArray(rules));
  for (const rule of rules) {
    for (const path of ["review", "learn/", "checkout/", "report/", "certificate/"]) {
      assert(Array.isArray(rule.disallow) && rule.disallow.includes(`/courses/agents/${path}`));
    }
  }
  const discovery = llmsTxt(base) + llmsFullTxt(base);
  assert(!/\/courses\/agents\/(learn|checkout|report|certificate|review)\//.test(discovery));
});
