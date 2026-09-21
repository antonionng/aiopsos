import {test} from "node:test";
import assert from "node:assert/strict";
import {programmeNextAction} from "./programme-next-action.ts";
import type {DeliveryWorkspace} from "./delivery-schema.ts";

function workspace():DeliveryWorkspace {
 return {viewer_id:"learner",role:"learner",programme:{id:"programme",title:"Banking",goal:"Learn",status:"active",client_org_id:null},staff:[],activities:[],
  records:[{id:"assignment",user_id:"learner",name:"Learner",completed_at:null,progress:[],history:[],reviews:[],files:[],decisions:[]}],
  plan:{revision:1,released_at:"2026-09-16",provider_approved_by:"provider",client_approved_by:null,content:{brief:"Training",targetRoles:"Analyst",hours:120,labUrl:"",minimumPanelReviews:1,activities:[{id:"common",stage:"core",passPercent:60,criteria:[]},{id:"path",stage:"pathway_a",passPercent:60,criteria:[]}]}}};
}
test("unreleased learners are not invited to start locked activities",()=>{
 const d=workspace();d.plan!.released_at=null;
 assert.equal(programmeNextAction(d).view,"overview");
 assert.equal(programmeNextAction(d).stage,0);
});
test("assessed common work waits for a pathway instead of looping through completed lessons",()=>{
 const d=workspace();d.records[0].progress=[{id:"progress",activity_id:"common",state:"passed",revision:1,answer:"",feedback:"",updated_at:"2026-09-16"}];
 assert.equal(programmeNextAction(d).view,"evidence");
 assert.match(programmeNextAction(d).title,/pathway/);
 d.records[0].decisions=[{id:"decision",kind:"pathway_a",reason:"Agreed",actor_id:"trainer",created_at:"2026-09-16"}];
 assert.equal(programmeNextAction(d).view,"learn");
});
test("submitted work points to feedback while a learner waits for review",()=>{
 const d=workspace();d.records[0].progress=[{id:"progress",activity_id:"common",state:"submitted",revision:1,answer:"Evidence",feedback:"",updated_at:"2026-09-16"}];
 assert.match(programmeNextAction(d).title,/trainer/);
 assert.equal(programmeNextAction(d).view,"evidence");
});
test("a client receives progress visibility rather than marking instructions",()=>{
 const d=workspace();d.role="client";
 d.records[0].progress=[{id:"progress",activity_id:"common",state:"submitted",revision:1,answer:"Evidence",feedback:"",updated_at:"2026-09-16"}];
 assert.equal(programmeNextAction(d).view,"insights");
 d.role="trainer";
 assert.equal(programmeNextAction(d).view,"evidence");
});
