import { NextResponse } from "next/server";
import { z } from "zod";
import { learningActor, learningErrorResponse, LearningError } from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await learningActor();
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) throw new LearningError("Invalid member identifier");
    const { data, error } = await supabaseAdmin.rpc("workspace_owner_transfer", { p_actor: actor.userId, p_org: actor.orgId, p_next_owner: id });
    if (error) throw new LearningError(error.message, error.code === "42501" ? 403 : error.code === "P0002" ? 404 : 400);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return learningErrorResponse(error); }
}
