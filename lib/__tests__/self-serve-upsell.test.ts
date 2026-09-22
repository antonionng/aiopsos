import { test } from "node:test";
import assert from "node:assert/strict";

import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";
import { courseEmailUrl, recommendCourses } from "../self-serve/upsell.ts";

const prompt = "prompt-engineering-for-professional-work";

test("suggestions never include the course itself or one the learner owns", () => {
  const owned = SELF_SERVE_COURSES.filter((c) => c.track === "ai").slice(0, 2).map((c) => c.slug);
  const picks = recommendCourses(prompt, owned);
  assert.equal(picks.length, 3);
  for (const pick of picks) {
    assert.notEqual(pick.slug, prompt);
    assert.ok(!owned.includes(pick.slug), `${pick.slug} is already owned`);
  }
});

test("suggestions start with the same track", () => {
  for (const course of SELF_SERVE_COURSES) {
    const [first] = recommendCourses(course.slug);
    const match = SELF_SERVE_COURSES.find((c) => c.slug === first.slug);
    assert.equal(match?.track, course.track, `${course.slug} should suggest its own track first`);
  }
});

test("a suggestion line is one full sentence", () => {
  for (const pick of recommendCourses(prompt, [], 10)) {
    assert.match(pick.line, /^[A-Z].+[.!?]$/);
    assert.ok(pick.line.length < 320, pick.slug);
  }
});

test("an unknown or missing course still gets suggestions", () => {
  assert.equal(recommendCourses(null).length, 3);
  assert.equal(recommendCourses("not-a-course").length, 3);
});

test("owning everything leaves nothing to suggest", () => {
  const all = SELF_SERVE_COURSES.map((c) => c.slug);
  assert.deepEqual(recommendCourses(prompt, all), []);
});

test("email links carry campaign tags", () => {
  assert.equal(
    courseEmailUrl("https://www.experrt.com/", "x", "receipt"),
    "https://www.experrt.com/learn/x?utm_source=email&utm_medium=email&utm_campaign=receipt"
  );
});

test("final work reads after 'your'", async () => {
  const { workNoun } = await import("../self-serve/upsell.ts");
  assert.equal(workNoun("The prompt card"), "prompt card");
  assert.equal(workNoun("The AI literacy plan"), "AI literacy plan");
  assert.equal(workNoun("The 30-day plan"), "30-day plan");
  assert.equal(workNoun(null), "final work");
});
