import type {DeliveryWorkspace} from "./delivery-schema.ts";
export type ProgrammeAction={stage:number;title:string;description:string;label:string;view:string};
export function programmeNextAction(data:DeliveryWorkspace):ProgrammeAction {
 const own=data.records.find(r=>r.user_id===data.viewer_id) || data.records[0];
 const pending=data.records.reduce((n,r)=>n+r.progress.filter(p=>p.state==="submitted").length,0);
 const hasWork=data.records.some(r=>r.progress.length>0);
 const action=(stage:number,title:string,description:string,label:string,view:string)=>({stage,title,description,label,view});
 if(data.programme.status==="archived")return action(4,"Programme archived","Your learning evidence and outcomes remain available.","View outcomes","insights");
 if(data.plan&&!data.plan.released_at){
  if(data.role==="learner")return action(0,"Your programme is being prepared","Your learning team is agreeing the plan. There is nothing you need to submit yet.","View the programme","overview");
  return action(0,"Agree the programme plan","Review the brief, learning stages and assessment criteria before the programme starts.","Continue preparation","plan");
 }
 if(data.role==="reviewer")return action(3,"Review the final projects","Read the submitted work, record your scores and give feedback. The trainer makes the final assessment decision.","Open project reviews","evidence");
 if(data.role==="learner"){
  if(own?.completed_at)return action(4,"Your coursework is complete","Review your feedback, skill progress and any remaining live-training requirements.","View my progress","insights");
  if(own?.progress.some(p=>p.state==="returned"&&!data.plan?.content.activities.some(a=>a.id===p.activity_id&&a.stage==="baseline")))return action(2,"Put your feedback into practice","Your trainer has returned work with guidance. Open your learning to revise and resubmit.","Review and continue","learn");
  if(own&&data.plan?.released_at){
   const path=own.decisions.find(d=>d.kind==="pathway_a"||d.kind==="pathway_b")?.kind;
   let available=data.plan.content.activities.filter(a=>a.stage==="baseline"||a.stage==="core"||a.stage===path);
   const assessed=(id:string,baseline:boolean)=>own.progress.some(p=>p.activity_id===id&&(p.state==="passed"||(baseline&&p.state==="returned")));
   if(available.length&&available.every(a=>assessed(a.id,a.stage==="baseline"))&&!path&&data.plan.content.activities.some(a=>a.stage.startsWith("pathway_")))return action(3,"Your next pathway is being agreed","Your common learning is assessed. Your training team will record the pathway decision here.","View feedback and decisions","evidence");
   if((path||!data.plan.content.activities.some(a=>a.stage.startsWith("pathway_")))&&available.every(a=>assessed(a.id,a.stage==="baseline")))available=[...available,...data.plan.content.activities.filter(a=>a.stage==="capstone")];
   const unfinished=available.filter(a=>!assessed(a.id,a.stage==="baseline"));
   if(unfinished.length&&unfinished.every(a=>own.progress.some(p=>p.activity_id===a.id&&p.state==="submitted")))return action(3,"Your work is with your trainer","Your available activities are submitted. Your feedback and next steps will appear here after review.","View submitted work","evidence");
  }
  return action(2,hasWork?"Continue your learning":"You’re ready to begin","Work through the available activities. Your materials and evidence submission are part of the same learning page.",hasWork?"Continue learning":"Start learning","learn");
 }
 if(!data.plan&&!hasWork&&data.role!=="client")return action(0,"Prepare this programme","Your content is selected. Set the brief, stages and assessment criteria next.","Prepare programme","plan");
 if(!data.records.length)return action(1,"Bring your learners in","Choose the people taking this programme. Their learning and teaching sessions belong here.","Add learners","people");
 if(pending&&data.role!=="client")return action(3,`${pending} submissions need review`,"Assess the evidence, give feedback and keep learners moving.","Review submitted work","evidence");
 if(data.records.every(r=>r.completed_at))return action(4,"Review the programme outcomes","Coursework is complete. Review the evidence and record final readiness decisions.","View outcomes","insights");
 return action(2,"Your programme is underway","Teach upcoming sessions, record attendance and follow each learner’s progress here.",data.role==="client"?"View learner progress":"Open teaching sessions",data.role==="client"?"insights":"live");
}
