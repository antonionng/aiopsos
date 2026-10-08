import test from "node:test";
import assert from "node:assert/strict";
import { recoveryDisposition } from "./task-recovery-policy.ts";

const now = Date.parse("2026-09-10T00:00:00Z");
const base = { state: "queued", attempts: 0, lease_until: null, dispatch_requested_at: "2026-09-09T23:00:00Z" };
test("unstarted tasks never incur background generation", () => {
  assert.equal(recoveryDisposition({ ...base, dispatch_requested_at: null }, now), "ignore");
});
test("explicit starts and expired work recover, active leases do not", () => {
  assert.equal(recoveryDisposition(base, now), "recover");
  assert.equal(recoveryDisposition({ ...base, state: "running", lease_until: "2026-09-09T23:59:59Z" }, now), "recover");
  for (const lease_until of [null, "invalid", "2026-09-10T00:01:00Z"])
    assert.equal(recoveryDisposition({ ...base, state: "running", lease_until }, now), "ignore");
});
test("cancelled, completed, review and failed tasks never automatically restart", () => {
  for (const state of ["cancelled", "completed", "needs_review", "failed"])
    assert.equal(recoveryDisposition({ ...base, state }, now), "ignore");
});
test("three attempts exhaust recovery without interrupting an active third attempt", () => {
  assert.equal(recoveryDisposition({ ...base, attempts: 3 }, now), "exhausted");
  assert.equal(recoveryDisposition({ ...base, attempts: 3, state: "running", lease_until: "2026-09-10T00:01:00Z" }, now), "ignore");
});
