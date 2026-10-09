import { test } from "node:test";
import assert from "node:assert/strict";
import { adventures } from "./catalog.ts";
import {
  initialAdventure,
  transition,
  neighbours,
  predict,
  parseAction,
  adventureEvidence,
} from "./engine.ts";
import type { Adventure, AdventureState, ForgeLevel } from "./types.ts";
function route(level: ForgeLevel, goal: number) {
  const queue = [[level.start]],
    seen = new Set<number>([level.start]);
  while (queue.length) {
    const p = queue.shift()!;
    if (p.at(-1) === goal) return p;
    for (const next of neighbours(level, p.at(-1)!)) {
      if (seen.has(next) || level.rocks.includes(next)) continue;
      seen.add(next);
      queue.push([...p, next]);
    }
  }
  throw new Error("Unreachable destination");
}
function solve(game: Adventure, input: AdventureState) {
  let s = input;
  const level = game.levels[s.round];
  const act = (a: unknown) => (s = transition(game, s, a));
  if (level.kind === "forge") {
    const routes = level.goals.map((g) => route(level, g));
    const tiles = [...new Set(routes.flat())].filter(
      (n) => n !== level.start && !level.goals.includes(n),
    );
    assert.ok(
      tiles.length <= level.budget,
      `${game.slug}: solution needs ${tiles.length}, budget ${level.budget}`,
    );
    for (const cell of [...s.rounds[s.round].instructions])
      act({ type: "tile", cell });
    for (const cell of tiles) act({ type: "tile", cell });
    act({ type: "fabricate" });
    for (const path of routes) act({ type: "walk", path });
  } else if (level.kind === "signal") {
    for (const source of level.sources) act({ type: "visit", id: source.id });
    for (const c of level.claims) {
      act({ type: "link", claim: c.id, source: c.source });
      act({ type: "decide", claim: c.id, decision: c.decision });
    }
    act({ type: "test" });
  } else if (level.kind === "lab") {
    for (const e of level.examples)
      if (!s.rounds[s.round].examples.includes(e.id))
        act({ type: "example", id: e.id });
    act({ type: "test" });
  } else {
    for (const t of level.tasks) {
      const slot =
        t.id === "check"
          ? level.tasks[0].earliest + 2
          : t.id === "show"
            ? t.earliest
            : t.earliest;
      act({
        type: "schedule",
        task: t.id,
        slot,
        resource: t.resource,
        helper: t.helper,
      });
    }
    act({ type: "test" });
  }
  assert.equal(
    s.rounds[s.round].solved,
    true,
    `${game.slug}: ${JSON.stringify(s.rounds[s.round].failures)}`,
  );
  return s;
}
test("all 12 games have two independently solvable challenges, reflections and one retained creation", () => {
  assert.equal(adventures.length, 12);
  for (const game of adventures) {
    let s = initialAdventure(game);
    assert.throws(() => transition(game, s, { type: "next" }));
    for (let i = 0; i < 2; i++) {
      s = solve(game, s);
      assert.throws(() => transition(game, s, { type: "next" }));
      s = transition(game, s, {
        type: "reflect",
        text: "I tested the result against the supplied requirements.",
      });
      s = transition(game, s, { type: "next" });
    }
    assert.equal(s.completed, true);
    assert.equal(s.collection.length, 1);
    assert.equal(s.round, 2);
    assert.throws(() => transition(game, s, { type: "next" }));
    const replay = transition(game, s, { type: "replay" });
    assert.equal(replay.round, 0);
    assert.deepEqual(replay.collection, s.collection);
    assert.equal(replay.completed, true);
  }
});
test("construction rejects teleportation, water without a bridge and skipping the fresh challenge", () => {
  const g = adventures.find((g) => g.slug === "prompt-repair-shop")!;
  let s = initialAdventure(g);
  s = transition(g, s, { type: "fabricate" });
  assert.throws(() => transition(g, s, { type: "walk", path: [14, 20] }));
  assert.throws(() =>
    transition(g, s, { type: "walk", path: [14, 7, 0, 1, 2, 3, 4, 5, 6] }),
  );
  assert.throws(() => transition(g, s, { type: "cosmetic", colour: "orange" }));
  s = solve(g, s);
  assert.equal(s.completed, false);
});
test("evidence requires collecting and connecting sources, and incorrect edits can be repaired", () => {
  const g = adventures.find((g) => g.slug === "rumour-lab")!;
  let s = initialAdventure(g);
  assert.throws(() =>
    transition(g, s, { type: "link", claim: "claim-0", source: "source-0" }),
  );
  s = transition(g, s, { type: "test" });
  assert.equal(s.rounds[0].solved, false);
  assert.match(s.rounds[0].feedback, /Visit/);
  s = solve(g, s);
  assert.equal(s.rounds[0].solved, true);
});
test("scheduling reports resource collisions, dependencies and unsuitable helpers", () => {
  const g = adventures.find((g) => g.slug === "brief-builder")!;
  let s = initialAdventure(g);
  const level = g.levels[0];
  assert.equal(level.kind, "launch");
  if (level.kind !== "launch") return;
  for (const t of level.tasks)
    s = transition(g, s, {
      type: "schedule",
      task: t.id,
      slot: 0,
      resource: 0,
      helper: "ai",
    });
  s = transition(g, s, { type: "test" });
  assert.equal(s.rounds[0].solved, false);
  assert.ok(s.rounds[0].failures.some((f) => f.includes("overlaps")));
  assert.ok(s.rounds[0].failures.some((f) => f.includes("after")));
  assert.equal(solve(g, s).rounds[0].solved, true);
});
test("pattern model reports uncertainty and is retested against checked unfamiliar examples", () => {
  const game = adventures[0],
    level = game.levels[0];
  assert.equal(level.kind, "lab");
  if (level.kind !== "lab") return;
  assert.ok(predict(level, ["a", "b"]).every((p) => p.label === "uncertain"));
  assert.ok(predict(level, []).every((p) => p.label === "uncertain"));
  assert.ok(predict(level, ["a", "b", "c", "d"]).every((p) => p.correct));
});
test("actions are bounded and initial templates do not become parent evidence", () => {
  for (const action of [
    null,
    { type: "win" },
    { type: "reflect", text: "x".repeat(601) },
    { type: "walk", path: [-1] },
    { type: "schedule", task: "x", slot: NaN, resource: 0, helper: "ai" },
  ])
    assert.throws(() => parseAction(action));
  for (const g of adventures)
    assert.deepEqual(adventureEvidence(g, initialAdventure(g)), []);
});
