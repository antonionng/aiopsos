import { test } from "node:test";
import assert from "node:assert/strict";
import { readGeneration, readRate } from "./generation-rules.ts";

const response = (
  content: unknown,
  finish = "stop",
  refusal: unknown = null,
) => ({
  choices: [{ finish_reason: finish, message: { content, refusal } }],
  usage: { prompt_tokens: 80, completion_tokens: 40 },
});

test("guided generation accepts a complete bounded draft and valid usage", () => {
  assert.deepEqual(
    readGeneration(response(" Check the draft against the supplied facts. ")),
    {
      output: "Check the draft against the supplied facts.",
      inputTokens: 80,
      outputTokens: 40,
    },
  );
});

test("truncated, refused, excessive, linked or marked-up responses are never accepted", () => {
  for (const value of [
    response("A partial answer", "length"),
    response("Blocked", "content_filter"),
    response("A draft", "stop", "Cannot help"),
    response(""),
    response(null),
    response("word ".repeat(251)),
    response("<a href='example'>Follow this</a>"),
    response("Go to https://example.com"),
    response("Go to www.example.com"),
    response("[Open this](example.com)"),
    {},
    null,
    { ...response("Draft"), usage: undefined },
    {
      ...response("Draft"),
      usage: { prompt_tokens: -1, completion_tokens: 5 },
    },
    {
      ...response("Draft"),
      usage: { prompt_tokens: 2, completion_tokens: "5" },
    },
  ])
    assert.throws(() => readGeneration(value));
});

test("missing and blank rates cannot silently enable uncosted generation", () => {
  for (const value of [
    undefined,
    "",
    "  ",
    "NaN",
    "Infinity",
    "-1",
    "not-a-rate",
  ])
    assert.equal(readRate(value), null);
  assert.equal(readRate("0"), 0);
  assert.equal(readRate("1.25"), 1.25);
});
