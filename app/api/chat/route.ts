import { streamText, stepCountIs, type ModelMessage } from "ai";
import { getLanguageModel, calculateCost, calculateCustomerCharge, canUseModel } from "@/lib/model-router";
import { checkInput, checkOutput } from "@/lib/guardrails";
import { createClient } from "@/lib/supabase/server";
import { resolveCompanion, type CompanionContext } from "@/lib/companions";
import { checkBudget } from "@/lib/cost-ceiling";
import type { UserRole } from "@/lib/role-helpers";
import type { PlanType } from "@/lib/constants";
import { PLAN_TYPES } from "@/lib/constants";

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

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { rateLimit, RATE_LIMITS, getRateLimitHeaders } = await import("@/lib/rate-limit");
  const rl = rateLimit(`chat:${ip}`, RATE_LIMITS.chat);
  if (!rl.success) {
    return json({ error: "Too many requests. Please slow down." }, 429, getRateLimitHeaders(rl));
  }

  const body = await req.json();
  const {
    messages: rawMessages,
    companion: requestedCompanion,
    model: requestedModel,
    conversation_id: conversationId,
    web_search_results: webSearchResults,
  } = body;

  if (!rawMessages || !Array.isArray(rawMessages)) {
    return json({ error: "messages required" }, 400);
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
      return json({ error: "Input blocked", warnings: check.warnings }, 422);
    }
    if (check.redactedText) {
      messages[messages.length - 1] = {
        ...lastMessage,
        content: check.redactedText,
      };
    }
  }

  // ── who is asking ─────────────────────────────────────────────────────

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: "Sign in to use chat." }, 401);

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role, department_id, plan_override, name, job_title, bio, skills, preferences")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) {
    return json({ error: "Join or create an organisation to use chat." }, 403);
  }

  const orgId: string = profile.org_id;
  const role = (profile.role ?? "user") as UserRole;
  const departmentId: string | null = profile.department_id ?? null;

  const { data: org } = await supabase
    .from("organisations")
    .select(
      "subscription_status, subscription_plan_id, trial_ends_at, name, industry, size, description, location, mission, products_services, tech_stack"
    )
    .eq("id", orgId)
    .maybeSingle();

  let plan: PlanType = "basic";
  if (org) {
    const isTrialing = org.subscription_status === "trialing" &&
      org.trial_ends_at && new Date(org.trial_ends_at) > new Date();
    const isActive = org.subscription_status === "active";

    if (!isTrialing && !isActive) {
      return json({ error: "Subscribe to use AI. Your trial has expired." }, 403);
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
  }
  // A user-level override (set by support) beats the org plan.
  if (profile.plan_override && (PLAN_TYPES as readonly string[]).includes(profile.plan_override)) {
    plan = profile.plan_override as PlanType;
  }

  // ── which companion ───────────────────────────────────────────────────

  // For an existing conversation the companion is whatever it was created
  // as - the stored value wins over the request, so a crafted request
  // cannot reopen a learning thread with the insights toolset.
  let companionId: string | undefined =
    typeof requestedCompanion === "string" ? requestedCompanion : undefined;
  if (conversationId) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("companion, user_id")
      .eq("id", conversationId)
      .maybeSingle();
    if (conv) {
      if (conv.user_id !== user.id) {
        return json({ error: "Not your conversation." }, 403);
      }
      companionId = conv.companion ?? companionId;
    }
  }

  const companion = resolveCompanion(companionId, role);
  if (!companion) {
    return json({ error: "This companion is not available for your role." }, 403);
  }

  // ── spend ceiling ─────────────────────────────────────────────────────

  const budget = await checkBudget(user.id, plan);
  if (!budget.allowed) {
    const resetAt = budget.resetAt ?? new Date(Date.now() + 3600_000);
    const retryAfterSec = Math.max(60, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
    return json(
      {
        error: "budget_exceeded",
        message:
          budget.exceeded === "monthly"
            ? "This account has reached its monthly AI budget. It resets at the start of next month."
            : "This account has reached its daily AI budget. It resets at midnight UTC.",
        resetAt: resetAt.toISOString(),
      },
      429,
      { "Retry-After": String(retryAfterSec) }
    );
  }

  // ── model ─────────────────────────────────────────────────────────────

  // Learners get the companion's default and no choice (brief §7.3); staff
  // may pick anything their plan allows.
  let modelId = companion.defaultModel;
  if (companion.allowModelSelect(role) && typeof requestedModel === "string" && requestedModel) {
    if (!canUseModel(plan, requestedModel)) {
      return json({ error: "Upgrade to Pro to use this model." }, 403);
    }
    modelId = requestedModel;
  }

  // ── context blocks ────────────────────────────────────────────────────

  const userParts: string[] = [];
  if (profile.name) userParts.push(`- Name: ${profile.name}`);
  if (profile.job_title) userParts.push(`- Role: ${profile.job_title}`);
  if (profile.bio) userParts.push(`- About: ${profile.bio}`);
  if (profile.skills) userParts.push(`- Expertise: ${profile.skills}`);
  const prefs = profile.preferences as Record<string, string> | null;
  if (prefs?.communication_style) userParts.push(`- Communication style: ${prefs.communication_style}`);
  if (prefs?.detail_level) userParts.push(`- Detail level: ${prefs.detail_level}`);
  const userContext = userParts.length > 0 ? `\n\nUSER CONTEXT:\n${userParts.join("\n")}` : "";

  const oParts: string[] = [];
  if (org?.name) oParts.push(`- Name: ${org.name}`);
  if (org?.industry) oParts.push(`- Industry: ${org.industry}`);
  if (org?.size) oParts.push(`- Size: ${org.size}`);
  if (org?.description) oParts.push(`- About: ${org.description}`);
  if (org?.location) oParts.push(`- Location: ${org.location}`);
  if (org?.mission) oParts.push(`- Mission: ${org.mission}`);
  if (org?.products_services) oParts.push(`- Products/Services: ${org.products_services}`);
  if (org?.tech_stack) oParts.push(`- Tech Stack: ${org.tech_stack}`);
  const orgContext = oParts.length > 0 ? `\n\nCOMPANY CONTEXT:\n${oParts.join("\n")}` : "";

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

  const ctx: CompanionContext = { userId: user.id, orgId, role };

  const systemPrompt =
    companion.systemPrompt(ctx) +
    projectInstructions +
    orgContext +
    userContext +
    webSearchContext;

  // ── stream ────────────────────────────────────────────────────────────

  const result = streamText({
    model: getLanguageModel(modelId),
    system: systemPrompt,
    messages: messages as unknown as ModelMessage[],
    tools: companion.tools(ctx),
    stopWhen: stepCountIs(5),
    onFinish: async ({ text, usage }) => {
      const tokenUsage = usage as unknown as Record<string, number> | undefined;
      const inputTokens = tokenUsage?.promptTokens ?? tokenUsage?.inputTokens ?? 0;
      const outputTokens = tokenUsage?.completionTokens ?? tokenUsage?.outputTokens ?? 0;
      const rawCost = calculateCost(modelId, inputTokens, outputTokens);
      const customerCharge = calculateCustomerCharge(rawCost);

      // The stream has already reached the client; the output check cannot
      // block, but a redacted copy is what gets stored.
      const outCheck = checkOutput(text);
      const storedText = outCheck.redactedText ?? text;

      await supabase.from("usage_logs").insert({
        org_id: orgId,
        user_id: user.id,
        department_id: departmentId,
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
            content: storedText,
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
