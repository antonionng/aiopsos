import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { learningActor, LearningError } from "@/lib/lms/server";
import { z } from "zod";
import type { AgentCoursePack } from "./courses";
export async function ownedAgentCourse(id: string) {
  const actor = await learningActor();
  if (!z.string().uuid().safeParse(id).success) throw new LearningError("Course not found.",404);
  const {data:order,error}=await supabaseAdmin.from("agent_course_orders").select("id,course_slug,title,status,user_id,org_id,assessment_mode,learning_pack,captured_at").eq("id",id).eq("user_id",actor.userId).eq("org_id",actor.orgId).maybeSingle();
  if (error) throw new LearningError("Your course could not be loaded. Please retry.",503);
  if (!order || order.status!=="captured" || order.assessment_mode!=="ai") throw new LearningError("This course requires a confirmed purchase in your current workspace.",403);
  const expiry=new Date(order.captured_at);expiry.setUTCFullYear(expiry.getUTCFullYear()+1);
  if (expiry.getTime()<Date.now()) throw new LearningError("Your 12 months of course access have ended.",403);
  const pack=order.learning_pack as AgentCoursePack;
  if (!pack || pack.slug!==order.course_slug || !pack.modules?.length) throw new LearningError("Your purchased course version could not be loaded.",503);
  return {actor,order,pack};
}
