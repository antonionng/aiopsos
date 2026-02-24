import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

  return NextResponse.json({
    plan,
    status: org?.subscription_status ?? "trialing",
    trialEndsAt: org?.trial_ends_at ?? null,
    seatCount,
    memberCount: memberCount ?? 0,
    currentMonthUsage,
    featureUsage,
  });
}
