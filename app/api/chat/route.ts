import { streamText, stepCountIs, type ModelMessage } from "ai";
import {
  getLanguageModel,
  calculateCost,
  calculateCustomerCharge,
  resolveModelForRequest,
} from "@/lib/model-router";
import { checkInput, checkOutput } from "@/lib/guardrails";
import { createClient } from "@/lib/supabase/server";
import { resolveCompanion, webSearchTool, type CompanionContext } from "@/lib/companions";
import { checkBudget } from "@/lib/cost-ceiling";
import { checkOrgCredits, debitCredits, getCreditSettings } from "@/lib/credits";
import { creditsForTokenUsage } from "@/lib/credit-math";
import type { UserRole } from "@/lib/role-helpers";
import type { PlanType } from "@/lib/constants";
import { PLAN_TYPES, getPlanFeatures } from "@/lib/constants";

export const maxDuration = 60;

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image"; image: string };

const TEXT_MEDIA = /^text\/|^application\/(json|csv)$/;

/** Attachment payloads arrive as data URLs; decode the text-like ones. */
function decodeDataUrlText(url: string): string {
  try {
    const comma = url.indexOf(",");
    if (comma === -1) return "";
    const meta = url.slice(0, comma);
    const data = url.slice(comma + 1);
    const decoded = meta.includes(";base64")
      ? Buffer.from(data, "base64").toString("utf8")
      : decodeURIComponent(data);
    // Bounded: a pasted spreadsheet should not blow the context window.
    return decoded.slice(0, 20_000);
  } catch {
    return "";
  }
}

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
      } else if (p.type === "file" && typeof p.url === "string") {
        // Attachments arrive as AI SDK file parts (data URLs). Images go to
        // the model as images; text-like files are inlined as text. Anything
        // else is skipped here - the composer refuses those types up front
        // rather than letting them look accepted and vanish.
        const mediaType = typeof p.mediaType === "string" ? p.mediaType : "";
        const filename = typeof p.filename === "string" ? p.filename : "file";
        if (mediaType.startsWith("image/")) {
          result.push({ type: "image", image: p.url });
        } else if (TEXT_MEDIA.test(mediaType)) {
          result.push({
            type: "text",
            text: `\n\n--- Attached file: ${filename} ---\n${decodeDataUrlText(p.url)}`,
          });
        }
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

/**
 * Turn the model's own response messages into the UIMessage `parts` shape the
 * transcript renders, so a reopened thread shows the steps the agent took
 * rather than an answer that appears from nowhere.
 *
 * Only completed calls are stored - a mid-flight call has no result worth
 * keeping. Falls back to a plain text part when no tools were used.
 */
type StoredPart =
  | { type: "text"; text: string }
  | {
      type: string;
      toolCallId: string;
      toolName: string;
      state: "output-available";
      input: unknown;
      output: unknown;
    };

/**
 * The user's own message parts, with attachment payloads stripped.
 * Returns null when there is nothing beyond plain text worth storing.
 */
function userPartsForStorage(msg: unknown): unknown[] | null {
  const parts = (msg as { parts?: unknown })?.parts;
  if (!Array.isArray(parts)) return null;

  const kept = parts.map((raw) => {
    const part = raw as Record<string, unknown>;
    if (part.type !== "file") return part;
    return {
      type: "file",
      mediaType: part.mediaType,
      filename: part.filename,
      // url deliberately omitted - see the call site.
    };
  });

  return kept.some((p) => (p as { type?: string }).type === "file") ? kept : null;
}

function toStoredParts(responseMessages: unknown[], text: string): StoredPart[] {
  const calls = new Map<string, { toolName: string; input: unknown }>();
  const parts: StoredPart[] = [];

  for (const msg of responseMessages) {
    const content = (msg as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const part of content as Record<string, unknown>[]) {
      if (part.type === "tool-call") {
        calls.set(part.toolCallId as string, {
          toolName: part.toolName as string,
          input: part.input,
        });
      } else if (part.type === "tool-result") {
        const call = calls.get(part.toolCallId as string);
        const toolName = (part.toolName as string) ?? call?.toolName ?? "tool";
        const wrapped = part.output as { type?: string; value?: unknown } | undefined;
        parts.push({
          type: `tool-${toolName}`,
          toolCallId: part.toolCallId as string,
          toolName,
          state: "output-available",
          input: call?.input ?? null,
          // Tool output arrives wrapped as {type:'json'|'text', value}.
          output: wrapped && "value" in wrapped ? wrapped.value : wrapped,
        });
      }
    }
  }

  if (text) parts.push({ type: "text", text });
  return parts;
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
    project_id: requestedProjectId,
    web_search: webSearchRequested,
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

  // The client mints the conversation id up front so the first message can
  // render instantly instead of waiting on a create round trip. That means
  // the row may not exist yet on the first request of a thread.
  let conversationProjectId: string | null = null;
  let conversationIsNew = false;

  if (conversationId) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("companion, user_id, project_id")
      .eq("id", conversationId)
      .maybeSingle();
    if (conv) {
      if (conv.user_id !== user.id) {
        return json({ error: "Not your conversation." }, 403);
      }
      companionId = conv.companion ?? companionId;
      conversationProjectId = conv.project_id ?? null;
    } else {
      conversationIsNew = true;
      conversationProjectId =
        typeof requestedProjectId === "string" ? requestedProjectId : null;
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

  // The org wallet is the commercial control on top of the per-user abuse
  // ceiling above: out of credits means no new requests until an admin
  // tops up. Orgs that have never bought credits are not blocked (see
  // checkOrgCredits).
  if (orgId) {
    const credits = await checkOrgCredits(orgId);
    if (!credits.allowed) {
      return json(
        {
          error: "insufficient_credits",
          message:
            "Your organisation is out of AI credits. An admin can top up from the Billing page.",
          balance: credits.balance,
        },
        402
      );
    }
  }

  // ── model ─────────────────────────────────────────────────────────────

  // Learners get the companion's default and no choice (brief §7.3); staff
  // may pick anything their plan allows.
  const resolved = resolveModelForRequest({
    plan,
    companionDefault: companion.defaultModel,
    requestedModel,
    allowModelSelect: companion.allowModelSelect(role),
  });
  if (!resolved.ok) {
    return json({ error: "Upgrade to Pro to use this model." }, 403);
  }
  const modelId = resolved.modelId;

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

  // conversationProjectId came from the companion lookup above - this used to
  // be a second identical read of the same row.
  let projectInstructions = "";
  if (conversationProjectId) {
    const [{ data: project }, { data: projectFiles }] = await Promise.all([
      supabase
        .from("projects")
        .select("instructions")
        .eq("id", conversationProjectId)
        .maybeSingle(),
      supabase
        .from("project_files")
        .select("filename, extracted_text")
        .eq("project_id", conversationProjectId)
        .not("extracted_text", "is", null)
        .limit(10),
    ]);

    if (project?.instructions) {
      projectInstructions = `\n\nPROJECT INSTRUCTIONS:\n${project.instructions}`;
    }

    // The project dialog has always promised files the AI can reference;
    // until now nothing ever read them back.
    if (projectFiles && projectFiles.length > 0) {
      const budget = 24_000;
      const perFile = Math.floor(budget / projectFiles.length);
      const blocks = projectFiles.map(
        (f) => `--- ${f.filename} ---\n${(f.extracted_text ?? "").slice(0, perFile)}`
      );
      projectInstructions += `\n\nPROJECT FILES:\n${blocks.join("\n\n")}`;
    }
  }

  const ctx: CompanionContext = { userId: user.id, orgId, role };

  const systemPrompt =
    companion.systemPrompt(ctx) +
    projectInstructions +
    orgContext +
    userContext;

  // ── tools ─────────────────────────────────────────────────────────────

  // Web search is opt-in per request, but the gate is here rather than on the
  // client: a crafted body cannot buy itself a tool the plan does not include.
  const webSearchAllowed =
    webSearchRequested === true && getPlanFeatures(plan).webSearch;

  const tools = {
    ...companion.tools(ctx),
    ...(webSearchAllowed ? webSearchTool() : {}),
  };

  // Captured non-null so the guards above still hold inside persist(), which
  // TypeScript treats as callable later and therefore re-widens.
  const authedUserId = user.id;
  const resolvedCompanionId = companion.id;

  // ── stream ────────────────────────────────────────────────────────────

  /**
   * Persistence runs on both normal completion and abort. It used to live
   * only in onFinish, so pressing Stop threw the exchange away - the user
   * watched a reply arrive and then lose it on reload.
   *
   * Guarded so the two paths cannot both write if the SDK calls both.
   */
  let persisted = false;

  async function persist(
    text: string,
    usage: unknown,
    responseMessages: unknown[]
  ) {
    if (persisted) return;
    persisted = true;

    const tokenUsage = usage as Record<string, number> | undefined;
    const inputTokens = tokenUsage?.promptTokens ?? tokenUsage?.inputTokens ?? 0;
    const outputTokens = tokenUsage?.completionTokens ?? tokenUsage?.outputTokens ?? 0;
    const rawCost = calculateCost(modelId, inputTokens, outputTokens);
    const customerCharge = calculateCustomerCharge(rawCost);

    // The stream has already reached the client; the output check cannot
    // block, but a redacted copy is what gets stored.
    const outCheck = checkOutput(text);
    const storedText = outCheck.redactedText ?? text;

    const { data: usageRow } = await supabase
      .from("usage_logs")
      .insert({
        org_id: orgId,
        user_id: authedUserId,
        department_id: departmentId,
        model: modelId,
        tokens_in: inputTokens,
        tokens_out: outputTokens,
        cost: rawCost,
        customer_charge: customerCharge,
        endpoint: "/api/chat",
      })
      .select("id")
      .maybeSingle();

    if (orgId && rawCost > 0) {
      const settings = await getCreditSettings();
      await debitCredits(orgId, creditsForTokenUsage(rawCost, settings), {
        usageLogId: usageRow?.id,
        model: modelId,
        description: "Chat",
        userId: authedUserId,
      });
    }

    if (!conversationId || lastMessage?.role !== "user") return;

    // First message of a client-minted thread: create the row now. The
    // companion is fixed here and read back on later requests, so a thread
    // cannot be reopened against another audience's toolset.
    if (conversationIsNew) {
      // upsert, not insert: two quick sends can both see the row as missing,
      // and a duplicate-key failure here would take the messages insert with
      // it on the foreign key.
      await supabase.from("conversations").upsert(
        {
          id: conversationId,
          user_id: authedUserId,
          org_id: orgId,
          model: modelId,
          title: "New conversation",
          project_id: conversationProjectId,
          companion: resolvedCompanionId,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }

    await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        role: "user",
        content: extractTextOnly(lastMessage.content),
        // Attachments are recorded by name and type only. The payload is a
        // data URL - keeping it would put megabytes of base64 in every row,
        // so a reopened thread shows what was attached, not the file itself.
        parts: userPartsForStorage(rawMessages[rawMessages.length - 1]),
        model: modelId,
      },
      {
        conversation_id: conversationId,
        role: "assistant",
        content: storedText,
        // The tool steps the agent took, so reopening the thread shows the
        // work rather than an answer from nowhere.
        parts: toStoredParts(responseMessages, storedText),
        model: modelId,
        tokens_used: outputTokens,
        cost: rawCost,
      },
    ]);
  }

  const result = streamText({
    model: getLanguageModel(modelId),
    system: systemPrompt,
    messages: messages as unknown as ModelMessage[],
    tools,
    stopWhen: stepCountIs(5),
    onFinish: async ({ text, usage, response }) => {
      await persist(text, usage, response?.messages ?? []);
    },
    onAbort: async () => {
      // No usage figures on an abort, so nothing is billed - but the partial
      // exchange is kept rather than silently dropped.
      await persist("", undefined, []);
    },
  });

  return result.toUIMessageStreamResponse();
}
