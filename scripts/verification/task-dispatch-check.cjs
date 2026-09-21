// eslint-disable-next-line @typescript-eslint/no-require-imports -- Standalone CommonJS harness with mocked server imports.
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
let row={id:'task',state:'queued',attempts:0,lease_until:null},callbacks=[],runs=0,preflight=false,accessAllowed=true,accessChecks=0;
const writes=[];class LearningError extends Error{}
const admin={from(){let patch=null,filters=[];const q={select(){return q},eq(k,v){filters.push([k,v]);return q},lt(k,v){filters.push([k,'<'+v]);return q},update(p){patch=p;return q},async maybeSingle(){if(patch){writes.push({patch,filters});return {data:{id:'task'},error:null}}return {data:row,error:null}},then(resolve){writes.push({patch,filters});resolve({data:null,error:null})}};return q}};
const mocks={'server-only':{},'next/server':{after:f=>callbacks.push(f)},'@/lib/supabase/admin':{supabaseAdmin:admin},'./server':{LearningError,assertLearningAccess:async(actor,requireManager)=>{accessChecks++;assert.equal(actor.orgId,'workspace');assert.equal(requireManager,true);if(!accessAllowed)throw new LearningError('Workspace access revoked');}},'./agent':{runLearningAgent:async()=>{runs++;if(preflight)throw new LearningError('Credits required');return {state:'needs_review'}}}};
const moduleCode=ts.transpileModule(fs.readFileSync('lib/lms/task-dispatch.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};new Function('require','module','exports',moduleCode)(n=>mocks[n],mod,mod.exports);
(async()=>{const dispatch=mod.exports.dispatchLearningTask,actor={userId:'manager',orgId:'workspace',role:'manager'};
 await assert.rejects(()=>dispatch('task',{...actor,role:'user'}));assert.equal(callbacks.length,0);
 accessAllowed=false;await assert.rejects(()=>dispatch('task',actor),/Workspace access revoked/);assert.equal(callbacks.length,0);assert.equal(runs,0);assert.equal(writes.length,0);assert.equal(accessChecks,1);accessAllowed=true;
 const accepted=await dispatch('task',actor);assert.equal(accepted.state,'queued');assert.equal(runs,0);assert.equal(callbacks.length,1);await callbacks.shift()();assert.equal(runs,1);
 for(const state of ['needs_review','completed','cancelled','failed']){row={...row,state};await dispatch('task',actor);assert.equal(callbacks.length,0)}
 row={...row,state:'running',lease_until:new Date(Date.now()+60000).toISOString()};await dispatch('task',actor);assert.equal(callbacks.length,0);
 row={...row,lease_until:new Date(Date.now()-60000).toISOString()};await dispatch('task',actor);assert.equal(callbacks.length,1);callbacks=[];
 row={...row,attempts:3};assert.equal((await dispatch('task',actor)).state,'failed');assert.equal(callbacks.length,0);assert(writes.at(-1).filters.some(([k])=>k==='lease_until'));
 row={...row,state:'queued',attempts:0,lease_until:null};preflight=true;await dispatch('task',actor);await callbacks.shift()();assert.equal(writes.at(-1).patch.error,'Credits required');assert(writes.at(-1).filters.some(([k,v])=>k==='state'&&v==='queued'));
 console.log('PASS: dispatch permissions, current membership denial, response-before-execution, terminal-state no-ops, active lease protection, expired recovery, retry ceiling and scoped preflight failure persistence.');
})().catch(e=>{console.error(e);process.exitCode=1});
