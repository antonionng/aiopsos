import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/running-a-technology-rollout.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctMarks(check: LessonCheck): MarkAnswer {
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") throw new Error("not a mark check");
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertMark(check: LessonCheck) {
  if (check.kind !== "mark") throw new Error("not a mark check");
  const right = correctMarks(check);
  assert.ok(answerComplete(check, right));
  assert.equal(evaluateCheck(check, right).passed, true);
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: right[sentence.id] === "fail" ? "pass" : "fail" } as MarkAnswer;
    assert.equal(evaluateCheck(check, wrong).passed, false, sentence.id);
  }
}

function assertChoose(check: LessonCheck) {
  if (check.kind !== "choose") throw new Error("not a choose check");
  assert.ok(check.wrong);
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  const other = check.correct === "left" ? "right" : "left";
  assert.equal(evaluateCheck(check, other).passed, false);
}

function scenarioAnswer(check: LessonCheck, rightCount: number): Record<string, string> {
  if (check.kind !== "scenario") throw new Error("not a scenario");
  return Object.fromEntries(
    check.questions.map((question, index) => {
      const right = question.options.find((option) => option.correct);
      const wrong = question.options.find((option) => !option.correct);
      assert.ok(right && wrong);
      return [question.id, index < rightCount ? right.id : wrong.id];
    })
  );
}

test("the course has seven lessons, a scenario assessment, then the artefact build", () => {
  assert.equal(COURSE.slug, "running-a-technology-rollout");
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  if (last.check.kind === "build") {
    for (const field of last.check.fields) {
      assert.ok(field.rule || field.any?.length, field.id);
      assert.ok(field.missing, field.id);
    }
  }
  const assessment = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(typeof assessment.passMark === "number");
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    }
  }
});

test("every lesson has the full shape and its emphasis is in its title", () => {
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel, item.id);
    assert.ok(item.bridge.length > 0, item.id);
  }
});

test("the behaviour: practice choose and check mark", () => {
  const item = lesson("the-behaviour");
  assertChoose(item.practice.check);
  assertMark(item.check);
});

test("the order of a rollout: practice choose and check order", () => {
  const item = lesson("the-order-of-a-rollout");
  assertChoose(item.practice.check);
  const check = item.check;
  if (check.kind !== "order") throw new Error("not an order check");
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  assert.equal(evaluateCheck(check, check.steps.map((step) => step.id)).passed, false);
  assert.equal(evaluateCheck(check, ["trial", "sales-start", "fix", "stop", "check"]).passed, false);
  assert.equal(evaluateCheck(check, ["trial", "fix", "stop", "sales-start", "check"]).passed, false);
  assert.equal(evaluateCheck(check, ["trial", "fix", "sales-start", "check", "stop"]).passed, false);
});

test("who and when: practice mark and check choose", () => {
  const item = lesson("who-and-when");
  assertMark(item.practice.check);
  assertChoose(item.check);
});

test("support, then stop: practice choose and check edit", () => {
  const item = lesson("support-then-stop");
  assertChoose(item.practice.check);
  const check = item.check;
  if (check.kind !== "edit") throw new Error("not an edit check");
  assert.ok(check.result);
  const good = { edited: check.result.text };
  assert.ok(answerComplete(check, good));
  assert.equal(evaluateCheck(check, good).passed, true);
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  const drops: Record<string, string> = {
    helper: good.edited.replace("Helper: Sam", "Contact: Sam"),
    backup: good.edited.replace("Back-up: the old server stays open.", "The old server stays open."),
    problems: good.edited.replace("Problems: logged in the Drive Issues list", "Notes: logged in the Drive list"),
    stop: good.edited.replace("Stop: on 16 March the old server is made read-only.", "On 16 March the old server changes."),
    announce: good.edited.replace("This date is announced in the launch email on 2 March.", ""),
  };
  for (const [part, text] of Object.entries(drops)) {
    assert.notEqual(text, good.edited, part);
    assert.equal(evaluateCheck(check, { edited: text }).passed, false, part);
  }
  const noDates =
    "Support window: from the launch until the stop. Helper: Sam from the pilot team, on Teams all day. Back-up: the old server stays open. Problems: logged in the Drive Issues list. Stop: the old server is made read-only. This is announced in the launch email.";
  assert.equal(evaluateCheck(check, { edited: noDates }).passed, false);
});

test("the sign it stuck: practice choose and check mark", () => {
  const item = lesson("the-sign-it-stuck");
  assertChoose(item.practice.check);
  assertMark(item.check);
});

test("the rollout assessment: all correct passes, below the pass mark fails", () => {
  const item = lesson("the-rollout-assessment");
  assertChoose(item.practice.check);
  const check = item.check;
  if (check.kind !== "scenario") throw new Error("not a scenario");
  const all = scenarioAnswer(check, check.questions.length);
  assert.ok(answerComplete(check, all));
  assert.equal(evaluateCheck(check, all).passed, true);
  assert.equal(evaluateCheck(check, scenarioAnswer(check, check.passMark!)).passed, true);
  assert.equal(evaluateCheck(check, scenarioAnswer(check, check.passMark! - 1)).passed, false);
  const partial = { ...all };
  delete partial[check.questions[0].id];
  assert.equal(answerComplete(check, partial), false);
});

test("your rollout sheet: practice mark, and the build passes only with every part", () => {
  const item = lesson("your-rollout-sheet");
  assertMark(item.practice.check);
  const check = item.check;
  if (check.kind !== "build") throw new Error("not a build");
  const strong: BuildAnswer = {
    behaviour:
      "By the end of October, every engineer at the three depots books each job in the Fieldline app before leaving the van, and paper job sheets are no longer handed in.",
    order:
      "The Bristol depot goes first because it has the fewest engineers and a manager, Sian, who asked for the tool. After two weeks we fix what Bristol found before Swindon starts, then Bath.",
    who: "Bristol. Owner: Sian Hughes, depot manager. Helper: Raj from the pilot van team. Start: 2 September. Paper sheets stop: 16 September. Check: 28 October.",
    support:
      "Support window 2 to 13 September with Raj on the depot phone each morning, and paper sheets kept as back-up. On 16 September the paper sheet tray is removed from the depot office, announced in the launch email on 2 September.",
    sign: "Six weeks after the stop, on 28 October, I will pick ten jobs from the Bristol scheduling list and check that each one has a completed job record in Fieldline.",
  };
  assert.ok(answerComplete(check, strong));
  assert.equal(evaluateCheck(check, strong).passed, true);
  const weak: BuildAnswer = {
    behaviour: "The app goes live at the depots and training sessions are held for engineers across the region.",
    order: "Bristol, then Swindon, then Bath, in the order the depots were built, one after another over the autumn.",
    who: "Bristol in September, Swindon in October, Bath in November, supported by IT and the vendor as needed.",
    support: "Help is available from the vendor's help centre, and the old way will be phased out over time as people settle in.",
    sign: "Logins in the launch week will be reported to the board by the vendor in their usage figures for the quarter.",
  };
  for (const field of check.fields) {
    const answer = { ...strong, [field.id]: weak[field.id] };
    const outcome = evaluateCheck(check, answer as LessonAnswer);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(field.missing && outcome.detail.includes(field.missing), field.id);
  }
  const noFact = {
    ...strong,
    who: "The depot team, with the owner being the depot manager and the helper being someone from the pilot van team.",
  };
  assert.equal(evaluateCheck(check, noFact).passed, false);
});

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("no string in the course has a dash or a banned word", () => {
  const banned = [
    "delve", "unlock", "unleash", "empower", "elevate", "leverage", "harness", "supercharge", "seamless",
    "robust", "cutting-edge", "landscape", "realm", "tapestry", "journey", "game-changer", "deep dive",
    "dive into", "it's important to note", "in today's",
  ];
  const patterns = banned.map((word) => new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i"));
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const pattern of patterns) assert.ok(!pattern.test(text), `${pattern} in: ${text.slice(0, 60)}`);
  }
});
