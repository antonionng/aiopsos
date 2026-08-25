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
    .select("customer_charge, cost")
    .gte("created_at", monthStart.toISOString());

  const usageRevenue = (monthUsage ?? []).reduce((s, l) => s + Number(l.customer_charge || 0), 0);

  // The money that actually moves now: credit-pack sales (Mooov, captured),
  // cohort payments, invoice pipeline, and realised credit margin - what
  // usage debited at face value versus what the providers billed us.
  const [
    { data: monthPayments },
    { data: openInvoices },
    { data: paidInvoices },
    { data: monthDebits },
    { data: fxRow },
  ] = await Promise.all([
    supabaseAdmin
      .from("mooov_payments")
      .select("amount, purpose")
      .eq("status", "captured")
      .gte("captured_at", monthStart.toISOString()),
    supabaseAdmin
      .from("billing_invoices")
      .select("total_amount, status")
      .in("status", ["sent", "overdue"]),
    supabaseAdmin
      .from("billing_invoices")
      .select("total_amount")
      .eq("status", "paid")
      .gte("paid_at", monthStart.toISOString()),
    supabaseAdmin
      .from("credit_ledger")
      .select("credits_delta")
      .eq("reason", "usage")
      .gte("created_at", monthStart.toISOString()),
    supabaseAdmin.from("academy_settings").select("value").eq("key", "usd_to_gbp").maybeSingle(),
  ]);

  const packSalesPence = (monthPayments ?? [])
    .filter((p) => p.purpose === "credit_pack")
    .reduce((s, p) => s + p.amount, 0);
  const cohortSalesPence = (monthPayments ?? [])
    .filter((p) => p.purpose === "cohort")
    .reduce((s, p) => s + p.amount, 0);
  const invoicesOutstandingPence = (openInvoices ?? []).reduce((s, i) => s + i.total_amount, 0);
  const invoicesOverduePence = (openInvoices ?? [])
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + i.total_amount, 0);
  const invoicesPaidPence = (paidInvoices ?? []).reduce((s, i) => s + i.total_amount, 0);

  const usdToGbp = Number(fxRow?.value) || 0.8;
  // Debits are negative deltas; face value is 1p per credit.
  const creditsUsedFacePence = (monthDebits ?? []).reduce(
    (s, row) => s + Math.max(0, -row.credits_delta),
    0
  );
  const providerCostGbp =
    (monthUsage ?? []).reduce((s, l) => s + Number(l.cost || 0), 0) * usdToGbp;
  const creditMarginPence = creditsUsedFacePence - Math.round(providerCostGbp * 100);

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
    credit_pack_sales: Number((packSalesPence / 100).toFixed(2)),
    cohort_sales: Number((cohortSalesPence / 100).toFixed(2)),
    invoices_outstanding: Number((invoicesOutstandingPence / 100).toFixed(2)),
    invoices_overdue: Number((invoicesOverduePence / 100).toFixed(2)),
    invoices_paid_this_month: Number((invoicesPaidPence / 100).toFixed(2)),
    credits_used_face_value: Number((creditsUsedFacePence / 100).toFixed(2)),
    credit_margin: Number((creditMarginPence / 100).toFixed(2)),
  });
}
