import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ownedAgentCourse } from "@/lib/always-on-agents/learning";
import { projectWorkSchema } from "@/lib/always-on-agents/assessment";
import { learningErrorResponse, LearningError } from "@/lib/lms/server";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
 try {
  const {order}=await ownedAgentCourse((await params).id);
  const [work,attempt,certificate]=await Promise.all([
   supabaseAdmin.from("agent_course_work").select("work").eq("order_id",order.id).maybeSingle(),
   supabaseAdmin.from("agent_course_assessments").select("id,state,result,error,created_at,submission").eq("order_id",order.id).order("created_at",{ascending:false}).limit(1).maybeSingle(),
   supabaseAdmin.from("agent_course_certificates").select("public_ref,issued_at").eq("order_id",order.id).maybeSingle(),
  ]);
  if(work.error||attempt.error||certificate.error)throw new LearningError("Saved course work could not be loaded.",503);
  return NextResponse.json({work:work.data?.work||null,attempt:attempt.data,certificate:certificate.data},{headers:{"Cache-Control":"private, no-store"}});
 }catch(error){return learningErrorResponse(error);}
}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}) {
 try {
  const {order,pack}=await ownedAgentCourse((await params).id);
  const raw=await request.text();if(raw.length>300000)throw new LearningError("Keep your notes under 300 KB and download a copy of larger evidence.",413);
  const parsed=projectWorkSchema.safeParse(readJson(raw));if(!parsed.success)throw new LearningError("The course notes could not be read.");
  const ids=new Set(pack.content.activities.map(a=>a.id));
  if([...Object.keys(parsed.data.notes),...parsed.data.completed,...Object.keys(parsed.data.answers)].some(id=>!ids.has(id)))throw new LearningError("These notes belong to a different course.");
  const {error}=await supabaseAdmin.from("agent_course_work").upsert({order_id:order.id,work:parsed.data,updated_at:new Date().toISOString()});
  if(error)throw new LearningError("Your account notes could not be saved. Download a copy and retry.",503);
  return NextResponse.json({saved:true});
 }catch(error){return learningErrorResponse(error);}
}

function readJson(raw:string):unknown {try{return JSON.parse(raw);}catch{throw new LearningError("The request could not be read. Please try again.",400);}}
