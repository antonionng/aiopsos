import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAssessmentInviteEmail } from "@/lib/email";

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
      .select("org_id, role, name")
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

    const body = await req.json();
    const invites: { email: string; name?: string; department?: string }[] =
      body.invites ?? [];

    if (invites.length === 0)
      return NextResponse.json(
        { error: "No invites provided" },
        { status: 400 }
      );

    const { data: org } = await supabaseAdmin
      .from("organisations")
      .select("name")
      .eq("id", profile.org_id)
      .single();
    const orgName = org?.name ?? "Your organisation";

    // Find or create an assessment link for this assessment
    let { data: link } = await supabaseAdmin
      .from("assessment_links")
      .select("token")
      .eq("org_id", profile.org_id)
      .eq("active", true)
      .limit(1)
      .single();

    if (!link) {
      const token = crypto.randomUUID().slice(0, 8);
      const { data: newLink } = await supabaseAdmin
        .from("assessment_links")
        .insert({
          org_id: profile.org_id,
          created_by: user.id,
          token,
          title: assessment.title,
        })
        .select("token")
        .single();
      link = newLink;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const assessUrl = `${baseUrl}/assess/${link?.token ?? assessmentId}`;

    let sent = 0;
    let duplicates = 0;
    const errors: string[] = [];

    for (const invite of invites) {
      const email = invite.email?.trim().toLowerCase();
      if (!email || !email.includes("@")) {
        errors.push(`Invalid email: ${invite.email}`);
        continue;
      }

      const { error: upsertError } = await supabaseAdmin
        .from("assessment_invites")
        .upsert(
          {
            assessment_id: assessmentId,
            org_id: profile.org_id,
            email,
            name: invite.name?.trim() ?? "",
            department: invite.department?.trim() ?? "",
            status: "sent",
            sent_at: new Date().toISOString(),
          },
          { onConflict: "assessment_id,email", ignoreDuplicates: false }
        );

      if (upsertError) {
        if (upsertError.code === "23505") {
          duplicates++;
        } else {
          errors.push(`${email}: ${upsertError.message}`);
        }
        continue;
      }

      await sendAssessmentInviteEmail(
        email,
        invite.name?.trim() ?? "",
        orgName,
        assessment.title,
        assessUrl
      );
      sent++;
    }

    return NextResponse.json({ sent, duplicates, errors });
  } catch (err) {
    console.error("Assessment invite error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
