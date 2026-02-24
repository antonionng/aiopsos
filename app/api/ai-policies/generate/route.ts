import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getLanguageModel } from "@/lib/model-router";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AI_POLICY_TEMPLATES, POLICY_CATEGORY_LABELS } from "@/lib/ai-policy-templates";

export const maxDuration = 60;

async function getCallerProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, org_id, role")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const caller = await getCallerProfile(supabase);
  if (!caller || !caller.org_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["admin", "super_admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only admins can generate policies" }, { status: 403 });
  }

  const body = await req.json();
  const { category, templateId, customInstructions } = body;

  const { data: org } = await supabaseAdmin
    .from("organisations")
    .select("name, industry, size, description, tech_stack, mission")
    .eq("id", caller.org_id)
    .maybeSingle();

  let assessmentContext = "";
  const { data: scores } = await supabaseAdmin
    .from("assessment_responses")
    .select("scores, overall_score")
    .eq("org_id", caller.org_id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (scores && scores.length > 0) {
    const avgScore =
      scores.reduce((sum, s) => sum + (s.overall_score ?? 0), 0) / scores.length;
    assessmentContext = `The organisation has completed AI readiness assessments with an average maturity score of ${avgScore.toFixed(1)}/5 across ${scores.length} responses.`;
  }

  const template = templateId
    ? AI_POLICY_TEMPLATES.find((t) => t.id === templateId)
    : null;

  const categoryLabel = POLICY_CATEGORY_LABELS[category] ?? category ?? "General";

  const systemPrompt = `You are an expert AI governance consultant who creates enterprise-grade AI policies. 
Generate a comprehensive, professional AI policy document in Markdown format.

Requirements:
- Use clear section headings with Markdown ## syntax
- Include numbered sections for easy reference
- Use tables where appropriate for clarity
- Include actionable checklists using [ ] syntax where relevant
- Use professional British English
- Make the policy specific and actionable, not generic
- Include placeholders like [Organisation Name] and [Date] where appropriate
- The policy should be thorough but not excessively long (aim for 800-1500 words)

${org ? `Organisation context:
- Name: ${org.name || "[Organisation Name]"}
- Industry: ${org.industry || "Not specified"}
- Size: ${org.size || "Not specified"}
- Description: ${org.description || "Not specified"}
- Tech stack: ${org.tech_stack || "Not specified"}
- Mission: ${org.mission || "Not specified"}` : ""}

${assessmentContext}

${template ? `Use this template as a structural reference and improve upon it:\n${template.content.slice(0, 500)}...` : ""}

${customInstructions ? `Additional instructions from the admin:\n${customInstructions}` : ""}`;

  const userPrompt = `Generate a ${categoryLabel} AI policy for this organisation. Make it specific to their industry and context where possible. Return ONLY the Markdown content, no preamble.`;

  try {
    const result = await generateText({
      model: getLanguageModel("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 4000,
    });

    return NextResponse.json({
      content: result.text,
      title: template?.title ?? `${categoryLabel} Policy`,
      category: category ?? "general",
    });
  } catch (err) {
    console.error("[ai-policies/generate] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate policy" },
      { status: 500 }
    );
  }
}
