import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateOverallScore } from "@/lib/scoring";
import type { DimensionScores } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id)
    return NextResponse.json({ data: null });

  const { data: orgAssessments } = await supabaseAdmin
    .from("assessments")
    .select("id")
    .eq("org_id", profile.org_id);

  if (!orgAssessments || orgAssessments.length === 0)
    return NextResponse.json({ data: null });

  const assessmentIds = orgAssessments.map((a) => a.id);

  const { data: responses } = await supabaseAdmin
    .from("assessment_responses")
    .select("confidence_score, practice_score, tools_score, responsible_score, culture_score, department_id, departments(name, type)")
    .in("assessment_id", assessmentIds);

  if (!responses || responses.length === 0)
    return NextResponse.json({ data: null });

  function avg(arr: number[]) {
    return arr.length > 0
      ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
      : 0;
  }

  const orgScores: DimensionScores = {
    confidence: avg(responses.map((r) => Number(r.confidence_score))),
    practice: avg(responses.map((r) => Number(r.practice_score))),
    tools: avg(responses.map((r) => Number(r.tools_score))),
    responsible: avg(responses.map((r) => Number(r.responsible_score))),
    culture: avg(responses.map((r) => Number(r.culture_score))),
  };

  const overallScore = calculateOverallScore(orgScores);

  const deptMap = new Map<
    string,
    { name: string; type: string; rows: typeof responses }
  >();
  for (const r of responses) {
    const deptId = r.department_id;
    const dept = r.departments as unknown as { name: string; type: string } | null;
    const deptName = dept?.name ?? "Unknown";
    const deptType = dept?.type ?? "operations";
    if (!deptMap.has(deptId))
      deptMap.set(deptId, { name: deptName, type: deptType, rows: [] });
    deptMap.get(deptId)!.rows.push(r);
  }

  const departmentScores = Array.from(deptMap.values()).map(
    ({ name, type, rows }) => {
      const scores: DimensionScores = {
        confidence: avg(rows.map((r) => Number(r.confidence_score))),
        practice: avg(rows.map((r) => Number(r.practice_score))),
        tools: avg(rows.map((r) => Number(r.tools_score))),
        responsible: avg(rows.map((r) => Number(r.responsible_score))),
        culture: avg(rows.map((r) => Number(r.culture_score))),
      };
      return {
        department: name,
        type,
        maturityScore: calculateOverallScore(scores),
        scores,
      };
    },
  );

  return NextResponse.json({
    data: {
      overallScore,
      dimensionScores: orgScores,
      departmentCount: deptMap.size,
      responseCount: responses.length,
      departmentScores,
    },
  });
}
