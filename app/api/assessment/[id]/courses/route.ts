import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fetchPublishedCourses } from "@/lib/courses";
import { rankCourses } from "@/lib/recommendation-engine";
import {
  RESPONDENT_ROLES,
  RESPONDENT_ROLE_LABELS,
  type RespondentRole,
} from "@/lib/constants";
import { canViewOrgData, type UserRole } from "@/lib/role-helpers";
import type { DimensionScores } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Which courses this assessment's cohort needs, grouped by department and
 * rolled up by course with headcount. This is the buying view: it turns a
 * set of scores into a training plan a budget holder can act on.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  const { data: assessment } = await supabase
    .from("assessments")
    .select("org_id")
    .eq("id", id)
    .single();

  if (!assessment || !profile?.org_id || assessment.org_id !== profile.org_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Cohort-level training need is an org planning view, not an employee one.
  if (!canViewOrgData(profile.role as UserRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: responses, error } = await supabaseAdmin
    .from("assessment_responses")
    .select(
      "id, confidence_score, practice_score, tools_score, responsible_score, culture_score, department_id, respondent_role, departments(name)"
    )
    .eq("assessment_id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const noCache = { "Cache-Control": "no-store" };

  if (!responses || responses.length === 0) {
    return NextResponse.json(
      { departments: [], courses: [], response_count: 0 },
      { headers: noCache }
    );
  }

  const catalogue = await fetchPublishedCourses();

  function avg(values: number[]) {
    return values.length > 0
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
      : 0;
  }

  const roleLabels = RESPONDENT_ROLE_LABELS as Record<string, string>;
  type ResponseRow = NonNullable<typeof responses>[number];

  // Same grouping key as /api/assessment/[id]/aggregated so the two views
  // never disagree about what a department is.
  const deptMap = new Map<string, { name: string; rows: ResponseRow[] }>();
  for (const r of responses) {
    const key = r.department_id ?? `role:${r.respondent_role ?? "general"}`;
    const name =
      (r.departments as unknown as { name: string } | null)?.name ??
      roleLabels[r.respondent_role ?? ""] ??
      "General";
    if (!deptMap.has(key)) deptMap.set(key, { name, rows: [] });
    deptMap.get(key)!.rows.push(r);
  }

  /**
   * The role a department's training should be pitched at: the most common
   * one among its respondents. Deliberately modal rather than most senior -
   * one director in a team of twenty should not put the team on a
   * leadership course. Ties go to the more junior role.
   */
  function dominantRole(rows: ResponseRow[]): RespondentRole {
    const counts = new Map<RespondentRole, number>();
    for (const r of rows) {
      const role = r.respondent_role as RespondentRole | null;
      if (role && RESPONDENT_ROLES.includes(role)) {
        counts.set(role, (counts.get(role) ?? 0) + 1);
      }
    }
    let best: RespondentRole = "individual_contributor";
    let bestCount = 0;
    for (const role of RESPONDENT_ROLES) {
      const count = counts.get(role) ?? 0;
      if (count > bestCount) {
        best = role;
        bestCount = count;
      }
    }
    return best;
  }

  const departments = Array.from(deptMap.values())
    .map(({ name, rows }) => {
      const scores: DimensionScores = {
        confidence: avg(rows.map((r) => Number(r.confidence_score))),
        practice: avg(rows.map((r) => Number(r.practice_score))),
        tools: avg(rows.map((r) => Number(r.tools_score))),
        responsible: avg(rows.map((r) => Number(r.responsible_score))),
        culture: avg(rows.map((r) => Number(r.culture_score))),
      };
      const role = dominantRole(rows);
      const matches = rankCourses(scores, role, catalogue);

      return {
        department: name,
        headcount: rows.length,
        scores,
        dominant_role: role,
        dominant_role_label: RESPONDENT_ROLE_LABELS[role],
        courses: matches.map(({ course, score, matched_dimensions }) => ({
          slug: course.slug,
          title: course.title,
          level: course.level,
          duration_hours: course.duration_hours,
          match_score: score,
          matched_dimensions,
        })),
      };
    })
    .sort((a, b) => b.headcount - a.headcount || a.department.localeCompare(b.department));

  // Roll the department rows up per course: how many people need each one,
  // and which departments they sit in. This is what a purchase order needs.
  const courseRollup = new Map<
    string,
    {
      slug: string;
      title: string;
      level: string;
      duration_hours: number;
      headcount: number;
      departments: string[];
    }
  >();

  for (const dept of departments) {
    for (const course of dept.courses) {
      const existing = courseRollup.get(course.slug);
      if (existing) {
        existing.headcount += dept.headcount;
        existing.departments.push(dept.department);
      } else {
        courseRollup.set(course.slug, {
          slug: course.slug,
          title: course.title,
          level: course.level,
          duration_hours: course.duration_hours,
          headcount: dept.headcount,
          departments: [dept.department],
        });
      }
    }
  }

  const courses = Array.from(courseRollup.values()).sort(
    (a, b) => b.headcount - a.headcount || a.title.localeCompare(b.title)
  );

  return NextResponse.json(
    { departments, courses, response_count: responses.length },
    { headers: noCache }
  );
}
