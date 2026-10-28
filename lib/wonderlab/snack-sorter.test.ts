import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  ITEMS,
  PIP_LINES,
  SORTER_LEVELS,
  SORTER_TUTORIAL,
  decide,
  exampleSets,
  explain,
  missingBaskets,
  readSorterSave,
  runBelt,
  sorterNarrationScripts,
  sorterUnlocked,
} from "./snack-sorter.ts";

test("every level can be sorted perfectly within its example slots", () => {
  for (const level of SORTER_LEVELS) {
    let best = 0;
    for (const set of exampleSets(level)) best = Math.max(best, runBelt(level, set).right);
    assert.equal(best, level.belt.length, level.id);
  }
});

test("the guided start wins level one, so the youngest players begin with success", () => {
  const [first] = SORTER_LEVELS;
  const picks = SORTER_TUTORIAL.map((step) => step.target);
  assert.ok(picks.every((id) => first.pen.includes(id)));
  assert.ok(picks.length <= first.slots);
  assert.equal(runBelt(first, picks).stars, 3);
});

test("the red trap: with only red yummy examples, Pip tries to eat the red toy car and nothing else goes wrong", () => {
  const level = SORTER_LEVELS.find((l) => l.id === "red-trap")!;
  const misses = runBelt(level, level.obvious).decisions.filter((d) => !d.correct);
  assert.deepEqual(misses.map((d) => [d.item.id, d.sentTo]), [["car", "yummy"]]);
  assert.match(explain(misses[0]), /toy car was yummy, because it is red/);
});

test("Bo's rule cannot be learned without a green example in the yucky basket", () => {
  const level = SORTER_LEVELS.find((l) => l.id === "bo-hates-green")!;
  const withoutGreen = runBelt(level, level.obvious);
  assert.ok(withoutGreen.decisions.filter((d) => d.item.colour === "green").every((d) => !d.correct));
  assert.equal(runBelt(level, ["apple", "banana", "cookie", "pear"]).stars, 3);
});

test("every item exists and its picture and name are set", () => {
  for (const level of SORTER_LEVELS) {
    for (const id of [...level.pen, ...level.belt, ...level.obvious]) {
      assert.ok(ITEMS[id], `${level.id}: ${id}`);
      assert.ok(ITEMS[id].emoji && ITEMS[id].name);
    }
    assert.ok(level.obvious.every((id) => level.pen.includes(id)), level.id);
    assert.equal(level.question.options.filter((option) => option.correct).length, 1, level.id);
  }
});

test("a basket with no examples is reported, and an empty memory leaves Pip unsure", () => {
  const [first] = SORTER_LEVELS;
  assert.deepEqual(missingBaskets(first, ["apple", "banana"]), ["yucky"]);
  assert.equal(decide(first, ITEMS.apple, []).sentTo, "unsure");
});

test("every line Pip can say, including each explanation, has a recorded clip", () => {
  const manifest = JSON.parse(readFileSync(new URL("./narration-manifest.json", import.meta.url), "utf8"));
  const scripts = sorterNarrationScripts();
  assert.ok(scripts.length > Object.keys(PIP_LINES).length);
  for (const script of scripts) {
    assert.equal(manifest[script.id], `/audio/wonderlab/${script.id}.mp3`, script.text);
    assert.ok(readFileSync(new URL(`../../public${manifest[script.id]}`, import.meta.url)).length > 1000, script.text);
    assert.doesNotMatch(script.text, /—/);
  }
});

test("saves keep only valid stars and unlock levels in order", () => {
  const save = readSorterSave({ stars: { "first-lunch": 2, "red-trap": 7 } });
  assert.deepEqual(save.stars, { "first-lunch": 2 });
  assert.ok(sorterUnlocked(save, 1));
  assert.ok(!sorterUnlocked(save, 2));
});
