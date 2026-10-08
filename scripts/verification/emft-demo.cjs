/* Additive, resumable demonstration. Credentials stay in a private local directory. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const {buildProgramme}=require('./emft-programme-content.cjs');
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3014';
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const dir=process.argv[2]||fs.mkdtempSync(path.join(os.tmpdir(),'experrt-emft-'));fs.chmodSync(dir,0o700);
const file=path.join(dir,'fixture.json');
const state=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{orgs:{},actors:{},steps:{},programme:null,curriculum:buildProgramme()};
const save=()=>fs.writeFileSync(file,JSON.stringify(state),{mode:0o600});
async function step(key,fn){if(state.steps[key])return state.steps[key];const value=await fn();state.steps[key]=value||true;save();return value;}
async function org(key,title){if(state.orgs[key])return state.orgs[key];const {data,error}=await admin.from('organisations').insert({name:title,subscription_status:'active'}).select('id').single();if(error)throw error;state.orgs[key]=data.id;save();return data.id;}
async function actor(key,orgId,role,name,signIn=true){
 if(!state.actors[key]){const email=`emft-demo-${crypto.randomUUID()}@example.invalid`,password=crypto.randomUUID()+'Aa1!';const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error)throw error;state.actors[key]={id:data.user.id,email,password,orgId,role,name};save();}
 const a=state.actors[key];const profile=await admin.from('user_profiles').upsert({id:a.id,org_id:orgId,role,email:a.email,name});if(profile.error)throw profile.error;
 if(signIn){const jar=new Map(),client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>[...jar.values()],setAll:items=>items.forEach(c=>jar.set(c.name,c))}});const login=await client.auth.signInWithPassword({email:a.email,password:a.password});if(login.error)throw login.error;const cookies=[...jar.values()];a.cookie=cookies.map(c=>c.name+'='+c.value).join('; ');fs.writeFileSync(path.join(dir,key+'-browser.json'),JSON.stringify({cookies:cookies.map(c=>({name:c.name,value:c.value,domain:new URL(base).hostname,path:'/',expires:Math.floor(Date.now()/1000)+3600,httpOnly:false,secure:base.startsWith('https:'),sameSite:'Lax'})),origins:[]}),{mode:0o600});}
 save();return a;
}
async function req(a,url,body,status=200,key=crypto.randomUUID()){
 const r=await fetch(base+url,{method:body?'POST':'GET',headers:{Cookie:a.cookie,...(body?{'Content-Type':'application/json','Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});
 const raw=await r.text();let d;try{d=JSON.parse(raw);}catch{d=raw;}assert.equal(r.status,status,`${url}: ${typeof d==='object'?d.error:raw.slice(0,100)}`);return d;
}
const cmd=(a,action,payload={},status=200,key)=>req(a,'/api/lms',{action,payload},status,key);
(async()=>{
 console.log('Private demo workspace:',dir);save();
 const providerOrg=await org('provider','EMFT · Demonstration provider'),bankOrg=await org('bank','Client bank · Demonstration'),trainerOrg=await org('trainer','Independent training team · Demonstration');
 const provider=await actor('provider',providerOrg,'admin','Demo · EMFT programme lead'),bank=await actor('bank',bankOrg,'admin','Demo · Bank learning sponsor'),trainer=await actor('trainer',trainerOrg,'user','Demo · Lead trainer'),panel=await actor('panel',trainerOrg,'user','Demo · Independent bank reviewer');
 const learnerA=await actor('learnerA',bankOrg,'user','Demo · Maya Patel'),learnerB=await actor('learnerB',bankOrg,'user','Demo · Daniel Mensah'),support=await actor('support',bankOrg,'user','Demo · Sara Khan'),pending=await actor('pending',bankOrg,'user','Demo · James Okafor'),starter=await actor('starter',bankOrg,'user','Demo · Sofia Costa');
 for(let i=6;i<=20;i++)await actor('learner'+i,bankOrg,'user','Demo · Learner '+String(i).padStart(2,'0'),false);
 console.log('Ready: provider, bank, trainer, reviewer and 20 synthetic learners.');
 const {content,plan,mappings,rubric}=state.curriculum;
 const course=await step('course',()=>cmd(provider,'course.save',{content}));
 const version=await step('publish',()=>cmd(provider,'course.publish',{id:course.id,revision:1}));
 const connection=await step('connection',()=>cmd(provider,'client.request',{client_org_id:bankOrg}));
 await step('consent',()=>cmd(bank,'client.respond',{id:connection.id,accept:true}));
 const programme=await step('programme',()=>cmd(provider,'programme.create',{title:'EMFT · Banking Analytics & AI | 12-week demo',goal:'From data foundations to a bank-panel capstone. One programme for preparation, teaching, evidence, assessment and outcomes. All learner records and results shown here are simulated.',version_ids:[version.id],client_org_id:bankOrg,due_at:null}));state.programme=programme.id;save();
 const wurl='/api/lms/programmes/'+programme.id+'/workspace',delivery=(a,b,status=200)=>req(a,wurl,b,status);
 const learners=Object.values(state.actors).filter(a=>a.orgId===bankOrg&&a.role==='user');
 await step('assign',()=>cmd(bank,'programme.assign',{id:programme.id,user_ids:learners.map(a=>a.id)}));
 for(const [who,key,role] of [[trainer,'trainer','trainer'],[panel,'panel','reviewer']])await step('invite-'+key,async()=>{await delivery(provider,{action:'staff.invite',email:who.email,role});await req(who,wurl,null,403);return delivery(who,{action:'staff.accept'});});
 await step('plan',()=>delivery(trainer,{action:'plan.save',revision:0,plan}));
 await step('provider-approval',()=>delivery(provider,{action:'plan.approve',revision:1}));
 await step('bank-approval',()=>delivery(bank,{action:'plan.approve',revision:1}));
 await step('release',()=>delivery(provider,{action:'plan.release',revision:1}));
 console.log('Ready: 16 activities, materials, rubrics, client approval and released plan.');
 async function assignment(a){const w=await req(a,wurl);assert.equal(w.records.length,1);return w.records[0].id;}
 const assignments={};for(const [key,a] of [['learnerA',learnerA],['learnerB',learnerB],['support',support],['pending',pending],['starter',starter]])assignments[key]=await assignment(a);state.assignments=assignments;save();
 const scores=n=>Object.fromEntries(rubric.map(c=>[c.id,n]));
 const submissionText='SIMULATED DEMONSTRATION EVIDENCE. Total GBP 2,800; A01 200; A02 1,000; A03 500; A04 1,100. I checked transaction keys, missing identifiers, currency consistency and reconciliation. The alert flag is not proof of fraud. The sample cannot support model-performance or credit decisions. A bank owner must approve controls and operational use.';
 async function submitAndReview(key,a,activity,n=3,decision='passed'){
  const submitted=await step(key+'-submit',()=>cmd(a,'learning.submit',{id:assignments[Object.keys(state.actors).find(k=>state.actors[k].id===a.id)],activity_id:activity.id,answer:submissionText}));
  if(activity.kind==='practice'||activity.kind==='observation')await step(key+'-review',()=>delivery(trainer,{action:'review',progress_id:submitted.id,revision:1,scores:scores(n),feedback:n===1?'Simulated entry assessment: establish a stronger reconciliation method and explain limitations. This records a starting point, not failure.':'Simulated assessment: reconciled evidence, a justified method and clearly stated limitations meet the published criteria.',decision,observation_context:''}));
  return submitted;
 }
 async function attach(key,a,activityId){return step(key,async()=>{const form=new FormData();form.set('assignment_id',assignments[Object.keys(state.actors).find(k=>state.actors[k].id===a.id)]);form.set('activity_id',activityId);form.set('file',new Blob(['-- SYNTHETIC DEMONSTRATION ONLY\nSELECT account_id, SUM(amount) AS total FROM transactions GROUP BY account_id;\n-- Expected total 2800 GBP. No real bank data.']),'synthetic-reconciliation.sql');const r=await fetch(base+'/api/lms/programmes/'+programme.id+'/files',{method:'POST',headers:{Cookie:a.cookie},body:form});const d=await r.json();assert.equal(r.status,201,d.error);return d;});}
 const entry=content.activities[0];
 for(const [key,a,route] of [['learnerA',learnerA,'pathway_a'],['learnerB',learnerB,'pathway_b']]){
  await attach(key+'-entry-file',a,entry.id);
  for(const map of mappings.filter(m=>['baseline','core'].includes(m.stage)))await submitAndReview(key+'-'+map.key,a,content.activities.find(x=>x.id===map.id),map.stage==='baseline'?1:3,map.stage==='baseline'?'returned':'passed');
  await step(key+'-route',()=>delivery(trainer,{action:'decision',assignment_id:assignments[key],kind:route,reason:'Simulated week 8 decision: common work assessed, learner preference discussed, and '+(route==='pathway_a'?'applied analytics and governance':'modelling and AI design')+' selected. No employment grade is implied.'}));
  const learning=await cmd(a,'learning.get',{id:assignments[key]});assert(!learning.activities.some(x=>mappings.find(m=>m.id===x.id)?.stage===(route==='pathway_a'?'pathway_b':'pathway_a')));
  for(const map of mappings.filter(m=>m.stage===route))await submitAndReview(key+'-'+map.key,a,content.activities.find(x=>x.id===map.id));
  const final=mappings.find(m=>m.stage==='capstone');await attach(key+'-final-file',a,final.id);
  const submitted=await step(key+'-final-submit',()=>cmd(a,'learning.submit',{id:assignments[key],activity_id:final.id,answer:submissionText+' Final proposal: named owner, documented approval, exception escalation and reproducible evidence.'}));
  await step(key+'-panel',()=>delivery(panel,{action:'review',progress_id:submitted.id,revision:1,scores:scores(3),feedback:'Simulated independent panel review: methods, limitations and proposed controls are explained clearly. The project meets the demonstration criteria.',decision:'panel',observation_context:''}));
  await step(key+'-final-review',()=>delivery(trainer,{action:'review',progress_id:submitted.id,revision:1,scores:scores(3),feedback:'Simulated trainer assessment: panel evidence reviewed and final-project criteria met.',decision:'passed',observation_context:''}));
  await step(key+'-ready',()=>delivery(provider,{action:'decision',assignment_id:assignments[key],kind:'ready',reason:'Simulated sign-off: assessed coursework and independent panel review complete. Bank hiring, placement and grade remain separate decisions.'}));
  console.log('Verified complete journey:',route);
 }
 await submitAndReview('support-entry',support,entry,1,'returned');
 const w4=content.activities.find(a=>a.id===mappings.find(m=>m.key==='w4').id);
 await submitAndReview('support-w4',support,w4,1,'returned');
 await step('support-decision',()=>delivery(trainer,{action:'decision',assignment_id:assignments.support,kind:'support',reason:'Simulated support plan: attend a reconciliation clinic and resubmit the foundation checkpoint with a clear explanation of missing-value checks.'}));
 await step('pending-entry',()=>cmd(pending,'learning.submit',{id:assignments.pending,activity_id:entry.id,answer:'SIMULATED PENDING WORK: grouped transactions and found total GBP 2,800. Please review my quality checks.'}));
 // Live delivery still uses the academy catalogue; the full curriculum is the programme version above.
 const cohort=await step('cohort',async()=>{const c=await admin.from('courses').select('id').eq('status','published').limit(1).single();if(c.error)throw c.error;const r=await admin.from('cohorts').insert({course_id:c.data.id,org_id:providerOrg,title:'EMFT demonstration · 20-seat teaching cohort',delivery_mode:'virtual',seat_limit:20,status:'scheduled'}).select('id').single();if(r.error)throw r.error;return r.data;});state.cohort=cohort.id;save();
 await step('link',()=>req(provider,'/api/lms/programmes/'+programme.id+'/delivery',{action:'link',cohort_id:cohort.id}));
 await step('enrol',()=>req(provider,'/api/lms/programmes/'+programme.id+'/delivery',{action:'enrol',cohort_id:cohort.id}));
 const sessionTitles=['SQL and data induction','Python preparation lab','Statistics and interpretation','Foundation evidence clinic','Monitoring and triage','KRIs and management information','Governance and credit context','Pathway discussion and feedback','Specialist pathway workshop','Validation and automation clinic','Portfolio and model-risk review','Independent capstone panel'];
 for(let week=1;week<=12;week++)await step('session-'+week,()=>{const start=new Date('2026-09-21T09:00:00.000Z');start.setUTCDate(start.getUTCDate()+(week-1)*7);return delivery(trainer,{action:'session.create',cohort_id:cohort.id,title:`Week ${week} · ${sessionTitles[week-1]} (demo)`,starts_at:start.toISOString(),ends_at:new Date(+start+7200000).toISOString(),join_url:''});});
 await step('orientation',()=>delivery(trainer,{action:'session.create',cohort_id:cohort.id,title:'Demonstration orientation and attendance check',starts_at:new Date(Date.now()-7200000).toISOString(),ends_at:new Date(Date.now()-3600000).toISOString(),join_url:''}));
 const live=await req(trainer,wurl+'?view=live'),session=live.groups[0].sessions.find(s=>s.id===state.steps.orientation.id);
 for(const a of [learnerA,learnerB,support]){const reg=session.register.find(r=>r.assignment_id===assignments[Object.keys(state.actors).find(k=>state.actors[k].id===a.id)]);await step('attendance-'+a.id,()=>delivery(trainer,{action:'attendance.save',session_id:session.id,enrolment_id:reg.enrolment_id,status:a.id===support.id?'late':'present',expected_status:null}));}
 const progress=await req(bank,'/api/lms/programmes/'+programme.id+'/progress');assert.equal(progress.records.length,20);assert.equal(progress.records.filter(r=>r.course.completedAt).length,2);
 for(const key of ['learnerA','learnerB']){const w=await req(state.actors[key],wurl);assert(w.records[0].completed_at);assert.equal(w.records.length,1);assert.equal(w.records[0].files.length,2);assert(w.records[0].files.every(f=>f.attempt_id));}
 const bankReport=await req(bank,'/api/lms/programmes/'+programme.id+'/report');assert(bankReport.includes('25%')&&bankReport.includes('75%')&&bankReport.includes('present'));
 await req(starter,'/api/lms/programmes/'+programme.id+'/files?file='+state.steps['learnerA-final-file'].id,null,403);
 state.verified_at=new Date().toISOString();save();
 fs.mkdirSync('output/emft-demo',{recursive:true});fs.writeFileSync('output/emft-demo/manifest.json',JSON.stringify({programme:programme.id,cohort:cohort.id,learners:20,activities:content.activities.length,sessions:13,verified_at:state.verified_at,local_url:base+'/dashboard/programmes/'+programme.id},null,2));
 console.log('PASS: 20 learners, both pathways, support and pending work, independent panel, evidence, sessions, attendance, bank reporting and learner isolation.');
 console.log('Programme:',base+'/dashboard/programmes/'+programme.id);
})().catch(e=>{console.error('FAILED:',e.message);process.exitCode=1;});
