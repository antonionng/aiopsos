import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateScoresByDimension, calculateOverallScore } from "../score-math.ts";
import { getNeedBand, rankCoursesByNeed, NEED_BANDS } from "../training-needs.ts";
import type { Course } from "../types.ts";

// ── generic scoring ─────────────────────────────────────────────────────

test("scores derive their axes from the question set, not a fixed list", () => {
  const questions = [
    { id: "a1", dimension: "ai" },
    { id: "a2", dimension: "ai" },
    { id: "t1", dimension: "technology" },
  ];
  const scores = calculateScoresByDimension({ a1: 4, a2: 2, t1: 5 }, questions);
  assert.deepEqual(scores, { ai: 3, technology: 5 });
});

test("missing answers score zero rather than throwing", () => {
  const questions = [{ id: "q1", dimension: "robotics" }];
  assert.deepEqual(calculateScoresByDimension({}, questions), { robotics: 0 });
});

test("overall score averages whatever axes exist", () => {
  assert.equal(calculateOverallScore({ ai: 4, technology: 2 }), 3);
  assert.equal(calculateOverallScore({}), 0);
});

// ── need bands ──────────────────────────────────────────────────────────

test("need bands cover the whole 0-5 range with no gaps", () => {
  assert.equal(getNeedBand(5).id, "high");
  assert.equal(getNeedBand(3.5).id, "high");
  assert.equal(getNeedBand(3.49).id, "moderate");
  assert.equal(getNeedBand(2).id, "moderate");
  assert.equal(getNeedBand(1.99).id, "low");
  assert.equal(getNeedBand(0).id, "low");
});

test("band labels never speak maturity language", () => {
  for (const band of NEED_BANDS) {
    assert.doesNotMatch(band.label, /tier|maturity/i);
    assert.doesNotMatch(band.description, /tier|maturity|complian/i);
  }
});

// ── course ranking ──────────────────────────────────────────────────────

function course(overrides: Partial<Course>): Course {
  return {
    id: "c",
    slug: "slug",
    title: "Title",
    summary: "",
    level: "practitioner",
    category: "ai",
    sectors: [],
    duration_hours: 6,
    delivery_modes: ["in_person"],
    learning_outcomes: [],
    target_roles: [],
    target_dimensions: [],
    status: "published",
    created_by: null,
    created_at: "",
    updated_at: "",
    ...overrides,
  } as Course;
}

test("subjects come back ranked by need, highest first, all present", () => {
  const ranked = rankCoursesByNeed(
    { ai: 1, technology: 4.5, robotics: 3 },
    null,
    []
  );
  assert.deepEqual(
    ranked.map((s) => s.category),
    ["technology", "robotics", "ai"]
  );
  assert.equal(ranked[0].band.id, "high");
  assert.equal(ranked[2].band.id, "low");
});

test("courses match their subject and the respondent's level", () => {
  const catalogue = [
    course({ slug: "ai-prac", category: "ai", level: "practitioner" }),
    course({ slug: "ai-lead", category: "ai", level: "leadership" }),
    course({ slug: "tech-prac", category: "technology", level: "practitioner" }),
    course({ slug: "draft", category: "ai", level: "practitioner", status: "draft" }),
  ];
  const ranked = rankCoursesByNeed(
    { ai: 5, technology: 1, robotics: 1 },
    "individual_contributor",
    catalogue
  );
  const ai = ranked.find((s) => s.category === "ai")!;
  assert.deepEqual(ai.courses.map((c) => c.slug), ["ai-prac"]);
});

test("executives get leadership courses, not practitioner drills", () => {
  const catalogue = [
    course({ slug: "ai-prac", category: "ai", level: "practitioner" }),
    course({ slug: "ai-lead", category: "ai", level: "leadership" }),
    course({ slug: "ai-mgr", category: "ai", level: "manager" }),
  ];
  const ranked = rankCoursesByNeed({ ai: 4, technology: 0, robotics: 0 }, "executive", catalogue);
  const ai = ranked.find((s) => s.category === "ai")!;
  assert.deepEqual(ai.courses.map((c) => c.slug), ["ai-lead", "ai-mgr"]);
});

test("at most three courses per subject", () => {
  const catalogue = Array.from({ length: 6 }, (_, i) =>
    course({ slug: `ai-${i}`, category: "ai", level: "practitioner" })
  );
  const ranked = rankCoursesByNeed({ ai: 5, technology: 0, robotics: 0 }, null, catalogue);
  assert.equal(ranked.find((s) => s.category === "ai")!.courses.length, 3);
});
