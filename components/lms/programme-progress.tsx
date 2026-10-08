"use client";
import {useCallback,useEffect,useState} from "react";
import type {JourneyStep} from "@/lib/lms/programme-journey";
import type {LiveProgress} from "@/lib/lms/delivery-progress";
type RecordRow={journey:JourneyStep;id:string;name:string;course:{passed:number;total:number;awaitingReview:number;needsRevision:number;completedAt:string|null};live:(LiveProgress&{state:string;message:string})[]};
type Report={title:string;manager:boolean;records:RecordRow[];generatedAt:string};
export function ProgrammeProgress({programmeId,liveOnly=false,journeyOnly=false,onNavigate}:{programmeId:string;liveOnly?:boolean;journeyOnly?:boolean;onNavigate?:(destination:JourneyStep["destination"])=>void}){
 const [data,setData]=useState<Report|null>(null),[error,setError]=useState(""),[search,setSearch]=useState("");
 const load=useCallback(async()=>{try{const response=await fetch(`/api/lms/programmes/${programmeId}/progress${liveOnly ? "?view=mine" : ""}`,{cache:"no-store"});const result=await response.json();if(!response.ok)throw Error(result.error);setData(result);setError("");}catch(e){setData(null);setError(e instanceof Error?e.message:"Could not load progress");}},[programmeId,liveOnly]);
 useEffect(()=>{void load();},[load]);
 const rows=data?.records.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name))||[];
 if(journeyOnly) return <aside aria-label="Your next learning step" className="my-5 rounded-2xl border border-brand/20 bg-brand/5 p-4">
  {error?<p role="alert" className="text-sm">{error} <button className="font-semibold underline" onClick={load}>Retry</button></p>:!data?<p className="text-sm text-muted-foreground">Finding your next step…</p>:rows.map(row=><div key={row.id} className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0 flex-1"><h2 className="text-base font-semibold">{row.journey.title}</h2><p className="mt-1 text-sm text-muted-foreground">{row.journey.message}</p></div>{onNavigate&&<button className="lms-button secondary" onClick={()=>onNavigate(row.journey.destination)}>{row.journey.destination==="learning"?"Continue learning":row.journey.destination==="sessions"?"Open live sessions":"View results"} →</button>}</div>)}
 </aside>;
 return <section className={liveOnly?"my-6 rounded-2xl border p-5":"lms-panel"}>
  <div className="lms-row between"><div><span className="lms-eyebrow">Progress you can explain</span><h2>{journeyOnly?"Your next step":liveOnly?"Your learning journey":"Coursework and live training"}</h2></div><button onClick={load} className="lms-button secondary">Refresh progress</button></div>
  <p className="my-3 text-sm text-muted-foreground">See the next action across coursework, live sessions and certificate review. Status comes from recorded evidence; it does not issue a certificate.</p>
  {error&&<p role="alert" className="my-3 text-sm text-destructive">{error}</p>}
  {!data&&!error&&<p className="my-5 text-sm">Loading learning records…</p>}
  {data?.manager&&!liveOnly&&<><div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Learners",data.records.length],["Linked learning complete",data.records.filter(r=>r.journey.completed).length],["Awaiting review",data.records.reduce((n,r)=>n+r.course.awaitingReview,0)],["Live certificates issued",data.records.reduce((n,r)=>n+r.live.filter(l=>l.certificate==="issued").length,0)]].map(([label,value])=><div key={label} className="rounded-xl bg-muted/40 p-4"><strong className="block text-2xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></div>)}</div><input aria-label="Find learner progress" placeholder="Find a learner…" value={search} onChange={e=>setSearch(e.target.value)} className="mb-4 w-full rounded-xl border bg-card p-3 text-sm" /></>}
  <div className="space-y-4">{rows.map(row=><article className="rounded-2xl border p-5" key={row.id}>
   {!liveOnly&&<p className="mb-3 text-lg font-semibold">{row.name}</p>}
   <div className={`mb-4 rounded-xl border p-4 ${row.journey.completed?"border-emerald-300 bg-emerald-50 text-emerald-950":"border-brand/20 bg-brand/5"}`}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{row.journey.title}</h3><span className="rounded-full border px-2 py-1 text-xs">{row.journey.owner==="none"?"Recorded":`${{learner:"Learner",trainer:"Trainer",manager:"Learning manager"}[row.journey.owner]} action`}</span></div>
    <p className="mt-2 text-sm leading-relaxed">{row.journey.message}</p>
    {onNavigate&&<button className="mt-3 text-sm font-semibold text-brand" onClick={()=>onNavigate(row.journey.destination)}>{row.journey.destination==="learning"?"Open learning & feedback":row.journey.destination==="sessions"?"Open live sessions":"View your results"} →</button>}
   </div>
   {!journeyOnly&&<>
   {!liveOnly&&<><div className="lms-row between"><h3 className="text-base font-semibold">Course activity record</h3><span className="lms-badge">{row.course.completedAt?"Coursework complete":`${row.course.passed} / ${row.course.total} activities`}</span></div><p className="my-3 text-xs text-muted-foreground">{row.course.awaitingReview} practical submissions awaiting review · {row.course.needsRevision} activities to revisit</p></>}
   {!row.live.length&&<p className="text-sm text-muted-foreground">No live training is linked to this programme.</p>}
   {row.live.map(live=><details key={live.cohortId} open={liveOnly} className="mt-3 rounded-xl bg-muted/30 p-4"><summary className="cursor-pointer text-sm font-semibold">{live.title} <span className="ml-2 font-normal text-muted-foreground">{live.state.replaceAll("_"," ")}</span></summary><p className="my-3 text-sm">{live.message}</p>{live.enrolmentStatus&&<div className="grid gap-3 text-xs sm:grid-cols-3"><div><strong className="block">Attendance</strong><p>{live.attended} attended · {live.excused} excused · {live.recorded}/{live.sessions} recorded</p><p>{live.attendancePercent}% / {live.attendanceRequired}% required</p></div><div><strong className="block">Live-training grade</strong><p>{live.gradePercent===null?"Not graded":`${live.gradePercent}%`} · {live.gradeRequired}% required</p></div><div><strong className="block">Certificate</strong><p>{live.certificate==="none"?"Not issued":live.certificate}</p></div></div>}</details>)}
  </>}
  </article>)}</div>
  {data&&!rows.length&&<p className="my-5 text-sm text-muted-foreground">{search?"No learners match your search.":"Progress will appear when people are assigned."}</p>}
  {data&&<p className="mt-4 text-xs text-muted-foreground">Updated {new Date(data.generatedAt).toLocaleString()}</p>}
 </section>;
}
