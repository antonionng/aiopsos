import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { calculateOverallScore } from "@/lib/scoring";
import { getTierForScore } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Recover a just-completed assessment after sessionStorage loss.
 *
 * The results page keeps scores in sessionStorage, which does not survive a
 * refresh in some browsers, a new tab, or tab eviction on iOS. The submit
 * route has always set an httpOnly `assess_session` cookie for exactly this
 * moment - this route is the reader it never had. Identification is the
 * cookie alone: httpOnly, 24h, minted per submission.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const sessionToken = req.cookies.get("assess_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "No session" }, { status: 404 });
  }

  const { data: link } = await supabaseAdmin
    .from("assessment_links")
    .select("id")
    .eq("token", token)
    .maybeSingle();
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: pending } = await supabaseAdmin
    .from("pending_responses")
    .select(
      "session_token, confidence_score, practice_score, tools_score, responsible_score, culture_score, respondent_role, claimed_by"
    )
    .eq("session_token", sessionToken)
    .eq("link_id", link.id)
    .maybeSingle();

  if (!pending) return NextResponse.json({ error: "No session" }, { status: 404 });

  const scores = {
    confidence: Number(pending.confidence_score),
    practice: Number(pending.practice_score),
    tools: Number(pending.tools_score),
    responsible: Number(pending.responsible_score),
    culture: Number(pending.culture_score),
  };
  const overall = calculateOverallScore(scores);
  const tier = getTierForScore(overall);

  return NextResponse.json(
    {
      scores,
      overall,
      tier: { tier: tier.tier, label: tier.label, color: tier.color },
      session_token: pending.session_token,
      respondent_role: pending.respondent_role,
      already_claimed: !!pending.claimed_by,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
