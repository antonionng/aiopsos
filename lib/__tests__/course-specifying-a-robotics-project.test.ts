import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/specifying-a-robotics-project.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "volume-and-exceptions":
    "Volume: normal 1,100 to 1,250 trays a day, from the last six months of dispatch records; peak 1,500 trays a day for the six weeks before Christmas. Exceptions: warped trays, not yet measured. Samples: we will supply 300 trays, including at least 30 warped trays, before the factory acceptance test.",
  "where-a-vendor-can-hide":
    "At site acceptance, the cell palletises at least 12 cases per minute over a four-hour run. Case quality is as defined in the volume section, including the crushed cases supplied as samples.",
};

const STRONG_SPEC: BuildAnswer = {
  outcomes:
    "The cell must load presses 3 and 4 for brackets B-20 and B-24 at no fewer than 50 good brackets per hour, and run unattended for at least 90 minutes. Constraint: controller from our approved list, to match spares.",
  acceptance:
    "Site acceptance: a six-hour run on our production blanks of both brackets, with one changeover. Pass: at least 50 good brackets per hour averaged over the run and no more than two operator stops.",
  volume:
    "Normal 300 to 360 brackets per shift from the last six months; peak 420 per shift for about five weeks in March. Mix about half and half.",
  exceptions:
    "Blanks with a bent tab, not yet measured. Samples: 150 blanks of each bracket, including 15 with a bent tab, by 14 May.",
  owners:
    "Normal stop by operators; restart after an emergency stop by the shift leader only; program changes by the site robot engineer, recorded in the change log; the integrator is responsible for the complete cell as set out in the contract.",
  wording: "Read on 2 June; up to, typical, and suitable removed and replaced with the measures above.",
};

const THIN = "We will sort this out with the supplier later in the project.";

function correctAnswer(check: LessonCheck): LessonAnswer {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
      ) as BuildAnswer;
    default:
      throw new Error(`no generic answer for ${check.kind}`);
  }
}

function checksOf(lessonId: string) {
  const lesson = COURSE.lessons.find((item) => item.id === lessonId)!;
  return [
    { where: `${lessonId} practice`, check: lesson.practice.check },
    { where: `${lessonId} check`, check: lesson.check },
  ];
}

const allChecks = COURSE.lessons.flatMap((lesson) => checksOf(lesson.id).map((entry) => ({ ...entry, lessonId: lesson.id })));

test("the course has seven or eight lessons with an assessment and an artefact at the end", () => {
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(last.id, COURSE.artefact.lessonId);
  const assessment = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(typeof assessment.passMark === "number");
    assert.ok(assessment.passMark! / assessment.questions.length >= 0.75);
    assert.ok(assessment.passMark! < assessment.questions.length);
    for (const question of assessment.questions) {
      assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
    }
  }
});

test("every lesson has the full shape and its emphasis appears in the title", () => {
  assert.equal(new Set(COURSE.lessons.map((lesson) => lesson.id)).size, COURSE.lessons.length);
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("mark and choose checks pass with the right answer and fail with a wrong one", () => {
  for (const { where, check } of allChecks) {
    if (check.kind !== "mark" && check.kind !== "choose") continue;
    const right = correctAnswer(check);
    assert.ok(answerComplete(check, right), where);
    assert.equal(evaluateCheck(check, right).passed, true, where);
    if (check.kind === "mark") {
      const first = check.sentences[0];
      const wrong = { ...(right as MarkAnswer), [first.id]: first.fail ? "pass" : "fail" } as MarkAnswer;
      assert.equal(evaluateCheck(check, wrong).passed, false, where);
      assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail), where);
    } else {
      assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false, where);
      assert.ok(check.wrong, where);
    }
  }
});

test("edit checks pass with a good edit, fail unchanged, and fail when each required part is missing", () => {
  const edits = allChecks.filter(({ check }) => check.kind === "edit");
  assert.equal(edits.length, 2);
  for (const { where, check, lessonId } of edits) {
    if (check.kind !== "edit") continue;
    const good = GOOD_EDITS[lessonId];
    assert.ok(good, where);
    assert.equal(evaluateCheck(check, { edited: good }).passed, true, where);
    assert.equal(evaluateCheck(check, { edited: check.start }).passed, false, where);
    assert.equal(answerComplete(check, { edited: check.start }), false, where);
    const thin = evaluateCheck(check, { edited: `${check.start} More detail will follow.` });
    assert.equal(thin.passed, false, where);
  }
});

test("the volume edit names each missing part", () => {
  const check = COURSE.lessons.find((lesson) => lesson.id === "volume-and-exceptions")!.check;
  assert.equal(check.kind, "edit");
  const noPeak = "Volume: 1,100 to 1,250 trays a day. Exceptions: warped trays, not yet measured. Samples: 300 trays including 30 warped, by 1 May.";
  const noFrequency = "Volume: 1,100 to 1,250 trays a day; peak 1,500 for six weeks. Exceptions: some trays are warped. Samples: 300 trays including 30 warped, by 1 May.";
  const noSamples = "Volume: 1,100 to 1,250 trays a day; peak 1,500 for six weeks. Exceptions: warped trays, not yet measured.";
  const noTrays = "Volume: 1,100 to 1,250 a day; peak 1,500 for six weeks. Exceptions: warped, not yet measured. Samples: 300 by 1 May.";
  for (const edited of [noPeak, noFrequency, noSamples, noTrays]) {
    assert.equal(evaluateCheck(check, { edited }).passed, false, edited);
  }
});

test("the course assessment passes at the pass mark and fails below it", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  const right = correctAnswer(check) as Record<string, string>;
  assert.ok(answerComplete(check, right));
  assert.equal(evaluateCheck(check, right).passed, true);

  const oneWrong = { ...right };
  const q0 = check.questions[0];
  oneWrong[q0.id] = q0.options.find((o) => !o.correct)!.id;
  assert.equal(evaluateCheck(check, oneWrong).passed, true);

  const twoWrong = { ...oneWrong };
  const q1 = check.questions[1];
  twoWrong[q1.id] = q1.options.find((o) => !o.correct)!.id;
  assert.equal(evaluateCheck(check, twoWrong).passed, false);

  const { [q0.id]: _skipped, ...partial } = right;
  assert.equal(answerComplete(check, partial), false);
  assert.equal(evaluateCheck(check, partial).passed, false);

  const positions = check.questions.map((q) => q.options.findIndex((o) => o.correct));
  assert.ok(new Set(positions).size >= 3, "vary the position of the right option");
  for (const question of check.questions) {
    for (const option of question.options) assert.ok(option.feedback.length > 20, `${question.id}/${option.id}`);
  }
});

test("the specification passes with a strong answer and fails when any ruled part is missing", () => {
  const check = COURSE.lessons[COURSE.lessons.length - 1].check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  assert.ok(answerComplete(check, STRONG_SPEC));
  assert.equal(evaluateCheck(check, STRONG_SPEC).passed, true);
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const weak = { ...STRONG_SPEC, [field.id]: THIN };
    const outcome = evaluateCheck(check, weak);
    assert.equal(outcome.passed, false, field.id);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
  }
  assert.equal(evaluateCheck(check, {}).passed, false);
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
  "it's important to note",
  "in today's",
];

test("no string in the course uses a dash or a banned word", () => {
  const strings = collectStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    const normalised = text.replace(/[\u2018\u2019]/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(normalised), `"${word}" in: ${text.slice(0, 80)}`);
    }
    assert.ok(!text.includes("!"), `exclamation in: ${text.slice(0, 80)}`);
  }
});
