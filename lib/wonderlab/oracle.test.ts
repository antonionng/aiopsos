import assert from "node:assert/strict";
import test from "node:test";
import { FEED_LEVELS, HUNT_PROMPTS, LIBRARY, generate, isEnd, predict, quizScore, supportedByLibrary, train } from "./oracle.ts";

test("the model writes the most common next word, breaking ties by what it read first", () => {
  const model = train(["the cat sat", "the dog ran", "the dog sat"]);
  assert.deepEqual(
    predict(model, "the").map((p) => [p.word, p.count]),
    [["dog", 2], ["cat", 1]],
  );
  assert.equal(generate(model, "the").text, "the dog ran");
  const tie = train(["have eight", "have four"]);
  assert.equal(predict(tie, "have")[0].word, "eight");
});

test("the feeding puzzle can be solved, but not by reading the obvious sentence alone", () => {
  const [level] = FEED_LEVELS;
  let wins = 0;
  const n = level.cards.length;
  for (let mask = 1; mask < 1 << n; mask += 1) {
    const set = level.cards.filter((_, i) => mask & (1 << i));
    if (set.length > level.slots) continue;
    const out = generate(train(set), level.prompt);
    if (out.text === level.target && out.stopped) wins += 1;
  }
  assert.ok(wins >= 1 && wins <= 4, `winning sets: ${wins}`);
  assert.ok(!level.cards.includes(level.target), "the target must be stitched together, not copied");
  assert.notEqual(generate(train([level.cards[0]]), level.prompt).text, level.target);
});

test("the hunt mixes true and confidently false statements", () => {
  const model = train(LIBRARY);
  const outputs = HUNT_PROMPTS.map((prompt) => generate(model, prompt));
  const truths = outputs.map((out) => supportedByLibrary(out.text));
  assert.ok(truths.filter(Boolean).length >= 2);
  assert.ok(truths.filter((value) => !value).length >= 4);
  assert.ok(outputs.every((out) => out.stopped), "every statement is a finished sentence");
  assert.equal(outputs[2].text, "madrid is the capital of france");
});

test("saying 'I don't know' beats answering everything, and confidence alone cannot separate right from wrong", () => {
  const all = quizScore(0);
  const careful = quizScore(0.7);
  assert.ok(careful.total > all.total);
  const italy = all.rows.find((row) => row.country === "italy")!;
  const peru = all.rows.find((row) => row.country === "peru")!;
  assert.equal(italy.outcome, "right");
  assert.equal(peru.outcome, "wrong");
  assert.equal(italy.result!.share, peru.result!.share);
  assert.equal(quizScore(1.01).total, 0);
});

test("the end marker is never shown as a word", () => {
  const out = generate(train(["hello world"]), "hello");
  assert.equal(out.text, "hello world");
  assert.ok(isEnd(out.steps.at(-1)!.chosen));
});
