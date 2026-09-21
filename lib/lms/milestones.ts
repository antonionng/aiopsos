import type {DeliveryWorkspace,DeliveryRecord} from "./delivery-schema.ts";
export function learningMilestones(data:DeliveryWorkspace,record:DeliveryRecord){
 const mapped=data.plan?.content.activities||[];
 const route=record.decisions.find(d=>d.kind==="pathway_a"||d.kind==="pathway_b")?.kind;
 const passed=(id:string)=>record.progress.some(p=>p.activity_id===id&&p.state==="passed");
 const groups=[
  {key:"baseline",label:"Starting point",description:"Entry assessment recorded",activities:mapped.filter(a=>a.stage==="baseline")},
  {key:"core",label:"Foundations",description:"Common work completed",activities:mapped.filter(a=>a.stage==="core")},
  {key:"pathway",label:"Specialist skills",description:route?`Selected ${route.replaceAll("_"," ")} completed`:"Pathway agreed and completed",activities:mapped.filter(a=>a.stage===route)},
  {key:"capstone",label:"Final project",description:"Final project assessed and passed",activities:mapped.filter(a=>a.stage==="capstone")},
 ].filter(g=>g.activities.length||g.key==="pathway"&&mapped.some(a=>a.stage.startsWith("pathway_")));
 const milestones=groups.map(g=>({...g,earned:g.activities.length>0&&g.activities.every(a=>passed(a.id)||(g.key==="baseline"&&record.progress.some(p=>p.activity_id===a.id&&p.state==="returned")&&record.history.some(h=>h.action==="learning.review"&&h.snapshot.activity_id===a.id)))}));
 const labs=data.activities.filter(a=>["practice","observation"].includes(a.kind)&&!mapped.some(m=>m.id===a.id&&m.stage==="baseline")&&(!mapped.some(m=>m.id===a.id&&m.stage.startsWith("pathway_"))||mapped.some(m=>m.id===a.id&&m.stage===route)));
 return {milestones,earned:milestones.filter(m=>m.earned).length,verifiedLabs:labs.filter(a=>passed(a.id)).length,awaitingReview:record.progress.filter(p=>p.state==="submitted").length};
}
