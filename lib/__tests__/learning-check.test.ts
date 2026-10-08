import { test } from "node:test";
import assert from "node:assert/strict";
import { learningCheckSchema, scoreLearningCheck } from "../learning-check.ts";
import { ASSESSMENT_TEMPLATES } from "../assessment-templates.ts";
const qs = ASSESSMENT_TEMPLATES["training-needs"].questions.filter(q => q.dimension === "ai");
const answers = Object.fromEntries(qs.map(q => [q.id, 3]));
test("learning check rejects incomplete answers and ignores unselected data", () => {
  assert.throws(() => scoreLearningCheck(["ai"], {}));
  const result = scoreLearningCheck(["ai", "ai"], { ...answers, injected: 5 });
  assert.deepEqual(result.scores, [{ key: "ai", score: 3 }]);
  assert.equal("injected" in result.answers, false);
});
test("results gate requires identity and explicit capture consent but not marketing", () => {
  const payload = { request_id: "fda0cb21-faba-4fd8-bbce-b5a55ff3d5c9", name: " Test Learner ", email: "test@example.com", categories: ["ai"], answers, scope: "My own learning", capture_consent: true };
  const good = learningCheckSchema.parse(payload);
  assert.equal(good.marketing_consent, false);
  assert.equal(good.name, "Test Learner");
  assert.equal(learningCheckSchema.safeParse({ ...payload, capture_consent: false }).success, false);
  assert.equal(learningCheckSchema.safeParse({ ...payload, email: "invalid" }).success, false);
});

test("learning-check submission is reachable without an account", async () => {
  const { isPublicPath } = await import("../public-routes.ts");
  assert.equal(isPublicPath("/api/learning-check"), true);
  assert.equal(isPublicPath("/api/lms"), false);
});
