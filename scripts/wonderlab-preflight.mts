/** Read-only local checks. No network, personal data, payments or setting changes.
 * node --env-file=.env.local --experimental-strip-types scripts/wonderlab-preflight.mts
 * Add --target=commerce or --target=ai to inspect those configuration gates.
 */
import { existsSync, readFileSync } from "node:fs";
import { missions, bands, CONTENT_VERSION } from "../lib/wonderlab/catalog.ts";
import { narrationScripts } from "../lib/wonderlab/narration-scripts.ts";
import { inspectLaunchConfig } from "../lib/wonderlab/launch-config.ts";

const target =
  process.argv.find((a) => a.startsWith("--target="))?.slice(9) ?? "preview";
if (!["preview", "commerce", "ai"].includes(target))
  throw new Error("Use preview, commerce or ai.");
const config = inspectLaunchConfig(process.env);
const manifest = JSON.parse(
  readFileSync(
    new URL("../lib/wonderlab/narration-manifest.json", import.meta.url),
    "utf8",
  ),
);
const scripts = narrationScripts();
const catalogueReady =
  missions.length === 24 &&
  new Set(missions.map((m) => m.slug)).size === 24 &&
  Object.keys(bands).every(
    (band) => missions.filter((m) => m.band === band).length === 6,
  ) &&
  missions.every(
    (m) =>
      m.activities.length === 4 &&
      m.activities.every(
        (a) => a.intro && a.instruction && a.feedback && a.correct.length,
      ) &&
      m.project.prompt &&
      m.project.checks.length,
  );
const assetsReady =
  scripts.every(
    (s) =>
      manifest[s.id] === `/audio/wonderlab/${s.id}.mp3` &&
      existsSync(
        new URL(`../public/audio/wonderlab/${s.id}.mp3`, import.meta.url),
      ),
  ) &&
  Object.keys(bands).every((band) =>
    existsSync(
      new URL(`../public/images/wonderlab/${band}.png`, import.meta.url),
    ),
  );
const has = (key: string) => !!process.env[key]?.trim();
const stripe = process.env.STRIPE_SECRET_KEY;
const stripeMode = /^(sk|rk)_test_/.test(stripe ?? "")
  ? "test"
  : /^(sk|rk)_live_/.test(stripe ?? "")
    ? "live"
    : "missing-or-unrecognised";
const checks: Record<string, boolean> = { catalogueReady, assetsReady };
if (target === "preview")
  Object.assign(checks, {
    paidCheckoutClosed: !config.commerce,
    childGenerationClosed: !config.ai,
  });
else {
  Object.assign(
    checks,
    {
      databaseUrl: has("NEXT_PUBLIC_SUPABASE_URL"),
      databasePublicKey: has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      databaseServerKey: has("SUPABASE_SERVICE_ROLE_KEY"),
      canonicalUrl: has("NEXT_PUBLIC_APP_URL"),
    },
    target === "commerce"
      ? {
          ...config.commerceChecks,
          stripeKey: stripeMode !== "missing-or-unrecognised",
          webhookSecret: has("STRIPE_WEBHOOK_SECRET"),
        }
      : { ...config.aiChecks, providerKey: has("OPENAI_API_KEY") },
  );
}
console.log(
  JSON.stringify(
    {
      target,
      status: Object.values(checks).every(Boolean) ? "passed" : "blocked",
      contentVersion: CONTENT_VERSION,
      lessons: missions.length,
      activities: missions.reduce((n, m) => n + m.activities.length, 0),
      narrationClips: scripts.length,
      stripeMode,
      checks,
      missing: Object.keys(checks).filter((k) => !checks[k]),
      scope:
        "Configuration and packaged content only. This does not certify family testing, payment delivery, legal review or provider retention.",
    },
    null,
    2,
  ),
);
if (!Object.values(checks).every(Boolean)) process.exitCode = 1;
