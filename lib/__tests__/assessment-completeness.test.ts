import { test } from "node:test";
import assert from "node:assert/strict";
import { findMissingAnswers } from "../assessment-completeness.ts";

const IDS = ["conf_1", "conf_2", "prac_1", "tool_1", "cult_1"] as const;

function complete(): Record<string, number> {
  return Object.fromEntries(IDS.map((id) => [id, 3]));
}

test("a complete submission has nothing missing", () => {
  assert.deepEqual(findMissingAnswers(IDS, complete()), []);
});

test("an empty submission reports every question rather than scoring zero", () => {
  assert.deepEqual(findMissingAnswers(IDS, {}), [...IDS]);
});

test("one dropped answer is caught", () => {
  const answers = complete();
  delete answers.prac_1;
  assert.deepEqual(findMissingAnswers(IDS, answers), ["prac_1"]);
});

test("a zero answer is a real answer, not a missing one", () => {
  // The regression this whole check exists to prevent: 0 is the lowest point
  // on the scale, and must never be confused with absence.
  const answers = complete();
  answers.conf_1 = 0;
  assert.deepEqual(findMissingAnswers(IDS, answers), []);
});

test("a non-numeric answer counts as missing", () => {
  const answers: Record<string, unknown> = complete();
  answers.tool_1 = "4";
  assert.deepEqual(findMissingAnswers(IDS, answers), ["tool_1"]);
});

test("extra answers for questions we did not ask are ignored", () => {
  const answers: Record<string, unknown> = { ...complete(), made_up_q: 5 };
  assert.deepEqual(findMissingAnswers(IDS, answers), []);
});
