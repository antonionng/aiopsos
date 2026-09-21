import { cohortMembershipGuardsEnabled } from "@/lib/workspace-rollout";
import { NextResponse } from "next/server";
import { z } from "zod";
import { learningActor, LearningError, learningErrorResponse } from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
const input = z.object({ action: z.enum(["link", "enrol"]), cohort_id: z.string().uuid() });
async function handle(req: Request, context: { params: Promise<{id: string}> }) {
  try {
    const actor = await learningActor();
    const {id} = await context.params;
    z.string().uuid().parse(id);
    const body = req.method === "POST" ? input.parse(await req.json()) : null;
    const {data,error} = await supabaseAdmin.rpc(cohortMembershipGuardsEnabled() ? "lms_live_delivery_scoped" : "lms_live_delivery", {p_actor:actor.userId,...(cohortMembershipGuardsEnabled() ? {p_org:actor.orgId} : {}),p_programme:id,p_action:body?.action || "get",...(body ? {p_cohort:body.cohort_id} : {})});
    if(error) throw new LearningError(error.code === "42501" ? "This delivery is not available to your workspace." : error.code === "22023" ? error.message : "Could not load live delivery.",error.code === "42501" ? 403 : 400);
    return NextResponse.json(data,{headers:{"Cache-Control":"no-store"}});
  } catch(error) { if(error instanceof z.ZodError) return NextResponse.json({error:"Choose a valid programme and live group."},{status:400}); return learningErrorResponse(error); }
}
export const GET=handle;
export const POST=handle;
