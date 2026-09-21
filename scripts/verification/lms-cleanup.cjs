/* Removes only the synthetic workspaces created by lms-live-check.cjs. */
const fs=require('node:fs'),path=require('node:path');
require('@next/env').loadEnvConfig(process.cwd());
const {createClient}=require('@supabase/supabase-js');
const dir=process.argv[2];if(!dir||!path.basename(dir).startsWith('experrt-lms-verification-'))throw new Error('A verification fixture directory is required');
const s=JSON.parse(fs.readFileSync(path.join(dir,'fixture.json'),'utf8'));
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
(async()=>{const {data,error}=await db.from('organisations').select('id,name').in('id',s.orgs);if(error||data.length!==s.orgs.length||data.some(o=>!o.name.startsWith('Verification only: ')))throw new Error('Refusing cleanup: workspace ownership marker did not match');
 if(s.cohortId){const group=await db.from('cohorts').select('org_id').eq('id',s.cohortId).single();if(group.error||!s.orgs.includes(group.data.org_id))throw Error('Invalid fixture cohort');for(const table of ['lms_delivery_events','lms_programme_cohorts']){const result=await db.from(table).delete().eq('cohort_id',s.cohortId);if(result.error)throw result.error;}const result=await db.from('cohorts').delete().eq('id',s.cohortId);if(result.error)throw result.error;}
 const resources=await db.from('knowledge_base_files').select('storage_path').in('org_id',s.orgs);if(resources.error)throw resources.error;const paths=resources.data.map(r=>r.storage_path);if(paths.some(p=>!s.orgs.some(id=>p.startsWith(id+'/'))))throw Error('Resource storage path outside fixture');if(paths.length){const r=await db.storage.from('knowledge-base').remove(paths);if(r.error)throw r.error;}
 for(const table of ['knowledge_base_files','saved_prompts','model_personas','assessment_invites','assessment_links','assessments']){const r=await db.from(table).delete().in('org_id',s.orgs);if(r.error)throw r.error;}
 const assignments=await db.from('lms_assignments').select('id').in('org_id',s.orgs);if(assignments.error)throw new Error(assignments.error.message);const ids=assignments.data.map(a=>a.id);
 async function remove(table,column,values){if(!values.length)return;const {error}=await db.from(table).delete().in(column,values);if(error)throw new Error(`${table}: ${error.message}`);}
 const programmes=await db.from('lms_programmes').select('id').in('org_id',s.orgs);if(programmes.error)throw new Error(programmes.error.message);await remove('lms_discussion_posts','programme_id',programmes.data.map(p=>p.id));
 await remove('lms_attempt_history','assignment_id',ids);await remove('lms_activity_progress','assignment_id',ids);
 for(const table of ['lms_assignments','lms_events','lms_agent_runs','lms_programmes','lms_course_versions','lms_courses','lms_workspace_settings'])await remove(table,'org_id',s.orgs);
 await remove('lms_clients','provider_org_id',s.orgs);await remove('lms_clients','client_org_id',s.orgs);
 for(const table of ['credit_ledger','credit_wallets','usage_logs','conversations'])await remove(table,'org_id',s.orgs);
 for(const id of s.users){const {error}=await db.auth.admin.deleteUser(id);if(error)throw new Error(error.message);}
 await remove('organisations','id',s.orgs);
 fs.writeFileSync(path.join(dir,'cleaned.txt'),'Synthetic workspaces and accounts removed.\n');
 for(const name of ['fixture.json','provider-browser.json','employer-browser.json','learner-browser.json']){const file=path.join(dir,name);if(fs.existsSync(file))fs.unlinkSync(file);}
 console.log('Only this verification run’s synthetic accounts, workspaces, learning rows and allowances were removed.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
