import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/employee-data-privacy-and-ai.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck } from "../self-serve/types.ts";

const FILLER =
  "this part is left general and says little that anyone could act on in the weeks ahead of us all here, as it stands";

const STRONG_BUILDS: Record<string, BuildAnswer> = {
  "the-red-list": {
    health: "Fit notes and occupational health reports, because they are health data.",
    special: "Trade union membership lists, because trade union membership is special category data.",
    hr: "Grievance and disciplinary files, because they hold allegations about named people.",
  },
  "the-team-rule": {
    tools: "The Harbour assistant on work devices, for drafting and summarising work documents.",
    "redlist-special":
      "Fit notes and occupational health reports, because they are health data. Trade union membership, because it is special category data.",
    "redlist-hr":
      "Grievance, disciplinary, and investigation files, because they hold allegations about named people. Individual pay and bank details, because they cause harm if exposed.",
    "may-go-in": "Job descriptions, policies, templates, and anonymised themes. Put in only what the task needs.",
    answer:
      "Say what the manager is trying to do, say what cannot go in and why, because a reason lets them apply it next time, and offer an anonymised question instead.",
    mistake: "Tell the data protection lead the same day, saying which tool, what went in, and when.",
    owner: "Owned by the head of HR, reviewed every six months, next in March 2027.",
  },
};

type Named = { name: string; lessonId: string; check: LessonCheck };

function allChecks(): Named[] {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, lessonId: lesson.id, check: lesson.practice.check },
    { name: `${lesson.id} check`, lessonId: lesson.id, check: lesson.check },
  ]);
}

function correctAnswer(item: Named): LessonAnswer {
  const { check } = item;
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"]));
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      );
    case "edit":
      assert.ok(check.result, `${item.name} needs a result to use as the good edit`);
      return { edited: check.result.text };
    case "build": {
      const strong = STRONG_BUILDS[item.lessonId];
      assert.ok(strong, `${item.name} needs a strong answer`);
      return strong;
    }
  }
}

test("every check passes with its correct answer", () => {
  for (const item of allChecks()) {
    const answer = correctAnswer(item);
    assert.ok(answerComplete(item.check, answer), `${item.name} answer is complete`);
    const outcome = evaluateCheck(item.check, answer);
    assert.equal(outcome.passed, true, `${item.name}: ${outcome.detail}`);
  }
});

test("every mark check fails when any one sentence is marked wrongly", () => {
  for (const item of allChecks()) {
    if (item.check.kind !== "mark") continue;
    const right = correctAnswer(item) as Record<string, "pass" | "fail">;
    for (const sentence of item.check.sentences) {
      const wrong = { ...right, [sentence.id]: right[sentence.id] === "fail" ? "pass" : "fail" } as const;
      assert.equal(evaluateCheck(item.check, wrong).passed, false, `${item.name} ${sentence.id}`);
    }
  }
});

test("every choose check fails with the weaker piece of work", () => {
  for (const item of allChecks()) {
    if (item.check.kind !== "choose") continue;
    const wrong = item.check.correct === "left" ? "right" : "left";
    assert.equal(evaluateCheck(item.check, wrong).passed, false, item.name);
    assert.ok(item.check.why && item.check.wrong, `${item.name} has why and wrong`);
  }
});

test("every edit check fails on the unchanged start and on an edit missing a part", () => {
  for (const item of allChecks()) {
    if (item.check.kind !== "edit") continue;
    const check = item.check;
    assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${item.name} unchanged`);
    const thin = `${check.start} Thank you.`;
    assert.equal(evaluateCheck(check, { edited: thin }).passed, false, `${item.name} thin edit`);
  }
});

test("every build check fails when any one ruled part is missing", () => {
  for (const item of allChecks()) {
    if (item.check.kind !== "build") continue;
    const strong = correctAnswer(item) as BuildAnswer;
    for (const field of item.check.fields) {
      assert.ok(field.rule || field.any?.length, `${item.name} ${field.id} has a rule or any list`);
      assert.ok(field.missing, `${item.name} ${field.id} has a missing sentence`);
      const answer = { ...strong, [field.id]: FILLER };
      const outcome = evaluateCheck(item.check, answer);
      assert.equal(outcome.passed, false, `${item.name} ${field.id}`);
      assert.ok(outcome.detail.includes(field.missing!), `${item.name} ${field.id} names the part`);
    }
  }
});

test("the scenario passes when all are right and fails below the pass mark", () => {
  for (const item of allChecks()) {
    if (item.check.kind !== "scenario") continue;
    const check = item.check;
    const right = correctAnswer(item) as Record<string, string>;
    const needed = check.passMark ?? check.questions.length;
    const misses = check.questions.length - needed + 1;
    const below = { ...right };
    for (const question of check.questions.slice(0, misses)) {
      below[question.id] = question.options.find((o) => !o.correct)!.id;
    }
    assert.equal(evaluateCheck(check, below).passed, false, item.name);
    for (const question of check.questions) {
      assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
      for (const option of question.options) assert.ok(option.feedback.length > 20, option.id);
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
    assert.ok(typeof assessment.passMark === "number");
    assert.ok(assessment.passMark! / assessment.questions.length >= 0.75);
  }
  for (const lesson of lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), `${lesson.id} emphasis is in the title`);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, section.heading);
  }
});

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
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

test("no string contains a dash character or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
