import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canViewOrgData, type UserRole } from "@/lib/role-helpers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; responseId: string }> },
) {
  const { id: assessmentId, responseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id || !canViewOrgData(profile.role as UserRole))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: assessment } = await supabase
    .from("assessments")
    .select("org_id")
    .eq("id", assessmentId)
    .single();

  if (!assessment || assessment.org_id !== profile.org_id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: responseRow, error: fetchError } = await supabaseAdmin
    .from("assessment_responses")
    .select("id, assessment_id")
    .eq("id", responseId)
    .single();

  if (fetchError || !responseRow || responseRow.assessment_id !== assessmentId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error: deleteError } = await supabaseAdmin
    .from("assessment_responses")
    .delete()
    .eq("id", responseId)
    .eq("assessment_id", assessmentId);

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}
