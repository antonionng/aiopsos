import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import type { LanguageModel } from "ai";
import type { DepartmentType } from "./constants";

type Provider = "openai" | "anthropic" | "google" | "mistral";

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
  "claude-opus-4-6": { id: "claude-opus-4-6", provider: "anthropic", label: "Claude Opus 4.6", costPer1kInput: 0.005, costPer1kOutput: 0.025 },
  "claude-sonnet-4-20250514": { id: "claude-sonnet-4-20250514", provider: "anthropic", label: "Claude Sonnet 4", costPer1kInput: 0.003, costPer1kOutput: 0.015 },
  "claude-haiku-4-5": { id: "claude-haiku-4-5", provider: "anthropic", label: "Claude Haiku 4.5", costPer1kInput: 0.001, costPer1kOutput: 0.005 },
  "gemini-2.0-flash": { id: "gemini-2.0-flash", provider: "google", label: "Gemini 2.0 Flash", costPer1kInput: 0.0001, costPer1kOutput: 0.0004 },
  "gemini-1.5-pro": { id: "gemini-1.5-pro", provider: "google", label: "Gemini 1.5 Pro", costPer1kInput: 0.00125, costPer1kOutput: 0.005 },
  "mistral-large-latest": { id: "mistral-large-latest", provider: "mistral", label: "Mistral Large", costPer1kInput: 0.002, costPer1kOutput: 0.006 },
  "mistral-small-latest": { id: "mistral-small-latest", provider: "mistral", label: "Mistral Small", costPer1kInput: 0.0002, costPer1kOutput: 0.0006 },
};

const DEPARTMENT_DEFAULTS: Record<DepartmentType, string> = {
  engineering: "claude-sonnet-4-20250514",
  sales: "gpt-4o",
  operations: "mistral-large-latest",
  leadership: "claude-sonnet-4-20250514",
  marketing: "gpt-4o",
  legal: "claude-sonnet-4-20250514",
  hr: "gpt-4o",
  finance: "gpt-4o",
  product: "claude-sonnet-4-20250514",
  support: "gpt-4o-mini",
};

export function getDefaultModelForDepartment(dept: DepartmentType): string {
  return DEPARTMENT_DEFAULTS[dept] ?? "gpt-4o";
}

export function getLanguageModel(modelId: string): LanguageModel {
  const config = MODEL_REGISTRY[modelId];
  if (!config) {
    return openai("gpt-4o");
  }

  switch (config.provider) {
    case "openai":
      return openai(modelId);
    case "anthropic":
      return anthropic(modelId);
    case "google":
      return google(modelId);
    case "mistral":
      return mistral(modelId);
    default:
      return openai("gpt-4o");
  }
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

export function canUseModel(plan: PlanType, modelId: string): boolean {
  return (PLAN_MODELS[plan] as readonly string[]).includes(modelId);
}

export function calculateCustomerCharge(rawCost: number): number {
  return rawCost * USAGE_MARKUP;
}
