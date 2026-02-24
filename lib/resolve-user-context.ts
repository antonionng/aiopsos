import { createClient } from "@/lib/supabase/server";
import { PLAN_TYPES, type PlanType } from "@/lib/constants";

export interface UserContext {
  userId: string;
  orgId: string;
  /** Effective plan for this user (plan_override > org plan > trial/default). */
  plan: PlanType;
  seatCount: number;
}

export async function resolveUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, plan_override")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) return null;

  // User-level override takes priority
  if (
    profile.plan_override &&
    (PLAN_TYPES as readonly string[]).includes(profile.plan_override)
  ) {
    const { data: org } = await supabase
      .from("organisations")
      .select("seat_count")
      .eq("id", profile.org_id)
      .maybeSingle();

    return {
      userId: user.id,
      orgId: profile.org_id,
      plan: profile.plan_override as PlanType,
      seatCount: org?.seat_count ?? 5,
    };
  }

  // Fall back to org-level plan
  const { data: org } = await supabase
    .from("organisations")
    .select("subscription_plan_id, subscription_status, trial_ends_at, seat_count")
    .eq("id", profile.org_id)
    .maybeSingle();

  let plan: PlanType = "basic";
  if (org?.subscription_plan_id) {
    const { data: planRow } = await supabase
      .from("subscription_plans")
      .select("name")
      .eq("id", org.subscription_plan_id)
      .maybeSingle();
    if (planRow) plan = planRow.name as PlanType;
  } else if (
    org?.subscription_status === "trialing" &&
    org?.trial_ends_at &&
    new Date(org.trial_ends_at) > new Date()
  ) {
    plan = "pro";
  }

  return {
    userId: user.id,
    orgId: profile.org_id,
    plan,
    seatCount: org?.seat_count ?? 5,
  };
}
