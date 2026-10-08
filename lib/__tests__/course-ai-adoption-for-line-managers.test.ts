import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-adoption-for-line-managers.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, SelfServeLesson } from "../self-serve/types.ts";

const BAD_FIELD = "Use the assistant at least three times per week.";

const STRONG_BUILDS: Record<string, BuildAnswer> = {
  "the-standard:practice": {
    owned: "You own anything you hand in, however it was drafted.",
    declared: "Be ready to tell me what you gave the tool and what it gave back.",
    checked: "Check every figure and date against a source you can name.",
    limits: "Keep customer and colleague details out of the tool.",
  },
  "ask-what-the-tool-did:practice": {
    in: "What did you give the tool to work from?",
    changed: "What did it give back that you changed?",
    checked: "What did you check, and against which source?",
  },
  "signs-it-stuck:practice": {
    sign1: "Sources named in reports without being asked.",
    sign2: "An error caught before the work reaches me.",
    sign3: "A question about whether customer data may go into the tool.",
  },
  "what-you-ask-for-next:check": {
    owned: "You own what you hand in, however it was drafted.",
    declared: "Be ready to tell me what you gave the tool and what it gave back.",
    checked: "Check every figure, date, and name against a source you can name.",
    limits: "Do not put customer, candidate, or colleague details into the tool.",
    q_in: "What did you give the tool?",
    q_changed: "What did it give back that you changed?",
    q_checked: "What did you check, and against what?",
    signs: "Sources named without being asked, errors caught before review, and questions about what may go into the tool.",
    when: "At the one-to-ones in week 4 and week 8.",
    next: "From next month, every report ends with one line saying what was checked and against what.",
  },
};

const GOOD_EDITS: Record<string, string> = {
  "return-it-with-a-question:practice":
    "The productivity figure has no study named. Where does it come from? If you cannot find a source, please remove it.",
  "what-you-ask-for-next:practice":
    "You own what you hand in. Be ready to say what the tool did. Check every figure against a source. Keep customer details out of the tool.",
};

function checksOf(lesson: SelfServeLesson): [string, LessonCheck][] {
  return [
    [`${lesson.id}:practice`, lesson.practice.check],
    [`${lesson.id}:check`, lesson.check],
  ];
}

const ALL_CHECKS = COURSE.lessons.flatMap(checksOf);

for (const [key, check] of ALL_CHECKS) {
  test(`${key} passes with the right answer and fails with a wrong one`, () => {
    switch (check.kind) {
      case "mark": {
        const right = Object.fromEntries(
          check.sentences.map((sentence) => [sentence.id, sentence.fail ? "fail" : "pass"] as const)
        );
        assert.ok(evaluateCheck(check, right).passed);
        const first = check.sentences[0];
        const wrong = { ...right, [first.id]: first.fail ? "pass" : "fail" } as const;
        assert.equal(evaluateCheck(check, wrong).passed, false);
        assert.ok(check.sentences.some((sentence) => sentence.fail));
        assert.ok(check.sentences.some((sentence) => !sentence.fail));
        break;
      }
      case "choose": {
        assert.ok(check.why && check.wrong, `${key} needs why and wrong`);
        assert.ok(evaluateCheck(check, check.correct).passed);
        assert.equal(evaluateCheck(check, check.correct === "left" ? "right" : "left").passed, false);
        break;
      }
      case "scenario": {
        const right = Object.fromEntries(
          check.questions.map((question) => [question.id, question.options.find((option) => option.correct)!.id])
        );
        assert.ok(answerComplete(check, right));
        assert.ok(evaluateCheck(check, right).passed);
        const needed = check.passMark ?? check.questions.length;
        const misses = check.questions.length - needed + 1;
        const below = { ...right };
        for (const question of check.questions.slice(0, misses)) {
          below[question.id] = question.options.find((option) => !option.correct)!.id;
        }
        assert.equal(evaluateCheck(check, below).passed, false);
        for (const question of check.questions) {
          assert.equal(question.options.filter((option) => option.correct).length, 1, question.id);
          assert.ok(question.options.length >= 3 && question.options.length <= 4, question.id);
          for (const option of question.options) assert.ok(option.feedback.length > 20, option.id);
        }
        break;
      }
      case "build": {
        const strong = STRONG_BUILDS[key];
        assert.ok(strong, `no strong answer for ${key}`);
        assert.ok(answerComplete(check, strong));
        assert.ok(evaluateCheck(check, strong).passed, evaluateCheck(check, strong).detail);
        for (const field of check.fields) {
          assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
          assert.ok(field.missing, `${field.id} needs a missing sentence`);
          const outcome = evaluateCheck(check, { ...strong, [field.id]: BAD_FIELD });
          assert.equal(outcome.passed, false, `${key} should fail without ${field.id}`);
          assert.ok(outcome.detail.includes(field.missing!));
        }
        break;
      }
      case "edit": {
        const good = GOOD_EDITS[key] ?? check.result?.text;
        assert.ok(good, `no good edit for ${key}`);
        assert.ok(evaluateCheck(check, { edited: good }).passed, evaluateCheck(check, { edited: good }).detail);
        assert.equal(evaluateCheck(check, { edited: check.start }).passed, false);
        assert.equal(answerComplete(check, { edited: check.start }), false);
        break;
      }
      case "order":
        assert.fail(`${key} should not be an order check`);
    }
  });
}

test("the comments edit fails when any one comment still fixes the work", () => {
  const check = COURSE.lessons.find((lesson) => lesson.id === "return-it-with-a-question")!.check;
  assert.equal(check.kind, "edit");
  if (check.kind !== "edit") return;
  const good = check.result!.text;
  const withoutDate = good.replace(
    "Where did the delivery date of the 12th come from? Please check it against the dispatch schedule.",
    "I have changed the delivery date to the 14th."
  );
  assert.equal(evaluateCheck(check, { edited: withoutDate }).passed, false);
  const withoutDiscount = good.replace(
    "The 10% discount in paragraph three: who agreed it? If nobody did, please take it out.",
    "The discount was never agreed, so I deleted it."
  );
  assert.equal(evaluateCheck(check, { edited: withoutDiscount }).passed, false);
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const last = lessons[lessons.length - 1];
  assert.equal(last.check.kind, "build");
  assert.equal(COURSE.artefact.lessonId, last.id);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind === "scenario") {
    assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
    assert.ok(typeof assessment.passMark === "number");
    const ratio = assessment.passMark! / assessment.questions.length;
    assert.ok(ratio >= 0.74 && ratio <= 0.9);
  }
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
});

test("every lesson has its parts and the emphasis appears in the title", () => {
  for (const lesson of COURSE.lessons) {
    assert.ok(lesson.title.includes(lesson.emphasis), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, section.heading);
    assert.ok(lesson.workedExample.reading.length >= 2 && lesson.workedExample.reading.length <= 4, lesson.id);
    assert.ok(lesson.workedExample.inputLabel && lesson.workedExample.outputLabel, lesson.id);
    assert.ok(lesson.bridge.length > 0, lesson.id);
  }
});

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
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

test("no string contains a dash or a banned word", () => {
  const strings = allStrings(COURSE);
  for (const text of strings) {
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const plain = text.replace(/\u2019/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(plain), `banned "${word}" in: ${text}`);
    }
  }
});
