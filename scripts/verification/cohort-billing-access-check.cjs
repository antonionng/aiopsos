/* Uses only the isolated fixture created by lms-progress-check.cjs. No payments or messages. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const dir=process.argv[2];if(!dir||!path.basename(dir).startsWith('experrt-lms-verification-'))throw Error('Verification fixture required');
const fixture=JSON.parse(fs.readFileSync(path.join(dir,'fixture.json'),'utf8'));
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3000';
const client=label=>createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>fixture.cookies[label],setAll:()=>{}}});
async function request(label,url,body){return fetch(base+url,{method:body?'POST':'GET',headers:{Cookie:fixture.cookies[label].map(c=>`${c.name}=${c.value}`).join('; '),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});}
async function rows(label,table,column,id){const r=await client(label).from(table).select(column).eq(column,id);if(r.error)throw r.error;return r.data;}
(async()=>{
 const orgs=await db.from('organisations').select('id,name').in('id',fixture.orgs);if(orgs.error||orgs.data.length!==fixture.orgs.length||orgs.data.some(o=>!o.name.startsWith('Verification only: ')))throw Error('Fixture marker mismatch');
 const cohort=await db.from('cohorts').select('org_id').eq('id',fixture.cohortId).single();if(cohort.error||cohort.data.org_id!==fixture.orgs[0])throw Error('Fixture cohort mismatch');
 assert.equal((await rows('provider','cohorts','id',fixture.cohortId)).length,1);
 assert.equal((await rows('learner','cohorts','id',fixture.cohortId)).length,1);
 assert.equal((await rows('outsider','cohorts','id',fixture.cohortId)).length,0);
 const invoice=await db.from('billing_invoices').insert({org_id:fixture.orgs[0],status:'sent',created_by:fixture.users[0],total_amount:0}).select('id').single();if(invoice.error)throw invoice.error;
 try{
  assert.equal((await rows('provider','billing_invoices','id',invoice.data.id)).length,1);
  assert.equal((await rows('learner','billing_invoices','id',invoice.data.id)).length,0);
  assert.equal((await rows('outsider','billing_invoices','id',invoice.data.id)).length,0);
  const billing=await request('provider','/api/billing');assert.equal(billing.status,200);const data=await billing.json();assert(data.invoices.some(i=>i.id===invoice.data.id));assert.equal(data.creditBalance,100);
  const learnerBilling=await request('learner','/api/billing');assert.equal(learnerBilling.status,200);assert.deepEqual(Object.keys(await learnerBilling.json()),['plan']);
  assert.equal((await request('learner','/api/credits/checkout',{pack_id:crypto.randomUUID()})).status,403);
  console.log('PASS: provider/client cohort isolation, invoice isolation, billing audience and learner purchase denial');
  const f=await db.from('facilitators').insert({user_id:fixture.users[4],display_name:'Verification trainer'}).select('id').single();if(f.error)throw f.error;
  const assign=await db.from('cohorts').update({facilitator_id:f.data.id}).eq('id',fixture.cohortId);if(assign.error)throw assign.error;
  assert.equal((await rows('outsider','cohorts','id',fixture.cohortId)).length,1);
  assert.equal((await request('outsider',`/api/cohorts/${fixture.cohortId}/progress`)).status,200);
  console.log('PASS: explicitly assigned trainer retains cross-organisation delivery access');
  for(const [label,userId,orgId] of [['provider',fixture.users[0],fixture.orgs[0]],['outsider',fixture.users[4],fixture.orgs[2]]]){
   const m=await db.from('organisation_memberships').select('id,status,revoked_at').eq('user_id',userId).eq('org_id',orgId).single();if(m.error)throw m.error;
   try{
    const revoked=await db.from('organisation_memberships').update({status:'revoked',revoked_at:new Date().toISOString()}).eq('id',m.data.id);if(revoked.error)throw revoked.error;
    assert.equal((await rows(label,'cohorts','id',fixture.cohortId)).length,0);
    assert.equal((await rows(label,'billing_invoices','id',invoice.data.id)).length,0);
    assert.equal((await rows(label,'credit_wallets','org_id',orgId)).length,0);
    assert.equal((await request(label,'/api/billing')).status,403);
    assert([401,403].includes((await request(label,'/api/credits/checkout',{pack_id:crypto.randomUUID()})).status));
    assert([401,403].includes((await request(label,`/api/cohorts/${fixture.cohortId}/discussion`)).status));
   }finally{const r=await db.from('organisation_memberships').update({status:m.data.status,revoked_at:m.data.revoked_at}).eq('id',m.data.id);if(r.error)throw r.error;}
  }
  console.log('PASS: revoked provider/trainer sessions denied cohort, wall, wallet, invoice and purchase access');
 }finally{const r=await db.from('billing_invoices').delete().eq('id',invoice.data.id).eq('org_id',fixture.orgs[0]);if(r.error)throw r.error;}
})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1});
