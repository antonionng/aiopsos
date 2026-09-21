import { resourceAccessError } from "@/lib/workspace-resource-access";
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

    const denied = await resourceAccessError(supabase, profile?.org_id, profile?.role);
    if (denied) return denied;

  if (!profile?.org_id || !canViewOrgData(profile.role as UserRole))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabaseAdmin.rpc("assessment_manage", {
    p_actor: user.id, p_org: profile.org_id, p_action: "response.delete", p_id: assessmentId, p_response: responseId,
  });
  if (error) return NextResponse.json({ error: "Response unavailable or could not be deleted." }, { status: error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "22P02" ? 400 : 503 });

  return new NextResponse(null, { status: 204 });
}
