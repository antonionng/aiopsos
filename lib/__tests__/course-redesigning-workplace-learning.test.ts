import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/redesigning-workplace-learning.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const WEAK = "Something general about this part of the programme here";

const STRONG_BUILD: Record<string, BuildAnswer> = {
  "skill-task-check": {
    skill: "Reply to a customer delay enquiry stating the new date, the reason, and the next step.",
    task: "Reply to three real delay enquiries from last week's inbox, with names removed.",
    check: "The team leader confirms each reply states the date, the reason, and the next step.",
  },
  "redesign-one-programme": {
    today: "Induction for new advisers: 4 modules, a video, a guide, a deck, and a quiz, about 90 minutes.",
    skill: "Reply to an unhappy customer's complaint under the complaints policy and decide whether to escalate.",
    task: "Handle three real complaints from last month, with names removed, using the complaints policy.",
    check: "The team leader confirms each reply states what happens next and escalates refunds over £500.",
    cuts: "Cut the quiz, because the check now tests the task. Made the history video optional, because the task does not need it.",
    manager: "The task, whether the check is passed or not yet, and the three replies attached.",
    question: "Which of the three was hardest to reply to, and why?",
    first: "Replace the quiz with the complaints task before the March intake.",
  },
};

const GOOD_EDIT: Record<string, string> = {
  "cut-the-library":
    "1. The onboarding checklist.\n2. A guide to booking equipment and system access, linked from the task, because the plan needs access dates.\n3. Task: write the first-month plan and review it with your HR business partner.\nCut: the history quiz, because the plan does not need company history. Made optional: the chief executive video and the article, because the task does not use them.",
  "what-the-manager-will-see":
    "Task: handle two real guest complaints at reception using the complaints procedure. Check: passed, observed on Saturday. Question for your next one-to-one: which complaint was hardest to settle, and why?",
};

type Kind<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

function correctMarks(check: Kind<"mark">): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function correctPicks(check: Kind<"scenario">): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => {
      const right = q.options.find((o) => o.correct);
      assert.ok(right, `${q.id} needs a correct option`);
      return [q.id, right.id];
    })
  );
}

function assertPassAndFail(check: LessonCheck, lessonId: string, where: string) {
  const label = `${lessonId} ${where}`;
  switch (check.kind) {
    case "mark": {
      const good = correctMarks(check);
      assert.equal(evaluateCheck(check, good).passed, true, label);
      for (const sentence of check.sentences) {
        const bad: MarkAnswer = { ...good, [sentence.id]: good[sentence.id] === "pass" ? "fail" : "pass" };
        assert.equal(evaluateCheck(check, bad).passed, false, `${label} ${sentence.id}`);
      }
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), label);
      break;
    }
    case "choose": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, label);
      assert.ok(check.why && check.wrong, `${label} needs why and wrong`);
      break;
    }
    case "scenario": {
      const good = correctPicks(check);
      assert.equal(answerComplete(check, good), true, label);
      assert.equal(evaluateCheck(check, good).passed, true, label);
      const needed = check.passMark ?? check.questions.length;
      const bad = { ...good };
      for (const q of check.questions.slice(0, check.questions.length - needed + 1)) {
        bad[q.id] = q.options.find((o) => !o.correct)!.id;
      }
      assert.equal(evaluateCheck(check, bad).passed, false, label);
      break;
    }
    case "build": {
      const good = STRONG_BUILD[lessonId];
      assert.ok(good, `${label} needs a strong answer in the test`);
      assert.equal(answerComplete(check, good), true, label);
      assert.equal(evaluateCheck(check, good).passed, true, `${label}: ${evaluateCheck(check, good).detail}`);
      for (const field of check.fields) {
        assert.ok(field.rule || field.any?.length, `${label} ${field.id} needs a rule or any list`);
        assert.ok(field.missing, `${label} ${field.id} needs a missing sentence`);
        const outcome = evaluateCheck(check, { ...good, [field.id]: WEAK });
        assert.equal(outcome.passed, false, `${label} ${field.id} should fail when weak`);
        assert.ok(outcome.detail.includes(field.missing!), `${label} ${field.id} names the missing part`);
      }
      break;
    }
    case "edit": {
      const good = GOOD_EDIT[lessonId];
      assert.ok(good, `${label} needs a good edit in the test`);
      const outcome = evaluateCheck(check, { edited: good });
      assert.equal(outcome.passed, true, `${label}: ${outcome.detail}`);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, label);
      break;
    }
    case "order": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, label);
      break;
    }
  }
}

test("every lesson check and practice check passes with its answer and fails with a wrong one", () => {
  for (const lesson of COURSE.lessons) {
    assertPassAndFail(lesson.practice.check, lesson.id, "practice");
    assertPassAndFail(lesson.check, lesson.id, "check");
  }
});

test("the lesson 4 edit fails when a needed item is removed or no reason is given", () => {
  const lesson = COURSE.lessons.find((item) => item.id === "cut-the-library")!;
  const check = lesson.check;
  assert.equal(check.kind, "edit");
  const good = GOOD_EDIT["cut-the-library"];
  const noChecklist = good.replace("1. The onboarding checklist.\n", "");
  assert.equal(evaluateCheck(check, { edited: noChecklist }).passed, false);
  const noAccess = good.replace(/2\. A guide[^\n]*\n/, "");
  assert.equal(evaluateCheck(check, { edited: noAccess }).passed, false);
  const noPlan = good.replace(/3\. Task[^\n]*\n/, "");
  assert.equal(evaluateCheck(check, { edited: noPlan }).passed, false);
  const noReason =
    "1. The onboarding checklist.\n2. A guide to booking equipment and system access.\n3. Task: write the first-month plan and review it with your HR business partner.\nCut: the quiz, the video, and the article.";
  assert.equal(evaluateCheck(check, { edited: noReason }).passed, false);
  const noCut =
    "1. The onboarding checklist, because the task uses it.\n2. A guide to booking equipment and system access.\n3. Task: write the first-month plan.";
  assert.equal(evaluateCheck(check, { edited: noCut }).passed, false);
});

test("the lesson 5 practice edit needs the task, the state of the check, and a question", () => {
  const lesson = COURSE.lessons.find((item) => item.id === "what-the-manager-will-see")!;
  const check = lesson.practice.check;
  const good = GOOD_EDIT["what-the-manager-will-see"];
  assert.equal(evaluateCheck(check, { edited: good.replace("Task:", "Work:") }).passed, false);
  assert.equal(evaluateCheck(check, { edited: good.replace("passed", "done") }).passed, false);
  assert.equal(evaluateCheck(check, { edited: good.replace("?", ".") }).passed, false);
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(typeof assessment.passMark === "number");
    const ratio = assessment.passMark! / assessment.questions.length;
    assert.ok(ratio >= 0.75 && ratio < 1);
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
      assert.ok(question.options.every((option) => option.feedback.length > 20), question.id);
    }
  }
});

test("every lesson has its parts and the emphasis appears in the title", () => {
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

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
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

test("no string contains an em dash, an en dash, or a banned word", () => {
  const strings = collectStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    const normal = text.replace(/[\u2018\u2019]/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(normal), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
