import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * lib/companions.ts cannot be imported here (it pulls in the AI SDK and the
 * admin client, which node:test does not resolve), so the privacy invariant
 * is pinned at source level instead: the insights companion must have NO
 * per-user usage tool, and its one usage tool must take no parameters - a
 * tool without an identity parameter cannot be asked about an individual.
 * Brittle by design: if someone renames or adds a usage tool, this test
 * makes them read this file and think about why the floor exists.
 */
const source = readFileSync(join(import.meta.dirname, "..", "companions.ts"), "utf8");

test("exactly one usage tool exists and it is the aggregate one", () => {
  const usageTools = source.match(/get\w*Usage\w*:\s*tool\(/g) ?? [];
  assert.deepEqual(usageTools, ["getUsageSummary: tool("]);
});

test("the usage tool takes no parameters", () => {
  const start = source.indexOf("getUsageSummary: tool(");
  assert.ok(start > -1);
  const block = source.slice(start, start + 600);
  assert.match(block, /inputSchema:\s*z\.object\(\{\}\)/);
});

test("the member lookup is scoped to the caller's organisation in code", () => {
  const start = source.indexOf("getMemberTrainingRecord: tool(");
  assert.ok(start > -1);
  const block = source.slice(start, source.indexOf("getUsageSummary"));
  assert.match(block, /\.eq\("org_id", ctx\.orgId\)/);
});

test("the suppression floor is imported from practice-delta, not restated", () => {
  assert.match(source, /MIN_ACTIVE_USERS_FOR_REPORTING/);
});
