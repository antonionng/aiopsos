import { test } from "node:test";
import assert from "node:assert/strict";
import { ARTICLE4_PAGE, COMPARISON_PAGES, ROLE_PAGES } from "./landers.ts";
import { SEO_OVERRIDES } from "./seo-overrides.ts";

test("new lander titles stay within 60 characters once Experrt is added", () => {
  const pages = [
    ARTICLE4_PAGE,
    ...ROLE_PAGES,
    ...COMPARISON_PAGES,
  ];
  for (const page of pages) {
    const rendered = `${page.seoTitle} | Experrt`;
    assert.ok(rendered.length <= 60, `${page.seoTitle} is ${rendered.length}`);
    assert.ok(page.meta.length <= 155, page.seoTitle);
    assert.ok(!/[\u2013\u2014]/.test(page.seoTitle + page.meta + page.h1));
    assert.ok(!page.meta.includes("+ VAT"), page.seoTitle);
  }
});

test("comparison pages show Experrt's final price with no VAT added", () => {
  for (const page of COMPARISON_PAGES) {
    for (const row of page.rows) {
      const [course, provider, price] = row;
      if (provider === "Experrt") {
        assert.doesNotMatch(price, /\+ VAT|plus VAT|including VAT|exc\. VAT/i, `${course} ${price}`);
        assert.match(price, /£\d+/);
      }
      assert.doesNotMatch(price, /PRE-PUBLISH/);
    }
  }
});

test("every SEO override includes the course price and no dashes", () => {
  for (const [slug, meta] of Object.entries(SEO_OVERRIDES)) {
    assert.ok(meta.title.includes("£"), slug);
    assert.ok(meta.description.includes("£"), slug);
    assert.ok(!/[\u2013\u2014]/.test(meta.title + meta.description), slug);
  }
});
