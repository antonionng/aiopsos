import { test } from "node:test";
import assert from "node:assert/strict";

import { chooseSelfServeNudge } from "../self-serve/nudges.ts";

const lessons = ["one", "two", "three", "four"];
const day = 24 * 60 * 60 * 1000;
const paid = "2026-09-01T09:00:00.000Z";

function at(extraMs: number) {
  return Date.parse(paid) + extraMs;
}

test("a buyer who has not started hears once, a day after payment", () => {
  assert.equal(
    chooseSelfServeNudge({
      now: at(day - 1000),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: [],
      signed: false,
      progressUpdatedAt: null,
      sent: { start: false, continue: false, sign: false },
    }),
    null
  );
  assert.equal(
    chooseSelfServeNudge({
      now: at(day),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: [],
      signed: false,
      progressUpdatedAt: null,
      sent: { start: false, continue: false, sign: false },
    }),
    "start"
  );
  assert.equal(
    chooseSelfServeNudge({
      now: at(day * 5),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: [],
      signed: false,
      progressUpdatedAt: null,
      sent: { start: true, continue: false, sign: false },
    }),
    null
  );
});

test("a stalled lesson gets the continue note, not another start note", () => {
  const moved = new Date(at(day)).toISOString();
  assert.equal(
    chooseSelfServeNudge({
      now: at(day * 4),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: ["one"],
      signed: false,
      progressUpdatedAt: moved,
      sent: { start: false, continue: false, sign: false },
    }),
    "continue"
  );
});

test("a finished course that is unsigned gets the sign note", () => {
  const moved = new Date(at(day)).toISOString();
  assert.equal(
    chooseSelfServeNudge({
      now: at(day * 2),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: lessons,
      signed: false,
      progressUpdatedAt: moved,
      sent: { start: false, continue: false, sign: false },
    }),
    "sign"
  );
});

test("a signed record is left alone", () => {
  assert.equal(
    chooseSelfServeNudge({
      now: at(day * 10),
      paidAt: paid,
      lessonIds: lessons,
      passedIds: lessons,
      signed: true,
      progressUpdatedAt: paid,
      sent: { start: false, continue: false, sign: false },
    }),
    null
  );
});
