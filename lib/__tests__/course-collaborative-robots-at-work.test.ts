import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/collaborative-robots-at-work.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lessonById(id: string) {
  const lesson = lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function passes(check: LessonCheck, answer: LessonAnswer) {
  return evaluateCheck(check, answer).passed;
}

function correctMarks(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertMark(check: LessonCheck) {
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  const right = correctMarks(check);
  assert.ok(answerComplete(check, right));
  assert.ok(passes(check, right));
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
    assert.equal(passes(check, wrong), false, `mark ${sentence.id} flipped should fail`);
  }
}

function assertChoose(check: LessonCheck) {
  assert.equal(check.kind, "choose");
  if (check.kind !== "choose") return;
  assert.ok(check.why && check.wrong);
  assert.ok(passes(check, check.correct));
  assert.equal(passes(check, check.correct === "left" ? "right" : "left"), false);
}

function assertOrder(check: LessonCheck) {
  assert.equal(check.kind, "order");
  if (check.kind !== "order") return;
  assert.ok(passes(check, [...check.correct]));
  assert.equal(passes(check, [...check.correct].reverse()), false);
  const swapped = [...check.correct];
  [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
  assert.equal(passes(check, swapped), false);
  assert.notDeepEqual(
    check.steps.map((step) => step.id),
    check.correct,
    "the steps should not already be listed in the right order"
  );
}

function assertEdit(check: LessonCheck, good: string) {
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.ok(passes(check, { edited: good }), evaluateCheck(check, { edited: good }).detail);
  assert.equal(passes(check, { edited: check.start }), false);
  assert.equal(answerComplete(check, { edited: check.start }), false);
  if (check.result) assert.ok(passes(check, { edited: check.result.text }), "the shown result should pass");
}

test("the course has seven lessons with unique ids and a named artefact", () => {
  assert.equal(COURSE.slug, "collaborative-robots-at-work");
  assert.equal(COURSE.hours, 2);
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = lessons[lessons.length - 2];
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(typeof assessment.check.passMark === "number");
  }
});

test("every lesson has the full shape", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis must appear in the title`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading} needs two paragraphs`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.practice.intro.length > 0);
    assert.ok(lesson.bridge.length > 0);
  }
});

test("mark labels are taught in the lesson text", () => {
  for (const lesson of lessons) {
    const text = lesson.sections.flatMap((section) => section.paragraphs).join(" ");
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "mark") continue;
      assert.ok(text.includes(check.passLabel), `${lesson.id} does not teach ${check.passLabel}`);
      assert.ok(text.includes(check.failLabel), `${lesson.id} does not teach ${check.failLabel}`);
    }
  }
});

test("lesson 1: arm and whole task", () => {
  const lesson = lessonById("what-it-is-for");
  assertMark(lesson.practice.check);
  assertMark(lesson.check);
});

test("lesson 2: the start", () => {
  const lesson = lessonById("start-drill");
  assertChoose(lesson.practice.check);
  assertOrder(lesson.check);
});

test("lesson 3: the stop", () => {
  const lesson = lessonById("stop-drill");
  assertMark(lesson.practice.check);
  assertMark(lesson.check);
});

test("lesson 4: the recovery", () => {
  const lesson = lessonById("recover-drill");
  assertEdit(
    lesson.practice.check,
    "Protective stop at 14:40 on the tray loader. The message said the gripper lost the part. I removed the tray insert from the conveyor, checked nobody was in the path, acknowledged the stop, and watched the next cycle."
  );
  const check = lesson.practice.check;
  if (check.kind === "edit") {
    assert.equal(
      passes(check, { edited: "Protective stop at 14:40. The message said the gripper lost the part. I removed the insert and reset it." }),
      false,
      "a recovery with no path check and no watched cycle fails"
    );
  }
  assertOrder(lesson.check);
});

test("lesson 5: when to call a person", () => {
  const lesson = lessonById("when-to-call-a-person");
  assertChoose(lesson.practice.check);
  assertMark(lesson.check);
});

test("lesson 6: the assessment passes at the pass mark and fails below it", () => {
  const lesson = lessonById("course-assessment");
  assertChoose(lesson.practice.check);
  const check = lesson.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  const needed = check.passMark ?? check.questions.length;
  assert.ok(needed / check.questions.length >= 0.74 && needed / check.questions.length <= 0.88);

  const right: Record<string, string> = {};
  const wrongPick: Record<string, string> = {};
  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    const correct = question.options.filter((option) => option.correct);
    assert.equal(correct.length, 1, `${question.id} needs exactly one right option`);
    for (const option of question.options) assert.ok(option.feedback.length > 20, `${question.id} ${option.id}`);
    positions.add(question.options.findIndex((option) => option.correct));
    right[question.id] = correct[0].id;
    wrongPick[question.id] = question.options.find((option) => !option.correct)!.id;
  }
  assert.ok(positions.size >= 3, "the right option should move between positions");

  assert.ok(answerComplete(check, right));
  assert.ok(passes(check, right));

  const atMark = { ...right };
  check.questions.slice(0, check.questions.length - needed).forEach((q) => (atMark[q.id] = wrongPick[q.id]));
  assert.ok(passes(check, atMark), "exactly the pass mark passes");

  const below = { ...right };
  check.questions.slice(0, check.questions.length - needed + 1).forEach((q) => (below[q.id] = wrongPick[q.id]));
  assert.equal(passes(check, below), false, "one below the pass mark fails");

  const partial = { ...right };
  delete partial[check.questions[0].id];
  assert.equal(answerComplete(check, partial), false);
  assert.equal(passes(check, partial), false);
});

const STRONG_HANDOVER: Record<string, string> = {
  state: "Running the part 2210 program on cell 4, normal cycle since 02:50 with no alarms.",
  stops: "Four protective stops between 01:10 and 02:30, all because a part dropped out of the gripper.",
  actions: "Recovered the first two myself. Called Priya Nair, shift engineer, at 02:35 because the stops kept repeating.",
  watch: "Watch the gripper cable where it passes the fixture, because Priya re-routed it after it was rubbing.",
};

test("lesson 7: the handover practice and artefact", () => {
  const lesson = lessonById("the-handover");
  assertEdit(
    lesson.practice.check,
    "State: program 4410 for the bracket, normal since 00:30. Stops at 23:20 and 00:05, both because a bracket slipped in the gripper. Recovered the first. Called Marek Nowak, shift technician, about the second. Watch the gripper fingers."
  );

  const check = lesson.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or a word list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assert.ok(passes(check, STRONG_HANDOVER), evaluateCheck(check, STRONG_HANDOVER).detail);
  assert.ok(passes(check, { ...STRONG_HANDOVER, stops: "No stops this shift, checked the log at 21:50." }));

  const thin: Record<string, string> = {
    state: "The robot is fine and running normally all night.",
    stops: "There were four stops during the night shift.",
    actions: "I sorted everything out on the cell myself tonight.",
    watch: "Just keep an eye on it for the rest of the night.",
  };
  for (const field of check.fields) {
    const answer = { ...STRONG_HANDOVER, [field.id]: thin[field.id] };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, `${field.id} thin answer should fail`);
    assert.ok(outcome.detail.includes(field.missing!), `${field.id} should name its missing part`);
    const empty = { ...STRONG_HANDOVER, [field.id]: "" };
    assert.equal(answerComplete(check, empty), false);
  }
  const noNormal = { ...STRONG_HANDOVER, state: "Program 2210 selected on the pendant for cell 4." };
  assert.equal(passes(check, noNormal), false, "a state that does not say whether anything is abnormal fails");
  assert.equal(passes(check, { state: "Robot OK.", stops: "Few stops.", actions: "Sorted.", watch: "Watch it." }), false);
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

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => allStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => allStrings(item, out));
  return out;
}

test("no string contains a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    assert.ok(!text.includes("!"), `exclamation in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text.replace(/\u2019/g, "'")), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
