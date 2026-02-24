import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateOverallScore, getRiskAreas } from "@/lib/scoring";
import { getTierForScore, DIMENSION_LABELS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

const DIMENSION_RECOMMENDATIONS: Record<Dimension, { low: string; mid: string }> = {
  confidence: {
    low: "Start with beginner-friendly AI tools and short guided exercises. Build comfort through low-stakes experimentation - try using AI for simple tasks like summarising notes or drafting messages.",
    mid: "Deepen your skills with structured learning. Explore advanced techniques, create a personal prompt library, and practise evaluating AI outputs critically.",
  },
  practice: {
    low: "Identify 2-3 daily tasks where AI could save you time - drafting, research, data formatting. Start small and build a routine around AI-assisted workflows.",
    mid: "Standardise your AI workflows and document what works. Create repeatable templates and share effective approaches with your team.",
  },
  tools: {
    low: "Explore what AI tools are available to you. Ask your team lead or IT about approved tools, and try at least one for a real work task this week.",
    mid: "Look for opportunities to connect your AI tools with your other work systems. Browser extensions, plug-ins, and integrations can dramatically improve your workflow.",
  },
  responsible: {
    low: "Familiarise yourself with your organisation's AI guidelines. If none exist, advocate for creating them. Always think twice before sharing sensitive information with AI tools.",
    mid: "Champion responsible AI use in your team. Help create or refine data handling guidelines and establish a clear process for when AI outputs need review.",
  },
  culture: {
    low: "Start sharing your AI experiences with colleagues - even small wins. Suggest a team session to discuss how everyone is using AI, and identify someone who can help with questions.",
    mid: "Formalise knowledge sharing around AI. Set up a regular session, create a shared tips channel, and help build a culture where AI experimentation is celebrated.",
  },
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: response } = await supabase
    .from("assessment_responses")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();

  if (!response) {
    return NextResponse.json({ error: "No assessment results found" }, { status: 404 });
  }

  const scores: DimensionScores = {
    confidence: Number(response.confidence_score),
    practice: Number(response.practice_score),
    tools: Number(response.tools_score),
    responsible: Number(response.responsible_score),
    culture: Number(response.culture_score),
  };

  const overall = calculateOverallScore(scores);
  const tier = getTierForScore(overall);
  const risks = getRiskAreas(scores);

  const recommendations = (Object.keys(scores) as Dimension[]).map((dim) => ({
    dimension: dim,
    label: DIMENSION_LABELS[dim],
    score: scores[dim],
    recommendation:
      scores[dim] < 2
        ? DIMENSION_RECOMMENDATIONS[dim].low
        : DIMENSION_RECOMMENDATIONS[dim].mid,
  }));

  // Fetch anonymised org averages for comparison
  let orgAverages: DimensionScores | null = null;
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.org_id) {
    const { data: orgResponses } = await supabase
      .from("assessment_responses")
      .select("confidence_score, practice_score, tools_score, responsible_score, culture_score")
      .eq("assessment_id", response.assessment_id);

    if (orgResponses && orgResponses.length >= 3) {
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      orgAverages = {
        confidence: avg(orgResponses.map((r) => Number(r.confidence_score))),
        practice: avg(orgResponses.map((r) => Number(r.practice_score))),
        tools: avg(orgResponses.map((r) => Number(r.tools_score))),
        responsible: avg(orgResponses.map((r) => Number(r.responsible_score))),
        culture: avg(orgResponses.map((r) => Number(r.culture_score))),
      };
    }
  }

  return NextResponse.json({
    scores,
    overall,
    tier: { tier: tier.tier, label: tier.label, color: tier.color },
    risks,
    recommendations,
    submitted_at: response.submitted_at,
    orgAverages,
  });
}
