import { after, NextResponse } from "next/server";
import { z } from "zod";
import { learningActor, LearningError, learningErrorResponse } from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { runLabReview } from "@/lib/lms/lab-ai-server";
import { rateLimit } from "@/lib/rate-limit";
export const maxDuration=120;
export const dynamic="force-dynamic";
type Context={params:Promise<{id:string}>};
export async function POST(request:Request,context:Context) {
 try {
  const actor=await learningActor();
  if(!rateLimit(`lab-review:${actor.userId}`,{limit:30,windowMs:60000}).success) throw new LearningError("Please wait a moment.",429);
  const programme=z.string().uuid().parse((await context.params).id);
  const raw=await request.text();
  if(raw.length>1000) throw new LearningError("Request too large.",413);
  const input=z.object({progress_id:z.string().uuid()}).parse(JSON.parse(raw));
  const {data,error}=await supabaseAdmin.rpc("lms_lab_ai_ensure",{p_actor:actor.userId,p_org:actor.orgId,p_programme:programme,p_progress:input.progress_id});
  if(error) throw new LearningError(error.message,error.code==="42501"?403:409);
  if(data.status==="queued") after(()=>runLabReview(data.id));
  return NextResponse.json({id:data.id,status:data.status,insights:data.insights,coverage:data.coverage,error:data.error},{headers:{"Cache-Control":"no-store"}});
 } catch(error) {return learningErrorResponse(error);}
}
