import { test } from "node:test";
import assert from "node:assert/strict";
import {
  creditsForTokenUsage,
  creditsForGbpCost,
  creditsToPence,
  packGrossMargin,
  DEFAULT_CREDIT_SETTINGS,
} from "../credit-math.ts";

const s = DEFAULT_CREDIT_SETTINGS;

test("token usage converts USD cost through fx and markup, ceiling up", () => {
  // gpt-4o, 1k in / 500 out: $0.0025 + $0.005 = $0.0075
  // -> 0.0075 * 0.8 * 2.5 * 100 = 1.5p -> 2 credits
  assert.equal(creditsForTokenUsage(0.0075, s), 2);
  // gpt-5.2, 3k in / 1k out: $0.015 + $0.02 = $0.035 -> 7p -> 7 credits
  assert.equal(creditsForTokenUsage(0.035, s), 7);
});

test("every metered call costs at least one credit", () => {
  // gpt-4o-mini short exchange: cost rounds far below a penny
  assert.equal(creditsForTokenUsage(0.0001, s), 1);
});

test("zero or invalid cost debits nothing", () => {
  assert.equal(creditsForTokenUsage(0, s), 0);
  assert.equal(creditsForTokenUsage(-1, s), 0);
  assert.equal(creditsForTokenUsage(NaN, s), 0);
});

test("markup changes flow straight through", () => {
  const cheap = { ...s, markup: 1.0 };
  const dear = { ...s, markup: 5.0 };
  assert.equal(creditsForTokenUsage(0.1, cheap), 8); // 0.1*0.8*1*100
  assert.equal(creditsForTokenUsage(0.1, dear), 40);
});

test("feature debits price from GBP raw costs (no fx)", () => {
  // Raw GBP costs from FEATURE_RAW_COSTS in constants.ts:
  // web_search £0.03 -> 0.03*2.5*100 = 7.5p -> 8 credits
  assert.equal(creditsForGbpCost(0.03, s), 8);
  // voice £0.05/min -> 12.5p -> 13 credits per minute
  assert.equal(creditsForGbpCost(0.05, s), 13);
  // image £0.06 -> 15; deep_research £2.00 -> 500
  assert.equal(creditsForGbpCost(0.06, s), 15);
  assert.equal(creditsForGbpCost(2.0, s), 500);
  assert.equal(creditsForGbpCost(0, s), 0);
});

test("credits map to pence at face value", () => {
  assert.equal(creditsToPence(1000), 1000); // £10.00
});

test("seeded packs keep a healthy margin at every discount tier", () => {
  // name, credits, price (pence) - mirrors the 030 seed rows.
  const packs: Array<[string, number, number]> = [
    ["Starter", 1000, 1000],
    ["Team", 5000, 4500],
    ["Scale", 12000, 9600],
    ["Enterprise", 50000, 35000],
  ];
  for (const [name, credits, price] of packs) {
    const margin = packGrossMargin(price, credits, s);
    assert.ok(margin >= 0.4, `${name} margin ${margin.toFixed(2)} fell below 40%`);
    assert.ok(margin < 0.7, `${name} margin ${margin.toFixed(2)} suspiciously high`);
  }
  // Undiscounted face value at markup 2.5 = 60% exactly.
  assert.ok(Math.abs(packGrossMargin(1000, 1000, s) - 0.6) < 1e-9);
});
