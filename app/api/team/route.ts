import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function getCallerProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role, email, name")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
}

export async function GET() {
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "manager", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: members, error } = await supabaseAdmin
    .from("user_profiles")
    .select("id, name, email, role, job_title, avatar_url, department_id, plan_override")
    .eq("org_id", caller.org_id)
    .order("name");

  if (error) {
    console.error("[team] GET failed:", error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: departments } = await supabaseAdmin
    .from("departments")
    .select("id, name")
    .eq("org_id", caller.org_id);

  const deptMap = new Map((departments ?? []).map((d) => [d.id, d.name]));

  const enriched = (members ?? []).map((m) => ({
    ...m,
    department_name: m.department_id ? deptMap.get(m.department_id) ?? null : null,
    is_self: m.id === caller.id,
  }));

  return NextResponse.json({ members: enriched, caller_role: caller.role });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "manager", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only admins and managers can invite" }, { status: 403 });
  }

  const body = await req.json();
  const { teamInviteSchema, validateBody } = await import("@/lib/validations");
  const validation = validateBody(teamInviteSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { email, name, role } = validation.data;
  const assignRole = role;

  const { data: existing } = await supabaseAdmin
    .from("user_profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
  }

  const tempPassword = crypto.randomUUID().slice(0, 16);
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name: name || email.split("@")[0] },
  });

  if (authError || !authUser.user) {
    return NextResponse.json({ error: authError?.message ?? "Failed to create user" }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
    id: authUser.user.id,
    org_id: caller.org_id,
    email,
    name: name || email.split("@")[0],
    role: assignRole,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  try {
    const { sendTeamInviteEmail } = await import("@/lib/email");
    await sendTeamInviteEmail(email, name || email.split("@")[0], caller.name || "Your team admin");
  } catch {
    // email sending is best-effort
  }

  return NextResponse.json({ success: true, user_id: authUser.user.id });
}
