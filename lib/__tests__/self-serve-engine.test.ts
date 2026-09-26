import { test } from "node:test";
import assert from "node:assert/strict";

import { PROMPT_ENGINEERING_LESSONS } from "../self-serve/prompt-engineering.ts";
import {
  answerComplete,
  canOpenLesson,
  canSign,
  certificateRef,
  checksPassed,
  courseArtefact,
  describesShape,
  evaluateCheck,
  emptyProgress,
  hasConcreteFact,
  setsLimit,
} from "../self-serve/engine.ts";
import { isSelfServeEnabled, showSelfServeOnHomepage } from "../self-serve/flag.ts";
import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";
import { COURSE_CONTENT } from "../self-serve/courses/index.ts";
import type { CourseProgress } from "../self-serve/types.ts";

const lessons = PROMPT_ENGINEERING_LESSONS;

test("the catalogue has forty courses, and a course is playable only with full lessons", () => {
  assert.equal(SELF_SERVE_COURSES.length, 40);
  assert.equal(new Set(SELF_SERVE_COURSES.map((course) => course.slug)).size, 40);
  for (const track of ["ai", "technology", "robotics", "hr"] as const) {
    assert.equal(SELF_SERVE_COURSES.filter((course) => course.track === track).length, 10);
  }
  assert.ok(SELF_SERVE_COURSES.find((course) => course.slug === "prompt-engineering-for-professional-work")?.playable);
  for (const course of SELF_SERVE_COURSES) {
    assert.equal(course.playable, Boolean(course.lessons?.length), course.slug);
  }
});

test("every registered course matches an outline slug and names a real artefact lesson", () => {
  const slugs = new Set(SELF_SERVE_COURSES.map((course) => course.slug));
  for (const content of COURSE_CONTENT) {
    assert.ok(slugs.has(content.slug), `${content.slug} has no outline`);
    const course = SELF_SERVE_COURSES.find((item) => item.slug === content.slug);
    const artefact = course ? courseArtefact(course) : null;
    assert.ok(artefact, `${content.slug} artefact lesson must be a build check`);
    assert.ok(artefact.fields.length >= 2, `${content.slug} artefact needs parts`);
    assert.equal(new Set(content.lessons.map((lesson) => lesson.id)).size, content.lessons.length);
  }
});

test("a later lesson stays locked until the previous check passes", () => {
  const progress = emptyProgress();
  assert.equal(canOpenLesson(lessons, progress, 0), true);
  assert.equal(canOpenLesson(lessons, progress, 1), false);
  progress.lessons[lessons[0].id] = { passed: true, answer: {} };
  assert.equal(canOpenLesson(lessons, progress, 1), true);
  assert.equal(canOpenLesson(lessons, progress, 2), false);
});

function lessonById(id: string) {
  const lesson = lessons.find((item) => item.id === id);
  assert.ok(lesson, `missing lesson ${id}`);
  return lesson;
}

test("the course is the seven lessons in the standard, with an assessment before the prompt card", () => {
  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    [
      "what-a-prompt-is",
      "when-the-prompt-is-silent",
      "parts-of-a-prompt",
      "read-a-reply",
      "repair-the-prompt",
      "course-assessment",
      "prompt-card",
    ]
  );
  const card = lessonById("prompt-card").check;
  assert.equal(card.kind, "build");
  if (card.kind !== "build") return;
  assert.deepEqual(
    card.fields.map((field) => field.id),
    ["role", "context", "constraints", "output"]
  );
});

test("every lesson teaches before it tests", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.place.length > 40, `${lesson.id} has a place sentence`);
    const paragraphs = lesson.sections.flatMap((section) => section.paragraphs);
    assert.ok(paragraphs.length >= 4, `${lesson.id} has at least four paragraphs`);
    assert.ok(lesson.workedExample.prompt && lesson.workedExample.output, `${lesson.id} has a worked example`);
    assert.ok(lesson.workedExample.reading.length >= 2, `${lesson.id} reads its worked example`);
    assert.ok(lesson.practice.check.prompt.length > 20, `${lesson.id} has a practice`);
    assert.ok(lesson.bridge.length > 40, `${lesson.id} has a bridge`);
    assert.notEqual(lesson.practice.check.prompt, lesson.check.prompt, `${lesson.id} checks a new case`);
  }
  const all = JSON.stringify(lessons);
  assert.doesNotMatch(all, /[\u2014\u2013]/, "no em or en dashes");
  assert.doesNotMatch(all, /\b(Holds|Invented)\b/, "no labels the lesson never taught");
});

test("the reading labels are defined in lesson two before lesson four uses them", () => {
  const taught = JSON.stringify(lessonById("when-the-prompt-is-silent").sections);
  const check = lessonById("read-a-reply").check;
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  assert.ok(taught.includes(check.passLabel), `lesson two defines ${check.passLabel}`);
  assert.ok(taught.includes(check.failLabel), `lesson two defines ${check.failLabel}`);
  assert.ok(taught.includes("only thanks them"));
});

function assessmentCheck() {
  const check = lessons[lessons.length - 2].check;
  assert.equal(check.kind, "scenario");
  if (check.kind !== "scenario") throw new Error("the course assessment must be a scenario");
  return check;
}

test("the second-to-last lesson is a seven-question scenario assessment with a pass mark of six", () => {
  assert.equal(lessons[lessons.length - 2].id, "course-assessment");
  const check = assessmentCheck();
  assert.equal(check.questions.length, 7);
  assert.equal(check.passMark, 6);
  assert.ok(check.why.length > 40);
  const positions = new Set<number>();
  for (const question of check.questions) {
    assert.ok(question.options.length >= 3 && question.options.length <= 4, `${question.id} has three or four options`);
    assert.equal(question.options.filter((option) => option.correct).length, 1, `${question.id} has one right option`);
    for (const option of question.options) {
      assert.ok(option.feedback.length > 40, `${question.id}/${option.id} has feedback`);
    }
    positions.add(question.options.findIndex((option) => option.correct));
  }
  assert.ok(positions.size >= 3, "the right option sits in varying positions");
});

test("the course assessment passes with every answer right and fails with two wrong", () => {
  const check = assessmentCheck();
  const right = Object.fromEntries(
    check.questions.map((question) => [question.id, question.options.find((option) => option.correct)!.id])
  );
  const wrongPick = (index: number) => {
    const question = check.questions[index];
    return question.options.find((option) => !option.correct)!.id;
  };

  assert.equal(answerComplete(check, right), true);
  const passed = evaluateCheck(check, right);
  assert.equal(passed.passed, true);
  assert.match(passed.detail, /7 of 7/);

  const oneWrong = evaluateCheck(check, { ...right, [check.questions[0].id]: wrongPick(0) });
  assert.equal(oneWrong.passed, true);

  const twoWrong = evaluateCheck(check, {
    ...right,
    [check.questions[0].id]: wrongPick(0),
    [check.questions[3].id]: wrongPick(3),
  });
  assert.equal(twoWrong.passed, false);
  assert.match(twoWrong.detail, /5 of 7/);
  assert.match(twoWrong.detail, /Question 1:/);
  assert.match(twoWrong.detail, /Question 4:/);
});

test("no string in the Prompt Engineering lessons uses a dash or a banned word", () => {
  const banned = [
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
  const strings: string[] = [];
  const collect = (value: unknown) => {
    if (typeof value === "string") strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object") Object.values(value).forEach(collect);
  };
  collect(lessons);
  assert.ok(strings.length > 100);
  for (const text of strings) {
    assert.doesNotMatch(text, /[\u2014\u2013]/, `dash in: ${text}`);
    const lower = text.toLowerCase().replace(/\u2019/g, "'");
    for (const word of banned) {
      assert.ok(!lower.includes(word), `"${word}" in: ${text}`);
    }
  }
});

test("reading a reply rejects a promise that was waved through, and names it", () => {
  const check = lessonById("read-a-reply").check;
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  const right = Object.fromEntries(
    check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"])
  ) as Record<string, "pass" | "fail">;

  assert.equal(answerComplete(check, { thanks: "pass" }), false);
  assert.equal(answerComplete(check, right), true);

  const wrong = evaluateCheck(check, { ...right, month: "pass" });
  assert.equal(wrong.passed, false);
  assert.match(wrong.detail, /free month/);
  assert.match(wrong.detail, /Look again at/);

  const passed = evaluateCheck(check, right);
  assert.equal(passed.passed, true);
  assert.match(passed.detail, /safe to send/);
});

test("lesson one checks where each sentence came from", () => {
  const check = lessonById("what-a-prompt-is").check;
  assert.equal(check.kind, "mark");
  if (check.kind !== "mark") return;
  assert.equal(
    evaluateCheck(check, { interest: "pass", confirm: "pass", panel: "fail", passport: "fail" }).passed,
    true
  );
  const missed = evaluateCheck(check, { interest: "pass", confirm: "pass", panel: "pass", passport: "fail" });
  assert.equal(missed.passed, false);
  assert.match(missed.detail, /Leeds/);
});

test("the safe reply and the complete prompt are the ones a colleague can send", () => {
  for (const id of ["when-the-prompt-is-silent", "parts-of-a-prompt"]) {
    const check = lessonById(id).check;
    assert.equal(check.kind, "choose");
    if (check.kind !== "choose") continue;
    assert.equal(answerComplete(check, null), false);
    const missed = evaluateCheck(check, check.correct === "left" ? "right" : "left");
    assert.equal(missed.passed, false);
    assert.notEqual(missed.detail, check.why);
    assert.equal(evaluateCheck(check, check.correct).passed, true);
  }
});

test("repairing the prompt needs a limit on money and on dates, and keeps the rest", () => {
  const check = lessonById("repair-the-prompt").check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;

  assert.equal(answerComplete(check, { edited: check.start }), false);
  const untouched = evaluateCheck(check, { edited: check.start });
  assert.equal(untouched.passed, false);
  assert.match(untouched.detail, /not changed the prompt/);

  const vague = evaluateCheck(check, { edited: `${check.start} Be careful with what you say.` });
  assert.equal(vague.passed, false);
  assert.match(vague.detail, /money/);
  assert.match(vague.detail, /dates/);

  const moneyOnly = evaluateCheck(check, {
    edited: `${check.start} Do not promise a price for next year, a discount, or a free month.`,
  });
  assert.equal(moneyOnly.passed, false);
  assert.doesNotMatch(moneyOnly.detail, /money/);
  assert.match(moneyOnly.detail, /dates/);

  const repaired = evaluateCheck(check, {
    edited: `${check.start} Do not promise a price for next year, a discount, or a free month. Do not give any date or deadline that is not in the facts above.`,
  });
  assert.equal(repaired.passed, true);

  const startedAgain = evaluateCheck(check, {
    edited: "Do not promise a discount. Do not give a deadline.",
  });
  assert.equal(startedAgain.passed, false);
  assert.match(startedAgain.detail, /who is speaking/);
  assert.match(startedAgain.detail, /facts that are true/);
});

test("a prompt card passes only when each part does its job", () => {
  const check = lessonById("prompt-card").check;
  assert.equal(check.kind, "build");
  if (check.kind !== "build") return;
  const full = {
    role: "Account manager for this client",
    context: "The pilot ends Friday and no extension has been agreed.",
    constraints: "Do not invent a price, a date, or a prior promise.",
    output: "Four lines: thanks, status, ask, next step.",
  };
  assert.equal(answerComplete(check, { ...full, output: " " }), false);
  assert.equal(answerComplete(check, full), true);

  const thin = evaluateCheck(check, {
    role: "manager",
    context: "the pilot",
    constraints: "be careful",
    output: "a reply",
  });
  assert.equal(thin.passed, false);

  const passed = evaluateCheck(check, full);
  assert.equal(passed.passed, true);

  const noLimit = evaluateCheck(check, {
    ...full,
    constraints: "Please be careful and professional about money.",
  });
  assert.equal(noLimit.passed, false);
  assert.match(noLimit.detail, /does not yet set a limit/);
  assert.doesNotMatch(noLimit.detail, /concrete fact/);

  const noFact = evaluateCheck(check, {
    ...full,
    context: "the client wants an update about how things are going",
  });
  assert.equal(noFact.passed, false);
  assert.match(noFact.detail, /concrete fact/);

  const noShape = evaluateCheck(check, { ...full, output: "make it good and clear" });
  assert.equal(noShape.passed, false);
  assert.match(noShape.detail, /shape of the answer/);
});

test("part detectors recognise limits, facts, and shapes", () => {
  assert.equal(setsLimit("Never mention a refund."), true);
  assert.equal(setsLimit("Don\u2019t offer a discount."), true);
  assert.equal(setsLimit("Be nice."), false);
  assert.equal(hasConcreteFact("the invoice is for 400 pounds"), true);
  assert.equal(hasConcreteFact("the move is on saturday"), true);
  assert.equal(hasConcreteFact("the client is Harper Foods"), true);
  assert.equal(hasConcreteFact("no discount has been discussed"), true);
  assert.equal(hasConcreteFact("things are going well overall"), false);
  assert.equal(describesShape("three short sentences"), true);
  assert.equal(describesShape("make it good"), false);
});

test("the certificate waits until every check has passed and the card is signed", () => {
  const progress: CourseProgress = { lessons: {} };
  assert.equal(canSign(lessons, progress, "Antonio"), false);
  for (const lesson of lessons) {
    progress.lessons[lesson.id] = { passed: true, answer: {} };
  }
  assert.equal(checksPassed(lessons, progress), true);
  assert.equal(canSign(lessons, progress, "A"), false);
  assert.equal(canSign(lessons, progress, "Antonio"), true);
  const ref = certificateRef("Antonio", "2026-09-21T18:00:00.000Z");
  assert.match(ref, /^EX[0-9A-Z]{6,8}$/);
});

test("the flag is on unless an environment turns it off", () => {
  const prevPublic = process.env.NEXT_PUBLIC_SELF_SERVE_COURSES;
  const prevServer = process.env.SELF_SERVE_COURSES;
  try {
    delete process.env.NEXT_PUBLIC_SELF_SERVE_COURSES;
    delete process.env.SELF_SERVE_COURSES;
    assert.equal(isSelfServeEnabled(), true);
    assert.equal(showSelfServeOnHomepage(), true);

    process.env.SELF_SERVE_COURSES = "false";
    assert.equal(isSelfServeEnabled(), false);
    assert.equal(showSelfServeOnHomepage(), true);

    delete process.env.SELF_SERVE_COURSES;
    process.env.NEXT_PUBLIC_SELF_SERVE_COURSES = "false";
    assert.equal(isSelfServeEnabled(), false);
    assert.equal(showSelfServeOnHomepage(), false);

    process.env.NEXT_PUBLIC_SELF_SERVE_COURSES = "true";
    assert.equal(isSelfServeEnabled(), true);
    assert.equal(showSelfServeOnHomepage(), true);
  } finally {
    if (prevPublic === undefined) delete process.env.NEXT_PUBLIC_SELF_SERVE_COURSES;
    else process.env.NEXT_PUBLIC_SELF_SERVE_COURSES = prevPublic;
    if (prevServer === undefined) delete process.env.SELF_SERVE_COURSES;
    else process.env.SELF_SERVE_COURSES = prevServer;
  }
});

test("a scenario assessment needs every answer, then passes only at its pass mark", () => {
  const check = {
    kind: "scenario" as const,
    prompt: "Answer each question.",
    why: "Each choice keeps the commitment inside what was agreed.",
    passMark: 2,
    questions: [
      {
        id: "q1",
        situation: "A client asks for a discount nobody agreed.",
        question: "What do you send?",
        options: [
          { id: "a", text: "A reply that offers ten per cent.", feedback: "Nobody agreed a discount." },
          { id: "b", text: "A reply that says pricing is unchanged.", correct: true, feedback: "It stays inside the facts." },
        ],
      },
      {
        id: "q2",
        situation: "The deadline has not been set.",
        question: "What does the reply say about timing?",
        options: [
          { id: "a", text: "Friday.", feedback: "Friday was never agreed." },
          { id: "b", text: "That a date will follow.", correct: true, feedback: "It promises nothing new." },
        ],
      },
      {
        id: "q3",
        situation: "The client thanks you.",
        question: "Can the reply thank them back?",
        options: [
          { id: "a", text: "Yes.", correct: true, feedback: "Courtesy adds no commitment." },
          { id: "b", text: "No.", feedback: "A thank-you is safe to send." },
        ],
      },
    ],
  };
  assert.equal(answerComplete(check, { q1: "b" }), false);
  assert.equal(evaluateCheck(check, { q1: "b" }).passed, false);
  const miss = evaluateCheck(check, { q1: "a", q2: "a", q3: "a" });
  assert.equal(miss.passed, false);
  assert.match(miss.detail, /1 of 3/);
  assert.match(miss.detail, /Question 1: Nobody agreed a discount\./);
  const pass = evaluateCheck(check, { q1: "b", q2: "a", q3: "a" });
  assert.equal(pass.passed, true);
  assert.match(pass.detail, /2 of 3/);
});

test("a built part can require two separate things and forbid an invented promise", () => {
  const check = {
    kind: "build" as const,
    prompt: "Write the escalation line.",
    fields: [
      {
        id: "escalate",
        label: "Escalate",
        hint: "Who, and by when.",
        min: 10,
        groups: [
          { id: "who", any: ["manager", "lead"], missing: "Name the role you escalate to." },
          { id: "when", any: ["today", "within", "by"], missing: "Say by when it is escalated." },
        ],
        none: [{ id: "promise", any: ["refund", "voucher"], missing: "Take out the refund; nobody agreed one." }],
      },
    ],
  };
  assert.equal(evaluateCheck(check, { escalate: "Tell the shift lead today." }).passed, true);
  assert.match(evaluateCheck(check, { escalate: "Tell the shift lead eventually." }).detail, /by when/);
  assert.match(evaluateCheck(check, { escalate: "Tell the lead today and offer a refund." }).detail, /refund/);
});

test("an edit fails while a removed claim is still in the text", () => {
  const check = {
    kind: "edit" as const,
    prompt: "Repair the reply.",
    start: "We will refund you in full and send a replacement tomorrow.",
    limitWording: false,
    limits: [],
    keep: [{ id: "replace", any: ["replacement"], missing: "Keep the replacement." }],
    remove: [{ id: "refund", any: ["refund"], missing: "Take out the refund; it was never agreed." }],
    why: "The reply now promises only what was agreed.",
  };
  assert.match(evaluateCheck(check, { edited: "We will refund you and send a replacement tomorrow, sorry." }).detail, /refund/);
  assert.equal(evaluateCheck(check, { edited: "We will send a replacement tomorrow." }).passed, true);
});
