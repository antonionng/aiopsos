import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/getting-value-from-the-technology-you-already-pay-for.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer, SelfServeLesson } from "../self-serve/types.ts";

type Check<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

function lessonById(id: string): SelfServeLesson {
  const lesson = COURSE.lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function asKind<K extends LessonCheck["kind"]>(check: LessonCheck, kind: K): Check<K> {
  assert.equal(check.kind, kind);
  return check as Check<K>;
}

function correctMarks(check: Check<"mark">): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertMark(check: LessonCheck) {
  const mark = asKind(check, "mark");
  const right = correctMarks(mark);
  assert.ok(answerComplete(mark, right));
  assert.equal(evaluateCheck(mark, right).passed, true);
  for (const sentence of mark.sentences) {
    const wrong = { ...right, [sentence.id]: sentence.fail ? "pass" : "fail" } as MarkAnswer;
    const outcome = evaluateCheck(mark, wrong);
    assert.equal(outcome.passed, false, sentence.id);
    assert.ok(outcome.detail.includes(sentence.text));
  }
}

function assertChoose(check: LessonCheck) {
  const choose = asKind(check, "choose");
  assert.ok(choose.wrong);
  assert.equal(evaluateCheck(choose, choose.correct).passed, true);
  assert.equal(evaluateCheck(choose, choose.correct === "left" ? "right" : "left").passed, false);
}

function allCorrect(check: Check<"scenario">): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => {
      const right = q.options.filter((o) => o.correct);
      assert.equal(right.length, 1, q.id);
      return [q.id, right[0].id];
    })
  );
}

function assertScenario(check: LessonCheck) {
  const scenario = asKind(check, "scenario");
  const right = allCorrect(scenario);
  assert.equal(evaluateCheck(scenario, right).passed, true);
  const needed = scenario.passMark ?? scenario.questions.length;
  const missCount = scenario.questions.length - needed + 1;
  const wrong = { ...right };
  for (const q of scenario.questions.slice(0, missCount)) {
    wrong[q.id] = q.options.find((o) => !o.correct)!.id;
  }
  assert.equal(evaluateCheck(scenario, wrong).passed, false);
  for (const q of scenario.questions) {
    assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
    for (const option of q.options) assert.ok(option.feedback.length > 20, option.id);
  }
}

const THIN = "it will be sorted out later on";

function assertBuild(check: LessonCheck, strong: BuildAnswer) {
  const build = asKind(check, "build");
  assert.equal(evaluateCheck(build, strong).passed, true, evaluateCheck(build, strong).detail);
  for (const field of build.fields) {
    const weak = { ...strong, [field.id]: THIN };
    const outcome = evaluateCheck(build, weak);
    assert.equal(outcome.passed, false, field.id);
    if (field.missing) assert.ok(outcome.detail.includes(field.missing), field.id);
  }
}

test("lesson 1: licence or job, practice and check", () => {
  const lesson = lessonById("a-licence-is-not-a-job");
  assertMark(lesson.practice.check);
  assertMark(lesson.check);
});

test("lesson 2: the inventory row practice and the choice check", () => {
  const lesson = lessonById("take-the-inventory");
  assertBuild(lesson.practice.check, {
    tool: "Adobe Acrobat Pro",
    holders: "Four licences held by the account managers",
    job: "Editing PDF brochures, done by the account managers, last used on Tuesday",
    nearby: "Client contracts are printed, signed and scanned every week instead of sent for e-signature",
  });
  assertChoose(lesson.check);
});

test("lesson 3: worth moving or not now", () => {
  const lesson = lessonById("three-jobs-worth-moving");
  assertMark(lesson.practice.check);
  assertMark(lesson.check);
});

test("lesson 4: the remedy choice and the three-reason scenario", () => {
  const lesson = lessonById("why-people-opt-out");
  assertChoose(lesson.practice.check);
  assertScenario(lesson.check);
  const scenario = asKind(lesson.check, "scenario");
  assert.equal(scenario.passMark, scenario.questions.length);
});

test("lesson 5: the missing parts practice and the plan row edit", () => {
  const lesson = lessonById("repair-a-30-day-plan");
  assertBuild(lesson.practice.check, {
    stops: "The paper diary is removed from reception on the switch-over Monday.",
    sign: "In week four, every room booking for that week is in the Outlook room calendars.",
  });

  const edit = asKind(lesson.check, "edit");
  const good =
    "Job: the weekly stock order. Tool: the shared Excel file in SharePoint. Owner: Tomasz Nowak, warehouse supervisor. First action: Tomasz sets up the order tab by Wednesday of week one. What stops: from Monday of week two, emailed orders are sent back with the file link. Sign in the work: in week four, every order for that week is in the shared file.";
  assert.equal(evaluateCheck(edit, { edited: good }).passed, true);
  assert.equal(evaluateCheck(edit, { edited: edit.start }).passed, false);
  assert.equal(answerComplete(edit, { edited: edit.start }), false);

  const without = (pattern: RegExp) => good.replace(pattern, "");
  const cases: [string, string][] = [
    ["owner", without(/Owner: [^.]*\. /)],
    ["first", without(/First action: [^.]*\. /).replace("Monday of week two", "the second week")],
    ["stops", without(/What stops: [^.]*\. /)],
    ["sign", without(/Sign in the work: [^.]*\./)],
    ["job", good.replace("the weekly stock order", "the order")],
    ["tool", good.replace("the shared Excel file in SharePoint", "the shared file")],
  ];
  for (const [id, text] of cases) {
    assert.equal(evaluateCheck(edit, { edited: text }).passed, false, id);
  }
});

test("lesson 6: the assessment practice and scenario", () => {
  const lesson = lessonById("put-the-method-to-work");
  assertChoose(lesson.practice.check);
  assertScenario(lesson.check);
});

function strongRow(key: string): BuildAnswer {
  return {
    [`${key}-job`]: "Client appointment booking, now by phone into Excel, several times every day.",
    [`${key}-tool`]: "Microsoft Bookings with email confirmation.",
    [`${key}-owner`]: "Hannah Price, reception lead.",
    [`${key}-reason`]: "Waiting on someone else, so reception and all four advisers switch on the same Monday.",
    [`${key}-first`]: "The reception lead sets each adviser's hours by Wednesday of week one.",
    [`${key}-stops`]: "The appointments sheet is made read-only on the switch-over Monday.",
    [`${key}-sign`]: "In week four, every appointment for that week appears in Bookings and none in the old sheet.",
  };
}

test("lesson 7: the 30-day plan passes when strong and fails for each missing part", () => {
  const lesson = lessonById("your-30-day-plan");
  assertMark(lesson.practice.check);
  const build = asKind(lesson.check, "build");
  assert.equal(build.fields.length, 21);
  for (const field of build.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assertBuild(lesson.check, { ...strongRow("row1"), ...strongRow("row2"), ...strongRow("row3") });
  const everyone = { ...strongRow("row1"), ...strongRow("row2"), ...strongRow("row3"), "row2-owner": "Everyone in the team" };
  assert.equal(evaluateCheck(build, everyone).passed, false);
});

test("the course ends with a scenario assessment and then the artefact", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  const scenario = assessment as Check<"scenario">;
  assert.ok(scenario.questions.length >= 6 && scenario.questions.length <= 8);
  assert.ok(typeof scenario.passMark === "number");
  assert.ok(scenario.passMark / scenario.questions.length >= 0.75);
  assert.ok(scenario.passMark < scenario.questions.length);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
});

test("every lesson has the full shape", () => {
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, section.heading);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
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

test("no string contains a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(text), `banned "${word}" in: ${text}`);
    }
  }
});
