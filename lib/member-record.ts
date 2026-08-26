import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Assemble one member's training record (identity, latest assessments,
 * enrolment timeline with attendance / trainer grades / certificates).
 * Shared by the profile API and the PDF export; both are staff-gated and
 * audit-logged by their routes. Deliberately excludes any per-person AI
 * usage - that exists only in aggregate.
 */
export async function assembleMemberRecord(orgId: string, memberId: string) {
  const { data: member } = await supabaseAdmin
    .from("user_profiles")
    .select("id, name, email, job_title, role, department_id, created_at, departments(name)")
    .eq("id", memberId)
    .eq("org_id", orgId)
    .maybeSingle();
  if (!member) return null;

  const [{ data: maturity }, { data: tna }, { data: enrolments }] = await Promise.all([
    supabaseAdmin
      .from("assessment_responses")
      .select("confidence_score, practice_score, tools_score, responsible_score, culture_score, submitted_at")
      .eq("user_id", memberId)
      .or("template_id.is.null,template_id.neq.training-needs")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from("assessment_responses")
      .select("dimension_scores, submitted_at")
      .eq("user_id", memberId)
      .eq("template_id", "training-needs")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from("enrolments")
      .select(
        "id, status, enrolled_at, completed_at, cohorts(id, title, status, starts_on, ends_on, delivery_mode, facilitators(display_name), courses(title, slug, category, level))"
      )
      .eq("user_id", memberId)
      .eq("org_id", orgId)
      .order("enrolled_at", { ascending: false }),
  ]);

  const enrIds = (enrolments ?? []).map((e) => e.id);
  const [{ data: att }, { data: grades }, { data: certs }, { data: sessions }] = enrIds.length
    ? await Promise.all([
        supabaseAdmin.from("attendance").select("enrolment_id, session_id, status, minutes_attended").in("enrolment_id", enrIds),
        supabaseAdmin.from("grades").select("enrolment_id, score, max_score, feedback, graded_at, graded_by, user_profiles:graded_by(name)").in("enrolment_id", enrIds),
        supabaseAdmin.from("certificates").select("enrolment_id, public_ref, issued_at, revoked_at").in("enrolment_id", enrIds),
        supabaseAdmin
          .from("sessions")
          .select("id, cohort_id, position, title, starts_at")
          .in("cohort_id", (enrolments ?? []).map((e) => (e.cohorts as unknown as { id: string })?.id).filter(Boolean)),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const allAtt = att ?? [];
  const attendedCount = allAtt.filter((a) => a.status === "present" || a.status === "late").length;

  const timeline = (enrolments ?? []).map((e) => {
    const cohort = e.cohorts as unknown as {
      id: string; title: string; status: string; starts_on: string | null; ends_on: string | null;
      delivery_mode: string; facilitators: { display_name: string } | null;
      courses: { title: string; slug: string; category: string; level: string } | null;
    } | null;
    const cohortSessions = (sessions ?? [])
      .filter((sess) => sess.cohort_id === cohort?.id)
      .sort((a, b) => a.position - b.position);
    return {
      enrolment_id: e.id,
      status: e.status,
      enrolled_at: e.enrolled_at,
      completed_at: e.completed_at,
      cohort: cohort && {
        title: cohort.title,
        status: cohort.status,
        starts_on: cohort.starts_on,
        ends_on: cohort.ends_on,
        delivery_mode: cohort.delivery_mode,
        facilitator: cohort.facilitators?.display_name ?? null,
        course: cohort.courses,
      },
      sessions: cohortSessions.map((sess) => ({
        position: sess.position,
        title: sess.title,
        starts_at: sess.starts_at,
        attendance:
          allAtt.find((a) => a.enrolment_id === e.id && a.session_id === sess.id)?.status ?? null,
      })),
      grades: (grades ?? [])
        .filter((g) => g.enrolment_id === e.id)
        .map((g) => ({
          score: Number(g.score),
          max_score: Number(g.max_score),
          feedback: g.feedback,
          graded_at: g.graded_at,
          graded_by: (g.user_profiles as unknown as { name: string } | null)?.name ?? null,
        })),
      certificate:
        (certs ?? [])
          .filter((c) => c.enrolment_id === e.id)
          .map((c) => ({ public_ref: c.public_ref, issued_at: c.issued_at, revoked: !!c.revoked_at }))[0] ?? null,
    };
  });

  return {
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      job_title: member.job_title,
      role: member.role,
      department: (member.departments as unknown as { name: string } | null)?.name ?? null,
      joined_at: member.created_at,
    },
    stats: {
      enrolments: (enrolments ?? []).length,
      completed: (enrolments ?? []).filter((e) => e.status === "completed").length,
      attendance_pct: allAtt.length ? Math.round((attendedCount / allAtt.length) * 100) : null,
      certificates: (certs ?? []).filter((c) => !c.revoked_at).length,
    },
    maturity: maturity
      ? {
          scores: {
            confidence: Number(maturity.confidence_score),
            practice: Number(maturity.practice_score),
            tools: Number(maturity.tools_score),
            responsible: Number(maturity.responsible_score),
            culture: Number(maturity.culture_score),
          },
          submitted_at: maturity.submitted_at,
        }
      : null,
    training_needs: tna
      ? { needs: tna.dimension_scores as Record<string, number>, submitted_at: tna.submitted_at }
      : null,
    timeline,
  };
}

export type MemberRecord = NonNullable<Awaited<ReturnType<typeof assembleMemberRecord>>>;
