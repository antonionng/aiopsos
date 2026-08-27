import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  resolveAssessmentLink,
  assessUrlForToken,
} from "@/lib/assessment-link";

export const dynamic = "force-dynamic";

/**
 * The share link for one assessment, created on first ask.
 *
 * The distribute screen needs a token to build its QR code, embed snippet
 * and social copy. It used to build those from `/assessment/<id>/take`
 * instead, which is a different funnel: that one keeps answers in React
 * state until signup succeeds, and refuses any email that already has an
 * account. A QR on a training-room wall is exactly where returning
 * delegates and half-finished attempts turn up, so it has to be the
 * `/assess/<token>` flow, which saves anonymously and can attach a
 * response to an existing account.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assessmentId } = await params;
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
    .maybeSingle();

  if (
    !profile?.org_id ||
    !["super_admin", "admin", "manager"].includes(profile.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Scope the assessment to the caller's org before minting anything for
  // it. resolveAssessmentLink runs as the service role.
  const { data: assessment } = await supabaseAdmin
    .from("assessments")
    .select("id")
    .eq("id", assessmentId)
    .eq("org_id", profile.org_id)
    .maybeSingle();

  if (!assessment)
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const link = await resolveAssessmentLink(assessmentId, user.id);
  if (!link)
    return NextResponse.json(
      { error: "Could not resolve a share link for this assessment" },
      { status: 500 }
    );

  return NextResponse.json({
    token: link.token,
    template_id: link.templateId,
    url: assessUrlForToken(link.token),
  });
}
