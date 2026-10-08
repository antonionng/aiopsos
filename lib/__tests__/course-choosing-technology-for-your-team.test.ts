import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/choosing-technology-for-your-team.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer, SelfServeLesson } from "../self-serve/types.ts";

function lesson(id: string): SelfServeLesson {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctMarks(check: LessonCheck): MarkAnswer {
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return {};
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertMarkRule(check: LessonCheck) {
  const right = correctMarks(check);
  assert.ok(answerComplete(check, right));
  assert.equal(evaluateCheck(check, right).passed, true);
  if (check.kind !== "mark") return;
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
    assert.equal(evaluateCheck(check, wrong).passed, false, `flipping ${sentence.id} should fail`);
  }
}

function assertChooseRule(check: LessonCheck) {
  assert.equal(check.kind, "choose");
  if (check.kind !== "choose") return;
  const wrong = check.correct === "left" ? "right" : "left";
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  assert.equal(evaluateCheck(check, wrong).passed, false);
}

function assertBuildRule(check: LessonCheck, strong: BuildAnswer, weak: BuildAnswer) {
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.deepEqual(Object.keys(strong).sort(), check.fields.map((f) => f.id).sort());
  assert.equal(evaluateCheck(check, strong).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or a word list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    assert.ok(weak[field.id], `no weak answer for ${field.id}`);
    const result = evaluateCheck(check, { ...strong, [field.id]: weak[field.id] });
    assert.equal(result.passed, false, `weak ${field.id} should fail`);
    assert.ok(result.detail.includes(field.missing ?? ""), `weak ${field.id} should name the part`);
  }
}

test("the course has seven lessons, ending on an assessment and then the artefact", () => {
  assert.equal(COURSE.slug, "choosing-technology-for-your-team");
  assert.equal(COURSE.lessons.length, 7);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind !== "scenario") return;
  assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
  assert.ok(assessment.passMark);
});

test("every lesson has the full shape and an emphasis word in its title", () => {
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), `${item.id} emphasis`);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, `${item.id} sections`);
    for (const section of item.sections) {
      assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
    }
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4);
    assert.ok(item.practice.intro && item.bridge);
  }
});

test("mark labels are taught in the lesson text", () => {
  for (const item of COURSE.lessons) {
    const text = item.sections.flatMap((s) => s.paragraphs).join(" ");
    for (const check of [item.practice.check, item.check]) {
      if (check.kind !== "mark") continue;
      assert.ok(text.includes(check.passLabel), `${item.id} teaches ${check.passLabel}`);
      assert.ok(text.includes(check.failLabel), `${item.id} teaches ${check.failLabel}`);
    }
  }
});

test("lesson 1: the job statement practice and the feature check", () => {
  const item = lesson("start-with-the-job");
  assertBuildRule(
    item.practice.check,
    {
      who: "The two receptionists at the Harley Road surgery.",
      often: "About sixty appointments a week.",
      wrong: "Clients who miss an appointment are not chased, and the slot is lost.",
    },
    {
      who: "Reception",
      often: "Quite a lot of the time.",
      wrong: "The current system is really rubbish and slow.",
    }
  );
  assertMarkRule(item.check);
});

test("lesson 2: answers and open questions", () => {
  const item = lesson("five-questions-for-every-option");
  assertMarkRule(item.practice.check);
  assertMarkRule(item.check);
});

test("lesson 3: a fair set of cases and the trial note on real work", () => {
  const item = lesson("test-it-on-your-own-work");
  assertChooseRule(item.practice.check);
  assertChooseRule(item.check);
});

test("lesson 4: switching cost in both directions", () => {
  const item = lesson("the-switching-cost");
  assertBuildRule(
    item.practice.check,
    {
      in: "Two days of the office manager's time to import the client list, and one hour of training for each adviser.",
      out: "Clients export as CSV, and the annual contract needs ninety days' notice to cancel.",
    },
    {
      in: "It is £12 per user per month on the annual plan.",
      out: "It is £12 per user per month on the annual plan.",
    }
  );
  assertMarkRule(item.check);
});

test("lesson 5: repairing a choice record", () => {
  const item = lesson("repair-a-choice-record");
  const practice = item.practice.check;
  assert.equal(practice.kind, "edit");
  if (practice.kind !== "edit") return;
  assert.equal(evaluateCheck(practice, { edited: practice.start }).passed, false);
  assert.equal(
    evaluateCheck(practice, { edited: practice.start.replace("Trial:", "Also keeping the diary, which costs the front desk an hour a day. Trial:") }).passed,
    true
  );
  assert.equal(evaluateCheck(practice, { edited: `${practice.start} Signed off by Tom.` }).passed, false);

  const check = item.check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  const good =
    "Job: the head chef builds the rota for eighteen staff on paper each week. Options: RotaApp, ShiftBoard, and keeping the paper rota. Trial: the shift leads put last week's rota through both, and only ShiftBoard handled a split shift. Switching cost: a day to set up, and a CSV export with thirty days' notice to leave. Decision: ShiftBoard, because it is cheaper, although it cannot send swaps by text. We will review this on 1 September.";
  assert.equal(evaluateCheck(check, { edited: good }).passed, true);
  const cuts: Record<string, string> = {
    nothing: good.replace(", and keeping the paper rota", "").replace("on paper", "by hand"),
    trial: good.replace("Trial: the shift leads put last week's rota through both, and only ShiftBoard handled a split shift. ", ""),
    switching: good.replace("Switching cost: a day to set up, and a CSV export with thirty days' notice to leave. ", ""),
    weakness: good.replace(", although it cannot send swaps by text", ""),
    review: good.replace(" We will review this on 1 September.", ""),
    shiftboard: good.replace(/ShiftBoard/g, "the second tool"),
  };
  for (const [id, text] of Object.entries(cuts)) {
    assert.equal(evaluateCheck(check, { edited: text }).passed, false, `missing ${id} should fail`);
  }
});

test("lesson 6: the practice choice and the scenario assessment", () => {
  const item = lesson("judge-a-choice-in-practice");
  assertChooseRule(item.practice.check);
  const check = item.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  const right: Record<string, string> = {};
  for (const question of check.questions) {
    const correct = question.options.filter((o) => o.correct);
    assert.equal(correct.length, 1, `${question.id} needs exactly one right option`);
    assert.ok(question.options.length >= 3 && question.options.length <= 4);
    for (const option of question.options) assert.ok(option.feedback.length > 20);
    right[question.id] = correct[0].id;
  }
  assert.equal(evaluateCheck(check, right).passed, true);
  const needed = check.passMark ?? check.questions.length;
  const below = { ...right };
  for (const question of check.questions.slice(0, check.questions.length - needed + 1)) {
    below[question.id] = question.options.find((o) => !o.correct)!.id;
  }
  assert.equal(evaluateCheck(check, below).passed, false);
  assert.equal(answerComplete(check, {}), false);
});

test("lesson 7: the choice record passes whole and fails without each part", () => {
  const item = lesson("your-choice-record");
  assertMarkRule(item.practice.check);
  assertBuildRule(
    item.check,
    {
      job: "Two dispensers log about 120 prescription collections a day on paper, and uncollected items are not chased.",
      options: "CollectPoint, the pharmacy system's own module, and keeping the paper log, which costs about four hours a week.",
      questions:
        "CollectPoint fits the work; the pharmacy manager would run it; data stays in the UK and exports as CSV; it connects to our PMR system; three-year cost not yet known.",
      trial: "Ayesha put three real collections through on Monday, and the awkward case, a split collection, worked.",
      switching: "Moving in takes a day of set-up. Moving out needs sixty days' notice, and records export as CSV.",
      decision: "Recommended: CollectPoint. It cannot send texts, so we will phone. Review on 1 March, before renewal.",
    },
    {
      job: "It must have a dashboard, text alerts and a mobile app for the team.",
      options: "CollectPoint and the pharmacy system's own module, both of which look good.",
      questions: "Both look promising and the team is keen on both of them so far, so we are happy with either.",
      trial: "We watched the vendor's demonstration and liked what we saw.",
      switching: "Moving in takes a day of set-up and an hour of training for each dispenser.",
      decision: "We chose CollectPoint because the team liked it best overall.",
    }
  );
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

test("no dashes or banned words anywhere in the course", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text}`);
    }
  }
});
