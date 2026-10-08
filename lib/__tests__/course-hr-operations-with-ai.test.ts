import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/hr-operations-with-ai.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "what-goes-into-the-tool":
    "Step 3: the HR administrator pastes only the job title, new hours, new pay, and effective date into the approved assistant, with [Employee name] as a placeholder, and asks it to draft the variation letter. Do not paste the reason for the change, the National Insurance number, or bank details.\nStep 4: the HR administrator compares the letter with the change form before it is sent.",
  "the-step-a-person-keeps":
    "Step 1: the hiring manager's approved offer form arrives.\nStep 2: the model drafts the offer letter from the form and the template.\nStep 3: the HR administrator compares the salary, start date, job title, and hours in the letter with the approved offer form. Any mismatch is corrected from the form and noted on the case.\nStep 4: the letter is sent to the candidate.",
};

const STRONG_WORKFLOW: BuildAnswer = {
  operation: "The contract variation letter after an approved change of hours.",
  input: "The manager's change form, approved by the budget holder.",
  output: "The variation letter from the standard template.",
  source: "The approved change form and the HR system record.",
  steps:
    "1. The HR administrator confirms budget holder approval (A person keeps it). 2. The HR administrator updates the HR system (A person keeps it). 3. The assistant drafts the letter (A model may take it). 4. The HR administrator checks the letter (A person keeps it). 5. The letter is sent for signature (A person keeps it).",
  tool: "The approved assistant. Only the job title, new hours, new pay, and effective date go in. Do not paste the reason for the change or bank details.",
  check:
    "The HR administrator compares every date, number of hours, rate of pay, and job title in the letter with the approved form and the HR system.",
  mismatch: "Any mismatch is corrected from the form, never from memory, and noted on the case.",
  failure:
    "The model may give a date that does not match the form. If a signed letter does not match the HR system at filing, the administrator tells the HR manager the same day.",
  data: "The person who pasted it tells the data protection lead the same day.",
  owner: "The HR operations manager owns the workflow and will review it after twenty letters.",
};

const THIN = "To be settled later by whoever has time for it. ".repeat(4).trim();

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

function correctMarks(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
}

function allCorrectPicks(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((o) => o.correct)?.id ?? ""])
  );
}

function assertPassesAndFails(check: LessonCheck, where: string) {
  const pass = (answer: LessonAnswer) => {
    assert.ok(answerComplete(check, answer), `${where}: answer should be complete`);
    assert.equal(evaluateCheck(check, answer).passed, true, `${where}: should pass`);
  };
  const fail = (answer: LessonAnswer) =>
    assert.equal(evaluateCheck(check, answer).passed, false, `${where}: should fail`);

  switch (check.kind) {
    case "mark": {
      const right = correctMarks(check);
      pass(right);
      for (const sentence of check.sentences) {
        fail({ ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" });
      }
      break;
    }
    case "choose":
      assert.ok(check.why && check.wrong, `${where}: choose needs why and wrong`);
      pass(check.correct);
      fail(check.correct === "left" ? "right" : "left");
      break;
    case "edit": {
      const good = GOOD_EDITS[where.split(":")[0]];
      assert.ok(good, `${where}: no good edit written for this check`);
      pass({ edited: good });
      fail({ edited: check.start });
      break;
    }
    case "scenario": {
      const right = allCorrectPicks(check);
      pass(right);
      const needed = check.passMark ?? check.questions.length;
      const wrongCount = check.questions.length - needed + 1;
      const below = { ...right };
      for (const q of check.questions.slice(0, wrongCount)) {
        below[q.id] = q.options.find((o) => !o.correct)?.id ?? "";
      }
      fail(below);
      break;
    }
    case "build":
      pass(STRONG_WORKFLOW);
      for (const field of check.fields) {
        fail({ ...STRONG_WORKFLOW, [field.id]: THIN });
      }
      break;
    case "order":
      assert.fail(`${where}: this course does not use an order check`);
  }
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("the course has seven or eight lessons with every part of the lesson shape", () => {
  assert.equal(COURSE.slug, "hr-operations-with-ai");
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.toLowerCase().includes(lesson.emphasis.toLowerCase()), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.practice.intro.length > 0 && lesson.bridge.length > 0, lesson.id);
  }
});

test("every lesson check and practice check passes with its right answer and fails with a wrong one", () => {
  for (const lesson of COURSE.lessons) {
    assertPassesAndFails(lesson.practice.check, `${lesson.id}:practice`);
    assertPassesAndFails(lesson.check, `${lesson.id}:check`);
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark && check.passMark < check.questions.length);
  assert.ok(check.passMark / check.questions.length >= 0.75);
  for (const q of check.questions) {
    assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
    for (const o of q.options) assert.ok(o.feedback.length > 0, `${q.id}:${o.id}`);
  }
  const positions = new Set(check.questions.map((q) => q.options.findIndex((o) => o.correct)));
  assert.ok(positions.size >= 3, "the right option should move between positions");
});

test("the final lesson is a build that every field checks for substance, and it is the artefact", () => {
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind !== "build") return;
  for (const field of last.check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
});

test("the missing part of the workflow is named in the note", () => {
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  if (last.check.kind !== "build") return;
  const result = evaluateCheck(last.check, { ...STRONG_WORKFLOW, data: "We would sort it out between us." });
  assert.equal(result.passed, false);
  assert.match(result.detail, /data protection lead/);
});

test("no string in the course has a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    const clean = text.replace(/[\u2018\u2019]/g, "'").toLowerCase();
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
