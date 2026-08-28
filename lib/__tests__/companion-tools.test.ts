import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { TOOL_LABELS, toolLabel } from "../companion-meta.ts";

/**
 * The transcript renders each tool call by name, but the names live in
 * lib/companions.ts (server-only, imports the admin client) and the labels
 * live in lib/companion-meta.ts (client-safe). They cannot import each other,
 * so this pins them together: a tool added or renamed without a label would
 * otherwise silently fall back to a machine-ish string in the UI.
 */
const source = readFileSync(join(import.meta.dirname, "..", "companions.ts"), "utf8");

function declaredToolNames(): string[] {
  return [...source.matchAll(/^\s{4}(\w+):\s*tool\(\{/gm)].map((m) => m[1]);
}

test("every tool declared in companions.ts has a human label", () => {
  const names = declaredToolNames();
  assert.ok(names.length > 0, "expected to find tool declarations");
  const missing = names.filter((n) => !TOOL_LABELS[n]);
  assert.deepEqual(missing, [], `tools missing a label: ${missing.join(", ")}`);
});

test("no label exists for a tool that is gone", () => {
  const names = new Set(declaredToolNames());
  const orphans = Object.keys(TOOL_LABELS).filter((n) => !names.has(n));
  assert.deepEqual(orphans, [], `labels with no tool: ${orphans.join(", ")}`);
});

test("labels distinguish in-flight from finished", () => {
  assert.equal(toolLabel("getMyProgress", false), "Checking your training record");
  assert.equal(toolLabel("getMyProgress", true), "Checked your training record");
});

test("an unknown tool still reads as words, not a raw identifier", () => {
  assert.equal(toolLabel("getSomeNewThing", false), "Running get some new thing");
  assert.equal(toolLabel("getSomeNewThing", true), "Finished get some new thing");
});
