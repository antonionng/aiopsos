import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  DEFAULT_CREDIT_SETTINGS,
  type CreditSettings,
} from "@/lib/credit-math";

/**
 * Org credit wallet - the collection side of the AI-credit system.
 *
 * Philosophy matches lib/cost-ceiling.ts, which stays in place as the
 * per-user abuse guard: the wallet check is a spend control, not a
 * security boundary. It fails open on query error, and the pre-flight
 * check plus post-hoc debit admits bounded negative drift under
 * concurrency - visible in the ledger, accepted rather than engineered
 * away with locks on every chat request.
 */

let settingsCache: { value: CreditSettings; fetchedAt: number } | null = null;
const SETTINGS_TTL_MS = 60_000;

export async function getCreditSettings(): Promise<CreditSettings> {
  if (settingsCache && Date.now() - settingsCache.fetchedAt < SETTINGS_TTL_MS) {
    return settingsCache.value;
  }

  const { data, error } = await supabaseAdmin
    .from("academy_settings")
    .select("key, value")
    .in("key", ["ai_credit_markup", "usd_to_gbp", "low_balance_threshold_credits"]);

  if (error || !data) {
    console.error("getCreditSettings failed, using defaults:", error?.message);
    return DEFAULT_CREDIT_SETTINGS;
  }

  const byKey = new Map(data.map((row) => [row.key, row.value]));
  const settings: CreditSettings = {
    markup: Number(byKey.get("ai_credit_markup")) || DEFAULT_CREDIT_SETTINGS.markup,
    usdToGbp: Number(byKey.get("usd_to_gbp")) || DEFAULT_CREDIT_SETTINGS.usdToGbp,
    lowBalanceThreshold:
      Number(byKey.get("low_balance_threshold_credits")) ||
      DEFAULT_CREDIT_SETTINGS.lowBalanceThreshold,
  };

  settingsCache = { value: settings, fetchedAt: Date.now() };
  return settings;
}

export type CreditCheck = { allowed: boolean; balance: number };

/**
 * Pre-flight: may this org start a metered AI request? Blocks only at
 * zero or below - not on an estimate of the request's cost - so a nearly
 * empty wallet still completes its last request and drifts slightly
 * negative, which the ledger records honestly.
 *
 * An org with no wallet row has never bought credits; during rollout that
 * means "allowed" would brick every existing customer, so absence of a
 * wallet fails open. Orgs enter the credit system on first purchase.
 */
export async function checkOrgCredits(orgId: string): Promise<CreditCheck> {
  const { data, error } = await supabaseAdmin
    .from("credit_wallets")
    .select("balance")
    .eq("org_id", orgId)
    .maybeSingle();

  if (error) {
    console.error("checkOrgCredits query failed:", error.message);
    return { allowed: true, balance: 0 };
  }

  if (!data) return { allowed: true, balance: 0 };

  return { allowed: data.balance > 0, balance: data.balance };
}

/**
 * Post-hoc debit, called from the same completion paths that write
 * usage_logs / feature_usage_logs. Never throws - a failed debit must not
 * break the response the user already received.
 */
export async function debitCredits(
  orgId: string,
  credits: number,
  refs: {
    usageLogId?: string;
    featureUsageLogId?: string;
    model?: string;
    description?: string;
    userId?: string;
  }
): Promise<void> {
  if (credits <= 0) return;
  try {
    const { data: newBalance, error } = await supabaseAdmin.rpc("academy_apply_credit_delta", {
      p_org: orgId,
      p_delta: -credits,
      p_reason: "usage",
      p_usage_log: refs.usageLogId ?? null,
      p_feature_log: refs.featureUsageLogId ?? null,
      p_model: refs.model ?? null,
      p_description: refs.description ?? null,
      p_created_by: refs.userId ?? null,
    });
    if (error) {
      console.error("debitCredits failed:", error.message);
      return;
    }

    // One notice per crossing: exactly the debit that takes the balance
    // from above the threshold to at-or-below it triggers the email.
    const settings = await getCreditSettings();
    const threshold = settings.lowBalanceThreshold;
    const balanceAfter = Number(newBalance);
    if (
      Number.isFinite(balanceAfter) &&
      balanceAfter <= threshold &&
      balanceAfter + credits > threshold
    ) {
      const { sendLowCreditsEmail } = await import("@/lib/email");
      await sendLowCreditsEmail(orgId, balanceAfter);
    }
  } catch (err) {
    console.error("debitCredits failed:", err);
  }
}
