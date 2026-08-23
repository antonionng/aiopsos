import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  sendWelcomeEmail,
  sendAdminAssessmentCompletedEmail,
  sendAdminNewMemberEmail,
} from "@/lib/email";
import { calculateOverallScore } from "@/lib/scoring";
import { claimPendingResponse } from "@/lib/assess-claim";
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

    // Deliberately NOT filtered on claimed_by: a retry after a partial
    // failure arrives with the row already latched to the new user, and
    // filtering it out here would 404 before the idempotent claim could
    // finish the job. Ownership is enforced by the claim's latch.
    const { data: pending, error: pendingError } = await supabaseAdmin
      .from("pending_responses")
      .select("*")
      .eq("session_token", session_token)
      .eq("link_id", link.id)
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
      options: {
        data: { name, org_id: link.org_id },
        // Email confirmation is ON for this project; the link must land
        // on our callback so the code can be exchanged for a session.
        emailRedirectTo: `${req.nextUrl.origin}/auth/callback?next=/dashboard/my-results`,
      },
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
        {
          error: "An account with this email already exists.",
          code: "email_exists",
        },
        { status: 409 }
      );
    }

    const userId = authData.user.id;

    // Sign in immediately so session cookies are set on the response. With
    // email confirmation on this fails until the link is clicked - that is
    // fine: everything below uses the admin client, so the assessment still
    // gets claimed, and we tell the client to show the check-your-email
    // screen instead of bouncing them into a login wall.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const needsConfirmation = !!signInError;

    // Everything that attaches the assessment to the account lives in the
    // shared claim, which is idempotent: if anything below fails, retrying
    // through /claim after signing in completes it instead of losing it.
    const claim = await claimPendingResponse({
      userId,
      userEmail: email,
      userName: name,
      linkOrgId: link.org_id,
      sessionToken: session_token,
      department: department || null,
    });

    if (claim.notFound) {
      return NextResponse.json(
        { error: "No pending assessment found for this session" },
        { status: 404 }
      );
    }
    if (!claim.ok) {
      // The account exists and the pending response is untouched or latched
      // to this user - /claim can finish the job. Say so rather than
      // pretending nothing happened.
      return NextResponse.json(
        {
          error: "Your account was created but attaching your results failed. Sign in and we will attach them automatically.",
          code: "claim_failed",
        },
        { status: 500 }
      );
    }

    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name, logo_url")
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
    }, org?.logo_url ?? undefined);
    await sendAdminAssessmentCompletedEmail(link.org_id, org?.name ?? "Organisation", name, email, overall, tier.label, department, {
      scores,
      respondentRole: pending.respondent_role
        ? (RESPONDENT_ROLE_LABELS[pending.respondent_role as keyof typeof RESPONDENT_ROLE_LABELS] ?? pending.respondent_role)
        : undefined,
      toolsUsed: pending.tools_used ?? undefined,
      logoUrl: org?.logo_url ?? undefined,
      fallbackNotify,
    });
    await sendAdminNewMemberEmail(link.org_id, org?.name ?? "Organisation", name, email, department);

    const response = NextResponse.json(
      needsConfirmation
        ? { success: true, needs_confirmation: true }
        : { success: true, redirect: "/dashboard/my-results" }
    );

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
