import {test} from "node:test";
import assert from "node:assert/strict";
import {deliveryPlanSchema,skillResults,deliveryInsights,type DeliveryPlan,type DeliveryRecord} from "./delivery-schema.ts";
const plan:DeliveryPlan={brief:"Practical assessment",targetRoles:"Analyst",hours:100,labUrl:"",minimumPanelReviews:1,activities:[
 {id:crypto.randomUUID(),stage:"baseline",passPercent:60,criteria:[{id:crypto.randomUUID(),skill:"SQL",description:"Query the data accurately"}]},
 {id:crypto.randomUUID(),stage:"capstone",passPercent:60,criteria:[{id:crypto.randomUUID(),skill:"sql",description:"Query the data accurately"}]},
]};
function record():DeliveryRecord{return {id:"assignment",user_id:"learner",name:"Test",completed_at:null,files:[],reviews:[],decisions:[],progress:[],history:[]};}
test("unassessed skills do not become zero scores or improvement",()=>{
 assert.deepEqual(skillResults(record(),plan),[]);
 assert.equal(deliveryInsights(record(),plan)[0].evidence.length,0);
});
test("skill change requires both entry and current final reviewed evidence",()=>{
 const r=record();
 function assessed(index:number,score:number){const a=plan.activities[index];r.progress.push({id:`p${index}`,activity_id:a.id,state:"passed",revision:2,answer:"Evidence",feedback:"Feedback",updated_at:"2026-09-16"});r.history.push({id:`h${index}`,action:"learning.review",actor_id:"trainer",created_at:"2026-09-16",snapshot:{activity_id:a.id,state:"passed",answer:"Evidence",feedback:"Feedback",scores:{[a.criteria[0].id]:score}}});}
 assessed(0,1);
 assert.equal(skillResults(r,plan)[0].change,null);
 assessed(1,3);
 assert.deepEqual(skillResults(r,plan)[0],{skill:"SQL",baseline:25,final:75,change:50,evidence:["h0","h1"]});
 r.progress[1].state="submitted";
 assert.equal(skillResults(r,plan)[0].final,null,"a new unreviewed attempt cannot inherit an old score");
});
test("duplicate activity mappings and unsafe lab links are rejected",()=>{
 assert.equal(deliveryPlanSchema.safeParse({...plan,activities:[plan.activities[0],plan.activities[0]]}).success,false);
 assert.equal(deliveryPlanSchema.safeParse({...plan,labUrl:"javascript:alert(1)"}).success,false);
});
test("diagnostic baseline feedback does not become a resubmission warning",()=>{
 const r=record();r.progress.push({id:"baseline",activity_id:plan.activities[0].id,state:"returned",revision:2,answer:"Entry evidence",feedback:"Starting point recorded",updated_at:"2026-09-17"});
 assert(!deliveryInsights(r,plan).some(i=>i.label.includes("another attempt")));
 r.progress.push({...r.progress[0],id:"final",activity_id:plan.activities[1].id});
 assert(deliveryInsights(r,plan).some(i=>i.label==="1 activity needs another attempt"));
});
