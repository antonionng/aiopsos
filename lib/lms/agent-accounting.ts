import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MODEL_REGISTRY, calculateCost } from "@/lib/model-router";
import { getCreditSettings } from "@/lib/credits";
import { creditsForTokenUsage } from "@/lib/credit-math";
import { LearningError } from "./server";

export const LEARNING_AGENT_MODEL = "gpt-4o-mini";
export const LEARNING_AGENT_STEPS = 5;
export const LEARNING_AGENT_OUTPUT_TOKENS = 6500;
// Conservative context ceiling per step; unused reserved credits are returned.
const INPUT_CONTEXT_CEILING = 128000;

export async function reserveAgentCredits(actorId: string, runId: string, lease: string) {
  const settings = await getCreditSettings();
  const model = MODEL_REGISTRY[LEARNING_AGENT_MODEL];
  const amount = creditsForTokenUsage(calculateCost(LEARNING_AGENT_MODEL,
    INPUT_CONTEXT_CEILING * LEARNING_AGENT_STEPS,
    LEARNING_AGENT_OUTPUT_TOKENS * LEARNING_AGENT_STEPS), settings);
  if (![settings.markup, settings.usdToGbp, amount].every(value => Number.isFinite(value) && value > 0))
    throw new LearningError("AI credit pricing could not be verified.", 503);
  const { error } = await supabaseAdmin.rpc("lms_reserve_agent_credits", {
    p_actor: actorId, p_run: runId, p_lease: lease, p_max: amount,
    p_model: LEARNING_AGENT_MODEL, p_input_rate: model.costPer1kInput,
    p_output_rate: model.costPer1kOutput, p_markup: settings.markup, p_fx: settings.usdToGbp,
  });
  if (error) throw new LearningError(
    error.code === "P0001" ? `This task needs ${amount} available AI credits as a temporary reservation. Unused credits are returned after it finishes.` : "Could not reserve credits for this task. Please retry.",
    error.code === "P0001" ? 402 : error.code === "42501" ? 403 : error.code === "40001" ? 409 : 503,
  );
}

export async function settleAgentCredits(lease: string, usage: { input: number; output: number } | null) {
  const { error } = await supabaseAdmin.rpc("lms_settle_agent_credits", {
    p_lease: lease, p_tokens_in: usage?.input ?? null, p_tokens_out: usage?.output ?? null,
    p_release_reason: usage ? null : "Execution ended without confirmed usage. Reservation returned; reconcile any provider cost.",
  });
  if (error) throw new LearningError("Agent usage could not be reconciled. The reservation is retained for recovery; no additional charge was made.", 503);
}
