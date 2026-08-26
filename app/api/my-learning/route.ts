import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import { evaluateCertificateEligibility } from "@/lib/certification";
import { fetchPublishedCourses } from "@/lib/courses";
import { rankCourses } from "@/lib/recommendation-engine";
import { rankCoursesByNeed } from "@/lib/training-needs";
import { RESPONDENT_ROLES, type RespondentRole } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

/**
 * "What's next": courses ranked from the learner's latest assessment,
 * excluding anything they are already enrolled on. Prefers the direct
 * training-needs measurement when one exists; falls back to maturity gaps.
 */
async function recommendNext(userId: string, enrolledSlugs: Set<string>) {
  const [{ data: tna }, { data: maturity }] = await Promise.all([
    supabaseAdmin
      .from("assessment_responses")
      .select("dimension_scores, respondent_role")
      .eq("user_id", userId)
      .eq("template_id", "training-needs")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from("assessment_responses")
      .select("confidence_score, practice_score, tools_score, responsible_score, culture_score, respondent_role")
      .eq("user_id", userId)
      .or("template_id.is.null,template_id.neq.training-needs")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const catalogue = (await fetchPublishedCourses()).filter(
    (c) => !enrolledSlugs.has(c.slug)
  );
  if (catalogue.length === 0) return [];

  const roleOf = (raw: unknown): RespondentRole | null =>
    (RESPONDENT_ROLES as readonly string[]).includes(raw as string)
      ? (raw as RespondentRole)
      : null;

  if (tna?.dimension_scores) {
    return rankCoursesByNeed(
      tna.dimension_scores as Record<string, number>,
      roleOf(tna.respondent_role),
      catalogue
    )
      .filter((s) => s.band.id !== "low")
      .flatMap((s) =>
        s.courses.slice(0, 2).map((c) => ({
          slug: c.slug,
          title: c.title,
          summary: c.summary,
          category: c.category,
          level: c.level,
          duration_hours: c.duration_hours,
          reason: `${s.band.label} need in this subject`,
        }))
      )
      .slice(0, 3);
  }

  if (maturity) {
    const scores: DimensionScores = {
      confidence: Number(maturity.confidence_score),
      practice: Number(maturity.practice_score),
      tools: Number(maturity.tools_score),
      responsible: Number(maturity.responsible_score),
      culture: Number(maturity.culture_score),
    };
    return rankCourses(
      scores,
      roleOf(maturity.respondent_role) ?? "individual_contributor",
      catalogue
    ).map((m) => ({
      slug: m.course.slug,
      title: m.course.title,
      summary: m.course.summary,
      category: m.course.category,
      level: m.course.level,
      duration_hours: m.course.duration_hours,
      reason: "Matched to your assessment gaps",
    }));
  }

  return [];
}

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
    const recommended = await recommendNext(actor.userId, new Set());
    return NextResponse.json(
      { enrolments: [], recommended },
      { headers: { "Cache-Control": "no-store" } }
    );
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

  const enrolledSlugs = new Set(
    (cohorts ?? [])
      .map((c) => (c.courses as unknown as { slug: string } | null)?.slug)
      .filter((slug): slug is string => !!slug)
  );
  const recommended = await recommendNext(actor.userId, enrolledSlugs);

  return NextResponse.json(
    { enrolments: payload, recommended },
    { headers: { "Cache-Control": "no-store" } }
  );
}
