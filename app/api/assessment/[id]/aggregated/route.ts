import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { RESPONDENT_ROLE_LABELS } from "@/lib/constants";
import { canViewOrgData, type UserRole } from "@/lib/role-helpers";
import { calculateOverallScore } from "@/lib/scoring";
import type { DimensionScores } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    .select("org_id, template_id")
    .eq("id", id)
    .single();

  if (!assessment || !profile?.org_id || assessment.org_id !== profile.org_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: responses, error } = await supabaseAdmin
    .from("assessment_responses")
    .select("id, confidence_score, practice_score, tools_score, responsible_score, culture_score, department_id, respondent_role, user_id, submitted_at, raw_answers, departments(name)")
    .eq("assessment_id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const noCache = { "Cache-Control": "no-store" };

  if (!responses || responses.length === 0) {
    return NextResponse.json({
      org_scores: { confidence: 0, practice: 0, tools: 0, responsible: 0, culture: 0 },
      department_scores: [],
      response_count: 0,
      department_count: 0,
      my_scores: null,
    }, { headers: noCache });
  }

  function avg(arr: number[]) {
    return arr.length > 0
      ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
      : 0;
  }

  type ResponseRow = NonNullable<typeof responses>[number];

  function extractScores(r: ResponseRow): DimensionScores {
    return {
      confidence: Number(r.confidence_score),
      practice: Number(r.practice_score),
      tools: Number(r.tools_score),
      responsible: Number(r.responsible_score),
      culture: Number(r.culture_score),
    };
  }

  const orgScores: DimensionScores = {
    confidence: avg(responses.map((r) => Number(r.confidence_score))),
    practice: avg(responses.map((r) => Number(r.practice_score))),
    tools: avg(responses.map((r) => Number(r.tools_score))),
    responsible: avg(responses.map((r) => Number(r.responsible_score))),
    culture: avg(responses.map((r) => Number(r.culture_score))),
  };

  const myResponse = responses.find((r) => r.user_id === user.id);
  const myScores = myResponse ? extractScores(myResponse) : null;

  const roleLabels = RESPONDENT_ROLE_LABELS as Record<string, string>;

  const deptMap = new Map<string, { name: string; rows: typeof responses }>();
  for (const r of responses) {
    const deptId = r.department_id ?? `role:${r.respondent_role ?? "general"}`;
    const deptName =
      (r.departments as unknown as { name: string } | null)?.name
      ?? roleLabels[r.respondent_role ?? ""] 
      ?? "General";
    if (!deptMap.has(deptId)) deptMap.set(deptId, { name: deptName, rows: [] });
    deptMap.get(deptId)!.rows.push(r);
  }

  const departmentScores = Array.from(deptMap.values()).map(({ name, rows }) => ({
    department: name,
    scores: {
      confidence: avg(rows.map((r) => Number(r.confidence_score))),
      practice: avg(rows.map((r) => Number(r.practice_score))),
      tools: avg(rows.map((r) => Number(r.tools_score))),
      responsible: avg(rows.map((r) => Number(r.responsible_score))),
      culture: avg(rows.map((r) => Number(r.culture_score))),
    } as DimensionScores,
  }));

  let respondents: unknown[] | undefined;

  if (canViewOrgData(profile.role as UserRole)) {
    const userIds = [...new Set(responses.map((r) => r.user_id).filter(Boolean))];

    const { data: profiles } = userIds.length > 0
      ? await supabaseAdmin
          .from("user_profiles")
          .select("id, name, email, avatar_url")
          .in("id", userIds)
      : { data: [] };

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p]),
    );

    respondents = responses.map((r) => {
      const scores = extractScores(r);
      const overall = calculateOverallScore(scores);
      const userProfile = profileMap.get(r.user_id);
      const deptName =
        (r.departments as unknown as { name: string } | null)?.name
        ?? roleLabels[r.respondent_role ?? ""]
        ?? "General";

      return {
        id: r.id,
        user_id: r.user_id,
        name: userProfile?.name ?? "Unknown",
        email: userProfile?.email ?? "",
        avatar_url: userProfile?.avatar_url ?? null,
        respondent_role: r.respondent_role,
        department: deptName,
        submitted_at: r.submitted_at,
        scores,
        overall_score: overall,
        raw_answers: r.raw_answers ?? {},
      };
    });
  }

  const roleMap = new Map<string, { scores: DimensionScores[]; count: number }>();
  for (const r of responses) {
    const role = r.respondent_role ?? "unknown";
    if (!roleMap.has(role)) {
      roleMap.set(role, { scores: [], count: 0 });
    }
    const entry = roleMap.get(role)!;
    entry.scores.push(extractScores(r));
    entry.count++;
  }

  const roleScores = Array.from(roleMap.entries()).map(([role, { scores, count }]) => {
    const avgScores: DimensionScores = {
      confidence: avg(scores.map((s) => s.confidence)),
      practice: avg(scores.map((s) => s.practice)),
      tools: avg(scores.map((s) => s.tools)),
      responsible: avg(scores.map((s) => s.responsible)),
      culture: avg(scores.map((s) => s.culture)),
    };
    return {
      role,
      roleLabel: roleLabels[role] ?? role,
      scores: avgScores,
      overall: calculateOverallScore(avgScores),
      count,
    };
  }).sort((a, b) => b.overall - a.overall);

  let historicalAssessments: {
    assessment_id: string;
    completed_at: string;
    overall_score: number;
    dimension_scores: DimensionScores;
    response_count: number;
  }[] = [];

  const { data: allAssessments } = await supabaseAdmin
    .from("assessments")
    .select("id, created_at")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: true });

  if (allAssessments && allAssessments.length > 1) {
    const assessmentIds = allAssessments.map((a) => a.id);
    
    const { data: allResponses } = await supabaseAdmin
      .from("assessment_responses")
      .select("assessment_id, confidence_score, practice_score, tools_score, responsible_score, culture_score, submitted_at")
      .in("assessment_id", assessmentIds);

    if (allResponses && allResponses.length > 0) {
      const responsesByAssessment = new Map<string, typeof allResponses>();
      for (const r of allResponses) {
        if (!responsesByAssessment.has(r.assessment_id)) {
          responsesByAssessment.set(r.assessment_id, []);
        }
        responsesByAssessment.get(r.assessment_id)!.push(r);
      }

      historicalAssessments = allAssessments
        .filter((a) => responsesByAssessment.has(a.id) && responsesByAssessment.get(a.id)!.length > 0)
        .map((a) => {
          const aResponses = responsesByAssessment.get(a.id)!;
          const dimScores: DimensionScores = {
            confidence: avg(aResponses.map((r) => Number(r.confidence_score))),
            practice: avg(aResponses.map((r) => Number(r.practice_score))),
            tools: avg(aResponses.map((r) => Number(r.tools_score))),
            responsible: avg(aResponses.map((r) => Number(r.responsible_score))),
            culture: avg(aResponses.map((r) => Number(r.culture_score))),
          };
          const latestResponse = aResponses.reduce((latest, r) => 
            new Date(r.submitted_at) > new Date(latest.submitted_at) ? r : latest
          );
          return {
            assessment_id: a.id,
            completed_at: latestResponse.submitted_at,
            overall_score: calculateOverallScore(dimScores),
            dimension_scores: dimScores,
            response_count: aResponses.length,
          };
        });
    }
  }

  return NextResponse.json({
    org_scores: orgScores,
    department_scores: departmentScores,
    response_count: responses.length,
    department_count: deptMap.size,
    my_scores: myScores,
    template_id: assessment.template_id ?? "org-wide",
    role_scores: roleScores,
    historical_assessments: historicalAssessments,
    ...(respondents ? { respondents } : {}),
  }, { headers: noCache });
}
