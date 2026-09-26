import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/technology-decisions-for-non-technical-leaders.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDIT =
  "Proposal: new CRM for the sales team at Harlow Fixings. What we are buying: account managers will log every customer call in the CRM instead of their own spreadsheets, and the sales director will see the pipeline each Monday without asking for a report. Five questions: the first, third and fourth are answered; the second leaves it open, because nobody has said when the spreadsheets stop; the fifth leaves it open, because the export terms have not been seen. Not used: the Sales Operations Manager. Not working: the IT Manager. Data exposed: the Data Protection Officer. Supplier failure: the Finance Director. Ninety-day test: the share of customer calls logged in the CRM, from a starting point of 0% today, with a threshold of at least 75%, checked on 30 June; below 50% we pause and retrain. Decision: approve with conditions, because the proposal answers three of the five questions; the Sales Director will confirm the date the spreadsheets stop before signature on 14 March.";

const STRONG_NOTE: BuildAnswer = {
  buying:
    "Engineers will receive the next day's jobs on their phones by 6pm instead of phoning the depot at 7am, and the planners will no longer build routes by hand.",
  questions:
    "1 answered: five visits a day instead of four. 2 answered: paper job sheets stop on 1 May. 3 answered: the Planning Lead, one day a week. 4 answered in part: licence known, exit cost not yet known. 5 leaves it open: data export on exit not confirmed.",
  owners:
    "Not used: the Planning Lead. Not working: the IT Manager. Data exposed: the Data Protection Officer. Supplier failure: the Finance Director.",
  test: "Measure: visits per engineer per day. Starting point: 4.0 today. Threshold: at least 4.6. Checked on 31 July. Continue if met, retrain planners if between 4.2 and 4.6, stop below 4.2.",
  decision:
    "Approve with conditions, because questions 1 to 4 are answered; the Finance Director confirms data export on exit before signature on 12 March.",
};

const WEAK_FIELD: Record<string, string> = {
  buying: "A best-in-class cloud platform with dashboards, mobile apps and advanced analytics included.",
  questions:
    "We looked at cost, supplier reputation, the people involved, the timeline and security. All seemed fine to the board overall.",
  owners: "The programme board and the supplier's customer success team will jointly look after everything.",
  test: "We will look at how things are going after a while and report back to the board with findings.",
  decision: "The board liked the proposal and the demonstration, and the price seemed reasonable to everyone.",
};

function correctMark(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
}

function allChecks(): { name: string; check: LessonCheck }[] {
  return lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ]);
}

test("every check and practice passes with its correct answer and fails with a wrong one", () => {
  for (const { name, check } of allChecks()) {
    switch (check.kind) {
      case "mark": {
        const right = correctMark(check);
        assert.equal(answerComplete(check, right), true, name);
        assert.equal(evaluateCheck(check, right).passed, true, name);
        for (const sentence of check.sentences) {
          const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
          assert.equal(evaluateCheck(check, wrong).passed, false, `${name} ${sentence.id}`);
        }
        break;
      }
      case "choose": {
        const other = check.correct === "left" ? "right" : "left";
        assert.equal(evaluateCheck(check, check.correct).passed, true, name);
        assert.equal(evaluateCheck(check, other).passed, false, name);
        assert.ok(check.wrong, `${name} needs wrong feedback`);
        break;
      }
      case "edit": {
        assert.equal(evaluateCheck(check, { edited: GOOD_EDIT }).passed, true, name);
        assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, name);
        const noOwners = `${check.start} Outcome: reps will log calls in the CRM instead of spreadsheets. The second question leaves it open. Test: starting point 0%, threshold at least 75%. Decision: not yet, because questions are open.`;
        assert.equal(evaluateCheck(check, { edited: noOwners }).passed, false, name);
        break;
      }
      case "scenario": {
        const right = Object.fromEntries(
          check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
        );
        assert.equal(evaluateCheck(check, right).passed, true, name);
        const below = { ...right };
        for (const q of check.questions.slice(0, 2)) {
          below[q.id] = q.options.find((o) => !o.correct)!.id;
        }
        assert.equal(evaluateCheck(check, below).passed, false, name);
        break;
      }
      case "build": {
        assert.equal(evaluateCheck(check, STRONG_NOTE).passed, true, name);
        for (const field of check.fields) {
          assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or word list`);
          assert.ok(field.missing, `${field.id} needs a missing sentence`);
          const weak = { ...STRONG_NOTE, [field.id]: WEAK_FIELD[field.id] };
          assert.equal(evaluateCheck(check, weak).passed, false, `${name} ${field.id}`);
        }
        break;
      }
      default:
        assert.fail(`${name} uses an unexpected check kind`);
    }
  }
});

test("each scenario question has exactly one right option with feedback on every option", () => {
  const check = lessons[lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  for (const q of check.questions) {
    assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
    assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
    for (const o of q.options) assert.ok(o.feedback.length > 20, `${q.id} ${o.id}`);
  }
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    assert.ok(assessment.passMark! >= Math.ceil(assessment.questions.length * 0.75));
    assert.ok(assessment.passMark! < assessment.questions.length);
  }
});

test("every lesson title contains its emphasis word and lesson ids are unique", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
  }
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
});

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
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
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
