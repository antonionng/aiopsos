import "server-only";
import { createHash } from "node:crypto";
import { launchStatus } from "./flags";
import { readGeneration, readRate } from "./generation-rules";
import { containsPrivateDetails } from "./first-person";
import { db, requireMission, WonderlabError } from "./server";

/** This preview is an optional creation activity within Game Concept Studio. */
export const ARCADE_ALLOWANCE_SOURCE = "game-concept-studio";
export const ARCADE_ALLOWANCE_LABEL =
  "Each successful AI design uses one of your Game Concept Studio AI responses. Prepared practice does not use this allowance.";
const FORMAT = "wonderlab-arcade-design-v2";
const REQUEST_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ArcadeDesign = {
  title: string;
  collectible: "star" | "crystal" | "firefly";
  target: number;
  palette: "twilight" | "forest" | "sunset";
  speed: "calm" | "swift";
  bonus: boolean;
  challenge: "collect" | "key";
};
type DesignResult = { design: ArcadeDesign; explanation: string };
export type ArcadeIntent = Partial<Omit<ArcadeDesign, "title">>;
type DesignRequest = {
  childId: string;
  requestId: string;
  intent: ArcadeIntent;
  current: ArcadeDesign;
  allowanceSource: typeof ARCADE_ALLOWANCE_SOURCE;
};

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function keys(value: Record<string, unknown>, expected: string[]) {
  return (
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}

// Generated titles and explanations must stay within the fictional activity.
function safeText(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    !!value.trim() &&
    value.length <= maximum &&
    !/[<>\u0000-\u001f\u007f]/u.test(value) &&
    !containsPrivateDetails(value)
  );
}
export function readArcadeDesign(value: unknown): ArcadeDesign {
  if (
    !record(value) ||
    !keys(value, ["title", "collectible", "target", "palette", "speed", "bonus", "challenge"]) ||
    !safeText(value.title, 60) ||
    typeof value.collectible !== "string" ||
    !["star", "crystal", "firefly"].includes(value.collectible) ||
    typeof value.palette !== "string" ||
    !["twilight", "forest", "sunset"].includes(value.palette) ||
    typeof value.speed !== "string" ||
    !["calm", "swift"].includes(value.speed) ||
    !Number.isInteger(value.target) ||
    Number(value.target) < 3 ||
    Number(value.target) > 8 ||
    typeof value.bonus !== "boolean" ||
    typeof value.challenge !== "string" ||
    !["collect", "key"].includes(value.challenge)
  )
    throw new WonderlabError("Choose a game design that this workshop can build.");
  return {
    title: value.title.trim(),
    collectible: value.collectible as ArcadeDesign["collectible"],
    target: value.target as number,
    palette: value.palette as ArcadeDesign["palette"],
    speed: value.speed as ArcadeDesign["speed"],
    bonus: value.bonus,
    challenge: value.challenge as ArcadeDesign["challenge"],
  };
}

export function readArcadeRequest(body: Record<string, unknown>): DesignRequest {
  if (
    !keys(body, ["childId", "requestId", "current", "intent", "allowanceSource"]) ||
    typeof body.childId !== "string" ||
    !REQUEST_ID.test(body.childId) ||
    typeof body.requestId !== "string" ||
    !REQUEST_ID.test(body.requestId) ||
    body.allowanceSource !== ARCADE_ALLOWANCE_SOURCE
  )
    throw new WonderlabError("Open your profile and choose the AI design option.");
  const current = readArcadeDesign(body.current);
  if (
    !record(body.intent) ||
    !Object.keys(body.intent).length ||
    Object.keys(body.intent).some((key) =>
      !["collectible", "target", "palette", "speed", "bonus", "challenge"].includes(key),
    )
  )
    throw new WonderlabError(
      "Ask to change the objects, their number, the colours, your speed, bonus treasure or whether the portal needs a key.",
    );
  // Reuse the strict full-design validator, then rebuild the intent in a stable
  // order. Arbitrary strings, extra properties and executable code are rejected.
  const candidate = readArcadeDesign({ ...current, ...body.intent });
  const intent: ArcadeIntent = {};
  if (Object.hasOwn(body.intent, "collectible")) intent.collectible = candidate.collectible;
  if (Object.hasOwn(body.intent, "target")) intent.target = candidate.target;
  if (Object.hasOwn(body.intent, "palette")) intent.palette = candidate.palette;
  if (Object.hasOwn(body.intent, "speed")) intent.speed = candidate.speed;
  if (Object.hasOwn(body.intent, "bonus")) intent.bonus = candidate.bonus;
  if (Object.hasOwn(body.intent, "challenge")) intent.challenge = candidate.challenge;
  if (Object.entries(intent).every(([key, value]) => current[key as keyof ArcadeDesign] === value))
    throw new WonderlabError("Your game already has those settings. Ask for a different change or play your game.");
  return {
    childId: body.childId,
    requestId: body.requestId,
    intent,
    current,
    allowanceSource: ARCADE_ALLOWANCE_SOURCE,
  };
}

function readResult(value: unknown): DesignResult {
  if (
    !record(value) ||
    !keys(value, ["design", "explanation"]) ||
    !safeText(value.explanation, 350)
  )
    throw new Error("Invalid arcade response");
  try {
    return {
      design: readArcadeDesign(value.design),
      explanation: value.explanation.trim(),
    };
  } catch {
    throw new Error("Invalid arcade response");
  }
}

function available() {
  return launchStatus().ai && !!process.env.OPENAI_API_KEY;
}
async function context() {
  const result = await requireMission(ARCADE_ALLOWANCE_SOURCE);
  if (
    !result.child.ai_enabled ||
    !["creators", "studio"].includes(result.child.band)
  )
    throw new WonderlabError(
      "This profile can use prepared practice. Live AI needs a parent-enabled profile for ages 11 to 16.",
      403,
    );
  return result;
}

export async function arcadeContext() {
  const base = {
    allowanceSource: ARCADE_ALLOWANCE_SOURCE,
    allowanceLabel: ARCADE_ALLOWANCE_LABEL,
  };
  if (!available())
    return {
      ...base,
      mode: "practice" as const,
      child: null,
      remaining: null,
      reason: "Live AI design is not available in this preview. You can build and play using prepared practice.",
    };
  try {
    const { child, order } = await context();
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const resets =
      order.state === "granted" &&
      (!order.generation_period_start ||
        Date.parse(order.generation_period_start) < monthStart.getTime());
    const remaining = Math.max(0, 30 - (resets ? 0 : order.generations_used));
    return {
      ...base,
      mode: remaining ? ("live-ai" as const) : ("practice" as const),
      child: { id: child.id, nickname: child.nickname, band: child.band },
      remaining,
      reason: remaining
        ? "Choose a change and AI will name your design and explain how it will play."
        : "You have used this game's AI responses. You can keep building with prepared practice.",
    };
  } catch (error) {
    if (!(error instanceof WonderlabError) || ![401, 403].includes(error.status))
      throw error;
    return {
      ...base,
      mode: "practice" as const,
      child: null,
      remaining: null,
      reason: "You can use prepared practice now. Ask your grown-up to open an eligible profile in the family area for live AI.",
    };
  }
}

const responseSchema = {
  type: "object",
  properties: {
    design: {
      type: "object",
      properties: {
        title: { type: "string", maxLength: 60 },
        collectible: { type: "string", enum: ["star", "crystal", "firefly"] },
        target: { type: "integer", enum: [3, 4, 5, 6, 7, 8] },
        palette: { type: "string", enum: ["twilight", "forest", "sunset"] },
        speed: { type: "string", enum: ["calm", "swift"] },
        bonus: { type: "boolean" },
        challenge: { type: "string", enum: ["collect", "key"] },
      },
      required: ["title", "collectible", "target", "palette", "speed", "bonus", "challenge"],
      additionalProperties: false,
    },
    explanation: { type: "string", maxLength: 350 },
  },
  required: ["design", "explanation"],
  additionalProperties: false,
};

async function openai(path: "chat/completions" | "moderations", body: unknown) {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(path === "moderations" ? 10000 : 25000),
  });
  if (!response.ok) throw new Error("Design provider unavailable");
  return response.json();
}
async function moderate(input: string) {
  const result = await openai("moderations", {
    model: "omni-moderation-latest",
    input,
  });
  if (
    !Array.isArray(result.results) ||
    result.results.length !== 1 ||
    result.results[0]?.flagged !== false
  )
    throw new WonderlabError(
      "AI could not make that design. Try describing the colours, objects or goal of your pretend game. Your AI allowance has not been used.",
      422,
    );
}

export async function generateArcadeDesign(body: Record<string, unknown>) {
  if (!available())
    throw new WonderlabError(
      "Live AI design is not available in this preview. You can keep building with prepared practice.",
      503,
    );
  const input = readArcadeRequest(body);
  const { child, order } = await context();
  if (child.id !== input.childId)
    throw new WonderlabError("Open this child profile from your family area first.", 403);
  // The title and the learner's original typed words are deliberately excluded.
  // The browser converts supported requests to this enumerated design intent.
  const settings = {
    collectible: input.current.collectible,
    target: input.current.target,
    palette: input.current.palette,
    speed: input.current.speed,
    bonus: input.current.bonus,
    challenge: input.current.challenge,
  };
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ format: FORMAT, intent: input.intent, current: settings }))
    .digest("hex");
  let reservation: string | undefined;
  try {
    const { data: saved, error } = await db.rpc("wonderlab_reserve_generation", {
      p_id: input.requestId,
      p_order: order.id,
      p_child: child.id,
    });
    if (error || !saved)
      throw new WonderlabError(
        error?.message.includes("Allowance")
          ? "You have used this game's AI responses. You can keep building with prepared practice."
          : "AI design could not start. Try again shortly or use prepared practice.",
        409,
      );
    if (saved.state === "succeeded") {
      let cached: unknown;
      try { cached = JSON.parse(saved.response); } catch { /* Another creation format. */ }
      if (!record(cached) || cached.format !== FORMAT || cached.fingerprint !== fingerprint)
        throw new WonderlabError("This request belongs to a different design. Start a new design request.", 409);
      return { ...readResult(cached.result), source: "live-ai" as const };
    }
    if (saved.state === "failed")
      throw new WonderlabError(
        "This attempt did not finish. Try again to make a new request, or keep creating with prepared practice.",
        422,
      );
    if (!saved.reserved)
      throw new WonderlabError("This design request has already started. Please try again shortly.", 409);
    reservation = input.requestId;
    await moderate(JSON.stringify({ currentDesign: settings, requestedChange: input.intent }));
    const result = await openai("chat/completions", {
      model: process.env.WONDERLAB_AI_MODEL,
      store: false,
      max_completion_tokens: 1200,
      response_format: {
        type: "json_schema",
        json_schema: { name: "wonderlab_arcade_design", strict: true, schema: responseSchema },
      },
      messages: [
        {
          role: "system",
          content: `Help a learner aged ${child.band === "creators" ? "11 to 13" : "14 to 16"} design a gentle fictional collection game. Return only the requested JSON. The game engine supports exactly: a fictional title, collecting stars/crystals/fireflies, a target of 3 to 8, twilight/forest/sunset colours, calm/swift movement, an optional bonus collectible and a challenge of collect or key. With collect, collecting every required object opens the portal. With key, the player must find a key as well as every required object to open the portal. Apply every requested setting exactly. Preserve settings the learner did not ask to change. Invent a short magical game title for this design. Explain the changes in one or two complete British English sentences, helping the learner connect the instructions to what they can play. Do not produce code, markup, links, names of real people, personal information, violent or sexual content. Do not claim to have played the result or award learning progress.`,
        },
        {
          role: "user",
          content: JSON.stringify({ currentDesign: settings, requestedChange: input.intent }),
        },
      ],
    });
    const { output, inputTokens, outputTokens } = readGeneration(result);
    const designResult = readResult(JSON.parse(output));
    const expected = { ...settings, ...input.intent };
    if (Object.entries(expected).some(([key, value]) => designResult.design[key as keyof ArcadeDesign] !== value))
      throw new Error("Design did not apply the requested settings");
    await moderate(`${designResult.design.title}\n${designResult.explanation}`);
    const inputRate = readRate(process.env.WONDERLAB_AI_INPUT_USD_PER_MILLION);
    const outputRate = readRate(process.env.WONDERLAB_AI_OUTPUT_USD_PER_MILLION);
    if (inputRate === null || outputRate === null)
      throw new Error("Missing design cost configuration");
    const cost = Math.round(inputTokens * inputRate + outputTokens * outputRate);
    if (!Number.isSafeInteger(cost)) throw new Error("Invalid design cost");
    const { data: finished, error: finishError } = await db.rpc("wonderlab_finish_generation", {
      p_id: reservation,
      p_response: JSON.stringify({ format: FORMAT, fingerprint, result: designResult }),
      p_input_tokens: inputTokens,
      p_output_tokens: outputTokens,
      p_cost_microusd: cost,
    });
    if (finishError || !finished) throw new Error("Design could not be saved");
    reservation = undefined;
    return { ...designResult, source: "live-ai" as const };
  } finally {
    if (reservation) {
      // The database also expires stale reservations. A failed cleanup must not
      // expose provider or child details through an error response.
      try {
        await db.rpc("wonderlab_finish_generation", { p_id: reservation, p_response: null });
      } catch { /* Expiry releases the pending reservation. */ }
    }
  }
}
