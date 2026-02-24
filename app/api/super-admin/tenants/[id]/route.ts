import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: org } = await supabaseAdmin
    .from("organisations")
    .select("*")
    .eq("id", id)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: users } = await supabaseAdmin
    .from("user_profiles")
    .select("id, name, email, role")
    .eq("org_id", id)
    .order("name");

  const { data: links } = await supabaseAdmin
    .from("assessment_links")
    .select("id, token, title, active, created_at")
    .eq("org_id", id)
    .order("created_at", { ascending: false });

  const { data: assessments } = await supabaseAdmin
    .from("assessments")
    .select("id, title, status, created_at")
    .eq("org_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    org,
    users: users ?? [],
    links: links ?? [],
    assessments: assessments ?? [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const allowed = ["name", "industry", "size", "subscription_plan_id", "seat_count", "subscription_status"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("organisations")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (body.action === "switch") {
    await supabaseAdmin
      .from("user_profiles")
      .update({ org_id: id })
      .eq("id", admin.id);

    return NextResponse.json({ success: true });
  }

  if (body.action === "suspend") {
    await supabaseAdmin
      .from("organisations")
      .update({ subscription_status: "canceled" })
      .eq("id", id);

    return NextResponse.json({ success: true });
  }

  if (body.action === "activate") {
    await supabaseAdmin
      .from("organisations")
      .update({ subscription_status: "active" })
      .eq("id", id);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
