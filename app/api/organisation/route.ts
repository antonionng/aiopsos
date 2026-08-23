import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canUpdateOrganisation } from "@/lib/can-update-org";

const ORG_FIELDS =
  "id, name, industry, size, logo_url, website, description, location, founded_year, mission, products_services, tech_stack";

const EMPTY_ORG = {
  id: null,
  name: "",
  industry: "",
  size: "",
  logo_url: null,
  website: "",
  description: "",
  location: "",
  founded_year: null,
  mission: "",
  products_services: "",
  tech_stack: "",
};

export async function GET(req: NextRequest) {
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
    .maybeSingle();

  const queryOrgId = req.nextUrl.searchParams.get("org_id");
  if (profile?.role === "super_admin" && queryOrgId) {
    const { data: org, error } = await supabaseAdmin
      .from("organisations")
      .select(ORG_FIELDS)
      .eq("id", queryOrgId)
      .single();
    if (error || !org) {
      if (error) console.error("[organisation] GET by org_id failed:", error.message, error.details);
      return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    }
    return NextResponse.json({ organisation: org, can_update_organisation: true });
  }

  if (!profile?.org_id) {
    if (profile?.role === "super_admin") {
      return NextResponse.json({ organisation: EMPTY_ORG, no_tenant: true });
    }
    return NextResponse.json({ error: "No organisation" }, { status: 404 });
  }

  const { data: org, error } = await supabase
    .from("organisations")
    .select(ORG_FIELDS)
    .eq("id", profile.org_id)
    .single();

  if (error) {
    console.error("[organisation] GET failed:", error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const can_update_organisation = await canUpdateOrganisation(supabase, profile);
  return NextResponse.json({ organisation: org, can_update_organisation });
}

export async function PATCH(req: Request) {
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
    .maybeSingle();

  const body = await req.json();
  const { organisationUpdateSchema, validateBody } = await import("@/lib/validations");
  const validation = validateBody(organisationUpdateSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(validation.data)) {
    if (value !== undefined) updates[key] = value;
  }
  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const isSuperAdmin = profile?.role === "super_admin";
  let targetOrgId: string | null = null;
  if (isSuperAdmin) {
    targetOrgId = body.org_id ?? profile?.org_id ?? null;
    if (!targetOrgId)
      return NextResponse.json({ error: "No organisation specified" }, { status: 400 });
  } else {
    const canUpdate =
      profile?.org_id &&
      (await canUpdateOrganisation(supabase, profile));
    if (!canUpdate)
      return NextResponse.json(
        { error: "Only organisation admins or managers can update organisation details." },
        { status: 403 }
      );
    targetOrgId = profile!.org_id;
  }

  const client = isSuperAdmin ? supabaseAdmin : supabase;
  const { data: org, error } = await client
    .from("organisations")
    .update(updates)
    .eq("id", targetOrgId)
    .select(ORG_FIELDS)
    .single();

  if (error) {
    console.error("[organisation] PATCH failed:", error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organisation: org });
}

/**
 * Create an organisation for a user who has none.
 *
 * A profile with a null org_id was a terminal state: the hub tells them to
 * take an assessment, the assessment page says their admin has not created
 * one, and no screen anywhere could create or join an org. The DB trigger
 * and ensureProfile both mint org-less profiles, so anyone whose
 * registration died between signUp and the profile upsert landed here
 * permanently.
 *
 * Guarded to org_id IS NULL. This never moves an existing member - someone
 * mid-invite to a real organisation must not get a private one created
 * underneath them, which is also why nothing calls this automatically.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const name =
    typeof body?.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 300)
      : "My Organisation";

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, email, name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.org_id) {
    return NextResponse.json(
      { error: "You already belong to an organisation" },
      { status: 409 }
    );
  }

  const { data: org, error: orgError } = await supabaseAdmin
    .from("organisations")
    .insert({ name })
    .select("id, name")
    .single();

  if (orgError || !org) {
    return NextResponse.json(
      { error: orgError?.message ?? "Could not create organisation" },
      { status: 500 }
    );
  }

  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .upsert({
      id: user.id,
      org_id: org.id,
      email: profile?.email ?? user.email ?? "",
      name: profile?.name ?? (user.user_metadata?.name as string | undefined) ?? "",
      role: "admin",
    });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await supabaseAdmin
    .from("organisations")
    .update({ owner_id: user.id })
    .eq("id", org.id);

  return NextResponse.json({ organisation: org }, { status: 201 });
}
