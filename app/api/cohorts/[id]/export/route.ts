import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { computeAttendancePct, computeGradePct } from "@/lib/certification";
import type { AttendanceStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** RFC 4180 quoting, so a name with a comma does not shift every column. */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvRow(cells: unknown[]): string {
  return cells.map(csvCell).join(",");
}

/**
 * Attendance and grades for one cohort as CSV.
 *
 * One row per participant per session for attendance, then a per-participant
 * summary with the overall figures the certificate rule uses. This is the
 * artefact a finance or funding team attaches to a claim, so the thresholds
 * that applied are included rather than left implicit.
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
    .select(
      "id, title, timezone, pass_attendance_pct, pass_grade_pct, courses:course_id(title)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: sessions }, { data: enrolments }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, position, title, starts_at")
      .eq("cohort_id", id)
      .order("position", { ascending: true }),
    supabase
      .from("enrolments")
      .select("id, status, user_profiles(name, email), departments(name)")
      .eq("cohort_id", id),
  ]);

  const enrolmentIds = (enrolments ?? []).map((e) => e.id);

  const [{ data: attendance }, { data: grades }] = await Promise.all([
    enrolmentIds.length
      ? supabase
          .from("attendance")
          .select("enrolment_id, session_id, status, minutes_attended, recorded_at")
          .in("enrolment_id", enrolmentIds)
      : Promise.resolve({ data: [] as never[] }),
    enrolmentIds.length
      ? supabase
          .from("grades")
          .select("enrolment_id, score, max_score, feedback, graded_at")
          .in("enrolment_id", enrolmentIds)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const course = cohort.courses as unknown as { title: string } | null;
  const totalSessions = (sessions ?? []).length;

  const lines: string[] = [];

  lines.push(csvRow(["Cohort", cohort.title]));
  lines.push(csvRow(["Course", course?.title ?? ""]));
  lines.push(csvRow(["Timezone", cohort.timezone]));
  lines.push(csvRow(["Attendance threshold (%)", cohort.pass_attendance_pct]));
  lines.push(csvRow(["Grade threshold (%)", cohort.pass_grade_pct]));
  lines.push(csvRow(["Exported at", new Date().toISOString()]));
  lines.push("");

  lines.push(csvRow(["ATTENDANCE"]));
  lines.push(
    csvRow([
      "Participant",
      "Email",
      "Department",
      "Session",
      "Session title",
      "Session start (UTC)",
      "Status",
      "Minutes",
      "Recorded at (UTC)",
    ])
  );

  for (const enrolment of enrolments ?? []) {
    const profile = enrolment.user_profiles as unknown as {
      name: string;
      email: string;
    } | null;
    const department = enrolment.departments as unknown as { name: string } | null;
    const rows = (attendance ?? []).filter((a) => a.enrolment_id === enrolment.id);
    const bySession = new Map(rows.map((a) => [a.session_id, a]));

    for (const session of sessions ?? []) {
      const record = bySession.get(session.id);
      lines.push(
        csvRow([
          profile?.name ?? "",
          profile?.email ?? "",
          department?.name ?? "",
          session.position,
          session.title,
          session.starts_at,
          // No record is an absence, and the export says so rather than
          // leaving a blank that could be read either way.
          record?.status ?? "not recorded",
          record?.minutes_attended ?? 0,
          record?.recorded_at ?? "",
        ])
      );
    }
  }

  lines.push("");
  lines.push(csvRow(["GRADES"]));
  lines.push(
    csvRow(["Participant", "Email", "Score", "Out of", "Percentage", "Feedback", "Graded at (UTC)"])
  );

  for (const enrolment of enrolments ?? []) {
    const profile = enrolment.user_profiles as unknown as {
      name: string;
      email: string;
    } | null;
    for (const grade of (grades ?? []).filter((g) => g.enrolment_id === enrolment.id)) {
      const score = Number(grade.score);
      const max = Number(grade.max_score);
      lines.push(
        csvRow([
          profile?.name ?? "",
          profile?.email ?? "",
          score,
          max,
          max > 0 ? Math.round((score / max) * 10000) / 100 : "",
          grade.feedback,
          grade.graded_at,
        ])
      );
    }
  }

  lines.push("");
  lines.push(csvRow(["SUMMARY"]));
  lines.push(
    csvRow([
      "Participant",
      "Email",
      "Enrolment status",
      "Sessions attended",
      "Sessions in cohort",
      "Attendance (%)",
      "Grade (%)",
      "Meets attendance threshold",
      "Meets grade threshold",
    ])
  );

  for (const enrolment of enrolments ?? []) {
    const profile = enrolment.user_profiles as unknown as {
      name: string;
      email: string;
    } | null;
    const rows = (attendance ?? []).filter((a) => a.enrolment_id === enrolment.id);
    const attended = rows.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;

    const attendancePct = computeAttendancePct(
      totalSessions,
      rows.map((a) => ({ status: a.status as AttendanceStatus }))
    );
    const gradePct = computeGradePct(
      (grades ?? [])
        .filter((g) => g.enrolment_id === enrolment.id)
        .map((g) => ({ score: Number(g.score), max_score: Number(g.max_score) }))
    );

    lines.push(
      csvRow([
        profile?.name ?? "",
        profile?.email ?? "",
        enrolment.status,
        attended,
        totalSessions,
        attendancePct,
        gradePct ?? "not graded",
        attendancePct >= Number(cohort.pass_attendance_pct) ? "yes" : "no",
        gradePct !== null && gradePct >= Number(cohort.pass_grade_pct) ? "yes" : "no",
      ])
    );
  }

  const filename = `cohort-${cohort.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-records.csv`;

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
