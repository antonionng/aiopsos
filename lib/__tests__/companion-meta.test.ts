import { test } from "node:test";
import assert from "node:assert/strict";

import {
  COMPANION_META,
  companionsForRole,
  isCompanionAllowed,
  canSelectModel,
} from "../companion-meta.ts";

test("learners get exactly the learning companion", () => {
  const list = companionsForRole("user").map((c) => c.id);
  assert.deepEqual(list, ["learning"]);
});

test("staff roles get all three companions", () => {
  for (const role of ["manager", "admin", "super_admin"] as const) {
    const list = companionsForRole(role).map((c) => c.id);
    assert.deepEqual(list.sort(), ["insights", "ld", "learning"]);
  }
});

test("companion x role allow/deny matrix", () => {
  assert.equal(isCompanionAllowed("learning", "user"), true);
  assert.equal(isCompanionAllowed("ld", "user"), false);
  assert.equal(isCompanionAllowed("insights", "user"), false);
  assert.equal(isCompanionAllowed("insights", "manager"), true);
  assert.equal(isCompanionAllowed("insights", "admin"), true);
  // Unknown ids are denied for everyone; missing id means learning.
  assert.equal(isCompanionAllowed("root", "super_admin"), false);
  assert.equal(isCompanionAllowed(undefined, "user"), true);
});

test("learners cannot pick a model; staff can", () => {
  assert.equal(canSelectModel("user"), false);
  assert.equal(canSelectModel("manager"), true);
  assert.equal(canSelectModel("admin"), true);
  assert.equal(canSelectModel("super_admin"), true);
});

test("the learning companion defaults to a reliably tool-calling model", () => {
  // Not the cheapest: this agent's whole job is tool use, and gpt-4o-mini
  // drops calls often enough to look broken. /api/chat clamps this to the
  // caller's plan, so a Basic org is not silently upgraded by it.
  assert.equal(COMPANION_META.learning.defaultModel, "gpt-4o");
});
