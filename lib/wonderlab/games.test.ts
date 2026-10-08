import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkCreature,
  checkEvidence,
  checkPrompt,
  evidenceRounds,
  habitats,
  promptRounds,
  rescueLevels,
  runRoute,
  type Direction,
  type Verdict,
} from "./games.ts";

test("robot routes run step by step, cross only the bridge and require the key", () => {
  const solutions: Direction[][] = [
    ["right", "right", "right", "right"],
    ["right", "up", "up", "right", "right", "right", "down"],
    ["right", "up", "up", "right", "right", "right", "up"],
  ];
  rescueLevels.forEach((level, i) => {
    const run = runRoute(level, solutions[i]);
    assert.equal(run.won, true);
    assert.equal(run.steps.length, solutions[i].length);
    assert.deepEqual(run.steps.at(-1), level.goal);
    assert.equal(runRoute(level, []).won, false);
  });
  const edge = runRoute(rescueLevels[0], ["left"]);
  assert.equal(edge.won, false);
  assert.equal(edge.steps.length, 0);
  const river = runRoute(rescueLevels[1], ["right", "right"]);
  assert.equal(river.won, false);
  assert.match(river.message, /water/);
  const noKey = runRoute({ ...rescueLevels[0], key: [1, 0] }, solutions[0]);
  assert.equal(noKey.won, false);
  assert.match(noKey.message, /needs the key/);
});

test("habitat tests reward both relevant features, and the next world needs a new design", () => {
  habitats.forEach((habitat, round) => {
    assert.equal(checkCreature(round, habitat.needs).won, true);
    assert.equal(checkCreature(round, []).won, false);
    assert.equal(checkCreature(round, [habitat.needs[0]]).won, false);
    assert.equal(
      checkCreature(round, habitats[(round + 1) % 3].needs).won,
      false,
    );
  });
});

test("prompt machine checks audience, source and length rather than any selected combination", () => {
  promptRounds.forEach((round, i) => {
    const correct = round.slots.map((slot) => slot.correct);
    assert.equal(checkPrompt(i, correct).won, true);
    for (let slot = 0; slot < 3; slot++) {
      const wrong = [...correct];
      wrong[slot] = (wrong[slot] + 1) % 3;
      const result = checkPrompt(i, wrong);
      assert.equal(result.won, false);
      assert.match(
        result.message,
        new RegExp(round.slots[slot].label.toLowerCase()),
      );
      assert.notEqual(result.output, round.output);
    }
    assert.equal(checkPrompt(i, [-1, -1, -1]).won, false);
  });
});

test("release challenge requires verifying every claim and changes the answer pattern", () => {
  evidenceRounds.forEach((round, i) => {
    const correct = round.claims.map((claim) => claim.action as Verdict);
    assert.equal(checkEvidence(i, correct).won, true);
    assert.equal(checkEvidence(i, [null, null, null]).won, false);
    assert.equal(checkEvidence(i, ["keep", "keep", "keep"]).won, false);
    assert.equal(checkEvidence(i, ["remove", "remove", "remove"]).won, false);
    for (let claim = 0; claim < 3; claim++) {
      const wrong = [...correct];
      wrong[claim] = correct[claim] === "keep" ? "remove" : "keep";
      assert.equal(checkEvidence(i, wrong).won, false);
    }
  });
});

test("route feedback identifies the exact failed arrow without blaming later steps", () => {
  assert.equal(runRoute(rescueLevels[0], ["left", "right"]).failedStep, 0);
  const water = runRoute(rescueLevels[1], ["right", "right", "up"]);
  assert.equal(water.failedStep, 1);
  assert.deepEqual(water.steps, [[1, 2]]);
  const incomplete = runRoute(rescueLevels[0], ["right"]);
  assert.equal(incomplete.failedStep, null);
  assert.equal(incomplete.won, false);
  const won = runRoute(rescueLevels[0], ["right", "right", "right", "right"]);
  assert.equal(won.failedStep, null);
  assert.equal(won.won, true);
});

test("resumed route drafts accept only bounded direction lists", async () => {
  const { readRescueDraft } = await import("./rescue-coach.ts");
  assert.deepEqual(readRescueDraft('["right","up"]'), ["right", "up"]);
  for (const raw of [
    null,
    "broken",
    "{}",
    '["sideways"]',
    '["right",null]',
    JSON.stringify(Array(15).fill("up")),
  ]) {
    assert.deepEqual(readRescueDraft(raw), []);
  }
});
