/**
 * Observed practice after training, measured against self-reported scores
 * from before it.
 *
 * This is the section of the evidence pack that is hard to fake: the
 * assessment is what people said about themselves, and `usage_logs` is what
 * they actually did afterwards. Putting the two side by side, per department,
 * is the point.
 *
 * Three deliberate constraints:
 *
 *  1. **No tokens and no cost.** Those are internal commercial figures and
 *     have no place in a document handed to a customer or a regulator.
 *  2. **Small departments are suppressed, not estimated.** Below five active
 *     users a "proportion" describes identifiable individuals, so the row is
 *     withheld and says so.
 *  3. **Activity on this platform only.** It is not a measure of the
 *     organisation's whole AI estate, and the pack says so in its methodology
 *     section. Overclaiming here would be the easiest way to make the
 *     document worthless.
 *
 * The computation is pure and takes rows as arguments; `fetchPracticeDelta`
 * is the database-bound wrapper. Same split as recommendCourses, for the same
 * reason: a function that queries cannot be unit tested.
 */

import type { Dimension } from "./constants";

/**
 * Below this many active users in the period, a department row is suppressed
 * rather than published. Five is the existing threshold used elsewhere for
 * recommendations and analytics.
 */
export const MIN_ACTIVE_USERS_FOR_REPORTING = 5;

export interface AssessmentRowForDelta {
  department_id: string | null;
  confidence_score: number;
  practice_score: number;
  tools_score: number;
  responsible_score: number;
  culture_score: number;
}

export interface UsageRowForDelta {
  department_id: string | null;
  user_id: string | null;
  endpoint: string;
  /** ISO timestamp. Only the calendar date is used, to group into sessions. */
  created_at: string;
}

export interface DepartmentHeadcount {
  department_id: string | null;
  name: string;
  headcount: number;
}

export interface DepartmentDelta {
  department_id: string | null;
  department: string;
  headcount: number;
  /** Self-reported, from before training. Null when nobody was assessed. */
  pre_training_scores: Record<Dimension, number> | null;
  pre_training_respondents: number;
  /** Observed after training, from platform activity in the period. */
  active_users: number;
  /** Active users as a percentage of departmental headcount. */
  active_user_pct: number | null;
  /** Distinct user-days per active user: a working-session proxy. */
  sessions_per_active_user: number;
  /** How many different capabilities the department reached for. */
  distinct_endpoints: number;
  /** True when the row is withheld because the group is too small. */
  suppressed: boolean;
  suppression_reason: string | null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function average(values: number[]): number {
  return values.length === 0
    ? 0
    : round2(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Group key that keeps "no department" as its own bucket rather than dropping it. */
function key(departmentId: string | null): string {
  return departmentId ?? "__none__";
}

/**
 * Compare pre-training assessment scores against post-training observed
 * usage, per department.
 *
 * A department appears in the result if it has either assessment responses or
 * usage in the period. Departments with fewer than
 * MIN_ACTIVE_USERS_FOR_REPORTING active users come back with their observed
 * figures zeroed and `suppressed` set, so the caller can render the row as
 * withheld rather than silently omitting a department that exists.
 */
export function computePracticeDelta(input: {
  departments: DepartmentHeadcount[];
  /** Assessment responses from before the training period. */
  preTrainingResponses: AssessmentRowForDelta[];
  /** Platform usage from within the reporting period. */
  periodUsage: UsageRowForDelta[];
}): DepartmentDelta[] {
  const { departments, preTrainingResponses, periodUsage } = input;

  const byKey = new Map<string, DepartmentHeadcount>();
  for (const department of departments) {
    byKey.set(key(department.department_id), department);
  }

  // Any department that appears only in responses or usage still gets a row.
  for (const row of [...preTrainingResponses, ...periodUsage]) {
    const k = key(row.department_id);
    if (!byKey.has(k)) {
      byKey.set(k, {
        department_id: row.department_id,
        name: row.department_id ? "Unknown department" : "No department",
        headcount: 0,
      });
    }
  }

  const results: DepartmentDelta[] = [];

  for (const [k, department] of byKey) {
    const responses = preTrainingResponses.filter((r) => key(r.department_id) === k);
    const usage = periodUsage.filter((u) => key(u.department_id) === k);

    const preTrainingScores =
      responses.length > 0
        ? ({
            confidence: average(responses.map((r) => r.confidence_score)),
            practice: average(responses.map((r) => r.practice_score)),
            tools: average(responses.map((r) => r.tools_score)),
            responsible: average(responses.map((r) => r.responsible_score)),
            culture: average(responses.map((r) => r.culture_score)),
          } as Record<Dimension, number>)
        : null;

    const activeUserIds = new Set(
      usage.map((u) => u.user_id).filter((id): id is string => !!id)
    );
    const activeUsers = activeUserIds.size;

    // A "session" is a distinct user-day. The platform does not track
    // sessions directly, and counting raw requests would reward chattiness
    // rather than adoption.
    const userDays = new Set(
      usage
        .filter((u) => u.user_id)
        .map((u) => `${u.user_id}:${u.created_at.slice(0, 10)}`)
    );

    const distinctEndpoints = new Set(
      usage.map((u) => u.endpoint).filter(Boolean)
    ).size;

    const suppressed = activeUsers > 0 && activeUsers < MIN_ACTIVE_USERS_FOR_REPORTING;

    results.push({
      department_id: department.department_id,
      department: department.name,
      headcount: department.headcount,
      pre_training_scores: preTrainingScores,
      pre_training_respondents: responses.length,
      active_users: suppressed ? 0 : activeUsers,
      active_user_pct:
        suppressed || department.headcount === 0
          ? null
          : round2((activeUsers / department.headcount) * 100),
      sessions_per_active_user:
        suppressed || activeUsers === 0 ? 0 : round2(userDays.size / activeUsers),
      distinct_endpoints: suppressed ? 0 : distinctEndpoints,
      suppressed,
      suppression_reason: suppressed
        ? `Fewer than ${MIN_ACTIVE_USERS_FOR_REPORTING} active users in this period. Withheld so the figures cannot identify individuals.`
        : null,
    });
  }

  return results.sort(
    (a, b) => b.headcount - a.headcount || a.department.localeCompare(b.department)
  );
}
