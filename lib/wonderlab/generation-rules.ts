/** Validate provider data before moderation, storage or charging an allowance. */
export function readGeneration(result: unknown) {
  if (!result || typeof result !== "object")
    throw new Error("Invalid generation");
  const data = result as {
    choices?: {
      finish_reason?: unknown;
      message?: {
        content?: unknown;
        refusal?: unknown;
        tool_calls?: unknown[];
      };
    }[];
    usage?: { prompt_tokens?: unknown; completion_tokens?: unknown };
  };
  const choice =
    Array.isArray(data.choices) && data.choices.length === 1
      ? data.choices[0]
      : undefined;
  const output = choice?.message?.content;
  if (
    choice?.finish_reason !== "stop" ||
    choice.message?.refusal ||
    choice.message?.tool_calls?.length ||
    typeof output !== "string" ||
    !output.trim() ||
    output.length > 6000 ||
    output.trim().split(/\s+/u).length > 250 ||
    /<\/?[a-z][^>]*>|https?:\/\/|www\.|\[[^\]]+\]\([^)]+\)/iu.test(output)
  )
    throw new Error("Response is outside the lesson format");
  const inputTokens = data.usage?.prompt_tokens;
  const outputTokens = data.usage?.completion_tokens;
  if (
    typeof inputTokens !== "number" ||
    !Number.isSafeInteger(inputTokens) ||
    inputTokens < 0 ||
    typeof outputTokens !== "number" ||
    !Number.isSafeInteger(outputTokens) ||
    outputTokens < 0
  )
    throw new Error("Provider usage is missing or invalid");
  return { output: output.trim(), inputTokens, outputTokens };
}

export function readRate(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const rate = Number(value);
  return Number.isFinite(rate) && rate >= 0 ? rate : null;
}
