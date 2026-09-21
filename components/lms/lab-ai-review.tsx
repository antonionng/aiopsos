"use client";
import { useEffect, useState } from "react";
import { Sparkles, LockKeyhole } from "lucide-react";
import type { LabInsights, PrivateLabReview } from "@/lib/lms/lab-ai-schema";
export function LabAIReview({programmeId,progressId,onApply}:{programmeId:string;progressId:string;onApply:(id:string,insights:LabInsights)=>void}) {
 const [draft,setDraft]=useState<PrivateLabReview|null>(null),[error,setError]=useState("");
 useEffect(()=>{
  let active=true,timer:ReturnType<typeof setTimeout>|undefined,checks=0;
  async function poll() {
   try {
    const response=await fetch(`/api/lms/programmes/${programmeId}/ai-review`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress_id:progressId})});
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||"Private insights are unavailable. You can assess manually.");
    if(!active)return;
    setDraft(data);
    if(["queued","running"].includes(data.status)&&++checks<30)timer=setTimeout(poll,5000);
   }catch(e){if(active)setError(e instanceof Error?e.message:"AI review unavailable.");}
  }
  void poll();return()=>{active=false;if(timer)clearTimeout(timer);};
 },[programmeId,progressId]);
 const insights=draft?.insights;
 return <section className="lab-ai-review" aria-label="Private AI review"><div className="flex items-center justify-between gap-3"><h4 className="flex items-center gap-2"><Sparkles size={18}/> AI review assistant</h4><span className="flex items-center gap-1 text-xs"><LockKeyhole size={12}/> Assessment team only</span></div>
 <p className="text-sm text-muted-foreground">Draft insights. You verify the evidence and make the assessment decision.</p>
 {error||draft?.status==="failed"?<p role="status">{error||draft?.error}</p>:!insights?<p role="status">{draft?.status==="stale"?"This attempt has changed. Reload to review the latest submission.":"Preparing private insights. You can start your review below."}</p>:<>
 <p>{insights.summary}</p>
 <details><summary>Review findings and suggested questions</summary>{[["Strengths",insights.strengths],["Check before publishing",insights.concerns],["Questions to test understanding",insights.questions]].map(([label,items])=><div key={label as string}>{(items as string[]).length>0&&<><strong>{label}</strong><ul className="list-disc pl-5">{(items as string[]).map((item,i)=><li key={i}>{item}</li>)}</ul></>}</div>)}</details>
 <details><summary>Evidence coverage and scoring rationale</summary><p className="text-sm">Code has not been executed. Verify results and understanding before publishing.</p>{draft?.coverage.length===0&&<p>No uploaded files were available; the written response was reviewed.</p>}{draft?.coverage.map((c,i)=><p key={i}><strong>{c.name}</strong>: {c.detail}</p>)}{insights.criteria.map((c,i)=><p key={c.criterion_id}>Criterion {i+1}: <strong>{c.suggested_score===null?"Needs human judgement":`${c.suggested_score}/4 suggested`}</strong>. {c.rationale}</p>)}</details>
 <button type="button" className="lms-button secondary" onClick={()=>onApply(draft!.id,insights)}>Use draft in my assessment</button><p className="text-xs text-muted-foreground">This fills the form below. Nothing is shared with the learner yet.</p>
 </>}
 </section>;
}
