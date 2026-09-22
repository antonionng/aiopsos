import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-for-customer-communications.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lesson(id: string) {
  const found = lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function markAnswers(check: Extract<LessonCheck, { kind: "mark" }>) {
  const right: Record<string, "pass" | "fail"> = {};
  for (const sentence of check.sentences) right[sentence.id] = sentence.fail ? "fail" : "pass";
  const wrong = { ...right };
  const first = check.sentences[0];
  wrong[first.id] = first.fail ? "pass" : "fail";
  return { right, wrong };
}

function assertPasses(check: LessonCheck, answer: LessonAnswer, label: string) {
  assert.ok(answerComplete(check, answer), `${label}: answer should be complete`);
  const outcome = evaluateCheck(check, answer);
  assert.equal(outcome.passed, true, `${label}: ${outcome.detail}`);
}

function assertFails(check: LessonCheck, answer: LessonAnswer, label: string) {
  assert.equal(evaluateCheck(check, answer).passed, false, label);
}

const EDIT_ANSWERS: Record<string, { good: string; wrong: string }> = {
  "the-complaint-pattern:practice": {
    good:
      "You are a customer adviser at Hartwell Home. The facts are these: Mrs Adeyemi's washing machine was installed on 2 October and has leaked twice. An engineer visit is booked for Friday 17 October between 8am and 1pm. Her complaint is logged as C-40218, and the complaints procedure gives a full response within ten working days. Do not offer a refund, voucher, credit, or any goodwill payment. Do not admit fault or liability, although you may apologise for the inconvenience. Write a reply to her complaint in five sentences.",
    wrong:
      "You are a customer adviser at Hartwell Home. The facts are these: Mrs Adeyemi's washing machine was installed on 2 October and has leaked twice. An engineer visit is booked for Friday 17 October between 8am and 1pm. Her complaint is logged as C-40218. Please be careful and kind. Write a reply to her complaint in five sentences.",
  },
  "the-complaint-pattern:check": {
    good:
      "I am sorry that your lamp arrived broken. I have arranged a replacement lamp, which will be dispatched tomorrow. If it does not arrive or anything else is wrong, please reply to this email and I will look into it.",
    wrong:
      "Dear customer, we are sorry that the lamp arrived broken. This is completely unacceptable. We hope you will shop with us again.",
  },
};

test("every lesson check and practice check passes with the right answer and fails with a wrong one", () => {
  for (const item of lessons) {
    for (const [where, check] of [
      ["practice", item.practice.check],
      ["check", item.check],
    ] as const) {
      const label = `${item.id}:${where}`;
      switch (check.kind) {
        case "mark": {
          const { right, wrong } = markAnswers(check);
          assertPasses(check, right, label);
          assertFails(check, wrong, label);
          break;
        }
        case "choose": {
          assertPasses(check, check.correct, label);
          assertFails(check, check.correct === "left" ? "right" : "left", label);
          assert.ok(check.wrong, `${label} needs a wrong message`);
          break;
        }
        case "edit": {
          const answers = EDIT_ANSWERS[label];
          assert.ok(answers, `${label} needs test answers`);
          assertPasses(check, { edited: answers.good }, label);
          assertFails(check, { edited: answers.wrong }, `${label} wrong edit`);
          assertFails(check, { edited: check.start }, `${label} unchanged`);
          break;
        }
        case "scenario": {
          const right: Record<string, string> = {};
          for (const question of check.questions) {
            right[question.id] = question.options.find((option) => option.correct)!.id;
          }
          assertPasses(check, right, label);
          const below = { ...right };
          const needed = check.passMark ?? check.questions.length;
          const toMiss = check.questions.length - needed + 1;
          for (const question of check.questions.slice(0, toMiss)) {
            below[question.id] = question.options.find((option) => !option.correct)!.id;
          }
          assertFails(check, below, `${label} below pass mark`);
          break;
        }
        case "build":
          break;
        default:
          assert.fail(`${label} uses an unexpected check kind`);
      }
    }
  }
});

test("the complaint check fails when each required part is missing", () => {
  const check = lesson("the-complaint-pattern").check;
  assert.equal(check.kind, "edit");
  const cases = [
    "I am sorry about your order. I have arranged a replacement, which will be dispatched tomorrow. Please reply to this email if anything else is wrong.",
    "I am sorry that your lamp arrived broken. It will be dealt with tomorrow. Please reply to this email if anything else is wrong.",
    "I am sorry that your lamp arrived broken. I have arranged a replacement lamp for you. Please reply to this email if anything else is wrong.",
    "I am sorry that your lamp arrived broken. I have arranged a replacement lamp, which will be dispatched tomorrow.",
  ];
  for (const edited of cases) assertFails(check, { edited }, edited);
});

const STRONG_NOTE: BuildAnswer = {
  handle: "Order queries, delivery updates, and first-stage complaints by email.",
  sources: "The order system, the current price list, and the returns policy.",
  commit: "Rebooking a delivery at no charge and the timescales in the returns policy.",
  hold: "Any refund, credit, or goodwill payment, any admission of fault, and any exception to policy go to my team leader, Priya Shah.",
  before:
    "Is every fact from a source I can name? Does any sentence commit us beyond what I may commit? Is personal data correct and only what is needed? Would I be content for my manager to read it?",
  never: "Never paste full card numbers, bank details, health information, or passwords.",
};

test("the final lesson is the build that the artefact names, and each ruled part is checked", () => {
  const last = lessons[lessons.length - 1];
  assert.equal(last.id, COURSE.artefact.lessonId);
  const check = last.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assertPasses(check, STRONG_NOTE, "strong note");
  const thin = "Whatever seems sensible at the time, as usual.";
  for (const field of check.fields) {
    assertFails(check, { ...STRONG_NOTE, [field.id]: thin }, `note missing ${field.id}`);
  }
  assertFails(
    check,
    { ...STRONG_NOTE, never: "Full card numbers, bank details, health information, or passwords." },
    "never without limit wording"
  );
});

test("the second-to-last lesson is a scenario assessment with a pass mark", () => {
  const check = lessons[lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  assert.ok(check.passMark / check.questions.length >= 0.75);
  for (const question of check.questions) {
    assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
  }
});

test("every lesson has the full shape", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  for (const item of lessons) {
    assert.ok(item.title.toLowerCase().includes(item.emphasis.toLowerCase()), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.bridge.length > 0, item.id);
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

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("no string contains a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text}`);
    }
  }
});
