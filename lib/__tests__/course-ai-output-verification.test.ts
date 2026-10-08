import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-output-verification.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const STRONG_NOTE: BuildAnswer = {
  output:
    "Model summary of the Kestrel Foods distribution agreement for Aisha Karim, operations manager, for use in the renewal meeting on 14 May.",
  claims: "(1) 60 days' notice to terminate.\n(2) Prices fixed until 31 March.\n(3) The supplier must offer a renewal discount.",
  traced:
    "(1) Signed agreement dated 3 February, clause 9.1: 'sixty (60) days' written notice'. (2) Schedule 1, paragraph 2: prices fixed until 31 March. (3) Not traced. Schedule 1 says a discount 'may be discussed'.",
  reasoning: "Claim 3 goes further than the source, because it turns a discount that may be discussed into a right.",
  decision: "(1) and (2) use. (3) held and rewritten as 'a discount may be discussed at renewal'.",
};

const WEAK_PARTS: BuildAnswer = {
  output: "A summary the model wrote this morning.",
  claims: "Several claims about notice and prices.",
  traced: "The model said so and my colleague agreed it looked right.",
  reasoning: "Looked fine to me overall.",
  decision: "All good to send.",
};

type Check = LessonCheck;

function correctAnswer(check: Check): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      ) as Record<string, string>;
    case "edit":
      return { edited: goodEdit(check) };
    case "build":
      return STRONG_NOTE;
  }
}

function goodEdit(check: Extract<Check, { kind: "edit" }>): string {
  const words = [...check.keep, ...check.limits].map((group) => group.any[0]);
  const limitLine = check.limitWording === false ? "" : "Do not ";
  return `${check.start} ${limitLine}${words.join(", ")}.`;
}

function wrongAnswers(check: Check): LessonAnswer[] {
  switch (check.kind) {
    case "mark": {
      const right = correctAnswer(check) as MarkAnswer;
      return check.sentences.map((s) => ({ ...right, [s.id]: right[s.id] === "pass" ? "fail" : "pass" }) as MarkAnswer);
    }
    case "choose":
      return [check.correct === "left" ? "right" : "left"];
    case "order":
      return [[...check.correct].reverse()];
    case "scenario": {
      const wrongPicks = Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => !o.correct)!.id])
      ) as Record<string, string>;
      const right = correctAnswer(check) as Record<string, string>;
      const needed = check.passMark ?? check.questions.length;
      const belowPass = { ...right };
      check.questions.slice(0, check.questions.length - needed + 1).forEach((q) => {
        belowPass[q.id] = wrongPicks[q.id];
      });
      return [wrongPicks, belowPass];
    }
    case "edit":
      return [{ edited: check.start }];
    case "build":
      return check.fields.map((field) => ({ ...STRONG_NOTE, [field.id]: WEAK_PARTS[field.id] }));
  }
}

function allChecks(): { name: string; check: Check }[] {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ]);
}

test("every practice and check passes with its correct answer", () => {
  for (const { name, check } of allChecks()) {
    const answer = correctAnswer(check);
    assert.ok(answerComplete(check, answer), `${name} answer is incomplete`);
    const outcome = evaluateCheck(check, answer);
    assert.ok(outcome.passed, `${name} should pass: ${outcome.detail}`);
  }
});

test("every practice and check fails with a wrong answer", () => {
  for (const { name, check } of allChecks()) {
    for (const answer of wrongAnswers(check)) {
      const outcome = evaluateCheck(check, answer);
      assert.equal(outcome.passed, false, `${name} should fail for ${JSON.stringify(answer)}`);
      assert.ok(outcome.detail.length > 0, `${name} gives no feedback`);
    }
  }
});

test("the edit practice fails when the trace is changed but still names no clause", () => {
  const lesson = COURSE.lessons.find((l) => l.id === "trace-each-claim")!;
  const check = lesson.practice.check;
  assert.equal(check.kind, "edit");
  const outcome = evaluateCheck(check, {
    edited: "Break option after five years: traced. The signed lease says so.",
  });
  assert.equal(outcome.passed, false);
});

test("the build check names the missing part for each ruled field", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 1].check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} has no rule`);
    assert.ok(field.missing, `${field.id} has no missing sentence`);
    const outcome = evaluateCheck(check, { ...STRONG_NOTE, [field.id]: WEAK_PARTS[field.id] });
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind !== "scenario") return;
  assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
  assert.ok(typeof assessment.passMark === "number");
  assert.ok(assessment.passMark! / assessment.questions.length >= 0.75);
  for (const question of assessment.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 0);
  }
  const positions = new Set(assessment.questions.map((q) => q.options.findIndex((o) => o.correct)));
  assert.ok(positions.size >= 3);
});

test("every lesson has its parts, and each emphasis word is in its title", () => {
  const ids = new Set<string>();
  for (const lesson of COURSE.lessons) {
    assert.ok(!ids.has(lesson.id), lesson.id);
    ids.add(lesson.id);
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("every mark label is taught in the lesson text", () => {
  for (const lesson of COURSE.lessons) {
    const teaching = lesson.sections.flatMap((s) => s.paragraphs).join(" ");
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "mark") continue;
      assert.ok(teaching.includes(check.passLabel), `${lesson.id}: ${check.passLabel}`);
      assert.ok(teaching.includes(check.failLabel), `${lesson.id}: ${check.failLabel}`);
    }
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
];

test("no string contains an em dash, an en dash, or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
