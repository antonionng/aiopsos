import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkDiscovery,
  finalDiscoveries,
  readArcadeDraft,
  type CoachedGame,
} from "./arcade-coaching.ts";
import {
  checkPrompt,
  checkEvidence,
  promptRounds,
  evidenceRounds,
  type Verdict,
} from "./games.ts";

test("each fresh challenge requires inspecting the source and making the supported repair", () => {
  for (const type of Object.keys(finalDiscoveries) as CoachedGame[]) {
    const challenge = finalDiscoveries[type];
    assert.equal(checkDiscovery(type, challenge.correct, false).won, false);
    assert.equal(checkDiscovery(type, "unknown", true).won, false);
    for (const choice of challenge.choices) {
      const result = checkDiscovery(type, choice.id, true);
      assert.equal(result.won, choice.id === challenge.correct);
      assert.ok(result.message.length > 50);
    }
  }
});

test("free drafts restore fixed choices while rejecting corrupt, duplicate and out-of-range data", () => {
  assert.deepEqual(readArcadeDraft("creature", '["boots","helmet"]'), [
    "boots",
    "helmet",
  ]);
  assert.deepEqual(readArcadeDraft("prompt", "[2,-1,0]"), [2, -1, 0]);
  assert.deepEqual(readArcadeDraft("evidence", '["keep",null,"remove"]'), [
    "keep",
    null,
    "remove",
  ]);
  for (const raw of [null, "broken", "{}", "[true,false]", '["unknown"]']) {
    assert.deepEqual(readArcadeDraft("creature", raw), []);
    assert.deepEqual(readArcadeDraft("prompt", raw), [-1, -1, -1]);
    assert.deepEqual(readArcadeDraft("evidence", raw), [null, null, null]);
  }
  assert.deepEqual(readArcadeDraft("creature", '["boots","boots"]'), []);
  assert.deepEqual(readArcadeDraft("creature", '["boots","leaf","shade"]'), []);
  for (const raw of ["[0,1,3]", "[-2,1,0]", "[0,1,1.5]", "[0,1]", '["0",1,2]'])
    assert.deepEqual(readArcadeDraft("prompt", raw), [-1, -1, -1]);
  assert.deepEqual(readArcadeDraft("evidence", '["keep","approve","remove"]'), [
    null,
    null,
    null,
  ]);
});

test("repair markers point to the first mismatch and clear after correction", () => {
  promptRounds.forEach((round, index) => {
    const right = round.slots.map((slot) => slot.correct);
    assert.equal(checkPrompt(index, right).failedSlot, null);
    const wrong = [...right];
    wrong[1] = (wrong[1] + 1) % 3;
    wrong[2] = (wrong[2] + 1) % 3;
    assert.equal(checkPrompt(index, wrong).failedSlot, 1);
    wrong[1] = right[1];
    assert.equal(checkPrompt(index, wrong).failedSlot, 2);
  });
  evidenceRounds.forEach((round, index) => {
    const right = round.claims.map((claim) => claim.action as Verdict);
    assert.equal(checkEvidence(index, right).failedClaim, null);
    const wrong = [...right];
    wrong[2] = wrong[2] === "keep" ? "remove" : "keep";
    assert.equal(checkEvidence(index, wrong).failedClaim, 2);
  });
});
