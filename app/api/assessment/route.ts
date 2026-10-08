import { resourceAccessError } from "@/lib/workspace-resource-access";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

    const denied = await resourceAccessError(supabase, profile?.org_id, profile?.role);
    if (denied) return denied;

  if (!profile?.org_id) return NextResponse.json({ assessments: [] });

  const { data: assessments } = await supabaseAdmin
    .from("assessments")
    .select("*, assessment_responses(count)")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ assessments: assessments ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    const denied = await resourceAccessError(supabase, profile?.org_id, profile?.role);
    if (denied) return denied;

    if (!profile?.org_id || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { assessmentCreateSchema, validateBody } = await import("@/lib/validations");
    const validation = validateBody(assessmentCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin.rpc("assessment_manage", {
      p_actor: user.id, p_org: profile.org_id, p_action: "create",
      p_title: validation.data.title, p_template: validation.data.template_id,
    });
    if (error) return NextResponse.json({ error: "Assessment could not be created. Refresh your workspace and retry." }, { status: error.code === "42501" ? 403 : error.code === "22023" ? 400 : 503 });
    return NextResponse.json({ assessment: data });
  } catch (err) {
    console.error("Assessment POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    const denied = await resourceAccessError(supabase, profile?.org_id, profile?.role);
    if (denied) return denied;

    if (!profile?.org_id || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Assessment id is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.rpc("assessment_manage", {
      p_actor: user.id, p_org: profile.org_id, p_action: "delete", p_id: id,
    });
    if (error) return NextResponse.json({ error: "Assessment unavailable or could not be deleted." }, { status: error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "22P02" ? 400 : 503 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Assessment DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
