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
  await db.exec(`alter table organisations add column name text; alter table organisations alter column id set default gen_random_uuid(); alter table organisation_memberships add column source text,add column revoked_at timestamptz, add constraint guest_test_membership_unique unique(user_id,org_id); alter table organisations add column owner_id uuid; create schema auth; create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,banned_until timestamptz); insert into auth.users values('${buyer}','learner@example.invalid',now(),null),('${reviewer}','other@example.invalid',now(),null); alter table agent_course_orders add column stripe_session_id text unique, add column stripe_intent_id text unique;`);
  await db.exec(read("20261002110338_agent_course_ai_assessment.sql"));
  await db.exec(`update agent_course_offers set assessment_mode='ai',learning_pack='{"slug":"${slug}","version":"purchased-v1"}';`);
  await db.exec(read("20261002154616_agent_course_guest_checkout.sql"));
  await db.exec(read("20261002155331_agent_guest_membership_sync.sql"));
  const membership = read("20260909123459_organisation_membership_foundation.sql");
  await db.exec("create function public.sync_legacy_memberships" + membership.split("create function public.sync_legacy_memberships")[1].split("create function public.sync_owner_memberships")[0]);
  return db;
}

const hash = "a".repeat(64);
async function guest(db: PGlite) {
 return (await db.query<{g:{id:string;payment_id:string;amount:number}}>(`select agent_course_guest_reserve($1,$2,$3,$4) g`,[slug,request,hash,'terms-1'])).rows[0].g;
}
async function capture(db: PGlite,payment:string,type='captured',amount=9900){return db.query(`select agent_course_guest_payment($1,$2,$3,$4,'GBP','cs_test_guest','pi_test_guest','learner@example.invalid','Learner')`,['event_'+type,payment,type,amount]);}
async function claim(db:PGlite,id:string,token=hash,user=buyer){return (await db.query<{id:string}>(`select agent_course_guest_claim($1,$2,$3) id`,[id,token,user])).rows[0].id;}
test('guest purchase requires confirmed payment, freezes the pack and claims only once',async()=>{
 const db=await fixture();try{
 const g=await guest(db); assert.equal(g.amount,9900);assert.equal((await guest(db)).id,g.id);
 await assert.rejects(claim(db,g.id),/confirmed purchase/);
 await assert.rejects(capture(db,g.payment_id,'captured',1),/does not match/);
 await capture(db,g.payment_id);await capture(db,g.payment_id);
 await assert.rejects(claim(db,g.id,'b'.repeat(64)),/confirmed purchase/);
 await assert.rejects(claim(db,g.id,hash,reviewer),/email used at checkout/);
 await db.exec(`update agent_course_offers set learning_pack='{"slug":"${slug}","version":"new-v2"}'; update agent_course_guest_checkouts set paid_at=now()-interval '2 days'`);
 const id=await claim(db,g.id);assert.equal(await claim(db,g.id),id);
 const o=(await db.query<{learning_pack:{version:string};assignment_id:string;age:boolean}>(`select learning_pack,assignment_id,captured_at<now()-interval '1 day' age from agent_course_orders where id=$1`,[id])).rows[0];
 assert.equal(o.learning_pack.version,'purchased-v1');assert(o.assignment_id);assert(o.age);
 assert.equal((await db.query<{n:number}>('select count(*)::int n from lms_assignments')).rows[0].n,1);
 await capture(db,g.payment_id,'refunded'); await assert.rejects(claim(db,g.id),/confirmed purchase/);
 assert.equal((await db.query<{status:string}>('select status from agent_course_orders where id=$1',[id])).rows[0].status,'refunded');
 }finally{await db.close();}
});
test('a new learner gets a personal workspace while suspended access and refunded payments stay blocked',async()=>{
 const db=await fixture();try{
 const g=await guest(db);await capture(db,g.payment_id);
 await db.exec(`update organisation_memberships set status='suspended' where user_id='${buyer}'`);await assert.rejects(claim(db,g.id),/membership/);
 await db.exec(`delete from organisation_memberships where user_id='${buyer}'; update user_profiles set org_id=null where id='${buyer}'`);
 assert(await claim(db,g.id));assert.equal((await db.query<{role:string}>('select role from organisation_memberships where user_id=$1',[buyer])).rows[0].role,'learner');
 }finally{await db.close();}
});
test('guest checkout data and claim functions are inaccessible to browser database roles',async()=>{
 const db=await fixture();try{
 await db.exec('set role anon');await assert.rejects(db.query('select * from agent_course_guest_checkouts'),/permission denied/);
 await assert.rejects(db.query(`select agent_course_guest_reserve('${slug}','${request}','${hash}','terms-1')`),/permission denied/);
 await db.exec('reset role; set role authenticated');await assert.rejects(db.query('select * from agent_course_guest_checkouts'),/permission denied/);
 }finally{await db.close();}
});
