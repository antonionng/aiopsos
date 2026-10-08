import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/where-a-robot-belongs-in-the-process.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, SelfServeLesson } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lessonById(id: string): SelfServeLesson {
  const lesson = lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function passes(check: LessonCheck, answer: LessonAnswer): boolean {
  return evaluateCheck(check, answer).passed;
}

/** A correct and a wrong answer for the check kinds that can be derived from the data. */
function derivedAnswers(check: LessonCheck): { right: LessonAnswer; wrong: LessonAnswer[] } | null {
  switch (check.kind) {
    case "mark": {
      const right = Object.fromEntries(
        check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"])
      ) as Record<string, "pass" | "fail">;
      const wrong = check.sentences.map((sentence) => ({
        ...right,
        [sentence.id]: sentence.fail ? "pass" : "fail",
      })) as LessonAnswer[];
      return { right, wrong };
    }
    case "choose":
      return { right: check.correct, wrong: [check.correct === "left" ? "right" : "left"] };
    case "scenario": {
      const right = Object.fromEntries(
        check.questions.map((question) => [question.id, question.options.find((option) => option.correct)!.id])
      );
      const needed = check.passMark ?? check.questions.length;
      const misses = check.questions.length - needed + 1;
      const below = { ...right };
      for (const question of check.questions.slice(0, misses)) {
        below[question.id] = question.options.find((option) => !option.correct)!.id;
      }
      return { right, wrong: [below] };
    }
    default:
      return null;
  }
}

test("the course has seven or eight lessons, ending with a scenario assessment and the artefact build", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  const assessment = lessons[lessons.length - 2];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(typeof assessment.check.passMark === "number");
    const ratio = assessment.check.passMark! / assessment.check.questions.length;
    assert.ok(ratio >= 0.74 && ratio <= 0.9, `pass mark ratio ${ratio}`);
  }
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
});

test("every lesson has the full shape", () => {
  for (const [index, lesson] of lessons.entries()) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.heading.length > 0);
      assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    }
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.practice.intro.length > 0);
    assert.ok(lesson.bridge.length > 0, `${lesson.id} bridge or closing sentence`);
    if (lesson.check.kind === "choose") assert.ok(lesson.check.wrong, `${lesson.id} choose needs wrong`);
    if (lesson.practice.check.kind === "choose") assert.ok(lesson.practice.check.wrong);
    assert.ok(index >= 0);
  }
});

test("every mark, choose, and scenario check passes when right and fails when wrong", () => {
  for (const lesson of lessons) {
    for (const [where, check] of [
      ["practice", lesson.practice.check],
      ["check", lesson.check],
    ] as const) {
      const answers = derivedAnswers(check);
      if (!answers) {
        assert.ok(check.kind === "edit" || check.kind === "build", `${lesson.id} ${where} needs a specific test`);
        continue;
      }
      assert.ok(answerComplete(check, answers.right), `${lesson.id} ${where} complete`);
      assert.equal(passes(check, answers.right), true, `${lesson.id} ${where} right`);
      for (const wrong of answers.wrong) {
        assert.equal(passes(check, wrong), false, `${lesson.id} ${where} wrong`);
      }
    }
  }
});

test("scenario options each carry feedback and exactly one is right", () => {
  for (const lesson of lessons) {
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "scenario") continue;
      for (const question of check.questions) {
        assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
        assert.ok(question.options.length >= 3 && question.options.length <= 4);
        for (const option of question.options) assert.ok(option.feedback.length > 0);
      }
    }
  }
});

test("the four facts edit passes with an observed arrival line and fails otherwise", () => {
  const check = lessonById("four-facts").check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  const good = `${check.start}\nHow the part arrives: loose in a chute, in any orientation.`;
  assert.equal(passes(check, { edited: good }), true);
  const measured = `${check.start}\nHow the part arrives: not yet measured.`;
  assert.equal(passes(check, { edited: measured }), true);
  assert.equal(passes(check, { edited: check.start }), false);
  const opinion = `${check.start}\nHow the part arrives: easy, no problem.`;
  assert.equal(passes(check, { edited: opinion }), false);
  const noLine = `${check.start}\nThe bags are quite easy to handle.`;
  assert.equal(passes(check, { edited: noLine }), false);
  const lostFact = good.replace("about 900 times a day", "often");
  assert.equal(passes(check, { edited: lostFact }), false);
  const lostJudgement = good.replace("the packer reads the route label and chooses the crate", "some");
  assert.equal(passes(check, { edited: lostJudgement }), false);
});

const strongRecommendation: BuildAnswer = {
  tasks:
    "Board test, six tasks. 1. Pick board from rack: Robot, because it happens about 400 times a shift and boards sit one per slot. 4. Read pass or fail: Person, because an operator reads the result. 6. Tag failed boards: Person, because the fault is written by hand.",
  recommend: "Automate tasks 1, 2, and 5 as one robot task.",
  "easy-step": "None found in handling, but bent pins are noticed by the operator at task 2 and would be lost.",
  "knock-on":
    "Racks must be checked for damage before loading, and the operator becomes responsible for failed boards and robot stops.",
  evidence: "A trial of 500 boards on our own racks, and a count of bent pins over one month.",
};

const weakParts: BuildAnswer = {
  tasks:
    "1. Pick board from rack. 2. Place board in fixture. 3. Close fixture and press start. 4. Read the screen and write it up.",
  recommend: "The line would be better with more equipment in the test area.",
  "easy-step": "The step is quite dull and people are bored doing it all day.",
  "knock-on": "The machine will be faster than the present method on the line.",
  evidence: "We are confident it will go well on the line.",
};

test("the recommendation build passes when strong and fails when any ruled part is missing", () => {
  const lesson = lessonById("the-recommendation");
  const check = lesson.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assert.deepEqual(Object.keys(strongRecommendation).sort(), check.fields.map((field) => field.id).sort());
  assert.ok(answerComplete(check, strongRecommendation));
  assert.equal(passes(check, strongRecommendation), true);
  for (const field of check.fields) {
    const answer = { ...strongRecommendation, [field.id]: weakParts[field.id] };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, `${field.id} weak part should fail`);
    assert.ok(outcome.detail.includes(field.missing!), `${field.id} names the missing part`);
  }
  const noNumbers = {
    ...strongRecommendation,
    tasks:
      "Board test. Pick board from rack: robot, because it happens often and boards sit one per slot. Read the result: person, because an operator reads it.",
  };
  assert.equal(passes(check, noNumbers), false);
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
    assert.ok(!/[\u2014\u2013]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
