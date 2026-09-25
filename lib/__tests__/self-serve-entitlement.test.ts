import { test } from "node:test";
import assert from "node:assert/strict";

import {
  accessEndsAt,
  furthestProgress,
  hasActiveAccess,
  onePerCourse,
} from "../self-serve/entitlement.ts";
import type { CourseProgress } from "../self-serve/types.ts";

const passed = (...ids: string[]): CourseProgress => ({
  lessons: Object.fromEntries(ids.map((id) => [id, { passed: true } as never])),
});

test("access lasts twelve months from payment", () => {
  assert.equal(accessEndsAt("2026-09-25T12:00:00.000Z")?.toISOString(), "2027-09-25T12:00:00.000Z");
  assert.equal(hasActiveAccess("2026-09-25T12:00:00.000Z", new Date("2027-09-25T11:59:00Z")), true);
  assert.equal(hasActiveAccess("2026-09-25T12:00:00.000Z", new Date("2027-09-25T12:01:00Z")), false);
  assert.equal(hasActiveAccess(null), true);
});

test("two purchases of one course show once, keeping the one with progress", () => {
  const rows = [
    { id: "test", course_slug: "prompt", paid_at: "2026-09-22T17:20:00Z" },
    { id: "live", course_slug: "prompt", paid_at: "2026-09-25T12:47:00Z" },
    { id: "other", course_slug: "hr", paid_at: "2026-09-20T10:00:00Z" },
  ];
  const now = new Date("2026-09-26T00:00:00Z");
  const held = onePerCourse(rows, new Map([["test", passed("a", "b")]]), now);
  assert.deepEqual(
    held.map((row) => row.purchase.id),
    ["test", "other"]
  );
  assert.deepEqual(onePerCourse(rows, new Map(), now).map((row) => row.purchase.id), ["live", "other"]);
});

test("an open purchase beats an expired one, even with less progress", () => {
  const rows = [
    { id: "old", course_slug: "prompt", paid_at: "2025-01-01T00:00:00Z" },
    { id: "new", course_slug: "prompt", paid_at: "2026-09-01T00:00:00Z" },
  ];
  const held = onePerCourse(rows, new Map([["old", passed("a", "b", "c")]]), new Date("2026-09-26T00:00:00Z"));
  assert.equal(held.length, 1);
  assert.equal(held[0].purchase.id, "new");
  assert.equal(held[0].active, true);
});

test("a repurchase carries on from the furthest progress", () => {
  const signed: CourseProgress = { ...passed("a"), signedName: "Sam", ref: "EX1", signedAt: "2026-01-01" };
  const progress = new Map([
    ["one", passed("a", "b")],
    ["two", signed],
  ]);
  assert.equal(furthestProgress(["one", "two"], progress), signed);
  assert.equal(furthestProgress(["none"], progress), undefined);
});
