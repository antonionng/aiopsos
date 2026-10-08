import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/building-a-workforce-skills-plan.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

type Kind<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function checkMark(check: Kind<"mark">) {
  const right: MarkAnswer = Object.fromEntries(
    check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"])
  );
  assert.ok(answerComplete(check, right));
  assert.equal(evaluateCheck(check, right).passed, true);
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
    const outcome = evaluateCheck(check, wrong);
    assert.equal(outcome.passed, false, sentence.id);
    assert.ok(outcome.detail.includes(sentence.text), sentence.id);
  }
}

function checkChoose(check: Kind<"choose">) {
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false);
  assert.ok(check.wrong);
}

function checkAny(check: LessonCheck, name: string) {
  if (check.kind === "mark") return checkMark(check);
  if (check.kind === "choose") return checkChoose(check);
  if (check.kind === "edit" || check.kind === "build" || check.kind === "scenario") return;
  assert.fail(`${name} uses an unexpected check kind ${check.kind}`);
}

test("the course has seven lessons, ending with an assessment and then the plan", () => {
  assert.equal(COURSE.slug, "building-a-workforce-skills-plan");
  assert.equal(COURSE.lessons.length, 7);
  const last = COURSE.lessons.at(-1)!;
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = COURSE.lessons.at(-2)!;
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(assessment.check.passMark);
  }
});

test("every lesson has the full shape and an emphasis word in its title", () => {
  for (const item of COURSE.lessons) {
    assert.ok(item.title.toLowerCase().includes(item.emphasis.toLowerCase()), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel, item.id);
    assert.ok(item.bridge.length > 0, item.id);
  }
});

test("every mark and choose check passes when right and fails when wrong", () => {
  for (const item of COURSE.lessons) {
    checkAny(item.practice.check, `${item.id} practice`);
    checkAny(item.check, `${item.id} check`);
  }
});

test("the few that matter: a good edit passes, and the unchanged draft and each missing reason fail", () => {
  const check = lesson("the-few-that-matter").check as Kind<"edit">;
  assert.equal(check.kind, "edit");
  const good = [
    "Booking clerks, new appointment system live on 3 June.",
    "Skills:",
    "1. Book, move, and cancel an appointment in the new system.",
    "3. Find a patient's existing appointments and linked referrals.",
    "5. Check a patient's mobile number and contact preference when booking.",
    "Cut or moved, with reasons:",
    "2. Colour scheme: cut, because nothing stops if it is unchanged on 3 June.",
    "4. Capacity report: moved to the later list, because one team leader runs it once a month.",
    "6 and 7. Project history and resilience: cut, because neither is something a clerk could be seen doing.",
  ].join("\n");
  assert.equal(evaluateCheck(check, { edited: good }).passed, true);
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(answerComplete(check, { edited: check.start }), false);

  const withoutColour = good.replace("nothing stops if it is unchanged on 3 June", "it is a matter of taste");
  assert.equal(evaluateCheck(check, { edited: withoutColour }).passed, false);
  const withoutObservable = good.replace(
    "neither is something a clerk could be seen doing",
    "they are general"
  );
  assert.equal(evaluateCheck(check, { edited: withoutObservable }).passed, false);
  const withoutReport = good.replace(
    "moved to the later list, because one team leader runs it once a month",
    "moved, because it can wait"
  );
  assert.equal(evaluateCheck(check, { edited: withoutReport }).passed, false);
  const withoutBooking = good.replace("1. Book, move, and cancel an appointment in the new system.\n", "");
  assert.equal(evaluateCheck(check, { edited: withoutBooking }).passed, false);
  const withoutFind = good.replace("3. Find a patient's existing appointments and linked referrals.\n", "");
  assert.equal(evaluateCheck(check, { edited: withoutFind }).passed, false);
});

test("the assessment passes when all correct and fails below the pass mark", () => {
  const check = lesson("course-assessment").check as Kind<"scenario">;
  assert.equal(check.kind, "scenario");
  for (const question of check.questions) {
    assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
  }
  const right = Object.fromEntries(
    check.questions.map((question) => [question.id, question.options.find((option) => option.correct)!.id])
  );
  const wrongOf = (id: string) =>
    check.questions.find((question) => question.id === id)!.options.find((option) => !option.correct)!.id;
  assert.equal(evaluateCheck(check, right).passed, true);
  const needed = check.passMark!;
  const misses = check.questions.length - needed + 1;
  const below = { ...right };
  for (const question of check.questions.slice(0, misses)) below[question.id] = wrongOf(question.id);
  assert.equal(evaluateCheck(check, below).passed, false);
  const oneMiss = { ...right, [check.questions[0].id]: wrongOf(check.questions[0].id) };
  assert.equal(evaluateCheck(check, oneMiss).passed, check.questions.length - 1 >= needed);
});

test("the plan: a strong answer passes, and each missing part fails", () => {
  const check = lesson("the-plan").check as Kind<"build">;
  assert.equal(check.kind, "build");
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, field.id);
    assert.ok(field.missing, field.id);
  }
  const strong: BuildAnswer = {
    changes:
      "New rota system live on 4 November, approved project plan. Two new day centres open from 6 January under the signed contract.",
    skills:
      "Home managers: publish a four-week rota in the new system and approve a shift swap. Change: rota system from 4 November. Day centre coordinators: plan a weekly activity timetable and record attendance on the tablet. Change: day centres from 6 January.",
    measures:
      "Rota: one practice session in the test system, owner regional operations manager, the week before 4 November. Day centres: three days shadowing at Elm House, owner day services manager, the two weeks before 6 January.",
    "not-trained":
      "The monthly rota audit is done by one person, so we will use a job aid owned by the regional operations manager instead.",
    later: "Rota reporting dashboards, needed by few people. Review in February.",
    owner: "HR business partner for care services. Review date 1 December.",
  };
  const outcome = evaluateCheck(check, strong);
  assert.equal(outcome.passed, true, outcome.detail);

  const filler = "we will think about this area at some point and see what happens over the coming period with everyone";
  for (const field of check.fields) {
    const weak = { ...strong, [field.id]: filler };
    const result = evaluateCheck(check, weak);
    assert.equal(result.passed, false, field.id);
    assert.ok(result.detail.includes(field.missing!), field.id);
  }
  assert.equal(answerComplete(check, { ...strong, owner: "" }), false);
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

test("no string in the course uses a dash or a banned word", () => {
  const all = strings(COURSE);
  for (const text of all) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text}`);
    }
  }
});
