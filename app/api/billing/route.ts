import { cohortMembershipGuardsEnabled } from "@/lib/workspace-rollout";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PlanType } from "@/lib/constants";
import { getFeatureUsageSummary } from "@/lib/feature-quotas";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation" }, { status: 400 });
  }

  if (cohortMembershipGuardsEnabled()) {
  const { data: access, error: accessError } = await supabase.rpc("current_workspace_access", {
    p_expected_org: profile.org_id,
    p_expected_role: profile.role,
  });
  if (accessError || access !== true) {
    return NextResponse.json({ error: "Workspace access is unavailable. Refresh or contact your administrator." }, { status: 403 });
  }

  }

  const callerRole = profile.role ?? "user";
  const isAdminRole = ["admin", "manager", "super_admin"].includes(callerRole);

  const { data: org } = await supabase
    .from("organisations")
    .select("subscription_status, subscription_plan_id, trial_ends_at, seat_count")
    .eq("id", profile.org_id)
    .single();

  let plan: PlanType = "basic";
  if (org?.subscription_plan_id) {
    const { data: planRow } = await supabase
      .from("subscription_plans")
      .select("name")
      .eq("id", org.subscription_plan_id)
      .single();
    if (planRow) plan = planRow.name as PlanType;
  } else if (org?.subscription_status === "trialing") {
    plan = "pro";
  }

  if (!isAdminRole) {
    return NextResponse.json({ plan });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageLogs } = await supabase
    .from("usage_logs")
    .select("tokens_in, tokens_out, customer_charge")
    .eq("org_id", profile.org_id)
    .gte("created_at", startOfMonth.toISOString());

  const currentMonthUsage = {
    totalRequests: usageLogs?.length ?? 0,
    totalTokens: usageLogs?.reduce((sum, l) => sum + (l.tokens_in || 0) + (l.tokens_out || 0), 0) ?? 0,
    totalCharge: usageLogs?.reduce((sum, l) => sum + Number(l.customer_charge || 0), 0) ?? 0,
  };

  const seatCount = org?.seat_count ?? 5;
  const featureUsage = await getFeatureUsageSummary(profile.org_id, plan, seatCount, user.id);

  const { count: memberCount } = await supabase
    .from("user_profiles")
    .select("id", { count: "exact", head: true })
    .eq("org_id", profile.org_id);

  // Credit system: wallet, price list, recent ledger, and - for invoice
  // orgs or anyone with history - their invoices. All RLS-scoped reads on
  // the caller's own client.
  const [{ data: wallet }, { data: packs }, { data: ledger }, { data: invoices }] =
    await Promise.all([
      supabase
        .from("credit_wallets")
        .select("balance, updated_at")
        .eq("org_id", profile.org_id)
        .maybeSingle(),
      supabase
        .from("credit_packs")
        .select("id, name, credits, price_amount, currency")
        .eq("active", true)
        .order("sort"),
      supabase
        .from("credit_ledger")
        .select("id, credits_delta, balance_after, reason, model, description, created_at")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("billing_invoices")
        .select("id, invoice_number, status, issue_date, due_date, currency, total_amount")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  const { data: orgBilling } = await supabase
    .from("organisations")
    .select("billing_method")
    .eq("id", profile.org_id)
    .single();

  let reservedCredits: number | null = 0;
  if (process.env.LEARNING_AGENT_CREDIT_HOLDS_ENABLED === "true") {
    const holds = await supabaseAdmin.from("lms_agent_credit_holds")
      .select("reserved", { count: "exact" }).eq("org_id", profile.org_id).eq("state", "held").limit(1000);
    reservedCredits = holds.error || holds.count !== holds.data?.length
      ? null : holds.data.reduce((sum, hold) => sum + hold.reserved, 0);
  }

  return NextResponse.json({
    plan,
    status: org?.subscription_status ?? "trialing",
    trialEndsAt: org?.trial_ends_at ?? null,
    seatCount,
    memberCount: memberCount ?? 0,
    currentMonthUsage,
    featureUsage,
    billingMethod: orgBilling?.billing_method ?? "card",
    creditBalance: wallet?.balance ?? null,
    reservedCredits,
    creditPacks: packs ?? [],
    creditHistory: ledger ?? [],
    invoices: invoices ?? [],
  }, { headers: { "Cache-Control": "no-store" } });
}
