import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDimensionScores, calculateScoresByDimension, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore, RESPONDENT_ROLE_LABELS } from "@/lib/constants";
import { getTemplateOrDefault } from "@/lib/assessment-templates";
import {
  sendAssessmentResultsEmail,
  sendAdminAssessmentCompletedEmail,
} from "@/lib/email";
import { fetchPublishedCourses } from "@/lib/courses";
import { rankCourses } from "@/lib/recommendation-engine";
import type { CourseRecommendation } from "@/lib/types";
import type { RespondentRole } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { assessment_id, answers, respondent_role, tools_used } = body;

  if (!assessment_id || !answers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, department_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: assessment } = await supabase
    .from("assessments")
    .select("template_id, created_by")
    .eq("id", assessment_id)
    .single();

  const template = getTemplateOrDefault(assessment?.template_id ?? "org-wide");
  const isMaturity = template.kind === "maturity";
  const genericScores = calculateScoresByDimension(answers, template.questions);
  const scores = calculateDimensionScores(answers, template.questions);

  const { data, error } = await supabase
    .from("assessment_responses")
    .insert({
      assessment_id,
      user_id: user.id,
      department_id: profile.department_id,
      template_id: template.id,
      dimension_scores: genericScores,
      confidence_score: isMaturity ? scores.confidence : 0,
      practice_score: isMaturity ? scores.practice : 0,
      tools_score: isMaturity ? scores.tools : 0,
      responsible_score: isMaturity ? scores.responsible : 0,
      culture_score: isMaturity ? scores.culture : 0,
      respondent_role: respondent_role ?? null,
      tools_used: tools_used ?? null,
      raw_answers: answers,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const overall = calculateOverallScore(scores);
  const tier = getTierForScore(overall);

  // The results and admin emails speak maturity language (tiers); the
  // training-needs instrument shows its results on screen instead.
  if (!isMaturity) {
    return NextResponse.json({ response: data, scores: genericScores, template_id: template.id, kind: template.kind });
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("email, name, org_id")
    .eq("id", user.id)
    .single();

  if (userProfile) {
    await sendAssessmentResultsEmail(userProfile.email, userProfile.name, scores, overall, tier.label);

    const { data: org } = await supabase
      .from("organisations")
      .select("name, logo_url")
      .eq("id", userProfile.org_id)
      .single();

    let departmentLabel: string | undefined;
    if (profile.department_id) {
      const { data: dept } = await supabase
        .from("departments")
        .select("name")
        .eq("id", profile.department_id)
        .single();
      if (dept?.name) departmentLabel = dept.name;
    }

    let fallbackNotify: { email: string; name: string } | undefined;
    if (assessment?.created_by) {
      const { data: creator } = await supabase
        .from("user_profiles")
        .select("email, name")
        .eq("id", assessment.created_by)
        .single();
      if (creator?.email) fallbackNotify = { email: creator.email, name: creator.name || "Admin" };
    }

    await sendAdminAssessmentCompletedEmail(
      userProfile.org_id,
      org?.name ?? "Organisation",
      userProfile.name,
      userProfile.email,
      overall,
      tier.label,
      departmentLabel,
      {
        scores,
        respondentRole: respondent_role
          ? (RESPONDENT_ROLE_LABELS[respondent_role as keyof typeof RESPONDENT_ROLE_LABELS] ?? respondent_role)
          : undefined,
        toolsUsed: tools_used ?? undefined,
        logoUrl: org?.logo_url ?? undefined,
        fallbackNotify,
      }
    );
  }

  // Return the matched courses with the score. The moment someone finishes
  // is when they are most receptive to being told what to do about it, and
  // making them navigate to My Results to find out lost most of them.
  const recommendedCourses: CourseRecommendation[] = rankCourses(
    scores,
    (respondent_role as RespondentRole | null) ?? "individual_contributor",
    await fetchPublishedCourses()
  ).map(({ course, score, matched_dimensions }) => ({
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    level: course.level,
    duration_hours: course.duration_hours,
    delivery_modes: course.delivery_modes,
    match_score: score,
    matched_dimensions,
  }));

  return NextResponse.json({
    response: data,
    scores,
    recommended_courses: recommendedCourses,
  });
}
