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

export const COMPANION_META: Record<CompanionId, CompanionMeta> = {
  learning: {
    id: "learning",
    label: "Learning companion",
    description:
      "Your courses, your progress, your certificates, and what to learn next.",
    allowedRoles: ["user", "manager", "admin", "super_admin"],
    defaultModel: "gpt-4o-mini",
  },
  ld: {
    id: "ld",
    label: "L&D companion",
    description:
      "Cohort progress, team readiness and training coverage across the organisation.",
    allowedRoles: STAFF_ROLES,
    defaultModel: "gpt-4o",
  },
  insights: {
    id: "insights",
    label: "Insights companion",
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
