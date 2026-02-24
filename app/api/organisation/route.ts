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
