import { test } from "node:test";
import assert from "node:assert/strict";
import { ARTICLE4_PAGE, COMPARISON_PAGES, EXPERRT_VAT_NOTE, ROLE_PAGES } from "./landers.ts";
import { HR_COMPARE, LITERACY_COMPARE, ROLE_LINKS, otherRoleLinks } from "./role-links.ts";
import { SEO_OVERRIDES } from "./seo-overrides.ts";
import { getSelfServeCourseMeta } from "./catalog-meta.ts";
import { itemListLd } from "./seo.ts";

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
  assert.equal(EXPERRT_VAT_NOTE, "No VAT to add");
  assert.ok(!/[\u2013\u2014]/.test(EXPERRT_VAT_NOTE));
  for (const page of COMPARISON_PAGES) {
    const experrtRows = page.rows.filter((row) => row[1] === "Experrt");
    assert.ok(experrtRows.length > 0, page.slug);
    for (const row of page.rows) {
      const [course, provider, price] = row;
      if (provider === "Experrt") {
        assert.match(price, /^£(99|129)$/, `${course} ${price}`);
        assert.equal(EXPERRT_VAT_NOTE, "No VAT to add", `${page.slug} ${course}`);
        assert.ok(!/[\u2013\u2014]/.test(`${price} ${EXPERRT_VAT_NOTE}`));
      }
      assert.doesNotMatch(price, /PRE-PUBLISH/);
    }
  }
  const literacy = COMPARISON_PAGES.find((page) => page.slug === "ai-literacy-courses-uk");
  const hr = COMPARISON_PAGES.find((page) => page.slug === "ai-courses-for-hr-uk");
  assert.ok(literacy?.rows.some((row) => row[2] === "£90 + VAT"));
  assert.ok(literacy?.rows.some((row) => row[2] === "From £750 + VAT"));
  assert.ok(literacy?.rows.some((row) => row[2] === "From €50 per participant, excl. VAT"));
  assert.ok(hr?.rows.some((row) => row[2].includes("exc. VAT")));
});

test("role landers all have inbound link copy and cross-links", () => {
  assert.equal(ROLE_LINKS.length, 6);
  for (const page of ROLE_PAGES) {
    const link = ROLE_LINKS.find((item) => item.slug === page.slug);
    assert.ok(link, page.slug);
    assert.equal(link?.path, page.path);
    assert.ok(link?.label.startsWith("Courses for "));
    assert.ok(!/[\u2013\u2014]/.test(link!.label));
    const others = otherRoleLinks(page.slug);
    assert.equal(others.length, 5);
    assert.ok(others.every((item) => item.slug !== page.slug));
  }
  assert.equal(HR_COMPARE.path, "/learn/compare/ai-courses-for-hr-uk");
  assert.equal(LITERACY_COMPARE.path, "/learn/compare/ai-literacy-courses-uk");
  assert.ok(!/[\u2013\u2014]/.test(HR_COMPARE.label + LITERACY_COMPARE.label));
  assert.doesNotMatch(HR_COMPARE.label + LITERACY_COMPARE.label, /VAT/i);
});

test("Article 4 ItemList lists the four linked courses by name and url only", () => {
  const items = ARTICLE4_PAGE.sections.flatMap((section) =>
    "courses" in section && section.courses
      ? section.courses.map(([slug]) => {
          const course = getSelfServeCourseMeta(slug);
          assert.ok(course, slug);
          return { name: course!.title, url: `/learn/${slug}` };
        })
      : [],
  );
  assert.equal(items.length, 4);
  const data = itemListLd(items);
  assert.equal(data["@type"], "ItemList");
  const encoded = JSON.stringify(data);
  assert.doesNotMatch(encoded, /Review|AggregateRating|ratingValue/);
  for (const item of data.itemListElement) {
    assert.equal(item["@type"], "ListItem");
    assert.ok(item.name);
    assert.match(item.url, /^https:\/\/www\.experrt\.com\/learn\//);
    assert.equal("item" in item, false);
  }
});

test("every SEO override includes the course price and no dashes", () => {
  for (const [slug, meta] of Object.entries(SEO_OVERRIDES)) {
    assert.ok(meta.title.includes("£"), slug);
    assert.ok(meta.description.includes("£"), slug);
    assert.ok(!/[\u2013\u2014]/.test(meta.title + meta.description), slug);
  }
});
