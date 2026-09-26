import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-for-writing-and-communication.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

type Slot = "practice" | "check";

const GOOD_EDITS: Record<string, string> = {
  "what-you-will-sign:check":
    "We delivered the quarterly return on Friday. The team worked two late evenings to reconcile the supplier accounts in time. Could you thank them at Monday's meeting?",
  "one-finished-piece:practice":
    "Ravi, the new desks for the second floor arrive on Tuesday 14 March, and the cost is £2,400 as quoted. The cost of new chairs has not been agreed yet, and I will let you know what the budget holder decides.",
};

const BAD_EDITS: Record<string, string[]> = {
  "what-you-will-sign:check": [
    "We delivered the quarterly return. Could you thank the team at Monday's meeting?",
    "We delivered it on Friday. Could you thank the team at Monday's meeting?",
    "We delivered the quarterly return on Friday. It may perhaps be worth possibly considering a thank-you at some point.",
  ],
  "one-finished-piece:practice": [
    "Ravi, the new desks arrive on Tuesday 14 March, and the cost is £2,400 as quoted. We will of course cover the chairs as well.",
    "Ravi, the new desks arrive soon, and the cost is £2,400 as quoted. The cost of new chairs has not been agreed.",
    "Ravi, the new desks arrive on Tuesday 14 March. The cost of new chairs has not been agreed.",
  ],
};

const GOOD_BUILDS: Record<string, BuildAnswer> = {
  "the-first-draft:practice": {
    point: "I need the operations director to approve two extra agency staff for the December peak.",
    reader: "Our operations director, who knows the site well and reads email on her phone.",
    material: "Orders were up 18% in November; agency cover costs £640 a week per person; no overtime has been agreed.",
  },
  "a-standard-for-the-next-one:check": {
    piece:
      "Claire, could you approve moving £18,000 of equipment spend from this quarter to next? The supplier has delayed our order by six weeks, and their email of 2 September gives the new date. The total budget does not change.",
    "reader-point": "Our finance director, who needed to approve moving £18,000 into next quarter.",
    before: "I give the model my point in one sentence, the reader and how they read, and my facts.",
    questions:
      "Does the first line tell this reader what I need? Can I show evidence for every fact, and has the right person agreed every commitment?",
    never: "Any figure I have not supplied, any promise about budget or dates, and any apology on behalf of the lab.",
    signature: "Would I say this sentence to this person across the table?",
  },
};

function key(lessonId: string, slot: Slot) {
  return `${lessonId}:${slot}`;
}

function checks(): { id: string; slot: Slot; check: LessonCheck }[] {
  return COURSE.lessons.flatMap((lesson) => [
    { id: lesson.id, slot: "practice" as const, check: lesson.practice.check },
    { id: lesson.id, slot: "check" as const, check: lesson.check },
  ]);
}

test("every practice and check passes with its correct answer and fails with a wrong one", () => {
  for (const { id, slot, check } of checks()) {
    const label = key(id, slot);
    switch (check.kind) {
      case "mark": {
        const right: MarkAnswer = Object.fromEntries(
          check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"])
        );
        assert.ok(answerComplete(check, right), label);
        assert.equal(evaluateCheck(check, right).passed, true, label);
        for (const sentence of check.sentences) {
          const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
          assert.equal(evaluateCheck(check, wrong).passed, false, `${label} ${sentence.id}`);
        }
        assert.ok(check.sentences.some((sentence) => sentence.fail), label);
        assert.ok(check.sentences.some((sentence) => !sentence.fail), label);
        break;
      }
      case "choose": {
        const wrong = check.correct === "left" ? "right" : "left";
        assert.equal(evaluateCheck(check, check.correct).passed, true, label);
        assert.equal(evaluateCheck(check, wrong).passed, false, label);
        assert.ok(check.why && check.wrong, `${label} needs why and wrong`);
        break;
      }
      case "scenario": {
        const right = Object.fromEntries(
          check.questions.map((question) => [question.id, question.options.find((o) => o.correct)!.id])
        );
        assert.equal(evaluateCheck(check, right).passed, true, label);
        const needed = check.passMark ?? check.questions.length;
        const missCount = check.questions.length - needed + 1;
        const below = { ...right };
        for (const question of check.questions.slice(0, missCount)) {
          below[question.id] = question.options.find((o) => !o.correct)!.id;
        }
        assert.equal(evaluateCheck(check, below).passed, false, label);
        break;
      }
      case "edit": {
        const good = GOOD_EDITS[label];
        assert.ok(good, `${label} needs a good edit`);
        assert.equal(evaluateCheck(check, { edited: good }).passed, true, label);
        assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, label);
        for (const bad of BAD_EDITS[label] ?? []) {
          assert.equal(evaluateCheck(check, { edited: bad }).passed, false, `${label}: ${bad}`);
        }
        if (check.result) {
          assert.equal(evaluateCheck(check, { edited: check.result.text }).passed, true, `${label} result`);
        }
        break;
      }
      case "build": {
        const good = GOOD_BUILDS[label];
        assert.ok(good, `${label} needs a strong answer`);
        assert.ok(answerComplete(check, good), label);
        assert.equal(evaluateCheck(check, good).passed, true, label);
        for (const field of check.fields) {
          assert.ok(field.rule || field.any?.length, `${label} ${field.id} needs a rule or an any list`);
          assert.ok(field.missing, `${label} ${field.id} needs a missing sentence`);
          const thin = { ...good, [field.id]: "x".repeat(Math.max(field.min, 12)) };
          assert.equal(evaluateCheck(check, thin).passed, false, `${label} ${field.id}`);
          const empty = { ...good, [field.id]: "" };
          assert.equal(evaluateCheck(check, empty).passed, false, `${label} ${field.id} empty`);
        }
        break;
      }
      case "order":
        assert.fail(`${label} uses an order check, which this course does not need`);
    }
  }
});

test("the course ends with a scenario assessment and then the artefact", () => {
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
    const ratio = assessment.passMark / assessment.questions.length;
    assert.ok(ratio >= 0.75 && ratio <= 0.9);
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
      assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    }
  }
});

test("every lesson has its parts and its emphasis appears in the title", () => {
  assert.equal(new Set(COURSE.lessons.map((lesson) => lesson.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
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
  "navigate",
  "let's",
  "in conclusion",
  "imagine a world",
];

test("no string contains a dash, an exclamation mark, or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    assert.ok(!text.includes("!"), `exclamation mark in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text.replace(/\u2019/g, "'")), `"${word}" in: ${text}`);
    }
  }
});
