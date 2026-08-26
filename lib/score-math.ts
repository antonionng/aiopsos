/**
 * Pure scoring math, importable by node:test with type stripping alone -
 * keep this module free of runtime imports.
 */

export interface ScorableQuestion {
  id: string;
  dimension: string;
}

/**
 * Generic scorer: the axes come from the question set itself, so any
 * template - maturity or otherwise - scores without the caller's dimension
 * names being known here. Question order decides key order.
 */
export function calculateScoresByDimension(
  answers: Record<string, number>,
  questions: readonly ScorableQuestion[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const q of questions) {
    if (!(q.dimension in scores)) scores[q.dimension] = 0;
  }
  for (const dim of Object.keys(scores)) {
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    const sum = dimQuestions.reduce((a, q) => a + (answers[q.id] ?? 0), 0);
    scores[dim] = dimQuestions.length > 0 ? Number((sum / dimQuestions.length).toFixed(2)) : 0;
  }
  return scores;
}

export function calculateOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}
