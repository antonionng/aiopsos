import type { DepartmentType } from "./constants";
import type { ModelRouting, ControlLayer } from "./types";

interface DepartmentProfile {
  type: DepartmentType;
  departmentName?: string;
  dataSensitivity: "low" | "medium" | "high" | "critical";
  maturityScore: number;
  primaryTasks: string[];
}

const MODEL_MAP: Record<DepartmentType, { primary: string; secondary: string; useCase: string; reasoning: string }> = {
  engineering: {
    primary: "claude-sonnet-4-20250514",
    secondary: "gpt-4o",
    useCase: "Code generation, review, architecture design, debugging",
    reasoning: "Claude excels at code reasoning and long-context analysis. GPT-4o provides fast iteration for simpler tasks.",
  },
  sales: {
    primary: "gpt-4o",
    secondary: "gemini-2.0-flash",
    useCase: "Email drafting, proposal writing, meeting summaries, CRM data analysis",
    reasoning: "GPT-4o leads in natural conversational drafting. Gemini handles multimodal inputs like presentations.",
  },
  operations: {
    primary: "mistral-large-latest",
    secondary: "gpt-4o-mini",
    useCase: "Process documentation, data summarisation, workflow optimisation",
    reasoning: "Mistral offers cost-efficient summarisation. GPT-4o-mini handles high-volume routine tasks.",
  },
  leadership: {
    primary: "claude-sonnet-4-20250514",
    secondary: "gpt-4o",
    useCase: "Strategic analysis, decision frameworks, executive summaries",
    reasoning: "Claude provides careful analytical reasoning. GPT-4o offers versatile decision support.",
  },
  marketing: {
    primary: "gpt-4o",
    secondary: "gemini-2.0-flash",
    useCase: "Content creation, social media, campaign analysis, brand voice",
    reasoning: "GPT-4o excels at creative content. Gemini handles multimodal content like image+text campaigns.",
  },
  legal: {
    primary: "claude-sonnet-4-20250514",
    secondary: "gpt-4o",
    useCase: "Contract review, policy analysis, compliance checking, risk assessment",
    reasoning: "Claude's long-context window and careful reasoning are ideal for legal documents.",
  },
  hr: {
    primary: "gpt-4o",
    secondary: "mistral-large-latest",
    useCase: "Job descriptions, policy drafting, employee communications, training materials",
    reasoning: "GPT-4o handles diverse HR content needs. Mistral provides cost-efficient bulk processing.",
  },
  finance: {
    primary: "gpt-4o",
    secondary: "claude-sonnet-4-20250514",
    useCase: "Financial analysis, report generation, forecasting, data interpretation",
    reasoning: "GPT-4o's structured output is strong for financial data. Claude adds depth for complex analysis.",
  },
  product: {
    primary: "claude-sonnet-4-20250514",
    secondary: "gpt-4o",
    useCase: "PRD writing, user research synthesis, feature prioritisation, competitive analysis",
    reasoning: "Claude's reasoning depth suits product strategy. GPT-4o handles rapid iteration.",
  },
  support: {
    primary: "gpt-4o-mini",
    secondary: "gpt-4o",
    useCase: "Customer responses, knowledge base, ticket classification, escalation",
    reasoning: "GPT-4o-mini handles high-volume support efficiently. GPT-4o escalates complex issues.",
  },
};

export function generateModelRouting(departments: DepartmentProfile[]): ModelRouting[] {
  return departments.map((dept) => {
    const mapping = MODEL_MAP[dept.type];
    return {
      department_type: dept.type,
      department_name: dept.departmentName,
      primary_model: mapping.primary,
      secondary_model: mapping.secondary,
      use_case: mapping.useCase,
      reasoning: mapping.reasoning,
    };
  });
}

export function generateControlLayer(
  departments: DepartmentProfile[]
): ControlLayer {
  const maxSensitivity = departments.reduce((max, d) => {
    const order = { low: 0, medium: 1, high: 2, critical: 3 };
    return order[d.dataSensitivity] > order[max] ? d.dataSensitivity : max;
  }, "low" as "low" | "medium" | "high" | "critical");

  const loggingLevel =
    maxSensitivity === "critical" || maxSensitivity === "high"
      ? "full"
      : maxSensitivity === "medium"
        ? "summary"
        : "metadata-only";

  const guardrails: string[] = ["Prompt injection detection"];

  if (maxSensitivity === "high" || maxSensitivity === "critical") {
    guardrails.push("PII detection and redaction", "Content classification", "Output review for sensitive data");
  }
  if (maxSensitivity === "critical") {
    guardrails.push("Human-in-the-loop approval for external outputs", "Data residency compliance check");
  }

  const avgMaturity =
    departments.reduce((s, d) => s + d.maturityScore, 0) / departments.length;

  const budget = Math.round(avgMaturity < 2 ? 500 : avgMaturity < 3 ? 1500 : avgMaturity < 4 ? 3000 : 5000);

  return {
    logging_level: loggingLevel as ControlLayer["logging_level"],
    cost_budget_monthly: budget,
    guardrails,
    access_policies: departments.reduce(
      (acc, d) => {
        const mapping = MODEL_MAP[d.type];
        acc[d.type] = [mapping.primary, mapping.secondary];
        return acc;
      },
      {} as Record<string, string[]>
    ),
  };
}

export function getRecommendationSummary(routing: ModelRouting[], control: ControlLayer) {
  const uniqueModels = [...new Set(routing.flatMap((r) => [r.primary_model, r.secondary_model]))];
  return {
    totalDepartments: routing.length,
    uniqueModels: uniqueModels.length,
    modelList: uniqueModels,
    loggingLevel: control.logging_level,
    monthlyBudget: control.cost_budget_monthly,
    guardrailCount: control.guardrails.length,
  };
}
