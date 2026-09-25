import type { CourseProgress } from "./types.ts";

export const ACCESS_MONTHS = 12;

type Purchase = { id: string; course_slug: string; paid_at: string | null };

export type CourseHolding<T extends Purchase> = {
  purchase: T;
  progress: CourseProgress | undefined;
  accessEndsAt: Date | null;
  active: boolean;
};

export function accessEndsAt(paidAt: string | null | undefined): Date | null {
  if (!paidAt) return null;
  const start = new Date(paidAt);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + ACCESS_MONTHS);
  return end;
}

/** A paid row with no payment date is treated as open rather than locking a buyer out. */
export function hasActiveAccess(paidAt: string | null | undefined, now: Date = new Date()): boolean {
  const end = accessEndsAt(paidAt);
  return end === null || end.getTime() > now.getTime();
}

export type AccessReminder = "month" | "week";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Thirty days and seven days before access ends, a learner who has not signed
 * their record is reminded once each. A reminder that was missed is not sent
 * late; once the week reminder is due the month one is skipped.
 */
export function accessReminderDue(input: {
  paidAt: string | null;
  now: Date;
  signed: boolean;
  sent: { month: boolean; week: boolean };
}): AccessReminder | null {
  if (input.signed) return null;
  const end = accessEndsAt(input.paidAt);
  if (!end) return null;
  const left = end.getTime() - input.now.getTime();
  if (left <= 0) return null;
  if (left <= 7 * DAY_MS) return input.sent.week ? null : "week";
  if (left <= 30 * DAY_MS) return input.sent.month ? null : "month";
  return null;
}

export function progressScore(progress: CourseProgress | undefined): number {
  if (!progress) return 0;
  const passed = Object.values(progress.lessons ?? {}).filter((lesson) => lesson?.passed).length;
  return (progress.ref && progress.signedName ? 1000 : 0) + passed;
}

/**
 * A learner can hold several paid rows for one course (a repurchase after access ends, or a
 * test purchase). They see the course once: the open purchase wins, then the one with the
 * most progress, then the most recent.
 */
export function onePerCourse<T extends Purchase>(
  rows: T[],
  progress: Map<string, CourseProgress>,
  now: Date = new Date()
): CourseHolding<T>[] {
  const bySlug = new Map<string, CourseHolding<T>>();
  for (const purchase of rows) {
    const candidate: CourseHolding<T> = {
      purchase,
      progress: progress.get(purchase.id),
      accessEndsAt: accessEndsAt(purchase.paid_at),
      active: hasActiveAccess(purchase.paid_at, now),
    };
    const current = bySlug.get(purchase.course_slug);
    if (!current || better(candidate, current)) bySlug.set(purchase.course_slug, candidate);
  }
  return [...bySlug.values()].sort(
    (a, b) => (b.purchase.paid_at ?? "").localeCompare(a.purchase.paid_at ?? "")
  );
}

function better<T extends Purchase>(a: CourseHolding<T>, b: CourseHolding<T>): boolean {
  if (a.active !== b.active) return a.active;
  const score = progressScore(a.progress) - progressScore(b.progress);
  if (score !== 0) return score > 0;
  return (a.purchase.paid_at ?? "") > (b.purchase.paid_at ?? "");
}

/** The furthest progress across every purchase of one course, so a repurchase carries it on. */
export function furthestProgress(
  purchaseIds: string[],
  progress: Map<string, CourseProgress>
): CourseProgress | undefined {
  let best: CourseProgress | undefined;
  for (const id of purchaseIds) {
    const candidate = progress.get(id);
    if (progressScore(candidate) > progressScore(best)) best = candidate;
  }
  return best;
}
