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

  const { data: orgs } = await supabaseAdmin
    .from("organisations")
    .select("id, name, subscription_status, subscription_plan_id, seat_count, created_at");

  const { data: plans } = await supabaseAdmin
    .from("subscription_plans")
    .select("id, name, price_per_seat, currency");

  const planMap = new Map((plans ?? []).map((p) => [p.id, p]));
  const allOrgs = orgs ?? [];

  const activeOrgs = allOrgs.filter((o) => o.subscription_status === "active");
  const trialingOrgs = allOrgs.filter((o) => o.subscription_status === "trialing");
  const canceledOrgs = allOrgs.filter((o) => o.subscription_status === "canceled");

  let mrr = 0;
  const revenueByPlan: Record<string, { plan: string; mrr: number; count: number }> = {};

  for (const org of activeOrgs) {
    const plan = org.subscription_plan_id ? planMap.get(org.subscription_plan_id) : null;
    if (plan) {
      const orgMrr = plan.price_per_seat * (org.seat_count || 1);
      mrr += orgMrr;
      const key = plan.name;
      if (!revenueByPlan[key]) {
        revenueByPlan[key] = { plan: key, mrr: 0, count: 0 };
      }
      revenueByPlan[key].mrr += orgMrr;
      revenueByPlan[key].count += 1;
    }
  }

  const arr = mrr * 12;
  const churnRate = allOrgs.length > 0
    ? Number(((canceledOrgs.length / allOrgs.length) * 100).toFixed(1))
    : 0;
  const conversionRate = allOrgs.length > 0
    ? Number(((activeOrgs.length / allOrgs.length) * 100).toFixed(1))
    : 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: monthUsage } = await supabaseAdmin
    .from("usage_logs")
    .select("customer_charge")
    .gte("created_at", monthStart.toISOString());

  const usageRevenue = (monthUsage ?? []).reduce((s, l) => s + Number(l.customer_charge || 0), 0);

  return NextResponse.json({
    mrr: Number(mrr.toFixed(2)),
    arr: Number(arr.toFixed(2)),
    currency: plans?.[0]?.currency ?? "GBP",
    active_subscriptions: activeOrgs.length,
    trialing: trialingOrgs.length,
    canceled: canceledOrgs.length,
    churn_rate: churnRate,
    conversion_rate: conversionRate,
    usage_revenue: Number(usageRevenue.toFixed(2)),
    plan_breakdown: Object.values(revenueByPlan).map((p) => ({
      ...p,
      mrr: Number(p.mrr.toFixed(2)),
    })),
  });
}
