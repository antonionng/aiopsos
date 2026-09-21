import {Check,Flag,ShieldCheck} from "lucide-react";
import {learningMilestones} from "@/lib/lms/milestones";
import type {DeliveryWorkspace,DeliveryRecord} from "@/lib/lms/delivery-schema";
export function ProgrammeMilestones({data,record}:{data:DeliveryWorkspace;record:DeliveryRecord}){
 const {milestones,earned,verifiedLabs,awaitingReview}=learningMilestones(data,record);
 if(!milestones.length)return null;
 const circumference=2*Math.PI*42;
 return <section className="programme-achievements" aria-label="Your learning milestones">
  <div className="achievement-summary">
   <div className="achievement-ring" role="img" aria-label={`${earned} of ${milestones.length} milestones earned`}><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="ring-track"/><circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-earned/milestones.length)} transform="rotate(-90 50 50)"/></svg><span><strong>{earned}<small>/{milestones.length}</small></strong><small>milestones</small></span></div>
   <div><h3>{earned===milestones.length?"Your work has earned every milestone":"Build skills. Show your progress."}</h3><p>Milestones reflect recorded learning and assessment.</p><div className="achievement-counts"><span><ShieldCheck size={15}/>{verifiedLabs} {verifiedLabs===1?"lab":"labs"} assessed and passed</span>{awaitingReview>0&&<span>{awaitingReview} awaiting review</span>}</div></div>
  </div>
  <ol className="achievement-path">{milestones.map(m=><li key={m.key} className={m.earned?"earned":""}><span className="achievement-icon" aria-hidden="true">{m.earned?<Check size={18}/>:<Flag size={17}/>}</span><div><strong>{m.label}</strong><small>{m.earned?m.description:"Not earned yet"}</small></div></li>)}</ol>
 </section>;
}
