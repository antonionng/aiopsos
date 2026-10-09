import { test } from "node:test";
import assert from "node:assert/strict";
import { adventures } from "./catalog.ts";
import { initialAdventure, transition } from "./engine.ts";
import { planRouteTest } from "./route-test.ts";
import { coachContext } from "./coaching.ts";
import type { ForgeLevel } from "./types.ts";
const game = adventures.find((g) => g.slug === "prompt-repair-shop")!;
const level = game.levels[0] as ForgeLevel;

test("automatic test stops on the learner's path before the missing bridge", () => {
  const tiles = [...level.initial];
  const result = planRouteTest(level, tiles, 20);
  assert.deepEqual(result, {
    goal: 20,
    path: [14, 15, 16],
    gap: 17,
    reached: false,
  });
  assert.deepEqual(tiles, level.initial);
  assert.ok(!result.path.includes(17));
});
test("a repaired route produces a server-valid journey and never needs manual movement", () => {
  let state = initialAdventure(game);
  state = transition(game, state, { type: "tile", cell: 17 });
  state = transition(game, state, { type: "fabricate" });
  const result = planRouteTest(level, state.rounds[0].tiles, 20);
  assert.equal(result.reached, true);
  state = transition(game, state, { type: "walk", path: result.path });
  assert.equal(state.rounds[0].solved, true);
});
test("an existing detour is preferred to a shorter route with a missing piece", () => {
  const custom = { ...level, rocks: [], water: [], initial: [], goals: [16] };
  const result = planRouteTest(custom, [7, 8, 9], 16);
  assert.equal(result.reached, true);
  assert.deepEqual(result.path, [14, 7, 8, 9, 16]);
});
test("diagnosis handles an empty construction and a destination sealed by rocks", () => {
  assert.deepEqual(planRouteTest(level, [], 20).path, [14]);
  const blocked = { ...level, rocks: [13, 19, 27] };
  const result = planRouteTest(blocked, level.initial, 20);
  assert.equal(result.reached, false);
  assert.equal(result.gap, null);
});
test("every Forge destination can be automatically tested without bypassing the validator", () => {
  for (const g of adventures) {
    for (let round = 0; round < 2; round++) {
      const l = g.levels[round];
      if (l.kind !== "forge") continue;
      let state = initialAdventure(g);
      state.round = round;
      const tiles = new Set<number>();
      // Build complete routes by addressing only the first reported gap each time.
      for (const goal of l.goals) {
        for (let attempts = 0; attempts < 35; attempts++) {
          const trial = planRouteTest(l, [...tiles], goal);
          if (trial.reached) break;
          assert.notEqual(trial.gap, null);
          tiles.add(trial.gap!);
        }
      }
      assert.ok(tiles.size <= l.budget, g.slug);
      for (const cell of [...state.rounds[round].instructions])
        state = transition(g, state, { type: "tile", cell });
      for (const cell of tiles)
        state = transition(g, state, { type: "tile", cell });
      state = transition(g, state, { type: "fabricate" });
      for (const goal of l.goals) {
        const result = planRouteTest(l, state.rounds[round].tiles, goal);
        assert.equal(result.reached, true);
        state = transition(g, state, { type: "walk", path: result.path });
      }
      assert.equal(state.rounds[round].solved, true, g.slug);
    }
  }
});
test("coach context uses game facts and never includes a child's writing or creation", () => {
  const state = initialAdventure(game);
  state.rounds[0].reflection = "PRIVATE_CHILD_WRITING";
  state.rounds[0].feedback = "PRIVATE_FEEDBACK";
  state.collection = ["PRIVATE_CREATION"];
  const context = coachContext(game, state);
  assert.match(context, /unbridged water gap/);
  assert.ok(!context.includes("PRIVATE_"));
  const fixed = transition(game, state, { type: "tile", cell: 17 });
  assert.match(coachContext(game, fixed), /connects all destinations/);
  fixed.round = 2;
  assert.throws(() => coachContext(game, fixed));
});
