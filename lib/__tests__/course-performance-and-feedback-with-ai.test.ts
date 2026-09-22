import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/performance-and-feedback-with-ai.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "the-draft-that-invents":
    "You arrived after 9am on four days in the last two weeks, and you missed the start of two briefings. I would like to understand what has been happening. What have the mornings been like for you recently?",
  "what-would-change-your-view":
    "Purpose: to understand what gets in the way of the monthly report.\nWhat I will listen for: late data from another team, or a clashing deadline.\nNext step: agree one change and check in after the next report.",
};

const WRONG_EDITS: Record<string, string[]> = {
  "the-draft-that-invents": [
    "I would like to understand what has been happening. What have the mornings been like for you recently?",
    "You arrived after 9am on four days in the last two weeks, and you missed the start of two briefings. I would like to understand the mornings. Can we talk about it?",
    "You arrived after 9am on four days in the last two weeks, and you missed the start of two briefings. What have the mornings been like for you recently?",
  ],
  "what-would-change-your-view": [
    "What I will listen for: late data from another team.\nNext step: agree one change and check in next week.",
    "Purpose: the monthly report.\nWhat I will listen for: whether they have a good excuse.\nNext step: agree one change and check in after the next report.",
    "Purpose: the monthly report.\nWhat I will listen for: late data from another team.\nNext step: it has to stop.",
  ],
};

const STRONG_SHEET: BuildAnswer = {
  purpose: "To understand what is getting in the way of the monthly report and agree what would help.",
  seen: "The report was sent after the 5th in March and April, and finance chased it twice in April.",
  question: "What happens in the week before the report is due?",
  listen: "Late data from another team, a clashing deadline, or something outside work.",
  next: "Agree one change to how the report is put together and check in on Friday 14 November.",
  model: "The wording of the first question and the order of the agenda.",
  decided:
    "I have decided this is an informal conversation. I have not decided whether there is a concern until I have heard their view.",
};

function lessonFor(check: LessonCheck) {
  return COURSE.lessons.find((lesson) => lesson.check === check || lesson.practice.check === check);
}

function correctAnswer(check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
    case "edit": {
      const lesson = lessonFor(check)!;
      return { edited: GOOD_EDITS[lesson.id] };
    }
    case "build":
      return STRONG_SHEET;
  }
}

function allChecks() {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ]);
}

test("every check passes with its correct answer", () => {
  for (const { name, check } of allChecks()) {
    const answer = correctAnswer(check);
    assert.ok(answerComplete(check, answer), `${name} answer should be complete`);
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, true, `${name}: ${outcome.detail}`);
  }
});

test("mark checks fail when any one sentence is marked wrongly", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "mark") continue;
    for (const sentence of check.sentences) {
      const answer = correctAnswer(check) as Record<string, string>;
      answer[sentence.id] = sentence.fail ? "pass" : "fail";
      const outcome = evaluateCheck(check, answer);
      assert.equal(outcome.passed, false, `${name} ${sentence.id}`);
      assert.ok(outcome.detail.includes(sentence.why));
    }
  }
});

test("choose checks fail with the weaker piece of work and carry feedback", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "choose") continue;
    assert.ok(check.why && check.wrong, `${name} needs why and wrong`);
    const outcome = evaluateCheck(check, check.correct === "left" ? "right" : "left");
    assert.equal(outcome.passed, false, name);
    assert.equal(outcome.detail, check.wrong);
  }
});

test("edit checks fail on the unchanged start and on each missing part", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "edit") continue;
    const lesson = lessonFor(check)!;
    assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${name} unchanged`);
    assert.equal(evaluateCheck(check, { edited: check.start }).detail, check.unchanged);
    const wrongs = WRONG_EDITS[lesson.id];
    assert.ok(wrongs?.length, `${name} needs wrong edits`);
    for (const edited of wrongs) {
      assert.equal(evaluateCheck(check, { edited }).passed, false, `${name}: ${edited}`);
    }
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark near eighty per cent", () => {
  const lesson = COURSE.lessons[COURSE.lessons.length - 2];
  const check = lesson.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark && check.passMark < check.questions.length);
  assert.ok(check.passMark / check.questions.length >= 0.75);
  for (const question of check.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 20, option.id);
  }
  const positions = new Set(check.questions.map((q) => q.options.findIndex((o) => o.correct)));
  assert.ok(positions.size >= 3, "vary the position of the right option");

  const misses = check.questions.length - check.passMark + 1;
  const answer = correctAnswer(check) as Record<string, string>;
  check.questions.slice(0, misses).forEach((q) => {
    answer[q.id] = q.options.find((o) => !o.correct)!.id;
  });
  assert.equal(evaluateCheck(check, answer).passed, false);

  const oneMiss = correctAnswer(check) as Record<string, string>;
  const first = check.questions[0];
  oneMiss[first.id] = first.options.find((o) => !o.correct)!.id;
  assert.equal(evaluateCheck(check, oneMiss).passed, true);
});

test("the final lesson is the artefact build and every field is checked for substance", () => {
  const lesson = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(lesson.id, COURSE.artefact.lessonId);
  const check = lesson.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.equal(evaluateCheck(check, STRONG_SHEET).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const weak = { ...STRONG_SHEET, [field.id]: "zzzz zzzz zzzz zzzz zzzz zzzz zzzz zzzz zzzz zzzz" };
    const outcome = evaluateCheck(check, weak);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
});

test("every lesson has the full shape", () => {
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, section.heading);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 20, lesson.id);
  }
});

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const BANNED = [
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

test("no string contains a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text}`);
    }
  }
});
