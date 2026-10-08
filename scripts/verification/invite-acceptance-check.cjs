require('@next/env').loadEnvConfig(process.cwd());
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createClient}=require('@supabase/supabase-js');
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3012';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-lms-verification-'));fs.chmodSync(dir,0o700);const s={dir,orgs:[],users:[],cookies:{}};const save=()=>fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(s),{mode:0o600});save();console.log('Private fixture directory:',dir);
(async()=>{
 const org=await db.from('organisations').insert({name:'Verification only: invitation acceptance'}).select('id').single();if(org.error)throw org.error;s.orgs.push(org.data.id);save();
 async function invite(){const email=crypto.randomUUID()+'@example.invalid';const result=await db.auth.admin.generateLink({type:'invite',email,options:{data:{name:'Verification invite'}}});if(result.error)throw result.error;s.users.push(result.data.user.id);save();const profile=await db.from('user_profiles').update({name:'Verification invite',role:'user',org_id:org.data.id}).eq('id',result.data.user.id).is('org_id',null).select('id').single();if(profile.error)throw profile.error;return {id:result.data.user.id,email,token:result.data.properties.hashed_token};}
 const malformed=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(malformed.status,400);
 const crossOrigin=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{Origin:'https://foreign.example.invalid','Content-Type':'application/json'},body:'{}'});assert.equal(crossOrigin.status,403);
 const first=await invite();
 // Record native duplicate behaviour without emailing anyone.
 const duplicate=await db.auth.admin.generateLink({type:'invite',email:first.email});
 console.log('Native repeat invitation:',duplicate.error?'rejected':'returned existing account');
 const token=duplicate.error?first.token:duplicate.data.properties.hashed_token;
 const accept=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,workspace:org.data.id})});const body=await accept.json();assert.equal(accept.status,200,body.error);assert.equal(body.next,'/reset-password');assert(accept.headers.getSetCookie().length>0);
 const again=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,workspace:org.data.id})});assert.equal(again.status,400);
 const signedIn=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json',Cookie:accept.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ')},body:JSON.stringify({token,workspace:org.data.id})});assert.equal(signedIn.status,409);
 console.log('PASS: acceptance establishes session, rejects reuse and protects signed-in identity');
 const wrongWorkspace=await invite();const wrong=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:wrongWorkspace.token,workspace:crypto.randomUUID()})});assert.equal(wrong.status,403);console.log('PASS: incomplete, cross-origin and wrong-workspace acceptance denied');
 const removed=await invite();const revoke=await db.from('organisation_memberships').update({status:'revoked',revoked_at:new Date().toISOString()}).eq('user_id',removed.id).eq('org_id',org.data.id);if(revoke.error)throw revoke.error;
 const denied=await fetch(base+'/api/auth/accept-invite',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:removed.token,workspace:org.data.id})});assert.equal(denied.status,403);console.log('PASS: removed invitation cannot open the workspace');
})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1});
