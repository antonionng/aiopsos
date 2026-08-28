import { PLAN_MODELS, type PlanType } from "./constants.ts";

/**
 * Plan gating for model choice.
 *
 * Kept apart from lib/model-router.ts, which imports the OpenAI SDK: this is
 * pure decision logic and is worth testing directly.
 */

export function canUseModel(plan: PlanType, modelId: string): boolean {
  return (PLAN_MODELS[plan] as readonly string[]).includes(modelId);
}

/**
 * Which model a chat request should actually use.
 *
 * A companion's defaultModel is an editorial choice, not an entitlement. It
 * used to be assigned straight through with no plan check - canUseModel was
 * only consulted when the user picked a model explicitly - so raising a
 * default would have silently handed cheaper plans a model they had not paid
 * for.
 *
 * An explicit pick outside the plan is refused rather than clamped: silently
 * downgrading would bill for a model the user did not choose.
 */
export type ModelResolution =
  | { ok: true; modelId: string }
  | { ok: false; reason: "not_in_plan" };

export function resolveModelForRequest(opts: {
  plan: PlanType;
  companionDefault: string;
  requestedModel?: unknown;
  allowModelSelect: boolean;
}): ModelResolution {
  const { plan, companionDefault, requestedModel, allowModelSelect } = opts;

  if (allowModelSelect && typeof requestedModel === "string" && requestedModel) {
    if (!canUseModel(plan, requestedModel)) return { ok: false, reason: "not_in_plan" };
    return { ok: true, modelId: requestedModel };
  }

  return {
    ok: true,
    modelId: canUseModel(plan, companionDefault) ? companionDefault : PLAN_MODELS[plan][0],
  };
}
