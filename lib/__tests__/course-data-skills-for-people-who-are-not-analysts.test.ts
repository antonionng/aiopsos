import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/data-skills-for-people-who-are-not-analysts.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDITS: Record<string, string> = {
  "the-question-before-you-act:check":
    "I'm deciding on Friday 19 September whether to book extra classroom sessions for the Manchester team. The training report says 72% of Manchester contact centre staff completed the data protection module by 31 August. Does that figure include staff who joined in August?",
};

const STRONG_CHECKLIST: BuildAnswer = {
  "q-claim": "What exactly was counted, of whom, over what period, and against what?",
  "q-source": "Which system is it from, what is the definition, when was it taken, and who owns it?",
  "q-rows": "How many rows should there be, and has a filter or export limit removed any?",
  "q-comparison": "Are both sides counted the same way, over periods of the same length?",
  "q-question": "What am I deciding, and what one fact would I ask the owner for?",
  "a-claim":
    "Invoices paid more than 30 days late by customers of the Midlands office in August, 11% against 8% in July.",
  "a-source":
    "Source: the finance system. Definition: paid more than 30 days after the due date. Date: extract taken on 2 September. Owner: the credit control lead.",
  "a-rows": "The table has 418 rows, and the finance system shows 418 invoices for August. No filter is on.",
  "a-comparison": "Unfair as it stands, because August had a bank holiday and July did not, so compare working days.",
  "a-question": "Does the 11% include invoices that were disputed and put on hold?",
  decision: "Ask first, because disputed invoices would change whether I chase the Midlands accounts.",
};

const WEAK = "I would look at this part carefully before going ahead with anything.";

function correctMark(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function correctScenario(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
  );
}

function assertCheck(check: LessonCheck, key: string) {
  switch (check.kind) {
    case "mark": {
      const right = correctMark(check);
      assert.ok(answerComplete(check, right), key);
      assert.equal(evaluateCheck(check, right).passed, true, key);
      const first = check.sentences[0];
      const wrong = { ...right, [first.id]: first.fail ? "pass" : "fail" } as MarkAnswer;
      assert.equal(evaluateCheck(check, wrong).passed, false, key);
      assert.ok(check.passLabel && check.failLabel, key);
      return;
    }
    case "choose": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, key);
      assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, key);
      assert.ok(check.why && check.wrong, key);
      return;
    }
    case "order": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, key);
      assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, key);
      return;
    }
    case "scenario": {
      const right = correctScenario(check);
      assert.ok(answerComplete(check, right), key);
      assert.equal(evaluateCheck(check, right).passed, true, key);
      const needed = check.passMark ?? check.questions.length;
      const toMiss = check.questions.length - needed + 1;
      const below = { ...right };
      for (const q of check.questions.slice(0, toMiss)) {
        below[q.id] = q.options.find((o) => !o.correct)!.id;
      }
      assert.equal(evaluateCheck(check, below).passed, false, key);
      return;
    }
    case "edit": {
      const good = GOOD_EDITS[key];
      assert.ok(good, `${key} needs a good edit in the test`);
      assert.ok(answerComplete(check, { edited: good }), key);
      assert.equal(evaluateCheck(check, { edited: good }).passed, true, key);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, key);
      for (const group of [...check.keep, ...check.limits]) {
        const stripped = group.any.reduce(
          (text, word) => text.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "x"),
          good
        );
        assert.equal(evaluateCheck(check, { edited: stripped }).passed, false, `${key} without ${group.id}`);
      }
      return;
    }
    case "build": {
      assert.equal(evaluateCheck(check, STRONG_CHECKLIST).passed, true, key);
      assert.ok(answerComplete(check, STRONG_CHECKLIST), key);
      for (const field of check.fields) {
        assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
        assert.ok(field.missing, `${field.id} needs a missing sentence`);
        const answer = { ...STRONG_CHECKLIST, [field.id]: WEAK };
        const outcome = evaluateCheck(check, answer);
        assert.equal(outcome.passed, false, `${key} with a weak ${field.id}`);
        assert.ok(outcome.detail.includes(field.missing!), field.id);
      }
      return;
    }
  }
}

test("every practice and lesson check passes with its answer and fails with a wrong one", () => {
  for (const lesson of lessons) {
    assertCheck(lesson.practice.check, `${lesson.id}:practice`);
    assertCheck(lesson.check, `${lesson.id}:check`);
  }
});

test("the course has the teaching lessons, an assessment and an artefact in that order", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    const ratio = assessment.passMark! / assessment.questions.length;
    assert.ok(ratio >= 0.7 && ratio <= 0.9);
    for (const q of assessment.questions) {
      assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
      assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
    }
  }
});

test("every lesson has its parts, and the emphasis word is in the title", () => {
  const ids = new Set<string>();
  for (const lesson of lessons) {
    assert.ok(!ids.has(lesson.id), lesson.id);
    ids.add(lesson.id);
    assert.ok(lesson.title.toLowerCase().includes(lesson.emphasis.toLowerCase()), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) {
      assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    }
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("mark labels are taught in the lesson text", () => {
  for (const lesson of lessons) {
    const text = lesson.sections.flatMap((s) => s.paragraphs).join(" ");
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "mark") continue;
      assert.ok(text.includes(check.passLabel), `${lesson.id}: ${check.passLabel}`);
      assert.ok(text.includes(check.failLabel), `${lesson.id}: ${check.failLabel}`);
    }
  }
});

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
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

test("no string contains a dash or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text}`);
    }
  }
});