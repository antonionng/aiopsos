/* Isolated synthetic demo and API acceptance. No email or real learner data. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3014';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-delivery-'));fs.chmodSync(dir,0o700);
const state={orgs:[],users:[],actors:{},programme:null};
function save(){fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(state),{mode:0o600});}
async function org(name){const {data,error}=await admin.from('organisations').insert({name:'Synthetic demo: '+name,subscription_status:'active'}).select('id').single();if(error)throw error;state.orgs.push(data.id);save();return data.id;}
async function user(orgId,role,label){const email=crypto.randomUUID()+'@example.invalid',password=crypto.randomUUID()+'Aa1!';const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error)throw error;state.users.push(data.user.id);save();const p=await admin.from('user_profiles').upsert({id:data.user.id,org_id:orgId,role,email,name:'Demo '+label});if(p.error)throw p.error;const jar=new Map();const client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>[...jar.values()],setAll:items=>items.forEach(c=>jar.set(c.name,c))}});const signed=await client.auth.signInWithPassword({email,password});if(signed.error)throw signed.error;const cookies=[...jar.values()];const actor={id:data.user.id,email,orgId,cookie:cookies.map(c=>c.name+'='+c.value).join('; ')};state.actors[label]=actor;save();fs.writeFileSync(path.join(dir,label+'-browser.json'),JSON.stringify({cookies:cookies.map(c=>({name:c.name,value:c.value,domain:'localhost',path:'/',expires:Math.floor(Date.now()/1000)+3600,httpOnly:false,secure:false,sameSite:'Lax'})),origins:[]}),{mode:0o600});return actor;}
async function request(actor,url,body,status=200){const r=await fetch(base+url,{method:body?'POST':'GET',headers:{Cookie:actor.cookie,...(body?{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()}:{})},...(body?{body:JSON.stringify(body)}:{})});const raw=await r.text();let d;try{d=JSON.parse(raw);}catch{d=raw;}assert.equal(r.status,status,typeof d==='object'?d.error:String(d).slice(0,120));return d;}
const cmd=(a,action,payload={},status=200)=>request(a,'/api/lms',{action,payload},status);
(async()=>{
 console.log('Private synthetic demo:',dir);
 const providerOrg=await org('Training provider'),bankOrg=await org('Bank'),trainerOrg=await org('Independent trainers');
 const manager=await user(providerOrg,'admin','provider'),bank=await user(bankOrg,'admin','bank'),trainer=await user(trainerOrg,'user','trainer'),panel=await user(trainerOrg,'user','panel'),learner=await user(bankOrg,'user','learner'),peer=await user(bankOrg,'user','peer');
 const ids={baseline:crypto.randomUUID(),core:crypto.randomUUID(),pathway_a:crypto.randomUUID(),pathway_b:crypto.randomUUID(),capstone:crypto.randomUUID(),criterion:crypto.randomUUID()};state.ids=ids;save();
 const content={title:'Sample banking analytics programme',summary:'Synthetic demonstration only. Not an accredited banking qualification.',category:'technology',outcomes:['Explain and validate a simple SQL result'],activities:Object.entries(ids).filter(([k])=>k!=='criterion').map(([kind,id])=>({id,title:{baseline:'Entry SQL assessment',core:'Data foundations',pathway_a:'Applied analytics',pathway_b:'Modelling extension',capstone:'Banking analytics final project'}[kind],kind:['baseline','capstone'].includes(kind)?'practice':'lesson',content:'Synthetic exercise: explain how you would total transaction values by account and check your result. No bank data is used.',minutes:20,criteria:['baseline','capstone'].includes(kind)?'Show correct grouping and validation.':'',options:[],correctOption:null}))};
 const course=await cmd(manager,'course.save',{content});const version=await cmd(manager,'course.publish',{id:course.id,revision:1});
 const connection=await cmd(manager,'client.request',{client_org_id:bankOrg});await cmd(bank,'client.respond',{id:connection.id,accept:true});
 const p=await cmd(manager,'programme.create',{title:'Sample: Banking analytics delivery',goal:'Synthetic demonstration of the provider, bank, trainer, panel and learner journey.',version_ids:[version.id],client_org_id:bankOrg,due_at:null});state.programme=p.id;save();
 await cmd(bank,'programme.assign',{id:p.id,user_ids:[learner.id,peer.id]});
 const workspace='/api/lms/programmes/'+p.id+'/workspace';const delivery=(a,b,status=200)=>request(a,workspace,b,status);
 await request(trainer,workspace,null,403);
 for(const [who,role] of [[trainer,'trainer'],[panel,'reviewer']]){await delivery(manager,{action:'staff.invite',email:who.email,role});await request(who,workspace,null,403);await delivery(who,{action:'staff.accept'});}
 const plan={brief:'Prepare a practical cohort with an entry assessment, common learning, differentiated pathways and independent final review.',targetRoles:'Analyst trainees with basic spreadsheet skills',hours:120,labUrl:'https://example.com/training-lab',minimumPanelReviews:1,activities:content.activities.map(a=>({id:a.id,stage:Object.keys(ids).find(k=>ids[k]===a.id),passPercent:60,criteria:a.kind==='practice'?[{id:ids.criterion,skill:'SQL',description:'Group transactions accurately and explain validation checks.'}]:[]}))};
 await delivery(trainer,{action:'plan.save',revision:0,plan});
 await delivery(manager,{action:'plan.release',revision:1},403);
 await delivery(manager,{action:'plan.approve',revision:1});await delivery(bank,{action:'plan.approve',revision:1});await delivery(manager,{action:'plan.release',revision:1});
 let w=await request(learner,workspace);assert.equal(w.records.length,1);const assignment=w.records[0].id;state.assignment=assignment;save();
 const l=await cmd(learner,'learning.get',{id:assignment});assert.equal(l.activities.length,2);assert(!JSON.stringify(l).includes('correctOption'));
 const form=new FormData();form.set('assignment_id',assignment);form.set('activity_id',ids.baseline);form.set('file',new Blob(['SELECT account_id, SUM(amount) FROM transactions GROUP BY account_id;'],{type:'text/plain'}),'entry-query.sql');
 const uploaded=await fetch(base+'/api/lms/programmes/'+p.id+'/files',{method:'POST',headers:{Cookie:learner.cookie},body:form});const f=await uploaded.json();assert.equal(uploaded.status,201,f.error);state.file=f.id;save();
 let submission=await cmd(learner,'learning.submit',{id:assignment,activity_id:ids.baseline,answer:'I would group transaction amounts by account and compare totals to the original dataset.'});
 let read=await fetch(base+'/api/lms/programmes/'+p.id+'/files?file='+f.id,{headers:{Cookie:trainer.cookie}});assert.equal(read.status,200);assert((await read.text()).includes('SELECT account_id'));
 await request(peer,'/api/lms/programmes/'+p.id+'/files?file='+f.id,null,403);
 await delivery(trainer,{action:'review',progress_id:submission.id,revision:1,scores:{[ids.criterion]:1},feedback:'Entry assessment shows a useful starting point. Practise validation.',decision:'returned',observation_context:''});
 await cmd(learner,'learning.submit',{id:assignment,activity_id:ids.core,answer:'Read the foundation lesson'});
 await delivery(trainer,{action:'decision',assignment_id:assignment,kind:'pathway_a',reason:'Common work and entry evidence reviewed; applied analytics matches the learner’s development needs.'});
 await cmd(learner,'learning.submit',{id:assignment,activity_id:ids.pathway_b,answer:'Wrong path'},403);
 await cmd(learner,'learning.submit',{id:assignment,activity_id:ids.pathway_a,answer:'Completed the applied lesson'});
 submission=await cmd(learner,'learning.submit',{id:assignment,activity_id:ids.capstone,answer:'My final solution groups accounts, handles missing values and reconciles totals independently.'});
 await delivery(panel,{action:'review',progress_id:submission.id,revision:1,scores:{[ids.criterion]:3},feedback:'The independent panel review supports the demonstrated SQL skill.',decision:'panel',observation_context:''});
 await delivery(trainer,{action:'review',progress_id:submission.id,revision:1,scores:{[ids.criterion]:3},feedback:'Trainer agrees with the panel evidence. The final project meets the criteria.',decision:'passed',observation_context:''});
 await delivery(manager,{action:'decision',assignment_id:assignment,kind:'ready',reason:'Assessed programme requirements and independent panel review are complete. Employer placement remains a separate decision.'});
 // A linked live group uses the existing academy course model and explicit enrolment.
 const catalogue=await admin.from('courses').select('id').eq('status','published').limit(1).single();if(catalogue.error)throw catalogue.error;
 const cohort=await admin.from('cohorts').insert({course_id:catalogue.data.id,org_id:providerOrg,title:'Synthetic demo live group',delivery_mode:'virtual',seat_limit:20,status:'scheduled'}).select('id').single();if(cohort.error)throw cohort.error;state.cohort=cohort.data.id;save();
 await request(manager,'/api/lms/programmes/'+p.id+'/delivery',{action:'link',cohort_id:cohort.data.id});await request(manager,'/api/lms/programmes/'+p.id+'/delivery',{action:'enrol',cohort_id:cohort.data.id});
 const session=await delivery(trainer,{action:'session.create',cohort_id:cohort.data.id,title:'Synthetic workshop and evidence review',starts_at:new Date(Date.now()-7200000).toISOString(),ends_at:new Date(Date.now()-3600000).toISOString(),join_url:'https://example.com/demo-meeting'});
 const live=await request(trainer,workspace+'?view=live');const reg=live.groups[0].sessions[0].register.find(x=>x.assignment_id===assignment);
 await delivery(trainer,{action:'attendance.save',session_id:session.id,enrolment_id:reg.enrolment_id,status:'present',expected_status:null});
 await delivery(trainer,{action:'attendance.save',session_id:session.id,enrolment_id:reg.enrolment_id,status:'absent',expected_status:null},409);
 w=await request(learner,workspace);assert(w.records[0].completed_at);assert.equal(w.records[0].files[0].attempt_id!==null,true);
 const progress=await request(bank,'/api/lms/programmes/'+p.id+'/progress');assert.equal(progress.records.find(r=>r.id===assignment).course.total,4);assert.equal(progress.records.find(r=>r.id===assignment).course.passed,4);
 const report=await request(bank,'/api/lms/programmes/'+p.id+'/report');assert(report.includes('25%')&&report.includes('75%')&&report.includes('present')&&report.includes('entry-query.sql'));
 const csv=await request(bank,'/api/lms/programmes/'+p.id+'/report?format=csv');assert(csv.includes('50'));
 await delivery(manager,{action:'staff.revoke',user_id:trainer.id});await request(trainer,workspace,null,403);
 await delivery(manager,{action:'staff.invite',email:trainer.email,role:'trainer'});await delivery(trainer,{action:'staff.accept'});
 console.log('PASS: authenticated preparation, consent, roles, uploads/downloads, assessment, pathways, panel, readiness, live delivery, attendance conflict protection, reports and revocation');console.log('Demo programme:',p.id);save();
})().catch(e=>{console.error('FAILED:',e.message);process.exitCode=1;});
