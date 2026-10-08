import { agentAssessmentSystem } from "@/lib/always-on-agents/assessment-prompt";
import { after } from "next/server";
import { deliverAgentReport } from "@/lib/always-on-agents/report-delivery";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getLanguageModel } from "@/lib/model-router";
import { ownedAgentCourse } from "@/lib/always-on-agents/learning";
import { assessmentSkills,assessmentResultSchema,projectSubmissionSchema,validateAssessment } from "@/lib/always-on-agents/assessment";
import { learningErrorResponse,LearningError } from "@/lib/lms/server";
export const dynamic="force-dynamic";
export const maxDuration=120;
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
 try {
  const {actor,order,pack}=await ownedAgentCourse((await params).id);
  if(!process.env.OPENAI_API_KEY)throw new LearningError("AI assessment is temporarily unavailable. Your work is safe; please retry later.",503);
  const key=z.string().uuid().safeParse(request.headers.get("Idempotency-Key"));
  if(!key.success)throw new LearningError("A unique assessment request is required.");
  const raw=await request.text();if(raw.length>80000)throw new LearningError("Keep the project submission under 80 KB.",413);
  const parsed=projectSubmissionSchema.safeParse(readJson(raw));if(!parsed.success)throw new LearningError("Provide evidence for all six skills, answer the changed example and confirm that the work is yours.");
  const {data:claim,error:claimError}=await supabaseAdmin.rpc("agent_course_assessment_start",{p_actor:actor.userId,p_org:actor.orgId,p_order:order.id,p_request:key.data,p_submission:parsed.data});
  if(claimError)throw new LearningError(claimError.message,claimError.code==="42501"?403:409);
  if(!claim.claimed)return NextResponse.json(claim.attempt,{headers:{"Cache-Control":"private, no-store"}});
  const model="gpt-5.2";
  try {
   const generated=await generateText({model:getLanguageModel(model),output:Output.object({schema:assessmentResultSchema}),maxOutputTokens:6000,maxRetries:0,abortSignal:AbortSignal.timeout(80000),
    system:agentAssessmentSystem,
    prompt:JSON.stringify({course:pack.title,project:pack.project,changedExample:pack.challenge,rubric:assessmentSkills,guide:pack.resources[2].content,submission:parsed.data})});
   const result=validateAssessment(generated.output,parsed.data);
   const {data:attempt,error}=await supabaseAdmin.rpc("agent_course_assessment_finish",{p_attempt:claim.attempt.id,p_result:result,p_model:model,p_input:generated.usage.inputTokens||0,p_output:generated.usage.outputTokens||0,p_error:null});
   if(error)throw new Error("Assessment could not be recorded.");
   after(async()=>{try{await deliverAgentReport(attempt.id);}catch{console.warn("[agent-course] Assessment report email queued for retry.");}});
   return NextResponse.json(attempt,{headers:{"Cache-Control":"private, no-store"}});
  }catch{
   const {error}=await supabaseAdmin.rpc("agent_course_assessment_finish",{p_attempt:claim.attempt.id,p_result:null,p_model:model,p_input:0,p_output:0,p_error:"The assessment could not be completed. Please try again; this failed attempt does not use your daily assessment allowance."});
   if(error)throw new LearningError("The assessment could not be saved. Check your course assessment status before retrying.",503);
   throw new LearningError("AI assessment could not be completed. Your work is saved in the attempt; please retry.",503);
  }
 }catch(error){return learningErrorResponse(error);}
}

function readJson(raw:string):unknown {try{return JSON.parse(raw);}catch{throw new LearningError("The request could not be read. Please try again.",400);}}
