import { test } from "node:test";
import assert from "node:assert/strict";

import {
  computePracticeDelta,
  MIN_ACTIVE_USERS_FOR_REPORTING,
  type AssessmentRowForDelta,
  type UsageRowForDelta,
} from "../practice-delta.ts";

function response(
  department_id: string | null,
  scores: Partial<Omit<AssessmentRowForDelta, "department_id">> = {}
): AssessmentRowForDelta {
  return {
    department_id,
    confidence_score: 3,
    practice_score: 3,
    tools_score: 3,
    responsible_score: 3,
    culture_score: 3,
    ...scores,
  };
}

/** n distinct users, each active on `days` distinct days, on one endpoint. */
function usageFor(
  department_id: string | null,
  users: number,
  days = 1,
  endpoint = "chat"
): UsageRowForDelta[] {
  const rows: UsageRowForDelta[] = [];
  for (let u = 0; u < users; u++) {
    for (let d = 0; d < days; d++) {
      rows.push({
        department_id,
        user_id: `user-${department_id}-${u}`,
        endpoint,
        created_at: `2026-05-0${d + 1}T10:00:00Z`,
      });
    }
  }
  return rows;
}

const ENG = { department_id: "eng", name: "Engineering", headcount: 20 };

// ── Suppression ──────────────────────────────────────────────

test("a department below the active-user threshold is suppressed, not dropped", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [response("eng")],
    periodUsage: usageFor("eng", MIN_ACTIVE_USERS_FOR_REPORTING - 1),
  });

  assert.equal(row.suppressed, true);
  assert.equal(row.department, "Engineering");
  assert.match(row.suppression_reason ?? "", /identify individuals/);
  // The observed figures must not leak through a suppressed row.
  assert.equal(row.active_users, 0);
  assert.equal(row.active_user_pct, null);
  assert.equal(row.sessions_per_active_user, 0);
  assert.equal(row.distinct_endpoints, 0);
});

test("exactly the threshold is reported, not suppressed", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [],
    periodUsage: usageFor("eng", MIN_ACTIVE_USERS_FOR_REPORTING),
  });

  assert.equal(row.suppressed, false);
  assert.equal(row.active_users, MIN_ACTIVE_USERS_FOR_REPORTING);
});

test("a department with no usage at all is reported as zero, not suppressed", () => {
  // Nobody used the platform. That is a real finding and must be publishable,
  // unlike a group too small to describe safely.
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [response("eng")],
    periodUsage: [],
  });

  assert.equal(row.suppressed, false);
  assert.equal(row.active_users, 0);
  assert.equal(row.active_user_pct, 0);
});

// ── The observed figures ─────────────────────────────────────

test("active users are reported as a proportion of headcount", () => {
  const [row] = computePracticeDelta({
    departments: [{ department_id: "eng", name: "Engineering", headcount: 20 }],
    preTrainingResponses: [],
    periodUsage: usageFor("eng", 10),
  });

  assert.equal(row.active_users, 10);
  assert.equal(row.active_user_pct, 50);
});

test("sessions count distinct user-days, not raw requests", () => {
  // 5 users active on 2 days each, but 4 requests per day. Chattiness must
  // not inflate the adoption figure.
  const noisy: UsageRowForDelta[] = [];
  for (const day of ["2026-05-01", "2026-05-02"]) {
    for (let u = 0; u < 5; u++) {
      for (let r = 0; r < 4; r++) {
        noisy.push({
          department_id: "eng",
          user_id: `user-${u}`,
          endpoint: "chat",
          created_at: `${day}T1${r}:00:00Z`,
        });
      }
    }
  }

  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [],
    periodUsage: noisy,
  });

  assert.equal(row.active_users, 5);
  assert.equal(row.sessions_per_active_user, 2);
});

test("distinct endpoints count capabilities reached for", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [],
    periodUsage: [
      ...usageFor("eng", 5, 1, "chat"),
      ...usageFor("eng", 5, 1, "chat/search"),
      ...usageFor("eng", 5, 1, "course_tutor"),
    ],
  });

  assert.equal(row.distinct_endpoints, 3);
});

test("no token or cost figure is ever produced", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [response("eng")],
    periodUsage: usageFor("eng", 6),
  });

  const keys = Object.keys(row).join(" ");
  assert.doesNotMatch(keys, /token/i);
  assert.doesNotMatch(keys, /cost|charge|spend/i);
});

// ── Pre-training scores ──────────────────────────────────────

test("pre-training scores are averaged per dimension", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [
      response("eng", { confidence_score: 2, culture_score: 1 }),
      response("eng", { confidence_score: 4, culture_score: 2 }),
    ],
    periodUsage: [],
  });

  assert.equal(row.pre_training_scores?.confidence, 3);
  assert.equal(row.pre_training_scores?.culture, 1.5);
  assert.equal(row.pre_training_respondents, 2);
});

test("a department nobody assessed reports null scores, not zeroes", () => {
  const [row] = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [],
    periodUsage: usageFor("eng", 6),
  });

  assert.equal(row.pre_training_scores, null);
  assert.equal(row.pre_training_respondents, 0);
});

// ── Grouping ─────────────────────────────────────────────────

test("usage with no department is kept as its own row rather than discarded", () => {
  const rows = computePracticeDelta({
    departments: [ENG],
    preTrainingResponses: [],
    periodUsage: [...usageFor("eng", 6), ...usageFor(null, 6)],
  });

  const unassigned = rows.find((r) => r.department_id === null);
  assert.ok(unassigned, "expected a row for usage with no department");
  assert.equal(unassigned.department, "No department");
  assert.equal(unassigned.active_users, 6);
});

test("a department that appears only in usage still gets a row", () => {
  const rows = computePracticeDelta({
    departments: [],
    preTrainingResponses: [],
    periodUsage: usageFor("ghost", 6),
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].department_id, "ghost");
  assert.equal(rows[0].headcount, 0);
  // Headcount of zero means the proportion is undefined, not zero.
  assert.equal(rows[0].active_user_pct, null);
});

test("rows are ordered by headcount so the biggest groups read first", () => {
  const rows = computePracticeDelta({
    departments: [
      { department_id: "small", name: "Small", headcount: 3 },
      { department_id: "big", name: "Big", headcount: 50 },
    ],
    preTrainingResponses: [],
    periodUsage: [],
  });

  assert.deepEqual(rows.map((r) => r.department), ["Big", "Small"]);
});

test("the same input always produces the same output", () => {
  const input = {
    departments: [ENG],
    preTrainingResponses: [response("eng")],
    periodUsage: usageFor("eng", 7, 2),
  };
  assert.deepEqual(computePracticeDelta(input), computePracticeDelta(input));
});
