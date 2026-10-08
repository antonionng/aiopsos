import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/from-spreadsheets-to-simple-systems.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const lessons = COURSE.lessons;

const GOOD_EDITS: Record<string, string> = {
  "trace-one-number":
    "The figure of £12,480 on the Summary sheet adds column F on the Orders sheet. Column F multiplies the quantity in column D by the unit price in column E. Column D is typed in by the sales administrator. Column E comes from the Price list, where the product manager types in each price.",
  "a-simpler-shape":
    "Holiday table: Staff ID, Name, Team, Month, Days taken. One row for each person in each month. Totals go on a separate Summary sheet.",
};

const WRONG_EDITS: Record<string, string> = {
  "trace-one-number":
    "The figure of £12,480 on the Summary sheet adds column F on the Orders sheet. Column F is a formula that looks right.",
  "a-simpler-shape": "Holiday tracker. Columns: Name, Jan to Jun, Total, in a nicer colour.",
};

const STRONG_MAP: BuildAnswer = {
  owner: "The Kestrel delivery tracker, owned by the transport manager.",
  sheets:
    "Deliveries holds the records, one row per delivery. Charges does the sums. Weekly report shows the result for the transport manager.",
  trace:
    "The weekly total on Weekly report adds Charges!D2:D500. Column D multiplies the weight in Deliveries!C by the rate in Settings!B2. Column C is typed in by the transport clerk.",
  dangerous:
    "The rate for pallets is typed into the formula as 42 in six rows, and the range stops at row 500 while the list has 540 rows.",
  shape: "A Deliveries table with Delivery ID, Date, Customer, Weight and Charge band, one row per delivery.",
  decisions:
    "Deliveries moves to a system, a shared list, because three clerks add to it. Weekly report stays in the workbook, because only the manager uses it. The 2022 tab is retired because nothing refers to it.",
};

const THIN_MAP_PARTS: BuildAnswer = {
  owner: "Mine",
  sheets: "There are several tabs that people use for different reasons each month of the year.",
  trace: "The weekly total comes from the usual place on the other sheet and it looks about right to everyone.",
  dangerous: "Nothing looks worrying to me at all and the file has worked well for a long while now.",
  shape: "Much the same as now but with nicer colours and clearer headings throughout.",
  decisions: "Some of it could probably go somewhere better at some point next year if there is budget.",
};

type Kind = LessonCheck["kind"];
function checksOf(lesson: (typeof lessons)[number]) {
  return [
    { where: `${lesson.id} practice`, check: lesson.practice.check },
    { where: `${lesson.id} check`, check: lesson.check },
  ];
}

function rightAnswer(lessonId: string, check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      ) as Record<string, string>;
    case "edit":
      return { edited: GOOD_EDITS[lessonId] };
    case "build":
      return STRONG_MAP;
    case "order":
      return check.correct;
  }
}

test("every practice and check passes with its right answer and fails with a wrong one", () => {
  const seen = new Set<Kind>();
  for (const lesson of lessons) {
    for (const { where, check } of checksOf(lesson)) {
      seen.add(check.kind);
      const right = rightAnswer(lesson.id, check);
      assert.ok(answerComplete(check, right), `${where} right answer is complete`);
      assert.equal(evaluateCheck(check, right).passed, true, `${where} passes`);

      switch (check.kind) {
        case "mark": {
          const marks = { ...(right as MarkAnswer) };
          for (const sentence of check.sentences) {
            const flipped = { ...marks, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
            assert.equal(evaluateCheck(check, flipped).passed, false, `${where} ${sentence.id} flipped`);
          }
          break;
        }
        case "choose": {
          const other = check.correct === "left" ? "right" : "left";
          const outcome = evaluateCheck(check, other);
          assert.equal(outcome.passed, false, `${where} wrong choice`);
          assert.ok(check.wrong, `${where} has wrong feedback`);
          break;
        }
        case "scenario": {
          const picks = { ...(right as Record<string, string>) };
          const needed = check.passMark ?? check.questions.length;
          const toMiss = check.questions.length - needed + 1;
          for (const question of check.questions.slice(0, toMiss)) {
            picks[question.id] = question.options.find((o) => !o.correct)!.id;
          }
          assert.equal(evaluateCheck(check, picks).passed, false, `${where} below pass mark`);
          for (const question of check.questions) {
            assert.equal(question.options.filter((o) => o.correct).length, 1, `${where} ${question.id} has one right option`);
            for (const option of question.options) assert.ok(option.feedback.length > 20);
          }
          break;
        }
        case "edit": {
          assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, `${where} unchanged fails`);
          assert.equal(evaluateCheck(check, { edited: WRONG_EDITS[lesson.id] }).passed, false, `${where} weak edit fails`);
          break;
        }
        case "build": {
          for (const field of check.fields) {
            const thin = { ...STRONG_MAP, [field.id]: THIN_MAP_PARTS[field.id] };
            const outcome = evaluateCheck(check, thin);
            assert.equal(outcome.passed, false, `${where} fails without ${field.id}`);
            assert.ok(field.missing && outcome.detail.includes(field.missing), `${where} names ${field.id}`);
          }
          break;
        }
        case "order":
          break;
      }
    }
  }
  assert.ok(seen.has("build") && seen.has("scenario"));
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  if (last.check.kind === "build") {
    for (const field of last.check.fields) {
      assert.ok(field.rule || field.any?.length, `${field.id} has a rule`);
      assert.ok(field.missing, `${field.id} has a missing sentence`);
    }
  }
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(assessment.passMark);
    assert.ok(assessment.passMark! / assessment.questions.length >= 0.75);
  }
});

test("every lesson has the full shape and its emphasis appears in the title", () => {
  const ids = new Set<string>();
  for (const lesson of lessons) {
    assert.ok(!ids.has(lesson.id));
    ids.add(lesson.id);
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${lesson.id} sections`);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id} ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel);
    assert.ok(lesson.bridge.length > 0, `${lesson.id} bridge`);
  }
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

test("no string contains a dash or a banned word", () => {
  for (const text of strings(COURSE)) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 60)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 60)}`);
    }
  }
});
