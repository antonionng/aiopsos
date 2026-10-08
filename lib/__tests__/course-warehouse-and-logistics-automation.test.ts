import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/warehouse-and-logistics-automation.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const FILLER =
  "Something has been written down for this part of the page, and it is long enough to pass the length alone.";

const STRONG_MAP: BuildAnswer = {
  flow: "Trade orders for boxed fixings. Receive pallets, put away to reserve racking, replenish cases to pick faces, pick cases to roll cages, load. The unit changes from pallet to case at replenishment.",
  figures:
    "1,400 order lines a day, measured, warehouse management system, last six months. Peak assumed, from memory of last March.",
  pays: "Case replenishment, because reach truck drivers spend most of each shift on travel between reserve and the pick faces, and the volume is steady.",
  pile: "Mixed pallets and damaged cases go to the quarantine bay by door 2, handled by the goods-in team on each shift.",
  worse:
    "A stop of the shuttle holds every replenishment. Fallback: two reach trucks are kept on site and the goods-in team replenishes the top 100 lines by hand.",
  next: "Measure the March peak from the warehouse management system, then ask each supplier for hourly capacity at that peak.",
};

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctAnswer(check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((option) => option.correct)!.id])
      ) as LessonAnswer;
    case "build":
      return STRONG_MAP;
    case "edit":
      return {
        edited: `${check.start} Fallback: pickers push totes to packing on trolleys, which are kept at each zone.`,
      };
  }
}

function checksOf(id: string): { name: string; check: LessonCheck }[] {
  const item = lesson(id);
  return [
    { name: `${id} practice`, check: item.practice.check },
    { name: `${id} check`, check: item.check },
  ];
}

test("every mark and choose check passes with its correct answer and fails with a wrong one", () => {
  for (const item of COURSE.lessons) {
    for (const { name, check } of checksOf(item.id)) {
      if (check.kind === "mark") {
        const right = correctAnswer(check) as MarkAnswer;
        assert.ok(answerComplete(check, right), name);
        assert.equal(evaluateCheck(check, right).passed, true, name);
        for (const sentence of check.sentences) {
          const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
          assert.equal(evaluateCheck(check, wrong).passed, false, `${name} ${sentence.id}`);
        }
        assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), name);
      }
      if (check.kind === "choose") {
        assert.equal(evaluateCheck(check, check.correct).passed, true, name);
        const wrong = check.correct === "left" ? "right" : "left";
        const outcome = evaluateCheck(check, wrong);
        assert.equal(outcome.passed, false, name);
        assert.ok(check.wrong, `${name} needs wrong feedback`);
        assert.equal(outcome.detail, check.wrong);
      }
    }
  }
});

test("the edit check passes a real fallback and fails the unchanged note or a hope", () => {
  const check = lesson("where-it-makes-it-worse").check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, correctAnswer(check)).passed, true);
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(answerComplete(check, { edited: check.start }), false);
  assert.equal(
    evaluateCheck(check, { edited: `${check.start} Fallback: the supplier will fix it quickly.` }).passed,
    false
  );
  assert.equal(
    evaluateCheck(check, { edited: `${check.start} Pickers push totes to packing on trolleys.` }).passed,
    false
  );
  assert.equal(
    evaluateCheck(check, {
      edited: "Fallback: pickers push totes to packing on trolleys, which are kept at each zone.",
    }).passed,
    false
  );
});

test("the assessment is a scenario of six to eight questions with a pass mark near eighty per cent", () => {
  const assessment = COURSE.lessons[COURSE.lessons.length - 2];
  const check = assessment.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  const ratio = check.passMark / check.questions.length;
  assert.ok(ratio >= 0.75 && ratio <= 0.9, `pass mark ratio ${ratio}`);
  for (const question of check.questions) {
    assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    assert.ok(question.options.every((option) => option.feedback.length > 20), question.id);
  }
  const right = correctAnswer(check) as Record<string, string>;
  assert.equal(evaluateCheck(check, right).passed, true);

  const wrongPick = (id: string) =>
    check.questions.find((q) => q.id === id)!.options.find((option) => !option.correct)!.id;
  const oneWrong = { ...right, [check.questions[0].id]: wrongPick(check.questions[0].id) };
  assert.equal(evaluateCheck(check, oneWrong).passed, check.questions.length - 1 >= check.passMark);

  const belowMark = { ...right };
  const misses = check.questions.length - check.passMark + 1;
  for (const question of check.questions.slice(0, misses)) belowMark[question.id] = wrongPick(question.id);
  assert.equal(evaluateCheck(check, belowMark).passed, false);

  const unanswered = { ...right };
  delete unanswered[check.questions[0].id];
  assert.equal(evaluateCheck(check, unanswered).passed, false);
});

test("the final lesson is the artefact build and every field is checked for substance", () => {
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.id, COURSE.artefact.lessonId);
  const check = last.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.equal(check.fields.length, 6);
  assert.equal(evaluateCheck(check, STRONG_MAP).passed, true);
  assert.ok(answerComplete(check, STRONG_MAP));
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    assert.ok(STRONG_MAP[field.id], `${field.id} missing from the strong answer`);
    const thin = { ...STRONG_MAP, [field.id]: FILLER };
    const outcome = evaluateCheck(check, thin);
    assert.equal(outcome.passed, false, `${field.id} should fail with filler`);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
    const empty = { ...STRONG_MAP, [field.id]: "" };
    assert.equal(answerComplete(check, empty), false, field.id);
    assert.equal(evaluateCheck(check, empty).passed, false, field.id);
  }
  const unmarked = {
    ...STRONG_MAP,
    figures: "1,400 order lines a day from the warehouse management system for the last six months, with a peak in March.",
  };
  assert.equal(evaluateCheck(check, unmarked).passed, false);
});

test("the course shape follows the build sheet", () => {
  assert.equal(COURSE.slug, "warehouse-and-logistics-automation");
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((item) => item.id)).size, COURSE.lessons.length);
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), `${item.id} emphasis must appear in the title`);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id} ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel, item.id);
    assert.ok(item.bridge.length > 0, item.id);
  }
});

test("mark labels are taught in the lesson text", () => {
  for (const item of COURSE.lessons) {
    const text = item.sections.flatMap((section) => section.paragraphs).join(" ");
    for (const check of [item.practice.check, item.check]) {
      if (check.kind === "mark") {
        assert.ok(text.includes(check.passLabel), `${item.id} does not teach ${check.passLabel}`);
        assert.ok(text.includes(check.failLabel), `${item.id} does not teach ${check.failLabel}`);
      }
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

test("no string contains an em dash, an en dash, or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `banned "${word}" in: ${text}`);
    }
    assert.ok(!text.includes("!"), `exclamation mark in: ${text}`);
  }
});
