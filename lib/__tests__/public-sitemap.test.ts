import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildPublicSitemap,
  isLoginOnlyPath,
} from "../public-sitemap.ts";
import { FALLBACK_PUBLISHED_COURSE_SLUGS } from "../published-course-slugs.ts";
import { getPublishedInsights } from "../insights/catalog.ts";
import { getPublicSiteUrl } from "../site.ts";

test("public sitemap lists marketing, courses, and published insights only", () => {
  const baseUrl = "https://www.experrt.com";
  const entries = buildPublicSitemap({
    baseUrl,
    courseSlugs: [...FALLBACK_PUBLISHED_COURSE_SLUGS],
    lastModified: new Date("2026-08-21T00:00:00Z"),
  });
  const urls = entries.map((e) => e.url);

  for (const required of [
    `${baseUrl}/`,
    `${baseUrl}/courses`,
    `${baseUrl}/contact`,
    `${baseUrl}/about`,
    `${baseUrl}/insights`,
  ]) {
    assert.ok(urls.includes(required.replace(/\/$/, "") || `${baseUrl}/`) || urls.includes(required), required);
  }

  // Homepage is stored as origin with no trailing path.
  assert.ok(urls.includes(baseUrl));

  for (const slug of FALLBACK_PUBLISHED_COURSE_SLUGS) {
    assert.ok(urls.includes(`${baseUrl}/courses/${slug}`), slug);
  }
  for (const article of getPublishedInsights()) {
    assert.ok(urls.includes(`${baseUrl}/insights/${article.slug}`), article.slug);
  }

  for (const url of urls) {
    const path = new URL(url).pathname;
    assert.equal(isLoginOnlyPath(path), false, url);
  }

  assert.equal(urls.some((url) => url.includes("/blog")), false);
  assert.equal(urls.some((url) => url.includes("/login")), false);
  assert.equal(urls.some((url) => url.includes("/dashboard")), false);
});

test("getPublicSiteUrl prefers www.experrt.com", () => {
  assert.equal(getPublicSiteUrl(), "https://www.experrt.com");
});
