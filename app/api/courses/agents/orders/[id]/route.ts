import { NextResponse } from "next/server";
import { z } from "zod";
import {
  learningActor,
  LearningError,
  learningErrorResponse,
} from "@/lib/lms/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await learningActor();
    const id = z
      .string()
      .uuid()
      .safeParse((await params).id);
    if (!id.success)
      throw new LearningError("That course order could not be found.", 404);
    const { data, error } = await supabaseAdmin
      .from("agent_course_orders")
      .select("id,course_slug,title,status,assignment_id,assessment_mode,amount,currency")
      .eq("id", id.data)
      .eq("user_id", actor.userId)
      .eq("org_id", actor.orgId)
      .maybeSingle();
    if (error)
      throw new LearningError(
        "Your payment status could not be checked. Please try again.",
        503,
      );
    if (!data)
      throw new LearningError(
        "That course order could not be found in this workspace.",
        404,
      );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return learningErrorResponse(error);
  }
}
