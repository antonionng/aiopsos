import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateDimensionScores, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore, DIMENSION_LABELS, DIMENSIONS, RESPONDENT_ROLE_LABELS, type Dimension } from "@/lib/constants";
import { getTemplate } from "@/lib/assessment-templates";
import {
  sendWelcomeEmail,
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

    let fallbackNotify: { email: string; name: string } | undefined;
    if (assessment.created_by) {
      const { data: creator } = await supabaseAdmin
        .from("user_profiles")
        .select("email, name")
        .eq("id", assessment.created_by)
        .single();
      if (creator?.email) fallbackNotify = { email: creator.email, name: creator.name || "Admin" };
    }

    const sorted = DIMENSIONS.slice().sort(
      (a, b) => scores[b] - scores[a]
    ) as Dimension[];
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const insights: string[] = [];
    insights.push(
      `Your strongest area is ${DIMENSION_LABELS[strongest]} (${scores[strongest].toFixed(1)}/5).`
    );
    if (scores[weakest] < 2) {
      insights.push(
        `${DIMENSION_LABELS[weakest]} needs attention at ${scores[weakest].toFixed(1)}/5 — this is your biggest growth opportunity.`
      );
    } else {
      insights.push(
        `${DIMENSION_LABELS[weakest]} scored ${scores[weakest].toFixed(1)}/5 — room to improve here.`
      );
    }
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    if (avg >= 3.5) {
      insights.push(
        "Your organisation is well positioned to adopt advanced AI workflows and agent orchestration."
      );
    } else if (avg >= 2) {
      insights.push(
        "You have a solid foundation — targeted training and process integration will accelerate your AI journey."
      );
    } else {
      insights.push(
        "Starting your AI journey is the first step — explore your dashboard for a tailored adoption roadmap."
      );
    }

    await sendWelcomeEmail(email, name, org?.name, {
      scores,
      overall,
      tierLabel: tier.label,
      insights,
    });
    await sendAdminAssessmentCompletedEmail(orgId, org?.name ?? "Organisation", name, email, overall, tier.label, department, {
      scores,
      respondentRole: respondent_role
        ? (RESPONDENT_ROLE_LABELS[respondent_role as keyof typeof RESPONDENT_ROLE_LABELS] ?? respondent_role)
        : undefined,
      toolsUsed: tools_used ?? undefined,
      fallbackNotify,
    });
    await sendAdminNewMemberEmail(orgId, org?.name ?? "Organisation", name, email, department);

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
