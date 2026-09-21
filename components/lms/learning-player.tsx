"use client";
import {Check,Code2,FileCheck2,Send,ShieldCheck} from "lucide-react";
import type {DeliveryPlan,DeliveryRecord} from "@/lib/lms/delivery-schema";
import {useCallback,useEffect,useRef,useState} from "react";
import {EvidenceUpload} from "./evidence-upload";
import {LearnerMaterials} from "./learner-materials";
import {useLearningBrand} from "./learning-brand";
import {AssistantMessage} from "./assistant-message";
import {LoadingState,useMutation} from "./workspace";
import {lmsCommand} from "@/lib/lms/client";
import type {Activity,Assignment,Programme,ProgressRecord} from "@/lib/lms/schema";

type Learning={delivery_plan?:boolean;baseline_activity_ids?:string[];assignment:Assignment;programme:Programme;activities:(Omit<Activity,"correctOption">&{course_title:string})[];progress:ProgressRecord[];history:{id:string;action:string;created_at:string;snapshot:ProgressRecord}[]};
export function LearningPlayer({assignmentId:id,evidenceFiles,assessmentPlan,assessmentHistory,onUpdated,onProgress}:{assignmentId:string;evidenceFiles:DeliveryRecord["files"];assessmentPlan?:DeliveryPlan;assessmentHistory:DeliveryRecord["history"];onUpdated?:()=>void;onProgress:()=>void}){
 const brand=useLearningBrand();
 const [data,setData]=useState<Learning|null>(null),[error,setError]=useState("");
 const [selectedId,setSelectedId]=useState("");
 const [answer,setAnswer]=useState(""),[option,setOption]=useState<number|null>(null);
 const openedAssignment=useRef<string|null>(null);
 const outline=useRef<HTMLDetailsElement|null>(null);
 const load=useCallback(async()=>{
  try{
   const learning=await lmsCommand<Learning>({action:"learning.get",payload:{id}});
   if(openedAssignment.current!==id){
    const first=learning.activities.find(a=>{const p=learning.progress.find(p=>p.activity_id===a.id);return !p||(p.state!=="passed"&&p.state!=="submitted"&&!(learning.baseline_activity_ids?.includes(a.id)&&p.reviewed_by));})||learning.activities[0];
    setSelectedId(first?.id||"");
    const previous=learning.progress.find(p=>p.activity_id===first?.id);
    setAnswer(previous?.state==="returned"?previous.answer||"":"");
    openedAssignment.current=id;
   }
   setData(learning);setError("");
  }catch(e){setError(e instanceof Error?e.message:"Could not load learning");}
 },[id]);
 useEffect(()=>{
  // The asynchronous request updates state after the server responds.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void load();
 },[load]);
 useEffect(()=>{
  const media=window.matchMedia("(max-width:640px)");
  const resize=()=>{if(outline.current)outline.current.open=!media.matches;};
  resize();media.addEventListener("change",resize);return()=>media.removeEventListener("change",resize);
 },[data?.assignment.id]);
 const {busy,message,setMessage,mutate}=useMutation(load);
 const activity=data?.activities.find(a=>a.id===selectedId)||data?.activities[0];
 const index=data?.activities.findIndex(a=>a.id===activity?.id)??0;
 const progress=data?.progress.find(p=>p.activity_id===activity?.id);
 const diagnosticRecorded=Boolean(activity&&data?.baseline_activity_ids?.includes(activity.id)&&progress?.reviewed_by);
 const complete=(a:Learning["activities"][number])=>data?.progress.some(p=>p.activity_id===a.id&&(p.state==="passed"||(data.baseline_activity_ids?.includes(a.id)&&p.reviewed_by)));
 const done=data?.activities.filter(complete).length||0;
 const locked=busy||data?.programme.status!=="active";
 const recorded=progress?.state==="passed"||progress?.state==="submitted"||diagnosticRecorded;
 function select(activityId:string){setSelectedId(activityId);const p=data?.progress.find(p=>p.activity_id===activityId);setAnswer(p?.state==="returned"?p.answer||"":"");setOption(null);setMessage("");}
 async function submit(){
  if(!activity)return;
  const result=await mutate<{state:string}>({action:"learning.submit",payload:{id,activity_id:activity.id,answer,option}});
  if(!result)return;
  onUpdated?.();
  if(result.state==="passed"&&activity.kind==="lesson"&&data?.activities[index+1]){select(data.activities[index+1].id);setMessage("Lesson completed. Your next activity is ready.");}
  else setMessage(result.state==="passed"?"Activity completed.":result.state==="submitted"?"Submitted to your trainer. Your feedback will appear here.":"Review the feedback and try again.");
 }
 if(!data)return <LoadingState error={error} retry={load}/>;
 if(!activity)return <section className="programme-empty"><h2>Your learning is being prepared</h2><p>Your programme team will make activities available here when the plan is ready.</p></section>;
 const practical=["practice","observation"].includes(activity.kind);
 const conf=assessmentPlan?.activities.find(a=>a.id===activity.id);
 const files=evidenceFiles.filter(f=>f.activity_id===activity.id);
 const currentSubmission=assessmentHistory.filter(h=>h.action==="learning.submit"&&h.snapshot.activity_id===activity.id).at(-1);
 const submittedFiles=files.filter(f=>f.attempt_id===currentSubmission?.id);
 const review=assessmentHistory.filter(h=>h.action==="learning.review"&&h.snapshot.activity_id===activity.id).at(-1);
 const labPassed=practical&&progress?.state==="passed"&&conf?.stage!=="baseline";
 const activityState=diagnosticRecorded?"Entry assessment recorded":progress?.state==="submitted"?"Awaiting trainer review":progress?.state==="passed"?"Completed":progress?.state==="returned"?"Revision requested":"";
 return <div className="focused-learning">
  <aside className="learning-outline" aria-label="Learning outline">
   <div className="outline-heading"><h2>Course outline</h2><span>{done} / {data.activities.length} available complete</span></div>
   <progress value={done} max={data.activities.length||1} aria-label="Available activities completed"/>
   <details ref={outline} className="outline-list" open><summary>Activities <span>{data.activities.length} available</span></summary><nav aria-label="Course activities">{data.activities.map((a,i)=>{
    const p=data.progress.find(p=>p.activity_id===a.id);
    return <button key={a.id} aria-current={a.id===activity.id?"step":undefined} onClick={()=>select(a.id)}><span className="outline-number">{complete(a)?"✓":String(i+1).padStart(2,"0")}</span><span>{a.title}<small>{p?.state==="submitted"?"Awaiting review":p?.state==="returned"&&!complete(a)?"Revision requested":a.minutes+" min"}</small></span></button>;
   })}</nav></details>
  </aside>
  <article className="learning-task" aria-labelledby="activity-title">
   <div className="activity-meta"><span>Activity {index+1} · {{lesson:"Lesson",quiz:"Knowledge check",practice:"Practical task",observation:"Observed task"}[activity.kind]} · {activity.minutes} min</span>{activityState&&!practical&&<span>{activityState}</span>}</div>
   <h2 id="activity-title">{activity.title}</h2>
   {practical&&<div className={`lab-mission ${labPassed?"lab-earned":""}`}>
    <div className="lab-mission-title"><span className="lab-mission-icon">{labPassed?<ShieldCheck size={24}/>:<Code2 size={24}/>}</span><div><strong>{labPassed?"Lab demonstrated":diagnosticRecorded?"Starting point recorded":progress?.state==="submitted"?"Your work is in review":progress?.state==="returned"?"Improve your solution":conf?.stage==="capstone"?"Your final challenge":conf?.stage==="baseline"?"Find your starting point":"Your lab challenge"}</strong><p>{labPassed?"Your trainer has assessed and passed this work.":diagnosticRecorded?"Your entry evidence will help show how far you progress.":progress?.state==="submitted"?"Your trainer will review your saved response and evidence.":progress?.state==="returned"?"Use the feedback below, improve your work and submit another attempt.":"Build something, show your evidence, and get feedback."}</p></div></div>
    <ol className="lab-evidence-path" aria-label="Lab submission status"><li className={answer.trim()||files.length||progress?"reached":""}><FileCheck2 size={16}/><span>Your work</span></li><li className={progress?"reached":""}><Send size={15}/><span>{progress?"Submitted":"Submit"}</span></li><li className={labPassed||diagnosticRecorded?"reached":""}><ShieldCheck size={16}/><span>{labPassed?"Assessed & passed":diagnosticRecorded?"Entry reviewed":progress?.state==="returned"?"Revise & retry":"Trainer review"}</span></li></ol>
   </div>}
   <div className="activity-content"><AssistantMessage text={activity.content.replace(/^#\s+[^\n]+\n/,"")}/></div>
   {(activity.materials?.length||0)>0&&<details className="activity-resources"><summary>Resources for this activity <span>{activity.materials!.length} resources</span></summary><LearnerMaterials compact brand={brand} title={activity.title} activities={[activity]}/></details>}
   {activity.criteria&&<details className="activity-resources"><summary>Assessment criteria</summary><div className="py-4 text-sm">{conf?.criteria.length?<ul className="space-y-3">{conf.criteria.map(c=><li key={c.id}><strong>{c.skill}</strong><p>{c.description}</p>{review?.snapshot.scores?.[c.id]!==undefined&&<span className="text-xs text-muted-foreground">Last assessed score: {review.snapshot.scores[c.id]} / 4</span>}</li>)}</ul>:<AssistantMessage text={activity.criteria}/>}</div></details>}
   {(error||message)&&<p role="status" className="activity-message">{error||message}</p>}
   {progress?.feedback&&<section className="activity-feedback"><h3>Trainer feedback</h3><AssistantMessage text={progress.feedback}/>{progress.observation_context&&<p className="mt-3 text-sm">Observed conditions: {progress.observation_context}</p>}</section>}
   {practical&&progress?.state==="submitted"&&<div className="submission-receipt"><Check size={17}/><div><strong>Submission received</strong><p>Your response is saved.{submittedFiles.length>0&&` ${submittedFiles.length} ${submittedFiles.length===1?"file is":"files are"} linked to this attempt.`} Your trainer will assess the work before this lab counts as passed.</p></div></div>}
   {files.length>0&&<div className="lab-files"><h3>{recorded?"Your evidence":"Evidence attached"}</h3>{files.map(f=><a key={f.id} href={`/api/lms/programmes/${data.programme.id}/files?file=${f.id}`}><FileCheck2 size={16}/><span>{f.name}<small>{Math.ceil(f.bytes/1000)} KB · {f.attempt_id?"Linked to a submission":"Ready to submit"}</small></span></a>)}</div>}
   <div className="lms-form activity-work">
    {!recorded&&activity.kind==="quiz"&&<fieldset disabled={locked}><legend className="sr-only">Choose your answer</legend>{activity.options.map((o,i)=><label className="lms-check" key={i}><input type="radio" name={activity.id} checked={option===i} onChange={()=>setOption(i)}/>{o}</label>)}</fieldset>}
    {!recorded&&["practice","observation"].includes(activity.kind)&&<fieldset disabled={locked}>
     <label htmlFor="activity-answer">{activity.kind==="observation"?"Your demonstration plan":"Your response"}</label><textarea id="activity-answer" value={answer} onChange={e=>setAnswer(e.target.value)} maxLength={20000} rows={5} placeholder="Explain your approach, results and checks."/>
     {data.delivery_plan&&<EvidenceUpload programmeId={data.programme.id} assignmentId={id} activityId={activity.id} refresh={async()=>{await load();onUpdated?.();}}/>}
    </fieldset>}
    {recorded&&progress?.answer&&activity.kind!=="quiz"&&<details className="activity-resources"><summary>Your submitted response</summary><p className="whitespace-pre-wrap py-4 text-sm">{progress.answer}</p></details>}
    <footer className="activity-actions">
     {!recorded?<button className="lms-button" disabled={locked||activity.kind==="quiz"&&option===null||["practice","observation"].includes(activity.kind)&&answer.trim().length<3} onClick={submit}>{busy?"Saving…":activity.kind==="lesson"?(data.activities[index+1]?"Complete & continue":"Complete lesson"):activity.kind==="quiz"?"Check answer":"Submit for review"}</button>:data.activities[index+1]?<button className="lms-button" onClick={()=>select(data.activities[index+1].id)}>Continue to next activity →</button>:<button className="lms-button" onClick={onProgress}>View my progress →</button>}
     {!recorded&&data.activities[index+1]&&activity.kind!=="lesson"&&<button className="text-sm text-muted-foreground underline" onClick={()=>select(data.activities[index+1].id)}>Come back to this later</button>}
    </footer>
   </div>
  </article>
 </div>;
}
