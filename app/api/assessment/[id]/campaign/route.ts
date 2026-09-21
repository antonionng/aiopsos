import { resourceAccessError } from "@/lib/workspace-resource-access";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
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

    const denied = await resourceAccessError(supabase, profile?.org_id, profile?.role);
    if (denied) return denied;

    if (
      !profile?.org_id ||
      !["admin", "super_admin"].includes(profile.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: assessment, error: assessmentError } = await supabaseAdmin.from("assessments").select("id").eq("id", assessmentId).eq("org_id", profile.org_id).maybeSingle();
    if (assessmentError) return NextResponse.json({ error: "Campaign could not be loaded." }, { status: 503 });
    if (!assessment) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    const { data: invites, error: inviteError } = await supabaseAdmin
      .from("assessment_invites")
      .select("*")
      .eq("assessment_id", assessmentId)
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false });

    if (inviteError) return NextResponse.json({ error: "Invitations could not be loaded. Please retry." }, { status: 503 });
    const list = invites ?? [];
    const invited = list.length;
    const sent = list.filter((i) => i.status !== "pending").length;
    const completed = list.filter((i) => i.status === "completed").length;
    const rate = invited > 0 ? Math.round((completed / invited) * 100) : 0;

    return NextResponse.json({
      stats: { invited, sent, completed, rate },
      invites: list,
    });
  } catch (err) {
    console.error("Campaign stats error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
