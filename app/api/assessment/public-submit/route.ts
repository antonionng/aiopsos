import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateDimensionScores, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore } from "@/lib/constants";
import { getTemplate } from "@/lib/assessment-templates";
import {
  sendWelcomeEmail,
  sendAssessmentResultsEmail,
  sendAdminAssessmentCompletedEmail,
  sendAdminNewMemberEmail,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
  const rl = rateLimit(`publicSubmit:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  try {
    const supabase = await createClient();

    const body = await req.json();
    const { publicAssessmentSubmitSchema, validateBody } = await import("@/lib/validations");
    const validation = validateBody(publicAssessmentSubmitSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    const { name, email, password, department, answers, assessment_id, respondent_role, tools_used } = validation.data;

    const { data: assessment } = await supabaseAdmin
      .from("assessments")
      .select("id, org_id")
      .eq("id", assessment_id)
      .single();

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    let templateId = "org-wide";
    const { data: tmplRow } = await supabaseAdmin
      .from("assessments")
      .select("template_id")
      .eq("id", assessment_id)
      .single();
    if (tmplRow?.template_id) templateId = tmplRow.template_id;

    const template = getTemplate(templateId);
    const scores = calculateDimensionScores(answers, template.questions);
    const overall = calculateOverallScore(scores);
    const tier = getTierForScore(overall);

    const orgId = assessment.org_id;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, org_id: orgId } },
    });

    if (signUpError || !authData.user) {
      return NextResponse.json(
        { error: signUpError?.message || "Failed to create account" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identities = (authData.user as any).identities;
    if (Array.isArray(identities) && identities.length === 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const userId = authData.user.id;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      console.error("Post-signup sign-in failed:", signInError.message);
    }

    let departmentId: string | null = null;
    if (department) {
      const { data: existingDept } = await supabaseAdmin
        .from("departments")
        .select("id")
        .eq("org_id", orgId)
        .eq("type", department)
        .limit(1)
        .single();

      if (existingDept) {
        departmentId = existingDept.id;
      } else {
        const deptLabels: Record<string, string> = {
          engineering: "Engineering",
          sales: "Sales",
          operations: "Operations",
          leadership: "Leadership",
          marketing: "Marketing",
          legal: "Legal & Compliance",
          hr: "Human Resources",
          finance: "Finance",
          product: "Product",
          support: "Support",
        };
        const { data: newDept, error: deptError } = await supabaseAdmin
          .from("departments")
          .insert({
            org_id: orgId,
            name: deptLabels[department] || department,
            type: department,
          })
          .select("id")
          .single();
        if (deptError) {
          console.error("Department creation failed:", deptError.message);
        }
        if (newDept) departmentId = newDept.id;
      }
    }

    const { error: profileError } = await supabaseAdmin.from("user_profiles").upsert({
      id: userId,
      org_id: orgId,
      department_id: departmentId,
      email,
      name,
      role: "user",
    });

    if (profileError) {
      console.error("Profile upsert failed:", profileError.message);
      return NextResponse.json(
        { error: "Failed to create your profile. Please try again." },
        { status: 500 }
      );
    }

    const responseInsert: Record<string, unknown> = {
      assessment_id: assessment.id,
      user_id: userId,
      confidence_score: scores.confidence,
      practice_score: scores.practice,
      tools_score: scores.tools,
      responsible_score: scores.responsible,
      culture_score: scores.culture,
      respondent_role: respondent_role ?? null,
      tools_used: tools_used ?? null,
      raw_answers: answers,
    };
    if (departmentId) responseInsert.department_id = departmentId;

    const { error: responseError } = await supabaseAdmin
      .from("assessment_responses")
      .insert(responseInsert);

    if (responseError) {
      console.error("Assessment response insert failed:", responseError.message);
      return NextResponse.json(
        { error: "Failed to save your assessment response. Please try again." },
        { status: 500 }
      );
    }

    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name")
      .eq("id", orgId)
      .single();

    sendWelcomeEmail(email, name, org?.name);
    sendAssessmentResultsEmail(email, name, scores, overall, tier.label);
    sendAdminAssessmentCompletedEmail(orgId, org?.name ?? "Organisation", name, email, overall, tier.label, department);
    sendAdminNewMemberEmail(orgId, org?.name ?? "Organisation", name, email, department);

    return NextResponse.json({
      success: true,
      scores,
      overall,
      tier: { tier: tier.tier, label: tier.label, color: tier.color },
    });
  } catch (err) {
    console.error("Public submit route error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }
}
