import { test } from "node:test";
import assert from "node:assert/strict";

import { PROMPT_ENGINEERING_LESSONS } from "../self-serve/prompt-engineering.ts";
import {
  canOpenLesson,
  canSign,
  certificateRef,
  checksPassed,
  evaluateCheck,
  emptyProgress,
} from "../self-serve/engine.ts";
import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";
import type { CourseProgress } from "../self-serve/types.ts";

const lessons = PROMPT_ENGINEERING_LESSONS;

test("the catalogue has forty courses and one playable pilot", () => {
  assert.equal(SELF_SERVE_COURSES.length, 40);
  assert.equal(new Set(SELF_SERVE_COURSES.map((course) => course.slug)).size, 40);
  for (const track of ["ai", "technology", "robotics", "hr"] as const) {
    assert.equal(SELF_SERVE_COURSES.filter((course) => course.track === track).length, 10);
  }
  assert.equal(
    SELF_SERVE_COURSES.filter((course) => course.playable).map((course) => course.slug).join(","),
    "prompt-engineering-for-professional-work"
  );
});

test("a later lesson stays locked until the previous check passes", () => {
  const progress = emptyProgress();
  assert.equal(canOpenLesson(lessons, progress, 0), true);
  assert.equal(canOpenLesson(lessons, progress, 1), false);
  progress.lessons[lessons[0].id] = { passed: true, answer: {} };
  assert.equal(canOpenLesson(lessons, progress, 1), true);
  assert.equal(canOpenLesson(lessons, progress, 2), false);
});

test("marking rejects an invented commitment that was waved through", () => {
  const check = lessons[0].check;
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  const wrong = evaluateCheck(check, {
    thanks: "pass",
    weeks: "pass",
    discount: "fail",
  });
  assert.equal(wrong.passed, false);
  assert.match(wrong.detail, /invented/i);

  const right = evaluateCheck(check, {
    thanks: "pass",
    weeks: "fail",
    discount: "fail",
  });
  assert.equal(right.passed, true);
});

test("the thin brief is not the one a colleague can run", () => {
  const check = lessons[1].check;
  const missed = evaluateCheck(check, "left");
  assert.equal(missed.passed, false);
  const chosen = evaluateCheck(check, "right");
  assert.equal(chosen.passed, true);
});

test("the repair has to be read, named, added, then checked", () => {
  const check = lessons[2].check;
  assert.equal(evaluateCheck(check, ["add", "read", "name", "check"]).passed, false);
  assert.equal(evaluateCheck(check, ["read", "name", "add", "check"]).passed, true);
});

test("a prompt card with empty lines does not pass", () => {
  const check = lessons[3].check;
  const thin = evaluateCheck(check, {
    role: "manager",
    context: "the pilot",
    constraints: "be careful",
    output: "a reply",
  });
  assert.equal(thin.passed, false);
  const full = evaluateCheck(check, {
    role: "Account manager for this client",
    context: "The pilot ends Friday and no extension has been agreed.",
    constraints: "Do not invent a price, a date, or a prior promise.",
    output: "Four lines: thanks, status, ask, next step.",
  });
  assert.equal(full.passed, true);
});

test("the certificate waits until every check has passed and the card is signed", () => {
  const progress: CourseProgress = { lessons: {} };
  assert.equal(canSign(lessons, progress, "Antonio"), false);
  for (const lesson of lessons) {
    progress.lessons[lesson.id] = { passed: true, answer: {} };
  }
  assert.equal(checksPassed(lessons, progress), true);
  assert.equal(canSign(lessons, progress, "A"), false);
  assert.equal(canSign(lessons, progress, "Antonio"), true);
  const ref = certificateRef("Antonio", "2026-09-21T18:00:00.000Z");
  assert.match(ref, /^EX[0-9A-Z]{6,8}$/);
});
