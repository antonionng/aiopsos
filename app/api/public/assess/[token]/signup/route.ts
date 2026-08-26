import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  sendConfirmWelcomeEmail,
  sendAdminAssessmentCompletedEmail,
  sendAdminNewMemberEmail,
} from "@/lib/email";
import { calculateOverallScore } from "@/lib/scoring";
import { claimPendingResponse } from "@/lib/assess-claim";
import { getTierForScore, RESPONDENT_ROLE_LABELS } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

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

    // generateLink creates the (unconfirmed) account and returns the
    // confirmation URL without sending Supabase's own email - the one
    // branded email below is the only thing the person receives.
    const { data: linkData, error: signUpError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: { name, org_id: link.org_id },
        redirectTo: `${req.nextUrl.origin}/auth/callback?next=/dashboard/my-results`,
      },
    });

    if (signUpError || !linkData?.user) {
      const message = signUpError?.message ?? "Failed to create account";
      if (/already|registered|exists/i.test(message)) {
        return NextResponse.json(
          {
            error: "An account with this email already exists.",
            code: "email_exists",
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const userId = linkData.user.id;
    const confirmUrl = linkData.properties?.action_link;

    // Confirmation is always pending with this flow; the claim below still
    // runs on the admin client, so results attach before the click.
    const needsConfirmation = true;

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

    // The one email the new member receives: welcome + confirm. Their
    // results are already claimed above, so after the click they land
    // straight on my-results. If it cannot send, the account still exists
    // and is recoverable via password reset - do not roll back a claimed
    // assessment over a mail hiccup, just surface the error.
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
