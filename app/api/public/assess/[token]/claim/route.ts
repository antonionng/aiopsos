import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { claimPendingResponse } from "@/lib/assess-claim";

export const dynamic = "force-dynamic";

/**
 * Attach a completed assessment to the signed-in user.
 *
 * Exists for every path where signup-and-claim could not happen in one
 * breath: the email already existed (sign in, then claim), a 500 interrupted
 * the original signup (retry lands here), or the respondent was signed in
 * all along. Safe to call repeatedly - the claim itself is idempotent.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const { data: link } = await supabaseAdmin
    .from("assessment_links")
    .select("id, org_id")
    .eq("token", token)
    .maybeSingle();
  if (!link) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  // The session token can come from the body (sessionStorage path) or the
  // httpOnly cookie set at submit time (the recovery path).
  const body = await req.json().catch(() => null);
  const sessionToken: string | null =
    (typeof body?.session_token === "string" && body.session_token) ||
    req.cookies.get("assess_session")?.value ||
    null;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "No assessment session to claim" },
      { status: 400 }
    );
  }

  const department =
    typeof body?.department === "string" && body.department ? body.department : null;

  const result = await claimPendingResponse({
    userId: user.id,
    userEmail: user.email ?? "",
    userName:
      (user.user_metadata?.name as string | undefined) ??
      (typeof body?.name === "string" ? body.name : "") ??
      "",
    linkOrgId: link.org_id,
    sessionToken,
    department,
  });

  if (result.notFound) {
    return NextResponse.json(
      { error: "No pending assessment found for this session" },
      { status: 404 }
    );
  }
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const response = NextResponse.json({
    success: true,
    redirect: "/dashboard/my-results",
  });
  // Only now is the cookie's job done.
  response.cookies.delete("assess_session");
  return response;
}
