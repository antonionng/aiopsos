import test from "node:test";
import assert from "node:assert/strict";
import { learningTaskRequestKey } from "./task-identity.ts";
test("agent request retries are stable and isolated by actor, workspace and message", () => {
  const key = learningTaskRequestKey("actor", "org", "conversation", "message");
  assert.equal(
    key,
    learningTaskRequestKey("actor", "org", "conversation", "message"),
  );
  assert.match(
    key,
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-a[a-f0-9]{3}-[a-f0-9]{12}$/,
  );
  for (const args of [
    ["other", "org", "conversation", "message"],
    ["actor", "other", "conversation", "message"],
    ["actor", "org", "other", "message"],
    ["actor", "org", "conversation", "other"],
  ])
    assert.notEqual(
      key,
      learningTaskRequestKey(...(args as [string, string, string, string])),
    );
});
