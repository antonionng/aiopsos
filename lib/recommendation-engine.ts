import type {
  CourseLevel,
  DepartmentType,
  Dimension,
  RespondentRole,
} from "./constants";
import type {
  Course,
  CourseMatch,
  ModelRouting,
  ControlLayer,
} from "./types";

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

// ── Course recommendation ────────────────────────────────────
// Maps assessment gaps onto the academy catalogue. Deterministic and
// model-free: the same scores and the same catalogue always produce the
// same three courses.
//
// Two notes on shape, both deliberate:
//
//  1. The catalogue is passed in rather than queried. The brief specifies a
//     pure function; a function that reads the database is not pure and not
//     unit-testable. Callers fetch published courses and hand them over.
//  2. The rank tables below mirror DIMENSIONS and COURSE_LEVELS from
//     ./constants as `Record<Union, number>`, so adding a dimension or level
//     to those tuples is a compile error here rather than a silent
//     mis-ranking. They are local so this module has no runtime imports,
//     which is what lets the test runner load it with type stripping alone.

/** Canonical dimension order. Breaks ties between equal scores. */
const DIMENSION_RANK: Record<Dimension, number> = {
  confidence: 0,
  practice: 1,
  tools: 2,
  responsible: 3,
  culture: 4,
};

/** Ascending seniority. Breaks ties between equally-matched courses. */
const LEVEL_RANK: Record<CourseLevel, number> = {
  practitioner: 0,
  manager: 1,
  leadership: 2,
};

/**
 * Weight carried by each of the respondent's weakest dimensions, weakest
 * first. Only these dimensions count towards a match, so a course aimed
 * squarely at someone's strongest area never surfaces.
 */
const WEAK_DIMENSION_WEIGHTS = [3, 2, 1] as const;

/** Maximum courses returned. */
const MAX_RECOMMENDATIONS = 3;

/**
 * The respondent's weakest dimensions, weakest first, capped at the number
 * of weights we score against.
 */
export function getWeakestDimensions(
  scoresByDimension: Record<Dimension, number>
): Dimension[] {
  return (Object.keys(DIMENSION_RANK) as Dimension[])
    .map((dimension) => {
      const raw = scoresByDimension[dimension];
      return { dimension, score: Number.isFinite(raw) ? raw : 0 };
    })
    .sort(
      (a, b) =>
        a.score - b.score || DIMENSION_RANK[a.dimension] - DIMENSION_RANK[b.dimension]
    )
    .slice(0, WEAK_DIMENSION_WEIGHTS.length)
    .map((d) => d.dimension);
}

/**
 * Rank the catalogue against one respondent's scores, with the reasoning
 * attached. Courses that address none of the weak dimensions are dropped
 * rather than ranked last - a nil match is not a recommendation.
 */
export function rankCourses(
  scoresByDimension: Record<Dimension, number>,
  respondentRole: RespondentRole,
  catalogue: Course[]
): CourseMatch[] {
  const weakest = getWeakestDimensions(scoresByDimension);

  return catalogue
    .filter((course) => course.status === "published")
    // An empty target_roles means the course suits every role. The column
    // defaults to '{}', so this keeps a half-filled catalogue row useful
    // rather than invisible.
    .filter(
      (course) =>
        course.target_roles.length === 0 ||
        course.target_roles.includes(respondentRole)
    )
    .map((course) => {
      const matched = weakest.filter((dimension) =>
        course.target_dimensions.includes(dimension)
      );
      const score = matched.reduce(
        (total, dimension) =>
          total + WEAK_DIMENSION_WEIGHTS[weakest.indexOf(dimension)],
        0
      );
      return { course, score, matched_dimensions: matched };
    })
    .filter((match) => match.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        LEVEL_RANK[a.course.level] - LEVEL_RANK[b.course.level] ||
        a.course.duration_hours - b.course.duration_hours ||
        a.course.slug.localeCompare(b.course.slug)
    )
    .slice(0, MAX_RECOMMENDATIONS);
}

/**
 * The courses this respondent should be put on, strongest match first.
 * Capped at three.
 */
export function recommendCourses(
  scoresByDimension: Record<Dimension, number>,
  respondentRole: RespondentRole,
  catalogue: Course[]
): Course[] {
  return rankCourses(scoresByDimension, respondentRole, catalogue).map(
    (match) => match.course
  );
}
