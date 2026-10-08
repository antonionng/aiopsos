import { cohortMembershipGuardsEnabled } from "@/lib/workspace-rollout";
import type { DeliveryPlan } from "@/lib/lms/delivery-schema";
import {programmeJourney} from "@/lib/lms/programme-journey";
import {NextResponse} from "next/server";
import {z} from "zod";
import {learningActor,learningErrorResponse,LearningError} from "@/lib/lms/server";
import {supabaseAdmin as db} from "@/lib/supabase/admin";
import {courseContentSchema} from "@/lib/lms/schema";
import {computeAttendancePct,computeGradePct} from "@/lib/certification";
import {liveNextStep,type LiveProgress} from "@/lib/lms/delivery-progress";
import type {AttendanceStatus} from "@/lib/constants";
async function allRows<T>(query:(from:number,to:number)=>PromiseLike<{data:T[]|null;error:{message:string}|null}>) {
 const rows:T[]=[];
 for(let page=0;page<100;page++){const {data,error}=await query(page*500,page*500+499);if(error)throw new LearningError("Could not load complete progress records.",503);rows.push(...(data||[]));if(!data||data.length<500)return rows;}
 throw new LearningError("This report is too large to load at once.",503);
}
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 try {
  const actor=await learningActor(); const {id}=await params;
  if(!z.string().uuid().safeParse(id).success)throw new LearningError("Invalid programme");
  const {data:access,error:accessError}=await db.rpc(cohortMembershipGuardsEnabled() ? "lms_live_delivery_scoped" : "lms_live_delivery",{p_actor:actor.userId,...(cohortMembershipGuardsEnabled() ? {p_org:actor.orgId} : {}),p_programme:id});
  if(accessError||!access)throw new LearningError("This programme is not available to your account.",403);
  const {data:programme,error:programmeError}=await db.from("lms_programmes").select("id,title,org_id,client_org_id,version_ids").eq("id",id).single();
  if(programmeError||!programme)throw new LearningError("Programme unavailable",503);
  const manager=["admin","manager","super_admin"].includes(actor.role) && new URL(_req.url).searchParams.get("view") !== "mine";
  const provider=manager&&programme.org_id===actor.orgId;
  const assignments=await allRows((from,to)=>{
    let query=db.from("lms_assignments").select("id,user_id,org_id,completed_at,user_profiles(name)").eq("programme_id",id).order("id");
    if(!provider)query=query.eq("org_id",actor.orgId);
    if(!manager)query=query.eq("user_id",actor.userId);
    return query.range(from,to);
  });
  const {data:versions,error:versionError}=await db.from("lms_course_versions").select("content").in("id",programme.version_ids);
  if(versionError)throw new LearningError("Course versions unavailable",503);
  const activities=(versions||[]).flatMap(v=>courseContentSchema.parse(v.content).activities);
  const activityIds=new Set(activities.map(a=>a.id));
  const {data:deliveryPlan,error:planError}=await db.from("lms_delivery_plans").select("content,released_at").eq("programme_id",id).maybeSingle();
  if(planError && !["42P01","PGRST205"].includes(planError.code)) throw new LearningError("Assessment plan unavailable",503);
  const plan=deliveryPlan?.content as DeliveryPlan|undefined;
  const assignmentIds=assignments.map(a=>a.id);
  const {data:pathways,error:pathError}=plan&&assignmentIds.length?await db.from("lms_delivery_decisions").select("assignment_id,kind").in("assignment_id",assignmentIds).in("kind",["pathway_a","pathway_b"]):{data:[],error:null};
  if(pathError)throw new LearningError("Pathway decisions unavailable",503);
  const cohortIds=(access.cohorts as {id:string}[]).map(c=>c.id);
  const cohorts=cohortIds.length?await allRows((from,to)=>db.from("cohorts").select("id,title,status,pass_attendance_pct,pass_grade_pct").in("id",cohortIds).order("id").range(from,to)):[];
  const sessions=cohortIds.length?await allRows((from,to)=>db.from("sessions").select("id,cohort_id,ends_at").in("cohort_id",cohortIds).order("id").range(from,to)):[];
  const records=[];
  // Bound the query size while loading all authorised assignments.
  for(let start=0;start<assignments.length;start+=100){
   const batch=assignments.slice(start,start+100),ids=batch.map(a=>a.id),users=batch.map(a=>a.user_id);
   const [progress,enrolments]=await Promise.all([
    allRows((from,to)=>db.from("lms_activity_progress").select("assignment_id,activity_id,state").in("assignment_id",ids).order("id").range(from,to)),
    cohortIds.length?allRows((from,to)=>db.from("enrolments").select("id,user_id,org_id,cohort_id,status").in("user_id",users).in("cohort_id",cohortIds).order("id").range(from,to)):Promise.resolve([]),
   ]);
   const enrolmentIds=enrolments.map(e=>e.id);
   const [attendance,grades,certificates]=enrolmentIds.length?await Promise.all([
    allRows((from,to)=>db.from("attendance").select("enrolment_id,session_id,status").in("enrolment_id",enrolmentIds).order("id").range(from,to)),
    allRows((from,to)=>db.from("grades").select("enrolment_id,score,max_score").in("enrolment_id",enrolmentIds).order("id").range(from,to)),
    allRows((from,to)=>db.from("certificates").select("enrolment_id,revoked_at").in("enrolment_id",enrolmentIds).order("id").range(from,to)),
   ]):[[],[],[]];
   for(const assignment of batch){
    const path=pathways?.find(d=>d.assignment_id===assignment.id)?.kind;
    const required=plan?plan.activities.filter(a=>["baseline","core","capstone",path].includes(a.stage)):null;
    const requiredIds=required?new Set(required.map(a=>a.id)):activityIds;
    const baselineIds=new Set(required?.filter(a=>a.stage==="baseline").map(a=>a.id)||[]);
    const ownProgress=progress.filter(p=>p.assignment_id===assignment.id&&requiredIds.has(p.activity_id));
    const passed=new Set(ownProgress.filter(p=>p.state==="passed"||(baselineIds.has(p.activity_id)&&p.state==="returned")).map(p=>p.activity_id)).size;
    const live=cohorts.map(c=>{
     const enrolment=enrolments.find(e=>e.cohort_id===c.id&&e.user_id===assignment.user_id&&e.org_id===assignment.org_id);
     const scheduled=sessions.filter(s=>s.cohort_id===c.id),sessionIds=new Set(scheduled.map(s=>s.id));
     const register=attendance.filter(a=>a.enrolment_id===enrolment?.id&&sessionIds.has(a.session_id));
     const marked=grades.filter(g=>g.enrolment_id===enrolment?.id).map(g=>({score:Number(g.score),max_score:Number(g.max_score)}));
     const certificate=certificates.find(x=>x.enrolment_id===enrolment?.id);
     const item:LiveProgress={cohortId:c.id,title:c.title,status:c.status,enrolmentStatus:enrolment?.status||null,sessions:scheduled.length,recorded:register.length,attended:register.filter(a=>["present","late"].includes(a.status)).length,excused:register.filter(a=>a.status==="excused").length,attendancePercent:computeAttendancePct(scheduled.length,register.map(a=>({status:a.status as AttendanceStatus}))),attendanceRequired:Number(c.pass_attendance_pct),gradePercent:computeGradePct(marked),gradeRequired:Number(c.pass_grade_pct),certificate:certificate?(certificate.revoked_at?"revoked":"issued"):"none",upcoming:scheduled.filter(s=>new Date(s.ends_at).getTime()>Date.now()).length};
     return {...item,...liveNextStep(item)};
    });
    const profile=assignment.user_profiles as unknown as {name:string}|null;
    const course={passed,total:requiredIds.size,awaitingReview:ownProgress.filter(p=>p.state==="submitted").length,needsRevision:ownProgress.filter(p=>p.state==="returned"&&!baselineIds.has(p.activity_id)).length,completedAt:assignment.completed_at};
    const journey=plan&&!deliveryPlan?.released_at?{state:"setup",title:"Your programme is being prepared",message:"The provider and client need to approve the assessment plan before learning starts.",owner:"manager",destination:"learning",completed:false}:plan&&!path&&plan.activities.some(a=>a.stage==="pathway_a"||a.stage==="pathway_b")&&required?.filter(a=>["baseline","core"].includes(a.stage)).every(a=>ownProgress.some(p=>p.activity_id===a.id&&(p.state==="passed"||(a.stage==="baseline"&&p.state==="returned"))))?{state:"review",title:"Your pathway decision is next",message:"Your trainer will review the common work and agree a pathway in Programme delivery.",owner:"trainer",destination:"results",completed:false}:programmeJourney(course,live);
    records.push({journey,id:assignment.id,name:profile?.name||"Learner",course,live});
   }
  }
  return NextResponse.json({title:programme.title,manager,records,generatedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return learningErrorResponse(error);}
}
