import { test } from "node:test";
import assert from "node:assert/strict";

import { COURSE } from "../self-serve/courses/ai-assisted-analysis-and-reporting.ts";
import { answerComplete, evaluateCheck } from "../self-serve/engine.ts";
import type { BuildAnswer, LessonCheck, MarkAnswer } from "../self-serve/types.ts";

const GOOD_EDITS: Record<string, string> = {
  "ask-for-the-working":
    "Using the attached file, calculate the average overtime per person for September from the Overtime hours column. Run the calculation as code and show me the code. Tell me how many rows you used, how many you excluded, and why. Report any blank values and do not treat them as zero. Do not compare with any period that is not in this file.",
  "write-the-finding":
    "Complaints at the Bristol branch were 14 in July and 9 in August. A new queueing system was introduced at Bristol on 1 August. August had two fewer trading days than July, so this report does not attribute the fall to the new system.",
};

const STRONG_BUILD: BuildAnswer = {
  report: "October repairs performance report, for the housing committee, issued 12 November.",
  source: "'repairs_Oct.xlsx', repairs system export extracted 1 November 08:00, 1,934 rows.",
  numbers:
    "(1) 1,934 repairs logged, count of all rows. (2) 412 urgent repairs completed, count where Priority is Urgent and Status is Complete. (3) Median 3 days to complete, median of Days to complete for those 412 rows. All rebuilt in the spreadsheet and matched.",
  findings:
    "Urgent repairs completed in October took a median of 3 days. The 37 urgent jobs still open at extraction are not included.",
  "ai-use":
    "The tool ran the counts and the median as code and drafted the finding. I rebuilt all three numbers in the spreadsheet and they matched.",
};

const THIN_BUILD: BuildAnswer = {
  report: "the report that goes to the committee each month",
  source: "the repairs spreadsheet that the team keeps on the shared drive",
  numbers:
    "several figures about repairs that the team looked at and thought were reasonable for the month in question overall",
  findings: "repairs went well this month and the committee will be pleased with them",
  "ai-use": "the tool helped with the analysis for this report",
};

function correctAnswer(lessonId: string, check: LessonCheck, where: string) {
  switch (check.kind) {
    case "mark":
      return Object.fromEntries(check.sentences.map((s) => [s.id, s.fail ? "fail" : "pass"])) as MarkAnswer;
    case "choose":
      return check.correct;
    case "order":
      return check.correct;
    case "scenario":
      return Object.fromEntries(
        check.questions.map((q) => [q.id, q.options.find((o) => o.correct)?.id ?? ""])
      );
    case "edit": {
      const edited = GOOD_EDITS[lessonId];
      assert.ok(edited, `no good edit written for ${lessonId} ${where}`);
      return { edited };
    }
    case "build":
      return STRONG_BUILD;
  }
}

function wrongAnswer(check: LessonCheck) {
  switch (check.kind) {
    case "mark": {
      const [first, ...rest] = check.sentences;
      return Object.fromEntries([
        [first.id, first.fail ? "pass" : "fail"],
        ...rest.map((s) => [s.id, s.fail ? "fail" : "pass"]),
      ]) as MarkAnswer;
    }
    case "choose":
      return check.correct === "left" ? "right" : "left";
    case "order":
      return [...check.correct].reverse();
    case "scenario": {
      const needed = check.passMark ?? check.questions.length;
      const wrongCount = check.questions.length - needed + 1;
      return Object.fromEntries(
        check.questions.map((q, index) => {
          const option = index < wrongCount ? q.options.find((o) => !o.correct) : q.options.find((o) => o.correct);
          return [q.id, option?.id ?? ""];
        })
      );
    }
    case "edit":
      return { edited: check.start };
    case "build":
      return THIN_BUILD;
  }
}

for (const lesson of COURSE.lessons) {
  for (const [where, check] of [
    ["practice", lesson.practice.check],
    ["check", lesson.check],
  ] as const) {
    test(`${lesson.id} ${where} passes with the right answer and fails with a wrong one`, () => {
      const right = correctAnswer(lesson.id, check, where);
      assert.equal(answerComplete(check, right), true);
      const passed = evaluateCheck(check, right);
      assert.equal(passed.passed, true, passed.detail);
      const wrong = evaluateCheck(check, wrongAnswer(check));
      assert.equal(wrong.passed, false);
      assert.ok(wrong.detail.length > 0);
    });
  }
}

test("each edit check fails when a required part is left out", () => {
  const overtime = COURSE.lessons.find((l) => l.id === "ask-for-the-working")!.check;
  assert.equal(
    evaluateCheck(overtime, {
      edited:
        "Calculate the average overtime per person as code and show the code. Tell me how many rows you used and excluded. Do not compare with any period that is not in this file.",
    }).passed,
    false,
    "a request with no rule on blanks must fail"
  );
  assert.equal(
    evaluateCheck(overtime, {
      edited:
        "Calculate the average overtime per person as code and show the code. Tell me how many rows you used and excluded. Do not treat blank values as zero. Tell me whether it has gone up.",
    }).passed,
    false,
    "a request that still asks for a comparison must fail"
  );
  const finding = COURSE.lessons.find((l) => l.id === "write-the-finding")!.check;
  assert.equal(
    evaluateCheck(finding, {
      edited:
        "Complaints at the Bristol branch fell from 14 in July to 9 in August after the new queueing system, although August had two fewer trading days.",
    }).passed,
    false,
    "a finding that does not say the data cannot show cause must fail"
  );
  assert.equal(
    evaluateCheck(finding, {
      edited:
        "Complaints fell from 14 in July to 9 in August after the new queueing system. This report does not attribute the fall to the system, because August had two fewer trading days.",
    }).passed,
    false,
    "a finding without the branch must fail"
  );
});

test("the artefact build fails when any ruled part is missing", () => {
  const final = COURSE.lessons[COURSE.lessons.length - 1];
  assert.equal(final.check.kind, "build");
  if (final.check.kind !== "build") return;
  for (const field of final.check.fields) {
    assert.ok(field.rule || field.any?.length, `${field.id} needs a rule or an any list`);
    assert.ok(field.missing, `${field.id} needs a missing sentence`);
    const answer = { ...STRONG_BUILD, [field.id]: THIN_BUILD[field.id] };
    const outcome = evaluateCheck(final.check, answer);
    assert.equal(outcome.passed, false, `${field.id} should fail when thin`);
    assert.ok(outcome.detail.includes(field.missing!), `${field.id} should name what is missing`);
  }
});

test("the course ends with a scenario assessment and then the artefact build", () => {
  const lessons = COURSE.lessons;
  assert.ok(lessons.length >= 7 && lessons.length <= 8);
  const final = lessons[lessons.length - 1];
  assert.equal(final.check.kind, "build");
  assert.equal(final.id, COURSE.artefact.lessonId);
  const assessment = lessons[lessons.length - 2].check;
  assert.equal(assessment.kind, "scenario");
  if (assessment.kind !== "scenario") return;
  assert.ok(assessment.questions.length >= 6 && assessment.questions.length <= 8);
  assert.ok(typeof assessment.passMark === "number");
  assert.ok(assessment.passMark! < assessment.questions.length);
  for (const question of assessment.questions) {
    assert.equal(question.options.filter((o) => o.correct).length, 1, question.id);
    for (const option of question.options) assert.ok(option.feedback.length > 20);
  }
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title.toLowerCase().includes(lesson.emphasis.toLowerCase()), lesson.id);
    assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, lesson.id);
    for (const section of lesson.sections) assert.ok(section.paragraphs.length >= 2, section.heading);
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
    assert.ok(!/[\u2013\u2014]/.test(text), `dash in: ${text}`);
    const clean = text.replace(/[\u2018\u2019]/g, "'");
    for (const word of BANNED) {
      const pattern = new RegExp(`\\b${word.replace(/[-']/g, (c) => `\\${c}`)}\\b`, "i");
      assert.ok(!pattern.test(clean), `banned "${word}" in: ${text}`);
    }
  }
});
