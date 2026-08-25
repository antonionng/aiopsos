import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PlanType } from "@/lib/constants";
import { budgetWindows, evaluateBudget, type BudgetVerdict } from "@/lib/budget-math";

export { COST_CEILINGS, budgetWindows, evaluateBudget } from "@/lib/budget-math";
export type { BudgetVerdict, BudgetWindows } from "@/lib/budget-math";

/**
 * Per-user request-time spend ceiling - the non-negotiable control from
 * brief §7.3 that has to exist before learner-facing agents ship. The chat
 * route refuses to start a request for a user who is over either window.
 *
 * Concurrency can overrun a ceiling by at most (in-flight requests × the
 * cost of one maximal request), because the check happens before the model
 * call and the log after it. That bound is accepted rather than engineered
 * away - a per-user lock on every chat request would cost more than the
 * overrun does.
 *
 * Sums span the user's own rows only and the caller is already
 * authenticated, so the admin client is safe here.
 */
export async function checkBudget(userId: string, plan: PlanType): Promise<BudgetVerdict> {
  const windows = budgetWindows(new Date());

  const { data, error } = await supabaseAdmin
    .from("usage_logs")
    .select("cost, created_at")
    .eq("user_id", userId)
    .gte("created_at", windows.monthStart.toISOString());

  if (error) {
    // Fail open: a broken budget query must not take chat down. The ceiling
    // is a spend control, not a security boundary.
    console.error("checkBudget query failed:", error.message);
    return { allowed: true };
  }

  let dailySpent = 0;
  let monthlySpent = 0;
  const dayStartMs = windows.dayStart.getTime();
  for (const row of data ?? []) {
    const cost = Number(row.cost) || 0;
    monthlySpent += cost;
    if (new Date(row.created_at).getTime() >= dayStartMs) dailySpent += cost;
  }

  return evaluateBudget({ plan, dailySpent, monthlySpent, windows });
}
