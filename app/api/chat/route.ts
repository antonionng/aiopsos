import { streamText, type ModelMessage } from "ai";
import { getLanguageModel, calculateCost, calculateCustomerCharge, canUseModel } from "@/lib/model-router";
import { checkInput } from "@/lib/guardrails";
import { createClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/constants";

export const maxDuration = 60;

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image"; image: string };

function extractContent(msg: Record<string, unknown>): string | ContentPart[] {
  const parts = (msg.parts ?? msg.content) as unknown;

  if (typeof msg.content === "string" && !Array.isArray(parts)) {
    return msg.content;
  }

  if (Array.isArray(parts)) {
    const result: ContentPart[] = [];
    for (const p of parts as Record<string, unknown>[]) {
      if (p.type === "text" && typeof p.text === "string") {
        result.push({ type: "text", text: p.text });
      } else if (p.type === "image" && typeof p.image === "string") {
        result.push({ type: "image", image: p.image });
      }
    }
    if (result.length > 0) return result;
  }

  return typeof msg.content === "string" ? msg.content : "";
}

function extractTextOnly(content: string | ContentPart[]): string {
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
  const rl = rateLimit(`chat:${ip}`, RATE_LIMITS.chat);
  if (!rl.success) {
    return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), {
      status: 429,
      headers: { "Content-Type": "application/json", ...getRateLimitHeaders(rl) },
    });
  }

  const body = await req.json();
  const {
    messages: rawMessages,
    model: modelId = "gpt-4o-mini",
    persona,
    conversation_id: conversationId,
    web_search_results: webSearchResults,
  } = body;

  if (!rawMessages || !Array.isArray(rawMessages)) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  type ChatMessage = { role: string; content: string | ContentPart[] };

  const messages: ChatMessage[] = rawMessages.map((msg: Record<string, unknown>) => ({
    role: msg.role as string,
    content: extractContent(msg),
  }));

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    const textContent = extractTextOnly(lastMessage.content);
    const check = checkInput(textContent);
    if (check.blocked) {
      return new Response(
        JSON.stringify({ error: "Input blocked", warnings: check.warnings }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }
    if (check.redactedText) {
      messages[messages.length - 1] = {
        ...lastMessage,
        content: check.redactedText,
      };
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orgId: string | null = null;
  let plan: PlanType = "basic";
  let orgContext = "";
  let userContext = "";

  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, name, job_title, bio, skills, preferences")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      const parts: string[] = [];
      if (profile.name) parts.push(`- Name: ${profile.name}`);
      if (profile.job_title) parts.push(`- Role: ${profile.job_title}`);
      if (profile.bio) parts.push(`- About: ${profile.bio}`);
      if (profile.skills) parts.push(`- Expertise: ${profile.skills}`);
      const prefs = profile.preferences as Record<string, string> | null;
      if (prefs?.communication_style)
        parts.push(`- Communication style: ${prefs.communication_style}`);
      if (prefs?.detail_level)
        parts.push(`- Detail level: ${prefs.detail_level}`);
      if (parts.length > 0)
        userContext = `\n\nUSER CONTEXT:\n${parts.join("\n")}`;
    }

    if (profile?.org_id) {
      orgId = profile.org_id;

      const { data: org } = await supabase
        .from("organisations")
        .select(
          "subscription_status, subscription_plan_id, trial_ends_at, name, industry, size, website, description, location, founded_year, mission, products_services, tech_stack"
        )
        .eq("id", orgId)
        .maybeSingle();

      if (org) {
        const isTrialing = org.subscription_status === "trialing" &&
          org.trial_ends_at && new Date(org.trial_ends_at) > new Date();
        const isActive = org.subscription_status === "active";

        if (!isTrialing && !isActive) {
          return new Response(
            JSON.stringify({ error: "Subscribe to use AI. Your trial has expired." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }

        if (org.subscription_plan_id) {
          const { data: planData } = await supabase
            .from("subscription_plans")
            .select("name")
            .eq("id", org.subscription_plan_id)
            .maybeSingle();
          if (planData) plan = planData.name as PlanType;
        } else if (isTrialing) {
          plan = "pro";
        }

        const oParts: string[] = [];
        if (org.name) oParts.push(`- Name: ${org.name}`);
        if (org.industry) oParts.push(`- Industry: ${org.industry}`);
        if (org.size) oParts.push(`- Size: ${org.size}`);
        if (org.description) oParts.push(`- About: ${org.description}`);
        if (org.location) oParts.push(`- Location: ${org.location}`);
        if (org.mission) oParts.push(`- Mission: ${org.mission}`);
        if (org.products_services) oParts.push(`- Products/Services: ${org.products_services}`);
        if (org.tech_stack) oParts.push(`- Tech Stack: ${org.tech_stack}`);
        if (oParts.length > 0)
          orgContext = `\n\nCOMPANY CONTEXT:\n${oParts.join("\n")}`;
      }
    }
  }

  if (!canUseModel(plan, modelId)) {
    return new Response(
      JSON.stringify({ error: "Upgrade to Pro to use this model." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const languageModel = getLanguageModel(modelId);

  let projectInstructions = "";
  if (conversationId) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("project_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (conv?.project_id) {
      const { data: project } = await supabase
        .from("projects")
        .select("instructions")
        .eq("id", conv.project_id)
        .maybeSingle();

      if (project?.instructions) {
        projectInstructions = `\n\nPROJECT INSTRUCTIONS:\n${project.instructions}`;
      }
    }
  }

  let webSearchContext = "";
  if (Array.isArray(webSearchResults) && webSearchResults.length > 0) {
    const citations = webSearchResults
      .map(
        (r: { title: string; url: string; content: string }, i: number) =>
          `[${i + 1}] ${r.title} - ${r.url}\n${r.content}`
      )
      .join("\n\n");
    webSearchContext =
      "\n\nWEB SEARCH RESULTS (cite sources using [n] notation):\n" + citations;
  }

  let systemPrompt =
    "You are an AI assistant within the AIOPSOS platform. " +
    "You help enterprise users with their work tasks. " +
    "Be concise, professional, and helpful. " +
    "Format responses with markdown when appropriate." +
    projectInstructions +
    orgContext +
    userContext +
    webSearchContext +
    (orgContext || userContext || projectInstructions || webSearchContext
      ? "\n\nUse this context to give personalised, relevant responses."
      : "");

  if (persona) {
    systemPrompt = persona + projectInstructions + orgContext + userContext + webSearchContext;
  }

  const result = streamText({
    model: languageModel,
    system: systemPrompt,
    messages: messages as unknown as ModelMessage[],
    onFinish: async ({ text, usage }) => {
      if (!user || !orgId) return;
      const tokenUsage = usage as unknown as Record<string, number> | undefined;
      const inputTokens = tokenUsage?.promptTokens ?? tokenUsage?.inputTokens ?? 0;
      const outputTokens = tokenUsage?.completionTokens ?? tokenUsage?.outputTokens ?? 0;
      const rawCost = calculateCost(modelId, inputTokens, outputTokens);
      const customerCharge = calculateCustomerCharge(rawCost);

      await supabase.from("usage_logs").insert({
        org_id: orgId,
        user_id: user.id,
        model: modelId,
        tokens_in: inputTokens,
        tokens_out: outputTokens,
        cost: rawCost,
        customer_charge: customerCharge,
        endpoint: "/api/chat",
      });

      if (conversationId && lastMessage?.role === "user") {
        await supabase.from("messages").insert([
          {
            conversation_id: conversationId,
            role: "user",
            content: extractTextOnly(lastMessage.content),
            model: modelId,
          },
          {
            conversation_id: conversationId,
            role: "assistant",
            content: text,
            model: modelId,
            tokens_used: outputTokens,
            cost: rawCost,
          },
        ]);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
