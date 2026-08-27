import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  DIMENSION_LABELS,
  DIMENSIONS,
  LITERACY_DISCLAIMER,
  RESPONDENT_ROLE_LABELS,
  getTierForScore,
  type Dimension,
  type RespondentRole,
} from "@/lib/constants";
import { calculateOverallScore } from "@/lib/scoring";
import { rankCourses } from "@/lib/recommendation-engine";
import { computeAttendancePct, computeGradePct } from "@/lib/certification";
import {
  computePracticeDelta,
  type DepartmentDelta,
} from "@/lib/practice-delta";
import type { AttendanceStatus } from "@/lib/constants";
import type { Course, DimensionScores } from "@/lib/types";

/**
 * Assembles the evidence pack payload.
 *
 * Reads go through the service-role client. The caller is checked for admin
 * rights before this runs; the reason for bypassing RLS is that a pack has to
 * see the whole organisation - including colleagues' profiles, which the
 * `user_profiles` policies from migration 001 do not expose even to an org
 * admin. The existing aggregated-results endpoint does the same.
 *
 * The result is stored verbatim in `evidence_packs.payload` and never
 * recomputed. Regenerating a pack for a past period must produce the same
 * document, so nothing downstream may re-read live tables.
 */

export interface EvidencePackPayload {
  version: 1;
  organisation: { id: string; name: string; industry: string; location: string };
  period: { start: string; end: string };
  generated_at: string;
  scope: {
    declared_systems: string[];
    declaration: string;
    assessment_respondents: number;
  };
  needs_analysis: {
    by_department: {
      department: string;
      headcount: number;
      respondents: number;
      scores: DimensionScores;
      overall: number;
      tier: { tier: number; label: string };
      dimension_tiers: { dimension: Dimension; label: string; score: number; tier: string }[];
      dominant_role: string;
      assigned_courses: { title: string; level: string; because: string }[];
    }[];
    by_role: { role: string; label: string; respondents: number; overall: number }[];
  };
  measures: {
    cohorts: {
      title: string;
      course: string;
      level: string;
      delivery_mode: string;
      facilitator: string | null;
      facilitator_credentials: { title: string; issuer?: string; year?: number }[];
      starts_on: string | null;
      ends_on: string | null;
      sessions: number;
      enrolled: number;
      module_outcomes: string[];
    }[];
    total_participants: number;
    total_facilitated_hours: number;
  };
  records: {
    attendance_summary: { mean_attendance_pct: number; sessions_recorded: number };
    submissions: number;
    grade_distribution: { band: string; count: number }[];
    certificates_issued: number;
    appendix: {
      participant: string;
      cohort: string;
      attendance_pct: number;
      grade_pct: number | null;
      status: string;
      certificate_ref: string | null;
    }[];
  };
  observed_practice: {
    departments: DepartmentDelta[];
    note: string;
  };
  governance: {
    policies: { title: string; status: string; published_at: string | null }[];
    approval_requests_in_period: number;
  };
  methodology: string[];
}

/**
 * Observed practice by department for a period, against pre-training scores.
 * The signature the brief specifies; the computation itself is pure and lives
 * in lib/practice-delta.ts.
 */
export async function fetchPracticeDelta(
  orgId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<DepartmentDelta[]> {
  const startIso = periodStart.toISOString();
  const endIso = periodEnd.toISOString();

  const [{ data: departments }, { data: members }, { data: responses }, { data: usage }] =
    await Promise.all([
      supabaseAdmin.from("departments").select("id, name").eq("org_id", orgId),
      supabaseAdmin.from("user_profiles").select("id, department_id").eq("org_id", orgId),
      // "Pre-training" means submitted before the reporting period opened.
      supabaseAdmin
        .from("assessment_responses")
        .select(
          "department_id, confidence_score, practice_score, tools_score, responsible_score, culture_score, assessments!inner(org_id)"
        )
        .eq("assessments.org_id", orgId)
        .or("template_id.is.null,template_id.neq.training-needs")
        .lt("submitted_at", startIso),
      supabaseAdmin
        .from("usage_logs")
        .select("department_id, user_id, endpoint, created_at")
        .eq("org_id", orgId)
        .gte("created_at", startIso)
        .lte("created_at", endIso),
    ]);

  const headcounts = new Map<string | null, number>();
  for (const member of members ?? []) {
    const key = member.department_id ?? null;
    headcounts.set(key, (headcounts.get(key) ?? 0) + 1);
  }

  return computePracticeDelta({
    departments: [
      ...(departments ?? []).map((d) => ({
        department_id: d.id as string,
        name: d.name as string,
        headcount: headcounts.get(d.id) ?? 0,
      })),
      ...(headcounts.has(null)
        ? [{ department_id: null, name: "No department", headcount: headcounts.get(null)! }]
        : []),
    ],
    preTrainingResponses: (responses ?? []).map((r) => ({
      department_id: r.department_id,
      confidence_score: Number(r.confidence_score),
      practice_score: Number(r.practice_score),
      tools_score: Number(r.tools_score),
      responsible_score: Number(r.responsible_score),
      culture_score: Number(r.culture_score),
    })),
    periodUsage: (usage ?? []).map((u) => ({
      department_id: u.department_id,
      user_id: u.user_id,
      endpoint: String(u.endpoint ?? ""),
      created_at: String(u.created_at),
    })),
  });
}

function gradeBand(pct: number | null): string {
  if (pct === null) return "Not graded";
  if (pct >= 90) return "90-100%";
  if (pct >= 80) return "80-89%";
  if (pct >= 70) return "70-79%";
  if (pct >= 60) return "60-69%";
  return "Below 60%";
}

export async function buildEvidencePack(
  orgId: string,
  periodStart: Date,
  periodEnd: Date,
  declaration: string
): Promise<EvidencePackPayload> {
  const startIso = periodStart.toISOString();
  const endIso = periodEnd.toISOString();

  const { data: org } = await supabaseAdmin
    .from("organisations")
    .select("id, name, industry, location")
    .eq("id", orgId)
    .single();

  // ── 1 & 2: scope and needs analysis ──
  const { data: responses } = await supabaseAdmin
    .from("assessment_responses")
    .select(
      "department_id, respondent_role, tools_used, confidence_score, practice_score, tools_score, responsible_score, culture_score, departments(name), assessments!inner(org_id)"
    )
    .eq("assessments.org_id", orgId)
    .or("template_id.is.null,template_id.neq.training-needs");

  const allResponses = responses ?? [];

  const declaredSystems = [
    ...new Set(
      allResponses.flatMap((r) =>
        Array.isArray(r.tools_used) ? (r.tools_used as string[]) : []
      )
    ),
  ]
    .filter((t) => t && t !== "None")
    .sort();

  const { data: members } = await supabaseAdmin
    .from("user_profiles")
    .select("id, department_id")
    .eq("org_id", orgId);

  const headcounts = new Map<string | null, number>();
  for (const member of members ?? []) {
    headcounts.set(
      member.department_id ?? null,
      (headcounts.get(member.department_id ?? null) ?? 0) + 1
    );
  }

  const { data: courseRows } = await supabaseAdmin
    .from("courses")
    .select(
      "id, slug, title, summary, level, duration_hours, delivery_modes, learning_outcomes, target_roles, target_dimensions, status, created_by, created_at, updated_at"
    )
    .eq("status", "published");

  const catalogue = (courseRows ?? []) as unknown as Course[];

  const deptGroups = new Map<string, typeof allResponses>();
  for (const r of allResponses) {
    const name =
      (r.departments as unknown as { name: string } | null)?.name ?? "No department";
    if (!deptGroups.has(name)) deptGroups.set(name, []);
    deptGroups.get(name)!.push(r);
  }

  const avg = (values: number[]) =>
    values.length === 0
      ? 0
      : Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));

  const byDepartment = Array.from(deptGroups.entries()).map(([name, rows]) => {
    const scores: DimensionScores = {
      confidence: avg(rows.map((r) => Number(r.confidence_score))),
      practice: avg(rows.map((r) => Number(r.practice_score))),
      tools: avg(rows.map((r) => Number(r.tools_score))),
      responsible: avg(rows.map((r) => Number(r.responsible_score))),
      culture: avg(rows.map((r) => Number(r.culture_score))),
    };
    const overall = calculateOverallScore(scores);

    // Modal role, matching how the cohort view assigns training.
    const roleCounts = new Map<string, number>();
    for (const r of rows) {
      const role = r.respondent_role ?? "individual_contributor";
      roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
    }
    const dominantRole =
      [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "individual_contributor";

    const matches = rankCourses(scores, dominantRole as RespondentRole, catalogue);

    const departmentId =
      rows.find((r) => r.department_id)?.department_id ?? null;

    return {
      department: name,
      headcount: headcounts.get(departmentId) ?? rows.length,
      respondents: rows.length,
      scores,
      overall,
      tier: (({ tier, label }) => ({ tier, label }))(getTierForScore(overall)),
      dimension_tiers: DIMENSIONS.map((d) => ({
        dimension: d,
        label: DIMENSION_LABELS[d],
        score: scores[d],
        tier: getTierForScore(scores[d]).label,
      })),
      dominant_role:
        RESPONDENT_ROLE_LABELS[dominantRole as RespondentRole] ?? dominantRole,
      assigned_courses: matches.map((m) => ({
        title: m.course.title,
        level: m.course.level,
        because: `Matched on ${m.matched_dimensions
          .map((d) => DIMENSION_LABELS[d])
          .join(" and ")}, the weakest dimensions for this department.`,
      })),
    };
  });

  const roleGroups = new Map<string, typeof allResponses>();
  for (const r of allResponses) {
    const role = r.respondent_role ?? "unknown";
    if (!roleGroups.has(role)) roleGroups.set(role, []);
    roleGroups.get(role)!.push(r);
  }

  const byRole = Array.from(roleGroups.entries()).map(([role, rows]) => ({
    role,
    label: RESPONDENT_ROLE_LABELS[role as RespondentRole] ?? role,
    respondents: rows.length,
    overall: calculateOverallScore({
      confidence: avg(rows.map((r) => Number(r.confidence_score))),
      practice: avg(rows.map((r) => Number(r.practice_score))),
      tools: avg(rows.map((r) => Number(r.tools_score))),
      responsible: avg(rows.map((r) => Number(r.responsible_score))),
      culture: avg(rows.map((r) => Number(r.culture_score))),
    }),
  }));

  // ── 3: measures taken ──
  //
  // A cohort reaches this pack two ways: the organisation ran it, or its
  // people sat one somebody else delivered. Selecting on cohorts.org_id
  // alone only ever found the first, which was invisible until cohorts
  // started carrying several companies at once - the October tour runs one
  // per training day - and then reported "no training" for every attending
  // company. Their own cohorts are still included even with nobody enrolled
  // yet, so a scheduled-but-unfilled cohort keeps appearing as it always did.
  const [{ data: attendedRows }, { data: ownRows }] = await Promise.all([
    supabaseAdmin.from("enrolments").select("cohort_id").eq("org_id", orgId),
    supabaseAdmin.from("cohorts").select("id").eq("org_id", orgId),
  ]);

  const cohortCandidates = [
    ...new Set([
      ...(attendedRows ?? []).map((r) => String(r.cohort_id)),
      ...(ownRows ?? []).map((r) => String(r.id)),
    ]),
  ];

  const { data: cohortRows } = cohortCandidates.length
    ? await supabaseAdmin
        .from("cohorts")
        .select(
          "id, title, delivery_mode, starts_on, ends_on, course_id, courses:course_id(title, level, duration_hours), facilitators:facilitator_id(display_name, credentials)"
        )
        .in("id", cohortCandidates)
        .lte("starts_on", periodEnd.toISOString().slice(0, 10))
        .neq("status", "cancelled")
    : { data: [] };

  const cohorts = cohortRows ?? [];
  const cohortIds = cohorts.map((c) => c.id);

  const [{ data: sessionRows }, { data: enrolmentRows }, { data: moduleRows }] =
    cohortIds.length
      ? await Promise.all([
          supabaseAdmin.from("sessions").select("id, cohort_id").in("cohort_id", cohortIds),
          // Scoped to this organisation's own people. A shared cohort holds
          // several companies' delegates, and one company's evidence pack
          // must never count or name another's.
          supabaseAdmin
            .from("enrolments")
            .select("id, cohort_id, status, user_profiles(name)")
            .in("cohort_id", cohortIds)
            .eq("org_id", orgId),
          supabaseAdmin
            .from("course_modules")
            .select("course_id, position, title, outcomes")
            .in("course_id", [...new Set(cohorts.map((c) => c.course_id))])
            .order("position", { ascending: true }),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

  const sessions = sessionRows ?? [];
  const enrolments = enrolmentRows ?? [];
  const enrolmentIds = enrolments.map((e) => e.id);

  const measures = cohorts.map((c) => {
    const course = c.courses as unknown as {
      title: string;
      level: string;
      duration_hours: number;
    } | null;
    const facilitator = c.facilitators as unknown as {
      display_name: string;
      credentials: { title: string; issuer?: string; year?: number }[];
    } | null;

    return {
      title: c.title,
      course: course?.title ?? "",
      level: course?.level ?? "",
      delivery_mode: c.delivery_mode,
      facilitator: facilitator?.display_name ?? null,
      facilitator_credentials: facilitator?.credentials ?? [],
      starts_on: c.starts_on,
      ends_on: c.ends_on,
      sessions: sessions.filter((s) => s.cohort_id === c.id).length,
      enrolled: enrolments.filter(
        (e) => e.cohort_id === c.id && e.status !== "withdrawn"
      ).length,
      module_outcomes: (moduleRows ?? [])
        .filter((m) => m.course_id === c.course_id)
        .flatMap((m) => (Array.isArray(m.outcomes) ? (m.outcomes as string[]) : [])),
    };
  });

  // ── 4: records ──
  const [{ data: attendanceRows }, { data: gradeRows }, { data: certRows }, { data: submissionRows }] =
    enrolmentIds.length
      ? await Promise.all([
          supabaseAdmin
            .from("attendance")
            .select("enrolment_id, status")
            .in("enrolment_id", enrolmentIds),
          supabaseAdmin
            .from("grades")
            .select("enrolment_id, score, max_score")
            .in("enrolment_id", enrolmentIds),
          supabaseAdmin
            .from("certificates")
            .select("enrolment_id, public_ref, revoked_at")
            .in("enrolment_id", enrolmentIds),
          supabaseAdmin
            .from("submissions")
            .select("id")
            .in("enrolment_id", enrolmentIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const sessionCountByCohort = new Map<string, number>();
  for (const s of sessions) {
    sessionCountByCohort.set(s.cohort_id, (sessionCountByCohort.get(s.cohort_id) ?? 0) + 1);
  }

  const appendix = enrolments.map((e) => {
    const profile = e.user_profiles as unknown as { name: string } | null;
    const cohort = cohorts.find((c) => c.id === e.cohort_id);
    const myAttendance = (attendanceRows ?? [])
      .filter((a) => a.enrolment_id === e.id)
      .map((a) => ({ status: a.status as AttendanceStatus }));
    const myGrades = (gradeRows ?? [])
      .filter((g) => g.enrolment_id === e.id)
      .map((g) => ({ score: Number(g.score), max_score: Number(g.max_score) }));
    const cert = (certRows ?? []).find((c) => c.enrolment_id === e.id);

    return {
      participant: profile?.name ?? "Unknown",
      cohort: cohort?.title ?? "",
      attendance_pct: computeAttendancePct(
        sessionCountByCohort.get(e.cohort_id) ?? 0,
        myAttendance
      ),
      grade_pct: computeGradePct(myGrades),
      status: e.status,
      certificate_ref: cert && !cert.revoked_at ? cert.public_ref : null,
    };
  });

  const bandCounts = new Map<string, number>();
  for (const row of appendix) {
    const band = gradeBand(row.grade_pct);
    bandCounts.set(band, (bandCounts.get(band) ?? 0) + 1);
  }

  // ── 5: observed practice ──
  const practiceDelta = await fetchPracticeDelta(orgId, periodStart, periodEnd);

  // ── 6: governance ──
  const [{ data: policies }, { count: approvalCount }] = await Promise.all([
    supabaseAdmin
      .from("ai_policies")
      .select("title, status, published_at")
      .eq("org_id", orgId)
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabaseAdmin
      .from("approval_requests")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .gte("created_at", startIso)
      .lte("created_at", endIso),
  ]);

  return {
    version: 1,
    organisation: {
      id: orgId,
      name: org?.name ?? "",
      industry: org?.industry ?? "",
      location: org?.location ?? "",
    },
    period: {
      start: periodStart.toISOString().slice(0, 10),
      end: periodEnd.toISOString().slice(0, 10),
    },
    generated_at: new Date().toISOString(),
    scope: {
      declared_systems: declaredSystems,
      declaration,
      assessment_respondents: allResponses.length,
    },
    needs_analysis: { by_department: byDepartment, by_role: byRole },
    measures: {
      cohorts: measures,
      total_participants: enrolments.filter((e) => e.status !== "withdrawn").length,
      total_facilitated_hours: cohorts.reduce((sum, c) => {
        const course = c.courses as unknown as { duration_hours: number } | null;
        return sum + Number(course?.duration_hours ?? 0);
      }, 0),
    },
    records: {
      attendance_summary: {
        mean_attendance_pct:
          appendix.length === 0
            ? 0
            : Number(
                (
                  appendix.reduce((s, r) => s + r.attendance_pct, 0) / appendix.length
                ).toFixed(2)
              ),
        sessions_recorded: (attendanceRows ?? []).length,
      },
      submissions: (submissionRows ?? []).length,
      grade_distribution: [...bandCounts.entries()].map(([band, count]) => ({
        band,
        count,
      })),
      certificates_issued: (certRows ?? []).filter((c) => !c.revoked_at).length,
      appendix,
    },
    observed_practice: {
      departments: practiceDelta,
      note: "Departments with fewer than five active users in the period are withheld rather than reported, so that no figure describes an identifiable individual.",
    },
    governance: {
      policies: (policies ?? []).map((p) => ({
        title: p.title,
        status: p.status,
        published_at: p.published_at,
      })),
      approval_requests_in_period: approvalCount ?? 0,
    },
    // Section 7. This is not optional and must not be softened: overclaiming
    // here is the single largest legal risk in the product.
    methodology: [
      "Assessment scores are self-reported. Respondents rate themselves across five dimensions on a scale of 0 to 5; dimension scores are the unweighted mean of the responses in that dimension, and the overall score is the unweighted mean of the five dimensions.",
      "Maturity tiers are bands applied to those scores. They describe reported practice, not tested competence.",
      "Attendance is recorded per session by the facilitator. A session with no record counts as an absence. Sessions a participant was excused from are removed from the denominator.",
      "Grades are weighted by the marks available on each piece of work. A participant with no graded work is reported as ungraded, not as zero.",
      "Observed practice measures activity on this platform only. It is not a measure of the organisation's whole AI estate, and staff may use AI tools outside it that this record cannot see.",
      "Departments with fewer than five active users in the period are withheld from the observed practice section to avoid publishing figures that identify individuals.",
      "This document records the measures an organisation has taken to support AI literacy among its staff, and the evidence for them. It does not certify compliance with the EU AI Act or any other regulation. The European Commission's guidance is explicit that no certificate is required and that no single generic course establishes compliance on its own.",
      LITERACY_DISCLAIMER,
    ],
  };
}
