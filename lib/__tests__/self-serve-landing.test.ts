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

test("an unopened course still shows the market, and does not invent a full review set", () => {
  const course = getSelfServeCourse("robotics-for-non-engineers");
  assert.ok(course);
  const landing = getCourseLanding(course);
  assert.ok(landing.stats.length >= 2);
  assert.match(landing.hook, /brief/i);
});
