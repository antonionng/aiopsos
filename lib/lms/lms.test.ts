import { test } from "node:test";
import assert from "node:assert/strict";
import { commandSchema, courseContentSchema } from "./schema.ts";
import { completionCount } from "./progress.ts";
import { isPublicPath } from "../public-routes.ts";
const id = "f71ee049-3ad3-4b83-94cc-45f27651ab9f";
const quiz = {
  id,
  title: "Check a source",
  kind: "quiz",
  content: "Which is a source?",
  minutes: 5,
  options: ["A primary document", "A guess"],
  correctOption: 0,
  criteria: "",
};
const course = {
  title: "Verify AI outputs",
  summary: "Build a checking routine",
  category: "ai",
  outcomes: ["Check a claim against its source"],
  activities: [quiz],
};
test("unpublished invalid quiz keys cannot be saved", () => {
  assert.equal(
    courseContentSchema.safeParse({
      ...course,
      activities: [{ ...quiz, correctOption: 2 }],
    }).success,
    false,
  );
  assert.equal(courseContentSchema.safeParse(course).success, true);
});
test("practical learning needs review criteria and unique activity identities", () => {
  assert.equal(
    courseContentSchema.safeParse({
      ...course,
      activities: [{ ...quiz, kind: "practice" }],
    }).success,
    false,
  );
  assert.equal(
    courseContentSchema.safeParse({ ...course, activities: [quiz, quiz] })
      .success,
    false,
  );
});
test("learner commands cannot supply grades or actor identity", () => {
  const parsed = commandSchema.parse({
    action: "learning.submit",
    payload: {
      id,
      activity_id: id,
      answer: "Work",
      state: "passed",
      reviewed_by: id,
    },
    actorId: id,
  });
  assert.equal("state" in parsed.payload, false);
  assert.equal("actorId" in parsed, false);
});
test("completion only counts passed assigned activities, not submitted evidence or unrelated progress", () => {
  assert.deepEqual(
    completionCount(
      [{ id: "one" }, { id: "two" }],
      [
        { activity_id: "one", state: "submitted" },
        { activity_id: "two", state: "passed" },
        { activity_id: "foreign", state: "passed" },
      ],
    ),
    { done: 1, total: 2 },
  );
});
test("the learning check is public while workspace and agent commands stay private", () => {
  assert.equal(isPublicPath("/assessment/start"), true);
  assert.equal(isPublicPath("/api/lms"), false);
  assert.equal(isPublicPath("/api/lms/agents/task/run"), false);
  assert.equal(isPublicPath("/dashboard/learning"), false);
});
