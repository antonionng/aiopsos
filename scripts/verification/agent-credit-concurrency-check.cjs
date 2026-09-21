require('@next/env').loadEnvConfig(process.cwd());
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createClient}=require('@supabase/supabase-js');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const manifest=JSON.parse(fs.readFileSync(path.join(process.argv[2],'fixture.json'),'utf8'));
(async()=>{
 const org=manifest.orgs[0], actor=manifest.users[0];
 const verified=await db.from('organisations').select('name').eq('id',org).single();assert(verified.data?.name.startsWith('Verification only: '));
 const initial=await db.from('credit_wallets').select('balance').eq('org_id',org).single();if(initial.error)throw initial.error;assert(initial.data.balance>=60&&initial.data.balance<120);
 const tasks=[0,1].map(()=>({id:crypto.randomUUID(),lease:crypto.randomUUID()}));
 for(const t of tasks){const row=await db.from('lms_agent_runs').insert({id:t.id,org_id:org,created_by:actor,kind:'delivery',goal:'Concurrency verification only',state:'running',lease_token:t.lease,lease_until:new Date(Date.now()+120000).toISOString()});if(row.error)throw row.error;}
 const reserves=await Promise.all(tasks.map(t=>db.rpc('lms_reserve_agent_credits',{p_actor:actor,p_run:t.id,p_lease:t.lease,p_max:60,p_model:'test-model',p_input_rate:0.1,p_output_rate:0.1,p_markup:1,p_fx:1})));
 assert.equal(reserves.filter(r=>!r.error).length,1);assert.equal(reserves.filter(r=>r.error?.code==='P0001').length,1);
 const winner=tasks[reserves.findIndex(r=>!r.error)];
 const settlements=await Promise.all([0,1].map(()=>db.rpc('lms_settle_agent_credits',{p_lease:winner.lease,p_tokens_in:1000,p_tokens_out:1000})));
 for(const result of settlements){if(result.error)throw result.error;assert.equal(result.data.charged,20);}
 assert.equal(settlements[0].data.usage_log_id,settlements[1].data.usage_log_id);
 const after=await db.from('credit_wallets').select('balance').eq('org_id',org).single();if(after.error)throw after.error;assert.equal(after.data.balance,initial.data.balance-20);
 console.log('PASS: simultaneous reservations admitted one funded task; simultaneous settlements produced one usage record and one debit.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
