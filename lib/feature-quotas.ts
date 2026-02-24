import { createClient } from "@/lib/supabase/server";
import {
  FEATURE_QUOTAS,
  FEATURE_OVERAGE_RATES,
  FEATURE_RAW_COSTS,
  USAGE_MARKUP,
  type PlanType,
  type FeatureType,
} from "@/lib/constants";

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  isOverage: boolean;
  overageCharge: number;
  requiresUpgrade: boolean;
}

export interface FeatureUsageSummary {
  voice: { used: number; limit: number; overageCharge: number };
  web_search: { used: number; limit: number; overageCharge: number };
  image_gen: { used: number; limit: number; overageCharge: number };
  deep_research: { used: number; limit: number; overageCharge: number };
}

function getStartOfMonth(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function checkFeatureQuota(
  orgId: string,
  feature: FeatureType,
  plan: PlanType,
  _seatCount: number,
  userId?: string
): Promise<QuotaCheckResult> {
  const quotaPerSeat = FEATURE_QUOTAS[plan][feature];

  if (quotaPerSeat === 0) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      isOverage: false,
      overageCharge: 0,
      requiresUpgrade: true,
    };
  }

  // Per-user quota: each user gets their own allocation
  const totalLimit = quotaPerSeat;
  const supabase = await createClient();
  const startOfMonth = getStartOfMonth();

  let query = supabase
    .from("feature_usage_logs")
    .select("units")
    .eq("org_id", orgId)
    .eq("feature", feature)
    .gte("created_at", startOfMonth);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data } = await query;

  const used = (data ?? []).reduce((sum, row) => sum + Number(row.units), 0);
  const isOverage = used >= totalLimit;
  const overageCharge = isOverage ? FEATURE_OVERAGE_RATES[feature] : 0;

  return {
    allowed: true,
    used,
    limit: totalLimit,
    isOverage,
    overageCharge,
    requiresUpgrade: false,
  };
}

export async function logFeatureUsage(
  orgId: string,
  userId: string,
  feature: FeatureType,
  units: number = 1,
  metadata: Record<string, unknown> = {}
) {
  const rawCost = FEATURE_RAW_COSTS[feature] * units;
  const customerCharge = rawCost * USAGE_MARKUP;

  const supabase = await createClient();
  await supabase.from("feature_usage_logs").insert({
    org_id: orgId,
    user_id: userId,
    feature,
    units,
    cost: rawCost,
    customer_charge: customerCharge,
    metadata,
  });
}

export async function getFeatureUsageSummary(
  orgId: string,
  plan: PlanType,
  _seatCount: number,
  userId?: string
): Promise<FeatureUsageSummary> {
  const supabase = await createClient();
  const startOfMonth = getStartOfMonth();

  let query = supabase
    .from("feature_usage_logs")
    .select("feature, units, customer_charge")
    .eq("org_id", orgId)
    .gte("created_at", startOfMonth);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data } = await query;

  const features: FeatureType[] = ["voice", "web_search", "image_gen", "deep_research"];

  const summary = {} as FeatureUsageSummary;
  for (const f of features) {
    const rows = (data ?? []).filter((r) => r.feature === f);
    const used = rows.reduce((sum, r) => sum + Number(r.units), 0);
    const limit = FEATURE_QUOTAS[plan][f];
    const overageUnits = Math.max(0, used - limit);
    const overageCharge = overageUnits * FEATURE_OVERAGE_RATES[f];
    summary[f] = { used, limit, overageCharge };
  }

  return summary;
}
