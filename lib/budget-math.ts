import type { PlanType } from "@/lib/constants";

/**
 * The pure half of the spend ceiling: windows and the decision. Kept free of
 * runtime imports so node:test can load it directly (the async summing that
 * needs the database lives in lib/cost-ceiling.ts).
 *
 * Ceilings are in raw provider cost (USD), the unit usage_logs.cost stores.
 */
export const COST_CEILINGS: Record<PlanType, { daily: number; monthly: number }> = {
  basic: { daily: 0.5, monthly: 5 },
  pro: { daily: 3, monthly: 40 },
  enterprise: { daily: 10, monthly: 150 },
};

export interface BudgetWindows {
  dayStart: Date;
  monthStart: Date;
  /** When the tighter window rolls over, for Retry-After. */
  dayResetAt: Date;
  monthResetAt: Date;
}

/** UTC windows. Pass `now` explicitly so the maths is testable. */
export function budgetWindows(now: Date): BudgetWindows {
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const dayResetAt = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const monthResetAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { dayStart, monthStart, dayResetAt, monthResetAt };
}

export interface BudgetVerdict {
  allowed: boolean;
  /** Which ceiling was hit, when not allowed. */
  exceeded?: "daily" | "monthly";
  resetAt?: Date;
}

/** Pure decision: spent-so-far against the plan's ceilings. */
export function evaluateBudget(input: {
  plan: PlanType;
  dailySpent: number;
  monthlySpent: number;
  windows: BudgetWindows;
}): BudgetVerdict {
  const ceiling = COST_CEILINGS[input.plan] ?? COST_CEILINGS.basic;
  if (input.monthlySpent >= ceiling.monthly) {
    return { allowed: false, exceeded: "monthly", resetAt: input.windows.monthResetAt };
  }
  if (input.dailySpent >= ceiling.daily) {
    return { allowed: false, exceeded: "daily", resetAt: input.windows.dayResetAt };
  }
  return { allowed: true };
}
