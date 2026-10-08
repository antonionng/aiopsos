import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/robotics-investment-decisions.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { LessonAnswer, LessonCheck, MarkAnswer, SelfServeLesson } from "../self-serve/types.ts";

function lessonById(id: string): SelfServeLesson {
  const lesson = COURSE.lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function correctMarks(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertPasses(check: LessonCheck, answer: LessonAnswer, label: string) {
  assert.ok(answerComplete(check, answer), `${label} should be complete`);
  const outcome = evaluateCheck(check, answer);
  assert.equal(outcome.passed, true, `${label} should pass: ${outcome.detail}`);
}

function assertFails(check: LessonCheck, answer: LessonAnswer, label: string) {
  assert.equal(evaluateCheck(check, answer).passed, false, `${label} should fail`);
}

const EDIT_ANSWERS: Record<string, string> = {
  "five-questions/practice":
    "What are the measured spindle hours and operator hours on lathes 6 and 7 today, and from which report? Which parts will the cell not handle, and who will load them by hand? Does the cost include guarding, integration, and the service contract, and how long is the ramp-up? What will the three operators do, and has HR been involved? What will we measure ninety days after go-live, and against which baseline?",
  "ninety-days-on/check":
    "Ninety-day review on 30 June, owned by the operations manager. Measures, against the two-quarter baseline in the request: pallets per shift from the line report; packer hours from payroll. Also reviewed: the number of mixed-product pallets built by hand, and whether the two packers per shift have moved to the new line.",
};

const STRONG_REVIEW: Record<string, string> = {
  process:
    "What is measured output and labour at end of line 5? Answer: 28 pallets per shift, two packers, from the line report for the last two quarters.",
  exceptions:
    "Which pallets will the robot not build? Answer: mixed-product pallets for two customers, which will be hand-built by a packer on days.",
  cost: "Does the cost include guarding, conveyor changes, service, and ramp-up? Answer: guarding and service included; ramp-up not yet answered.",
  people: "What will the two packers per shift do? Answer: move to the new line in spring, discussed with HR.",
  ninety:
    "What will we measure at ninety days? Answer: not yet answered. I will ask for pallets per shift and packer hours against the baseline.",
  view: "Support with conditions. Add a ramp-up period to the payback and a ninety-day review owned by the operations manager.",
};

function checkLesson(lesson: SelfServeLesson, check: LessonCheck, where: "practice" | "check") {
  const label = `${lesson.id} ${where}`;
  switch (check.kind) {
    case "mark": {
      const right = correctMarks(check);
      assertPasses(check, right, label);
      const first = check.sentences[0];
      assertFails(check, { ...right, [first.id]: first.fail ? "pass" : "fail" }, `${label} with one wrong mark`);
      break;
    }
    case "choose": {
      assertPasses(check, check.correct, label);
      assertFails(check, check.correct === "left" ? "right" : "left", `${label} with the weaker choice`);
      assert.ok(check.wrong, `${label} needs wrong feedback`);
      break;
    }
    case "edit": {
      const good = EDIT_ANSWERS[`${lesson.id}/${where}`];
      assert.ok(good, `${label} needs a test edit`);
      assertPasses(check, { edited: good }, label);
      assertFails(check, { edited: check.start }, `${label} unchanged`);
      for (const group of [...check.keep, ...check.limits]) {
        const stripped = group.any.reduce(
          (text, word) => text.split(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")).join("xx"),
          good
        );
        const outcome = evaluateCheck(check, { edited: stripped });
        assert.equal(outcome.passed, false, `${label} without ${group.id} should fail`);
        assert.ok(outcome.detail.includes(group.missing), `${label} names ${group.id}`);
      }
      break;
    }
    case "scenario": {
      const right = Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)?.id ?? ""])
      );
      assertPasses(check, right, label);
      const needed = check.passMark ?? check.questions.length;
      const wrongCount = check.questions.length - needed + 1;
      const below = { ...right };
      for (const q of check.questions.slice(0, wrongCount)) {
        below[q.id] = q.options.find((o) => !o.correct)!.id;
      }
      assertFails(check, below, `${label} below the pass mark`);
      for (const q of check.questions) {
        assert.equal(q.options.filter((o) => o.correct).length, 1, `${q.id} has one right option`);
        assert.ok(q.options.length >= 3 && q.options.length <= 4, `${q.id} has three or four options`);
        for (const o of q.options) assert.ok(o.feedback.length > 20, `${q.id}/${o.id} has feedback`);
      }
      break;
    }
    case "build": {
      assertPasses(check, STRONG_REVIEW, label);
      for (const field of check.fields) {
        assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
        assert.ok(field.missing, `${field.id} needs a missing sentence`);
        const thin = { ...STRONG_REVIEW, [field.id]: "To be discussed at the next meeting with the committee." };
        const outcome = evaluateCheck(check, thin);
        assert.equal(outcome.passed, false, `${label} without ${field.id} should fail`);
        assert.ok(outcome.detail.includes(field.missing!), `${label} names ${field.id}`);
      }
      break;
    }
    case "order": {
      assertPasses(check, check.correct, label);
      assertFails(check, [...check.correct].reverse(), `${label} reversed`);
      break;
    }
  }
}

test("every practice and lesson check passes with its answer and fails with a wrong one", () => {
  for (const lesson of COURSE.lessons) {
    checkLesson(lesson, lesson.practice.check, "practice");
    checkLesson(lesson, lesson.check, "check");
  }
});

test("the course has the assessment and the artefact in the right places", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    const share = assessment.passMark / assessment.questions.length;
    assert.ok(share >= 0.74 && share <= 0.9, "pass mark is about eighty per cent");
  }
  assert.equal(lessonById("the-five-question-review").check.kind, "build");
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
});

test("every lesson has the full shape", () => {
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis is in the title`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading} paragraphs`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.bridge.length > 20);
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

test("no string uses a dash or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
