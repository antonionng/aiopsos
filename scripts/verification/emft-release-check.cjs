/* Read-only verification of a protected deployment with synthetic accounts. */
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const [dir,deployment]=process.argv.slice(2);if(!dir||!deployment)throw Error('Supply the private fixture directory and deployment URL.');
const s=JSON.parse(fs.readFileSync(path.join(dir,'fixture.json'),'utf8'));
function read(role,route,status=200){
 const config=path.join(dir,'curl-'+role+'.conf');
 fs.writeFileSync(config,'silent\nshow-error\nmax-time = 45\nheader = "Cookie: '+s.actors[role].cookie.replaceAll('\\','\\\\').replaceAll('"','\\"')+'"\n',{mode:0o600});
 const r=spawnSync('vercel',['curl',route,'--deployment',deployment,'--','--config',config,'--write-out','\n%{http_code}'],{encoding:'utf8',timeout:60000,maxBuffer:2000000});
 if(r.status!==0)throw Error('Deployment request failed for '+role+': '+r.stderr.slice(-400));
 const end=r.stdout.trimEnd().lastIndexOf('\n');assert.equal(Number(r.stdout.trimEnd().slice(end+1)),status,role+' '+route+' returned unexpected status');
 const raw=r.stdout.slice(0,end);try{return JSON.parse(raw);}catch{return raw;}
}
const root='/api/lms/programmes/'+s.programme;
for(const [role,expected,count] of [['provider','manager',20],['trainer','trainer',20],['bank','client',20],['panel','reviewer',20],['starter','learner',1]]){
 const d=read(role,root+'/workspace');assert.equal(d.role,expected);assert.equal(d.records.length,count);assert.equal(d.activities.length,16);assert(d.plan.released_at);console.log('PASS deployed role:',role);
}
const report=read('bank',root+'/report');assert(report.includes('25%')&&report.includes('75%')&&report.includes('Demo'));
const csv=read('bank',root+'/report?format=csv');assert(csv.includes('50'));
read('starter',root+'/files?file='+s.steps['learnerA-final-file'].id,403);
const live=read('trainer',root+'/workspace?view=live');assert.equal(live.groups[0].sessions.length,13);assert.equal(live.groups[0].sessions[0].register.length,20);
console.log('PASS staged deployment: programme, role scope, learner isolation, evidence, reporting and schedule.');

const templates=read('provider','/api/lms/blueprints');assert(templates.some(t=>t.id===s.builderTemplate));
read('starter','/api/lms/blueprints',403);
read('bank','/api/lms/blueprints?id='+s.builderTemplate,403);
const template=read('provider','/api/lms/blueprints?id='+s.builderTemplate);assert(template.config.courses.length>0);
console.log('PASS deployed builder: saved templates, provider ownership and cross-organisation isolation.');
