/* Creates isolated synthetic workspaces, exercises the real authenticated API,
 * and saves browser state privately for visual acceptance. No email is sent. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@supabase/supabase-js');const {createServerClient}=require('@supabase/ssr');
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3000';
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-lms-verification-'));fs.chmodSync(dir,0o700);
 const state={dir,orgs:[],users:[],cookies:{}};const persist=()=>fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(state),{mode:0o600});persist();console.log('Private fixture directory:',dir);
 async function org(label){const {data,error}=await admin.from('organisations').insert({name:'Verification only: '+label,subscription_status:'active'}).select('id').single();if(error)throw new Error(error.message);state.orgs.push(data.id);persist();const wallet=await admin.from('credit_wallets').insert({org_id:data.id,balance:100});if(wallet.error)throw wallet.error;return data.id;}
 async function user(orgId,role,label){const password=crypto.randomUUID()+'Aa1!';const email=crypto.randomUUID()+'@example.invalid';const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error)throw new Error(error.message);state.users.push(data.user.id);persist();const profile=await admin.from('user_profiles').upsert({id:data.user.id,org_id:orgId,role,email,name:'Verification '+label});if(profile.error)throw new Error(profile.error.message);const jar=new Map();const auth=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>Array.from(jar.values()),setAll:items=>items.forEach(c=>jar.set(c.name,c))}});const signed=await auth.auth.signInWithPassword({email,password});if(signed.error)throw new Error(signed.error.message);const cookies=Array.from(jar.values());state.cookies[label]=cookies;persist();fs.writeFileSync(path.join(dir,label+'-browser.json'),JSON.stringify({cookies:cookies.map(c=>({name:c.name,value:c.value,domain:'localhost',path:'/',expires:Math.floor(Date.now()/1000)+3600,httpOnly:false,secure:false,sameSite:'Lax'})),origins:[]}),{mode:0o600});return {id:data.user.id,cookie:cookies.map(c=>`${c.name}=${c.value}`).join('; ')};}
 async function command(actor,action,payload={},expect=200){const response=await fetch(base+'/api/lms',{method:'POST',headers:{Cookie:actor.cookie,'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({action,payload}),redirect:'manual'});const result=await response.json();assert.equal(response.status,expect,`${action}: ${result.error||'Unexpected response'}`);return result;}
 const providerOrg=await org('provider'),employerOrg=await org('employer');const provider=await user(providerOrg,'admin','provider'),employer=await user(employerOrg,'admin','employer'),learner=await user(employerOrg,'user','learner');
 const ids=Array.from({length:3},()=>crypto.randomUUID());
 const content={title:'Verification: checking AI outputs',summary:'Synthetic course for acceptance checks.',category:'ai',outcomes:['Check source evidence'],activities:[{id:ids[0],kind:'lesson',title:'Start with a source',content:'Read the original source and compare its claim with the AI output.',minutes:5,options:[],correctOption:null,criteria:''},{id:ids[1],kind:'quiz',title:'Choose reliable evidence',content:'Which is the better evidence?',minutes:3,options:['An unsupported generated claim','The original document'],correctOption:1,criteria:''},{id:ids[2],kind:'practice',title:'Explain your checks',content:'Describe two checks you performed.',minutes:5,options:[],correctOption:null,criteria:'Names the original source and compares the claim.'}]};
 const c=await command(provider,'course.save',{content});const v=await command(provider,'course.publish',{id:c.id,revision:1});await command(employer,'course.get',{id:c.id},404);const connection=await command(provider,'client.request',{client_org_id:employerOrg});await command(employer,'client.respond',{id:connection.id,accept:true});const p=await command(provider,'programme.create',{title:'Verification programme',goal:'Evaluate a claim with source evidence',version_ids:[v.id],client_org_id:employerOrg,due_at:null});await command(employer,'programme.assign',{id:p.id,user_ids:[learner.id]});const overview=await command(learner,'overview');assert.equal(overview.can_manage,false);assert.equal(overview.courses.length,0);assert.equal(overview.assignments.length,1);const a=overview.assignments[0];state.assignmentId=a.id;state.programmeId=p.id;persist();const learning=await command(learner,'learning.get',{id:a.id});assert(!JSON.stringify(learning).includes('correctOption'));await command(learner,'learning.submit',{id:a.id,activity_id:ids[0]});await command(learner,'learning.submit',{id:a.id,activity_id:ids[1],option:1});const work=await command(learner,'learning.submit',{id:a.id,activity_id:ids[2],answer:'I read the original document and compared the claim with the source.'});await command(provider,'learning.review',{id:work.id,revision:1,decision:'passed',feedback:'Both source checks are explained.',observation_context:''});assert((await command(learner,'learning.get',{id:a.id})).assignment.completed_at);assert.equal((await command(employer,'record.get',{id:a.id})).history.length,4);console.log('PASS: authenticated provider → employer → learner → trainer → evidence flow');

 const second=await user(employerOrg,'user','second-learner');await command(employer,'programme.assign',{id:p.id,user_ids:[second.id]});
 const outsiderOrg=await org('unrelated'),outsider=await user(outsiderOrg,'admin','outsider');
 // Membership discovery is session-scoped and cannot switch legacy authority.
 for(const [actor,orgId,role] of [[learner,employerOrg,'learner'],[provider,providerOrg,'admin'],[outsider,outsiderOrg,'admin']]){
  const response=await fetch(base+'/api/workspaces/memberships',{headers:{Cookie:actor.cookie}});
  const membership=await response.json();assert.equal(response.status,200,membership.error);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.equal(membership.switchingEnabled,false);assert.equal(membership.memberships.length,1);
  assert.equal(membership.memberships[0].org_id,orgId);assert.equal(membership.memberships[0].role,role);
 }
 console.log('PASS: authenticated membership API isolation, roles and private caching');
 const catalogue=await admin.from('courses').select('id').limit(1).single();if(catalogue.error)throw catalogue.error;
 const cohort=await admin.from('cohorts').insert({course_id:catalogue.data.id,org_id:providerOrg,title:'Verification progress workshop',delivery_mode:'virtual',seat_limit:10}).select('id').single();if(cohort.error)throw cohort.error;state.cohortId=cohort.data.id;persist();
 for(const action of ['link','enrol']){const result=await admin.rpc('lms_live_delivery',{p_actor:provider.id,p_programme:p.id,p_cohort:state.cohortId,p_action:action});if(result.error)throw result.error;}
 const session=await admin.from('sessions').insert({cohort_id:state.cohortId,position:1,title:'Verification session',starts_at:'2026-01-01T09:00:00Z',ends_at:'2026-01-01T10:00:00Z'}).select('id').single();if(session.error)throw session.error;
 const enrolment=await admin.from('enrolments').select('id').eq('cohort_id',state.cohortId).eq('user_id',learner.id).single();if(enrolment.error)throw enrolment.error;
 const attendance=await admin.from('attendance').insert({enrolment_id:enrolment.data.id,session_id:session.data.id,status:'present'});if(attendance.error)throw attendance.error;
 const grade=await admin.from('grades').insert({enrolment_id:enrolment.data.id,score:80,max_score:100});if(grade.error)throw grade.error;
 async function report(actor,status=200){let r=await fetch(base+`/api/lms/programmes/${p.id}/progress`,{headers:{Cookie:actor.cookie}});if(r.status===401&&status===403)r=await fetch(base+`/api/lms/programmes/${p.id}/progress`,{headers:{Cookie:actor.cookie}});const d=await r.json();assert.equal(r.status,status,d.error);return d;}
 const mine=await report(learner);assert.equal(mine.records.length,1);assert.equal(mine.records[0].id,a.id);assert.equal(mine.records[0].live[0].gradePercent,80);assert.equal(mine.records[0].live[0].state,'ready_for_review');assert(!JSON.stringify(mine).includes('correctOption'));
 assert.equal(mine.records[0].journey.state,'certificate_review');assert.equal(mine.records[0].journey.completed,false);
 const peer=await report(second);assert.equal(peer.records.length,1);assert.notEqual(peer.records[0].id,a.id);assert.equal(peer.records[0].live[0].gradePercent,null);
 assert.equal((await report(provider)).records.length,2);assert.equal((await report(employer)).records.length,2);await report(outsider,403);
 console.log('PASS: learner isolation, provider/client scope, attendance, live grades, missing grades and no answer keys');
 const membership=await admin.from('organisation_memberships').select('id,status,revoked_at').eq('user_id',provider.id).eq('org_id',providerOrg).single();if(membership.error)throw membership.error;
 try{
  const revoked=await admin.from('organisation_memberships').update({status:'revoked',revoked_at:new Date().toISOString()}).eq('id',membership.data.id);if(revoked.error)throw revoked.error;
  await command(provider,'overview',{},403);
  console.log('PASS: same-session membership revocation blocks LMS commands');
 }finally{
  const restored=await admin.from('organisation_memberships').update({status:membership.data.status,revoked_at:membership.data.revoked_at}).eq('id',membership.data.id);if(restored.error)throw restored.error;
 }

})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1;});
