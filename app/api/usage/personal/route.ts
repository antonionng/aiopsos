import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUGGESTIONS = [
  "Try using a different model for code review tasks -- Claude Sonnet 4 excels here.",
  "Save your most-used prompts to the library for faster access.",
  "Create a persona for your department to get more tailored responses.",
  "Upload company docs to the knowledge base for grounded answers.",
  "Use the roadmap generator to plan your team's AI adoption.",
  "Explore the stack recommendation engine for optimal model routing.",
  "Teams that use 3+ models see 40% better task coverage.",
];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: logs } = await supabase
    .from("usage_logs")
    .select("tokens_in, tokens_out, customer_charge, model")
    .eq("user_id", user.id)
    .gte("created_at", weekAgo);

  const weeklyRequests = logs?.length ?? 0;
  const weeklyTokens = logs?.reduce((s, l) => s + (l.tokens_in || 0) + (l.tokens_out || 0), 0) ?? 0;
  const weeklyCharge = logs?.reduce((s, l) => s + Number(l.customer_charge || 0), 0) ?? 0;
  const modelsUsed = [...new Set(logs?.map((l) => l.model) ?? [])];

  const varietyScore = Math.min(modelsUsed.length * 15, 30);
  const frequencyScore = Math.min(weeklyRequests * 2, 40);
  const tokenScore = Math.min(Math.floor(weeklyTokens / 5000), 30);
  const adoptionScore = Math.min(varietyScore + frequencyScore + tokenScore, 100);

  const estimatedHoursSaved = Number((weeklyRequests * 0.08).toFixed(1));

  const shuffled = [...SUGGESTIONS].sort(() => Math.random() - 0.5);

  return NextResponse.json({
    weeklyRequests,
    weeklyTokens,
    weeklyCharge,
    modelsUsed,
    adoptionScore,
    estimatedHoursSaved,
    suggestions: shuffled.slice(0, 3),
  });
}
