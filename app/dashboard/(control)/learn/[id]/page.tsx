import {redirect} from "next/navigation";
import {learningActor,commandForActor} from "@/lib/lms/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const actor=await learningActor();
 const id=(await params).id;
 const {data:order,error}=await supabaseAdmin.from("agent_course_orders")
  .select("id").eq("assignment_id",id).eq("user_id",actor.userId)
  .eq("org_id",actor.orgId).eq("assessment_mode","ai")
  .eq("status","captured").limit(1).maybeSingle();
 if(error)throw new Error("Your course access could not be checked. Please try again.");
 if(order)redirect(`/courses/agents/learn/${order.id}`);
 const data=await commandForActor(actor,{action:"learning.get",payload:{id}});
 redirect(`/dashboard/programmes/${data.programme.id}?view=learn`);
}
