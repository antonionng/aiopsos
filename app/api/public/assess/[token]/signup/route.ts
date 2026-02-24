import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  sendWelcomeEmail,
  sendAdminAssessmentCompletedEmail,
  sendAdminNewMemberEmail,
} from "@/lib/email";
import { calculateOverallScore } from "@/lib/scoring";
import { getTierForScore, DIMENSION_LABELS, DIMENSIONS, RESPONDENT_ROLE_LABELS, type Dimension } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    const { data: link, error: linkError } = await supabaseAdmin
      .from("assessment_links")
      .select("id, org_id, created_by")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, email, password, department, session_token } = body;

    if (!name || !email || !password || !session_token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: pending, error: pendingError } = await supabaseAdmin
      .from("pending_responses")
      .select("*")
      .eq("session_token", session_token)
      .eq("link_id", link.id)
      .is("claimed_by", null)
      .single();

    if (pendingError || !pending) {
      return NextResponse.json(
        { error: "No pending assessment found for this session" },
        { status: 404 }
      );
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, org_id: link.org_id } },
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

    // Sign in immediately so session cookies are set on the response
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
        .eq("org_id", link.org_id)
        .eq("type", department)
        .limit(1)
        .single();

      if (existingDept) {
        departmentId = existingDept.id;
      } else {
        const deptLabels: Record<string, string> = {
          engineering: "Engineering", sales: "Sales", operations: "Operations",
          leadership: "Leadership", marketing: "Marketing", legal: "Legal & Compliance",
          hr: "Human Resources", finance: "Finance", product: "Product", support: "Support",
        };
        const { data: newDept, error: deptError } = await supabaseAdmin
          .from("departments")
          .insert({ org_id: link.org_id, name: deptLabels[department] || department, type: department })
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
      org_id: link.org_id,
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

    let assessmentId: string;
    const { data: existingAssessment } = await supabaseAdmin
      .from("assessments")
      .select("id")
      .eq("org_id", link.org_id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingAssessment) {
      assessmentId = existingAssessment.id;
    } else {
      const { data: newAssessment, error: assessmentError } = await supabaseAdmin
        .from("assessments")
        .insert({
          org_id: link.org_id,
          created_by: userId,
          title: "AI Readiness Assessment",
          status: "active",
        })
        .select("id")
        .single();
      if (assessmentError || !newAssessment) {
        console.error("Assessment creation failed:", assessmentError?.message);
        return NextResponse.json(
          { error: "Failed to create assessment record" },
          { status: 500 }
        );
      }
      assessmentId = newAssessment.id;
    }

    const responseInsert: Record<string, unknown> = {
      assessment_id: assessmentId,
      user_id: userId,
      confidence_score: pending.confidence_score,
      practice_score: pending.practice_score,
      tools_score: pending.tools_score,
      responsible_score: pending.responsible_score,
      culture_score: pending.culture_score,
      respondent_role: pending.respondent_role,
      tools_used: pending.tools_used,
      raw_answers: pending.raw_answers,
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

    const { error: claimError } = await supabaseAdmin
      .from("pending_responses")
      .update({ claimed_by: userId })
      .eq("id", pending.id);

    if (claimError) {
      console.error("Pending response claim failed:", claimError.message);
    }

    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name")
      .eq("id", link.org_id)
      .single();

    let fallbackNotify: { email: string; name: string } | undefined;
    if (link.created_by) {
      const { data: creator } = await supabaseAdmin
        .from("user_profiles")
        .select("email, name")
        .eq("id", link.created_by)
        .single();
      if (creator?.email) fallbackNotify = { email: creator.email, name: creator.name || "Admin" };
    }

    const scores = {
      confidence: Number(pending.confidence_score),
      practice: Number(pending.practice_score),
      tools: Number(pending.tools_score),
      responsible: Number(pending.responsible_score),
      culture: Number(pending.culture_score),
    };
    const overall = calculateOverallScore(scores);
    const tier = getTierForScore(overall);

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
    await sendAdminAssessmentCompletedEmail(link.org_id, org?.name ?? "Organisation", name, email, overall, tier.label, department, {
      scores,
      respondentRole: pending.respondent_role
        ? (RESPONDENT_ROLE_LABELS[pending.respondent_role as keyof typeof RESPONDENT_ROLE_LABELS] ?? pending.respondent_role)
        : undefined,
      toolsUsed: pending.tools_used ?? undefined,
      fallbackNotify,
    });
    await sendAdminNewMemberEmail(link.org_id, org?.name ?? "Organisation", name, email, department);

    const response = NextResponse.json({ success: true, redirect: "/dashboard/my-results" });

    response.cookies.delete("assess_session");

    return response;
  } catch (err) {
    console.error("Signup route error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }
}
