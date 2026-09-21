import { z } from "zod";
import { courseContentSchema } from "./schema";
import { deliveryPlanSchema } from "./delivery-schema";
export const blueprintSchema=z.object({
 title:z.string().trim().min(3).max(180),goal:z.string().trim().min(10).max(4000),
 roles:z.array(z.object({id:z.string().uuid(),title:z.string().trim().min(2).max(120),competencies:z.string().trim().min(3).max(2000)})).min(1).max(20),
 courses:z.array(courseContentSchema).min(1).max(20),plan:deliveryPlanSchema,
}).superRefine((v,ctx)=>{
 const activities=v.courses.flatMap(c=>c.activities),ids=activities.map(a=>a.id);
 if(new Set(ids).size!==ids.length||ids.length!==v.plan.activities.length||ids.some(id=>!v.plan.activities.some(a=>a.id===id)))ctx.addIssue({code:"custom",message:"Every activity needs exactly one assessment mapping."});
 for(const a of activities){const mapping=v.plan.activities.find(m=>m.id===a.id);if(["practice","observation"].includes(a.kind)&&!mapping?.criteria.length)ctx.addIssue({code:"custom",message:`Add assessment criteria for ${a.title}.`});}
});
export type ProgrammeBlueprint=z.infer<typeof blueprintSchema>;
export function blankBlueprint():ProgrammeBlueprint {
 const id=crypto.randomUUID();
 return {title:"",goal:"",roles:[{id:crypto.randomUUID(),title:"",competencies:""}],courses:[{title:"First learning block",summary:"",category:"general",outcomes:["Apply learning in a practical task"],activities:[{id,title:"Your first lab",kind:"practice",content:"Describe the task, the evidence to submit and what a good result looks like.",minutes:60,options:[],correctOption:null,criteria:"Demonstrate the task and explain your approach.",materials:[]}]}],plan:{brief:"Define the programme purpose and delivery approach.",targetRoles:"To be defined",hours:1,labUrl:"",minimumPanelReviews:1,activities:[{id,stage:"core",passPercent:60,criteria:[{id:crypto.randomUUID(),skill:"Practical application",description:"Demonstrate the task and explain your approach."}]}]}};
}
