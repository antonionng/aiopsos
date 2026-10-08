import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/preparing-a-team-for-automation.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

type Check<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

const GOOD_EDITS: Record<string, string> = {
  "the-first-weeks":
    "Inspectors, days: practise running the start-of-shift test with the supplier on 10 June; watched by the quality lead on 12 June. Inspectors, nights: practise the same test with the supplier on the night of 11 June; watched by the night team leader on 13 June. The supplier leaves site at the end of June, and after that inspectors call the shift engineer.",
};

const STRONG_BRIEF: BuildAnswer = {
  affected:
    "Directly affected: the line 3 packers and the line 3 team leader. Indirectly affected: maintenance technicians on days and nights, the shift planner, and the forklift drivers. The despatch clerks believe they are affected and will be told on 14 October that their work does not change.",
  capabilities:
    "Packers can load the pallet magazine and clear an infeed jam following the shift card. Technicians can isolate the cell following the lockout procedure and change the gripper using the manual.",
  stops: "Stacking cases by hand at the end of line 3 stops in the week of 3 November, and the rotation with the line ends with it.",
  decided:
    "Decided: go-live in November and training before go-live. Not decided: shift patterns, which HR will discuss with the team by 30 October.",
  firstWeeks:
    "Packers practise with the supplier on 3 November and are watched by the team leader on 5 November. Nights are watched by the night team leader on 6 November. After the supplier leaves on 21 November, call the shift engineer.",
};

const WEAK_BRIEF_PARTS: BuildAnswer = {
  affected: "Directly affected: the packers on line 3 who stack cases by hand at the end of the line.",
  capabilities: "Packers will be confident with the robot and will have attended the supplier's training day.",
  stops: "The robot adds speed and a cleaner way to wrap pallets for everyone.",
  decided: "Go-live is agreed for March and everyone will be trained on the robot before then.",
  firstWeeks: "Training for everyone soon, then we go live after that and see how it goes.",
};

function correctMarks(check: Check<"mark">): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertCheck(check: LessonCheck, where: string) {
  switch (check.kind) {
    case "mark": {
      const good = correctMarks(check);
      assert.ok(answerComplete(check, good), where);
      assert.equal(evaluateCheck(check, good).passed, true, where);
      for (const sentence of check.sentences) {
        const wrong = { ...good, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
        assert.equal(evaluateCheck(check, wrong).passed, false, `${where} ${sentence.id}`);
      }
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), where);
      break;
    }
    case "choose": {
      assert.ok(check.wrong, `${where} needs wrong feedback`);
      assert.equal(evaluateCheck(check, check.correct).passed, true, where);
      assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, where);
      break;
    }
    case "edit": {
      const good = GOOD_EDITS[where.split(":")[0]];
      assert.ok(good, `${where} needs a good edit in the test`);
      assert.equal(evaluateCheck(check, { edited: good }).passed, true, where);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, where);
      assert.equal(answerComplete(check, { edited: check.start }), false, where);
      break;
    }
    case "scenario": {
      const allCorrect = Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
      assert.equal(evaluateCheck(check, allCorrect).passed, true, where);
      const needed = check.passMark ?? check.questions.length;
      const below = { ...allCorrect };
      for (const q of check.questions.slice(0, check.questions.length - needed + 1)) {
        below[q.id] = q.options.find((o) => !o.correct)!.id;
      }
      assert.equal(evaluateCheck(check, below).passed, false, where);
      break;
    }
    case "build": {
      assert.equal(evaluateCheck(check, STRONG_BRIEF).passed, true, where);
      for (const field of check.fields) {
        const weak = { ...STRONG_BRIEF, [field.id]: WEAK_BRIEF_PARTS[field.id] };
        const outcome = evaluateCheck(check, weak);
        assert.equal(outcome.passed, false, `${where} ${field.id}`);
        assert.ok(outcome.detail.includes(field.missing!), `${where} ${field.id} names the part`);
      }
      break;
    }
    case "order":
      assert.fail(`${where} does not use an order check`);
  }
}

test("the course has seven or eight lessons with unique ids and an emphasis word in each title", () => {
  assert.equal(COURSE.slug, "preparing-a-team-for-automation");
  assert.equal(COURSE.hours, 2);
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("every practice and lesson check passes with the right answer and fails with a wrong one", () => {
  for (const lesson of lessons) {
    assertCheck(lesson.practice.check, `${lesson.id}:practice`);
    assertCheck(lesson.check, `${lesson.id}:check`);
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark near eighty per cent", () => {
  const check = lessons[lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark !== undefined);
  const ratio = check.passMark / check.questions.length;
  assert.ok(ratio >= 0.74 && ratio <= 0.9, `pass mark ratio ${ratio}`);
  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 20, `${question.id} ${option.id}`);
    positions.add(question.options.findIndex((o) => o.correct));
  }
  assert.ok(positions.size >= 3, "the right option moves between positions");
});

test("the final lesson is the build artefact and every field is ruled", () => {
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind !== "build") return;
  for (const field of last.check.fields) {
    assert.ok(field.rule || field.any?.length, field.id);
    assert.ok(field.missing, field.id);
  }
});

test("a scenario with an unanswered question does not pass", () => {
  const check = lessons[lessons.length - 2].check;
  assert.equal(evaluateCheck(check, {}).passed, false);
  assert.equal(answerComplete(check, {}), false);
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

test("no string in the course uses a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    const plain = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(plain), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
