import { withSiteShareImages } from "@/lib/social-image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { assessmentSkills } from "@/lib/always-on-agents/assessment";
import "../../agent-detail.css";
export const dynamic="force-dynamic";
export const metadata=withSiteShareImages({title:"Verify an Experrt agent course certificate",robots:{index:false,follow:false}});
export default async function AgentCertificate({params}:{params:Promise<{ref:string}>}) {
 const {ref}=await params;if(!z.string().uuid().safeParse(ref).success)notFound();
 const {data,error}=await supabaseAdmin.from("agent_course_certificates").select("learner_name,snapshot,issued_at,order_id,public_ref").eq("public_ref",ref).maybeSingle();
 if(error)throw new Error("Certificate verification is temporarily unavailable.");if(!data)notFound();
 const {data:order,error:orderError}=await supabaseAdmin.from("agent_course_orders").select("status").eq("id",data.order_id).maybeSingle();
 if(orderError)throw new Error("Certificate status is temporarily unavailable.");
 const valid=order?.status==="captured";
 return <article className="agent-course-detail agent-certificate"><p className="agent-detail-eyebrow">EXPERRT ACADEMY / CERTIFICATE VERIFICATION</p><h1>{valid?"Certificate of practical assessment":"Certificate is no longer valid"}</h1><p>This record confirms an AI assessment of submitted project evidence. It does not establish independently observed live operation or external accreditation.</p><div className="agent-certificate-sheet"><p>EXPERRT</p><h2>{data.learner_name}</h2><p>has passed the six skill areas assessed in</p><h3>{data.snapshot.title}</h3><p>Course version: {data.snapshot.version}</p><p>Issued {new Date(data.issued_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}</p><p>Assessment method: AI assessment of submitted practical evidence</p><ul>{(data.snapshot.skills as {id:string;score:number}[]).map(skill=><li key={skill.id}>{assessmentSkills.find(s=>s.id===skill.id)?.title}: {skill.score}/4</li>)}</ul><p>Reference: {data.public_ref}</p><p>Status: {valid?"Valid":"Withdrawn following a payment reversal or unavailable order"}</p></div><h2>Assessment limits</h2><ul>{(data.snapshot.limitations as string[]).map((item,i)=><li key={i}>{item}</li>)}</ul><p>Use your browser’s print command to save or print this certificate.</p><Link href="/courses/agents">Explore Experrt agent courses →</Link></article>;
}
