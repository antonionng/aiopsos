import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { evaluateCertificateEligibility } from "@/lib/certification";

export const dynamic = "force-dynamic";

/**
 * A participant's own view: what they are enrolled on, what is coming up,
 * where they stand against the certificate thresholds, and their certificate
 * if one has been issued.
 *
 * Row-level security limits every read here to the caller's own enrolments,
 * so a participant cannot see a colleague's attendance by changing an id.
 */
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: enrolments } = await supabase
    .from("enrolments")
    .select("id, cohort_id, status, enrolled_at, completed_at")
    .eq("user_id", actor.userId)
    .order("enrolled_at", { ascending: false });

  if (!enrolments || enrolments.length === 0) {
    return NextResponse.json({ enrolments: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  const cohortIds = enrolments.map((e) => e.cohort_id);
  const enrolmentIds = enrolments.map((e) => e.id);

  const [
    { data: cohorts },
    { data: sessions },
    { data: attendance },
    { data: grades },
    { data: certificates },
    { data: submissions },
  ] = await Promise.all([
    supabase
      .from("cohorts")
      .select(
        "id, title, delivery_mode, location, timezone, starts_on, ends_on, status, pass_attendance_pct, pass_grade_pct, courses:course_id(slug, title, level), facilitators:facilitator_id(display_name)"
      )
      .in("id", cohortIds),
    supabase
      .from("sessions")
      .select("id, cohort_id, position, title, starts_at, ends_at, join_url")
      .in("cohort_id", cohortIds)
      .order("starts_at", { ascending: true }),
    supabase
      .from("attendance")
      .select("enrolment_id, session_id, status")
      .in("enrolment_id", enrolmentIds),
    supabase
      .from("grades")
      .select("enrolment_id, module_id, score, max_score, feedback, graded_at")
      .in("enrolment_id", enrolmentIds),
    supabase
      .from("certificates")
      .select("enrolment_id, public_ref, issued_at, revoked_at")
      .in("enrolment_id", enrolmentIds),
    supabase
      .from("submissions")
      .select("id, enrolment_id, session_id, artefact_url, notes, submitted_at")
      .in("enrolment_id", enrolmentIds),
  ]);

  const cohortById = new Map((cohorts ?? []).map((c) => [c.id, c]));

  const payload = enrolments.map((enrolment) => {
    const cohort = cohortById.get(enrolment.cohort_id);
    const cohortSessions = (sessions ?? []).filter(
      (s) => s.cohort_id === enrolment.cohort_id
    );
    const myAttendance = (attendance ?? []).filter(
      (a) => a.enrolment_id === enrolment.id
    );
    const myGrades = (grades ?? [])
      .filter((g) => g.enrolment_id === enrolment.id)
      .map((g) => ({ ...g, score: Number(g.score), max_score: Number(g.max_score) }));

    const progress = evaluateCertificateEligibility({
      totalSessions: cohortSessions.length,
      attendance: myAttendance,
      grades: myGrades,
      passAttendancePct: Number(cohort?.pass_attendance_pct ?? 80),
      passGradePct: Number(cohort?.pass_grade_pct ?? 70),
    });

    const attendanceBySession = new Map(
      myAttendance.map((a) => [a.session_id, a.status])
    );

    return {
      enrolment_id: enrolment.id,
      status: enrolment.status,
      completed_at: enrolment.completed_at,
      cohort,
      sessions: cohortSessions.map((s) => ({
        ...s,
        my_attendance: attendanceBySession.get(s.id) ?? null,
      })),
      submissions: (submissions ?? []).filter((s) => s.enrolment_id === enrolment.id),
      grades: myGrades,
      progress,
      certificate:
        (certificates ?? []).find((c) => c.enrolment_id === enrolment.id) ?? null,
    };
  });

  return NextResponse.json(
    { enrolments: payload },
    { headers: { "Cache-Control": "no-store" } }
  );
}
