require('@next/env').loadEnvConfig(process.cwd());
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const {createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3012';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-lms-verification-'));fs.chmodSync(dir,0o700);const s={dir,orgs:[],users:[],cookies:{}};const save=()=>fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(s),{mode:0o600});save();console.log('Private fixture directory:',dir);
(async()=>{
 async function person(org,role){const email=crypto.randomUUID()+'@example.invalid',password=crypto.randomUUID();const u=await db.auth.admin.createUser({email,password,email_confirm:true});if(u.error)throw u.error;s.users.push(u.data.user.id);save();const p=await db.from('user_profiles').update({org_id:org,role}).eq('id',u.data.user.id);if(p.error)throw p.error;let cookies=[];const client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>cookies,setAll:values=>{cookies=values}}});const login=await client.auth.signInWithPassword({email,password});if(login.error)throw login.error;return {id:u.data.user.id,client,header:cookies.map(c=>c.name+'='+c.value).join('; ')};}


 for(const label of ['A','B']){const o=await db.from('organisations').insert({name:'Verification only: report isolation '+label}).select('id').single();if(o.error)throw o.error;s.orgs.push(o.data.id);save();}
 const owner=await person(s.orgs[0],'admin'),foreign=await person(s.orgs[1],'admin'),learner=await person(s.orgs[0],'user');
 const request=async(account,route)=>{const r=await fetch(base+route,{headers:{Cookie:account.header}});console.log('Report check:',route,r.status);return r;};
 const assessmentIds=[];
 for(let i=0;i<2;i++){
  const dept=await db.from('departments').insert({org_id:s.orgs[i],name:'Fixture operations',type:'operations'}).select('id').single();if(dept.error)throw dept.error;
  const assessment=await db.from('assessments').insert({org_id:s.orgs[i],created_by:i?foreign.id:owner.id,title:'Fixture assessment',status:'active'}).select('id').single();if(assessment.error)throw assessment.error;assessmentIds.push(assessment.data.id);
  for(const template of ['ai-maturity','training-needs']){
   const response=await db.from('assessment_responses').insert({assessment_id:assessment.data.id,user_id:learner.id,department_id:dept.data.id,template_id:template,confidence_score:i?4:1,practice_score:i?4:1,tools_score:i?4:1,responsible_score:i?4:1,culture_score:i?4:1,dimension_scores:{ai:i?99:11,technology:i?99:11,robotics:i?99:11},submitted_at:i?'2026-09-10T00:00:00Z':'2026-09-01T00:00:00Z'});if(response.error)throw response.error;
  }
 }


 const call=(actor,action,extra={})=>db.rpc('assessment_manage',{p_actor:actor.id,p_org:s.orgs[0],p_action:action,...extra});
 const created=await call(owner,'create',{p_title:'Atomic fixture',p_template:'ai-maturity'});if(created.error)throw created.error;assert.equal(created.data.org_id,s.orgs[0]);
 assert.equal((await call(learner,'create',{p_title:'Denied',p_template:'ai-maturity'})).error?.code,'42501');
 assert.equal((await call(owner,'delete',{p_id:assessmentIds[1]})).error?.code,'P0002');
 const response=await db.from('assessment_responses').select('id').eq('assessment_id',assessmentIds[0]).limit(1).single();if(response.error)throw response.error;
 const deleted=await call(owner,'response.delete',{p_id:assessmentIds[0],p_response:response.data.id});if(deleted.error)throw deleted.error;
 assert.equal((await call(owner,'response.delete',{p_id:assessmentIds[0],p_response:response.data.id})).error?.code,'P0002');
 const removed=await call(owner,'delete',{p_id:created.data.id});if(removed.error)throw removed.error;
 const deniedDirect=await owner.client.rpc('assessment_manage',{p_actor:owner.id,p_org:s.orgs[0],p_action:'create',p_title:'Denied direct',p_template:'ai-maturity'});assert(deniedDirect.error,'Client can call internal command');
 const revoked=await db.from('organisation_memberships').update({status:'revoked',revoked_at:new Date().toISOString()}).eq('user_id',owner.id);if(revoked.error)throw revoked.error;
 for(const action of ['create','delete','response.delete'])assert.equal((await call(owner,action,{p_id:assessmentIds[0],p_title:'Denied',p_template:'ai-maturity'})).error?.code,'42501');
 const retained=await db.from('assessments').select('id').eq('id',assessmentIds[0]);assert.equal(retained.data.length,1);
 console.log('PASS: atomic create/delete/response deletion, missing and foreign IDs, learner denial, revoked owner denial and service-only execution.');
})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1});
