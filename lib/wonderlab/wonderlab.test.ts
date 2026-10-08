import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { missions, bands, PRICE_PENCE } from "./catalog.ts";
import {
  checkActivity,
  evaluateProgress,
  isEntitled,
  normaliseAnswers,
} from "./engine.ts";
const sql = readFileSync(
  new URL(
    "../../supabase/migrations/20261005233138_wonderlab_family_learning.sql",
    import.meta.url,
  ),
  "utf8",
);
const parent = "10000000-0000-4000-a000-000000000001",
  other = "10000000-0000-4000-a000-000000000002",
  child = "20000000-0000-4000-a000-000000000001",
  order = "30000000-0000-4000-a000-000000000001";
async function fixture() {
  const db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('${parent}'),('${other}');`,
  );
  await db.exec(sql);
  await db.exec(
    `insert into wonderlab_children(id,parent_id,nickname,band,ai_enabled) values('${child}','${parent}','Comet','creators',true);insert into wonderlab_orders(id,parent_id,child_id,mission_slug,content_version,terms_version) values('${order}','${parent}','${child}','prompt-repair-shop','2026-10-05.1','test');`,
  );
  return db;
}
async function payment(
  db: PGlite,
  event = "event-paid",
  kind = "paid",
  amount = 2000,
  currency = "gbp",
  session = "cs_one",
  intent = "pi_one",
) {
  return db.query("select wonderlab_payment_event($1,$2,$3,$4,$5,$6,$7)", [
    event,
    order,
    kind,
    amount,
    currency,
    session,
    intent,
  ]);
}
async function getOrder(db: PGlite) {
  return (
    await db.query<{
      state: string;
      expires_at: string;
      generations_used: number;
    }>("select * from wonderlab_orders where id=$1", [order])
  ).rows[0];
}
async function save(db: PGlite, owner = parent, revision = 0, complete = true) {
  return db.query<{ value: { revision: number; completed: boolean } }>(
    "select wonderlab_save_progress($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) as value",
    [
      child,
      owner,
      "prompt-repair-shop",
      "2026-10-05.1",
      revision,
      JSON.stringify({}),
      "My fictional tested project",
      JSON.stringify([true]),
      JSON.stringify(["chapter-1"]),
      complete,
    ],
  );
}

test("24 complete mission definitions, six in each age level, with no AI briefs for young children", () => {
  assert.equal(missions.length, 24);
  assert.equal(new Set(missions.map((m) => m.slug)).size, 24);
  assert.equal(PRICE_PENCE, 2000);
  for (const band of Object.keys(bands))
    assert.equal(missions.filter((m) => m.band === band).length, 6);
  for (const m of missions) {
    assert.equal(m.activities.length, 4);
    assert.equal(new Set(m.activities.map((a) => a.id)).size, 4);
    assert.ok(m.project.checks.length >= 2);
    assert.ok(m.introduction.length > 100);
    assert.ok(m.project.offline.length > 20);
    if (["explorers", "inventors"].includes(m.band))
      assert.equal(m.aiBrief, undefined);
    for (const a of m.activities) {
      assert.ok(a.feedback.length > 30);
      assert.ok(a.hint.length > 20);
      assert.ok(checkActivity(a, a.correct));
      assert.equal(checkActivity(a, []), false);
    }
  }
});
test("completion is based on all answers and project checks, not client progress flags", () => {
  const m = missions[0],
    answers = Object.fromEntries(m.activities.map((a) => [a.id, a.correct]));
  assert.equal(
    evaluateProgress(m, answers, "A tested project", [true, true]).completed,
    true,
  );
  assert.equal(
    evaluateProgress(m, { ...answers, "chapter-4": [] }, "A tested project", [
      true,
      true,
    ]).completed,
    false,
  );
  assert.equal(evaluateProgress(m, answers, "", [true, true]).completed, false);
  assert.equal(
    evaluateProgress(m, answers, "A tested project", [true, false]).completed,
    false,
  );
  assert.throws(() => normaliseAnswers(m, { "forged-chapter": ["yes"] }));
  const ordered = missions[1].activities[0];
  assert.equal(checkActivity(ordered, [...ordered.correct].reverse()), false);
  const evidence = missions.find((m) => m.slug === "fact-detective")!
    .activities[0];
  assert.equal(checkActivity(evidence, [...evidence.correct].reverse()), true);
  assert.equal(
    checkActivity(evidence, [evidence.correct[0], evidence.correct[0]]),
    false,
  );
});
test("entitlement denies pending, refunded, missing, expired and malformed dates", () => {
  const now = Date.parse("2026-10-05T12:00:00Z");
  for (const state of ["pending", "refunded"])
    assert.equal(isEntitled({ state, expires_at: "2027-10-05" }, now), false);
  assert.equal(isEntitled(null, now), false);
  assert.equal(
    isEntitled({ state: "paid", expires_at: "2026-10-05T12:00:00Z" }, now),
    false,
  );
  assert.equal(isEntitled({ state: "paid", expires_at: "bad" }, now), false);
  assert.equal(
    isEntitled({ state: "paid", expires_at: "2027-10-05" }, now),
    true,
  );
});
test("payment amount, currency and identity are enforced, capture is idempotent and refunds are terminal", async () => {
  const db = await fixture();
  try {
    await assert.rejects(
      payment(db, "bad-amount", "paid", 1),
      /amount mismatch/,
    );
    await assert.rejects(
      payment(db, "bad-currency", "paid", 2000, "eur"),
      /amount mismatch/,
    );
    assert.equal((await getOrder(db)).state, "pending");
    await payment(db);
    const first = await getOrder(db);
    assert.equal(first.state, "paid");
    assert.ok(first.expires_at);
    await payment(db);
    await payment(db, "event-paid-again");
    assert.equal(
      String((await getOrder(db)).expires_at),
      String(first.expires_at),
    );
    await assert.rejects(
      payment(db, "different-session", "paid", 2000, "gbp", "cs_wrong"),
      /Session mismatch/,
    );
    await payment(db, "refund", "refunded");
    await payment(db, "late-capture");
    assert.equal((await getOrder(db)).state, "refunded");
  } finally {
    await db.close();
  }
});
test("refund before capture cannot be reversed by delayed capture", async () => {
  const db = await fixture();
  try {
    await payment(db, "early-refund", "refunded");
    await payment(db);
    assert.equal((await getOrder(db)).state, "refunded");
  } finally {
    await db.close();
  }
});
test("private progress checks owner, payment, version, expiry and revision; earned completion survives replay", async () => {
  const db = await fixture();
  try {
    await assert.rejects(save(db), /Access unavailable/);
    await payment(db);
    await assert.rejects(save(db, other), /Child unavailable/);
    assert.equal((await save(db)).rows[0].value.revision, 1);
    await assert.rejects(save(db), /Progress conflict/);
    const replay = (await save(db, parent, 1, false)).rows[0].value;
    assert.equal(replay.revision, 2);
    assert.equal(replay.completed, true);
    await db.exec(
      `update wonderlab_orders set expires_at=now()-interval '1 minute'`,
    );
    await assert.rejects(save(db, parent, 2), /Access unavailable/);
    assert.equal(
      (await db.query("select * from wonderlab_progress")).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});
test("AI reservations prevent parallel overspend; failures do not consume allowance; retries return saved output", async () => {
  const db = await fixture();
  try {
    await payment(db);
    const reserve = async (i: number) =>
      (
        await db.query<{
          r: { state: string; reserved?: boolean; response?: string };
        }>("select wonderlab_reserve_generation($1,$2,$3) as r", [
          `40000000-0000-4000-a000-${String(i).padStart(12, "0")}`,
          order,
          child,
        ])
      ).rows[0].r;
    const finish = async (i: number, response: string | null) =>
      db.query("select wonderlab_finish_generation($1,$2)", [
        `40000000-0000-4000-a000-${String(i).padStart(12, "0")}`,
        response,
      ]);
    assert.equal((await reserve(1)).reserved, true);
    await assert.rejects(reserve(2), /already running/);
    await finish(1, null);
    assert.equal((await getOrder(db)).generations_used, 0);
    for (let i = 2; i <= 31; i++) {
      await reserve(i);
      await finish(i, "A reviewed fictional draft");
    }
    assert.equal((await getOrder(db)).generations_used, 30);
    assert.equal((await reserve(2)).response, "A reviewed fictional draft");
    await finish(2, "A duplicate result");
    assert.equal((await getOrder(db)).generations_used, 30);
    await assert.rejects(reserve(32), /Allowance reached/);
  } finally {
    await db.close();
  }
});
test("AI completion after parental disable or refund cannot spend allowance", async () => {
  const db = await fixture();
  try {
    await payment(db);
    const id = "40000000-0000-4000-a000-000000000001";
    await db.query("select wonderlab_reserve_generation($1,$2,$3)", [
      id,
      order,
      child,
    ]);
    await db.exec("update wonderlab_children set ai_enabled=false");
    const r = await db.query<{ ok: boolean }>(
      "select wonderlab_finish_generation($1,$2) as ok",
      [id, "A draft"],
    );
    assert.equal(r.rows[0].ok, false);
    assert.equal((await getOrder(db)).generations_used, 0);
  } finally {
    await db.close();
  }
});
test("browser roles cannot read or mutate family data or call privileged functions; migration is repeatable", async () => {
  const db = await fixture();
  try {
    await db.exec(sql);
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      for (const table of [
        "wonderlab_children",
        "wonderlab_sessions",
        "wonderlab_orders",
        "wonderlab_progress",
        "wonderlab_generations",
        "wonderlab_payment_events",
      ]) {
        await assert.rejects(
          db.query(`select * from ${table}`),
          /permission denied/,
        );
        await assert.rejects(
          db.query(`delete from ${table}`),
          /permission denied/,
        );
      }
      await assert.rejects(payment(db), /permission denied/);
      await db.exec("reset role");
    }
    const r = await db.query<{ relrowsecurity: boolean }>(
      "select relrowsecurity from pg_class where relname like 'wonderlab_%' and relkind='r'",
    );
    assert.equal(r.rows.length, 6);
    assert.ok(r.rows.every((t) => t.relrowsecurity));
  } finally {
    await db.close();
  }
});

test("copy revision preserves saved answers and the previous published curriculum", async () => {
  const { missions: original } = await import("./versions/2026-10-05.ts");
  const { getMissionForVersion } = await import("./versions.ts");
  for (const previous of original) {
    const revised = missions.find((mission) => mission.slug === previous.slug)!;
    assert.notEqual(revised.version, previous.version);
    assert.equal(
      getMissionForVersion(previous.slug, previous.version),
      previous,
    );
    assert.equal(getMissionForVersion(revised.slug, revised.version), revised);
    assert.deepEqual(
      revised.activities.map((a) => [a.id, a.kind, a.correct, a.options]),
      previous.activities.map((a) => [a.id, a.kind, a.correct, a.options]),
    );
    for (let i = 0; i < previous.activities.length; i++) {
      assert.ok(
        checkActivity(revised.activities[i], previous.activities[i].correct),
      );
    }
  }
});
