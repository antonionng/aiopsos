import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/eu-ai-act-literacy-for-hr-and-l-and-d.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

type Case = { name: string; check: LessonCheck };

function allChecks(): Case[] {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ]);
}

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctAnswer(check: LessonCheck): LessonAnswer | null {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((option) => option.correct)!.id])
      );
    default:
      return null;
  }
}

const GOOD_ROLE_EDIT =
  "Role: HR advisers. System and use: the chat assistant, used to draft summaries of policy for managers. Who is affected: the employees and managers who receive the advice. What they must be able to do: check each summary against the policy before sending it. Measure: a one-hour session with practice on three summaries, and a one-page guide. Owner: head of HR. Review date: in six months, or when the assistant is updated.";

const STRONG_ARTEFACT: BuildAnswer = {
  "row-one":
    "Role: recruiters. System and use: the ranking feature in the applicant tracking system, used to order applications. Who is affected: applicants. What they must be able to do: review an application the ranking placed low and record the reason for an override. Measure: a session on the feature with practice on five anonymised applications. Owner: head of talent. Review date: March, or when the vendor changes the feature.",
  "row-two":
    "Role: line managers. System and use: the writing assistant in the office software, used to draft emails and meeting notes. Who is affected: their team members. What they must be able to do: check a draft for invented facts before sending. Measure: a forty-five-minute practical session and a one-page guide. Owner: head of L&D. Review date: in 6 months.",
  "row-three":
    "Role: HR advisers. System and use: the chat assistant, used to draft policy summaries for managers. Who is affected: employees who receive the advice. What they must be able to do: check each summary against the policy. Measure: a one-hour workshop with three practice summaries. Owner: head of HR. Review date: September.",
  "record-outline":
    "For each measure: who took part, the role map row, the measure, the date, what each person did in the check, the next review, and who holds the record.",
  "not-claimed":
    "This role map and record outline are evidence of the measures we have planned and taken. They are not a statement of compliance with the EU AI Act.",
  "legal-questions": "Our in-house legal team.",
};

const WEAK_PARTS: BuildAnswer = {
  "row-one":
    "role: recruiters. system and use: the ranking feature, used to order applications for the hiring manager. what they must be able to do: review a low ranked application. measure: a session on the feature. owner: head of talent. review date: to be agreed.",
  "row-two":
    "Role: line managers. System and use: the writing assistant in the office software, used to draft emails. What they must be able to do: check a draft. Measure: training. Owner: head of L&D. Review date: in 6 months, or sooner if needed.",
  "row-three":
    "role: hr advisers. system and use: the chat assistant, used to draft policy summaries. what they must be able to do: check each summary. measure: a one hour workshop with practice. owner: head of hr. review date: to be agreed.",
  "record-outline":
    "For each measure: who took part, the role map row, the measure, the date, what each person did in the check, and who holds the record.",
  "not-claimed":
    "We have done careful work on AI literacy this year and we are proud of the progress our teams have made.",
  "legal-questions": "Ask the HR director.",
};

test("every mark, choose, and scenario check passes with its correct answer", () => {
  for (const { name, check } of allChecks()) {
    const answer = correctAnswer(check);
    if (answer === null) continue;
    assert.ok(answerComplete(check, answer), `${name} should be complete`);
    assert.equal(evaluateCheck(check, answer).passed, true, name);
  }
});

test("every mark check fails when one sentence is marked wrongly", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "mark") continue;
    for (const sentence of check.sentences) {
      const answer = Object.fromEntries(
        check.sentences.map((s) => {
          const right = s.fail ? "fail" : "pass";
          const wrong = s.fail ? "pass" : "fail";
          return [s.id, s.id === sentence.id ? wrong : right];
        })
      );
      const outcome = evaluateCheck(check, answer);
      assert.equal(outcome.passed, false, `${name} ${sentence.id}`);
      assert.ok(outcome.detail.includes(sentence.text), `${name} names the sentence`);
    }
  }
});

test("every choose check fails with the other piece of work and explains why", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "choose") continue;
    const other = check.correct === "left" ? "right" : "left";
    const outcome = evaluateCheck(check, other);
    assert.equal(outcome.passed, false, name);
    assert.ok(check.wrong, `${name} needs wrong feedback`);
    assert.equal(outcome.detail, check.wrong);
  }
});

test("the role map edit passes a complete row and fails the unchanged start", () => {
  const check = lesson("the-role-map").check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, { edited: GOOD_ROLE_EDIT }).passed, true);
  const unchanged = evaluateCheck(check, { edited: check.start });
  assert.equal(unchanged.passed, false);
  assert.equal(unchanged.detail, check.unchanged);
  assert.equal(answerComplete(check, { edited: check.start }), false);
});

test("the role map edit fails when any required part is missing", () => {
  const check = lesson("the-role-map").check;
  if (check.kind !== "edit") return;
  const withoutReview = GOOD_ROLE_EDIT.replace(" Review date: in six months, or when the assistant is updated.", "");
  assert.equal(evaluateCheck(check, { edited: withoutReview }).passed, false);
  const withoutOwner = GOOD_ROLE_EDIT.replace(" Owner: head of HR.", "");
  assert.equal(evaluateCheck(check, { edited: withoutOwner }).passed, false);
  const thinMeasure =
    "Role: HR advisers. System and use: the chat assistant, used to draft summaries. Who is affected: employees. What they must be able to do: check each summary. Measure: training. Owner: head of HR. Review date: in six months.";
  assert.equal(evaluateCheck(check, { edited: thinMeasure }).passed, false);
  const noAble = GOOD_ROLE_EDIT.replace("What they must be able to do:", "Also:");
  assert.equal(evaluateCheck(check, { edited: noAble }).passed, false);
  const noRole = GOOD_ROLE_EDIT.replace("HR advisers", "the team");
  assert.equal(evaluateCheck(check, { edited: noRole }).passed, false);
});

test("the course assessment passes at the pass mark and fails below it", () => {
  const check = lesson("course-assessment").check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  const right = correctAnswer(check) as Record<string, string>;
  const wrongPick = (id: string) =>
    check.questions.find((q) => q.id === id)!.options.find((option) => !option.correct)!.id;
  const [first, second] = check.questions;
  const oneWrong = { ...right, [first.id]: wrongPick(first.id) };
  assert.equal(evaluateCheck(check, oneWrong).passed, true);
  const twoWrong = { ...oneWrong, [second.id]: wrongPick(second.id) };
  const outcome = evaluateCheck(check, twoWrong);
  assert.equal(outcome.passed, false);
  assert.ok(outcome.detail.includes("Question 1"));
  const { [first.id]: _unused, ...partial } = right;
  assert.equal(answerComplete(check, partial), false);
});

test("every scenario question has one right option and feedback on every option", () => {
  const check = lesson("course-assessment").check;
  if (check.kind !== "scenario") return;
  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 40, `${question.id} ${option.id}`);
    positions.add(question.options.findIndex((option) => option.correct));
  }
  assert.ok(positions.size >= 3, "the right option should move between positions");
});

test("the artefact passes a strong answer and fails when each ruled part is missing", () => {
  const check = lesson("your-role-map-and-record").check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  const strong = evaluateCheck(check, STRONG_ARTEFACT);
  assert.equal(strong.passed, true, strong.detail);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const answer = { ...STRONG_ARTEFACT, [field.id]: WEAK_PARTS[field.id] };
    const outcome = evaluateCheck(check, answer);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), `${field.id} names the missing part`);
  }
  const blank = { ...STRONG_ARTEFACT, "row-one": "" };
  assert.equal(answerComplete(check, blank), false);
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  const assessment = lessons[lessons.length - 2];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(typeof assessment.check.passMark === "number");
    const ratio = assessment.check.passMark! / assessment.check.questions.length;
    assert.ok(ratio >= 0.75 && ratio <= 0.9);
  }
  assert.equal(new Set(lessons.map((item) => item.id)).size, lessons.length);
});

test("every lesson has the full shape and its emphasis in the title", () => {
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), item.id);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, item.id);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id} ${section.heading}`);
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

test("no string in the course has a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text.slice(0, 60)}`);
    }
  }
});

test("the course states no enforcement dates, penalties, or amounts, and the record claims no compliance", () => {
  for (const text of allStrings(COURSE)) {
    assert.ok(!/\b(19|20)\d\d\b/.test(text.replace("2024/1689", "")), `year in: ${text.slice(0, 60)}`);
    assert.ok(!/[€£$]|\bfines?\b(?! the)|\bpenalt|\bturnover\b/i.test(text.replace(/looks fine/g, "")), `amount or penalty in: ${text.slice(0, 60)}`);
  }
  assert.ok(!/compli/i.test(COURSE.artefact.recordLine));
});
