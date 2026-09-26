import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/robotics-safety-and-risk.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { LessonCheck, MarkAnswer } from "../self-serve/types.ts";

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function markAnswer(check: Extract<LessonCheck, { kind: "mark" }>, flip?: string): MarkAnswer {
  const answer: MarkAnswer = {};
  for (const sentence of check.sentences) {
    const right = sentence.fail ? "fail" : "pass";
    answer[sentence.id] = sentence.id === flip ? (right === "fail" ? "pass" : "fail") : right;
  }
  return answer;
}

function assertMark(check: LessonCheck) {
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  assert.ok(answerComplete(check, markAnswer(check)));
  assert.equal(evaluateCheck(check, markAnswer(check)).passed, true);
  for (const sentence of check.sentences) {
    assert.equal(evaluateCheck(check, markAnswer(check, sentence.id)).passed, false, sentence.id);
  }
}

function assertChoose(check: LessonCheck) {
  assert.equal(check.kind, "choose");
  if (check.kind !== "choose") return;
  assert.ok(check.wrong);
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false);
}

function assertEdit(check: LessonCheck, good: string, thin: string) {
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(evaluateCheck(check, { edited: good }).passed, true, evaluateCheck(check, { edited: good }).detail);
  assert.equal(evaluateCheck(check, { edited: thin }).passed, false);
}

test("the course has seven lessons, ending in a scenario assessment and the artefact", () => {
  assert.equal(COURSE.slug, "robotics-safety-and-risk");
  assert.equal(COURSE.lessons.length, 7);
  assert.equal(new Set(COURSE.lessons.map((item) => item.id)).size, 7);
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = COURSE.lessons[COURSE.lessons.length - 2];
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(assessment.check.passMark);
  }
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
  }
});

test("shared space: practice and check pass only when every sentence is labelled correctly", () => {
  assertMark(lesson("shared-space").practice.check);
  assertMark(lesson("shared-space").check);
});

test("stops and zones: the practice note and the check stops", () => {
  assertChoose(lesson("stops-and-zones").practice.check);
  assertMark(lesson("stops-and-zones").check);
});

test("a defeated safeguard: practice and check marks", () => {
  assertMark(lesson("a-defeated-safeguard").practice.check);
  assertMark(lesson("a-defeated-safeguard").check);
});

test("the floor walk: questions rewritten to ask to be shown, and the stronger set chosen", () => {
  const check = lesson("the-floor-walk").practice.check;
  assertEdit(
    check,
    "Show me what you do when the palletiser jams. When did it last jam? When were the emergency stops last tested?",
    "Is the cell safe? Do you always follow the jam procedure? Are the emergency stops tested every week?"
  );
  assert.equal(
    evaluateCheck(check, { edited: "Show me what you do when it jams. When did it last jam?" }).passed,
    false,
    "dropping the emergency stops fails"
  );
  assertChoose(lesson("the-floor-walk").check);
});

test("same-day escalation: the note names a role and today, and the findings are sorted", () => {
  const check = lesson("same-day-escalation").practice.check;
  assertEdit(
    check,
    "Found the scanner on the mobile robot in aisle 2 turned to face the wall. Told the shift manager in person at 10:40 today.",
    "Found the scanner on the mobile robot in aisle 2 turned to face the wall. Told someone about it."
  );
  assert.equal(
    evaluateCheck(check, {
      edited: "Found the scanner in aisle 2 turned to face the wall. Will tell the shift manager next week.",
    }).passed,
    false,
    "no time fails"
  );
  assertMark(lesson("same-day-escalation").check);
});

test("course assessment: all correct passes, one wrong still passes, two wrong fails", () => {
  const item = lesson("course-assessment");
  assertChoose(item.practice.check);
  const check = item.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  const right: Record<string, string> = {};
  const wrongPick: Record<string, string> = {};
  for (const question of check.questions) {
    assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 20, `${question.id} ${option.id}`);
    right[question.id] = question.options.find((option) => option.correct)!.id;
    wrongPick[question.id] = question.options.find((option) => !option.correct)!.id;
  }
  const positions = new Set(Object.values(right));
  assert.ok(positions.size >= 3, "the right option moves between positions");
  assert.equal(evaluateCheck(check, right).passed, true);
  const [first, second] = check.questions.map((question) => question.id);
  assert.equal(evaluateCheck(check, { ...right, [first]: wrongPick[first] }).passed, true);
  assert.equal(
    evaluateCheck(check, { ...right, [first]: wrongPick[first], [second]: wrongPick[second] }).passed,
    false
  );
  assert.equal(answerComplete(check, { [first]: right[first] }), false);
});

const STRONG_NOTE: Record<string, string> = {
  cell: "Robot cell 3, Harrowgate Components, walked on 14 October at 10:15.",
  protection:
    "Fenced on three sides with an interlocked gate, which keeps the person out. The loading side has an area scanner that slows the robot and then stops it, which lets the person in, with a limit.",
  questions:
    "I asked the operator to show me what he does when the parts chute jams. He showed me that he opens the gate and waits for the stop. I asked when the emergency stops were last tested, and he showed me the log entry for 2 October.",
  escalated:
    "Cable tie holding the scanner bracket turned away from the loading side: told the shift manager in person at 10:40 and the site safety adviser by telephone at 10:50, and recorded in the safety log.",
  review: "Chute jams about five times a shift, owned by the production engineer. Worn floor markings, owned by facilities.",
};

const WEAK_PARTS: Record<string, string> = {
  cell: "the big cell over by the far wall near the stores",
  protection: "it all looked fine to me and the operator seemed happy with how things were going on the shift",
  questions: "i asked if everything was ok and if he followed the procedure and he said yes to both of them",
  escalated: "i mentioned it to someone later on and they said it would be looked into",
  review: "chute jams and worn floor markings near the cell entrance",
};

test("the floor walk note practice: shown, who, and when are all needed", () => {
  const check = lesson("the-floor-walk-note").practice.check;
  assertEdit(
    check,
    "Walked the palletiser. The operator showed me the lockout point he uses. The gate was tied open. Told the shift manager in person at 10:30 today.",
    "Walked the palletiser. The operator showed me the lockout point. Mentioned the gate to someone."
  );
});

test("the floor walk note: a strong note passes and each weak part fails", () => {
  const check = lesson("the-floor-walk-note").check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assert.ok(answerComplete(check, STRONG_NOTE));
  assert.equal(evaluateCheck(check, STRONG_NOTE).passed, true, evaluateCheck(check, STRONG_NOTE).detail);
  for (const field of check.fields) {
    const weak = { ...STRONG_NOTE, [field.id]: WEAK_PARTS[field.id] };
    const outcome = evaluateCheck(check, weak);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
  assert.equal(
    evaluateCheck(check, { ...STRONG_NOTE, escalated: "Nothing escalated today, as every safeguard I saw appeared to work." }).passed,
    true
  );
});

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

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("no string in the course has a dash or a banned word", () => {
  const all = strings(COURSE);
  assert.ok(all.length > 100);
  for (const text of all) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
