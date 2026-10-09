import { test } from "node:test";
import assert from "node:assert/strict";
import { normaliseTranscript } from "./wonderlab-realtime-voice.mts";

test("narration accepts equivalent spoken numbers, age ranges and punctuation", () => {
  assert.equal(
    normaliseTranscript("For ages 8–10, write a 60-word sign. Let’s meet at 4 p.m."),
    normaliseTranscript("For ages eight to ten, write a sixty word sign. Let's meet at four pm."),
  );
});

test("narration rejects changed instructions, added words and missing negations", () => {
  for (const [script, altered] of [
    ["Keep it under 60 words.", "Keep it under 40 words."],
    ["Do not share your name.", "Do share your name."],
    ["Tap the arrow.", "Hello! Tap the arrow."],
    ["Move now here.", "Move nowhere."],
  ]) assert.notEqual(normaliseTranscript(script), normaliseTranscript(altered));
});
