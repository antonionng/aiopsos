import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { learningActor, LearningError } from "./server";

export async function deliveryCommand(programmeId: string | null, action: string, payload: unknown = {}, requestId = crypto.randomUUID()) {
  const actor = await learningActor();
  if(action === "staff.invite") {
    const input=payload as {email:string;role:string};
    const {data:profile,error:profileError}=await supabaseAdmin.from("user_profiles").select("id").ilike("email",input.email.replace(/[%_]/g,"\\$&")).maybeSingle();
    if(profileError||!profile) throw new LearningError("This person must first register and verify their Experrt account.");
    const {data:identity,error:identityError}=await supabaseAdmin.auth.admin.getUserById(profile.id);
    if(identityError||!identity.user?.email_confirmed_at||identity.user.email?.toLowerCase()!==input.email.toLowerCase()) throw new LearningError("This person must first verify their Experrt email.");
    payload={...input,target_user_id:profile.id};
  }
  const {data, error} = await supabaseAdmin.rpc(action === "ai.publish" ? "lms_lab_ai_publish" : "lms_delivery_command", {
    p_actor: actor.userId, p_org: actor.orgId, p_programme: programmeId,
    ...(action === "ai.publish" ? {} : {p_action: action}), p_payload: payload, p_request: requestId,
  });
  if (error) throw new LearningError(
    ["PGRST202", "42P01"].includes(error.code) ? "The programme delivery update has not been enabled yet." : error.message,
    /fetch failed|network|timeout/i.test(error.message) ? 503 : error.code === "42501" ? 403 : ["PT409", "40001", "23505"].includes(error.code) ? 409 : ["PGRST202", "42P01"].includes(error.code) ? 503 : 400,
  );
  return action === "get" ? {...data,viewer_id:actor.userId} : data;
}
