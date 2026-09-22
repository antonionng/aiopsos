export type SelfServeNudgeKind = "start" | "continue" | "sign";

const HOUR_MS = 60 * 60 * 1000;

export const NUDGE_START_AFTER_MS = 24 * HOUR_MS;
export const NUDGE_CONTINUE_AFTER_MS = 72 * HOUR_MS;
export const NUDGE_SIGN_AFTER_MS = 24 * HOUR_MS;

export type NudgeClock = {
  now: number;
  paidAt: string;
  lessonIds: string[];
  passedIds: string[];
  signed: boolean;
  progressUpdatedAt: string | null;
  sent: { start: boolean; continue: boolean; sign: boolean };
};

/**
 * The furthest unfinished point wins, and each point is sent once.
 * A signed record gets nothing. A buyer who finishes inside a day never
 * receives the "you have not started" note.
 */
export function chooseSelfServeNudge(input: NudgeClock): SelfServeNudgeKind | null {
  if (input.signed || input.lessonIds.length === 0) return null;

  const passed = new Set(input.passedIds);
  const passedCount = input.lessonIds.filter((id) => passed.has(id)).length;
  const allPassed = passedCount === input.lessonIds.length;
  const quietSince = Date.parse(input.progressUpdatedAt ?? input.paidAt);
  const paidAt = Date.parse(input.paidAt);
  if (Number.isNaN(paidAt)) return null;

  if (allPassed && !input.sent.sign && input.now - quietSince >= NUDGE_SIGN_AFTER_MS) {
    return "sign";
  }
  if (
    passedCount > 0 &&
    !allPassed &&
    !input.sent.continue &&
    !Number.isNaN(quietSince) &&
    input.now - quietSince >= NUDGE_CONTINUE_AFTER_MS
  ) {
    return "continue";
  }
  if (passedCount === 0 && !input.sent.start && input.now - paidAt >= NUDGE_START_AFTER_MS) {
    return "start";
  }
  return null;
}
