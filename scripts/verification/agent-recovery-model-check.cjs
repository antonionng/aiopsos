require('@next/env').loadEnvConfig(process.cwd());
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createClient}=require('@supabase/supabase-js');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const kind=process.env.VERIFICATION_AGENT_KIND==='course'?'course':'delivery';
const base=process.env.VERIFICATION_BASE_URL||'http://localhost:3012';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'experrt-lms-verification-'));fs.chmodSync(dir,0o700);const s={dir,orgs:[],users:[],cookies:{}};const save=()=>fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify(s),{mode:0o600});save();console.log('Private fixture directory:',dir);
(async()=>{
 const existing=await db.from('lms_agent_runs').select('id').not('dispatch_requested_at','is',null).in('state',['queued','running']);if(existing.error)throw existing.error;assert.equal(existing.data.length,0,'Do not run verification while real dispatched work is pending');
 const org=await db.from('organisations').insert({name:'Verification only: agent model recovery'}).select('id').single();if(org.error)throw org.error;s.orgs.push(org.data.id);save();
 const user=await db.auth.admin.createUser({email:crypto.randomUUID()+'@example.invalid',email_confirm:true});if(user.error)throw user.error;s.users.push(user.data.user.id);save();
 const profile=await db.from('user_profiles').update({org_id:org.data.id,role:'admin'}).eq('id',user.data.user.id);if(profile.error)throw profile.error;
 const wallet=await db.from('credit_wallets').insert({org_id:org.data.id,balance:100});if(wallet.error)throw wallet.error;
 const id=crypto.randomUUID();
 const insert=await db.from('lms_agent_runs').insert({id,org_id:org.data.id,created_by:user.data.user.id,kind,goal:kind==='course'?'Create a short fictional workplace course on checking AI summaries. Include three activities: a lesson, one quiz, and a practical task with review criteria. Supply learner materials with all fictional source text needed. Prepare for human review only.':'Inspect this empty verification workspace and explain the next setup step in no more than 100 words. Do not invent learners or courses. Do not publish, assign, send messages or create content.',state:'running',attempts:1,lease_token:crypto.randomUUID(),lease_until:new Date(Date.now()-60000).toISOString(),dispatch_requested_at:new Date(Date.now()-120000).toISOString()});if(insert.error)throw insert.error;
 const response=await fetch(base+'/api/cron/learning-agent-recovery',{headers:{Authorization:'Bearer '+process.env.CRON_SECRET}});const result=await response.json();assert.equal(response.status,200);assert.equal(result.recovered,1,JSON.stringify(result));
 const task=await db.from('lms_agent_runs').select('state,attempts,summary,lease_token').eq('id',id).single();if(task.error)throw task.error;assert.equal(task.data.state,'needs_review');assert.equal(task.data.attempts,2);assert.equal(task.data.lease_token,null);assert(task.data.summary.length>20);
 const usage=await db.from('usage_logs').select('id,tokens_in,tokens_out').eq('org_id',org.data.id);if(usage.error)throw usage.error;assert.equal(usage.data.length,1);assert(usage.data[0].tokens_in>0);assert(usage.data[0].tokens_out>0);
 const balance=await db.from('credit_wallets').select('balance').eq('org_id',org.data.id).single();if(balance.error)throw balance.error;assert(balance.data.balance<100);assert(balance.data.balance>0);
 const holds=await db.from('lms_agent_credit_holds').select('state,charged,reserved').eq('run_id',id);if(holds.error)throw holds.error;assert.equal(holds.data.length,1);assert.equal(holds.data[0].state,'settled');assert.equal(balance.data.balance,100-holds.data[0].charged);assert(holds.data[0].reserved>=holds.data[0].charged);
 const output=await db.from('lms_agent_results').select('summary,proposal,disposition,tokens_in,tokens_out').eq('run_id',id);if(output.error)throw output.error;assert.equal(output.data.length,1);assert.equal(output.data[0].summary,task.data.summary);assert.equal(output.data[0].disposition,'needs_review');if(kind==='course'){assert(output.data[0].proposal);assert(output.data[0].proposal.activities.length>=3);}assert.equal(output.data[0].tokens_in,usage.data[0].tokens_in);assert.equal(output.data[0].tokens_out,usage.data[0].tokens_out);
 const again=await fetch(base+'/api/cron/learning-agent-recovery',{headers:{Authorization:'Bearer '+process.env.CRON_SECRET}});assert.equal((await again.json()).examined,0);
 console.log('PASS: interrupted task recovered through real model, original owner retained, proposal saved for review, one usage record, credits debited, repeat did not regenerate.');
 console.log('Generated review:',task.data.summary);

})().catch(e=>{console.error('Verification failed:',e.message);process.exitCode=1});
