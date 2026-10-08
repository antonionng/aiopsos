import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/secure-use-of-ai-tools-at-work.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

function lesson(id: string) {
  const found = lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctMarks(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function correctPicks(check: Extract<LessonCheck, { kind: "scenario" }>): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => {
      const right = q.options.filter((o) => o.correct);
      assert.equal(right.length, 1, `${q.id} must have exactly one right option`);
      return [q.id, right[0].id];
    })
  );
}

const GOOD_EDITS: Record<string, string> = {
  "the-rule":
    "Approved tools: use the AI assistant in our productivity suite, signed in with your work account. Personal AI accounts must not be used for any work information. Never paste: tenant or staff personal data, health information, unreleased rent figures, passwords, or access keys. With care: tenancy documents only after removing tenant names and addresses. Output: check every figure against the rent ledger. Ask and report: speak to the team leader, Dan Mercer, if unsure.",
  "run-it-on-one-prompt":
    "Prompt: summarise the payment terms in a draft supplier contract from Fairholme Packaging.\nTool: the productivity suite assistant with a work account. Approved.\nNever paste: the contract includes the supplier's sort code and account number. Removed before pasting.\nWith care: the supplier's name and the two signatories replaced with 'Supplier', 'Signatory A', and 'Signatory B'.\nOutput: the summary is checked against the contract's payment clauses before it is shared.\nReport: nothing to report, as the bank details were removed first.\nDecision: used in an edited form.",
};

const STRONG_BUILD: BuildAnswer = {
  "approved-tools":
    "The assistant in our productivity suite, signed in with a work account managed by IT. Personal AI accounts must not be used for any work information.",
  "never-paste":
    "Customer and staff personal data, health or other special category data, unreleased figures, client confidential material, and passwords, keys, or other secrets.",
  "with-care":
    "Contract text and briefs may go into the approved tool only after removing client names, signatories, and account numbers.",
  output:
    "Every figure is checked against the reporting dashboard, code is tested on a copy, and customer messages are read in full before they are sent.",
  "ask-and-report":
    "Ask the team leader, Sam Ortiz, when unsure. Report any mistaken paste to IT the same day, and do not delete the conversation until IT has seen it.",
  "prompt-tested":
    "A team member wanted to paste a supplier's draft contract into the approved assistant to summarise the payment terms.",
  result:
    "Tool: approved, work account. Never paste: bank details found and removed. With care: supplier name and signatories replaced. Output: summary checked against the clauses. Report: nothing to report. Decision: used in an edited form.",
};

const WEAK_BUILD: BuildAnswer = {
  "approved-tools": "Use the assistant in our office suite with care at all times.",
  "never-paste": "Anything that feels confidential to the team or the company.",
  "with-care": "Client material may go in if it seems reasonable to you.",
  output: "Use what comes back once you are happy with it.",
  "ask-and-report": "Use common sense if something goes wrong.",
  "prompt-tested": "Something one of us did at some point last month.",
  result: "It seemed fine to me overall, and nobody had any concerns about it at the time we looked.",
};

function assertPassesAndFails(lessonId: string, where: "practice" | "check", check: LessonCheck) {
  const label = `${lessonId} ${where}`;
  switch (check.kind) {
    case "mark": {
      const right = correctMarks(check);
      assert.ok(answerComplete(check, right), label);
      assert.equal(evaluateCheck(check, right).passed, true, label);
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), `${label} uses both labels`);
      for (const sentence of check.sentences) {
        const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
        assert.equal(evaluateCheck(check, wrong).passed, false, `${label} ${sentence.id}`);
      }
      break;
    }
    case "choose": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      const other = check.correct === "left" ? "right" : "left";
      assert.equal(evaluateCheck(check, other).passed, false, label);
      assert.ok(check.why && check.wrong, `${label} has why and wrong`);
      break;
    }
    case "edit": {
      const good = GOOD_EDITS[lessonId];
      assert.ok(good, `${label} needs a good edit in the test`);
      assert.equal(evaluateCheck(check, { edited: good }).passed, true, `${label}: ${evaluateCheck(check, { edited: good }).detail}`);
      assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${label} unchanged`);
      assert.equal(answerComplete(check, { edited: check.start }), false, label);
      for (const group of [...check.limits, ...check.keep]) {
        const stripped = group.any.reduce(
          (text, word) => text.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "xxxx"),
          good
        );
        assert.equal(evaluateCheck(check, { edited: stripped }).passed, false, `${label} without ${group.id}`);
      }
      break;
    }
    case "build": {
      assert.equal(evaluateCheck(check, STRONG_BUILD).passed, true, evaluateCheck(check, STRONG_BUILD).detail);
      for (const field of check.fields) {
        assert.ok(field.rule || field.any?.length, `${field.id} has a rule or an any list`);
        assert.ok(field.missing, `${field.id} has a missing sentence`);
        const weak = { ...STRONG_BUILD, [field.id]: WEAK_BUILD[field.id] };
        const outcome = evaluateCheck(check, weak);
        assert.equal(outcome.passed, false, `${label} weak ${field.id}`);
        assert.ok(outcome.detail.includes(field.missing ?? ""), `${label} names ${field.id}`);
        assert.equal(answerComplete(check, { ...STRONG_BUILD, [field.id]: "" }), false);
      }
      break;
    }
    case "scenario": {
      const picks = correctPicks(check);
      assert.equal(evaluateCheck(check, picks).passed, true, label);
      const needed = check.passMark ?? check.questions.length;
      const failing = { ...picks };
      const wrongCount = check.questions.length - needed + 1;
      for (const q of check.questions.slice(0, wrongCount)) {
        failing[q.id] = q.options.find((o) => !o.correct)!.id;
      }
      assert.equal(evaluateCheck(check, failing).passed, false, `${label} below pass mark`);
      break;
    }
    case "order": {
      assert.equal(evaluateCheck(check, check.correct).passed, true, label);
      assert.equal(evaluateCheck(check, [...check.correct].reverse()).passed, false, label);
      break;
    }
  }
}

test("every practice and check passes with the right answer and fails with a wrong one", () => {
  for (const item of lessons) {
    assertPassesAndFails(item.id, "practice", item.practice.check);
    assertPassesAndFails(item.id, "check", item.check);
  }
});

test("the course has seven or eight lessons, ending with the assessment and the artefact", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    const ratio = assessment.passMark / assessment.questions.length;
    assert.ok(ratio >= 0.75 && ratio <= 0.9, `pass mark ratio ${ratio}`);
    const positions = new Set(
      assessment.questions.map((q) => q.options.findIndex((o) => o.correct))
    );
    assert.ok(positions.size >= 3, "the right option moves between positions");
    for (const q of assessment.questions) {
      assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
      for (const option of q.options) assert.ok(option.feedback.length > 40, `${q.id} ${option.id}`);
    }
  }
});

test("every lesson has the full shape", () => {
  assert.equal(COURSE.slug, "secure-use-of-ai-tools-at-work");
  assert.equal(new Set(lessons.map((item) => item.id)).size, lessons.length);
  for (const item of lessons) {
    assert.ok(item.title.includes(item.emphasis), `${item.id} emphasis`);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, `${item.id} sections`);
    for (const section of item.sections) {
      assert.ok(section.paragraphs.length >= 2, `${item.id} ${section.heading}`);
    }
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4, item.id);
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel, item.id);
    assert.ok(item.practice.intro.length > 0 && item.bridge.length > 0, item.id);
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

test("no string in the course uses a dash or a banned word", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    const clean = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
