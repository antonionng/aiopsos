const fs=require('node:fs'),assert=require('node:assert/strict');
require('@next/env').loadEnvConfig(process.cwd());
const {createServerClient}=require('@supabase/ssr');
const dir=process.argv[2],file=dir+'/fixture.json',state=JSON.parse(fs.readFileSync(file));
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3014';
async function login(key){const a=state.actors[key],jar=new Map(),client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>[...jar.values()],setAll:items=>items.forEach(c=>jar.set(c.name,c))}});const r=await client.auth.signInWithPassword({email:a.email,password:a.password});if(r.error)throw r.error;a.cookie=[...jar.values()].map(c=>c.name+'='+c.value).join('; ');fs.writeFileSync(dir+'/'+key+'-browser.json',JSON.stringify({cookies:[...jar.values()].map(c=>({name:c.name,value:c.value,domain:new URL(base).hostname,path:'/',expires:Math.floor(Date.now()/1000)+3600,httpOnly:false,secure:false,sameSite:'Lax'})),origins:[]}),{mode:0o600});return a;}
async function req(a,url,body,expected=200){const r=await fetch(base+url,{method:body?'POST':'GET',headers:{Cookie:a.cookie,...(body?{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(120000)});const d=await r.json();assert.equal(r.status,expected,d.error);return d;}
(async()=>{
 const trainer=await login('trainer'),learner=await login('starter'),bank=await login('bank'),panel=await login('panel');
 fs.writeFileSync(file,JSON.stringify(state),{mode:0o600});
 const url='/api/lms/programmes/'+state.programme;
 const workspace=await req(learner,url+'/workspace');
 let progress=workspace.records[0].progress.find(p=>p.state==='submitted');
 if(!progress){
  const activity=state.curriculum.content.activities[0];
  const form=new FormData();form.set('assignment_id',workspace.records[0].id);form.set('activity_id',activity.id);form.set('file',new Blob(['-- SYNTHETIC DEMO ONLY\nSELECT account_id, SUM(amount) AS total FROM transactions GROUP BY account_id;\n-- Check null account IDs, duplicate transaction IDs and currency before aggregating.\n']),'banking-lab.sql');
  const upload=await fetch(base+url+'/files',{method:'POST',headers:{Cookie:learner.cookie},body:form});assert.equal(upload.status,201);
  const submitted=await req(learner,'/api/lms',{action:'learning.submit',payload:{id:workspace.records[0].id,activity_id:activity.id,answer:'Synthetic demonstration. My SQL groups transactions by account. I would reconcile the grand total and check missing accounts, duplicate IDs and mixed currencies. I have not executed the code here.'}});
  progress={id:submitted.id};
 }

 for(const actor of [learner,bank,panel]) await req(actor,url+'/ai-review',{progress_id:progress.id},403);
 console.log('PASS: learner, client sponsor and panel cannot access private AI drafts.');
 let draft=await req(trainer,url+'/ai-review',{progress_id:progress.id});
 for(let i=0;i<25&&['queued','running'].includes(draft.status);i++){await new Promise(r=>setTimeout(r,4000));draft=await req(trainer,url+'/ai-review',{progress_id:progress.id});}
 assert.equal(draft.status,'draft',draft.error||'AI did not produce draft');assert(draft.insights.criteria.length>0);assert(draft.coverage.some(c=>c.name==='banking-lab.sql'&&c.status==='read'));
 const after=await req(learner,url+'/workspace');assert.equal(after.records[0].progress.find(p=>p.id===progress.id).state,'submitted');assert(!JSON.stringify(after).includes(draft.insights.summary));
 console.log('PASS: real AI draft generated privately; submission remains awaiting human assessment.');
 fs.writeFileSync('output/emft-demo/ai-verification.json',JSON.stringify({programme:state.programme,progress:progress.id,draft:draft.id,status:draft.status,criteria:draft.insights.criteria.length,coverage:draft.coverage.length,verifiedAt:new Date().toISOString()},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
