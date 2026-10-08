import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-literacy-under-the-eu-ai-act.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

type Check<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

const GOOD_MEASURE =
  "Role: accounts payable officers in the finance team. System: the AI assistant in our accounting software. Context: they use it to draft replies to supplier queries. People affected: suppliers and budget holders. Must be able to: check every figure against the ledger before use, and escalate any draft that commits us to a payment date. How we will know: the finance manager reviews a sample of five replies per person each quarter.";

const STRONG_PLAN: BuildAnswer = {
  scope:
    "The customer contact team (32 advisers and 4 team leaders), using the AI drafting tool in our customer platform.",
  measures:
    "Advisers. System, the drafting tool; context, replies to customer emails; people affected, customers, including those in vulnerable circumstances; must be able to check every draft for facts and commitments and escalate anything they cannot support; measure, a 90-minute session then five supervised replies; how we will know, team leaders review five sent replies per adviser each quarter.",
  record:
    "For each person, the measure, the date, the reviewer, the evidence from the review, and the next review date.",
  owner: "Fiona Adeyemi, contact centre manager. Review every six months, or when the drafting tool changes.",
  limits:
    "This plan sets out measures to build AI literacy in this team. It does not claim that the team complies with the EU AI Act or any other regulation.",
};

const THIN_PLAN: BuildAnswer = {
  scope: "The customer contact team: 32 advisers and 4 team leaders in the Leeds office.",
  measures:
    "Advisers will attend a session on the drafting work and team leaders will look over replies each quarter with the operations manager, who keeps the sheet.",
  record: "For each person we will keep the date they attended the session and whether they finished the module.",
  owner: "Owner: the operations manager, Sarah Quinn, who holds the plan.",
  limits: "This plan sets out the measures we will take to build AI literacy in the team.",
};

function markAnswer(check: Check<"mark">): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
}

function scenarioAnswer(check: Check<"scenario">, wrongCount: number): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((question, index) => {
      const option =
        index < wrongCount
          ? question.options.find((o) => !o.correct)
          : question.options.find((o) => o.correct);
      return [question.id, option!.id];
    })
  );
}

function assertPassAndFail(check: LessonCheck, where: string) {
  switch (check.kind) {
    case "mark": {
      const right = markAnswer(check);
      assert.ok(evaluateCheck(check, right).passed, `${where}: correct marks pass`);
      for (const sentence of check.sentences) {
        const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
        assert.equal(evaluateCheck(check, wrong).passed, false, `${where}: flipping ${sentence.id} fails`);
      }
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), `${where}: both labels used`);
      return;
    }
    case "choose": {
      const other = check.correct === "left" ? "right" : "left";
      assert.ok(evaluateCheck(check, check.correct).passed, `${where}: correct choice passes`);
      assert.equal(evaluateCheck(check, other).passed, false, `${where}: other choice fails`);
      assert.ok(check.wrong, `${where}: choose check has wrong feedback`);
      return;
    }
    case "edit": {
      assert.ok(evaluateCheck(check, { edited: GOOD_MEASURE }).passed, `${where}: good edit passes`);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${where}: unchanged start fails`);
      return;
    }
    case "scenario": {
      const needed = check.passMark ?? check.questions.length;
      const allRight = scenarioAnswer(check, 0);
      assert.ok(evaluateCheck(check, allRight).passed, `${where}: all correct passes`);
      const below = scenarioAnswer(check, check.questions.length - needed + 1);
      assert.equal(evaluateCheck(check, below).passed, false, `${where}: below the pass mark fails`);
      return;
    }
    case "build": {
      assert.ok(evaluateCheck(check, STRONG_PLAN).passed, `${where}: strong plan passes`);
      return;
    }
    case "order":
      assert.fail(`${where}: this course has no order checks`);
  }
}

test("every practice and check passes with its correct answer and fails with a wrong one", () => {
  for (const lesson of COURSE.lessons) {
    assertPassAndFail(lesson.practice.check, `${lesson.id} practice`);
    assertPassAndFail(lesson.check, `${lesson.id} check`);
  }
});

test("the course has seven lessons with the full lesson shape", () => {
  assert.equal(COURSE.slug, "ai-literacy-under-the-eu-ai-act");
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis is in the title`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.bridge.length > 0);
  }
});

test("the second-to-last lesson is a scenario of six to eight questions with a pass mark", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark && check.passMark / check.questions.length >= 0.75);
  assert.ok(check.passMark < check.questions.length);
  for (const question of check.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
  }
  const positions = new Set(check.questions.map((q) => q.options.findIndex((o) => o.correct)));
  assert.ok(positions.size >= 3, "the right option moves between positions");
});

test("the final lesson is the build artefact named by the course", () => {
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind !== "build") return;
  for (const field of last.check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} has a rule or an any list`);
    assert.ok(field.missing, `${field.id} has a missing sentence`);
  }
});

test("the plan fails when any one part is missing its substance", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 1].check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    const thin = { ...STRONG_PLAN, [field.id]: THIN_PLAN[field.id] };
    assert.ok(thin[field.id].length >= field.min, `${field.id} thin answer is long enough to test the rule`);
    const outcome = evaluateCheck(check, thin);
    assert.equal(outcome.passed, false, `${field.id} without its part fails`);
    assert.ok(outcome.detail.includes(field.missing!), `${field.id} names what is missing`);
  }
  assert.equal(answerComplete(check, { ...STRONG_PLAN, limits: "" }), false);
});

test("the measure edit fails when a part is still missing", () => {
  const check = COURSE.lessons.find((l) => l.id === "a-measure-for-your-role")!.check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(answerComplete(check, { edited: check.start }), false);
  const partial = "All finance staff will use the AI assistant in our accounting software after a one-hour module.";
  assert.equal(evaluateCheck(check, { edited: partial }).passed, false);
  for (const group of [...check.keep, ...check.limits]) {
    const stripped = group.any.reduce(
      (text, word) => text.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "x"),
      GOOD_MEASURE
    );
    assert.equal(evaluateCheck(check, { edited: stripped }).passed, false, `${group.id} missing fails`);
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

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

test("no string contains a dash or a banned word", () => {
  const all = strings(COURSE);
  for (const text of all) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});

test("the course states no penalties, amounts, or enforcement dates", () => {
  const all = strings(COURSE).join(" ");
  assert.ok(!/\b(fines?|penalty|penalties|enforce|enforced|enforcement|sanctions?)\b/i.test(all));
  assert.ok(!/[€£$]|\b2025\b|\b2026\b|\b2027\b/.test(all));
});
