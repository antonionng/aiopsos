import { test } from "node:test";
import assert from "node:assert/strict";
import { adventures } from "./catalog.ts";
import { initialAdventure, transition } from "./engine.ts";
import { routeEditAction } from "./route-interaction.ts";
import type { ForgeLevel } from "./types.ts";

const game = adventures.find((entry) => entry.slug === "prompt-repair-shop")!;
const level = game.levels[0] as ForgeLevel;

test("ordinary route taps cannot remove an existing piece or reset saved tests", () => {
  let state = initialAdventure(game);
  const add = routeEditAction(level, state.rounds[0].instructions, "editing", {
    intent: "add",
    cell: 17,
  });
  assert.ok(add);
  state = transition(game, state, add);
  state = transition(game, state, { type: "fabricate" });
  const before = structuredClone(state);
  for (const cell of state.rounds[0].instructions) {
    const repeated = routeEditAction(
      level,
      state.rounds[0].instructions,
      "editing",
      {
        intent: "add",
        cell,
      },
    );
    assert.equal(repeated, null);
  }
  assert.deepEqual(state, before);
  assert.equal(state.rounds[0].tiles.length, 5);
});

test("removal is explicit and repeating a removal never adds a piece back", () => {
  let state = initialAdventure(game);
  const remove = routeEditAction(
    level,
    state.rounds[0].instructions,
    "editing",
    {
      intent: "remove",
      cell: 15,
    },
  );
  assert.ok(remove);
  state = transition(game, state, remove);
  assert.ok(!state.rounds[0].instructions.includes(15));
  assert.equal(
    routeEditAction(level, state.rounds[0].instructions, "editing", {
      intent: "remove",
      cell: 15,
    }),
    null,
  );
});

test("a blocked delivery only accepts the named gap repair, without removing other pieces", () => {
  const state = initialAdventure(game);
  const pieces = state.rounds[0].instructions;
  assert.equal(
    routeEditAction(level, pieces, "blocked", { intent: "add", cell: 17 }, 17),
    null,
  );
  assert.equal(
    routeEditAction(
      level,
      pieces,
      "blocked",
      { intent: "remove", cell: 15 },
      17,
    ),
    null,
  );
  assert.equal(
    routeEditAction(
      level,
      pieces,
      "blocked",
      { intent: "repair", cell: 18 },
      17,
    ),
    null,
  );
  const repair = routeEditAction(
    level,
    pieces,
    "blocked",
    { intent: "repair", cell: 17 },
    17,
  );
  assert.ok(repair);
  const repaired = transition(game, state, repair);
  assert.deepEqual(repaired.rounds[0].instructions, [...pieces, 17]);
  assert.equal(
    routeEditAction(
      level,
      repaired.rounds[0].instructions,
      "blocked",
      { intent: "repair", cell: 17 },
      17,
    ),
    null,
  );
});

test("running and delivered worlds cannot be edited and protected world objects are never toggled", () => {
  for (const mode of ["running", "delivered"] as const)
    for (const intent of ["add", "remove", "repair"] as const)
      assert.equal(
        routeEditAction(level, level.initial, mode, { intent, cell: 17 }, 17),
        null,
      );
  for (const cell of [-1, 1.5, 35, level.start, ...level.goals, ...level.rocks])
    assert.equal(
      routeEditAction(level, level.initial, "editing", { intent: "add", cell }),
      null,
    );
});
