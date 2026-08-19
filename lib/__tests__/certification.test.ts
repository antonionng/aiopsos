import { test } from "node:test";
import assert from "node:assert/strict";

import {
  computeAttendancePct,
  computeGradePct,
  evaluateCertificateEligibility,
} from "../certification.ts";
import type { AttendanceStatus } from "../constants.ts";

function att(...statuses: AttendanceStatus[]) {
  return statuses.map((status) => ({ status }));
}

// ── Attendance ───────────────────────────────────────────────

test("attendance counts present and late as attended", () => {
  assert.equal(computeAttendancePct(4, att("present", "late", "present", "present")), 100);
});

test("absence reduces attendance", () => {
  assert.equal(computeAttendancePct(4, att("present", "present", "absent", "present")), 75);
});

test("an unrecorded session counts as an absence, not as attended", () => {
  // Four sessions, only two registers taken. Silence is not evidence.
  assert.equal(computeAttendancePct(4, att("present", "present")), 50);
});

test("excused sessions leave the denominator rather than counting against", () => {
  // Four sessions, one excused: three expected, three attended.
  assert.equal(computeAttendancePct(4, att("present", "present", "present", "excused")), 100);
});

test("being excused from everything does not earn full attendance", () => {
  assert.equal(computeAttendancePct(2, att("excused", "excused")), 0);
});

test("a cohort with no sessions yields zero attendance", () => {
  assert.equal(computeAttendancePct(0, []), 0);
});

test("duplicate attendance rows cannot push someone above 100%", () => {
  assert.equal(computeAttendancePct(2, att("present", "present", "present")), 100);
});

test("attendance is rounded to two places", () => {
  assert.equal(computeAttendancePct(3, att("present", "present", "absent")), 66.67);
});

// ── Grades ───────────────────────────────────────────────────

test("grades are weighted by the marks available, not averaged flat", () => {
  // 90/100 and 0/10 is 81.82%, not the 45% a flat average would give.
  assert.equal(
    computeGradePct([
      { score: 90, max_score: 100 },
      { score: 0, max_score: 10 },
    ]),
    81.82
  );
});

test("ungraded means null, which is not the same as zero", () => {
  assert.equal(computeGradePct([]), null);
  assert.equal(computeGradePct([{ score: 0, max_score: 100 }]), 0);
});

test("grades with no marks available are ignored", () => {
  assert.equal(
    computeGradePct([
      { score: 0, max_score: 0 },
      { score: 40, max_score: 50 },
    ]),
    80
  );
});

// ── Eligibility ──────────────────────────────────────────────

const THRESHOLDS = { passAttendancePct: 80, passGradePct: 70 };

test("meeting both thresholds earns a certificate", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 4,
    attendance: att("present", "present", "present", "late"),
    grades: [{ score: 80, max_score: 100 }],
    ...THRESHOLDS,
  });
  assert.equal(result.eligible, true);
  assert.deepEqual(result.reasons, []);
  assert.equal(result.attendance_pct, 100);
  assert.equal(result.grade_pct, 80);
});

test("a passing grade does not compensate for short attendance", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 4,
    attendance: att("present", "present", "absent", "absent"),
    grades: [{ score: 95, max_score: 100 }],
    ...THRESHOLDS,
  });
  assert.equal(result.eligible, false);
  assert.equal(result.reasons.length, 1);
  assert.match(result.reasons[0], /Attendance is 50%/);
});

test("full attendance does not compensate for a failing grade", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 2,
    attendance: att("present", "present"),
    grades: [{ score: 40, max_score: 100 }],
    ...THRESHOLDS,
  });
  assert.equal(result.eligible, false);
  assert.match(result.reasons[0], /Grade is 40%/);
});

test("ungraded work blocks a certificate and says so", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 2,
    attendance: att("present", "present"),
    grades: [],
    ...THRESHOLDS,
  });
  assert.equal(result.eligible, false);
  assert.equal(result.grade_pct, null);
  assert.match(result.reasons[0], /No graded work/);
});

test("failing both thresholds reports both reasons", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 4,
    attendance: att("absent", "absent", "absent", "absent"),
    grades: [{ score: 10, max_score: 100 }],
    ...THRESHOLDS,
  });
  assert.equal(result.eligible, false);
  assert.equal(result.reasons.length, 2);
});

test("a cohort may set its own thresholds", () => {
  const lenient = evaluateCertificateEligibility({
    totalSessions: 4,
    attendance: att("present", "present", "absent", "absent"),
    grades: [{ score: 55, max_score: 100 }],
    passAttendancePct: 50,
    passGradePct: 50,
  });
  assert.equal(lenient.eligible, true);
});

test("thresholds are inclusive - exactly meeting one passes it", () => {
  const result = evaluateCertificateEligibility({
    totalSessions: 5,
    attendance: att("present", "present", "present", "present", "absent"),
    grades: [{ score: 70, max_score: 100 }],
    ...THRESHOLDS,
  });
  assert.equal(result.attendance_pct, 80);
  assert.equal(result.grade_pct, 70);
  assert.equal(result.eligible, true);
});
