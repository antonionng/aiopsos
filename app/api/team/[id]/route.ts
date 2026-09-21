import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { learningActor, learningErrorResponse, LearningError } from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const patchSchema = z.object({
  role: z.enum(["admin", "manager", "user"]).optional(),
  department_id: z.string().uuid().nullable().optional(),
  plan_override: z.enum(["basic", "pro", "enterprise"]).nullable().optional(),
}).strict().refine(value => Object.keys(value).length > 0, "Nothing to update");

async function change(req: NextRequest, context: { params: Promise<{ id: string }> }, action: "update" | "remove") {
  try {
    const actor = await learningActor();
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) throw new LearningError("Invalid member identifier");
    let patch = {};
    if (action === "update") {
      const result = patchSchema.safeParse(await req.json().catch(() => null));
      if (!result.success) throw new LearningError(result.error.issues[0]?.message || "Invalid changes");
      patch = result.data;
    }
    const { data, error } = await supabaseAdmin.rpc("workspace_member_change", {
      p_actor: actor.userId, p_org: actor.orgId, p_member: id, p_action: action, p_patch: patch,
    });
    if (error) throw new LearningError(error.message, error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return learningErrorResponse(error); }
}
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) { return change(req, context, "update"); }
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) { return change(req, context, "remove"); }
