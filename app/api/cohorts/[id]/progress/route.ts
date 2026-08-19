import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { evaluateCertificateEligibility } from "@/lib/certification";
import type { AttendanceStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Where every participant on a cohort stands: attendance, grades, and whether
 * they have met both certificate thresholds. This is the grading screen's
 * data, and it uses exactly the same rule the issue endpoint enforces, so the
 * button never promises something the server will refuse.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, title, pass_attendance_pct, pass_grade_pct, course_id")
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: sessions }, { data: enrolments }, { data: modules }] =
    await Promise.all([
      supabase.from("sessions").select("id").eq("cohort_id", id),
      supabase
        .from("enrolments")
        .select("id, user_id, status, user_profiles(name, email)")
        .eq("cohort_id", id)
        .neq("status", "withdrawn"),
      supabase
        .from("course_modules")
        .select("id, position, title")
        .eq("course_id", cohort.course_id)
        .order("position", { ascending: true }),
    ]);

  const enrolmentIds = (enrolments ?? []).map((e) => e.id);
  const totalSessions = (sessions ?? []).length;

  const [{ data: attendance }, { data: grades }, { data: certificates }] =
    enrolmentIds.length
      ? await Promise.all([
          supabase
            .from("attendance")
            .select("enrolment_id, status")
            .in("enrolment_id", enrolmentIds),
          supabase
            .from("grades")
            .select("id, enrolment_id, module_id, score, max_score, feedback, graded_at")
            .in("enrolment_id", enrolmentIds),
          supabase
            .from("certificates")
            .select("id, enrolment_id, public_ref, issued_at, revoked_at")
            .in("enrolment_id", enrolmentIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

  const participants = (enrolments ?? [])
    .map((enrolment) => {
      const profile = enrolment.user_profiles as unknown as {
        name: string;
        email: string;
      } | null;

      const myAttendance = (attendance ?? [])
        .filter((a) => a.enrolment_id === enrolment.id)
        .map((a) => ({ status: a.status as AttendanceStatus }));

      const myGrades = (grades ?? [])
        .filter((g) => g.enrolment_id === enrolment.id)
        .map((g) => ({
          id: g.id,
          module_id: g.module_id,
          score: Number(g.score),
          max_score: Number(g.max_score),
          feedback: g.feedback,
          graded_at: g.graded_at,
        }));

      return {
        enrolment_id: enrolment.id,
        name: profile?.name ?? "Unknown",
        email: profile?.email ?? "",
        status: enrolment.status,
        grades: myGrades,
        eligibility: evaluateCertificateEligibility({
          totalSessions,
          attendance: myAttendance,
          grades: myGrades,
          passAttendancePct: Number(cohort.pass_attendance_pct),
          passGradePct: Number(cohort.pass_grade_pct),
        }),
        certificate:
          (certificates ?? []).find((c) => c.enrolment_id === enrolment.id) ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(
    {
      cohort: {
        id: cohort.id,
        title: cohort.title,
        pass_attendance_pct: Number(cohort.pass_attendance_pct),
        pass_grade_pct: Number(cohort.pass_grade_pct),
      },
      total_sessions: totalSessions,
      modules: modules ?? [],
      participants,
      can_issue:
        actor.role === "super_admin" ||
        actor.role === "admin" ||
        actor.role === "manager",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
