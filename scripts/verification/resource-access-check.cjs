require('@next/env').loadEnvConfig(process.cwd());
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const {createClient}=require('@supabase/supabase-js'),{createServerClient}=require('@supabase/ssr');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3012';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-lms-verification-'));fs.chmodSync(dir,0o700);const s={dir,orgs:[],users:[],cookies:{}};const save=()=>fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(s),{mode:0o600});save();console.log('Private fixture directory:',dir);
(async()=>{
 async function person(org,role){const email=crypto.randomUUID()+'@example.invalid',password=crypto.randomUUID();const u=await db.auth.admin.createUser({email,password,email_confirm:true});if(u.error)throw u.error;s.users.push(u.data.user.id);save();const p=await db.from('user_profiles').update({org_id:org,role}).eq('id',u.data.user.id);if(p.error)throw p.error;let cookies=[];const client=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>cookies,setAll:values=>{cookies=values}}});const login=await client.auth.signInWithPassword({email,password});if(login.error)throw login.error;return {id:u.data.user.id,client,header:cookies.map(c=>c.name+'='+c.value).join('; ')};}

 for(const label of ['A','B']){const o=await db.from('organisations').insert({name:'Verification only: resource access '+label}).select('id').single();if(o.error)throw o.error;s.orgs.push(o.data.id);save();}
 const owner=await person(s.orgs[0],'admin'),foreign=await person(s.orgs[1],'admin'),learner=await person(s.orgs[0],'user');
 const request=(account,route,options={})=>fetch(base+route,{...options,headers:{Cookie:account.header,...options.headers}});
 const form=()=>{const f=new FormData();f.append('file',new Blob(['Synthetic training reference'],{type:'text/plain'}),'reference.txt');return f;};
 const upload=await request(owner,'/api/knowledge',{method:'POST',body:form()});const uploaded=await upload.json();assert.equal(upload.status,200,JSON.stringify(uploaded));const id=uploaded.file.id;
 const deniedUpload=await request(learner,'/api/knowledge',{method:'POST',body:form()});assert.equal(deniedUpload.status,403);
 const download=await request(learner,'/api/knowledge/'+id+'/download');assert.equal(download.status,200);assert.equal(await download.text(),'Synthetic training reference');assert.match(download.headers.get('cache-control'),/no-store/);
 assert.equal((await request(foreign,'/api/knowledge/'+id+'/download')).status,404);
 const prompt=await owner.client.from('saved_prompts').insert({org_id:s.orgs[0],user_id:owner.id,title:'Fixture',content:'Fixture text',is_shared:true}).select('id').single();if(prompt.error)throw prompt.error;
 const removeOther=await request(learner,'/api/prompts',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:prompt.data.id})});assert.equal(removeOther.status,403);
 const persona=await owner.client.from('model_personas').insert({org_id:s.orgs[0],name:'Fixture',system_prompt:'Fixture only',created_by:owner.id}).select('id').single();if(persona.error)throw persona.error;
 const revoke=await db.from('organisation_memberships').update({status:'revoked',revoked_at:new Date().toISOString()}).eq('user_id',learner.id);if(revoke.error)throw revoke.error;
 for(const route of ['/api/knowledge','/api/prompts','/api/personas','/api/knowledge/'+id+'/download'])assert.equal((await request(learner,route)).status,403,route);
 for(const table of ['knowledge_base_files','saved_prompts','model_personas']){const read=await learner.client.from(table).select('id').eq('org_id',s.orgs[0]);if(read.error)throw read.error;assert.equal(read.data.length,0,table);}
 const raw=await learner.client.storage.from('knowledge-base').download(uploaded.file.storage_path);assert(raw.error,'Revoked raw storage download allowed');
 const removed=await request(owner,'/api/knowledge',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});assert.equal(removed.status,200);
 for(const table of ['saved_prompts','model_personas']){const clean=await db.from(table).delete().eq('org_id',s.orgs[0]);if(clean.error)throw clean.error;}
 console.log('PASS: real upload/download/delete, learner upload denial, tenant isolation, owner-only prompt deletion, revoked API/database/storage denial.');
})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1});
