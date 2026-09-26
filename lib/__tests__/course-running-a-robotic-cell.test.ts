import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/running-a-robotic-cell.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "what-normal-looks-like":
    "Normal for Cell 4: cycle 42 to 45 seconds a part. One to three stops a shift, usually a blank not seated on the infeed. A smooth whirr and a single click as the chuck closes.",
  "the-log-entry":
    "11:20, third 'gripper failed to close' stop this shift. Called Sam, shift engineer, at 11:22, and he adjusted the infeed guide. Cell running normally at handover.",
};

const STRONG_CARD: Record<string, string> = {
  start:
    "Read the log and the handover; walk the guarding and light curtains; confirm the emergency stops are clear; check wire and gas; confirm the program; run one frame and check it before running at rate.",
  normal:
    "Cycle 95 to 100 seconds; two to four stops a shift, mostly a part not seated; a steady hiss from the torch and a clean bead you can see.",
  recover:
    "Read the message and note the time; look from outside for the cause; clear it as the procedure allows; check nobody is inside and the gates are closed; reset; watch the next cycle.",
  escalate:
    "Escalate on the 3rd repeat of any stop, any damage, any program or safety setting change, any unexpected motion, or a message you do not understand. Call the shift engineer on days and nights.",
  handover:
    "The time, what happened, what you did and who you told, and the state of the cell at handover.",
  procedure: "SOP-WLD-07",
};

const THIN_CARD: Record<string, string> = {
  start:
    "walk the guarding and light curtains, confirm the emergency stops, check wire and gas, confirm the program, run one frame.",
  normal: "it runs well most of the time and sounds about right on a good day for us all.",
  recover:
    "read the message, look from outside for the cause, clear it as allowed, check nobody is inside, then carry on.",
  escalate:
    "escalate if it keeps stopping or anything is damaged, and call the shift engineer on days and on nights.",
  handover: "the time, what happened, what you did and who you told about it.",
  procedure: "ask around",
};

function correctAnswer(check: LessonCheck, lessonId: string): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
    case "choose":
      return check.correct;
    case "order":
      return [...check.correct];
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
    case "edit":
      assert.ok(GOOD_EDITS[lessonId], `no good edit written for ${lessonId}`);
      return { edited: GOOD_EDITS[lessonId] };
    case "build":
      return { ...STRONG_CARD };
  }
}

function wrongAnswer(check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(
        check.sentences.map((s, i) => [s.id, (i === 0 ? !s.fail : s.fail) ? "fail" : "pass"])
      );
    case "choose":
      return check.correct === "left" ? "right" : "left";
    case "order":
      return [...check.correct].reverse();
    case "scenario": {
      const needed = check.passMark ?? check.questions.length;
      const wrongCount = check.questions.length - needed + 1;
      return Object.fromEntries(
        check.questions.map((q, i) => [
          q.id,
          q.options.find((o) => (i < wrongCount ? !o.correct : o.correct))!.id,
        ])
      );
    }
    case "edit":
      return { edited: check.start };
    case "build":
      return {};
  }
}

for (const lesson of COURSE.lessons) {
  for (const [where, check] of [
    ["practice", lesson.practice.check],
    ["check", lesson.check],
  ] as const) {
    test(`${lesson.id} ${where}: the right answer passes and a wrong one fails`, () => {
      const right = correctAnswer(check, lesson.id);
      assert.ok(answerComplete(check, right), "right answer should be complete");
      const pass = evaluateCheck(check, right);
      assert.equal(pass.passed, true, pass.detail);
      const fail = evaluateCheck(check, wrongAnswer(check));
      assert.equal(fail.passed, false);
      assert.ok(fail.detail.length > 0);
    });
  }
}

test("each edit fails when any required part is left out", () => {
  const normal = COURSE.lessons.find((l) => l.id === "what-normal-looks-like")!.practice.check;
  assert.equal(normal.kind, "edit");
  for (const text of [
    "Normal for Cell 4: one to three stops a shift. A single click as the chuck closes.",
    "Normal for Cell 4: cycle 42 to 45 seconds. A single click as the chuck closes.",
    "Normal for Cell 4: cycle 42 to 45 seconds. One to three stops a shift.",
    "Cycle 42 to 45 seconds. One to three stops a shift. A single click as the chuck closes.",
  ]) {
    assert.equal(evaluateCheck(normal, { edited: text }).passed, false, text);
  }
  const log = COURSE.lessons.find((l) => l.id === "the-log-entry")!.practice.check;
  assert.equal(log.kind, "edit");
  for (const text of [
    "Third gripper failed to close stop. Called Sam, shift engineer. Cell running normally at handover.",
    "11:20, gripper playing up. Called Sam, shift engineer. Cell running normally at handover.",
    "11:20, gripper failed to close stop. Cell running normally at handover.",
    "11:20, gripper failed to close stop. Called Sam, shift engineer.",
    "11:20, infeed stop. Called Sam, shift engineer. Cell running normally at handover.",
  ]) {
    assert.equal(evaluateCheck(log, { edited: text }).passed, false, text);
  }
});

test("the final lesson is the build artefact, and each ruled part is checked", () => {
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.id, COURSE.artefact.lessonId);
  const check = last.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.equal(evaluateCheck(check, STRONG_CARD).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const answer = { ...STRONG_CARD, [field.id]: THIN_CARD[field.id] };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, `${field.id} should fail when missing its part`);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark near eighty per cent", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  const ratio = check.passMark / check.questions.length;
  assert.ok(ratio >= 0.74 && ratio <= 0.88, String(ratio));
  for (const question of check.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4);
  }
  const positions = new Set(
    check.questions.map((q) => q.options.findIndex((o) => o.correct))
  );
  assert.ok(positions.size >= 3, "vary where the right option sits");
});

test("every lesson has its parts, and the emphasis word is in the title", () => {
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.bridge.length > 0);
  }
});

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => allStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => allStrings(item, out));
  return out;
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

test("no string in the course uses a dash or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/[\u2018\u2019]/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text}`);
    }
  }
});
