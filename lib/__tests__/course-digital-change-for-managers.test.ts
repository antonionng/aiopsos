import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/digital-change-for-managers.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

function lesson(id: string) {
  const found = COURSE.lessons.find((item) => item.id === id);
  assert.ok(found, `missing lesson ${id}`);
  return found;
}

function correctMarks(check: Extract<LessonCheck, { kind: "mark" }>): MarkAnswer {
  return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
}

function assertMark(check: LessonCheck) {
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  const right = correctMarks(check);
  assert.equal(answerComplete(check, right), true);
  assert.equal(evaluateCheck(check, right).passed, true);
  for (const sentence of check.sentences) {
    const wrong = { ...right, [sentence.id]: right[sentence.id] === "pass" ? "fail" : "pass" } as MarkAnswer;
    assert.equal(evaluateCheck(check, wrong).passed, false, sentence.id);
  }
  assert.ok(check.sentences.some((s) => s.fail) && check.sentences.some((s) => !s.fail));
}

function assertChoose(check: LessonCheck) {
  assert.equal(check.kind, "choose");
  if (check.kind !== "choose") return;
  assert.ok(check.wrong);
  assert.equal(evaluateCheck(check, check.correct).passed, true);
  assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false);
}

function assertEdit(check: LessonCheck, good: string, partials: string[]) {
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  assert.equal(evaluateCheck(check, { edited: good }).passed, true, good);
  assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
  assert.equal(answerComplete(check, { edited: check.start }), false);
  for (const partial of partials) {
    assert.equal(evaluateCheck(check, { edited: partial }).passed, false, partial);
  }
}

test("the course has seven lessons with unique ids and the full lesson shape", () => {
  assert.equal(COURSE.slug, "digital-change-for-managers");
  assert.equal(COURSE.hours, 2);
  assert.ok(COURSE.lessons.length >= 7 && COURSE.lessons.length <= 8);
  assert.equal(new Set(COURSE.lessons.map((l) => l.id)).size, COURSE.lessons.length);
  for (const item of COURSE.lessons) {
    assert.ok(item.title.includes(item.emphasis), `${item.id} emphasis`);
    assert.ok(item.sections.length >= 3 && item.sections.length <= 5, `${item.id} sections`);
    for (const section of item.sections) assert.ok(section.paragraphs.length >= 2, `${item.id} ${section.heading}`);
    assert.ok(item.workedExample.reading.length >= 2 && item.workedExample.reading.length <= 4);
    assert.ok(item.workedExample.inputLabel && item.workedExample.outputLabel);
    assert.ok(item.bridge.length > 0);
  }
});

test("lesson 1: the rewrite and the mark check", () => {
  const item = lesson("a-tool-change-is-a-change-in-work");
  assertEdit(
    item.practice.check,
    "From 6 October, you will swap a shift in the app instead of asking me to change the paper rota.",
    [
      "From 6 October, the app offers shift swapping instead of the paper rota.",
      "You will swap a shift in the app instead of asking me.",
      "From 6 October, you will swap a shift in the app.",
    ]
  );
  assertMark(item.check);
});

test("lesson 2: the stop edit and the announcement choice", () => {
  const item = lesson("what-they-stop-doing");
  assertEdit(
    item.practice.check,
    "From 2 June, stock requests go through the new ordering form. Dev will accept emailed requests until 13 June. After that, Dev will reply with the link to the form and will not place the order.",
    [
      "From 2 June, stock requests go through the new ordering form. Dev will accept emailed requests until 13 June.",
      "From 2 June, stock requests go through the new ordering form. People can keep emailing Dev, who will reply with the link.",
      "Dev will accept emailed requests until 13 June, then reply with the link.",
    ]
  );
  assertChoose(item.check);
});

test("lesson 3: the plan mark and the plan choice", () => {
  const item = lesson("the-first-two-weeks");
  assertMark(item.practice.check);
  assertChoose(item.check);
});

test("lesson 4: the response choice and the objection mark", () => {
  const item = lesson("hearing-the-objection");
  assertChoose(item.practice.check);
  assertMark(item.check);
});

test("lesson 5: the measure edit and the measure mark", () => {
  const item = lesson("how-you-know");
  assertEdit(
    item.practice.check,
    "By the end of week two, every order raised has a purchase order number from the new system. On the second Friday I will pick ten invoices at random and check each one.",
    [
      "Target: 100% of the finance team logged in to the purchase order system by the end of week two.",
      "By the end of week two, every order raised has a purchase order number from the new system.",
      "Every order raised has a purchase order number. I will pick ten invoices at random and check each one.",
    ]
  );
  assertMark(item.check);
});

test("the second-to-last lesson is a scenario assessment with a pass mark of about eighty per cent", () => {
  const item = COURSE.lessons[COURSE.lessons.length - 2];
  assertChoose(item.practice.check);
  const check = item.check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") return;
  assert.ok(check.questions.length >= 6 && check.questions.length <= 8);
  assert.ok(check.passMark);
  const ratio = check.passMark / check.questions.length;
  assert.ok(ratio >= 0.75 && ratio <= 0.9, `pass mark ratio ${ratio}`);

  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 0);
    positions.add(question.options.findIndex((o) => o.correct));
  }
  assert.ok(positions.size >= 3, "the right option should move between positions");

  const right = Object.fromEntries(
    check.questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id])
  );
  const wrongOn = (count: number) => {
    const answer = { ...right };
    for (const q of check.questions.slice(0, count)) answer[q.id] = q.options.find((o) => !o.correct)!.id;
    return answer;
  };
  assert.equal(evaluateCheck(check, right).passed, true);
  assert.equal(evaluateCheck(check, wrongOn(check.questions.length - check.passMark)).passed, true);
  assert.equal(evaluateCheck(check, wrongOn(check.questions.length - check.passMark + 1)).passed, false);
  const partial = { ...right };
  delete partial[check.questions[0].id];
  assert.equal(answerComplete(check, partial), false);
  assert.equal(evaluateCheck(check, partial).passed, false);
});

const STRONG_PLAN: BuildAnswer = {
  change:
    "From 3 March, you will open each case in the new system instead of starting an email thread, and you will assign cases to a colleague in the system rather than forwarding the email.",
  stop: "Case emails stop on 17 March. From that date the team inbox sends an automatic reply with the new contact form.",
  harder: "Opening a case will be slower in week one, so case targets are reduced by a fifth until Thursday of week two.",
  ask: "Sam Okoro, who tested the system, sits with each person for their first two cases.",
  checkin: "Ten minutes at 9.15 each day in week one, then Tuesday and Thursday in week two.",
  objections:
    "Tenants with two addresses cannot be set up: a real cost, so it goes on the shared list for the programme team by Friday. Worry about mistakes asks for reassurance, so Sam checks each person's first five cases.",
  sign: "Every case opened since 3 March has its first note in the new system. I will check ten cases at random on the second Friday.",
  pretend: "I will not tell the team the system saves time in the first fortnight, because it will not.",
};

const WEAK_PARTS: BuildAnswer = {
  change: "The new system has live dashboards, mobile access and automated workflows for the whole team.",
  stop: "People should gradually move away from the old spreadsheet when they feel ready to.",
  harder: "Everyone will be sent the training video and a reminder email on the first day.",
  ask: "IT will sort it out.",
  checkin: "We will talk about it when problems come up.",
  objections: "Some people may not like it, and I will listen to them carefully and patiently.",
  sign: "Ninety per cent of the team will have logged in by the end of week two.",
  pretend: "I will be honest and open with the team throughout.",
};

test("the final lesson is the artefact build, and each ruled part is checked", () => {
  const item = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(item.id, COURSE.artefact.lessonId);
  assertMark(item.practice.check);
  const check = item.check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  for (const field of check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
  }
  assert.deepEqual(Object.keys(STRONG_PLAN).sort(), check.fields.map((f) => f.id).sort());
  assert.equal(answerComplete(check, STRONG_PLAN), true);
  assert.equal(evaluateCheck(check, STRONG_PLAN).passed, true);
  for (const field of check.fields) {
    const weak = { ...STRONG_PLAN, [field.id]: WEAK_PARTS[field.id] };
    const outcome = evaluateCheck(check, weak);
    assert.equal(outcome.passed, false, `${field.id} should fail when weak`);
    assert.ok(outcome.detail.includes(field.missing!), field.id);
    const empty = { ...STRONG_PLAN, [field.id]: "" };
    assert.equal(answerComplete(check, empty), false);
    assert.equal(evaluateCheck(check, empty).passed, false);
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
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/[\u2018\u2019]/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `"${word}" in: ${text}`);
    }
  }
});
