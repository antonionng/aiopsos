import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { validateAssessment, assessmentSkills, projectSubmissionSchema } from "./assessment.ts";
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

async function aiFixture() {
 const db=await fixture();
 await db.exec(read("20261002110338_agent_course_ai_assessment.sql"));
 await db.exec(`update agent_course_offers set assessment_mode='ai',learning_pack='{"slug":"${slug}","version":"test-v1"}'; update lms_delivery_staff set state='revoked';`);
 const reserved=await db.query<{o:{id:string;payment_id:string}}>(`select agent_course_reserve_order('${buyer}','${buyerOrg}','${slug}','${request}','terms-1','stripe') as o`);
 const order=reserved.rows[0].o;
 await db.query(`select agent_course_payment_event('capture','payment.captured','${order.payment_id}',9900,'GBP','captured')`);
 return {db,order};
}
const scores=(low=false)=>({policy:"experrt-agent-ai-v1",passed:!low,skills:assessmentSkills.map((s,i)=>({id:s.id,score:low&&i===0?2:3,evidenceQuote:"Inspect this recorded example of the work.",feedback:"Evidence-specific feedback.",nextStep:"Check the next example."})),summary:"The project evidence was assessed.",limitations:["No independent live execution or authorship check."]});
test("AI orders do not require a human reviewer and preserve the purchased pack",async()=>{
 const {db,order}=await aiFixture();try {
  const row=await db.query<{assessment_mode:string;learning_pack:{version:string};assignment_id:string}>(`select assessment_mode,learning_pack,assignment_id from agent_course_orders where id='${order.id}'`);
  assert.equal(row.rows[0].assessment_mode,"ai");assert.equal(row.rows[0].learning_pack.version,"test-v1");assert.ok(row.rows[0].assignment_id);
  await db.exec("update agent_course_offers set assessment_mode='human'");
  await assert.rejects(db.query(`select agent_course_reserve_order('${buyer}','${buyerOrg}','${slug}',gen_random_uuid(),'terms-1','stripe')`),/assessment is not ready/);
 }finally{await db.close();}
});
test("each skill must pass, an attempt is idempotent and the certificate commits with the result",async()=>{
 const {db,order}=await aiFixture();try{
  const start=async(key:string)=> (await db.query<{a:{attempt:{id:string};claimed:boolean}}>(`select agent_course_assessment_start('${buyer}','${buyerOrg}','${order.id}','${key}','{"evidence":"test"}') a`)).rows[0].a;
  const key=crypto.randomUUID(),first=await start(key);assert.equal(first.claimed,true);assert.equal((await start(key)).claimed,false);
  const finish=async(id:string,r:unknown)=>db.query(`select agent_course_assessment_finish($1,$2,'test',10,10,null)`,[id,JSON.stringify(r)]);
  await assert.rejects(finish(first.attempt.id,{...scores(true),passed:true}),/pass rule/);
  assert.equal((await db.query<{state:string}>(`select state from agent_course_assessments where id='${first.attempt.id}'`)).rows[0].state,"running");
  await finish(first.attempt.id,scores(true));assert.equal((await db.query(`select * from agent_course_certificates`)).rows.length,0);
  const second=await start(crypto.randomUUID());await finish(second.attempt.id,scores());await finish(second.attempt.id,scores());
  const cert=await db.query<{learner_name:string;snapshot:{version:string}}>(`select learner_name,snapshot from agent_course_certificates`);
  assert.equal((await db.query("select * from agent_course_report_emails")).rows.length,2);
  assert.equal(cert.rows.length,1);assert.equal(cert.rows[0].learner_name,"Learner");assert.equal(cert.rows[0].snapshot.version,"test-v1");
  await assert.rejects(start(crypto.randomUUID()),/already been issued/);
 }finally{await db.close();}
});
test("refunded access, expired access and browser roles cannot issue assessments",async()=>{
 const {db,order}=await aiFixture();try{
  const start=()=>db.query(`select agent_course_assessment_start('${buyer}','${buyerOrg}','${order.id}',gen_random_uuid(),'{}')`);
  await db.exec(`update agent_course_orders set captured_at=now()-interval '13 months' where id='${order.id}'`);await assert.rejects(start(),/access has ended/);
  await db.exec(`update agent_course_orders set status='refunded',captured_at=now() where id='${order.id}'`);await assert.rejects(start(),/paid AI-assessed course/);
  await db.exec("set role authenticated");await assert.rejects(start(),/permission denied/);await assert.rejects(db.query("select * from agent_course_certificates"),/permission denied/);await assert.rejects(db.query("select * from agent_course_report_emails"),/permission denied/);
 }finally{await db.close();}
});
test("assessment output cannot compensate for a weak skill or cite invented evidence",()=>{
 const evidence=Object.fromEntries(assessmentSkills.map(s=>[s.id,"Inspect this recorded example of the work. ".repeat(4)]));
 const submission=projectSubmissionSchema.parse({evidence,changedCase:"Changed example analysis. ".repeat(8),declaration:true});
 const raw=(low=false)=>{const {policy,passed,...result}=scores(low);return result;};
 assert.equal(validateAssessment(raw(),submission).passed,true);assert.equal(validateAssessment(raw(true),submission).passed,false);
 const invented=raw();invented.skills[0].evidenceQuote="An invented quotation which is absent from the evidence.";assert.throws(()=>validateAssessment(invented,submission),/exact extract/);
 const duplicate=raw();duplicate.skills[1].id=duplicate.skills[0].id;assert.throws(()=>validateAssessment(duplicate,submission),/exactly once/);
});
