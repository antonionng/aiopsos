import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-for-hr-and-people-teams.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const STRONG_BUILDS: Record<string, BuildAnswer> = {
  "the-hold-list:practice": {
    information: "Occupational health referral forms",
    why: "Because they contain health data about a named worker.",
    instead: "Instead I write the referral myself from the blank form.",
  },
  "the-hold-list:check": {
    "rewrite-source":
      "Turn the approved hybrid working policy into a guide for new starters, using the policy text only.",
    "rewrite-reader-owner":
      "The reader is a new starter; the owner is the HR adviser, who reads the guide against the policy.",
    "rewrite-limit":
      "Do not add any number of days, rate of pay, or entitlement that is not in the policy.",
    "summary-source":
      "Summarise exit interview themes that a colleague has already stripped of names, roles, and dates.",
    "summary-reader-owner":
      "The reader is the leadership team; the owner is the head of people, who checks it against the themes.",
    "summary-limit":
      "Report only themes in the list, and do not estimate numbers or name any team under ten people.",
    "template-source":
      "Produce a blank interview invitation from our recruitment template, with placeholders for name, role, and date.",
    "template-reader-owner":
      "The reader is an external candidate; the owner is the recruitment coordinator, who reads it before use.",
    "template-limit": "Do not add any real name, date, or reason; use placeholders only.",
    "hold-special":
      "Never paste occupational health referral forms, because they contain health data about a named worker. Instead I write the referral myself from the blank form.",
    "hold-case":
      "Never paste grievance investigation notes, because they are case detail about identifiable people. Instead I describe the process from the procedure myself.",
    "hold-more":
      "Never paste screenshots from the HR system, because they show names, pay, and absence together. Instead I copy only the policy text I need.\nNever paste passport scans, because they are identity documents. Instead I describe the check from the right to work procedure.\nDo not paste pay slips, because individual pay is held. Instead I use a blank pay query template with placeholders.",
  },
};

const GOOD_EDITS: Record<string, string> = {
  "repair-the-prompt:check":
    "Source: our return-to-work policy, which says a return-to-work meeting takes place on the first day back. Task: draft a short letter to [name] confirming their return to work on [date]. Do not mention any health condition, operation, or reason for absence. Do not mention pay or grade. Output: a letter of four sentences.",
};

const PSEUDONYM_EDITS: Record<string, string> = {
  "repair-the-prompt:check":
    "Draft a letter to Employee T in payroll confirming his return to work on 3 March after his operation. He is on grade 4. Our policy says a return-to-work meeting takes place on the first day back.",
};

type Named = { key: string; check: LessonCheck };

function allChecks(): Named[] {
  return lessons.flatMap((lesson) => [
    { key: `${lesson.id}:practice`, check: lesson.practice.check },
    { key: `${lesson.id}:check`, check: lesson.check },
  ]);
}

function correctMark(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
}

function correctScenario(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
  );
}

test("the course has seven lessons and the artefact is the final build lesson", () => {
  assert.equal(COURSE.slug, "ai-for-hr-and-people-teams");
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind === "build") {
    for (const field of last.check.fields) {
      assert.ok(field.rule || field.any?.length, `${field.id} has no rule`);
      assert.ok(field.missing, `${field.id} has no missing sentence`);
    }
  }
});

test("the second-to-last lesson is a scenario assessment with a pass mark", () => {
  const check = lessons[lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  const ratio = check.passMark / check.questions.length;
  assert.ok(ratio >= 0.74 && ratio <= 0.9, `pass mark ratio ${ratio}`);
  for (const question of check.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
  }
});

test("every lesson has the full shape and its emphasis appears in the title", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("every mark check passes when right and fails with one wrong mark", () => {
  for (const { key, check } of allChecks()) {
    if (check.kind !== "mark") continue;
    const right = correctMark(check);
    assert.ok(evaluateCheck(check, right).passed, key);
    const first = check.sentences[0];
    const wrong = { ...right, [first.id]: right[first.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
    assert.equal(evaluateCheck(check, wrong).passed, false, key);
  }
});

test("every choose check passes with the stronger work and fails with the other", () => {
  for (const { key, check } of allChecks()) {
    if (check.kind !== "choose") continue;
    assert.ok(check.wrong, key);
    assert.ok(evaluateCheck(check, check.correct).passed, key);
    const other = check.correct === "left" ? "right" : "left";
    assert.equal(evaluateCheck(check, other).passed, false, key);
  }
});

test("the scenario passes when all correct and fails below the pass mark", () => {
  for (const { key, check } of allChecks()) {
    if (check.kind !== "scenario") continue;
    const right = correctScenario(check);
    assert.ok(evaluateCheck(check, right).passed, key);
    const needed = check.passMark ?? check.questions.length;
    const misses = check.questions.length - needed + 1;
    const below = { ...right };
    for (const question of check.questions.slice(0, misses)) {
      below[question.id] = question.options.find((o) => !o.correct)!.id;
    }
    assert.equal(evaluateCheck(check, below).passed, false, key);
  }
});

test("every build check passes with a strong answer and fails when each ruled part is missing", () => {
  for (const { key, check } of allChecks()) {
    if (check.kind !== "build") continue;
    const strong = STRONG_BUILDS[key];
    assert.ok(strong, `no strong answer for ${key}`);
    assert.ok(answerComplete(check, strong), key);
    assert.ok(evaluateCheck(check, strong).passed, `${key}: ${evaluateCheck(check, strong).detail}`);
    for (const field of check.fields) {
      if (!field.rule && !field.any?.length) continue;
      const weak = { ...strong, [field.id]: "x".repeat(field.min + 10) };
      const outcome = evaluateCheck(check, weak);
      assert.equal(outcome.passed, false, `${key}: ${field.id}`);
      assert.ok(outcome.detail.includes(field.missing!), `${key}: ${field.id}`);
    }
  }
});

test("every edit check passes with a good repair and fails unchanged or with a pseudonym", () => {
  for (const { key, check } of allChecks()) {
    if (check.kind !== "edit") continue;
    const good = GOOD_EDITS[key];
    assert.ok(good, `no good edit for ${key}`);
    const outcome = evaluateCheck(check, { edited: good });
    assert.ok(outcome.passed, `${key}: ${outcome.detail}`);
    assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, key);
    assert.equal(answerComplete(check, { edited: check.start }), false, key);
    const pseudonym = PSEUDONYM_EDITS[key];
    if (pseudonym) assert.equal(evaluateCheck(check, { edited: pseudonym }).passed, false, key);
    for (const group of [...check.keep, ...check.limits]) {
      assert.ok(group.missing.length > 0, `${key}: ${group.id}`);
    }
  }
});

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
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
  "it['\u2019]s important to note",
  "in today['\u2019]s",
];

test("no string in the course contains a dash or a banned word", () => {
  const strings = collectStrings(COURSE);
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      assert.ok(!new RegExp(`\\b${word}\\b`, "i").test(text), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
