import type { UserRole } from "@/lib/role-helpers";

/**
 * Client-safe companion metadata: what the picker renders and what the role
 * gate checks. The prompts and tool executors live in lib/companions.ts,
 * which is server-only (it imports the admin client) - keep them apart so a
 * client component can import this file without dragging secrets into the
 * bundle.
 */

export type CompanionId = "learning" | "ld" | "insights";

export const STAFF_ROLES: readonly UserRole[] = ["admin", "manager", "super_admin"];

export interface CompanionMeta {
  id: CompanionId;
  label: string;
  description: string;
  allowedRoles: readonly UserRole[];
  defaultModel: string;
}

/** The umbrella product name for the agent system. */
export const AI_BRAND = "Experrt AI";

export const COMPANION_META: Record<CompanionId, CompanionMeta> = {
  learning: {
    id: "learning",
    label: "Learning agent",
    description:
      "Knows your courses, your progress and your certificates - and what to learn next. It acts, not just answers.",
    allowedRoles: ["user", "manager", "admin", "super_admin"],
    // Tool calling is the whole point of this agent, and gpt-4o-mini drops
    // or malforms calls often enough to make it look broken. /api/chat
    // clamps this down to what the caller's plan allows.
    defaultModel: "gpt-4o",
  },
  ld: {
    id: "ld",
    label: "L&D agent",
    description:
      "Cohort progress, team readiness and training coverage across the organisation.",
    allowedRoles: STAFF_ROLES,
    defaultModel: "gpt-4o",
  },
  insights: {
    id: "insights",
    label: "Insights agent",
    description:
      "Your people's training records and organisation-wide usage, within privacy limits.",
    allowedRoles: STAFF_ROLES,
    defaultModel: "gpt-4o",
  },
};

/** Learners get the companion's default model and no selector (brief §7.3). */
export function canSelectModel(role: UserRole): boolean {
  return role !== "user";
}

export function companionsForRole(role: UserRole): CompanionMeta[] {
  return Object.values(COMPANION_META).filter((c) => c.allowedRoles.includes(role));
}

export function isCompanionAllowed(id: string | undefined, role: UserRole): boolean {
  const meta = COMPANION_META[(id ?? "learning") as CompanionId];
  return !!meta && meta.allowedRoles.includes(role);
}

/**
 * Human labels for the agent's tools, so the transcript can say what the
 * agent is doing instead of pausing silently. Client-safe by necessity -
 * lib/companions.ts imports the admin client and cannot cross into a client
 * component. lib/__tests__/companion-tools.test.ts pins the two together so
 * a renamed or added tool cannot silently lose its label.
 *
 * `running` is shown while the call is in flight, `done` once it returns.
 */
export interface ToolLabel {
  running: string;
  done: string;
}

export const TOOL_LABELS: Record<string, ToolLabel> = {
  getMyProgress: { running: "Checking your training record", done: "Checked your training record" },
  getMyCertificates: { running: "Looking up your certificates", done: "Looked up your certificates" },
  getRecommendedCourses: { running: "Matching courses to your assessment", done: "Matched courses to your assessment" },
  getCourseInfo: { running: "Reading the course outline", done: "Read the course outline" },
  getCohortProgress: { running: "Gathering cohort progress", done: "Gathered cohort progress" },
  getAssessmentAggregate: { running: "Aggregating assessment scores", done: "Aggregated assessment scores" },
  getTeamOverview: { running: "Reviewing team coverage", done: "Reviewed team coverage" },
  getMemberTrainingRecord: { running: "Looking up that training record", done: "Looked up that training record" },
  getUsageSummary: { running: "Summarising AI usage", done: "Summarised AI usage" },
  searchWeb: { running: "Searching the web", done: "Searched the web" },
};

/** Falls back to a readable form of the raw name rather than showing nothing. */
export function toolLabel(name: string, done: boolean): string {
  const known = TOOL_LABELS[name];
  if (known) return done ? known.done : known.running;
  const spaced = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return done ? `Finished ${spaced}` : `Running ${spaced}`;
}
