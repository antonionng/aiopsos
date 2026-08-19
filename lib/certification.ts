/**
 * The certificate pass rule.
 *
 * A certificate requires BOTH an attendance floor and a pass grade. That is
 * the combination levy and reimbursement schemes audit against: attendance
 * alone evidences presence rather than capability, and a grade alone would
 * let someone certify having attended almost nothing. Thresholds come from
 * the cohort, so a funded programme can set its own.
 *
 * Everything here is pure and takes its inputs as arguments, so it can be
 * unit tested without a database and reused unchanged by the evidence pack.
 * That is also why the module has no runtime imports.
 */

import type { AttendanceStatus } from "./constants";

/**
 * Which attendance statuses count as having attended.
 *
 * A `Record` rather than a list so that adding a status to
 * `ATTENDANCE_STATUSES` is a compile error here instead of a silent
 * miscount in someone's certificate.
 */
export const COUNTS_AS_ATTENDED: Record<AttendanceStatus, boolean> = {
  present: true,
  late: true,
  absent: false,
  excused: false,
};

/** Statuses that are removed from the denominator rather than counted against. */
const EXCUSED_FROM_DENOMINATOR: Record<AttendanceStatus, boolean> = {
  present: false,
  late: false,
  absent: false,
  excused: true,
};

export interface AttendanceLike {
  status: AttendanceStatus;
}

export interface GradeLike {
  score: number;
  max_score: number;
}

export interface CertificateEligibility {
  eligible: boolean;
  attendance_pct: number;
  /** Null when nothing has been graded yet, which is not the same as zero. */
  grade_pct: number | null;
  /** Plain-language reasons the participant fell short, empty when eligible. */
  reasons: string[];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Attendance as a percentage of the sessions this participant was expected at.
 *
 * The denominator is every session in the cohort minus the ones they were
 * excused from — not merely the sessions someone remembered to take a
 * register for. A session with no attendance record counts as an absence,
 * because in an audit silence is not evidence of attendance.
 *
 * Returns 0 when there is nothing to attend, which fails any non-zero floor.
 * That is deliberate: a certificate for a cohort with no sessions would be
 * indefensible.
 */
export function computeAttendancePct(
  totalSessions: number,
  records: AttendanceLike[]
): number {
  if (totalSessions <= 0) return 0;

  const excused = records.filter((r) => EXCUSED_FROM_DENOMINATOR[r.status]).length;
  const expected = totalSessions - excused;
  if (expected <= 0) return 0;

  const attended = records.filter((r) => COUNTS_AS_ATTENDED[r.status]).length;

  // Guard against more records than sessions, which would otherwise let a
  // duplicate row push someone over the floor.
  return round2((Math.min(attended, expected) / expected) * 100);
}

/**
 * Overall grade as a percentage, weighted by each piece of work's max score
 * so a 10-point exercise does not count as much as a 100-point one.
 *
 * Returns null when nothing has been graded. Callers must treat that as "not
 * yet assessed", never as a zero.
 */
export function computeGradePct(grades: GradeLike[]): number | null {
  const usable = grades.filter((g) => g.max_score > 0);
  if (usable.length === 0) return null;

  const scored = usable.reduce((sum, g) => sum + g.score, 0);
  const available = usable.reduce((sum, g) => sum + g.max_score, 0);
  if (available <= 0) return null;

  return round2((scored / available) * 100);
}

/**
 * Whether this enrolment has earned a certificate, and if not, why not.
 */
export function evaluateCertificateEligibility(input: {
  totalSessions: number;
  attendance: AttendanceLike[];
  grades: GradeLike[];
  passAttendancePct: number;
  passGradePct: number;
}): CertificateEligibility {
  const {
    totalSessions,
    attendance,
    grades,
    passAttendancePct,
    passGradePct,
  } = input;

  const attendancePct = computeAttendancePct(totalSessions, attendance);
  const gradePct = computeGradePct(grades);
  const reasons: string[] = [];

  if (attendancePct < passAttendancePct) {
    reasons.push(
      `Attendance is ${attendancePct}%, below the ${passAttendancePct}% required for this cohort.`
    );
  }

  if (gradePct === null) {
    reasons.push("No graded work has been recorded for this participant yet.");
  } else if (gradePct < passGradePct) {
    reasons.push(
      `Grade is ${gradePct}%, below the ${passGradePct}% required for this cohort.`
    );
  }

  return {
    eligible: reasons.length === 0,
    attendance_pct: attendancePct,
    grade_pct: gradePct,
    reasons,
  };
}
