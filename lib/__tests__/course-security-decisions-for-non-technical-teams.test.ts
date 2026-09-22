import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/security-decisions-for-non-technical-teams.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lessonById(id: string) {
  const lesson = lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function markAnswer(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(
    check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"])
  ) as MarkAnswer;
}

function assertMark(check: LessonCheck, where: string) {
  assert.equal(check.kind, "mark", where);
  if (check.kind !== "mark") return;
  const right = markAnswer(check);
  assert.ok(answerComplete(check, right), where);
  assert.equal(evaluateCheck(check, right).passed, true, where);
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
    assert.equal(evaluateCheck(check, wrong).passed, false, `${where}: ${sentence.id}`);
  }
}

function assertChoose(check: LessonCheck, where: string) {
  assert.equal(check.kind, "choose", where);
  if (check.kind !== "choose") return;
  assert.ok(check.why && check.wrong, `${where} needs why and wrong`);
  const other = check.correct === "left" ? "right" : "left";
  assert.equal(evaluateCheck(check, check.correct).passed, true, where);
  assert.equal(evaluateCheck(check, other).passed, false, where);
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => allStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => allStrings(item, out));
  return out;
}

test("the course has seven lessons with the full lesson shape", () => {
  assert.equal(COURSE.slug, "security-decisions-for-non-technical-teams");
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title.toLowerCase().includes(lesson.emphasis.toLowerCase()), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("lesson 1 marks named and shared access", () => {
  const lesson = lessonById("what-you-actually-share");
  assertMark(lesson.practice.check, "practice");
  assertMark(lesson.check, "check");
});

test("lesson 2 marks serious harm and nuisance", () => {
  const lesson = lessonById("what-would-hurt");
  assertMark(lesson.practice.check, "practice");
  assertMark(lesson.check, "check");
});

test("lesson 3 checks by another route", () => {
  const lesson = lessonById("how-it-usually-goes-wrong");
  assertMark(lesson.practice.check, "practice");
  assertChoose(lesson.check, "check");
});

test("lesson 4 tells a change for this week from a project for later", () => {
  const lesson = lessonById("three-changes-this-week");
  assertChoose(lesson.practice.check, "practice");
  assertMark(lesson.check, "check");
});

test("lesson 5 repairs an exposure list row", () => {
  const lesson = lessonById("repair-an-exposure-list");
  assertChoose(lesson.practice.check, "practice");
  const check = lesson.check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;

  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(answerComplete(check, { edited: check.start }), false);

  const good =
    "What is shared: the bank portal login. Who can get in: Nadia Brooks and Maria Costa on one login. Worst realistic outcome: a payment made to the wrong account with no way to tell who made it. The change: give each of them their own login and turn on two-step verification. Owner: Nadia Brooks, by Friday.";
  assert.equal(evaluateCheck(check, { edited: good }).passed, true);

  const withoutEach: Record<string, string> = {
    portal:
      "What is shared: the payments login. Who can get in: Nadia Brooks and Maria Costa. Worst realistic outcome: a payment made to the wrong account. The change: give each their own login. Owner: Nadia Brooks, by Friday.",
    who: "Bank portal login. Worst realistic outcome: a payment made to the wrong account. The change: give each person their own login. Owner: Priya, by Friday.",
    outcome:
      "Bank portal login. Who can get in: Nadia Brooks and Maria Costa. The change: give each their own login. Owner: Nadia Brooks, by Friday.",
    change:
      "Bank portal login. Who can get in: Nadia Brooks and Maria Costa. Worst realistic outcome: a payment made to the wrong account. Owner: Nadia Brooks, by Friday.",
    owner:
      "Bank portal login. Who can get in: Nadia Brooks and Maria Costa. Worst realistic outcome: a payment made to the wrong account. The change: give each their own login, by Friday.",
    date:
      "Bank portal login. Who can get in: Nadia Brooks and Maria Costa. Worst realistic outcome: a payment made to the wrong account. The change: give each their own login. Owner: Nadia Brooks, soon.",
  };
  for (const [part, edited] of Object.entries(withoutEach)) {
    assert.equal(evaluateCheck(check, { edited }).passed, false, `missing ${part} should fail`);
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark", () => {
  const lesson = lessons[lessons.length - 2];
  assertChoose(lesson.practice.check, "practice");
  const check = lesson.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  assert.ok(check.passMark / check.questions.length >= 0.74 && check.passMark / check.questions.length <= 0.86);

  const right: Record<string, string> = {};
  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    const correct = question.options.filter((option) => option.correct);
    assert.equal(correct.length, 1, question.id);
    positions.add(question.options.indexOf(correct[0]));
    for (const option of question.options) assert.ok(option.feedback.length > 0, `${question.id}.${option.id}`);
    right[question.id] = correct[0].id;
  }
  assert.ok(positions.size >= 3, "vary the position of the right option");
  assert.ok(answerComplete(check, right));
  assert.equal(evaluateCheck(check, right).passed, true);

  const below = { ...right };
  const misses = check.questions.length - check.passMark + 1;
  for (const question of check.questions.slice(0, misses)) {
    below[question.id] = question.options.find((option) => !option.correct)!.id;
  }
  assert.equal(evaluateCheck(check, below).passed, false);
});

test("the final lesson is the artefact build and every part is checked", () => {
  const lesson = lessons[lessons.length - 1];
  assert.equal(lesson.id, COURSE.artefact.lessonId);
  assertMark(lesson.practice.check, "practice");
  const check = lesson.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;

  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }

  const strong: Record<string, string> = {
    shared:
      "1. The payroll system login. 2. The client folder on the shared drive, set to anyone with the link. 3. The CRM, where two leavers' accounts are active.",
    who: "1. Two administrators on one login. 2. Anyone sent the link, including a former manager. 3. Two sales staff who left in May.",
    outcome:
      "1. Salary paid to the wrong bank account. 2. Client contact details seen outside the firm. 3. Client records exported by a former employee.",
    change:
      "1. Give each administrator their own login and turn on two-step verification. 2. Share with the three account managers by name. 3. Remove both leavers' accounts.",
    owner: "1. Aisha Khan, by Thursday. 2. Tom Hughes, by Wednesday. 3. Aisha Khan, by Friday.",
    later:
      "The office radio login is a nuisance. A password manager is a project for later, awaiting a decision from the finance director.",
  };
  assert.ok(answerComplete(check, strong));
  assert.equal(evaluateCheck(check, strong).passed, true);

  const thin = "Nothing further to add here at all.";
  for (const field of check.fields) {
    const answer = { ...strong, [field.id]: thin };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, `${field.id} should fail without substance`);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
  assert.equal(evaluateCheck(check, { ...strong, owner: "IT and the team, soon when possible." }).passed, false);
});

test("the course contains no dashes and none of the banned words", () => {
  const banned = [
    "delve",
    "unlock",
    "unleash",
    "empower",
    "elevate",
    "leverage",
    "harness",
    "supercharge",
    "seamless",
    "robust",
    "cutting-edge",
    "landscape",
    "realm",
    "tapestry",
    "journey",
    "game-changer",
    "deep dive",
    "dive into",
    "it's important to note",
    "in today's",
  ];
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    assert.ok(!text.includes("!"), `exclamation mark in: ${text.slice(0, 80)}`);
    for (const word of banned) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
