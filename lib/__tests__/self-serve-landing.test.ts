import { test } from "node:test";
import assert from "node:assert/strict";

import { getSelfServeCourse } from "../self-serve/catalog.ts";
import { getCourseLanding } from "../self-serve/landing.ts";

test("the playable course landing cites published salary and hiring figures", () => {
  const course = getSelfServeCourse("prompt-engineering-for-professional-work");
  assert.ok(course);
  const landing = getCourseLanding(course);
  const values = landing.stats.map((stat) => stat.value).join(" ");
  assert.match(values, /34\.2%/);
  assert.match(values, /180,000/);
  assert.match(values, /£92,500/);
  assert.equal(landing.reviews.length, 6);
  assert.ok(landing.jobs.some((job) => job.title === "AI Prompt Engineer"));
  assert.ok(landing.sources.some((source) => source.href.includes("pwc.co.uk")));
  assert.ok(landing.sources.some((source) => source.href.includes("roberthalf.com")));
});

test("a course outside the AI track shows its own benefits, and no reviews or AI salary bands", () => {
  const course = getSelfServeCourse("robotics-for-non-engineers");
  assert.ok(course);
  const landing = getCourseLanding(course);
  assert.ok(landing.stats.length >= 2);
  assert.match(landing.hook, /judgement/i);
  assert.equal(landing.reviews.length, 0);
  assert.equal(landing.jobs.length, 0);
  assert.equal(landing.benefits.length, 3);
});

test("landing copy is written in full sentences without banned words or dashes", () => {
  for (const slug of ["prompt-engineering-for-professional-work", "robotics-for-non-engineers"]) {
    const course = getSelfServeCourse(slug);
    assert.ok(course);
    const landing = getCourseLanding(course);
    const text = [landing.hook, ...landing.benefits.flatMap((b) => [b.body])].join(" ");
    assert.doesNotMatch(text, /[\u2014\u2013]/);
    assert.doesNotMatch(text, /\b(delve|unlock|empower|leverage|seamless|robust|landscape|journey)\b/i);
    for (const body of landing.benefits.map((b) => b.body)) assert.match(body.trim(), /\.$/);
  }
});
