import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateDimensionScores, calculateScoresByDimension, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore, RESPONDENT_ROLE_LABELS } from "@/lib/constants";
import { getTemplateOrDefault } from "@/lib/assessment-templates";
import {
  sendConfirmWelcomeEmail,
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
      .select("id, org_id, created_by")
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

    const template = getTemplateOrDefault(templateId);
    const isMaturity = template.kind === "maturity";
    const genericScores = calculateScoresByDimension(answers, template.questions);
    const scores = calculateDimensionScores(answers, template.questions);
    const overall = calculateOverallScore(scores);
    const tier = getTierForScore(overall);

    const orgId = assessment.org_id;

    // generateLink creates the (unconfirmed) account and returns the
    // confirmation URL without sending Supabase's own email - the one
    // branded email below is the only thing the person receives.
    const { data: linkData, error: signUpError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: { name, org_id: orgId },
        redirectTo: `${req.nextUrl.origin}/auth/callback?next=/dashboard/my-results`,
      },
    });

    if (signUpError || !linkData?.user) {
      const message = signUpError?.message ?? "Failed to create account";
      if (/already|registered|exists/i.test(message)) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const userId = linkData.user.id;
    const confirmUrl = linkData.properties?.action_link;
    const needsConfirmation = true;

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
      .select("name, logo_url")
      .eq("id", orgId)
      .single();

    let fallbackNotify: { email: string; name: string } | undefined;
    if (assessment.created_by) {
      const { data: creator } = await supabaseAdmin
        .from("user_profiles")
        .select("email, name")
        .eq("id", assessment.created_by)
        .single();
      if (creator?.email) fallbackNotify = { email: creator.email, name: creator.name || "Admin" };
    }

    // The one email the new member receives: welcome + confirm combined.
    try {
      if (!confirmUrl) throw new Error("generateLink returned no action_link");
      await sendConfirmWelcomeEmail(email, name, org?.name ?? null, confirmUrl);
    } catch (emailError) {
      console.error("Confirm email failed:", emailError);
      return NextResponse.json(
        {
          error: "Your results are saved but the confirmation email failed. Use password reset to activate your account.",
          code: "email_failed",
        },
        { status: 500 }
      );
    }
    if (isMaturity) await sendAdminAssessmentCompletedEmail(orgId, org?.name ?? "Organisation", name, email, overall, tier.label, department, {
      scores,
      respondentRole: respondent_role
        ? (RESPONDENT_ROLE_LABELS[respondent_role as keyof typeof RESPONDENT_ROLE_LABELS] ?? respondent_role)
        : undefined,
      toolsUsed: tools_used ?? undefined,
      logoUrl: org?.logo_url ?? undefined,
      fallbackNotify,
    });
    await sendAdminNewMemberEmail(orgId, org?.name ?? "Organisation", name, email, department);

    return NextResponse.json({
      success: true,
      needs_confirmation: needsConfirmation,
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
