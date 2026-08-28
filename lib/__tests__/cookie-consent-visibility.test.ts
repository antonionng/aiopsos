import { test } from "node:test";
import assert from "node:assert/strict";

import { shouldShowCookieBanner } from "../cookie-consent-visibility.ts";

test("shows on public pages when no choice has been stored", () => {
  assert.equal(shouldShowCookieBanner("/", null), true);
  assert.equal(shouldShowCookieBanner("/pricing", null), true);
  assert.equal(shouldShowCookieBanner("/login", null), true);
  assert.equal(shouldShowCookieBanner("/shared/abc123", null), true);
});

test("never shows inside the signed-in app", () => {
  // It is fixed to the bottom of the viewport and would cover the chat
  // composer's send button.
  assert.equal(shouldShowCookieBanner("/dashboard", null), false);
  assert.equal(shouldShowCookieBanner("/dashboard/chat", null), false);
  assert.equal(shouldShowCookieBanner("/dashboard/billing", null), false);
});

test("a stored choice suppresses it everywhere", () => {
  assert.equal(shouldShowCookieBanner("/", "all"), false);
  assert.equal(shouldShowCookieBanner("/", "essential"), false);
});

test("a route that merely mentions dashboard is still public", () => {
  assert.equal(shouldShowCookieBanner("/insights/dashboard-metrics", null), true);
});
