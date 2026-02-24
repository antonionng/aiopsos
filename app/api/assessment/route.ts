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
    .select("org_id")
    .eq("id", user.id)
    .single();

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

    if (!profile?.org_id || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { assessmentCreateSchema, validateBody } = await import("@/lib/validations");
    const validation = validateBody(assessmentCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const row: Record<string, string> = {
      org_id: profile.org_id,
      created_by: user.id,
      title: validation.data.title,
      template_id: validation.data.template_id,
      status: "active",
    };

    let { data, error } = await supabaseAdmin
      .from("assessments")
      .insert(row)
      .select()
      .single();

    if (error?.code === "PGRST204") {
      console.warn("template_id column missing — retrying without it. Run migration 010_templates_and_rls.sql to fix.");
      const { template_id: _, ...rowWithout } = row;
      ({ data, error } = await supabaseAdmin
        .from("assessments")
        .insert(rowWithout)
        .select()
        .single());
    }

    if (error) {
      console.error("Assessment insert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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

    if (!profile?.org_id || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Assessment id is required" }, { status: 400 });
    }

    const { data: assessment } = await supabaseAdmin
      .from("assessments")
      .select("id")
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .maybeSingle();

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("assessments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Assessment delete failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Assessment DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
