"use client";
import { LabAIReview } from "./lab-ai-review";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {programmeNextAction} from "@/lib/lms/programme-next-action";
import {ProgrammeMilestones} from "./programme-milestones";
import {LearningPlayer} from "./learning-player";
import {ProgrammePeople} from "./programme-people";
import {ProgrammeDelivery} from "./programme-delivery";
import {LearnerDiscussion} from "./learner-discussion";
import {DeliveryLive} from "./delivery-live";
import { deliveryInsights, skillResults, stages, stageLabels, type DeliveryActivity, type DeliveryCommand, type DeliveryPlan, type DeliveryRecord, type DeliveryWorkspace } from "@/lib/lms/delivery-schema";

type Send=(command:DeliveryCommand)=>Promise<boolean>;
function initialPlan(data:DeliveryWorkspace):DeliveryPlan {
  return data.plan?.content || {brief:data.programme.goal,targetRoles:"",hours:120,labUrl:"",minimumPanelReviews:1,
    activities:data.activities.map(a=>({id:a.id,stage:"core",passPercent:60,criteria:["practice","observation"].includes(a.kind)?[{id:crypto.randomUUID(),skill:"Practical application",description:a.criteria||"Demonstrate the task and explain the result."}]:[]}))};
}
export function DeliveryWorkspaceView({programmeId,initialView="overview"}:{programmeId:string;initialView?:string}) {
  const [data,setData]=useState<DeliveryWorkspace|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const [tab,setTab]=useState(initialView);
  const [liveRevision,setLiveRevision]=useState(0);
  const [evidenceRecordId,setEvidenceRecordId]=useState("");
  const load=useCallback(async()=>{
    try {const res=await fetch(`/api/lms/programmes/${programmeId}/workspace`,{cache:"no-store"});const d=await res.json();if(!res.ok)throw Error(d.error);setData(d);setError("");}
    catch(e){setError(e instanceof Error?e.message:"Could not open the programme.");}
  },[programmeId]);
  useEffect(()=>{void load();},[load]);
  useEffect(()=>{const back=()=>setTab(new URL(window.location.href).searchParams.get("view")||"overview");window.addEventListener("popstate",back);return()=>window.removeEventListener("popstate",back);},[]);
  function navigate(view:string){setTab(view);setMessage("");window.history.pushState(null,"",`/dashboard/programmes/${programmeId}${view==="overview"?"":`?view=${view}`}`);window.scrollTo({top:0,behavior:"instant"});}
  const send:Send=async(command)=>{
    setBusy(true);setMessage("");
    try {const res=await fetch(`/api/lms/programmes/${programmeId}/workspace`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify(command)});const d=await res.json();if(!res.ok)throw Error(d.error);await load();setMessage("Saved. The programme record has been updated.");return true;}
    catch(e){setMessage(e instanceof Error?e.message:"Could not save this change.");return false;}
    finally{setBusy(false);}
  };
  if(!data)return <div className="lms-panel my-6"><h1>Opening your programme</h1><p role="status">{error||"Bringing your learning and teaching together…"}</p>{error&&<button onClick={load} className="lms-button">Retry</button>}</div>;
  const team=["manager","trainer"].includes(data.role)&&data.programme.status==="active";
  const mine=data.records.find(r=>r.user_id===data.viewer_id);
  const next=programmeNextAction(data);
  const learner=data.role==="learner";
  const tabs=learner?[["learn","Learn"],["live","Schedule"],["insights","Progress"]]:data.role==="reviewer"?[["evidence","Projects"],["insights","Outcomes"]]:[["overview","Overview"],["evidence","Learners"],["live","Sessions"],["insights","Outcomes"],...(mine?[["learn","My learning"]]:[])];
  const requested=learner?(tab==="overview"?"learn":tab==="evidence"?"insights":tab):data.role==="reviewer"&&tab==="overview"?"evidence":tab==="plan"?"overview":tab==="people"?"evidence":tab;
  const active=tabs.some(([key])=>key===requested)?requested:tabs[0][0];
  return <div className="lms-workspace programme-shell py-6">
    <Link className="text-sm text-brand" href="/dashboard/programmes">← Programmes</Link>
    <header className="programme-header">
      <div><p className="programme-context">{{manager:"Programme management",trainer:"Trainer workspace",client:"Client workspace",reviewer:"Independent review",learner:"Your programme"}[data.role]}</p><h1>{data.programme.title}</h1></div>
      {!learner&&<span className="programme-status">{data.programme.status==="archived"?"Archived":data.plan&&!data.plan.released_at?"Preparing":data.role==="learner"&&mine?.completed_at?"Coursework complete":"In progress"}</span>}
    </header>
    <nav aria-label="This programme" className="programme-navigation">{tabs.map(([key,label])=><button key={key} aria-pressed={active===key} onClick={()=>navigate(key)}>{label}</button>)}</nav>
    {(error||message)&&<p role="status" className="lms-notice mb-5">{error||message}</p>}
    {active==="overview"&&<>
      <section className="mb-6 grid gap-6 rounded-2xl programme-next-panel p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-wider">Your next step</p><h2 className="my-3 text-2xl">{next.title}</h2><p className="max-w-2xl">{next.description}</p></div>{next.view!=="overview"&&<button className="lms-button programme-next-button" onClick={()=>navigate(next.view)}>{next.label} →</button>}</section>
      <section className="lms-panel"><h2>Programme brief</h2><p className="my-4">{data.plan?.content?.brief||data.programme.goal}</p><div className="flex flex-wrap gap-5 text-sm text-muted-foreground"><span>{data.records.length} learners</span><span>{data.activities.length} activities across all pathways</span>{data.plan?.content.hours&&<span>{data.plan.content.hours} planned learning hours</span>}</div></section>
      <details className="programme-setup mt-5" open={!data.plan?.released_at||tab==="plan"}><summary>Programme setup <span>{data.plan?.released_at?"Approved plan and assessment criteria":"Prepare and approve the learning plan"}</span></summary><fieldset disabled={busy||data.programme.status!=="active"} className="border-0 p-0 pt-4"><PlanEditor key={`${data.plan?.revision||0}-${data.plan?.released_at||"draft"}`} data={data} send={send}/></fieldset></details>
    </>}
    {active==="learn"&&mine&&<LearningPlayer assignmentId={mine.id} evidenceFiles={mine.files} assessmentPlan={data.plan?.content} assessmentHistory={mine.history} onUpdated={()=>void load()} onProgress={()=>navigate("insights")}/>}
    {active==="live"&&<div className="space-y-5">{data.role==="manager"&&<details className="lms-panel"><summary className="cursor-pointer font-semibold">Set up teaching groups and learner places</summary><ProgrammeDelivery programmeId={programmeId} embedded onChanged={()=>{setLiveRevision(n=>n+1);void load();}}/></details>}<fieldset disabled={busy||data.programme.status!=="active"} className="border-0 p-0"><DeliveryLive key={liveRevision} programmeId={programmeId} canManage={team} send={send}/></fieldset>{data.role!=="reviewer"&&<details className="lms-panel"><summary className="cursor-pointer font-semibold">Programme discussion</summary><LearnerDiscussion programmeId={programmeId}/></details>}</div>}
    {active==="evidence"&&<fieldset disabled={busy} className="min-w-0 space-y-6 border-0 p-0">{["manager","client"].includes(data.role)&&<details className="programme-setup" open={tab==="people"||!data.records.length}><summary>Manage participants <span>Learners and programme team</span></summary><ProgrammePeople data={data} refresh={load}/>{data.role==="manager"&&<Team data={data} send={send}/>}</details>}{!data.records.length&&<div className="lms-panel"><h2>No learners yet</h2><p>Add people to this programme to begin.</p><button className="lms-button mt-4" onClick={()=>navigate("people")}>Add learners</button></div>}<AssessmentQueue data={data} initialRecordId={evidenceRecordId} send={send} refresh={load} onLearn={()=>navigate("learn")}/></fieldset>}
    {active==="insights"&&<section className="lms-panel"><div className="flex flex-wrap justify-between gap-4"><h2>{learner?"Your progress":"Progress supported by evidence"}</h2><div className="flex gap-4"><a className="text-brand underline" href={`/api/lms/programmes/${programmeId}/report?format=csv`}>Download CSV</a><a className="text-brand underline" href={`/api/lms/programmes/${programmeId}/report`} target="_blank" rel="noopener noreferrer">Open printable report</a></div></div>{learner&&mine&&<ProgrammeMilestones data={data} record={mine}/>}<p className="my-4 text-sm text-muted-foreground">Scores use the approved 0–4 criteria. Changes compare matching skills at entry and final assessment.</p>{!learner&&<div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Learners",data.records.length],["Coursework complete",data.records.filter(r=>r.completed_at).length],["Awaiting review",data.records.reduce((n,r)=>n+r.progress.filter(p=>p.state==="submitted").length,0)],["Readiness recorded",data.records.filter(r=>r.decisions.at(-1)?.kind==="ready").length]].map(([label,value])=><div className="rounded-xl bg-muted/40 p-4" key={label}><strong className="block text-2xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></div>)}</div>}{data.records.map(r=><details key={r.id} open={data.role==="learner"} className="my-3 rounded-xl border p-5"><summary className="cursor-pointer"><strong>{r.name}</strong><span className="ml-3 text-sm text-muted-foreground">{r.completed_at?"Coursework complete":"In progress"} · {r.decisions.at(-1)?.kind.replaceAll("_"," ")||"No decision recorded"}</span></summary>{data.plan?.content&&<><ul className="my-4 space-y-2">{deliveryInsights(r,data.plan.content).map(i=><li key={i.label}>{i.label}{i.evidence.length>0&&<span className="ml-2 text-xs text-muted-foreground">({i.evidence.length} supporting records)</span>}</li>)}</ul><SkillTable record={r} plan={data.plan.content}/></>}{learner?<details className="mt-5 border-t pt-4"><summary className="cursor-pointer text-sm font-semibold">Submission history and feedback</summary><LearnerEvidence data={data} record={r} send={send} refresh={load} onLearn={()=>navigate("learn")}/></details>:<button className="mt-4 text-sm font-semibold text-brand" onClick={()=>{setEvidenceRecordId(r.id);navigate("evidence");}}>View evidence and decisions →</button>}</details>)}</section>}
  </div>;
}

function AssessmentQueue({data,initialRecordId,send,refresh,onLearn}:{data:DeliveryWorkspace;initialRecordId:string;send:Send;refresh:()=>Promise<void>;onLearn:()=>void}) {
 const [selected,setSelected]=useState(initialRecordId);
 const [search,setSearch]=useState("");
 const [filter,setFilter]=useState("all");
 const pending=(r:DeliveryRecord)=>r.progress.filter(p=>p.state==="submitted"&&(data.role!=="reviewer"||data.plan?.content.activities.some(a=>a.id===p.activity_id&&a.stage==="capstone"))).length;
 const returned=(r:DeliveryRecord)=>r.progress.some(p=>p.state==="returned"&&!data.plan?.content.activities.some(a=>a.id===p.activity_id&&a.stage==="baseline"));
 const rows=data.records.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())&&(filter==="all"||filter==="pending"&&pending(r)>0||filter==="returned"&&returned(r)||filter==="complete"&&r.completed_at)).sort((a,b)=>pending(b)-pending(a)||a.name.localeCompare(b.name));
 const current=rows.find(r=>r.id===selected)||rows[0];
 if(data.role==="learner")return current?<LearnerEvidence data={data} record={current} send={send} refresh={refresh} onLearn={onLearn}/>:null;
 return <div className="grid items-start gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
  <aside className="lms-panel lms-form !p-4" aria-label="Assessment queue"><h2>{data.role==="reviewer"?"Project review queue":"Learner review queue"}</h2><p className="my-2 text-xs text-muted-foreground">{data.records.reduce((n,r)=>n+pending(r),0)} submissions awaiting review</p>
   <label className="block my-4">Find a learner<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name"/></label>
   <label className="block my-4">Show<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All learners</option><option value="pending">Awaiting review</option><option value="returned">Needs revision</option><option value="complete">Coursework complete</option></select></label>
   <div className="max-h-[500px] space-y-2 overflow-y-auto">{rows.map(r=><button key={r.id} aria-pressed={current?.id===r.id} onClick={()=>setSelected(r.id)} className={`w-full rounded-lg border p-3 text-left ${current?.id===r.id?"border-brand bg-brand/5":"border-transparent hover:bg-muted"}`}><strong className="block text-sm">{r.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{pending(r)?`${pending(r)} awaiting review`:returned(r)?"Feedback to act on":r.completed_at?"Coursework complete":"In progress"}</span></button>)}</div>
  </aside>
  {current?<LearnerEvidence key={current.id} data={data} record={current} send={send} refresh={refresh} onLearn={onLearn}/>:<section className="lms-panel"><h2>No matching learners</h2><p className="mt-3 text-sm text-muted-foreground">Choose another filter or clear your search.</p></section>}
 </div>;
}

function PlanEditor({data,send}:{data:DeliveryWorkspace;send:Send}) {
  const [plan,setPlan]=useState(()=>initialPlan(data));
  const editable=["manager","trainer"].includes(data.role)&&!data.plan?.released_at;
  const revision=data.plan?.revision||0;
  function changeActivity(id:string,patch:Partial<DeliveryPlan["activities"][number]>){setPlan(p=>({...p,activities:p.activities.map(a=>a.id===id?{...a,...patch}:a)}));}
  return <section className="lms-panel lms-form"><h2>Brief and assessment plan</h2><p className="text-sm">Revision {revision||"not saved"} · Provider {data.plan?.provider_approved_by?"approved":"approval pending"} · Client {data.programme.client_org_id?(data.plan?.client_approved_by?"approved":"approval pending"):"not required"}</p>
  <fieldset disabled={!editable} className="space-y-5 border-0 p-0">
    <label className="block">Client brief and intended outcomes<textarea value={plan.brief} onChange={e=>setPlan({...plan,brief:e.target.value})} rows={4}/></label>
    <label className="block">Target roles and entry requirements<textarea value={plan.targetRoles} onChange={e=>setPlan({...plan,targetRoles:e.target.value})} rows={3}/></label>
    <div className="grid gap-4 sm:grid-cols-3"><label>Total learning hours<input type="number" min={1} max={2000} value={plan.hours} onChange={e=>setPlan({...plan,hours:Number(e.target.value)})}/></label><label>Independent final-project reviewers<input type="number" min={1} max={5} value={plan.minimumPanelReviews} onChange={e=>setPlan({...plan,minimumPanelReviews:Number(e.target.value)})}/></label><label>Approved practical environment<input type="url" placeholder="https://…" value={plan.labUrl} onChange={e=>setPlan({...plan,labUrl:e.target.value})}/></label></div>
    <p className="text-sm text-muted-foreground">Published lessons come from your Content library. Map them to stages here. Use matching skill labels and comparable criteria for entry and final assessment. Score meaning: 0 no evidence, 1 substantial support, 2 partial demonstration, 3 independent demonstration, 4 strong independent demonstration.</p>
    {plan.activities.map(a=>{const source=data.activities.find(s=>s.id===a.id);return <details key={a.id} className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">{source?.title} · {stageLabels[a.stage]}</summary><div className="mt-4 grid gap-4 sm:grid-cols-2"><label>Stage<select value={a.stage} onChange={e=>changeActivity(a.id,{stage:e.target.value as typeof a.stage})}>{stages.map(s=><option key={s} value={s}>{stageLabels[s]}</option>)}</select></label><label>Pass threshold (%)<input type="number" min={1} max={100} value={a.passPercent} onChange={e=>changeActivity(a.id,{passPercent:Number(e.target.value)})}/></label></div>
      {a.criteria.map((c,i)=><div key={c.id} className="my-4 grid gap-3 sm:grid-cols-[1fr_2fr_auto]"><label>Skill<input value={c.skill} onChange={e=>changeActivity(a.id,{criteria:a.criteria.map((v,j)=>j===i?{...v,skill:e.target.value}:v)})}/></label><label>Observable criterion<textarea value={c.description} onChange={e=>changeActivity(a.id,{criteria:a.criteria.map((v,j)=>j===i?{...v,description:e.target.value}:v)})}/></label><button className="text-sm underline" onClick={()=>changeActivity(a.id,{criteria:a.criteria.filter((_,j)=>j!==i)})}>Remove criterion</button></div>)}
      {source&&["practice","observation"].includes(source.kind)&&<button className="lms-button secondary mt-3" onClick={()=>changeActivity(a.id,{criteria:[...a.criteria,{id:crypto.randomUUID(),skill:"",description:""}]})}>Add criterion</button>}
    </details>})}
  </fieldset>
  <div className="mt-5 flex flex-wrap gap-3">{editable&&<button className="lms-button" onClick={()=>send({action:"plan.save",revision,plan})}>Save plan for approval</button>}{revision>0&&!data.plan?.released_at&&["manager","client"].includes(data.role)&&<button className="lms-button secondary" onClick={()=>send({action:"plan.approve",revision})}>Approve saved revision {revision}</button>}{revision>0&&!data.plan?.released_at&&data.role==="manager"&&<button className="lms-button secondary" onClick={()=>send({action:"plan.release",revision})}>Release approved plan</button>}</div>
  {editable&&<p className="mt-3 text-sm text-muted-foreground">Saving changes clears earlier approvals. Approval applies to the saved revision, not unsaved edits. After release the plan is fixed.</p>}
  </section>;
}

function Team({data,send}:{data:DeliveryWorkspace;send:Send}) {
 const [email,setEmail]=useState(""),[role,setRole]=useState<"trainer"|"reviewer">("trainer");
 return <section className="lms-panel lms-form"><h2>Programme team</h2><p>Invite an existing, verified Experrt account. They accept in Programmes. Access covers this programme only; it grants no access to billing or other clients.</p><form onSubmit={async e=>{e.preventDefault();if(await send({action:"staff.invite",email,role}))setEmail("");}} className="my-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]"><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Responsibility<select value={role} onChange={e=>setRole(e.target.value as typeof role)}><option value="trainer">Trainer: prepare and assess</option><option value="reviewer">Panel reviewer: review final projects</option></select></label><button className="lms-button">Invite to programme</button></form><p className="text-sm text-muted-foreground">This creates an in-app invitation. Share the programme link with the person separately.</p>{data.staff.map(s=><div key={s.user_id} className="my-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"><span>{s.name} · {s.role} · {s.state}</span>{s.state!=="revoked"&&<button className="lms-button secondary" onClick={()=>send({action:"staff.revoke",user_id:s.user_id})}>Revoke programme access</button>}</div>)}</section>;
}

function LearnerEvidence({data,record,send,onLearn}:{data:DeliveryWorkspace;record:DeliveryRecord;send:Send;refresh:()=>Promise<void>;onLearn:()=>void}) {
 const [reason,setReason]=useState(""),[decision,setDecision]=useState<"pathway_a"|"pathway_b"|"ready"|"support">("support");
 const team=["manager","trainer"].includes(data.role)&&data.programme.status==="active";
 return <section className="lms-panel"><div className="flex flex-wrap justify-between gap-3"><h2>{record.name}</h2><span className="lms-badge">{record.completed_at?"Coursework complete":"In progress"}</span></div>
 {data.activities.filter(activity=>{
  const stage=data.plan?.content.activities.find(a=>a.id===activity.id)?.stage;
  if(data.role==="reviewer")return stage==="capstone";
  if(data.role==="learner"&&(stage==="pathway_a"||stage==="pathway_b"))return record.decisions.some(d=>d.kind===stage);
  return true;
 }).map(activity=>{const conf=data.plan?.content?.activities.find(a=>a.id===activity.id);const progress=record.progress.find(p=>p.activity_id===activity.id);const files=record.files.filter(f=>f.activity_id===activity.id);return <details key={activity.id} open={progress?.state==="submitted"||progress?.state==="returned"&&conf?.stage!=="baseline"} className="my-4 rounded-xl border p-4"><summary className="cursor-pointer font-semibold">{activity.title} <span className="font-normal text-muted-foreground">· {conf?stageLabels[conf.stage]:activity.kind} · {progress?.state||"Not submitted"}</span></summary><div className="mt-4 space-y-4">
 {conf&&conf.criteria.length>0&&<div><h3 className="text-sm">Published assessment criteria</h3><ul className="my-3 list-disc pl-5 text-sm">{conf.criteria.map(c=><li key={c.id}><strong>{c.skill}:</strong> {c.description}</li>)}</ul><p className="text-xs text-muted-foreground">Scored 0–4 per criterion. {conf.stage==="baseline"?"This entry assessment establishes your starting point.":`Pass threshold: ${conf.passPercent}%.`}</p></div>}
 {progress?.answer&&<div><h3 className="text-sm">Submitted work</h3><pre className="whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-sm">{progress.answer}</pre></div>}
 {files.length>0&&<ul className="space-y-2">{files.map(f=><li key={f.id}><a className="text-brand underline" href={`/api/lms/programmes/${data.programme.id}/files?file=${f.id}`}>{f.name}</a><span className="ml-2 text-xs text-muted-foreground">{Math.ceil(f.bytes/1000)} KB · {f.attempt_id?"Submitted evidence":"Attached to next submission"}</span></li>)}</ul>}
 
 {data.role==="learner"&&<button className="text-brand underline" onClick={onLearn}>Open my learning to submit or revise this activity</button>}
 {progress?.feedback&&<div className="rounded-xl bg-brand/5 p-4"><h3 className="text-sm">Trainer feedback</h3><p>{progress.feedback}</p></div>}
 {conf&&progress?.state==="submitted"&&data.programme.status==="active"&&(team||(data.role==="reviewer"&&conf.stage==="capstone"))&&<ReviewForm key={`${progress.id}-${progress.revision}`} programmeId={data.programme.id} activity={activity} conf={conf} progress={progress} panelOnly={data.role==="reviewer"} send={send}/>}
 {record.reviews.filter(r=>r.activity_id===activity.id).map(r=><div key={r.id} className="border-l-2 border-brand pl-3 text-sm"><strong>{r.kind==="panel"?"Panel review":"Assessment"} · attempt revision {r.revision}</strong><p>{r.feedback}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()} · {data.staff.find(s=>s.user_id===r.reviewer_id)?.name||"Programme assessor"}</p></div>)}
 <details><summary className="cursor-pointer text-sm">Attempt history</summary>{record.history.filter(h=>h.snapshot.activity_id===activity.id).map(h=><div key={h.id} className="my-3 border-l pl-3 text-sm"><strong>{h.action==="learning.review"?"Reviewed":"Submitted"} · {new Date(h.created_at).toLocaleString()}</strong><p className="whitespace-pre-wrap">{h.snapshot.feedback||h.snapshot.answer}</p><p className="text-xs text-muted-foreground">Record {h.id}</p></div>)}</details>
 </div></details>})}
 {team&&data.plan?.released_at&&<form className="lms-form mt-5 rounded-xl bg-muted/30 p-4" onSubmit={async e=>{e.preventDefault();if(await send({action:"decision",assignment_id:record.id,kind:decision,reason}))setReason("");}}><h3>Record a programme decision</h3><label>Decision<select value={decision} onChange={e=>setDecision(e.target.value as typeof decision)}><option value="support">Additional support required</option><option value="pathway_a">Route to Pathway A</option><option value="pathway_b">Route to Pathway B</option>{data.role==="manager"&&<option value="ready">Sign off assessed readiness</option>}</select></label><label>Reason and supporting evidence<textarea required minLength={10} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain the evidence, learner preference and any support agreed."/></label><button className="lms-button">Record decision</button></form>}
 {record.decisions.map(d=><div key={d.id} className="mt-4 rounded-xl border p-4"><strong>{d.kind.replaceAll("_"," ")}</strong><p>{d.reason}</p><p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()} · {data.staff.find(s=>s.user_id===d.actor_id)?.name||"Programme team"}</p></div>)}
 </section>;
}

function ReviewForm({programmeId,activity,conf,progress,panelOnly,send}:{programmeId:string;activity:DeliveryActivity;conf:DeliveryPlan["activities"][number];progress:DeliveryRecord["progress"][number];panelOnly:boolean;send:Send}) {
 const [aiId,setAiId]=useState<string|null>(null),[confirmed,setConfirmed]=useState(false);
 const [scores,setScores]=useState<Record<string,number>>({}),[feedback,setFeedback]=useState(""),[observation,setObservation]=useState(""),[decision,setDecision]=useState<"passed"|"returned"|"panel">(panelOnly?"panel":"returned");
 return <form className="lms-form rounded-xl bg-muted/30 p-4" onSubmit={e=>{e.preventDefault();if(aiId&&decision!=="panel") void send({action:"ai.publish",ai_review_id:aiId,progress_id:progress.id,revision:progress.revision,scores,feedback,observation_context:observation,decision}); else void send({action:"review",progress_id:progress.id,revision:progress.revision,scores,feedback,observation_context:observation,decision});}}><h3>Assess the current submission</h3>{!panelOnly&&<LabAIReview programmeId={programmeId} progressId={progress.id} onApply={(id,insights)=>{setAiId(id);setConfirmed(false);setFeedback(insights.draftFeedback);setScores(Object.fromEntries(insights.criteria.filter(c=>c.suggested_score!==null).map(c=>[c.criterion_id,c.suggested_score!])));}}/>}<p className="text-sm">Score 0: no evidence · 1: substantial support · 2: partial · 3: independent · 4: strong independent demonstration. Pass threshold: {conf.passPercent}%.</p>{conf.criteria.map(c=><label key={c.id} className="block"><strong>{c.skill}</strong> ({Math.round((c.weight||1)/conf.criteria.reduce((n,x)=>n+(x.weight||1),0)*100)}%): {c.description}<select required value={scores[c.id]??""} onChange={e=>setScores({...scores,[c.id]:Number(e.target.value)})}><option value="" disabled>Choose a score</option>{[0,1,2,3,4].map(n=><option key={n} value={n}>{n} / 4</option>)}</select></label>)}<label>Feedback<textarea required minLength={10} value={feedback} onChange={e=>setFeedback(e.target.value)}/></label>{activity.kind==="observation"&&<label>Observed task and conditions<textarea value={observation} onChange={e=>setObservation(e.target.value)}/></label>}<label>Decision<select value={decision} onChange={e=>setDecision(e.target.value as typeof decision)}>{!panelOnly&&<><option value="returned">Return for another attempt</option><option value="passed">Pass / record entry assessment</option></>}{conf.stage==="capstone"&&<option value="panel">Record independent panel review</option>}</select></label>{!panelOnly&&decision!=="panel"&&<label className="flex items-center gap-2"><input type="checkbox" required checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>I have reviewed the evidence, scores and feedback.</label>}<button className="lms-button">{decision==="panel"?"Save panel review":"Publish assessment"}</button></form>;
}
function SkillTable({record,plan}:{record:DeliveryRecord;plan:DeliveryPlan}) {
 const rows=skillResults(record,plan);
 if(!rows.length)return <p className="text-sm text-muted-foreground">No scored entry or final-project evidence yet.</p>;
 return <div className="overflow-x-auto"><table className="lms-table"><thead><tr><th>Skill</th><th>Entry</th><th>Final</th><th>Change</th></tr></thead><tbody>{rows.map(r=><tr key={r.skill}><td>{r.skill}</td><td>{r.baseline===null?"Not assessed":`${r.baseline}%`}</td><td>{r.final===null?"Not assessed":`${r.final}%`}</td><td>{r.change===null?"Not comparable":`${r.change>0?"+":""}${r.change} points`}</td></tr>)}</tbody></table></div>;
}
