import { test } from "node:test";
import assert from "node:assert/strict";

import { isAuthPath, isPublicPath } from "../public-routes.ts";

test("Insights and blog are public so Google does not hit /login", () => {
  assert.equal(isPublicPath("/insights"), true);
  assert.equal(isPublicPath("/insights/eu-ai-act-article-4-literacy-for-ld"), true);
  assert.equal(isPublicPath("/insights/how-to-commission-workforce-ai-training"), true);
  assert.equal(isPublicPath("/insights/unused-ai-licences-training-gap"), true);
  assert.equal(isPublicPath("/insights/ai-output-verification-at-work"), true);
  assert.equal(isPublicPath("/insights/robotics-training-is-an-ops-problem"), true);
  assert.equal(isPublicPath("/blog"), true);
  assert.equal(isPublicPath("/blog/anything"), true);
});

test("private app routes stay gated", () => {
  assert.equal(isPublicPath("/dashboard"), false);
  assert.equal(isPublicPath("/dashboard/enquiries"), false);
  assert.equal(isPublicPath("/api/ai-policies/abc"), false);
  assert.equal(isAuthPath("/login"), true);
  assert.equal(isAuthPath("/insights"), false);
});
