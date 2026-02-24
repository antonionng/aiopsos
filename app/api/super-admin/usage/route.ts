import { NextResponse } from "next/server";
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

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data: logs } = await supabaseAdmin
    .from("usage_logs")
    .select("*")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  const allLogs = logs ?? [];
  const totalRequests = allLogs.length;
  const totalTokens = allLogs.reduce((s, l) => s + (l.tokens_in || 0) + (l.tokens_out || 0), 0);
  const totalRevenue = allLogs.reduce((s, l) => s + Number(l.customer_charge || 0), 0);

  const { data: orgs } = await supabaseAdmin
    .from("organisations")
    .select("id, name");
  const orgMap = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  const orgAgg = new Map<string, { name: string; requests: number; tokens: number; spend: number }>();
  for (const l of allLogs) {
    const existing = orgAgg.get(l.org_id) ?? { name: orgMap.get(l.org_id) ?? "Unknown", requests: 0, tokens: 0, spend: 0 };
    existing.requests += 1;
    existing.tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
    existing.spend += Number(l.customer_charge || 0);
    orgAgg.set(l.org_id, existing);
  }

  const topTenants = Array.from(orgAgg.entries())
    .sort(([, a], [, b]) => b.spend - a.spend)
    .slice(0, 20)
    .map(([id, v]) => ({
      id,
      name: v.name,
      requests: v.requests,
      tokens: v.tokens,
      spend: Number(v.spend.toFixed(2)),
    }));

  const dailyMap = new Map<string, { requests: number; tokens: number; revenue: number }>();
  for (const l of allLogs) {
    const d = l.created_at.split("T")[0];
    const existing = dailyMap.get(d) ?? { requests: 0, tokens: 0, revenue: 0 };
    existing.requests += 1;
    existing.tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
    existing.revenue += Number(l.customer_charge || 0);
    dailyMap.set(d, existing);
  }

  const dailyTrend = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      requests: v.requests,
      tokens: v.tokens,
      revenue: Number(v.revenue.toFixed(2)),
    }));

  return NextResponse.json({
    summary: {
      totalRequests,
      totalTokens,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    },
    topTenants,
    dailyTrend,
  });
}
