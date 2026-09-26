import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/no-code-automation-for-everyday-work.ts";
import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";
import type { LessonCheck, MarkAnswer } from "../self-serve/types.ts";

type Check<K extends LessonCheck["kind"]> = Extract<LessonCheck, { kind: K }>;

function lessonById(id: string) {
  const lesson = COURSE.lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

function allChecks(): { name: string; check: LessonCheck }[] {
  return COURSE.lessons.flatMap((lesson) => [
    { name: `${lesson.id} practice`, check: lesson.practice.check },
    { name: `${lesson.id} check`, check: lesson.check },
  ]);
}

function correctMarks(check: Check<"mark">): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function correctPicks(check: Check<"scenario">): Record<string, string> {
  return Object.fromEntries(
    check.questions.map((q) => {
      const right = q.options.find((o) => o.correct);
      assert.ok(right, `${q.id} has no correct option`);
      return [q.id, right.id];
    })
  );
}

test("the course has seven or eight lessons and names its artefact lesson", () => {
  assert.equal(COURSE.slug, "no-code-automation-for-everyday-work");
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  const last = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = COURSE.lessons[COURSE.lessons.length - 2];
  assert.equal(assessment.check.kind, "scenario");
  if (assessment.check.kind === "scenario") {
    assert.ok(assessment.check.questions.length >= 6 && assessment.check.questions.length <= 8);
    assert.ok(typeof assessment.check.passMark === "number");
  }
});

test("every lesson has its full shape", () => {
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.toLowerCase().includes(lesson.emphasis.toLowerCase()), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, `${lesson.id}: ${section.heading}`);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

test("mark checks pass when every sentence is right and fail when one is wrong", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "mark") continue;
    const right = correctMarks(check);
    assert.equal(answerComplete(check, right), true, name);
    assert.equal(evaluateCheck(check, right).passed, true, name);
    for (const sentence of check.sentences) {
      const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
      assert.equal(evaluateCheck(check, wrong).passed, false, `${name}: ${sentence.id}`);
    }
  }
});

test("mark labels are taught in the lesson text", () => {
  for (const lesson of COURSE.lessons) {
    const teaching = lesson.sections.flatMap((s) => s.paragraphs).join(" ").toLowerCase();
    for (const check of [lesson.practice.check, lesson.check]) {
      if (check.kind !== "mark") continue;
      assert.ok(teaching.includes(check.passLabel.toLowerCase()), `${lesson.id}: ${check.passLabel}`);
      assert.ok(teaching.includes(check.failLabel.toLowerCase()), `${lesson.id}: ${check.failLabel}`);
    }
  }
});

test("choose checks pass on the stronger work and fail on the weaker", () => {
  for (const { name, check } of allChecks()) {
    if (check.kind !== "choose") continue;
    assert.ok(check.wrong, `${name} needs wrong feedback`);
    const other = check.correct === "left" ? "right" : "left";
    assert.equal(evaluateCheck(check, check.correct).passed, true, name);
    assert.equal(evaluateCheck(check, other).passed, false, name);
  }
});

test("the scenario assessment passes all correct and fails below the pass mark", () => {
  const check = lessonById("the-whole-method").check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.equal(check.passMark, 6);
  const right = correctPicks(check);
  assert.equal(evaluateCheck(check, right).passed, true);

  const wrongPick = (id: string) => check.questions.find((q) => q.id === id)!.options.find((o) => !o.correct)!.id;
  const ids = check.questions.map((q) => q.id);
  const sixRight = { ...right, [ids[0]]: wrongPick(ids[0]), [ids[1]]: wrongPick(ids[1]) };
  assert.equal(evaluateCheck(check, sixRight).passed, true);
  const fiveRight = { ...sixRight, [ids[2]]: wrongPick(ids[2]) };
  assert.equal(evaluateCheck(check, fiveRight).passed, false);

  const positions = new Set<number>();
  for (const q of check.questions) {
    assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
    assert.equal(q.options.filter((o) => o.correct).length, 1, q.id);
    for (const o of q.options) assert.ok(o.feedback.length > 20, `${q.id}.${o.id}`);
    positions.add(q.options.findIndex((o) => o.correct));
  }
  assert.ok(positions.size >= 3, "vary the position of the right option");
});

test("the failure note edit passes with every part and fails when a part is missing", () => {
  const check = lessonById("when-it-breaks").check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(answerComplete(check, { edited: check.start }), false);

  const good =
    "This flow sends the weekly rota email to all staff at 4pm on Thursday. How we know it stopped: the duty manager checks on Friday morning that the rota email arrived. Owner: Dan Mercer, and Aisha Khan covers when he is away. By hand in the meantime: the duty manager sends the rota from the shared mailbox. Switch it off: open the flow in Power Automate and choose Turn off.";
  assert.equal(evaluateCheck(check, { edited: good }).passed, true);
  assert.equal(evaluateCheck(check, { edited: check.result!.text }).passed, true);

  const without = (phrase: string, replacement = "") => good.replace(phrase, replacement);
  const cases: [string, string][] = [
    ["rota", good.replaceAll("rota", "staff")],
    ["know", without("How we know it stopped: the duty manager checks on Friday morning that the rota email arrived. ")],
    ["deputy", without(", and Aisha Khan covers when he is away")],
    ["manual", without("By hand in the meantime: the duty manager sends the rota from the shared mailbox. ")],
    ["off", without(" Switch it off: open the flow in Power Automate and choose Turn off.")],
  ];
  for (const [part, edited] of cases) {
    assert.notEqual(edited, good, part);
    assert.equal(evaluateCheck(check, { edited }).passed, false, part);
  }
});

const STRONG_NOTE = {
  description:
    "Trigger: a new email with a PDF arrives in the invoices@ shared mailbox. Step one: save the attachment to the Incoming folder in the Finance SharePoint library. Step two: post a link in the Finance Teams channel. Condition: if there is no attachment, move the email to the Check folder.",
  access:
    "It runs under the finance-flows service account, not my own login. It can only read the invoices@ mailbox, write to Incoming and post in the Finance channel.",
  tests:
    "Normal: saved and posted, handled correctly. No attachment: moved to Check, handled correctly. Duplicate: first run overwrote the file; I added a condition for an existing file name and the rerun was handled correctly. Two PDFs: handled correctly after the rerun.",
  failure:
    "What it does: saves invoices into Incoming. How we know it stopped: every Friday the finance assistant checks the week's invoices in the mailbox match the files in Incoming. Owner: Helen Carr, and Mark Ellis covers when she is away. By hand: save attachments each morning. Switch it off: choose Turn off in Power Automate.",
};

const WEAK_PARTS: Record<keyof typeof STRONG_NOTE, string> = {
  description:
    "when an invoice comes in it gets saved where it should go and then finance get told about it so they can pay it on time.",
  access: "it runs as me, under my login, and can see everything that I can see in the mailbox and files.",
  tests:
    "Normal: handled correctly. No attachment: handled correctly. Wrong format: handled correctly. Long file name: handled correctly, and all four runs showed success in the history.",
  failure:
    "What it does: saves invoices into Incoming. Owner: Helen Carr, and Mark Ellis covers when she is away. By hand: save attachments each morning. Switch it off: choose Turn off in Power Automate so nothing else runs after that.",
};

test("the automation note passes when strong and fails when any ruled part is missing", () => {
  const check = lessonById("your-automation-note").check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assert.deepEqual(check.fields.map((f) => f.id).sort(), Object.keys(STRONG_NOTE).sort());
  assert.equal(answerComplete(check, STRONG_NOTE), true);
  assert.equal(evaluateCheck(check, STRONG_NOTE).passed, true);
  for (const field of check.fields) {
    const id = field.id as keyof typeof STRONG_NOTE;
    const weak = { ...STRONG_NOTE, [id]: WEAK_PARTS[id] };
    assert.ok(WEAK_PARTS[id].length >= field.min, `${id} weak part should meet the length`);
    const outcome = evaluateCheck(check, weak);
    assert.equal(outcome.passed, false, id);
    assert.ok(outcome.detail.includes(field.missing!), id);
    assert.equal(evaluateCheck(check, { ...STRONG_NOTE, [id]: "" }).passed, false, `${id} empty`);
  }
});

test("every practice and lesson check is covered by a pass rule test", () => {
  const kinds = new Set(["mark", "choose", "scenario", "edit", "build"]);
  for (const { name, check } of allChecks()) assert.ok(kinds.has(check.kind), name);
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
  const all = strings(COURSE);
  for (const text of all) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text.slice(0, 80)}`);
    assert.ok(!text.includes("!"), `exclamation in: ${text.slice(0, 80)}`);
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}`, "i");
      assert.ok(!pattern.test(text), `"${word}" in: ${text.slice(0, 80)}`);
    }
  }
});
