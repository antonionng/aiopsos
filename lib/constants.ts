export const MATURITY_TIERS = [
  { tier: 0, label: "No Structured Usage", min: 0, max: 0.99, color: "#555555" },
  { tier: 1, label: "Ad Hoc Usage", min: 1, max: 1.99, color: "#777777" },
  { tier: 2, label: "Repeatable Usage", min: 2, max: 2.99, color: "#999999" },
  { tier: 3, label: "Workflow Embedded", min: 3, max: 3.99, color: "#aaaaaa" },
  { tier: 4, label: "Automation Ready", min: 4, max: 4.49, color: "#cccccc" },
  { tier: 5, label: "Agent Orchestration Ready", min: 4.5, max: 5, color: "#ececec" },
] as const;

export const DIMENSIONS = [
  "confidence",
  "practice",
  "tools",
  "responsible",
  "culture",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  confidence: "Confidence & Skills",
  practice: "Daily Practice",
  tools: "Tools & Access",
  responsible: "Responsible Use",
  culture: "Culture & Support",
};

export const RESPONDENT_ROLES = [
  "individual_contributor",
  "team_lead",
  "manager",
  "director",
  "executive",
] as const;

export type RespondentRole = (typeof RESPONDENT_ROLES)[number];

export const RESPONDENT_ROLE_LABELS: Record<RespondentRole, string> = {
  individual_contributor: "Individual Contributor",
  team_lead: "Team Lead",
  manager: "Manager",
  director: "Director / Head of",
  executive: "Executive / C-Suite",
};

export const AI_TOOL_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Perplexity",
  "Gemini",
  "Microsoft Copilot",
  "GitHub Copilot",
  "Midjourney / DALL-E",
  "Custom / Internal tools",
  "Other",
  "None",
] as const;

export const DEPARTMENT_TYPES = [
  "engineering",
  "sales",
  "operations",
  "leadership",
  "marketing",
  "legal",
  "hr",
  "finance",
  "product",
  "support",
] as const;

export type DepartmentType = (typeof DEPARTMENT_TYPES)[number];

export const DEPARTMENT_LABELS: Record<DepartmentType, string> = {
  engineering: "Engineering",
  sales: "Sales",
  operations: "Operations",
  leadership: "Leadership",
  marketing: "Marketing",
  legal: "Legal & Compliance",
  hr: "Human Resources",
  finance: "Finance",
  product: "Product",
  support: "Support",
};

export const AI_MODELS = {
  openai: [
    { id: "gpt-5.2", label: "GPT-5.2", provider: "openai" as const },
    { id: "gpt-4o", label: "GPT-4o", provider: "openai" as const },
    { id: "gpt-4o-mini", label: "GPT-4o Mini", provider: "openai" as const },
    { id: "o3-mini", label: "o3-mini", provider: "openai" as const },
  ],
  anthropic: [
    { id: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "anthropic" as const },
    { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", provider: "anthropic" as const },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", provider: "anthropic" as const },
  ],
  google: [
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", provider: "google" as const },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "google" as const },
  ],
  mistral: [
    { id: "mistral-large-latest", label: "Mistral Large", provider: "mistral" as const },
    { id: "mistral-small-latest", label: "Mistral Small", provider: "mistral" as const },
  ],
} as const;

export const ALL_MODELS = [
  ...AI_MODELS.openai,
  ...AI_MODELS.anthropic,
  ...AI_MODELS.google,
  ...AI_MODELS.mistral,
];

export function getTierForScore(score: number) {
  return MATURITY_TIERS.find((t) => score >= t.min && score <= t.max) ?? MATURITY_TIERS[0];
}

// --- Billing & Plan Constants ---

export const PLAN_TYPES = ["basic", "pro", "enterprise"] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

const PRO_MODELS = [
  "gpt-5.2",
  "gpt-4o",
  "gpt-4o-mini",
  "o3-mini",
  "claude-opus-4-6",
  "claude-sonnet-4-20250514",
  "claude-haiku-4-5",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "mistral-large-latest",
  "mistral-small-latest",
] as const;

export const PLAN_MODELS = {
  basic: [
    "gpt-4o-mini",
    "claude-haiku-4-5",
    "gemini-2.0-flash",
    "mistral-small-latest",
  ],
  pro: PRO_MODELS,
  enterprise: PRO_MODELS,
} as const;

export const SUBSCRIPTION_PLANS = {
  basic: {
    name: "Basic",
    monthlyPricePerSeat: 39,
    currency: "GBP" as const,
    minSeats: 5,
    models: PLAN_MODELS.basic,
  },
  pro: {
    name: "Pro",
    monthlyPricePerSeat: 79,
    currency: "GBP" as const,
    minSeats: 10,
    models: PLAN_MODELS.pro,
  },
  enterprise: {
    name: "Enterprise",
    monthlyPricePerSeat: 149,
    currency: "GBP" as const,
    minSeats: 5,
    models: PLAN_MODELS.enterprise,
  },
} as const;

export const USAGE_MARKUP = 1.20;

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

export type FeatureType = "voice" | "web_search" | "image_gen" | "deep_research";

export const FEATURE_LABELS: Record<FeatureType, string> = {
  voice: "Voice Chat",
  web_search: "Web Search",
  image_gen: "Image Generation",
  deep_research: "Deep Research",
};

export const FEATURE_UNITS: Record<FeatureType, string> = {
  voice: "minutes",
  web_search: "queries",
  image_gen: "images",
  deep_research: "sessions",
};

// Monthly quota per seat (0 = feature not available on this plan)
export const FEATURE_QUOTAS: Record<PlanType, Record<FeatureType, number>> = {
  basic: { voice: 0, web_search: 0, image_gen: 0, deep_research: 0 },
  pro: { voice: 0, web_search: 100, image_gen: 0, deep_research: 0 },
  enterprise: { voice: 120, web_search: 500, image_gen: 100, deep_research: 30 },
};

// Overage price per unit in GBP
export const FEATURE_OVERAGE_RATES: Record<FeatureType, number> = {
  voice: 0.08,
  web_search: 0.06,
  image_gen: 0.10,
  deep_research: 1.50,
};

// Raw cost per unit (our cost before markup)
export const FEATURE_RAW_COSTS: Record<FeatureType, number> = {
  voice: 0.05,
  web_search: 0.03,
  image_gen: 0.06,
  deep_research: 2.00,
};

export interface PlanFeatures {
  knowledgeBase: boolean;
  personas: boolean;
  approvalWorkflows: boolean;
  advancedAnalytics: boolean;
  stackRecommendation: boolean;
  roadmapGenerator: boolean;
  pdfExport: boolean;
  teamCollaboration: boolean;
  assessmentCreation: boolean;
  voiceChat: boolean;
  webSearch: boolean;
  imageGeneration: boolean;
  deepResearch: boolean;
  aiPolicies: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  basic: {
    knowledgeBase: false,
    personas: false,
    approvalWorkflows: false,
    advancedAnalytics: false,
    stackRecommendation: false,
    roadmapGenerator: false,
    pdfExport: false,
    teamCollaboration: false,
    assessmentCreation: false,
    voiceChat: false,
    webSearch: false,
    imageGeneration: false,
    deepResearch: false,
    aiPolicies: false,
  },
  pro: {
    knowledgeBase: true,
    personas: true,
    approvalWorkflows: true,
    advancedAnalytics: true,
    stackRecommendation: true,
    roadmapGenerator: true,
    pdfExport: true,
    teamCollaboration: true,
    assessmentCreation: true,
    voiceChat: false,
    webSearch: true,
    imageGeneration: false,
    deepResearch: false,
    aiPolicies: true,
  },
  enterprise: {
    knowledgeBase: true,
    personas: true,
    approvalWorkflows: true,
    advancedAnalytics: true,
    stackRecommendation: true,
    roadmapGenerator: true,
    pdfExport: true,
    teamCollaboration: true,
    assessmentCreation: true,
    voiceChat: true,
    webSearch: true,
    imageGeneration: true,
    deepResearch: true,
    aiPolicies: true,
  },
};

export function getPlanFeatures(plan: PlanType): PlanFeatures {
  return PLAN_FEATURES[plan];
}

export const DATA_THRESHOLDS = {
  ASSESSMENT_MIN_RESPONSES: 3,
  ROADMAP_MIN_RESPONSES: 5,
  RECOMMENDATION_MIN_RESPONSES: 5,
  ANALYTICS_MIN_REQUESTS: 10,
} as const;
