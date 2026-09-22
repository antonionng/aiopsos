import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/applying-ai-in-daily-work.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const FILLER = "This part is written out in plain words for a colleague to read later.";

const GOOD_EDITS: Record<string, string> = {
  "draft:practice":
    "Draft the Monday update on the office move for Carol Price, the facilities director, who reads it on her phone. Facts: the crates arrive on Tuesday 14 October; 38 of the 45 desks are labelled; the goods lift is booked from 7am on Wednesday; no date has been agreed for moving the server cabinet. Do not add any dates or figures I have not listed. Five short lines: status, done, next, open, what I need from Carol.",
  "decide:practice":
    "Here are three quotes for twelve new starter laptops, from Brennan IT, Coldwell Supplies, and Harrow Tech. Our criteria are: price under £9,000 for all twelve, delivery before Monday 3 November, three years of on-site support, and set up with our standard build. Set each supplier against each criterion in a table. Where a quote does not tell you, write 'not stated'. Then list the questions I should ask. Do not recommend one.",
};

const WEAK_EDITS: Record<string, string> = {
  "draft:practice":
    "Draft the Monday update on the office move for Carol Price, the facilities director. Facts: the crates arrive on Tuesday 14 October and 38 of the 45 desks are labelled. Five short lines.",
  "decide:practice":
    "Here are three quotes for twelve new starter laptops, from Brennan IT, Coldwell Supplies, and Harrow Tech. Our criteria are price under £9,000 and delivery before 3 November. Write 'not stated' for gaps. Which one should we buy?",
};

const STRONG_BUILDS: Record<string, BuildAnswer> = {
  "a-weekly-loop:practice": {
    task: "The Friday status update to the sponsor, every Friday morning. Move: draft from my own notes.",
    check: "Every date and risk in the draft is one I listed.",
  },
  "a-weekly-loop:check": {
    "task-1":
      "Friday status update to the sponsor, every Friday morning. Move: draft from my notes. Check: every date and risk is one I listed.",
    "task-2":
      "Monday stand-up notes, Monday after the call. Move: summarise into decisions, actions with owners, and open questions. Check: every sentence is in the notes.",
    "task-3":
      "Monthly supplier summary, first Tuesday of the month. Move: decide, with a comparison table against our four criteria and 'not stated' for gaps. Check: I choose the rating.",
    "not-with-the-tool": "My one-to-ones with Aisha and Ben, because they are a judgement about a person.",
    review:
      "Friday at 4pm, ten minutes. Did I use the tool on each task, did the check catch anything, and should a move change?",
  },
};

type Named = { key: string; check: LessonCheck };

function allChecks(): Named[] {
  return COURSE.lessons.flatMap((lesson) => [
    { key: `${lesson.id}:practice`, check: lesson.practice.check },
    { key: `${lesson.id}:check`, check: lesson.check },
  ]);
}

function scenarioAnswer(check: Extract<LessonCheck, { kind: "scenario" }>, wrongCount: number) {
  const picks: Record<string, string> = {};
  check.questions.forEach((question, index) => {
    const right = question.options.find((option) => option.correct);
    const wrong = question.options.find((option) => !option.correct);
    assert.ok(right && wrong);
    picks[question.id] = index < wrongCount ? wrong.id : right.id;
  });
  return picks;
}

test("every check passes with its correct answer and fails with a wrong one", () => {
  for (const { key, check } of allChecks()) {
    switch (check.kind) {
      case "mark": {
        const right: MarkAnswer = {};
        for (const sentence of check.sentences) right[sentence.id] = sentence.fail ? "fail" : "pass";
        assert.ok(answerComplete(check, right), key);
        assert.equal(evaluateCheck(check, right).passed, true, key);
        for (const sentence of check.sentences) {
          const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
          assert.equal(evaluateCheck(check, wrong).passed, false, `${key} ${sentence.id}`);
        }
        assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), key);
        break;
      }
      case "choose": {
        assert.ok(check.why && check.wrong, key);
        assert.equal(evaluateCheck(check, check.correct).passed, true, key);
        assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, key);
        break;
      }
      case "edit": {
        const good = GOOD_EDITS[key];
        assert.ok(good, `no good edit for ${key}`);
        assert.ok(answerComplete(check, { edited: good }), key);
        assert.equal(evaluateCheck(check, { edited: good }).passed, true, key);
        assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, key);
        assert.equal(evaluateCheck(check, { edited: WEAK_EDITS[key] }).passed, false, `${key} weak`);
        break;
      }
      case "build": {
        const strong = STRONG_BUILDS[key];
        assert.ok(strong, `no strong build for ${key}`);
        assert.ok(answerComplete(check, strong), key);
        assert.equal(evaluateCheck(check, strong).passed, true, key);
        for (const field of check.fields) {
          assert.ok(field.rule || field.any?.length, `${key} ${field.id} has no rule`);
          assert.ok(field.missing, `${key} ${field.id} has no missing sentence`);
          assert.equal(evaluateCheck(check, { ...strong, [field.id]: "" }).passed, false, `${key} ${field.id} empty`);
          assert.equal(
            evaluateCheck(check, { ...strong, [field.id]: FILLER }).passed,
            false,
            `${key} ${field.id} filler`
          );
        }
        break;
      }
      case "scenario": {
        const needed = check.passMark ?? check.questions.length;
        const all = scenarioAnswer(check, 0);
        assert.ok(answerComplete(check, all), key);
        assert.equal(evaluateCheck(check, all).passed, true, key);
        const below = scenarioAnswer(check, check.questions.length - needed + 1);
        assert.equal(evaluateCheck(check, below).passed, false, key);
        break;
      }
      case "order": {
        assert.equal(evaluateCheck(check, check.correct).passed, true, key);
        assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, key);
        break;
      }
    }
  }
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    assert.ok(assessment.passMark / assessment.questions.length >= 0.75);
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
      assert.ok(question.options.every((option) => option.feedback.length > 20), question.id);
    }
  }
});

test("every lesson has the full shape and an emphasis word from its title", () => {
  const ids = new Set<string>();
  COURSE.lessons.forEach((lesson, index) => {
    assert.ok(!ids.has(lesson.id), lesson.id);
    ids.add(lesson.id);
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.practice.intro.length > 0, lesson.id);
    assert.ok(lesson.bridge.length > 0 || index === COURSE.lessons.length - 1, lesson.id);
  });
});

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
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

test("no string in the course uses a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
