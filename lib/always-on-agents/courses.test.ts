import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { agentCourseBlueprints } from "./catalogue.ts";
import { getAgentCoursePack, exportAgentCourseNotes } from "./courses.ts";
import { courseContentSchema } from "../lms/schema.ts";

test("all 13 courses produce valid LMS packs with six complete instructional sequences", () => {
  assert.equal(agentCourseBlueprints.length, 13);
  const identities = new Set<string>();
  for (const blueprint of agentCourseBlueprints) {
    const pack = getAgentCoursePack(blueprint.slug)!;
    assert(pack, blueprint.slug);
    assert(courseContentSchema.safeParse(pack.content).success, blueprint.slug);
    assert.equal(pack.modules.length, 6);
    assert.equal(pack.content.activities.length, 36);
    assert.equal(pack.minutes, 465);
    for (const courseModule of pack.modules) {
      assert.deepEqual(
        courseModule.activities.map((a) => a.kind),
        ["lesson", "lesson", "lesson", "quiz", "practice", "practice"],
      );
      assert.equal(
        courseModule.decision.choices.filter((c) => c.best).length,
        1,
      );
      assert(
        courseModule.decision.choices.every((c) => c.feedback.length > 35),
      );
      const quiz = courseModule.activities[3];
      assert.equal(
        quiz.correctOption,
        courseModule.decision.choices.findIndex((c) => c.best),
      );
      assert.deepEqual(
        quiz.options,
        courseModule.decision.choices.map((c) => c.text),
      );
      assert(courseModule.expected.length > 30);
      assert(
        existsSync(resolve("public", courseModule.image.slice(1))),
        courseModule.image,
      );
      assert(
        courseModule.activities[4].materials?.some(
          (m) => m.kind === "lab_guide",
        ),
      );
    }
    for (const activity of pack.content.activities) {
      assert(
        !identities.has(activity.id),
        "Activity IDs must differ between courses",
      );
      identities.add(activity.id);
    }
    assert(
      pack.resources.some(
        (r) => r.kind === "lab_guide" && r.content.length > 800,
      ),
    );
    assert(pack.resources[2].content.includes("EVERY area"));
  }
  assert.equal(identities.size, 468);
});
test("exports preserve learner evidence and stable versioned identities without issuing a certificate", () => {
  const first = getAgentCoursePack("always-on-agent-foundations")!;
  const second = getAgentCoursePack("always-on-agent-foundations")!;
  assert.deepEqual(
    first.content.activities.map((a) => a.id),
    second.content.activities.map((a) => a.id),
  );
  const notes = exportAgentCourseNotes(first, {
    [first.content.activities[4].id]:
      "I checked P101 against the dated tracker.",
  });
  assert(notes.includes("I checked P101 against the dated tracker."));
  assert(
    notes.includes("simulation cannot validate") ||
      notes.includes("simulated workflow cannot validate"),
  );
  assert(notes.includes("does not submit work"));
  assert.equal(getAgentCoursePack("unknown-course"), null);
});
