import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAssessmentReminderEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params;
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

    if (
      !profile?.org_id ||
      !["admin", "super_admin"].includes(profile.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: assessment } = await supabaseAdmin
      .from("assessments")
      .select("id, title, org_id")
      .eq("id", assessmentId)
      .eq("org_id", profile.org_id)
      .single();

    if (!assessment)
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );

    const body = await req.json().catch(() => ({}));
    const targetEmails: string[] | undefined = body.emails;

    // Fetch all non-completed invites
    let query = supabaseAdmin
      .from("assessment_invites")
      .select("*")
      .eq("assessment_id", assessmentId)
      .eq("org_id", profile.org_id)
      .neq("status", "completed");

    if (targetEmails?.length) {
      query = query.in("email", targetEmails);
    }

    const { data: invites } = await query;
    const list = invites ?? [];

    // Get org info and completion stats
    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name")
      .eq("id", profile.org_id)
      .single();
    const orgName = org?.name ?? "Your organisation";

    const { count: totalInvited } = await supabaseAdmin
      .from("assessment_invites")
      .select("*", { count: "exact", head: true })
      .eq("assessment_id", assessmentId);

    const { count: completedCount } = await supabaseAdmin
      .from("assessment_invites")
      .select("*", { count: "exact", head: true })
      .eq("assessment_id", assessmentId)
      .eq("status", "completed");

    // Get assess URL
    const { data: link } = await supabaseAdmin
      .from("assessment_links")
      .select("token")
      .eq("org_id", profile.org_id)
      .eq("active", true)
      .limit(1)
      .single();

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const assessUrl = `${baseUrl}/assess/${link?.token ?? assessmentId}`;

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let reminded = 0;
    let skipped = 0;

    for (const invite of list) {
      // Throttle: skip if reminded within last 24h
      if (
        invite.reminded_at &&
        new Date(invite.reminded_at) > twentyFourHoursAgo
      ) {
        skipped++;
        continue;
      }

      await sendAssessmentReminderEmail(
        invite.email,
        invite.name,
        orgName,
        assessment.title,
        assessUrl,
        completedCount ?? 0,
        totalInvited ?? 0
      );

      await supabaseAdmin
        .from("assessment_invites")
        .update({ reminded_at: now.toISOString() })
        .eq("id", invite.id);

      reminded++;
    }

    return NextResponse.json({ reminded, skipped });
  } catch (err) {
    console.error("Assessment remind error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
