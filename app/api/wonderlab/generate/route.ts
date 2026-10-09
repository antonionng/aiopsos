import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireMission,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { launchStatus } from "@/lib/wonderlab/flags";
import { readGeneration, readRate } from "@/lib/wonderlab/generation-rules";
import { getAdventure } from "@/lib/wonderlab/adventure/catalog";
import { loadAdventure } from "@/lib/wonderlab/adventure/server";
import { coachContext } from "@/lib/wonderlab/adventure/coaching";
export const maxDuration = 60;
const variants: Record<string, string> = {
  "coach-hint":
    "Give one short hint about the learner's current game step, followed by one question that encourages them to investigate. Use at most 60 words. Do not supply a complete solution, claim to have watched them, or claim to control the game. You can only use the reviewed context supplied here.",
  ideas: "Offer a first draft and a question that helps the learner review it.",
  simpler: "Use shorter sentences and explain any specialist words.",
  challenge:
    "Offer a different draft within the same requirements and ask the learner to compare it.",
};
async function openai(path: string, body: unknown) {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error("Provider unavailable");
  return response.json();
}
export async function POST(req: Request) {
  let reservation: string | undefined;
  try {
    assertOrigin(req);
    const b = await readBody(req);
    if (!launchStatus().ai || !process.env.OPENAI_API_KEY)
      throw new WonderlabError(
        "Guided AI is not available. Continue with the authored practice example.",
        503,
      );
    const { mission, child, order } = await requireMission(String(b.slug));
    if (
      !child.ai_enabled ||
      !["creators", "studio"].includes(child.band) ||
      !mission.aiBrief
    )
      throw new WonderlabError(
        "Use the authored practice example for this mission.",
        403,
      );
    if (
      typeof b.requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        b.requestId,
      ) ||
      typeof b.variant !== "string" ||
      !Object.hasOwn(variants, b.variant)
    )
      throw new WonderlabError("Choose one of the guided creation options.");
    let brief = mission.aiBrief;
    if (b.variant === "coach-hint") {
      const game = getAdventure(mission.slug);
      if (!game || !Number.isSafeInteger(b.revision))
        throw new WonderlabError("Open a game before asking for a hint.");
      const saved = await loadAdventure(child.id, game);
      if (saved.revision !== b.revision)
        throw new WonderlabError(
          "Your game changed. Ask again for a hint about the new step.",
          409,
        );
      if (!game.levels[saved.state.round])
        throw new WonderlabError(
          "You have finished this game. Choose another game to keep learning.",
        );
      brief = coachContext(game, saved.state);
    }
    const { data: request, error } = await db.rpc(
      "wonderlab_reserve_generation",
      { p_id: b.requestId, p_order: order.id, p_child: child.id },
    );
    if (error)
      throw new WonderlabError(
        error.message.includes("Allowance")
          ? "Your 30 guided AI responses for this game have been used. You can keep playing with the prepared guidance."
          : "Guided AI could not start. Try the authored example.",
        409,
      );
    if (request.state === "succeeded")
      return NextResponse.json({ text: request.response });
    if (!request.reserved)
      throw new WonderlabError(
        "This creation is already being processed. Please try again shortly.",
        409,
      );
    reservation = b.requestId;
    // Only reviewed curriculum, enumerated choices and coarse game facts leave
    // the server. Names, identifiers, reflections and client context are excluded.
    const result = await openai("chat/completions", {
      model: process.env.WONDERLAB_AI_MODEL,
      store: false,
      max_completion_tokens: 1800,
      messages: [
        {
          role: "system",
          content: `You are an educational game guide and drafting tool for learners aged ${child.band === "creators" ? "11–13" : "14–16"}. Use British English and complete sentences. Explain unfamiliar terms for this age level. Stay strictly within the supplied fictional educational task. Do not request personal information, introduce real people, external links, sexual or violent content, or offer companionship. Give plain text without HTML. Keep the response under 250 words. Encourage the learner to check the result.`,
        },
        { role: "user", content: `${brief}\n${variants[b.variant]}` },
      ],
    });
    const { output, inputTokens, outputTokens } = readGeneration(result);
    const moderation = await openai("moderations", {
      model: "omni-moderation-latest",
      input: output,
    });
    if (
      !Array.isArray(moderation.results) ||
      !moderation.results.length ||
      moderation.results.some((r: { flagged?: boolean }) => r.flagged !== false)
    )
      throw new Error("Response could not be shown");
    const inputRate = readRate(process.env.WONDERLAB_AI_INPUT_USD_PER_MILLION),
      outputRate = readRate(process.env.WONDERLAB_AI_OUTPUT_USD_PER_MILLION);
    if (inputRate === null || outputRate === null)
      throw new Error("Missing cost configuration");
    const cost = Math.round(
      inputTokens * inputRate + outputTokens * outputRate,
    );
    if (!Number.isSafeInteger(cost)) throw new Error("Invalid generation cost");
    const { data: finished, error: fe } = await db.rpc(
      "wonderlab_finish_generation",
      {
        p_id: reservation,
        p_response: output,
        p_input_tokens: inputTokens,
        p_output_tokens: outputTokens,
        p_cost_microusd: cost,
      },
    );
    if (fe || !finished) throw new Error("Creation could not be saved");
    reservation = undefined;
    return NextResponse.json({ text: output });
  } catch (e) {
    if (reservation)
      await db.rpc("wonderlab_finish_generation", {
        p_id: reservation,
        p_response: null,
      });
    return apiError(e);
  }
}
