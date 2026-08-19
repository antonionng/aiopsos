import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getWeakestDimensions,
  rankCourses,
  recommendCourses,
} from "../recommendation-engine.ts";
import type { Dimension, RespondentRole } from "../constants.ts";
import type { Course } from "../types.ts";

// ── Fixtures ─────────────────────────────────────────────────

function course(overrides: Partial<Course> & { slug: string }): Course {
  return {
    id: `id-${overrides.slug}`,
    title: overrides.slug,
    summary: "",
    level: "practitioner",
    duration_hours: 4,
    delivery_modes: ["virtual"],
    learning_outcomes: [],
    target_roles: [],
    target_dimensions: [],
    status: "published",
    created_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function scores(overrides: Partial<Record<Dimension, number>> = {}) {
  return {
    confidence: 3,
    practice: 3,
    tools: 3,
    responsible: 3,
    culture: 3,
    ...overrides,
  } as Record<Dimension, number>;
}

const IC: RespondentRole = "individual_contributor";

// ── getWeakestDimensions ─────────────────────────────────────

test("weakest dimensions come back weakest first", () => {
  const result = getWeakestDimensions(
    scores({ confidence: 4.5, practice: 1.0, tools: 2.0, responsible: 4.0, culture: 3.0 })
  );
  assert.deepEqual(result, ["practice", "tools", "culture"]);
});

test("ties between equal scores fall back to canonical dimension order", () => {
  const result = getWeakestDimensions(
    scores({ confidence: 2, practice: 2, tools: 2, responsible: 2, culture: 2 })
  );
  assert.deepEqual(result, ["confidence", "practice", "tools"]);
});

test("a missing or non-numeric score is treated as the weakest possible", () => {
  const broken = { ...scores({ culture: 5 }) } as Record<Dimension, number>;
  delete (broken as Partial<Record<Dimension, number>>).responsible;
  assert.equal(getWeakestDimensions(broken)[0], "responsible");
});

// ── rankCourses / recommendCourses ───────────────────────────

test("only courses overlapping a weak dimension are recommended", () => {
  const catalogue = [
    course({ slug: "weak-match", target_dimensions: ["practice"] }),
    course({ slug: "strong-area", target_dimensions: ["culture"] }),
  ];
  const result = recommendCourses(
    scores({ practice: 1, culture: 5 }),
    IC,
    catalogue
  );
  assert.deepEqual(result.map((c) => c.slug), ["weak-match"]);
});

test("courses are ranked by weighted overlap, weakest dimension counting most", () => {
  const catalogue = [
    course({ slug: "third-weakest", target_dimensions: ["culture"] }),
    course({ slug: "weakest", target_dimensions: ["practice"] }),
    course({ slug: "second-weakest", target_dimensions: ["tools"] }),
  ];
  // practice 1.0 < tools 2.0 < culture 3.0
  const result = recommendCourses(
    scores({ practice: 1, tools: 2, culture: 3, confidence: 4, responsible: 5 }),
    IC,
    catalogue
  );
  assert.deepEqual(result.map((c) => c.slug), [
    "weakest",
    "second-weakest",
    "third-weakest",
  ]);
});

test("a course covering several weak dimensions outranks one covering the weakest alone", () => {
  const catalogue = [
    course({ slug: "single", target_dimensions: ["practice"] }),
    course({ slug: "broad", target_dimensions: ["tools", "culture"] }),
  ];
  // single scores 3; broad scores 2 + 1 = 3 -> tie, so make broad clearly win
  const result = rankCourses(
    scores({ practice: 1, tools: 2, culture: 3, confidence: 4, responsible: 5 }),
    IC,
    [...catalogue, course({ slug: "broadest", target_dimensions: ["practice", "tools"] })]
  );
  assert.equal(result[0].course.slug, "broadest");
  assert.equal(result[0].score, 5);
  assert.deepEqual(result[0].matched_dimensions, ["practice", "tools"]);
});

test("equally-matched courses tie-break on level, least senior first", () => {
  const catalogue = [
    course({ slug: "c-leadership", level: "leadership", target_dimensions: ["practice"] }),
    course({ slug: "a-manager", level: "manager", target_dimensions: ["practice"] }),
    course({ slug: "b-practitioner", level: "practitioner", target_dimensions: ["practice"] }),
  ];
  const result = recommendCourses(scores({ practice: 1 }), IC, catalogue);
  assert.deepEqual(result.map((c) => c.slug), [
    "b-practitioner",
    "a-manager",
    "c-leadership",
  ]);
});

test("courses not targeting the respondent role are filtered out", () => {
  const catalogue = [
    course({
      slug: "for-executives",
      target_dimensions: ["practice"],
      target_roles: ["executive"],
    }),
    course({
      slug: "for-ics",
      target_dimensions: ["practice"],
      target_roles: ["individual_contributor"],
    }),
  ];
  const result = recommendCourses(scores({ practice: 1 }), IC, catalogue);
  assert.deepEqual(result.map((c) => c.slug), ["for-ics"]);
});

test("an empty target_roles list means the course suits every role", () => {
  const catalogue = [
    course({ slug: "everyone", target_dimensions: ["practice"], target_roles: [] }),
  ];
  for (const role of [
    "individual_contributor",
    "executive",
  ] as RespondentRole[]) {
    assert.equal(
      recommendCourses(scores({ practice: 1 }), role, catalogue).length,
      1
    );
  }
});

test("draft and retired courses never surface", () => {
  const catalogue = [
    course({ slug: "draft", status: "draft", target_dimensions: ["practice"] }),
    course({ slug: "retired", status: "retired", target_dimensions: ["practice"] }),
    course({ slug: "live", target_dimensions: ["practice"] }),
  ];
  const result = recommendCourses(scores({ practice: 1 }), IC, catalogue);
  assert.deepEqual(result.map((c) => c.slug), ["live"]);
});

test("no more than three courses are returned", () => {
  const catalogue = Array.from({ length: 9 }, (_, i) =>
    course({ slug: `course-${i}`, target_dimensions: ["practice"] })
  );
  assert.equal(recommendCourses(scores({ practice: 1 }), IC, catalogue).length, 3);
});

test("an empty catalogue yields no recommendations", () => {
  assert.deepEqual(recommendCourses(scores(), IC, []), []);
});

test("the same input always produces the same output", () => {
  const catalogue = [
    course({ slug: "b", target_dimensions: ["practice"] }),
    course({ slug: "a", target_dimensions: ["practice"] }),
    course({ slug: "c", target_dimensions: ["tools"] }),
  ];
  const once = recommendCourses(scores({ practice: 1, tools: 2 }), IC, catalogue);
  const twice = recommendCourses(
    scores({ practice: 1, tools: 2 }),
    IC,
    [...catalogue].reverse()
  );
  assert.deepEqual(
    once.map((c) => c.slug),
    twice.map((c) => c.slug)
  );
});
