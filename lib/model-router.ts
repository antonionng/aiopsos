import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type { DepartmentType } from "./constants";

/**
 * OpenAI is the only model provider.
 *
 * That is a deliberate commercial choice as much as a technical one: the
 * evidence pack has to name every sub-processor that touches customer data,
 * and one vendor is materially easier for a regulated buyer to approve than
 * four. Adding a provider means adding it here, to the plan tiers in
 * constants, and to the sub-processor list in the docs - in that order.
 */
type Provider = "openai";

interface ModelConfig {
  id: string;
  provider: Provider;
  label: string;
  costPer1kInput: number;
  costPer1kOutput: number;
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  "gpt-5.2": { id: "gpt-5.2", provider: "openai", label: "GPT-5.2", costPer1kInput: 0.005, costPer1kOutput: 0.02 },
  "gpt-4o": { id: "gpt-4o", provider: "openai", label: "GPT-4o", costPer1kInput: 0.0025, costPer1kOutput: 0.01 },
  "gpt-4o-mini": { id: "gpt-4o-mini", provider: "openai", label: "GPT-4o Mini", costPer1kInput: 0.00015, costPer1kOutput: 0.0006 },
  "o3-mini": { id: "o3-mini", provider: "openai", label: "o3-mini", costPer1kInput: 0.0011, costPer1kOutput: 0.0044 },
};

const DEPARTMENT_DEFAULTS: Record<DepartmentType, string> = {
  // Reasoning-heavy work gets the strongest model; high-volume, low-judgement
  // work gets the cheapest capable one.
  engineering: "gpt-5.2",
  sales: "gpt-4o",
  operations: "gpt-4o-mini",
  leadership: "gpt-5.2",
  marketing: "gpt-4o",
  legal: "gpt-5.2",
  hr: "gpt-4o",
  finance: "gpt-4o",
  product: "gpt-5.2",
  support: "gpt-4o-mini",
};

export function getDefaultModelForDepartment(dept: DepartmentType): string {
  return DEPARTMENT_DEFAULTS[dept] ?? "gpt-4o";
}

export function getLanguageModel(modelId: string): LanguageModel {
  // An unknown id falls back rather than throwing: a stale model saved on a
  // persona or a conversation should degrade, not break the chat.
  return openai(MODEL_REGISTRY[modelId] ? modelId : "gpt-4o");
}

export function calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return 0;
  return (inputTokens / 1000) * config.costPer1kInput + (outputTokens / 1000) * config.costPer1kOutput;
}

export function getAvailableModels() {
  return Object.values(MODEL_REGISTRY);
}

import { PLAN_MODELS, USAGE_MARKUP, type PlanType } from "./constants";

export function getModelsForPlan(plan: PlanType): ModelConfig[] {
  const ids = PLAN_MODELS[plan];
  return ids.map((id) => MODEL_REGISTRY[id]).filter(Boolean);
}

export { canUseModel, resolveModelForRequest, type ModelResolution } from "./model-plan";

export function calculateCustomerCharge(rawCost: number): number {
  return rawCost * USAGE_MARKUP;
}

