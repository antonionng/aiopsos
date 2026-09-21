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

  if (!profile?.org_id) return null;
  const { data: access, error } = await supabase.rpc("current_workspace_access", {
    p_expected_org: profile.org_id, p_expected_role: profile.role,
  });
  return !error && access === true ? profile : null;
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

  const { data: organisation, error: orgError } = await supabaseAdmin.from("organisations").select("owner_id").eq("id", caller.org_id).single();
  if (orgError) return NextResponse.json({ error: "Workspace ownership could not be loaded." }, { status: 503 });

  const deptMap = new Map((departments ?? []).map((d) => [d.id, d.name]));

  const enriched = (members ?? []).map((m) => ({
    ...m,
    department_name: m.department_id ? deptMap.get(m.department_id) ?? null : null,
    is_self: m.id === caller.id,
    is_owner: m.id === organisation.owner_id,
  }));

  return NextResponse.json({ members: enriched, caller_role: caller.role, can_transfer_ownership: organisation.owner_id === caller.id || caller.role === "super_admin" }, { headers: { "Cache-Control": "no-store" } });
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

  const body = await req.json().catch(() => null);
  const { teamInviteSchema, validateBody } = await import("@/lib/validations");
  const validation = validateBody(teamInviteSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { email: suppliedEmail, name, role } = validation.data;
  const email = suppliedEmail.trim().toLowerCase();
  if (caller.role === "manager" && role !== "user") {
    return NextResponse.json({ error: "Managers can invite learners. An administrator must grant elevated roles." }, { status: 403 });
  }
  const assignRole = role;

  const { rateLimit } = await import("@/lib/rate-limit");
  if (!rateLimit(`team-invite:${caller.id}`, { limit: 10, windowMs: 60000 }).success) {
    return NextResponse.json({ error: "Please wait before inviting more people." }, { status: 429 });
  }
  const reservationId = crypto.randomUUID();
  const { error: reservationError } = await supabaseAdmin.rpc("reserve_team_invitation", {
    p_actor: caller.id, p_org: caller.org_id, p_email: email, p_role: assignRole, p_reservation: reservationId,
  });
  if (reservationError) return NextResponse.json({ error: reservationError.message }, { status: reservationError.code === "42501" ? 403 : 409 });
  let claimedId: string | null = null;
  try {
    // No default email is sent. Existing confirmed identities are never changed.
    const { data: invitation, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite", email, options: { data: { name: name || email.split("@")[0] } },
    });
    if (inviteError || !invitation?.user || !invitation.properties?.hashed_token || invitation.user.email_confirmed_at) {
      return NextResponse.json({ error: "This account cannot be invited here. It may already be registered." }, { status: 409 });
    }
    // The auth trigger creates the profile. Claim it only while unassigned;
    // another workspace or a concurrent signup must never be overwritten.
    const { data: claimed, error: profileError } = await supabaseAdmin.from("user_profiles").update({
      org_id: caller.org_id, name: name || email.split("@")[0], role: assignRole,
    }).eq("id", invitation.user.id).is("org_id", null).select("id").maybeSingle();
    if (profileError || !claimed) return NextResponse.json({ error: "This account already has workspace access. Its membership was not changed." }, { status: 409 });
    claimedId = claimed.id;
    const { data: access, error: accessError } = await supabase.rpc("current_workspace_access", {
      p_expected_org: caller.org_id, p_expected_role: caller.role,
    });
    if (accessError || access !== true) throw new Error("Workspace access changed");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const inviteUrl = `${baseUrl}/accept-invite#token=${encodeURIComponent(invitation.properties.hashed_token)}&workspace=${caller.org_id}`;
    const { sendTeamInviteEmail } = await import("@/lib/email");
    await sendTeamInviteEmail(email, name || email.split("@")[0], caller.name || "Your team admin", inviteUrl);
    return NextResponse.json({ success: true, user_id: claimedId, invitation_status: "pending" });
  } catch {
    // Preserve identity even when delivery fails. Detach only our claimed profile.
    if (claimedId) {
      const { error } = await supabaseAdmin.from("user_profiles").update({ org_id: null, department_id: null, role: "user" }).eq("id", claimedId).eq("org_id", caller.org_id);
      if (error) console.error("Pending invitation detachment failed", { userId: claimedId });
    }
    return NextResponse.json({ error: "The invitation could not be sent. Please try again or contact support." }, { status: 503 });
  } finally {
    const { error } = await supabaseAdmin.from("team_invitation_reservations").delete().eq("email", email).eq("reservation_id", reservationId);
    if (error) console.error("Invitation reservation release failed");
  }
}
