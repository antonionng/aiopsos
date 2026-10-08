import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/robotics-for-non-engineers.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDITS: Record<string, string> = {
  "the-exception":
    "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount. How often: not yet measured. Handled by: the stock controller, who recounts the bin.",
};

const STRONG_BRIEF: Record<string, string> = {
  process:
    "Trailer unloading at the Halifax depot, the step of moving pallets from the trailer onto the dock conveyor.",
  repeats: "Standard pallets arrive in the same two-by-thirteen layout on every curtain-sided trailer.",
  varies: "Some trailers arrive with pallets that have shifted, and the driver decides how to free them.",
  limits:
    "It cannot free a shifted pallet. Claimed, not yet shown: that the system unloads any trailer type.",
  exception: "Shifted pallets on arrival. How often: about 3 a week, from the dock supervisor's log.",
  handler: "The dock team leader on each shift.",
  stopOwner: "Not yet named.",
  decision:
    "Not yet. The step repeats all day on standard pallets, but nobody has agreed to own the stop.",
  change: "Go to a paid trial once the night shift manager agrees to own the stop.",
};

const FILLER = "Nothing specific has been written in this part yet";

function correctMark(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
}

function correctScenario(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((option) => option.correct)!.id])
  );
}

function assertCheck(lessonId: string, where: string, check: LessonCheck) {
  const label = `${lessonId} ${where}`;
  switch (check.kind) {
    case "mark": {
      const right = correctMark(check);
      assert.ok(answerComplete(check, right), label);
      assert.equal(evaluateCheck(check, right).passed, true, label);
      for (const sentence of check.sentences) {
        const wrong: MarkAnswer = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" };
        assert.equal(evaluateCheck(check, wrong).passed, false, `${label} ${sentence.id}`);
      }
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), label);
      return;
    }
    case "choose": {
      const other = check.correct === "left" ? "right" : "left";
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      assert.equal(evaluateCheck(check, other).passed, false, label);
      assert.ok(check.why && check.wrong, label);
      return;
    }
    case "order": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, label);
      return;
    }
    case "scenario": {
      const right = correctScenario(check);
      assert.equal(evaluateCheck(check, right).passed, true, label);
      const needed = check.passMark ?? check.questions.length;
      const below = { ...right };
      const misses = check.questions.length - needed + 1;
      for (const q of check.questions.slice(0, misses)) {
        below[q.id] = q.options.find((option) => !option.correct)!.id;
      }
      assert.equal(evaluateCheck(check, below).passed, false, label);
      for (const q of check.questions) {
        assert.equal(q.options.filter((o) => o.correct).length, 1, `${label} ${q.id}`);
        assert.ok(q.options.length >= 3 && q.options.length <= 4, `${label} ${q.id}`);
        assert.ok(q.options.every((o) => o.feedback.length > 20), `${label} ${q.id}`);
      }
      return;
    }
    case "edit": {
      const good = GOOD_EDITS[lessonId];
      assert.ok(good, `${label} needs a good edit in this test`);
      assert.equal(evaluateCheck(check, { edited: good }).passed, true, label);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, label);
      assert.equal(answerComplete(check, { edited: check.start }), false, label);
      return;
    }
    case "build": {
      assert.equal(evaluateCheck(check, STRONG_BRIEF).passed, true, label);
      for (const field of check.fields) {
        const weak = { ...STRONG_BRIEF, [field.id]: FILLER };
        assert.equal(evaluateCheck(check, weak).passed, false, `${label} ${field.id}`);
      }
      return;
    }
  }
}

test("every lesson check and practice check passes when right and fails when wrong", () => {
  for (const lesson of lessons) {
    assertCheck(lesson.id, "practice", lesson.practice.check);
    assertCheck(lesson.id, "check", lesson.check);
  }
});

test("the exception edit fails when the frequency or the handler is missing", () => {
  const check = lessons.find((lesson) => lesson.id === "the-exception")!.check;
  assert.equal(check.kind, "edit");
  const noFrequency =
    "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount. Handled by: the stock controller.";
  const noHandler =
    "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount. How often: about 4 a week.";
  const noException =
    "Robot to pick small parts from bins into order totes. How often: about 4 a week. Handled by: the stock controller.";
  assert.equal(evaluateCheck(check, { edited: noFrequency }).passed, false);
  assert.equal(evaluateCheck(check, { edited: noHandler }).passed, false);
  assert.equal(evaluateCheck(check, { edited: noException }).passed, false);
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  const assessment = lessons[lessons.length - 2];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    const count = assessment.check.questions.length;
    assert.ok(count >= 6 && count <= 8);
    assert.ok(assessment.check.passMark);
    const ratio = assessment.check.passMark! / count;
    assert.ok(ratio >= 0.75 && ratio <= 0.9);
  }
  if (last.check.kind === "build") {
    for (const field of last.check.fields) {
      assert.ok(field.rule || field.any?.length, field.id);
      assert.ok(field.missing, field.id);
    }
  }
});

test("every lesson has the full shape", () => {
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  lessons.forEach((lesson, index) => {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    }
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.practice.intro.length > 0, lesson.id);
    if (index < lessons.length - 1) assert.ok(lesson.bridge.length > 0, lesson.id);
  });
});

test("mark labels are taught in the lesson text", () => {
  for (const lesson of lessons) {
    const teaching = lesson.sections
      .flatMap((section) => section.paragraphs)
      .join(" ")
      .toLowerCase();
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "mark") continue;
      for (const word of [check.passLabel, check.failLabel]) {
        assert.ok(teaching.includes(word.toLowerCase()), `${lesson.id}: ${word}`);
      }
    }
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

test("no string contains a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    assert.ok(!text.includes("!"), `exclamation in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text}`);
    }
  }
});
