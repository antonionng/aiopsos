import { test } from "node:test";
import assert from "node:assert/strict";

import { SELF_SERVE_COURSES, getSelfServeCourse } from "../self-serve/catalog.ts";
import { courseCurriculum, getCourseLanding } from "../self-serve/landing.ts";

const AI_ONLY = /34\.2%|£92,500/;

test("the Prompt Engineering landing cites salary figures and AI roles", () => {
  const course = getSelfServeCourse("prompt-engineering-for-professional-work");
  assert.ok(course);
  const landing = getCourseLanding(course);
  assert.equal(landing.stats.length, 3);
  assert.equal("reviews" in landing, false);
  assert.ok(landing.jobs.some((job) => job.title === "AI Prompt Engineer"));
  assert.ok(landing.sources.some((source) => source.href.includes("roberthalf.com")));
});

test("every course shows three sourced market figures of its own", () => {
  for (const course of SELF_SERVE_COURSES) {
    const landing = getCourseLanding(course);
    assert.equal(landing.stats.length, 3, `${course.slug} needs three figures`);
    for (const stat of landing.stats) {
      assert.match(stat.href, /^https:\/\//, `${course.slug} ${stat.value} needs a source link`);
      assert.ok(stat.line.length <= 80, `${course.slug} ${stat.value} line is too long`);
      assert.match(stat.line.trim(), /\.$/);
      assert.ok(
        landing.sources.some((source) => source.href === stat.href),
        `${course.slug} must list the source for ${stat.value}`
      );
    }
    if (course.track !== "ai") {
      assert.doesNotMatch(
        landing.stats.map((stat) => stat.value).join(" "),
        AI_ONLY,
        `${course.slug} should not show AI salary figures`
      );
      assert.equal(landing.jobs.length, 0);
    }
  }
});

test("no two courses in a track share the same three figures", () => {
  const seen = new Map<string, string>();
  for (const course of SELF_SERVE_COURSES) {
    const key = `${course.track}:${getCourseLanding(course)
      .stats.map((stat) => stat.value + stat.line)
      .sort()
      .join("|")}`;
    assert.ok(!seen.has(key), `${course.slug} repeats the figures of ${seen.get(key)}`);
    seen.set(key, course.slug);
  }
});

test("the curriculum names every lesson, the assessment, and the final work", () => {
  for (const course of SELF_SERVE_COURSES) {
    const items = courseCurriculum(course);
    assert.equal(items.length, course.lessons?.length);
    assert.equal(items.filter((item) => item.kind === "final").length, 1, `${course.slug} final work`);
    assert.ok(items.some((item) => item.kind === "assessment"), `${course.slug} assessment`);
    for (const item of items) {
      assert.ok(item.covers.length > 0, `${course.slug} ${item.title} covers nothing`);
      assert.match(item.task, /^You .+\.$/);
    }
  }
});

test("landing copy is written in full sentences without banned words or dashes", () => {
  for (const course of SELF_SERVE_COURSES) {
    const landing = getCourseLanding(course);
    const text = [
      landing.hook,
      ...landing.benefits.flatMap((b) => [b.title, b.body]),
      ...landing.stats.flatMap((s) => [s.line, s.label]),
    ].join(" ");
    assert.doesNotMatch(text, /[\u2014\u2013]/, course.slug);
    assert.doesNotMatch(
      text,
      /\b(delve|unlock|unleash|elevate|empower|supercharge|leverage|seamless|robust|landscape|journey|harness|revolutionise|transformative)\b/i,
      course.slug
    );
    for (const body of landing.benefits.map((b) => b.body)) assert.match(body.trim(), /\.$/);
  }
});

test("every course page explains the course, its audience, takeaways, and each lesson", async () => {
  const { COURSE_SALES } = await import("../self-serve/sales-copy.ts");
  for (const course of SELF_SERVE_COURSES) {
    const sales = COURSE_SALES[course.slug];
    assert.ok(sales, `${course.slug} has no sales copy`);
    assert.ok(sales.overview.length >= 2, course.slug);
    assert.ok(sales.audience.length >= 3, course.slug);
    assert.ok(sales.takeaways.length >= 4, course.slug);
    assert.equal(sales.benefits.length, 3, course.slug);
    for (const lesson of course.lessons ?? []) {
      assert.ok(sales.lessons[lesson.id], `${course.slug} ${lesson.id} has no summary`);
    }
    const text = [...sales.overview, ...sales.audience, ...sales.takeaways, ...Object.values(sales.lessons)].join(" ");
    assert.doesNotMatch(text, /[\u2014\u2013]/, course.slug);
    for (const sentence of [...sales.audience, ...sales.takeaways]) assert.match(sentence.trim(), /\.$/);
  }
});
