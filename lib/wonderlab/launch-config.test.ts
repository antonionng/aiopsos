import { test } from "node:test";
import assert from "node:assert/strict";
import { inspectLaunchConfig } from "./launch-config.ts";

test("launch defaults are closed and every required approval is enforced independently", () => {
  assert.equal(inspectLaunchConfig({}).commerce, false);
  assert.equal(inspectLaunchConfig({}).ai, false);
  const ready = {
    WONDERLAB_LAUNCH_REVIEWED: "true",
    WONDERLAB_MEMBERSHIP_REVIEWED: "true",
    WONDERLAB_TERMS_VERSION: "reviewed-version",
    WONDERLAB_COMMERCE_ENABLED: "true",
    WONDERLAB_AI_ENABLED: "true",
    WONDERLAB_ZERO_RETENTION_VERIFIED: "true",
    WONDERLAB_AI_MODEL: "reviewed-model",
    WONDERLAB_AI_INPUT_USD_PER_MILLION: "2",
    WONDERLAB_AI_OUTPUT_USD_PER_MILLION: "8",
  };
  assert.equal(inspectLaunchConfig(ready).commerce, true);
  assert.equal(inspectLaunchConfig(ready).ai, true);
  for (const key of Object.keys(ready)) {
    const result = inspectLaunchConfig({ ...ready, [key]: "  " });
    assert.equal(result.commerce && result.ai, false, key);
  }
  assert.equal(
    inspectLaunchConfig({ ...ready, WONDERLAB_LAUNCH_REVIEWED: "TRUE" })
      .commerce,
    false,
  );
  assert.equal(
    inspectLaunchConfig({
      ...ready,
      WONDERLAB_AI_INPUT_USD_PER_MILLION: "Infinity",
    }).ai,
    false,
  );
});
