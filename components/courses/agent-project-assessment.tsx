"use client";
import { useEffect,useRef,useState } from "react";
import Link from "next/link";
import { assessmentSkills,type AssessmentResult } from "@/lib/always-on-agents/assessment";
type Attempt={id:string;state:string;result:AssessmentResult|null;error:string|null};
export function AgentProjectAssessment({orderId,challenge}:{orderId:string;challenge:string}) {
 const [evidence,setEvidence]=useState<Record<string,string>>({});
 const [changedCase,setChangedCase]=useState("");const [declaration,setDeclaration]=useState(false);
 const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");
 const [attempt,setAttempt]=useState<Attempt|null>(null);const [certificate,setCertificate]=useState<string|null>(null);
 const requestKey=useRef<string|null>(null);
 const draftReady=useRef(false);
 const draftKey="experrt-assessment-draft:"+orderId;
 async function status(){
  const response=await fetch(`/api/courses/agents/learning/${orderId}`,{cache:"no-store"});
  if(!response.ok)throw new Error("Your assessment status could not be loaded.");
  const data=await response.json();setAttempt(data.attempt);setCertificate(data.certificate?.public_ref||null);
 }
 useEffect(()=>{
  try {const raw=localStorage.getItem(draftKey);if(raw){const saved=JSON.parse(raw);setEvidence(saved.evidence||{});setChangedCase(saved.changedCase||"");}}catch{setNotice("Your browser draft could not be restored. Your submitted assessments are still saved in your account.");}
  draftReady.current=true;void status().catch(error=>setNotice(error.message));
 },[orderId]); // eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{if(draftReady.current){try{localStorage.setItem(draftKey,JSON.stringify({evidence,changedCase}));}catch{/* Submitted work remains saved in the account. */}}},[evidence,changedCase,draftKey]);
 function change(id:string,value:string){requestKey.current=null;setEvidence({...evidence,[id]:value});}
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setNotice("Your AI assessment is being prepared. This can take a minute.");
  requestKey.current ||= crypto.randomUUID();
  try {
   const response=await fetch(`/api/courses/agents/assessment/${orderId}`,{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":requestKey.current},body:JSON.stringify({evidence,changedCase,declaration})});
   const data=await response.json();if(!response.ok){requestKey.current=null;throw new Error(data.error||"Assessment could not be completed.");}
   setAttempt(data);if(data.state==="complete")requestKey.current=null;
   await status();setNotice(data.state==="running"?"Your previous assessment is still being prepared. Check the result shortly.":"Your assessment is ready. Read the feedback for every skill below.");
  }catch(error){setNotice(error instanceof Error?error.message:"Please try again.");}finally{setBusy(false);}
 }
 return <section className="agent-study agent-assessment" id="practical-assessment">
  <p className="agent-study-eyebrow">YOUR PRACTICAL ASSESSMENT</p><h2>Show what you can do with an agent</h2>
  <p>When you have finished your project, share the evidence below. Paste the relevant instructions, settings, source extracts, results and test records, and explain your choices. Remove passwords, private customer records and unrelated personal information. The AI assessor reads this text; it cannot open links or run your agent.</p>
  <p>Your draft answers are saved in this browser as you write. Submitted assessments are saved in your account. Keep a separate copy before changing device.</p>
  <p>Each of the six skills is scored from 0 to 4. You need at least 3 in every skill to pass; a high score in one skill cannot make up for a low score in another. You will receive feedback and can improve and resubmit your work, up to three assessments in 24 hours. Your course price includes up to twenty completed assessments during your 12 months of access; technical failures do not use that allowance.</p>
  {certificate?<div className="agent-assessment-success"><h3>You have passed your practical assessment</h3><p>Your Experrt certificate records your course version and the skills assessed from your submitted evidence.</p><Link href={`/courses/agents/certificate/${certificate}`}>View and print your certificate →</Link></div>:<form onSubmit={submit}>
   {assessmentSkills.map(skill=><label key={skill.id} className="agent-assessment-field"><strong>{skill.title}</strong><span>{skill.requirement}</span><textarea required minLength={100} maxLength={10000} rows={7} value={evidence[skill.id]||""} onChange={event=>change(skill.id,event.target.value)} placeholder="Paste the relevant records and explain what they show. Include actual inputs, results and your checks."/></label>)}
   <label className="agent-assessment-field"><strong>Explain how you would handle this changed example</strong><span>{challenge}</span><textarea required minLength={100} maxLength={10000} rows={7} value={changedCase} onChange={event=>{requestKey.current=null;setChangedCase(event.target.value);}}/></label>
   <label className="agent-assessment-declaration"><input required type="checkbox" checked={declaration} onChange={event=>setDeclaration(event.target.checked)}/><span>This is my own work. I have labelled simulations and removed secrets and unrelated personal information. I understand that AI assesses my submitted evidence and that a passed assessment creates a publicly verifiable certificate showing my profile name, course and assessed skills.</span></label>
   <button disabled={busy} type="submit">{busy?"Assessing your project…":"Submit for AI assessment"}</button>
  </form>}
  {notice&&<p role="status">{notice}</p>}
  <button type="button" disabled={busy} onClick={()=>void status().catch(error=>setNotice(error.message))}>Check assessment status</button>
  {attempt?.result&&<div className="agent-assessment-results"><p><a href={`/api/courses/agents/report/${orderId}?assessment=${attempt.id}`}>Download your assessment report (PDF)</a></p><p>A copy is emailed to your account email address. If delivery is delayed, you can download it here.</p><h3>{attempt.result.passed?"Your assessment result":"What to improve before resubmitting"}</h3><p>{attempt.result.summary}</p>{attempt.result.skills.map(skill=><article key={skill.id}><h4>{assessmentSkills.find(s=>s.id===skill.id)?.title}: {skill.score} out of 4</h4><p>{skill.feedback}</p><p><strong>Your next step:</strong> {skill.nextStep}</p></article>)}<h4>What this assessment could verify</h4><ul>{attempt.result.limitations.map((item,i)=><li key={i}>{item}</li>)}</ul></div>}
  {attempt?.error&&<p role="alert">{attempt.error}</p>}
 </section>;
}
