import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type Stripe from "stripe";
import { missions } from "./catalog.ts";
import {
  validateMembershipSubscription,
  membershipInvoicePeriod,
} from "./membership-rules.ts";
const parent = "10000000-0000-4000-a000-000000000001",
  child = "20000000-0000-4000-a000-000000000001",
  member = "30000000-0000-4000-a000-000000000001";
const day = 86400000;
const start = new Date(Date.now() - day).toISOString(),
  end = new Date(Date.now() + 29 * day).toISOString(),
  next = new Date(Date.now() + 59 * day).toISOString();
async function fixture() {
  const db = new PGlite();
  await db.exec(
    `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); insert into auth.users values('${parent}');`,
  );
  for (const file of [
    "20261005233138_wonderlab_family_learning.sql",
    "20261006162727_wonderlab_monthly_memberships.sql",
  ])
    await db.exec(
      readFileSync(
        new URL(`../../supabase/migrations/${file}`, import.meta.url),
        "utf8",
      ),
    );
  await db.exec(
    `insert into wonderlab_children(id,parent_id,nickname,band,ai_enabled) values('${child}','${parent}','Comet','creators',true); insert into wonderlab_memberships(id,parent_id,child_id,terms_version) values('${member}','${parent}','${child}','monthly-v1');`,
  );
  return db;
}
async function event(db: PGlite, overrides: Record<string, unknown> = {}) {
  const args = {
    p_event: crypto.randomUUID(),
    p_membership: member,
    p_created: 100,
    p_subscription: "sub_one",
    p_customer: "cus_one",
    p_state: "active",
    p_cancel: false,
    p_ended: null,
    p_invoice: "in_one",
    p_kind: "paid",
    p_start: start,
    p_end: end,
    p_amount: 2000,
    p_currency: "gbp",
    p_catalog: JSON.stringify(
      missions.map((m) => ({ slug: m.slug, version: m.version })),
    ),
    ...overrides,
  };
  return db.query(
    `select wonderlab_membership_event(${Object.keys(args)
      .map((key, i) => `${key}=>$${i + 1}`)
      .join(",")})`,
    Object.values(args),
  );
}
const rows = async (db: PGlite) =>
  (
    await db.query<{
      state: string;
      expires_at: Date;
      generations_used: number;
    }>("select * from wonderlab_orders where membership_id=$1", [member])
  ).rows;

test("confirmed monthly payment grants every course once; renewal resets allowances and pending requests only once", async () => {
  const db = await fixture();
  try {
    await event(db, { p_invoice: null, p_kind: null });
    assert.equal((await rows(db)).length, 0);
    await event(db, { p_event: "evt_first" });
    await event(db, { p_event: "evt_first" });
    assert.equal((await rows(db)).length, 24);
    assert.ok((await rows(db)).every((o) => o.state === "paid"));
    const order = (
      await db.query<{ id: string }>(
        "select id from wonderlab_orders where mission_slug='prompt-repair-shop' and membership_id=$1",
        [member],
      )
    ).rows[0].id;
    await db.query(
      "update wonderlab_orders set generations_used=30 where id=$1",
      [order],
    );
    await event(db, { p_event: "evt_same_invoice" });
    assert.equal(
      (
        await db.query<{ generations_used: number }>(
          "select generations_used from wonderlab_orders where id=$1",
          [order],
        )
      ).rows[0].generations_used,
      30,
    );
    const request = crypto.randomUUID();
    await db.query(
      "insert into wonderlab_generations(id,order_id,state) values($1,$2,'pending')",
      [request, order],
    );
    await event(db, {
      p_invoice: "in_two",
      p_start: end,
      p_end: next,
      p_created: 200,
    });
    assert.ok((await rows(db)).every((o) => o.generations_used === 0));
    assert.equal(
      (
        await db.query<{ state: string }>(
          "select state from wonderlab_generations where id=$1",
          [request],
        )
      ).rows[0].state,
      "failed",
    );
    await assert.rejects(
      db.exec(
        `insert into wonderlab_memberships(parent_id,child_id,terms_version) values('${parent}','${child}','v1')`,
      ),
      /duplicate key/,
    );
    await db.exec("set role authenticated");
    await assert.rejects(
      db.query("select * from wonderlab_memberships"),
      /permission denied/,
    );
    await db.exec("reset role");
  } finally {
    await db.close();
  }
});
test("cancellation retains the paid month, failed payment never extends it, and cancellation completion expires access", async () => {
  const db = await fixture();
  try {
    await event(db);
    await event(db, {
      p_invoice: null,
      p_kind: null,
      p_cancel: true,
      p_created: 200,
    });
    assert.ok(
      (await rows(db)).every(
        (o) => new Date(o.expires_at).getTime() === new Date(end).getTime(),
      ),
    );
    await event(db, {
      p_invoice: null,
      p_kind: null,
      p_state: "past_due",
      p_created: 300,
    });
    assert.ok(
      (await rows(db)).every(
        (o) => new Date(o.expires_at).getTime() === new Date(end).getTime(),
      ),
    );
    const stopped = new Date(Date.now() - 1000).toISOString();
    await event(db, {
      p_invoice: null,
      p_kind: null,
      p_state: "canceled",
      p_ended: stopped,
      p_created: 400,
    });
    await event(db, { p_event: "late-payment", p_created: 50 });
    assert.ok(
      (await rows(db)).every(
        (o) => new Date(o.expires_at).getTime() <= Date.now(),
      ),
    );
    const state = (
      await db.query<{ state: string }>(
        "select state from wonderlab_memberships",
      )
    ).rows[0].state;
    assert.equal(state, "canceled");
  } finally {
    await db.close();
  }
});
test("refund before fulfilment is terminal; refunding an older invoice preserves a later paid period", async () => {
  const db = await fixture();
  try {
    await event(db, { p_kind: "refunded" });
    await event(db, { p_event: "delayed-paid" });
    assert.equal((await rows(db)).length, 0);
    await event(db, { p_invoice: "in_two", p_start: end, p_end: next });
    await event(db, { p_kind: "refunded", p_event: "duplicate-refund" });
    assert.equal((await rows(db)).length, 24);
    assert.ok(
      (await rows(db)).every(
        (o) => new Date(o.expires_at).getTime() === new Date(next).getTime(),
      ),
    );
    await event(db, {
      p_invoice: "in_two",
      p_start: end,
      p_end: next,
      p_kind: "refunded",
    });
    assert.ok((await rows(db)).every((o) => o.state === "refunded"));
    await event(db, {
      p_invoice: "in_two",
      p_start: end,
      p_end: next,
      p_event: "late-renewal",
    });
    assert.ok((await rows(db)).every((o) => o.state === "refunded"));
  } finally {
    await db.close();
  }
});
test("invalid price, currency, identity and incomplete catalogue fail atomically; cancellation without payment cannot grant access", async () => {
  const db = await fixture();
  try {
    await assert.rejects(
      event(db, { p_amount: 1 }),
      /Invalid membership payment/,
    );
    await assert.rejects(
      event(db, { p_currency: "usd" }),
      /Invalid membership payment/,
    );
    await assert.rejects(
      event(db, { p_amount: null }),
      /Invalid membership payment/,
    );
    await assert.rejects(
      event(db, { p_catalog: "[]" }),
      /Full catalogue required/,
    );
    assert.equal((await rows(db)).length, 0);
    await event(db, {
      p_invoice: null,
      p_kind: null,
      p_state: "canceled",
      p_ended: end,
    });
    assert.equal((await rows(db)).length, 0);
    await assert.rejects(
      event(db, { p_subscription: "sub_foreign" }),
      /identity mismatch/,
    );
  } finally {
    await db.close();
  }
});
test("Stripe validation enforces one child, one monthly £20 price and the exact paid invoice", () => {
  const subscription = {
    id: "sub_one",
    metadata: { purpose: "wonderlab_membership", membership_id: member },
    items: {
      data: [
        {
          quantity: 1,
          price: {
            currency: "gbp",
            unit_amount: 2000,
            recurring: { interval: "month", interval_count: 1 },
          },
        },
      ],
    },
  } as unknown as Stripe.Subscription;
  assert.equal(validateMembershipSubscription(subscription), member);
  assert.throws(() =>
    validateMembershipSubscription({
      ...subscription,
      items: {
        ...subscription.items,
        data: [{ ...subscription.items.data[0], quantity: 2 }],
      },
    }),
  );
  const invoice = {
    parent: { subscription_details: { subscription: "sub_one" } },
    lines: {
      has_more: false,
      data: [{ amount: 2000, period: { start: 100, end: 100 + 30 * 86400 } }],
    },
    currency: "gbp",
    total: 2000,
    amount_paid: 2000,
  } as unknown as Stripe.Invoice;
  assert.ok(membershipInvoicePeriod(invoice, "sub_one"));
  assert.throws(() =>
    membershipInvoicePeriod({ ...invoice, amount_paid: 0 }, "sub_one"),
  );
  assert.throws(() => membershipInvoicePeriod(invoice, "sub_foreign"));
});
