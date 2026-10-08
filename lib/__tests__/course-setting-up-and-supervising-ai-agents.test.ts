import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/setting-up-and-supervising-ai-agents.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDITS: Record<string, string> = {
  "standing-instructions":
    "You are the expenses assistant for staff at Pennant Insurance. Only answer questions about the expenses policy, and nothing else. Take facts only from the current Expenses Policy, version 6, and say so when the policy does not answer a question. Do not approve claims or promise exceptions. When a question is outside scope or the policy is silent, tell the person to email the finance team at expenses@pennant.example and stop.",
  "supervise-after-launch":
    "Reviewer: the payroll team leader reads ten conversations with the assistant every Friday. Rerun the three tests when the pay policy, a connection, or the model changes. Switch-off: the team leader or IT can disable the assistant from the admin page, and staff are sent to the payroll inbox.",
};

const STRONG_NOTE: BuildAnswer = {
  agent: "Supplier reply agent, in the Fernhill Foods productivity suite agent builder, created 1 October.",
  job: "Draft replies to supplier emails for the operations lead to check before sending.",
  instructions:
    "Scope is supplier emails about deliveries and invoices only; source is the contracts folder; never confirm payments or dates not in the folder; hands over by flagging the email for the operations lead.",
  tools:
    "Mail connection set to read and draft only, under a service account; files limited to read-only access to the contracts folder; no payments system.",
  normal: "3 October, six real supplier emails, five matched first time and one was fixed and passed on rerun.",
  missing:
    "3 October, three cases including a date agreed on the phone; the first draft invented a date, the fix was added, and on rerun it stopped and flagged the email.",
  refusal:
    "3 October, a direct request to confirm early payment and a hidden instruction in grey text inside an invoice email; both refused and the hidden one was flagged.",
  supervision:
    "The purchasing team leader reads ten drafts every Monday; retest when the contracts folder, the connections, or the model change; the team leader or the IT service desk can switch it off from the admin console.",
};

const WEAK = "It seems to work well and people like it a lot so far, and we are pleased with how it has gone overall.";

function correctAnswer(lessonId: string, check: LessonCheck): LessonAnswer {
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
    case "edit":
      assert.ok(GOOD_EDITS[lessonId], `no good edit written for ${lessonId}`);
      return { edited: GOOD_EDITS[lessonId] };
    case "build":
      return STRONG_NOTE;
  }
}

function checksOf(lesson: (typeof lessons)[number]) {
  return [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ];
}

test("the course has eight lessons ending in an assessment and the artefact", () => {
  assert.equal(COURSE.slug, "setting-up-and-supervising-ai-agents");
  assert.equal(lessons.length, 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(typeof assessment.passMark === "number");
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    }
  }
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
});

test("every lesson has the full shape", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.bridge.length > 0);
  }
});

test("every check passes with its correct answer", () => {
  for (const lesson of lessons) {
    for (const { name, check } of checksOf(lesson)) {
      const answer = correctAnswer(lesson.id, check);
      assert.ok(answerComplete(check, answer), `${name} complete`);
      const outcome = evaluateCheck(check, answer);
      assert.ok(outcome.passed, `${name}: ${outcome.detail}`);
    }
  }
});

test("every check fails with a wrong answer", () => {
  for (const lesson of lessons) {
    for (const { name, check } of checksOf(lesson)) {
      switch (check.kind) {
        case "mark":
          for (const sentence of check.sentences) {
            const answer = correctAnswer(lesson.id, check) as Record<string, string>;
            const flipped = { ...answer, [sentence.id]: sentence.fail ? "pass" : "fail" };
            assert.equal(evaluateCheck(check, flipped as LessonAnswer).passed, false, `${name} ${sentence.id}`);
          }
          break;
        case "choose":
          assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, name);
          break;
        case "order":
          assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, name);
          break;
        case "edit": {
          assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${name} unchanged`);
          break;
        }
        case "scenario": {
          const answer = correctAnswer(lesson.id, check) as Record<string, string>;
          const needed = check.passMark ?? check.questions.length;
          const toMiss = check.questions.length - needed + 1;
          const below = { ...answer };
          for (const question of check.questions.slice(0, toMiss)) {
            below[question.id] = question.options.find((o) => !o.correct)!.id;
          }
          assert.equal(evaluateCheck(check, below).passed, false, `${name} below pass mark`);
          const atMark = { ...answer };
          for (const question of check.questions.slice(0, toMiss - 1)) {
            atMark[question.id] = question.options.find((o) => !o.correct)!.id;
          }
          assert.ok(evaluateCheck(check, atMark).passed, `${name} at pass mark`);
          break;
        }
        case "build":
          for (const field of check.fields) {
            assert.ok(field.rule || field.any?.length, `${field.id} has a rule or word list`);
            assert.ok(field.missing, `${field.id} has a missing sentence`);
            assert.ok(WEAK.length >= field.min, `${field.id} weak answer is long enough to test the rule`);
            const weak = { ...STRONG_NOTE, [field.id]: WEAK };
            const outcome = evaluateCheck(check, weak);
            assert.equal(outcome.passed, false, `${name} without ${field.id}`);
            assert.ok(outcome.detail.includes(field.missing!), `${field.id} names the missing part`);
          }
          break;
      }
    }
  }
});

test("each edit fails when one required part is left out", () => {
  const instructions = lessons.find((lesson) => lesson.id === "standing-instructions")!.check;
  assert.equal(instructions.kind, "edit");
  const noRefusal = GOOD_EDITS["standing-instructions"].replace("Do not approve claims or promise exceptions. ", "");
  assert.equal(evaluateCheck(instructions, { edited: noRefusal }).passed, false);
  const noHandover =
    "You are the expenses assistant. Only answer questions about the expenses policy, and nothing else. Take facts only from the Expenses Policy. Do not approve claims.";
  assert.equal(evaluateCheck(instructions, { edited: noHandover }).passed, false);

  const supervision = lessons.find((lesson) => lesson.id === "supervise-after-launch")!.practice.check;
  assert.equal(supervision.kind, "edit");
  const noSwitchOff = GOOD_EDITS["supervise-after-launch"].split("Switch-off")[0];
  assert.equal(evaluateCheck(supervision, { edited: noSwitchOff }).passed, false);
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

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("no string contains a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    const lower = text.toLowerCase().replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(lower), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
