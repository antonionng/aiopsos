export type SelfServeNudgeKind = "start" | "continue" | "sign" | "next";

const HOUR_MS = 60 * 60 * 1000;

export const NUDGE_START_AFTER_MS = 24 * HOUR_MS;
export const NUDGE_CONTINUE_AFTER_MS = 72 * HOUR_MS;
export const NUDGE_SIGN_AFTER_MS = 24 * HOUR_MS;
export const NUDGE_NEXT_AFTER_MS = 72 * HOUR_MS;

export type NudgeClock = {
  now: number;
  paidAt: string;
  lessonIds: string[];
  passedIds: string[];
  signed: boolean;
  signedAt?: string | null;
  progressUpdatedAt: string | null;
  /** The learner has asked not to receive course suggestions. */
  optedOut?: boolean;
  sent: { start: boolean; continue: boolean; sign: boolean; next?: boolean };
};

/**
 * The furthest unfinished point wins, and each point is sent once.
 * A buyer who finishes inside a day never receives the "you have not started"
 * note. Once the record is signed, the only note left is a single suggestion
 * of the next course, three days later, unless the learner has opted out.
 */
export function chooseSelfServeNudge(input: NudgeClock): SelfServeNudgeKind | null {
  if (input.lessonIds.length === 0) return null;

  if (input.signed) {
    const signedAt = input.signedAt ? Date.parse(input.signedAt) : Number.NaN;
    if (
      !input.optedOut &&
      !input.sent.next &&
      !Number.isNaN(signedAt) &&
      input.now - signedAt >= NUDGE_NEXT_AFTER_MS
    ) {
      return "next";
    }
    return null;
  }

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
