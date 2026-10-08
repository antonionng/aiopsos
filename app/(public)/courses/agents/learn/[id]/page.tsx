import { withSiteShareImages } from "@/lib/social-image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { projectWorkSchema } from "@/lib/always-on-agents/assessment";
import Link from "next/link";
import { AgentCoursePlayer } from "@/components/courses/agent-course-player";
import { AgentProjectAssessment } from "@/components/courses/agent-project-assessment";
import { ownedAgentCourse } from "@/lib/always-on-agents/learning";
import { getAgentMarketingCourse } from "@/lib/always-on-agents/marketing";
import { LearningError } from "@/lib/lms/server";
import { redirect } from "next/navigation";
export const dynamic="force-dynamic";
export const metadata=withSiteShareImages({title:"Your agent course | Experrt",robots:{index:false,follow:false}});
export default async function AgentLearningPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 let course;
 try {course=await ownedAgentCourse(id);}catch(error){
  if(error instanceof LearningError && error.status===401)redirect("/login?next="+encodeURIComponent("/courses/agents/learn/"+id));
  return <section className="agent-study"><h1>Open your course</h1><p>{error instanceof LearningError?error.message:"Your course could not be loaded. Please try again."}</p><Link href="/courses/agents">Explore courses</Link></section>;
 }
 const {data:stored,error}=await supabaseAdmin.from("agent_course_work").select("work").eq("order_id",id).maybeSingle();
 if(error)throw new Error("Saved course work could not be loaded.");
 const initial=projectWorkSchema.safeParse(stored?.work);
 return <><AgentCoursePlayer pack={course.pack} cover={getAgentMarketingCourse(course.pack.slug)!.image} orderId={id} initialWork={initial.success?initial.data:undefined}/><AgentProjectAssessment orderId={id} challenge={course.pack.challenge}/></>;
}
