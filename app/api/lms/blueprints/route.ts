import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { learningActor,assertLearningAccess,LearningError,learningErrorResponse } from "@/lib/lms/server";
import { blueprintSchema } from "@/lib/lms/programme-blueprint";
import { rateLimit } from "@/lib/rate-limit";
export const dynamic="force-dynamic";
const schema=z.discriminatedUnion("action",[
 z.object({action:z.literal("save"),id:z.string().uuid().optional(),revision:z.number().int().positive().optional(),config:z.record(z.string(),z.unknown())}),
 z.object({action:z.literal("create_run"),id:z.string().uuid(),revision:z.number().int().positive(),title:z.string().trim().min(3).max(180),client_org_id:z.string().uuid().nullable()}),
]);
async function call(action:string,payload:unknown,key=crypto.randomUUID()){
 const actor=await learningActor();await assertLearningAccess(actor,true);
 const {data,error}=await supabaseAdmin.rpc("lms_blueprint_command",{p_actor:actor.userId,p_org:actor.orgId,p_action:action,p_payload:payload,p_request:key});
 if(error)throw new LearningError(error.message,error.code==="42501"?403:error.code==="PT409"?409:400);
 return data;
}
export async function GET(request:Request){try{const id=new URL(request.url).searchParams.get("id");return NextResponse.json(await call(id?"get":"list",id?{id:z.string().uuid().parse(id)}:{}),{headers:{"Cache-Control":"no-store"}});}catch(e){return learningErrorResponse(e);}}
export async function POST(request:Request){try{
 const actor=await learningActor();await assertLearningAccess(actor,true);
 if(!rateLimit(`blueprint:${actor.userId}`,{limit:30,windowMs:60000}).success)throw new LearningError("Please wait a moment.",429);
 const raw=await request.text();if(raw.length>450000)throw new LearningError("Template too large.",413);
 const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)throw new LearningError(parsed.error.issues[0].message);
 const key=z.string().uuid().parse(request.headers.get("Idempotency-Key"));
 const {action,...payload}=parsed.data;
 if(action==="create_run"){
  const current=await call("get",{id:payload.id});
  const config=blueprintSchema.safeParse(current.config);if(!config.success)throw new LearningError(config.error.issues.slice(0,3).map(i=>i.message).join(" "));
  return NextResponse.json(await call(action,{...payload,validated_config:config.data},key));
 }
 return NextResponse.json(await call(action,payload,key));
 }catch(e){return learningErrorResponse(e);}}
