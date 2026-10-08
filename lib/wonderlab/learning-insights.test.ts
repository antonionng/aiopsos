import { test } from "node:test";
import assert from "node:assert/strict";
import { learningInsights } from "./learning-insights.ts";
import { missions } from "./catalog.ts";
import { generationRemaining, isEntitled } from "./engine.ts";
import type { Order } from "./types.ts";
const mission = missions.find((m) => m.band === "creators")!;
const order: Order = {
  id: "grant",
  child_id: "child-a",
  mission_slug: mission.slug,
  state: "granted",
  expires_at: null,
  generations_used: 0,
};

test("complimentary AI allowances renew by UTC month while paid allowances retain their access period", () => {
  const current = new Date("2026-11-01T00:00:00Z");
  const used = {
    ...order,
    generations_used: 30,
    generation_period_start: "2026-10-01T00:00:00Z",
  };
  assert.equal(generationRemaining(used, current), 30);
  assert.equal(generationRemaining(used, new Date("2026-10-31T23:59:59Z")), 0);
  assert.equal(generationRemaining({ ...used, state: "paid" }, current), 0);
});

test("lifetime access has no expiry but does not change paid expiry rules", () => {
  assert.equal(isEntitled(order, Date.parse("2100-01-01")), true);
  assert.equal(isEntitled({ state: "paid", expires_at: null }), false);
  assert.equal(
    isEntitled({ state: "granted", expires_at: "2027-01-01" }),
    false,
  );
  assert.equal(isEntitled({ state: "refunded", expires_at: null }), false);
});
test("new profiles show no invented achievements and recommend an accessible age-level mission", () => {
  const result = learningInsights("child-a", "creators", [], [order]);
  assert.equal(result.completed, 0);
  assert.equal(result.started, 0);
  assert.equal(result.recent, null);
  assert.equal(result.skills.length, 6);
  assert.equal(result.next?.slug, mission.slug);
  assert.equal(
    learningInsights("child-a", "explorers", [], [order]).next,
    null,
  );
});
test("insights use saved lesson versions, exclude another child and count checked answers accurately", () => {
  const work = {
    child_id: "child-a",
    mission_slug: mission.slug,
    content_version: mission.version,
    answers: { [mission.activities[0].id]: mission.activities[0].correct },
    creation: "A fictional idea",
    completed: false,
    updated_at: "2026-10-08T12:00:00Z",
  };
  const result = learningInsights(
    "child-a",
    "creators",
    [
      work,
      { ...work, child_id: "child-b", completed: true },
      { ...work, mission_slug: "unknown", completed: true },
    ],
    [order],
  );
  assert.equal(result.started, 1);
  assert.equal(result.completed, 0);
  assert.equal(result.activitiesChecked, 1);
  assert.equal(result.creations, 1);
  assert.equal(result.recent?.title, mission.title);
  assert.match(result.skills[0].status, /1 of 4/);
  assert.equal(
    learningInsights(
      "child-a",
      "creators",
      [{ ...work, content_version: "unknown" }],
      [order],
    ).recent,
    null,
  );
});
