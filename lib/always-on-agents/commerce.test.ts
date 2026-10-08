import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const read = (name: string) =>
  readFileSync(
    new URL("../../supabase/migrations/" + name, import.meta.url),
    "utf8",
  );
const provider = "10000000-0000-4000-a000-000000000001";
const buyerOrg = "10000000-0000-4000-a000-000000000002";
const author = "20000000-0000-4000-a000-000000000001";
const buyer = "20000000-0000-4000-a000-000000000002";
const reviewer = "20000000-0000-4000-a000-000000000003";
const version = "30000000-0000-4000-a000-000000000001";
const template = "40000000-0000-4000-a000-000000000001";
const request = "50000000-0000-4000-a000-000000000001";
const slug = "always-on-agent-foundations";

async function fixture() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create table organisations(id uuid primary key);
    create table user_profiles(id uuid primary key,org_id uuid references organisations(id),role text,name text);
    create table organisation_memberships(id uuid primary key default gen_random_uuid(),user_id uuid,org_id uuid,role text,status text);
    insert into organisations values('${provider}'),('${buyerOrg}');
    insert into user_profiles values('${author}','${provider}','super_admin','Author'),('${buyer}','${buyerOrg}','user','Learner'),('${reviewer}','${provider}','user','Reviewer');
    insert into organisation_memberships(user_id,org_id,role,status) values('${buyer}','${buyerOrg}','learner','active');`);
  // Use the repository's actual LMS tables and workspace guard, not a payment mock.
  await db.exec(
    read("20260909030116_agentic_learning_core.sql").split(
      "-- Deny direct browser-table access",
    )[0],
  );
  await db.exec(
    read("20260916112824_programme_delivery_lifecycle.sql").split(
      "insert into storage.buckets",
    )[0],
  );
  await db.exec(
    read("20260909124447_lms_workspace_context_guard.sql").split(
      "-- Guard the old entry point",
    )[0],
  );
  const delivery = read("20260916112824_programme_delivery_lifecycle.sql");
  await db.exec(
    "create function public.lms_delivery_role" +
      delivery
        .split("create function public.lms_delivery_role")[1]
        .split("create function public.lms_delivery_path")[0],
  );
  await db.exec(read("20261001175409_agent_course_commerce.sql"));
  await db.exec(`insert into lms_courses(id,org_id,content,created_by) values('${version}','${provider}','{"title":"Foundations"}','${author}');
    insert into lms_course_versions(id,course_id,org_id,version,content,created_by) values('${version}','${version}','${provider}',1,'{"title":"Foundations"}','${author}');
    insert into lms_programmes(id,org_id,title,goal,version_ids,created_by) values('${template}','${provider}','Foundations template','Learn to check an agent',array['${version}'::uuid],'${author}');
    insert into lms_delivery_plans(programme_id,content,released_at,updated_by) values('${template}','{"brief":"A reviewed plan","activities":[]}',now(),'${author}');
    insert into lms_delivery_staff(programme_id,user_id,role,state,invited_by,accepted_at) values('${template}','${reviewer}','reviewer','accepted','${author}',now());
    insert into agent_course_offers(slug,title,version_id,template_programme_id,terms_version,terms_url,assessment_ready,active)
      values('${slug}','Foundations','${version}','${template}','terms-1','https://experrt.com/terms',true,true);`);
  return db;
}
async function reserve(db: PGlite, key = request, terms = "terms-1") {
  const result = await db.query<{
    order: {
      id: string;
      payment_id: string;
      assignment_id: string | null;
      status: string;
      amount: number;
    };
  }>('select agent_course_reserve_order($1,$2,$3,$4,$5) as "order"', [
    buyer,
    buyerOrg,
    slug,
    key,
    terms,
  ]);
  return result.rows[0].order;
}
async function event(db: PGlite, id: string, type: string, payment: string) {
  return db.query("select agent_course_payment_event($1,$2,$3) as result", [
    id,
    type,
    payment,
  ]);
}
async function count(db: PGlite, table: string) {
  return (
    await db.query<{ n: number }>(`select count(*)::int as n from ${table}`)
  ).rows[0].n;
}

test("checkout reserves the server price once and enforces membership, terms and release readiness", async () => {
  const db = await fixture();
  try {
    await assert.rejects(
      reserve(db, request, "old-terms"),
      /current course terms/,
    );
    await db.exec("update agent_course_offers set active=false");
    await assert.rejects(reserve(db), /not yet available/);
    await db.exec(
      "update agent_course_offers set active=true; update organisation_memberships set status='suspended'",
    );
    await assert.rejects(reserve(db), /no longer active/);
    await db.exec("update organisation_memberships set status='active'");
    const first = await reserve(db);
    const replay = await reserve(db);
    const secondTab = await reserve(db, "50000000-0000-4000-a000-000000000002");
    assert.equal(first.amount, 9900);
    assert.equal(first.assignment_id, null);
    assert.equal(first.id, replay.id);
    assert.equal(first.id, secondTab.id);
    assert.equal(await count(db, "agent_course_orders"), 1);
    assert.equal(await count(db, "lms_assignments"), 0);
  } finally {
    await db.close();
  }
});
test("capture creates one learner programme and assignment with the purchased version and assessment plan", async () => {
  const db = await fixture();
  try {
    const order = await reserve(db);
    await event(db, "capture-1", "payment.captured", order.payment_id);
    await event(db, "capture-1", "payment.captured", order.payment_id);
    await event(db, "capture-2", "payment.succeeded", order.payment_id);
    await event(db, "old-failure", "payment.failed", order.payment_id);
    const paid = await reserve(db);
    assert.equal(paid.status, "captured");
    assert.ok(paid.assignment_id);
    assert.equal(await count(db, "lms_assignments"), 1);
    const delivered = await db.query<{
      user_id: string;
      org_id: string;
      version_ids: string[];
      reviewer: string;
    }>(`select a.user_id,a.org_id,p.version_ids,s.user_id as reviewer
      from lms_assignments a join lms_programmes p on p.id=a.programme_id join lms_delivery_staff s on s.programme_id=p.id`);
    assert.equal(delivered.rows[0].user_id, buyer);
    assert.equal(delivered.rows[0].org_id, buyerOrg);
    assert.deepEqual(delivered.rows[0].version_ids, [version]);
    assert.equal(delivered.rows[0].reviewer, reviewer);
    const role = await db.query<{ role: string }>(
      "select lms_delivery_role($1,$2,programme_id) as role from agent_course_orders where id=$3",
      [buyer, buyerOrg, order.id],
    );
    assert.equal(role.rows[0].role, "learner");
    await db.exec(
      `insert into user_profiles values('20000000-0000-4000-a000-000000000099','${buyerOrg}','user','Other learner'); insert into organisation_memberships(user_id,org_id,role,status) values('20000000-0000-4000-a000-000000000099','${buyerOrg}','learner','active');`,
    );
    await assert.rejects(
      db.query(
        "select lms_delivery_role($1,$2,programme_id) from agent_course_orders where id=$3",
        ["20000000-0000-4000-a000-000000000099", buyerOrg, order.id],
      ),
      /do not have access/,
    );
  } finally {
    await db.close();
  }
});
test("a failed enrolment rolls back its receipt and can be retried without losing the paid event", async () => {
  const db = await fixture();
  try {
    const order = await reserve(db);
    await db.exec("update lms_delivery_staff set state='revoked'");
    await assert.rejects(
      event(db, "capture-retry", "payment.captured", order.payment_id),
      /Assign a reviewer/,
    );
    assert.equal(await count(db, "agent_course_payment_events"), 0);
    assert.equal(await count(db, "lms_assignments"), 0);
    await db.exec("update lms_delivery_staff set state='accepted'");
    await event(db, "capture-retry", "payment.captured", order.payment_id);
    assert.equal(await count(db, "lms_assignments"), 1);
  } finally {
    await db.close();
  }
});
test("refunds pause further learning while preserving records, and late captures cannot reopen them", async () => {
  const db = await fixture();
  try {
    const order = await reserve(db);
    await event(db, "capture", "payment.captured", order.payment_id);
    await event(db, "refund", "payment.refunded", order.payment_id);
    await event(db, "late-capture", "payment.captured", order.payment_id);
    const result = await db.query<{ status: string; programme_status: string }>(
      "select o.status,p.status as programme_status from agent_course_orders o join lms_programmes p on p.id=o.programme_id",
    );
    assert.deepEqual(result.rows[0], {
      status: "refunded",
      programme_status: "archived",
    });
    assert.equal(await count(db, "lms_assignments"), 1);
    assert.equal(await count(db, "lms_delivery_plans"), 2);
  } finally {
    await db.close();
  }
});
test("browser roles cannot bypass checkout or call payment fulfilment directly", async () => {
  const db = await fixture();
  try {
    await db.exec("set role authenticated");
    await assert.rejects(
      db.query("select * from agent_course_orders"),
      /permission denied/,
    );
    await assert.rejects(reserve(db), /permission denied/);
    await assert.rejects(
      event(
        db,
        "forged",
        "payment.captured",
        "pay_course_00000000-0000-4000-a000-000000000000",
      ),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});

test("incorrect payment details cannot create an assignment or consume the event receipt", async () => {
  const db = await fixture();
  try {
    const order = await reserve(db);
    for (const [amount, currency, state] of [
      [1, "GBP", "captured"],
      [9900, "USD", "captured"],
      [9900, "GBP", "authorized"],
    ]) {
      await assert.rejects(
        db.query("select agent_course_payment_event($1,$2,$3,$4,$5,$6)", [
          "capture",
          "payment.captured",
          order.payment_id,
          amount,
          currency,
          state,
        ]),
        /does not match|not confirmed/,
      );
    }
    assert.equal(await count(db, "agent_course_payment_events"), 0);
    assert.equal(await count(db, "lms_assignments"), 0);
    await db.query("select agent_course_payment_event($1,$2,$3,$4,$5,$6)", [
      "capture",
      "payment.captured",
      order.payment_id,
      9900,
      "GBP",
      "captured",
    ]);
    await event(db, "partial", "payment.partially_refunded", order.payment_id);
    assert.equal((await reserve(db)).status, "captured");
  } finally {
    await db.close();
  }
});

test("out-of-order captures from separate attempts retain both payments but never duplicate the same course assignment", async () => {
  const db = await fixture();
  try {
    const original = await reserve(db);
    await event(db, "failure", "payment.failed", original.payment_id);
    const retry = await reserve(db, "50000000-0000-4000-a000-000000000002");
    assert.notEqual(original.id, retry.id);
    await event(db, "late-capture", "payment.captured", original.payment_id);
    await event(db, "retry-capture", "payment.captured", retry.payment_id);
    assert.equal(await count(db, "lms_assignments"), 1);
    assert.equal(await count(db, "agent_course_orders"), 2);
    await event(
      db,
      "duplicate-payment-refund",
      "payment.refunded",
      retry.payment_id,
    );
    const programmes = await db.query<{ status: string }>(
      "select p.status from agent_course_orders o join lms_programmes p on p.id=o.programme_id where o.id=$1",
      [original.id],
    );
    assert.equal(programmes.rows[0].status, "active");
  } finally {
    await db.close();
  }
});
