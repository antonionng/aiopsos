import type { Activity, Answer, Mission } from "./types.ts";
export function checkActivity(activity: Activity, answer: Answer): boolean {
  if (
    !Array.isArray(answer) ||
    answer.length !== activity.correct.length ||
    answer.some((v) => typeof v !== "string")
  )
    return false;
  if (activity.kind === "sort" || activity.kind === "order")
    return answer.every((v, i) => v === activity.correct[i]);
  return (
    new Set(answer).size === answer.length &&
    answer.every((v) => activity.correct.includes(v))
  );
}
export function evaluateProgress(
  mission: Mission,
  answers: Record<string, Answer>,
  creation: string,
  checks: boolean[],
) {
  const passed = mission.activities
    .filter((a) => checkActivity(a, answers[a.id] ?? []))
    .map((a) => a.id);
  return {
    passed,
    completed:
      passed.length === mission.activities.length &&
      creation.trim().length >= 10 &&
      checks.length === mission.project.checks.length &&
      checks.every((v) => v === true),
  };
}
export function isEntitled(
  order: { state: string; expires_at: string | null } | null,
  now = Date.now(),
) {
  return (
    !!order &&
    order.state === "paid" &&
    !!order.expires_at &&
    Date.parse(order.expires_at) > now
  );
}
export function normaliseAnswers(
  mission: Mission,
  input: unknown,
): Record<string, Answer> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Answers must be an object.");
  const result: Record<string, Answer> = {};
  for (const [key, value] of Object.entries(input)) {
    const activity = mission.activities.find((a) => a.id === key);
    if (
      !activity ||
      !Array.isArray(value) ||
      value.length > activity.options.length ||
      value.some((v) => typeof v !== "string" || v.length > 400)
    )
      throw new Error("An answer is invalid.");
    result[key] = value;
  }
  return result;
}
