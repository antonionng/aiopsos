import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveModelForRequest } from "../model-plan.ts";
import { COMPANION_META } from "../companion-meta.ts";

test("a plan that cannot afford the companion default gets clamped down", () => {
  // The learning agent defaults to gpt-4o for reliable tool calling, but
  // PLAN_MODELS.basic is gpt-4o-mini only. Without the clamp, raising that
  // default would hand every Basic org a model at ~16x the input cost.
  const result = resolveModelForRequest({
    plan: "basic",
    companionDefault: COMPANION_META.learning.defaultModel,
    allowModelSelect: false,
  });
  assert.deepEqual(result, { ok: true, modelId: "gpt-4o-mini" });
});

test("a plan that includes the default keeps it", () => {
  for (const plan of ["pro", "enterprise"] as const) {
    const result = resolveModelForRequest({
      plan,
      companionDefault: COMPANION_META.learning.defaultModel,
      allowModelSelect: false,
    });
    assert.deepEqual(result, { ok: true, modelId: "gpt-4o" });
  }
});

test("an explicit pick outside the plan is refused, not clamped", () => {
  // Refusing is deliberate: silently downgrading would bill for a model the
  // user did not choose and misattribute the answer's quality.
  const result = resolveModelForRequest({
    plan: "basic",
    companionDefault: "gpt-4o-mini",
    requestedModel: "gpt-5.2",
    allowModelSelect: true,
  });
  assert.deepEqual(result, { ok: false, reason: "not_in_plan" });
});

test("learners cannot override the default even by asking", () => {
  const result = resolveModelForRequest({
    plan: "enterprise",
    companionDefault: "gpt-4o",
    requestedModel: "gpt-5.2",
    allowModelSelect: false,
  });
  assert.deepEqual(result, { ok: true, modelId: "gpt-4o" });
});

test("a non-string requested model falls back to the default", () => {
  const result = resolveModelForRequest({
    plan: "pro",
    companionDefault: "gpt-4o",
    requestedModel: { evil: true },
    allowModelSelect: true,
  });
  assert.deepEqual(result, { ok: true, modelId: "gpt-4o" });
});
