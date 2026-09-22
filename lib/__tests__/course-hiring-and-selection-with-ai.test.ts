import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/hiring-and-selection-with-ai.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDITS: Record<string, string> = {
  "the-criteria-come-first":
    "You will sell our software to small businesses by phone and video call, and write clear proposals in English. You will visit client sites about twice a month, travelling by any means that suits you. You do not need a driving licence.",
};

const STRONG_STANDARD: BuildAnswer = {
  vacancy: "Customer support advisers in the Leeds contact centre",
  criteria:
    "1. Answers customer queries by phone and chat in clear English. 2. Uses the support system after training. 3. Records each contact accurately. 4. Works flexible shifts between 8am and 8pm.",
  drafted:
    "The advert, drafted from the approved person specification, and interview questions for each criterion.",
  decides:
    "The recruiter decides the sift and reads every application against criteria 1 and 3. The hiring manager and one colleague each score the interview answers against all four criteria before comparing.",
  trail: "The criteria, the evidence, the decision, the reason against the criteria, the tools used, who decided, and the date.",
  ai: "The ranking feature is switched off until the vendor shares testing results. Explanation of scores is an open question.",
  told: "Candidates are told in the advert that AI helps draft adverts and emails, and that people make every decision.",
  owner: "The head of talent owns this standard and reviews it each January.",
};

const WEAK_STANDARD: BuildAnswer = {
  vacancy: "Support",
  criteria: "Someone friendly and organised who fits well with the people already in the team here.",
  drafted: "Whatever the recruiter thinks is helpful at the time.",
  decides: "The hiring manager approves the list and signs it off before anything is sent out.",
  trail: "The outcome, the date, and the name of the manager who approved it.",
  ai: "We use the usual tools sensibly.",
  told: "Nothing in particular at this stage.",
  owner: "The head of talent owns it.",
};

function correctAnswer(check: LessonCheck, key: string) {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as Record<
        string,
        "pass" | "fail"
      >;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)?.id ?? ""])
      );
    case "edit": {
      const edited = GOOD_EDITS[key];
      assert.ok(edited, `no good edit written for ${key}`);
      return { edited };
    }
    case "build":
      return STRONG_STANDARD;
  }
}

function checksOf() {
  return lessons.flatMap((lesson) => [
    { key: `${lesson.id} practice`, editKey: `${lesson.id} practice`, check: lesson.practice.check },
    { key: `${lesson.id} check`, editKey: lesson.id, check: lesson.check },
  ]);
}

test("the course has seven or eight lessons, ending with a scenario assessment and the artefact", () => {
  assert.equal(COURSE.slug, "hiring-and-selection-with-ai");
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind !== "scenario") return;
  assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
  assert.ok(typeof assessment.passMark === "number");
  assert.ok(assessment.passMark! < assessment.questions.length);
  for (const question of assessment.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
  }
});

test("every lesson has the full shape, and its emphasis is in its title", () => {
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("every check and practice passes with its correct answer", () => {
  for (const { key, editKey, check } of checksOf()) {
    const answer = correctAnswer(check, editKey);
    assert.ok(answerComplete(check, answer), `${key} should be complete`);
    assert.equal(evaluateCheck(check, answer).passed, true, key);
  }
});

test("every check and practice fails with a wrong answer", () => {
  for (const { key, check } of checksOf()) {
    switch (check.kind) {
      case "mark": {
        for (const sentence of check.sentences) {
          const answer = correctAnswer(check, key) as Record<string, "pass" | "fail">;
          answer[sentence.id] = sentence.fail ? "pass" : "fail";
          assert.equal(evaluateCheck(check, answer).passed, false, `${key}: ${sentence.id}`);
        }
        break;
      }
      case "choose": {
        const wrong = check.correct === "left" ? "right" : "left";
        const outcome = evaluateCheck(check, wrong);
        assert.equal(outcome.passed, false, key);
        assert.ok(check.wrong, `${key} needs wrong feedback`);
        break;
      }
      case "scenario": {
        const answer = correctAnswer(check, key) as Record<string, string>;
        const misses = check.questions.length - (check.passMark ?? check.questions.length) + 1;
        for (const question of check.questions.slice(0, misses)) {
          answer[question.id] = question.options.find((o) => !o.correct)!.id;
        }
        assert.equal(evaluateCheck(check, answer).passed, false, key);
        break;
      }
      case "edit": {
        assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${key} unchanged`);
        break;
      }
      case "build": {
        assert.equal(evaluateCheck(check, {}).passed, false, key);
        break;
      }
      case "order":
        assert.fail(`${key} should not be an order check`);
    }
  }
});

test("the advert edit fails when any required part is missing", () => {
  const lesson = lessons.find((l) => l.id === "the-criteria-come-first")!;
  const check = lesson.check;
  assert.equal(check.kind, "edit");
  const noLicenceLimit =
    "You will sell our software to small businesses by phone and video call, and write clear proposals in English. You will visit client sites about twice a month by any means. A clean driving licence is required.";
  assert.equal(evaluateCheck(check, { edited: noLicenceLimit }).passed, false);
  const noProposals =
    "You will sell our software to small businesses by phone and video call in clear English. You will visit client sites about twice a month. You do not need a driving licence.";
  assert.equal(evaluateCheck(check, { edited: noProposals }).passed, false);
  const noSelling =
    "You will write clear proposals in English and visit client sites about twice a month. You do not need a driving licence.";
  assert.equal(evaluateCheck(check, { edited: noSelling }).passed, false);
  const noTravel =
    "You will sell our software by phone and video call and write clear proposals in English. You do not need a driving licence.";
  assert.equal(evaluateCheck(check, { edited: noTravel }).passed, false);
  const noClear =
    "You will sell our software by phone and video call and write proposals in English. You will visit client sites about twice a month. You do not need a driving licence.";
  assert.equal(evaluateCheck(check, { edited: noClear }).passed, false);
});

test("the selection standard passes when strong and fails when any ruled part is weak", () => {
  const check = lessons[lessons.length - 1].check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.equal(evaluateCheck(check, STRONG_STANDARD).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const answer = { ...STRONG_STANDARD, [field.id]: WEAK_STANDARD[field.id] };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
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

test("no string in the course has a dash or a banned word", () => {
  const all = strings(COURSE);
  for (const text of all) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      assert.ok(!pattern.test(text.replace(/\u2019/g, "'")), `banned "${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
