import { readRate } from "./generation-rules.ts";

/** Configuration checks only. Recorded reviews are still required before launch. */
export function inspectLaunchConfig(env: Record<string, string | undefined>) {
  const has = (key: string) => !!env[key]?.trim();
  const enabled = (key: string) => env[key] === "true";
  const commerceChecks = {
    launchReviewed: enabled("WONDERLAB_LAUNCH_REVIEWED"),
    membershipReviewed: enabled("WONDERLAB_MEMBERSHIP_REVIEWED"),
    termsVersion: has("WONDERLAB_TERMS_VERSION"),
    commerceEnabled: enabled("WONDERLAB_COMMERCE_ENABLED"),
  };
  const aiChecks = {
    launchReviewed: enabled("WONDERLAB_LAUNCH_REVIEWED"),
    aiEnabled: enabled("WONDERLAB_AI_ENABLED"),
    retentionVerified: enabled("WONDERLAB_ZERO_RETENTION_VERIFIED"),
    model: has("WONDERLAB_AI_MODEL"),
    inputRate: readRate(env.WONDERLAB_AI_INPUT_USD_PER_MILLION) !== null,
    outputRate: readRate(env.WONDERLAB_AI_OUTPUT_USD_PER_MILLION) !== null,
  };
  return {
    commerceChecks,
    aiChecks,
    commerce: Object.values(commerceChecks).every(Boolean),
    ai: Object.values(aiChecks).every(Boolean),
    terms: env.WONDERLAB_TERMS_VERSION?.trim() || null,
  };
}
