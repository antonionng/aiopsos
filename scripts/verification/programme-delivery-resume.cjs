const fs=require('node:fs'),assert=require('node:assert/strict');
const dir=process.argv[2];if(!dir)throw Error('Supply the private synthetic fixture directory.');const state=JSON.parse(fs.readFileSync(dir+'/fixture.json','utf8'));const base='http://localhost:3014',p=state.programme,a=state.assignment,{provider,bank,trainer,learner,peer,panel}=state.actors;
async function req(actor,url,body,status=200){const r=await fetch(base+url,{method:body?'POST':'GET',headers:{Cookie:actor.cookie,...(body?{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()}:{})},...(body?{body:JSON.stringify(body)}:{})});const raw=await r.text();let d;try{d=JSON.parse(raw);}catch{d=raw;}assert.equal(r.status,status,typeof d==='object'?d.error:raw.slice(0,100));return d;}
const workspace='/api/lms/programmes/'+p+'/workspace';
(async()=>{
 const live=await req(trainer,workspace+'?view=live');const session=live.groups[0].sessions[0],reg=session.register.find(r=>r.assignment_id===a);
 if(reg.status===null)await req(trainer,workspace,{action:'attendance.save',session_id:session.id,enrolment_id:reg.enrolment_id,status:'present',expected_status:null});
 await req(trainer,workspace,{action:'attendance.save',session_id:session.id,enrolment_id:reg.enrolment_id,status:'absent',expected_status:null},409);
 const w=await req(learner,workspace);assert.equal(w.records.length,1);assert(w.records[0].completed_at);assert(w.records[0].files[0].attempt_id);assert.equal(w.viewer_id,learner.id);
 const progress=await req(bank,'/api/lms/programmes/'+p+'/progress');const row=progress.records.find(r=>r.id===a);assert.equal(row.course.total,4);assert.equal(row.course.passed,4);
 const report=await req(bank,'/api/lms/programmes/'+p+'/report');for(const text of ['25%','75%','present','entry-query.sql'])assert(report.includes(text),text+' missing in report');
 const csv=await req(bank,'/api/lms/programmes/'+p+'/report?format=csv');assert(csv.includes('50'));
 await req(peer,'/api/lms/programmes/'+p+'/files?file='+state.file,null,403);
 await req(provider,workspace,{action:'staff.revoke',user_id:trainer.id});await req(trainer,workspace,null,403);
 await req(provider,workspace,{action:'staff.invite',email:trainer.email,role:'trainer'});await req(trainer,workspace,{action:'staff.accept'});
 console.log('PASS: live attendance, conflict detection, learner isolation, unified pathway completion, evidence report, skill improvement, file isolation and revocation.');
 console.log('Programme:',p);
})().catch(e=>{console.error('FAILED:',e.message);process.exitCode=1;});
