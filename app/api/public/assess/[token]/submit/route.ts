import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDimensionScores, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore } from "@/lib/constants";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
  const rl = rateLimit(`publicSubmit:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

  const { token } = await params;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("assessment_links")
    .select("id, active, expires_at")
    .eq("token", token)
    .eq("active", true)
    .single();

  if (!link) {
    return NextResponse.json(
      { error: "Assessment not found or inactive" },
      { status: 404 }
    );
  }

  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This assessment link has expired" },
      { status: 410 }
    );
  }

  const body = await req.json();
  const { answers, respondent_role, tools_used } = body;

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  const scores = calculateDimensionScores(answers);
  const overall = calculateOverallScore(scores);
  const tier = getTierForScore(overall);
  const sessionToken = randomUUID();

  const { error } = await supabase.from("pending_responses").insert({
    link_id: link.id,
    raw_answers: answers,
    confidence_score: scores.confidence,
    practice_score: scores.practice,
    tools_score: scores.tools,
    responsible_score: scores.responsible,
    culture_score: scores.culture,
    respondent_role: respondent_role ?? null,
    tools_used: tools_used ?? null,
    session_token: sessionToken,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({
    session_token: sessionToken,
    scores,
    overall,
    tier: { tier: tier.tier, label: tier.label, color: tier.color },
  });

  response.cookies.set("assess_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
