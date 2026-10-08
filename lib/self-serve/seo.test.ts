import { test } from "node:test";
import assert from "node:assert/strict";
import { allSelfServeCourses, courseMetaTitle, courseMetaDescription } from "./seo.ts";

for (const course of allSelfServeCourses()) {
  test(`meta for ${course.slug}`, () => {
    const title = courseMetaTitle(course);
    const description = courseMetaDescription(course);
    assert.ok(`${title} | Experrt`.length <= 60, `rendered title too long: ${title}`);
    assert.ok(description.length <= 155, `description too long: ${description}`);
    assert.ok(description.includes(`£${course.priceGbp}`), `description lacks the price: ${description}`);
    assert.ok(title.includes(`£${course.priceGbp}`), `title lacks the price: ${title}`);
    assert.ok(!/[\u2013\u2014]/.test(title + description), "no en or em dashes");
  });
}
