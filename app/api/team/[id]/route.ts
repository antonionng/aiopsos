import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function getCallerProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
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
    return NextResponse.json({ error: "Only admins can change roles" }, { status: 403 });
  }

  const { data: target } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", id)
    .maybeSingle();

  if (!target || target.org_id !== caller.org_id) {
    return NextResponse.json({ error: "User not found in your organisation" }, { status: 404 });
  }

  if (target.role === "super_admin") {
    return NextResponse.json({ error: "Cannot modify super admin" }, { status: 403 });
  }

  const body = await req.json();
  const { role, department_id, plan_override } = body as {
    role?: string;
    department_id?: string | null;
    plan_override?: string | null;
  };

  const VALID_PLANS = ["basic", "pro", "enterprise"];

  const updates: Record<string, unknown> = {};
  if (role && ["admin", "manager", "user"].includes(role)) {
    updates.role = role;
  }
  if (department_id !== undefined) {
    updates.department_id = department_id;
  }
  if (plan_override !== undefined) {
    updates.plan_override =
      plan_override && VALID_PLANS.includes(plan_override) ? plan_override : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
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
    return NextResponse.json({ error: "Only admins can remove members" }, { status: 403 });
  }

  if (id === caller.id) {
    return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
  }

  const { data: target } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", id)
    .maybeSingle();

  if (!target || target.org_id !== caller.org_id) {
    return NextResponse.json({ error: "User not found in your organisation" }, { status: 404 });
  }

  if (target.role === "super_admin") {
    return NextResponse.json({ error: "Cannot remove super admin" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
