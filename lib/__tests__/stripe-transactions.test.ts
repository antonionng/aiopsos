import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const read = (name: string) =>
  readFileSync(
    new URL("../../supabase/migrations/" + name, import.meta.url),
    "utf8",
  );
const org = "10000000-0000-4000-a000-000000000001",
  user = "20000000-0000-4000-a000-000000000001",
  pack = "30000000-0000-4000-a000-000000000001",
  cohort = "40000000-0000-4000-a000-000000000001";
async function fixture() {
  const db = new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create table organisations(id uuid primary key,owner_id uuid);
 create table user_profiles(id uuid primary key,org_id uuid,role text);
 create table organisation_memberships(id uuid primary key default gen_random_uuid(),user_id uuid,org_id uuid,role text,status text);
 create table cohorts(id uuid primary key,org_id uuid references organisations(id),price_amount integer,currency text,paid_at timestamptz,title text);
 create table agent_course_orders(id uuid primary key);
 insert into organisations values('${org}','${user}');insert into user_profiles values('${user}','${org}','admin');
 insert into organisation_memberships(user_id,org_id,role,status) values('${user}','${org}','admin','active');
 insert into cohorts values('${cohort}','${org}',9900,'GBP',null,'Cohort');`);
  await db.exec(
    read("029_mooov_payments.sql").split(
      "CREATE TABLE IF NOT EXISTS mooov_webhook_events",
    )[0],
  );
  await db.exec(read("030_credit_wallet.sql").split("-- ── seeds")[0]);
  await db.exec(
    read("20260909124447_lms_workspace_context_guard.sql").split(
      "-- Guard the old entry point",
    )[0],
  );
  await db.exec(read("20261002094146_stripe_direct_payments.sql"));
  await db.exec(
    `insert into credit_packs(id,name,credits,price_amount) values('${pack}','Pack',1000,9900);`,
  );
  return db;
}
async function reserve(db: PGlite, purpose = "credit_pack") {
  return (
    await db.query<{
      payment: { id: string; payment_id: string; amount: number };
    }>("select academy_reserve_stripe_payment($1,$2,$3,$4) as payment", [
      user,
      org,
      purpose,
      purpose === "cohort" ? cohort : pack,
    ])
  ).rows[0].payment;
}
async function event(
  db: PGlite,
  id: string,
  type: string,
  payment: string,
  amount = 9900,
) {
  return db.query("select academy_stripe_payment_event($1,$2,$3,$4,$5,$6,$7)", [
    id,
    type,
    payment,
    amount,
    "gbp",
    "cs_one",
    "pi_one",
  ]);
}

test("Stripe credit fulfilment is idempotent and uses the purchased credit quantity", async () => {
  const db = await fixture();
  try {
    const payment = await reserve(db);
    assert.equal((await reserve(db)).id, payment.id);
    await db.exec("update credit_packs set credits=9000");
    await event(db, "evt_1", "captured", payment.payment_id);
    await event(db, "evt_1", "captured", payment.payment_id);
    await event(db, "evt_2", "captured", payment.payment_id);
    assert.equal(
      (
        await db.query<{ balance: number }>(
          "select balance from credit_wallets",
        )
      ).rows[0].balance,
      1000,
    );
    assert.equal(
      (await db.query("select * from credit_ledger")).rows.length,
      1,
    );
    await event(db, "evt_refund", "refunded", payment.payment_id);
    await event(db, "evt_refund2", "refunded", payment.payment_id);
    assert.equal(
      (
        await db.query<{ balance: number }>(
          "select balance from credit_wallets",
        )
      ).rows[0].balance,
      0,
    );
    assert.equal(
      (await db.query("select * from credit_ledger")).rows.length,
      2,
    );
  } finally {
    await db.close();
  }
});

test("Stripe receipt rolls back with a failed wallet update and the same event can be retried", async () => {
  const db = await fixture();
  try {
    const payment = await reserve(db);
    await db.exec(
      "create function fail_ledger() returns trigger language plpgsql as $$begin raise exception 'temporary ledger failure';end$$;create trigger fail_ledger before insert on credit_ledger for each row execute function fail_ledger();",
    );
    await assert.rejects(
      event(db, "evt_retry", "captured", payment.payment_id),
      /temporary ledger failure/,
    );
    assert.equal(
      (await db.query("select * from stripe_payment_events")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from credit_wallets")).rows.length,
      0,
    );
    await db.exec("alter table credit_ledger disable trigger fail_ledger");
    await event(db, "evt_retry", "captured", payment.payment_id);
    assert.equal(
      (await db.query("select * from credit_ledger")).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});

test("cohort confirmation, refund and payment identity checks are transactional", async () => {
  const db = await fixture();
  try {
    const payment = await reserve(db, "cohort");
    await assert.rejects(
      event(db, "wrong_amount", "captured", payment.payment_id, 1),
      /does not match/,
    );
    await event(db, "evt_cohort", "captured", payment.payment_id);
    assert.ok(
      (await db.query<{ paid_at: unknown }>("select paid_at from cohorts"))
        .rows[0].paid_at,
    );
    await assert.rejects(
      db.query("select academy_stripe_payment_event($1,$2,$3,$4,$5,$6,$7)", [
        "wrong_session",
        "captured",
        payment.payment_id,
        9900,
        "gbp",
        "cs_other",
        "pi_one",
      ]),
      /session does not match/,
    );
    await event(db, "evt_refund", "refunded", payment.payment_id);
    assert.equal(
      (await db.query<{ paid_at: unknown }>("select paid_at from cohorts"))
        .rows[0].paid_at,
      null,
    );
    await event(db, "late_capture", "captured", payment.payment_id);
    assert.equal(
      (await db.query<{ status: string }>("select status from mooov_payments"))
        .rows[0].status,
      "refunded",
    );
  } finally {
    await db.close();
  }
});
