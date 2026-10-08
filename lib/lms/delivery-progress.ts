export type LiveProgress = {
  cohortId: string;
  title: string;
  status: string;
  enrolmentStatus: string | null;
  sessions: number;
  recorded: number;
  attended: number;
  excused: number;
  attendancePercent: number;
  attendanceRequired: number;
  gradePercent: number | null;
  gradeRequired: number;
  certificate: "issued" | "revoked" | "none";
  upcoming: number;
};
export function liveNextStep(live: LiveProgress): {state: string; message: string} {
  if (live.status === "cancelled") return {state:"cancelled",message:"Live group cancelled. Ask your trainer about replacement training."};
  if (!live.enrolmentStatus) return {state:"not_enrolled",message:"Your place in the live group still needs to be confirmed."};
  if (live.enrolmentStatus === "withdrawn") return {state:"withdrawn",message:"You have been withdrawn from this live group."};
  if (live.enrolmentStatus === "invited") return {state:"invited",message:"Your live-group invitation needs to be confirmed."};
  if (live.certificate === "revoked") return {state:"review_needed",message:"The certificate was revoked. Contact your trainer for the next step."};
  if (live.certificate === "issued") return {state:"certified",message:"Your live-training certificate has been issued."};
  if (!live.sessions) return {state:"awaiting_schedule",message:"Your trainer needs to add the session schedule."};
  if (live.upcoming) return {state:"scheduled",message:`${live.upcoming} live session${live.upcoming === 1 ? " remains" : "s remain"} in your schedule.`};
  if (live.recorded < live.sessions) return {state:"awaiting_register",message:"Your trainer needs to finish the attendance register."};
  if (live.attendancePercent < live.attendanceRequired) return {state:"attendance_gap",message:`Attendance is ${live.attendancePercent}%; ${live.attendanceRequired}% is required. Ask about a catch-up session.`};
  if (live.gradePercent === null) return {state:"awaiting_grade",message:"Your live-training work has not been graded yet."};
  if (live.gradePercent < live.gradeRequired) return {state:"grade_gap",message:`Your grade is ${live.gradePercent}%; ${live.gradeRequired}% is required. Review feedback with your trainer.`};
  return {state:"ready_for_review",message:"Recorded attendance and grade thresholds are met. Your trainer can review certificate eligibility."};
}
