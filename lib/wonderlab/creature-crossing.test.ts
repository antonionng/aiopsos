import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  CROSSING_LEVELS,
  PIP,
  TUTORIAL,
  crossingNarrationScripts,
  decide,
  exampleSets,
  explain,
  homeOf,
  readCrossingSave,
  runHerd,
  missingHomes,
  starsFor,
  unlocked,
  type Creature,
} from "./creature-crossing.ts";

const creature = (id: string, code: string): Creature => {
  const [colour, pattern, shape, limbs] = code.split(" ");
  return { id, colour, pattern, shape, limbs } as Creature;
};

test("every level can be completed perfectly within its example slots", () => {
  for (const level of CROSSING_LEVELS) {
    let best = 0;
    for (const set of exampleSets(level)) best = Math.max(best, runHerd(level, set).home);
    assert.equal(best, level.herd.length, level.id);
  }
});

test("each level's obvious examples leave a lesson to discover, except the tutorial", () => {
  const [tutorial, ...rest] = CROSSING_LEVELS;
  assert.equal(runHerd(tutorial, tutorial.obvious).stars, 3);
  for (const level of rest) {
    assert.ok(level.obvious.length <= level.slots, level.id);
    assert.ok(runHerd(level, level.obvious).stars < 3, level.id);
  }
});

test("the colour trap fails exactly the creatures whose colour does not match their home", () => {
  const level = CROSSING_LEVELS.find((l) => l.id === "colour-trap")!;
  const { decisions } = runHerd(level, level.obvious);
  for (const decision of decisions) {
    const typical = (decision.creature.colour === "blue") === (decision.creature.limbs === "fins");
    assert.equal(decision.correct, typical, decision.creature.id);
  }
});

test("the gate is unsure about winged creatures until it has seen a winged example", () => {
  const level = CROSSING_LEVELS.find((l) => l.id === "sky-visitors")!;
  const winged = runHerd(level, level.obvious).decisions.filter((d) => d.creature.limbs === "wings");
  assert.ok(winged.length > 0);
  assert.ok(winged.every((d) => d.sentTo === "unsure"));
});

test("pens and herds contain only homes the level offers, with unique ids", () => {
  for (const level of CROSSING_LEVELS) {
    const ids = [...level.pen, ...level.herd].map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, level.id);
    for (const c of [...level.pen, ...level.herd]) assert.ok(level.homes.includes(homeOf(c)), c.id);
    for (const id of level.obvious) assert.ok(level.pen.some((c) => c.id === id), id);
  }
});

test("ties between homes are reported as unsure rather than guessed", () => {
  const river = creature("r", "blue plain round fins");
  const woods = creature("w", "orange stripes round legs");
  const middle = creature("m", "blue stripes round wings");
  assert.equal(decide(middle, [river, woods]).sentTo, "unsure");
  assert.equal(decide(middle, []).sentTo, "unsure");
  assert.match(explain(decide(middle, [river, woods])), /could not decide\. None of your examples has wings/);
});

test("explanations name the misleading clue and the real reason", () => {
  const decision = decide(creature("x", "orange spots round fins"), [creature("w", "orange spots tall legs")]);
  assert.equal(decision.sentTo, "woods");
  const text = explain(decision);
  assert.match(text, /orange colour and spots/);
  assert.match(text, /it has fins, so it really lives in the river/);
  assert.doesNotMatch(text, /—/);
});

test("stars and level unlocking", () => {
  assert.deepEqual([starsFor(10, 10), starsFor(8, 10), starsFor(6, 10), starsFor(5, 10)], [3, 2, 1, 0]);
  const save = readCrossingSave({ stars: { "first-crossing": 2, "colour-trap": 9, other: 3 } });
  assert.deepEqual(save.stars, { "first-crossing": 2 });
  assert.ok(unlocked(save, 1));
  assert.ok(!unlocked(save, 2));
  assert.deepEqual(readCrossingSave("nonsense").stars, {});
});

test("learner-facing copy avoids em dashes", () => {
  for (const level of CROSSING_LEVELS) {
    for (const text of [level.title, level.brief, level.hint, level.lesson]) assert.doesNotMatch(text, /—/);
  }
});

test("every line Pip says has a recorded clip", () => {
  const manifest = JSON.parse(readFileSync(new URL("./narration-manifest.json", import.meta.url), "utf8"));
  const scripts = crossingNarrationScripts();
  assert.ok(scripts.length >= Object.keys(PIP).length);
  for (const script of scripts) {
    assert.equal(manifest[script.id], `/audio/wonderlab/${script.id}.mp3`, script.text);
    const bytes = readFileSync(new URL(`../../public${manifest[script.id]}`, import.meta.url));
    assert.ok(bytes.length > 1000, script.text);
  }
});

test("each level asks one question with exactly one right answer", () => {
  for (const level of CROSSING_LEVELS) {
    assert.equal(level.question.options.filter((option) => option.correct).length, 1, level.id);
    assert.ok(level.pip.length < 160, `${level.id} intro should be short enough to follow by ear`);
  }
});

test("the tutorial points at creatures that exist and teach both homes", () => {
  const [first] = CROSSING_LEVELS;
  const targets = TUTORIAL.map((step) => first.pen.find((c) => c.id === step.target)!);
  assert.ok(targets.every(Boolean));
  assert.deepEqual(new Set(targets.map(homeOf)), new Set(["river", "woods"]));
  assert.equal(runHerd(first, targets.map((c) => c.id)).stars, 3);
});

test("homes without an example are reported, because the gate can never send anything there", () => {
  const level = CROSSING_LEVELS.find((l) => l.id === "colour-trap")!;
  const riverOnly = ["p2-1", "p2-2", "p2-3", "p2-7"];
  assert.deepEqual(missingHomes(level, riverOnly), ["woods"]);
  assert.ok(runHerd(level, riverOnly).decisions.every((d) => d.sentTo === "river"));
  assert.deepEqual(missingHomes(level, level.obvious), []);
});
