import { test } from "node:test";
import assert from "node:assert/strict";

import { COST_CEILINGS, budgetWindows, evaluateBudget } from "../budget-math.ts";

test("windows are UTC and reset at midnight / month start", () => {
  // 23:30 UTC on 31 January - both windows roll within the next hour.
  const w = budgetWindows(new Date(Date.UTC(2026, 0, 31, 23, 30)));
  assert.equal(w.dayStart.toISOString(), "2026-01-31T00:00:00.000Z");
  assert.equal(w.monthStart.toISOString(), "2026-01-01T00:00:00.000Z");
  assert.equal(w.dayResetAt.toISOString(), "2026-02-01T00:00:00.000Z");
  assert.equal(w.monthResetAt.toISOString(), "2026-02-01T00:00:00.000Z");
});

test("month rollover in December lands in January of the next year", () => {
  const w = budgetWindows(new Date(Date.UTC(2026, 11, 15)));
  assert.equal(w.monthResetAt.toISOString(), "2027-01-01T00:00:00.000Z");
});

test("under both ceilings is allowed", () => {
  const windows = budgetWindows(new Date(Date.UTC(2026, 7, 25, 12)));
  const v = evaluateBudget({ plan: "basic", dailySpent: 0.1, monthlySpent: 1, windows });
  assert.equal(v.allowed, true);
});

test("at the daily ceiling is refused with the day reset time", () => {
  const windows = budgetWindows(new Date(Date.UTC(2026, 7, 25, 12)));
  const v = evaluateBudget({
    plan: "basic",
    dailySpent: COST_CEILINGS.basic.daily,
    monthlySpent: 1,
    windows,
  });
  assert.equal(v.allowed, false);
  assert.equal(v.exceeded, "daily");
  assert.equal(v.resetAt?.toISOString(), "2026-08-26T00:00:00.000Z");
});

test("the monthly ceiling wins over the daily one", () => {
  const windows = budgetWindows(new Date(Date.UTC(2026, 7, 25, 12)));
  const v = evaluateBudget({
    plan: "pro",
    dailySpent: COST_CEILINGS.pro.daily + 1,
    monthlySpent: COST_CEILINGS.pro.monthly + 1,
    windows,
  });
  assert.equal(v.exceeded, "monthly");
  assert.equal(v.resetAt?.toISOString(), "2026-09-01T00:00:00.000Z");
});

test("an unknown plan falls back to the basic ceiling", () => {
  const windows = budgetWindows(new Date(Date.UTC(2026, 7, 25, 12)));
  const v = evaluateBudget({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plan: "mystery" as any,
    dailySpent: COST_CEILINGS.basic.daily,
    monthlySpent: 0,
    windows,
  });
  assert.equal(v.allowed, false);
});
