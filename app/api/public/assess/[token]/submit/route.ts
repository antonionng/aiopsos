import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ASSESSMENT_QUESTIONS, calculateDimensionScores, calculateOverallScore } from "@/lib/scoring";
import { getTierForScore } from "@/lib/constants";
import { findMissingAnswers } from "@/lib/assessment-completeness";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
  // Keyed by token as well as IP: a whole team taking the assessment together
  // shares one NAT address, and that is the normal case for this product.
  const rl = rateLimit(`publicSubmit:${token}:${ip}`, RATE_LIMITS.publicSubmit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }

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

  const { assessmentAnswersSchema, validateBody } = await import("@/lib/validations");
  const validation = validateBody(assessmentAnswersSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { answers, respondent_role, tools_used } = validation.data;

  // Every question must be answered. Missing keys used to score zero and
  // persist as a real result, which is worse than refusing the submission.
  const missing = findMissingAnswers(
    ASSESSMENT_QUESTIONS.map((q) => q.id),
    answers
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Incomplete assessment: ${missing.length} unanswered question(s).` },
      { status: 400 }
    );
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
