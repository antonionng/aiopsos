import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateCost, calculateCustomerCharge } from "@/lib/model-router";
import { getCreditSettings, debitCredits } from "@/lib/credits";
import { creditsForTokenUsage } from "@/lib/credit-math";

/**
 * One call to log a token-based AI request and debit the org wallet -
 * for routes outside the chat streaming path (policy generation,
 * conversation titles, and whatever ships next). Chat has its own inline
 * version because it also links the message rows.
 *
 * Never throws: metering must not break the response the user already
 * has. A failed write is logged and the ledger shows the gap.
 */
export async function meterTokenUsage(params: {
  orgId: string;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  endpoint: string;
  description?: string;
}): Promise<void> {
  try {
    const rawCost = calculateCost(params.model, params.inputTokens, params.outputTokens);

    const { data: usageRow, error } = await supabaseAdmin
      .from("usage_logs")
      .insert({
        org_id: params.orgId,
        user_id: params.userId,
        model: params.model,
        tokens_in: params.inputTokens,
        tokens_out: params.outputTokens,
        cost: rawCost,
        customer_charge: calculateCustomerCharge(rawCost),
        endpoint: params.endpoint,
      })
      .select("id")
      .maybeSingle();
    if (error) {
      console.error(`meterTokenUsage log failed (${params.endpoint}):`, error.message);
    }

    if (rawCost > 0) {
      const settings = await getCreditSettings();
      await debitCredits(params.orgId, creditsForTokenUsage(rawCost, settings), {
        usageLogId: usageRow?.id,
        model: params.model,
        description: params.description ?? params.endpoint,
        userId: params.userId,
      });
    }
  } catch (err) {
    console.error(`meterTokenUsage failed (${params.endpoint}):`, err);
  }
}
