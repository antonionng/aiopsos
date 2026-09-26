import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/vision-systems-and-automated-inspection.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { LessonCheck, LessonAnswer, MarkAnswer } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "prove-it-can-still-see":
    "At the start of each shift, and after cleaning, a lamp change, or any other change at the camera, run the known-bad pouches through the seal camera and check each is rejected. Record the result on the station sheet. If any known-bad pouch passes, stop using the camera, hold all pouches made since the last successful challenge, and call the quality engineer.",
};

const STRONG_BRIEF: Record<string, string> = {
  judges:
    "Judges outside diameter against drawing tolerance and black specks in the top face region. It does not judge whether the cap seals or colour shade.",
  threshold:
    "False rejects are found in the shift-end bin review and false accepts by the hourly audit. Only the quality engineer may change a threshold, after reviewing both errors.",
  quiet: "Lamp ageing, lens dust from the moulding area, and the bracket knocked during tool changes.",
  challenge:
    "Five challenge caps from the locked box at each shift start and after cleaning or a tool change, recorded on the station sheet. If any passes, stop, hold output since the last good challenge, and call the quality engineer.",
  human:
    "Hourly audit of 20 accepted caps by the line inspector, and a shift-end reject review by the line inspector.",
};

const FILLER = "A vague general sentence written for this part with little in it, and a few more words for length here.";

function correctAnswer(lessonId: string, check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "edit":
      assert.ok(GOOD_EDITS[lessonId], `no good edit written for ${lessonId}`);
      return { edited: GOOD_EDITS[lessonId] };
    case "build":
      return { ...STRONG_BRIEF };
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
  }
}

function checksOf() {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, lessonId: lesson.id, check: lesson.practice.check },
    { name: `${lesson.id} check`, lessonId: lesson.id, check: lesson.check },
  ]);
}

test("every practice and check passes with its correct answer", () => {
  for (const { name, lessonId, check } of checksOf()) {
    const answer = correctAnswer(lessonId, check);
    assert.ok(answerComplete(check, answer), `${name} answer should be complete`);
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, true, `${name}: ${outcome.detail}`);
  }
});

test("every mark check fails when any one sentence is marked wrongly", () => {
  for (const { name, lessonId, check } of checksOf()) {
    if (check.kind !== "mark") continue;
    const right = correctAnswer(lessonId, check) as MarkAnswer;
    for (const sentence of check.sentences) {
      const wrong = { ...right, [sentence.id]: right[sentence.id] === "fail" ? "pass" : "fail" } as MarkAnswer;
      const outcome = evaluateCheck(check, wrong);
      assert.equal(outcome.passed, false, `${name} ${sentence.id}`);
      assert.ok(outcome.detail.includes(sentence.text), `${name} names the sentence`);
    }
  }
});

test("every choose check fails with the weaker piece of work and has feedback", () => {
  for (const { name, check } of checksOf()) {
    if (check.kind !== "choose") continue;
    assert.ok(check.why && check.wrong, `${name} needs why and wrong`);
    const outcome = evaluateCheck(check, check.correct === "left" ? "right" : "left");
    assert.equal(outcome.passed, false, name);
    assert.equal(outcome.detail, check.wrong);
  }
});

test("the edit check fails unchanged and fails when each required part is missing", () => {
  const lesson = COURSE.lessons.find((l) => l.id === "prove-it-can-still-see")!;
  const check = lesson.check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  const unchanged = evaluateCheck(check, { edited: check.start });
  assert.equal(unchanged.passed, false);
  assert.equal(unchanged.detail, check.unchanged);

  const partials: Record<string, string> = {
    trigger:
      "Once a day, run the known-bad pouches through the seal camera and check they are rejected. Record the result on the station sheet. If any passes, hold pouches since the last successful challenge and call the quality engineer.",
    record:
      "At each shift start and after cleaning or a lamp change, run the known-bad pouches and check they are rejected. If any passes, hold pouches since the last successful challenge and call the quality engineer.",
    hold:
      "At each shift start and after cleaning or a lamp change, run the known-bad pouches and check they are rejected. Record the result on the station sheet. If any passes, call the quality engineer.",
    owner:
      "At each shift start and after cleaning or a lamp change, run the known-bad pouches and check they are rejected. Record the result on the station sheet. If any passes, hold pouches since the last successful challenge.",
  };
  for (const [id, text] of Object.entries(partials)) {
    const group = check.limits.find((g) => g.id === id)!;
    const outcome = evaluateCheck(check, { edited: text });
    assert.equal(outcome.passed, false, id);
    assert.ok(outcome.detail.includes(group.missing), id);
  }
  const noParts = evaluateCheck(check, {
    edited: GOOD_EDITS[lesson.id].replace(/known-bad /g, "").replace(/successful challenge/g, "successful test"),
  });
  assert.equal(noParts.passed, false);
});

test("the second-to-last lesson is a scenario of six to eight questions with a pass mark", () => {
  const lesson = COURSE.lessons[COURSE.lessons.length - 2];
  const check = lesson.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark && check.passMark < check.questions.length);
  assert.ok(check.passMark / check.questions.length >= 0.74);
  for (const q of check.questions) {
    assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
    assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
    for (const o of q.options) assert.ok(o.feedback.length > 20, `${q.id} ${o.id}`);
  }
  const positions = new Set(check.questions.map((q) => q.options.findIndex((o) => o.correct)));
  assert.ok(positions.size >= 3, "vary the position of the right option");

  const right = correctAnswer(lesson.id, check) as Record<string, string>;
  const missBy = check.questions.length - check.passMark + 1;
  const below = { ...right };
  for (const q of check.questions.slice(0, missBy)) {
    below[q.id] = q.options.find((o) => !o.correct)!.id;
  }
  assert.equal(evaluateCheck(check, below).passed, false);
  const atMark = { ...right };
  for (const q of check.questions.slice(0, missBy - 1)) {
    atMark[q.id] = q.options.find((o) => !o.correct)!.id;
  }
  assert.equal(evaluateCheck(check, atMark).passed, true);
});

test("the final lesson is the build artefact and every field is ruled", () => {
  const lesson = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(lesson.id, COURSE.artefact.lessonId);
  const check = lesson.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.deepEqual(
    check.fields.map((f) => f.id),
    Object.keys(STRONG_BRIEF)
  );
  assert.equal(evaluateCheck(check, STRONG_BRIEF).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    assert.ok(FILLER.length >= field.min);
    const outcome = evaluateCheck(check, { ...STRONG_BRIEF, [field.id]: FILLER });
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
  const threshold = evaluateCheck(check, {
    ...STRONG_BRIEF,
    threshold: "The quality engineer looks after the threshold and reviews false rejects and false accepts each week.",
  });
  assert.equal(threshold.passed, false, "threshold needs a limit");
  const empty = Object.fromEntries(check.fields.map((f) => [f.id, ""]));
  assert.equal(answerComplete(check, empty), false);
});

test("every lesson has the full shape", () => {
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    }
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.bridge.length > 20, lesson.id);
  }
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

test("no string contains an em dash, an en dash, or a banned word", () => {
  const strings = allStrings(COURSE);
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.ok(!/[\u2014\u2013]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text.replace(/\u2019/g, "'")), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
