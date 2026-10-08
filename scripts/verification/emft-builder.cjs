const fs=require('node:fs'),assert=require('node:assert/strict');require('@next/env').loadEnvConfig(process.cwd());
const {createServerClient}=require('@supabase/ssr');
const dir=process.argv[2],file=dir+'/fixture.json',s=JSON.parse(fs.readFileSync(file)),base='http://localhost:3014';
async function login(key){const a=s.actors[key],jar=new Map(),c=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>[...jar.values()],setAll:items=>items.forEach(c=>jar.set(c.name,c))}});const r=await c.auth.signInWithPassword({email:a.email,password:a.password});if(r.error)throw r.error;a.cookie=[...jar.values()].map(c=>c.name+'='+c.value).join('; ');fs.writeFileSync(dir+'/'+key+'-browser.json',JSON.stringify({cookies:[...jar.values()].map(c=>({name:c.name,value:c.value,domain:'localhost',path:'/',expires:Math.floor(Date.now()/1000)+3600,httpOnly:false,secure:false,sameSite:'Lax'})),origins:[]}),{mode:0o600});return a;}
async function req(a,body,status=200,key=crypto.randomUUID(),suffix=''){const r=await fetch(base+'/api/lms/blueprints'+suffix,{method:body?'POST':'GET',headers:{Cookie:a.cookie,...(body?{'Content-Type':'application/json','Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();assert.equal(r.status,status,(body?.action||suffix||"list")+": "+d.error);return d;}
(async()=>{
 const provider=await login('provider'),bank=await login('bank'),learner=await login('starter');
 await req(learner,null,403);
 const config={title:'Banking analytics academy · reusable design',goal:s.curriculum.plan.brief,roles:[{id:crypto.randomUUID(),title:'Banking analytics specialist',competencies:'Reconcile and analyse synthetic banking data, explain limitations, and recommend controlled use.'}],courses:[s.curriculum.content],plan:s.curriculum.plan};
 let template=s.builderTemplate?await req(provider,null,200,undefined,'?id='+s.builderTemplate):await req(provider,{action:'save',config});
 s.builderTemplate=template.id;fs.writeFileSync(file,JSON.stringify(s),{mode:0o600});
 await req(bank,null,403,undefined,'?id='+template.id);
 const before=template.revision;
 template=await req(provider,{action:'save',id:template.id,revision:before,config:template.config});
 await req(provider,{action:'save',id:template.id,revision:before,config:template.config},409);
 const body={action:'create_run',id:template.id,revision:template.revision,title:'L&D builder verification · synthetic cohort',client_org_id:s.orgs.bank},key=crypto.randomUUID();
 const first=await req(provider,body,200,key),replay=await req(provider,body,200,key);assert.equal(first.id,replay.id);
 const second=await req(provider,{...body,title:'L&D builder verification · second cohort'});assert.notEqual(first.id,second.id);
 async function workspace(id){const r=await fetch(base+'/api/lms/programmes/'+id+'/workspace',{headers:{Cookie:provider.cookie}});assert.equal(r.status,200);return r.json();}
 const [a,b]=await Promise.all([workspace(first.id),workspace(second.id)]);assert(!a.plan.released_at);assert.equal(a.records.length,0);assert.equal(a.activities.length,16);assert(!a.activities.some(x=>b.activities.some(y=>y.id===x.id)));
 console.log('PASS: manager-only builder, tenant isolation, draft persistence, stale edit conflicts, atomic creation, request replay and separate programme instances.');
 s.builderVerification={template:template.id,first:first.id,second:second.id};fs.writeFileSync(file,JSON.stringify(s),{mode:0o600});
 fs.writeFileSync('output/emft-demo/builder-verification.json',JSON.stringify(s.builderVerification,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
