import {test} from "node:test";
import assert from "node:assert/strict";
import {learningMilestones} from "./milestones.ts";
import type {DeliveryWorkspace,DeliveryRecord} from "./delivery-schema.ts";
function fixture(){
 const record:DeliveryRecord={id:"r",user_id:"u",name:"Learner",completed_at:null,progress:[],history:[],reviews:[],files:[],decisions:[]};
 const stages=["baseline","core","pathway_a","pathway_b","capstone"] as const;
 const data:DeliveryWorkspace={programme:{id:"p",title:"Test",goal:"Test",status:"active",client_org_id:null},role:"learner",staff:[],records:[record],activities:stages.map(stage=>({id:stage,title:stage,kind:"practice",content:"",criteria:"",course_title:"Test"})),plan:{revision:1,released_at:"2026-09-16",provider_approved_by:"provider",client_approved_by:null,content:{brief:"Test programme",targetRoles:"Analyst",hours:120,labUrl:"",minimumPanelReviews:1,activities:stages.map(stage=>({id:stage,stage,criteria:[],passPercent:60}))}}};
 const progress=(activity_id:string,state:string)=>record.progress.push({id:activity_id,activity_id,state,revision:1,answer:"Evidence",feedback:"",updated_at:"2026-09-16"});
 return {data,record,progress};
}
test("uploads and unreviewed submissions cannot earn lab completion",()=>{
 const {data,record,progress}=fixture();progress("core","submitted");
 record.files.push({id:"file",activity_id:"core",name:"work.sql",bytes:100,sha256:"hash",attempt_id:"attempt",created_at:"2026-09-16"});
 const result=learningMilestones(data,record);
 assert.equal(result.verifiedLabs,0);assert.equal(result.earned,0);assert.equal(result.awaitingReview,1);
});
test("a reviewed entry diagnostic is a starting-point milestone, not a verified lab",()=>{
 const {data,record,progress}=fixture();progress("baseline","returned");
 assert.equal(learningMilestones(data,record).earned,0);
 record.history.push({id:"review",action:"learning.review",actor_id:"trainer",created_at:"2026-09-16",snapshot:{activity_id:"baseline",state:"returned",answer:"Evidence",feedback:"Starting point recorded"}});
 assert.equal(learningMilestones(data,record).earned,1);assert.equal(learningMilestones(data,record).verifiedLabs,0);
});
test("only the chosen pathway contributes to earned specialist skills",()=>{
 const {data,record,progress}=fixture();progress("pathway_b","passed");
 record.decisions.push({id:"d",kind:"pathway_a",reason:"Agreed",actor_id:"trainer",created_at:"2026-09-16"});
 assert.equal(learningMilestones(data,record).verifiedLabs,0);assert.equal(learningMilestones(data,record).milestones.find(m=>m.key==="pathway")?.earned,false);
 progress("pathway_a","passed");assert.equal(learningMilestones(data,record).verifiedLabs,1);
});
test("returned final work cannot retain an earned final-project milestone",()=>{
 const {data,record,progress}=fixture();progress("capstone","returned");
 assert.equal(learningMilestones(data,record).milestones.find(m=>m.key==="capstone")?.earned,false);
 assert.equal(learningMilestones(data,record).verifiedLabs,0);
});
