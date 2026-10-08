import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/measuring-whether-training-stuck.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const strongBuilds: Record<string, BuildAnswer> = {
  "signs-in-the-work:practice": {
    seen: "A delay update to a customer that states the new date, the reason, and the next step.",
    where: "Updates sent from the case system during normal work.",
    who: "The team leader, sampling ten updates per adviser.",
    before: "About four in ten updates had all three parts in the month before the programme.",
  },
  "the-manager-conversation:practice": {
    seen: "In the last two weeks, have you seen their replies offer a next step and a date?",
    example: "Could you send me one reply they wrote this week?",
    obstacle: "Has anything made it harder for them, such as the template or case volumes?",
  },
  "the-sheet:check": {
    programme:
      "The delay updates programme for customer service advisers, building the skill of writing a delay update that states the new date, the reason, and the next step.",
    signs:
      "Delay updates with all three parts, sent from the case system, sampled by team leaders at ten per adviser, compared with about four in ten in the month before the programme.",
    timing: "Weeks 2 to 5 after the programme, first ten updates per adviser in week 2.",
    questions:
      "In the last two weeks, have you seen updates state the date, the reason, and the next step? Could you send me one update? Has anything made it harder?",
    reading:
      "If advisers wrote updates and left a part out, the skill is missing and we will run practice. If there was no chance to use it, we will fix the system or sample again later.",
    activity: "Completion only, to show who has had the chance to learn; it must not be read as evidence.",
    owner: "The L&D lead for customer service",
  },
};

const goodEdits: Record<string, string> = {
  "the-manager-conversation:check":
    "1. In the last two weeks, have you seen their complaint replies offer a specific next step and a date?\n2. Could you send me one complaint reply they wrote this week?\n3. Has anything made it harder for them to do that, such as the template or case volumes?",
};

type Part = "practice" | "check";

function correctAnswer(check: LessonCheck, key: string): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
    case "build":
      assert.ok(strongBuilds[key], `no strong answer for ${key}`);
      return strongBuilds[key];
    case "edit":
      assert.ok(goodEdits[key], `no good edit for ${key}`);
      return { edited: goodEdits[key] };
  }
}

function wrongAnswers(check: LessonCheck, key: string): LessonAnswer[] {
  switch (check.kind) {
    case "mark": {
      return check.sentences.map((flip) =>
        Object.fromEntries(
          check.sentences.map((s) => {
            const right = s.fail ? "fail" : "pass";
            const wrong = s.fail ? "pass" : "fail";
            return [s.id, s.id === flip.id ? wrong : right];
          })
        )
      );
    }
    case "choose":
      return [check.correct === "left" ? "right" : "left"];
    case "order":
      return [[...check.correct].reverse()];
    case "scenario": {
      const needed = check.passMark ?? check.questions.length;
      const misses = check.questions.length - needed + 1;
      return [
        Object.fromEntries(
          check.questions.map((q, index) => [
            q.id,
            (index < misses ? q.options.find((o) => !o.correct) : q.options.find((o) => o.correct))!.id,
          ])
        ),
      ];
    }
    case "build": {
      const strong = strongBuilds[key];
      return check.fields.map((field) => ({ ...strong, [field.id]: "x".repeat(200) }));
    }
    case "edit":
      return [{ edited: check.start }];
  }
}

for (const lesson of COURSE.lessons) {
  for (const part of ["practice", "check"] as Part[]) {
    const check = part === "practice" ? lesson.practice.check : lesson.check;
    const key = `${lesson.id}:${part}`;
    test(`${key} passes with the correct answer`, () => {
      const answer = correctAnswer(check, key);
      assert.ok(answerComplete(check, answer), key);
      const outcome = evaluateCheck(check, answer);
      assert.equal(outcome.passed, true, `${key}: ${outcome.detail}`);
    });
    test(`${key} fails with each wrong answer`, () => {
      for (const answer of wrongAnswers(check, key)) {
        assert.equal(evaluateCheck(check, answer).passed, false, `${key}: ${JSON.stringify(answer)}`);
      }
    });
  }
}

test("the edit check fails when a question kind is missing", () => {
  const lesson = COURSE.lessons.find((item) => item.id === "the-manager-conversation")!;
  const check = lesson.check;
  assert.equal(check.kind, "edit");
  const noObstacle =
    "1. In the last two weeks, have you seen their replies offer a next step and a date?\n2. Could you send me one reply?";
  assert.equal(evaluateCheck(check, { edited: noObstacle }).passed, false);
});

test("the final lesson is the artefact build and the one before it is the scenario assessment", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind === "build") {
    for (const field of last.check.fields) {
      assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or any list`);
      assert.ok(field.missing, `${field.id} needs a missing sentence`);
    }
  }
  const assessment = lessons[lessons.length - 2];
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(typeof assessment.check.passMark === "number");
    for (const question of assessment.check.questions) {
      assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
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

test("no string in the course uses a dash or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text}`);
    }
  }
});
