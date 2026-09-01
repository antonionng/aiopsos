import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isAuthPath,
  isPublicPath,
  isSessionGatedPath,
} from "../public-routes.ts";

test("Insights and blog are public so Google does not hit /login", () => {
  assert.equal(isPublicPath("/insights"), true);
  assert.equal(isPublicPath("/insights/eu-ai-act-article-4-literacy-for-ld"), true);
  assert.equal(isPublicPath("/insights/how-to-commission-workforce-ai-training"), true);
  assert.equal(isPublicPath("/insights/unused-ai-licences-training-gap"), true);
  assert.equal(isPublicPath("/insights/ai-output-verification-at-work"), true);
  assert.equal(isPublicPath("/insights/robotics-training-is-an-ops-problem"), true);
  assert.equal(isPublicPath("/insights/what-ai-literacy-actually-means-at-work"), true);
  assert.equal(isPublicPath("/insights/technology-judgement-for-nontechnical-directors"), true);
  assert.equal(isPublicPath("/blog"), true);
  assert.equal(isPublicPath("/blog/anything"), true);
  assert.equal(isSessionGatedPath("/blog"), false);
  assert.equal(isSessionGatedPath("/blog/anything"), false);
});

test("contact is a public marketing page so LinkedIn and Google can use the URL", () => {
  assert.equal(isPublicPath("/contact"), true);
  assert.equal(isPublicPath("/api/contact"), true);
  assert.equal(isSessionGatedPath("/contact"), false);
});

test("use cases are public marketing pages", () => {
  assert.equal(isPublicPath("/use-cases"), true);
  assert.equal(isPublicPath("/use-cases/enterprise"), true);
  assert.equal(isPublicPath("/use-cases/finance"), true);
});

test("money pages are public so they do not 307 to /login", () => {
  assert.equal(isPublicPath("/ai-literacy-training"), true);
  assert.equal(isPublicPath("/ai-readiness-assessment"), true);
});

test("the endpoints that create a session are reachable without one", () => {
  // Each of these 307'd to /login in production, which is what surfaced as
  // "Registration failed (405)" on the homepage CTA.
  assert.equal(isPublicPath("/api/auth/register"), true);
  assert.equal(isPublicPath("/api/auth/forgot"), true);
  assert.equal(isPublicPath("/api/contact"), true);
  assert.equal(isPublicPath("/auth/callback"), true);
  assert.equal(isPublicPath("/auth/callback/"), true);
});

test("the Mooov webhook is reachable by Mooov's servers", () => {
  // Signature-authenticated, not session-authenticated. A 307 to /login
  // here means payments never confirm.
  assert.equal(isPublicPath("/api/mooov/webhook"), true);
});

test("social cards are crawlable without a session", () => {
  // Next serves the root card at /opengraph-image plus a build suffix.
  assert.equal(isPublicPath("/opengraph-image"), true);
  assert.equal(isPublicPath("/opengraph-image-abc123"), true);
});

test("private app routes stay gated", () => {
  assert.equal(isPublicPath("/dashboard"), false);
  assert.equal(isPublicPath("/dashboard/enquiries"), false);
  assert.equal(isPublicPath("/api/ai-policies/abc"), false);
  assert.equal(isAuthPath("/login"), true);
  assert.equal(isAuthPath("/insights"), false);
  assert.equal(isSessionGatedPath("/dashboard"), true);
  assert.equal(isSessionGatedPath("/api/chat"), true);
  assert.equal(isSessionGatedPath("/ai-literacy-training"), false);
  assert.equal(isSessionGatedPath("/free-trial"), false);
  assert.equal(isSessionGatedPath("/academy"), false);
  assert.equal(isSessionGatedPath("/pricing"), false);
  assert.equal(isSessionGatedPath("/enterprise"), false);
  assert.equal(isSessionGatedPath("/programmes/ai-literacy"), false);
});
