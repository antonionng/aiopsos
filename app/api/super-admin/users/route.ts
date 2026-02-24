import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireSuperAdmin() {
  const supabase = await createClient();
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

export async function GET(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const roleFilter = url.searchParams.get("role") || "";
  const orgFilter = url.searchParams.get("org_id") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = (page - 1) * limit;

  // Fetch all orgs for the filter dropdown
  const { data: allOrgs } = await supabaseAdmin
    .from("organisations")
    .select("id, name")
    .order("name");

  const baseQuery = (columns: string, opts?: { count?: "exact"; head?: boolean }) => {
    let q = supabaseAdmin.from("user_profiles").select(columns, opts);
    if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    if (roleFilter) q = q.eq("role", roleFilter);
    if (orgFilter) q = q.eq("org_id", orgFilter);
    return q;
  };

  const { count, error: countError } = await baseQuery("id", { count: "exact", head: true });

  if (countError) {
    console.error("[super-admin/users] count failed:", countError.message);
    return NextResponse.json(
      { error: "Failed to load users.", detail: countError.message },
      { status: 500 }
    );
  }

  const fullColumns = "id, name, email, role, org_id, job_title, avatar_url, plan_override";
  const minimalColumns = "id, name, email, role, org_id";

  let users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    org_id: string | null;
    job_title?: string | null;
    avatar_url?: string | null;
    plan_override?: string | null;
  }> = [];

  const { data: fullData, error: fullError } = await baseQuery(fullColumns)
    .order("name")
    .range(offset, offset + limit - 1);

  if (fullError) {
    console.warn("[super-admin/users] full select failed, falling back to minimal:", fullError.message);
    const { data: minimalData, error: minimalError } = await baseQuery(minimalColumns)
      .order("name")
      .range(offset, offset + limit - 1);
    if (minimalError) {
      console.error("[super-admin/users] minimal query failed:", minimalError.message);
      return NextResponse.json(
        { error: "Failed to load users.", detail: minimalError.message },
        { status: 500 }
      );
    }
    users = ((minimalData ?? []) as unknown as Record<string, unknown>[]).map((u) => ({
      id: u.id as string,
      name: (u.name as string) ?? null,
      email: u.email as string,
      role: u.role as string,
      org_id: (u.org_id as string) ?? null,
      job_title: null,
      avatar_url: null,
      plan_override: null,
    }));
  } else {
    users = (fullData ?? []) as unknown as typeof users;
  }

  const orgMap = new Map((allOrgs ?? []).map((o) => [o.id, o.name]));

  const enriched = users.map((u) => ({
    ...u,
    org_name: u.org_id ? orgMap.get(u.org_id) ?? null : null,
  }));

  console.log("[super-admin/users] returning", enriched.length, "users, total:", count);

  return NextResponse.json({
    users: enriched,
    organisations: allOrgs ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
