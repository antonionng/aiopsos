import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/connecting-the-tools-your-team-already-uses.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lesson(id: string) {
  const found = lessons.find((item) => item.id === id);
  assert.ok(found, `lesson ${id} exists`);
  return found;
}

function correctMark(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function correctScenario(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((option) => option.correct)!.id])
  );
}

function wrongScenario(check: Extract<LessonCheck, { kind: "scenario" }>, wrongCount: number): Record<string, string> {
  const picks = correctScenario(check);
  for (const q of check.questions.slice(0, wrongCount)) {
    picks[q.id] = q.options.find((option) => !option.correct)!.id;
  }
  return picks;
}

const GOOD_EDITS: Record<string, string> = {
  "what-moves-and-what-must-match":
    "Source of truth: the practice management tool for client details.\nIdentifier: email address.\nFields: form 'Full name' to client name; form 'Company' to client company; form 'Phone' to client phone.\nDirection: form to practice management tool only.",
  "what-a-person-still-checks":
    "The web form now feeds the CRM automatically. Each morning, the sales coordinator reviews new CRM contacts and merges any duplicate that shares an email address. Every Friday, the sales coordinator compares the number of form submissions with the number of new CRM records, and if they differ she adds the missing lead by hand.",
};

const STRONG_MAP: BuildAnswer = {
  handoff:
    "I retyped each paid booking from the CRM into Xero to raise an invoice, about fifteen times a week, and a mistake puts a wrong invoice in front of a customer.",
  match:
    "The CRM is the source of truth for customer details. Identifier: the CRM customer ID, in a custom field in Xero. Direction: CRM to Xero only. Fields: company name to contact name, billing email to email, amount to line amount.",
  connection:
    "The built-in Xero integration, under the events team account. It has access to contacts and draft invoices only, and it must not read bank transactions or payroll.",
  inputs:
    "6 paid bookings tested. 4 arrived as they should. One duplicate contact needed a person and passed on retest. One charity invoice used the wrong VAT rate.",
  checks:
    "The finance assistant reviews VAT on charity drafts each morning. Every Friday, the coordinator compares the number of paid bookings with the number of draft invoices and raises any missing invoice by hand.",
};

const THIN_PARTS: BuildAnswer = {
  handoff: "There is a process between our booking system and our finance system that takes too long each week.",
  match:
    "The CRM holds customer details and Xero holds invoices. We move company name, billing email and amount across, in one direction from CRM to Xero.",
  connection:
    "The built-in Xero integration, under the events team account, with access to contacts and draft invoices as agreed with finance.",
  inputs:
    "We tested all of the bookings from this week and most of them looked fine, although a couple were not quite right.",
  checks:
    "The finance assistant reviews VAT on charity drafts each morning and the coordinator looks over the invoices on Friday afternoon.",
};

function checkPasses(check: LessonCheck, where: string) {
  switch (check.kind) {
    case "mark": {
      const right = correctMark(check);
      assert.ok(answerComplete(check, right), where);
      assert.equal(evaluateCheck(check, right).passed, true, where);
      const first = check.sentences[0];
      const wrong = { ...right, [first.id]: first.fail ? "pass" : "fail" } as MarkAnswer;
      assert.equal(evaluateCheck(check, wrong).passed, false, where);
      break;
    }
    case "choose": {
      assert.ok(check.why && check.wrong, where);
      assert.equal(evaluateCheck(check, check.correct).passed, true, where);
      const other = check.correct === "left" ? "right" : "left";
      assert.equal(evaluateCheck(check, other).passed, false, where);
      break;
    }
    case "edit": {
      const good = GOOD_EDITS[where.split(":")[0]];
      assert.ok(good, `good edit for ${where}`);
      assert.equal(evaluateCheck(check, { edited: good }).passed, true, where);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, where);
      break;
    }
    case "scenario": {
      const right = correctScenario(check);
      assert.equal(evaluateCheck(check, right).passed, true, where);
      const needed = check.passMark ?? check.questions.length;
      const below = wrongScenario(check, check.questions.length - needed + 1);
      assert.equal(evaluateCheck(check, below).passed, false, where);
      break;
    }
    case "build": {
      assert.equal(evaluateCheck(check, STRONG_MAP).passed, true, where);
      break;
    }
    default:
      assert.fail(`unexpected check kind in ${where}`);
  }
}

test("every lesson check and practice check passes with its answer and fails with a wrong one", () => {
  for (const item of lessons) {
    checkPasses(item.practice.check, `${item.id}:practice`);
    checkPasses(item.check, `${item.id}:check`);
  }
});

test("the edit checks each fail when one required part is missing", () => {
  const checks = lesson("what-a-person-still-checks").check;
  assert.equal(checks.kind, "edit");
  const noCount =
    "The web form now feeds the CRM automatically. Each morning, the sales coordinator reviews new CRM contacts and merges any duplicate.";
  const outcome = evaluateCheck(checks, { edited: noCount });
  assert.equal(outcome.passed, false);
  assert.match(outcome.detail, /never reached the CRM/);
  const noOwner =
    "The web form now feeds the CRM automatically. Each morning someone merges duplicates, and every Friday someone compares the number of form submissions with new CRM records.";
  assert.equal(evaluateCheck(checks, { edited: noOwner }).passed, false);

  const map = lesson("what-moves-and-what-must-match").practice.check;
  assert.equal(map.kind, "edit");
  const noDirection =
    "Source of truth: the practice management tool for client details.\nIdentifier: email address.\nFields: form 'Full name' to client name; form 'Company' to client company.\nKeep both in sync.";
  assert.equal(evaluateCheck(map, { edited: noDirection }).passed, false);
});

test("the final lesson is the artefact build, and each ruled part is required", () => {
  const last = lessons[lessons.length - 1];
  assert.equal(last.id, COURSE.artefact.lessonId);
  assert.equal(last.check.kind, "build");
  if (last.check.kind !== "build") return;
  for (const field of last.check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} has a rule`);
    assert.ok(field.missing, `${field.id} has a missing sentence`);
    const weak: BuildAnswer = { ...STRONG_MAP, [field.id]: THIN_PARTS[field.id] };
    const outcome = evaluateCheck(last.check, weak as LessonAnswer);
    assert.equal(outcome.passed, false, `${field.id} should be required`);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
    const empty: BuildAnswer = { ...STRONG_MAP, [field.id]: "" };
    assert.equal(answerComplete(last.check, empty), false);
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark", () => {
  const assessment = lessons[lessons.length - 2];
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind !== "scenario") return;
  const { questions, passMark } = assessment.check;
  assert.ok(questions.length >= 6 && questions.length <= 8);
  assert.ok(typeof passMark === "number" && passMark < questions.length);
  assert.ok(passMark / questions.length >= 0.74);
  for (const q of questions) {
    assert.equal(q.options.filter((option) => option.correct).length, 1, q.id);
    for (const option of q.options) assert.ok(option.feedback.length > 20, `${q.id}/${option.id}`);
  }
  const positions = new Set(questions.map((q) => q.options.findIndex((option) => option.correct)));
  assert.ok(positions.size > 1);
});

test("the course has seven or eight lessons, each with the full shape", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  assert.equal(COURSE.slug, "connecting-the-tools-your-team-already-uses");
  assert.equal(new Set(lessons.map((item) => item.id)).size, lessons.length);
  for (const item of lessons) {
    assert.ok(item.title.includes(item.emphasis), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id}: ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.bridge.length > 0, item.id);
  }
});

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => allStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => allStrings(item, out));
  return out;
}

test("no string contains a dash or a banned word", () => {
  const banned = [
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
  const patterns = banned.map((word) => new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i"));
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const pattern of patterns) assert.ok(!pattern.test(text), `${pattern} in: ${text.slice(0, 60)}`);
  }
});
