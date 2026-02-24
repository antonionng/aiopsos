import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

export async function GET() {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: orgs } = await supabaseAdmin
    .from("organisations")
    .select("*")
    .order("name");

  const tenants = await Promise.all(
    (orgs ?? []).map(async (org) => {
      const { count: userCount } = await supabaseAdmin
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id);

      const { count: assessmentCount } = await supabaseAdmin
        .from("assessments")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id);

      const { count: linkCount } = await supabaseAdmin
        .from("assessment_links")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id);

      return {
        ...org,
        user_count: userCount ?? 0,
        assessment_count: assessmentCount ?? 0,
        link_count: linkCount ?? 0,
      };
    })
  );

  const { count: totalUsers } = await supabaseAdmin
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const stats = {
    total_tenants: tenants.length,
    active_subscriptions: tenants.filter((t) => t.subscription_status === "active").length,
    total_users: totalUsers ?? 0,
    total_seats: tenants.reduce((sum, t) => sum + (t.seat_count ?? 0), 0),
  };

  return NextResponse.json({ tenants, stats });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, industry, size, subscription_plan_id, seat_count } = body as {
    name?: string;
    industry?: string;
    size?: string;
    subscription_plan_id?: string;
    seat_count?: number;
  };

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const insertData: Record<string, unknown> = {
    name,
    industry: industry || "",
    size: size || "",
    subscription_status: "trialing",
    seat_count: seat_count ?? 5,
  };

  if (subscription_plan_id) {
    insertData.subscription_plan_id = subscription_plan_id;
  }

  const { data: org, error } = await supabaseAdmin
    .from("organisations")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ org });
}
