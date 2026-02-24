import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function getCallerProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("ai_policies")
    .select("*")
    .eq("id", id)
    .eq("org_id", caller.org_id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = ["admin", "super_admin"].includes(caller.role);
  if (!isAdmin && data.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ policy: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only admins can edit policies" }, { status: 403 });
  }

  const body = await req.json();
  const allowed = ["title", "content", "category", "status"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (updates.status === "published") {
    const { data: existing } = await supabaseAdmin
      .from("ai_policies")
      .select("status")
      .eq("id", id)
      .eq("org_id", caller.org_id)
      .maybeSingle();

    if (existing?.status !== "published") {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabaseAdmin
    .from("ai_policies")
    .update(updates)
    .eq("id", id)
    .eq("org_id", caller.org_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ policy: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only admins can delete policies" }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from("ai_policies")
    .delete()
    .eq("id", id)
    .eq("org_id", caller.org_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
