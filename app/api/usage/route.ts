import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation" }, { status: 404 });
  }

  const orgId = profile.org_id;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data: usageLogs } = await supabaseAdmin
    .from("usage_logs")
    .select("*")
    .eq("org_id", orgId)
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  const logs = usageLogs ?? [];

  const totalRequests = logs.length;
  const totalTokens = logs.reduce((s, l) => s + (l.tokens_in || 0) + (l.tokens_out || 0), 0);
  const totalCost = logs.reduce((s, l) => s + Number(l.customer_charge || l.cost || 0), 0);
  const uniqueUsers = new Set(logs.map((l) => l.user_id)).size;
  const avgDailyRequests = totalRequests > 0 ? Math.round(totalRequests / 30) : 0;

  const dailyMap = new Map<string, { requests: number; tokens: number; cost: number }>();
  for (const l of logs) {
    const d = l.created_at.split("T")[0];
    const existing = dailyMap.get(d) ?? { requests: 0, tokens: 0, cost: 0 };
    existing.requests += 1;
    existing.tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
    existing.cost += Number(l.customer_charge || l.cost || 0);
    dailyMap.set(d, existing);
  }

  const dailyUsage = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      requests: v.requests,
      tokens: v.tokens,
      cost: Number(v.cost.toFixed(2)),
    }));

  const modelMap = new Map<string, { requests: number; tokens: number; cost: number }>();
  for (const l of logs) {
    const existing = modelMap.get(l.model) ?? { requests: 0, tokens: 0, cost: 0 };
    existing.requests += 1;
    existing.tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
    existing.cost += Number(l.customer_charge || l.cost || 0);
    modelMap.set(l.model, existing);
  }

  const modelBreakdown = Array.from(modelMap.entries())
    .sort(([, a], [, b]) => b.requests - a.requests)
    .map(([model, v]) => ({
      model,
      requests: v.requests,
      tokens: v.tokens,
      cost: Number(v.cost.toFixed(2)),
      percentage: totalRequests > 0 ? Number(((v.requests / totalRequests) * 100).toFixed(1)) : 0,
    }));

  const { data: departments } = await supabaseAdmin
    .from("departments")
    .select("id, name")
    .eq("org_id", orgId);
  const deptMap = new Map((departments ?? []).map((d) => [d.id, d.name]));

  const deptAggMap = new Map<string, { requests: number; cost: number; users: Set<string> }>();
  for (const l of logs) {
    const deptName = l.department_id ? deptMap.get(l.department_id) ?? "Unknown" : "Unassigned";
    const existing = deptAggMap.get(deptName) ?? { requests: 0, cost: 0, users: new Set<string>() };
    existing.requests += 1;
    existing.cost += Number(l.customer_charge || l.cost || 0);
    existing.users.add(l.user_id);
    deptAggMap.set(deptName, existing);
  }

  const departmentBreakdown = Array.from(deptAggMap.entries())
    .sort(([, a], [, b]) => b.requests - a.requests)
    .map(([department, v]) => ({
      department,
      requests: v.requests,
      cost: Number(v.cost.toFixed(2)),
      users: v.users.size,
    }));

  const { data: recentAudit } = await supabaseAdmin
    .from("audit_logs")
    .select("id, user_id, action, metadata, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(20);

  const userIds = [...new Set((recentAudit ?? []).map((a) => a.user_id).filter(Boolean))];
  const { data: auditUsers } = userIds.length
    ? await supabaseAdmin.from("user_profiles").select("id, name, email").in("id", userIds)
    : { data: [] };
  const auditUserMap = new Map((auditUsers ?? []).map((u) => [u.id, u.name || u.email]));

  const auditLogs = (recentAudit ?? []).map((a) => ({
    id: a.id,
    user: a.user_id ? auditUserMap.get(a.user_id) ?? "Unknown" : "System",
    action: a.action,
    model: (a.metadata as Record<string, string>)?.model ?? "-",
    timestamp: a.created_at,
  }));

  return NextResponse.json({
    summary: {
      totalRequests,
      totalTokens,
      totalCost: Number(totalCost.toFixed(2)),
      activeUsers: uniqueUsers,
      avgDailyRequests,
    },
    dailyUsage,
    modelBreakdown,
    departmentBreakdown,
    auditLogs,
  });
}
