/**
 * Pure credit arithmetic - the pricing side of the AI-credit system.
 * Runtime-import free, like budget-math, so node:test can load it
 * directly and it stays testable without a database.
 *
 * The unit: 1 credit = £0.01 of retail AI usage. Retail is provider cost
 * converted to GBP and multiplied by the markup - the markup IS the
 * margin. Both knobs live in academy_settings (defaults below) so the
 * owner tunes pricing without a deploy.
 */

export interface CreditSettings {
  /** Multiplier on converted provider cost. 2.5 = 60% gross margin at face value. */
  markup: number;
  /** Fixed conversion for USD provider costs; conservative, owner-adjustable. */
  usdToGbp: number;
  /** Wallet level at which org admins get a low-balance email. */
  lowBalanceThreshold: number;
}

export const DEFAULT_CREDIT_SETTINGS: CreditSettings = {
  markup: 2.5,
  usdToGbp: 0.8,
  lowBalanceThreshold: 200,
};

/** Pence of retail value per credit: the definition of the unit. */
export const PENCE_PER_CREDIT = 1;

// Binary floats make 0.035 * 0.8 * 2.5 * 100 come out at 7.000000000000001,
// and a bare ceil would bill that as 8. Snap to a micro-pence grid first so
// FP noise never costs anyone a credit.
function ceilPence(retailPence: number): number {
  return Math.ceil(Math.round(retailPence * 1e6) / 1e6);
}

/**
 * Credits to debit for token usage whose provider cost is known in USD
 * (calculateCost in model-router). Ceil plus a floor of one credit: every
 * metered call costs something, and rounding always favours the house.
 */
export function creditsForTokenUsage(costUsd: number, settings: CreditSettings): number {
  if (!Number.isFinite(costUsd) || costUsd <= 0) return 0;
  const retailPence = costUsd * settings.usdToGbp * settings.markup * 100;
  return Math.max(1, ceilPence(retailPence / PENCE_PER_CREDIT));
}

/**
 * Credits to debit for a cost already known in GBP - feature usage, where
 * FEATURE_RAW_COSTS is GBP per unit (the caller multiplies by units). No
 * fx conversion, just markup.
 */
export function creditsForGbpCost(rawGbp: number, settings: CreditSettings): number {
  if (!Number.isFinite(rawGbp) || rawGbp <= 0) return 0;
  const retailPence = rawGbp * settings.markup * 100;
  return Math.max(1, ceilPence(retailPence / PENCE_PER_CREDIT));
}

/** Face value of a credit balance in pence, for "≈ £x.xx" displays. */
export function creditsToPence(credits: number): number {
  return credits * PENCE_PER_CREDIT;
}

/**
 * Gross margin fraction for a pack: what remains of the pack price after
 * the provider cost implied by its credits. Used by the admin portal to
 * sanity-check discounts against the floor, not by billing itself.
 */
export function packGrossMargin(
  packPricePence: number,
  packCredits: number,
  settings: CreditSettings
): number {
  if (packCredits <= 0 || packPricePence <= 0) return 0;
  // Retail pence per credit is PENCE_PER_CREDIT by definition; provider
  // cost per credit is that divided by the markup.
  const providerCostPence = (packCredits * PENCE_PER_CREDIT) / settings.markup;
  return (packPricePence - providerCostPence) / packPricePence;
}
