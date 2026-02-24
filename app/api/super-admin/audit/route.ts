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
  const orgFilter = url.searchParams.get("org_id") || "";
  const actionFilter = url.searchParams.get("action") || "";
  const dateFrom = url.searchParams.get("from") || "";
  const dateTo = url.searchParams.get("to") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("audit_logs")
    .select("*", { count: "exact" });

  if (orgFilter) {
    query = query.eq("org_id", orgFilter);
  }
  if (actionFilter) {
    query = query.eq("action", actionFilter);
  }
  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  const { data: logs, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = [...new Set((logs ?? []).map((l) => l.user_id).filter(Boolean))];
  const orgIds = [...new Set((logs ?? []).map((l) => l.org_id).filter(Boolean))];

  const { data: users } = userIds.length
    ? await supabaseAdmin.from("user_profiles").select("id, name, email").in("id", userIds)
    : { data: [] };

  const { data: orgs } = orgIds.length
    ? await supabaseAdmin.from("organisations").select("id, name").in("id", orgIds)
    : { data: [] };

  const userMap = new Map((users ?? []).map((u) => [u.id, { name: u.name, email: u.email }]));
  const orgMap = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  const enriched = (logs ?? []).map((l) => {
    const u = l.user_id ? userMap.get(l.user_id) : null;
    return {
      id: l.id,
      timestamp: l.created_at,
      action: l.action,
      metadata: l.metadata,
      user_name: u?.name || u?.email || "System",
      user_email: u?.email || null,
      org_name: l.org_id ? orgMap.get(l.org_id) ?? "Unknown" : null,
      org_id: l.org_id,
    };
  });

  const { data: allOrgs } = await supabaseAdmin
    .from("organisations")
    .select("id, name")
    .order("name");

  const { data: actionTypes } = await supabaseAdmin
    .from("audit_logs")
    .select("action")
    .limit(500);

  const uniqueActions = [...new Set((actionTypes ?? []).map((a) => a.action))].sort();

  return NextResponse.json({
    logs: enriched,
    total: count ?? 0,
    page,
    limit,
    filters: {
      organisations: allOrgs ?? [],
      actions: uniqueActions,
    },
  });
}
