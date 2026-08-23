/**
 * Which expected answers are absent from a submission.
 *
 * The public submit route used to accept any object as `answers`. Missing
 * questions then scored 0 — the scorer coalesces undefined to zero — and the
 * result persisted as a genuine "Tier 0", indistinguishable from someone who
 * really had no AI maturity. Refusing an incomplete submission is the only
 * honest option.
 *
 * Pure and dependency-free on purpose: no runtime imports, so the test
 * runner can load it with type stripping alone.
 */
export function findMissingAnswers(
  expectedIds: readonly string[],
  answers: Record<string, unknown>
): string[] {
  // A zero is a real answer — it is the bottom of the scale — so this checks
  // the type rather than truthiness.
  return expectedIds.filter((id) => typeof answers[id] !== "number");
}
