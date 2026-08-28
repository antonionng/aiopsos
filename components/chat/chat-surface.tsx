"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users2,
  LineChart,
  BookOpen,
  Bot,
  Sparkles,
  ArrowDown,
  Share2,
  Download,
  Check,
  Globe,
  TriangleAlert,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput, type ChatAttachment, type ComposerMode } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import { MODEL_REGISTRY } from "@/lib/model-router";
import { useChatContext } from "@/components/chat/chat-context";
import { downloadMarkdown } from "@/lib/export-conversation";
import {
  COMPANION_META,
  companionsForRole,
  canSelectModel,
  type CompanionId,
  AI_BRAND,
} from "@/lib/companion-meta";
import { getPlanFeatures, type PlanType } from "@/lib/constants";
import type { UserRole } from "@/lib/role-helpers";

interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  is_shared: boolean;
}

interface Props {
  role: UserRole;
  plan: PlanType;
}

const SCROLL_THRESHOLD = 80;

const COMPANION_SUGGESTIONS: Record<CompanionId, string[]> = {
  learning: [
    "What should I learn next?",
    "How am I doing on my current course?",
    "Show my certificates",
    "What does the prompting course cover?",
  ],
  ld: [
    "How are our cohorts progressing?",
    "Which departments have the biggest readiness gaps?",
    "Who has completed training so far?",
    "Summarise attendance across running cohorts",
  ],
  insights: [
    "Which teams are actually using AI?",
    "Show me our assessment results by department",
    "What training has my team completed?",
    "Where should we invest in training next?",
  ],
};

/**
 * Attachments are sent to the model as AI SDK file parts, which carry the
 * content as a data URL. They used to be uploaded to storage and then
 * dropped on the floor - `sendMessage` was called with text only, so the
 * model never saw the file the user had attached.
 */
function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Turns the route's error responses into something a person can act on. */
function describeError(error: Error): { message: string; href?: string; cta?: string } {
  const raw = error.message ?? "";
  let parsed: Record<string, unknown> = {};
  try {
    const start = raw.indexOf("{");
    if (start > -1) parsed = JSON.parse(raw.slice(start));
  } catch {
    // Not JSON - fall through to the raw text.
  }

  const code = parsed.error as string | undefined;
  const detail = parsed.message as string | undefined;

  if (code === "insufficient_credits") {
    return {
      message:
        detail ?? "Your organisation is out of AI credits.",
      href: "/dashboard/billing",
      cta: "Go to Billing",
    };
  }
  if (code === "budget_exceeded") {
    return { message: detail ?? "This account has reached its AI budget." };
  }
  if (detail) return { message: detail };
  if (code) return { message: code };
  return { message: raw || "Something went wrong. Please try again." };
}

export function ChatSurface({ role, plan }: Props) {
  const {
    activeSession: conversationId,
    activeProjectFilter,
    onConversationCreated,
    updateSessionTitle,
    sessions,
    createNewChat,
    mutationError,
    clearMutationError,
  } = useChatContext();

  const [companion, setCompanion] = useState<CompanionId>(
    role === "user" ? "learning" : "learning"
  );
  const [model, setModel] = useState(COMPANION_META.learning.defaultModel);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [pendingConvId, setPendingConvId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showModelSelector = canSelectModel(role);
  const canWebSearch = getPlanFeatures(plan).webSearch;
  const activeCompanion = COMPANION_META[companion];
  const availableCompanions = useMemo(() => companionsForRole(role), [role]);

  const currentConvId = conversationId ?? pendingConvId;

  // Ids this tab minted itself. The conversation row does not exist until the
  // first turn is persisted, so refetching one of these would return nothing
  // and wipe the messages the user is looking at.
  const locallyCreatedRef = useRef<Set<string>>(new Set());

  // Read at send time by the transport, so changing model or agent never
  // rebuilds the transport mid-stream.
  const sendCtxRef = useRef({
    model,
    companion,
    conversationId: currentConvId,
    projectId: activeProjectFilter,
    webSearch: webSearchEnabled && canWebSearch,
  });
  useEffect(() => {
    sendCtxRef.current = {
      model,
      companion,
      conversationId: currentConvId,
      projectId: activeProjectFilter,
      webSearch: webSearchEnabled && canWebSearch,
    };
  }, [model, companion, currentConvId, activeProjectFilter, webSearchEnabled, canWebSearch]);

  // Built once. The body is computed per request from the ref above - the old
  // version rebuilt the transport whenever state changed and relied on a
  // 50ms sleep for the new one to be in place before sending.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            ...body,
            messages,
            model: sendCtxRef.current.model,
            companion: sendCtxRef.current.companion,
            conversation_id: sendCtxRef.current.conversationId ?? undefined,
            project_id: sendCtxRef.current.projectId ?? undefined,
            web_search: sendCtxRef.current.webSearch,
          },
        }),
      }),
    []
  );

  const { messages, sendMessage, status, setMessages, stop, regenerate, error, clearError } =
    useChat({
      transport,
      // Without this, every token re-renders the page and re-parses the
      // markdown of every message in the thread.
      experimental_throttle: 50,
    });

  const isLoading = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted";

  const modelLabel = MODEL_REGISTRY[model]?.label ?? model;

  // ── thread loading ──────────────────────────────────────────────────────

  useEffect(() => {
    setPendingConvId(null);
    setFeedbackMap({});
    setShareToken(null);
    setNotice(null);

    if (!conversationId) {
      setMessages([]);
      return;
    }

    // A thread this tab just created has no row yet, and its messages are
    // already on screen. Refetching it returned an empty list and cleared
    // the user's first message out from under them.
    if (locallyCreatedRef.current.has(conversationId)) return;

    const controller = new AbortController();
    setLoadingThread(true);

    fetch(`/api/conversations/${conversationId}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load thread"))))
      .then((d) => {
        if (d.conversation?.companion && COMPANION_META[d.conversation.companion as CompanionId]) {
          setCompanion(d.conversation.companion as CompanionId);
        }
        if (Array.isArray(d.messages)) {
          setMessages(
            d.messages.map((m: { id: string; role: string; content: string; parts?: unknown[] }) => ({
              id: m.id,
              role: m.role,
              // Stored parts bring the agent's tool steps back; older rows
              // and user messages only ever have text.
              parts:
                Array.isArray(m.parts) && m.parts.length > 0
                  ? m.parts
                  : [{ type: "text" as const, text: m.content }],
            }))
          );
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setNotice("Could not load this conversation.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingThread(false);
      });

    // Switching threads quickly must not let a slow earlier response win.
    return () => controller.abort();
  }, [conversationId, setMessages]);

  // ── scroll ──────────────────────────────────────────────────────────────

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);

  const scrollToBottom = useCallback((smooth: boolean) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    isAtBottomRef.current = true;
    setShowScrollButton(false);
  }, []);

  // Follow the content as it grows rather than reacting to message identity.
  // Instant during streaming: a smooth scroll per token fought the container's
  // own smooth-scroll and produced visible judder.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) scrollToBottom(false);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  // ── prompts ─────────────────────────────────────────────────────────────

  const loadPrompts = useCallback(() => {
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => setSavedPrompts(d.prompts ?? []))
      .catch(() => setSavedPrompts([]));
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // ── finalize: title + real message ids ──────────────────────────────────

  const prevStatusRef = useRef(status);
  useEffect(() => {
    const wasStreaming = prevStatusRef.current === "streaming";
    prevStatusRef.current = status;
    if (!wasStreaming || status !== "ready" || !currentConvId) return;

    const convId = currentConvId;
    fetch(`/api/conversations/${convId}/finalize`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        if (d.title) updateSessionTitle(convId, d.title);

        // Swap the SDK's local ids for the persisted row ids. Feedback is a
        // foreign key to messages(id), so until this happens a thumbs-up on a
        // freshly streamed reply cannot be stored.
        if (Array.isArray(d.messages) && d.messages.length > 0) {
          setMessages((prev) => {
            const byRole: Record<string, string[]> = { user: [], assistant: [] };
            for (const m of d.messages as { id: string; role: string }[]) {
              byRole[m.role]?.push(m.id);
            }
            const cursor = { user: 0, assistant: 0 };
            return prev.map((msg) => {
              const list = byRole[msg.role];
              if (!list) return msg;
              const next = list[cursor[msg.role as "user" | "assistant"]++];
              return next ? { ...msg, id: next } : msg;
            });
          });
        }
      })
      .catch(() => {
        // Non-fatal: the thread keeps its provisional title.
      });
  }, [status, currentConvId, updateSessionTitle, setMessages]);

  // ── sending ─────────────────────────────────────────────────────────────

  /**
   * The conversation id is minted here rather than fetched. /api/chat creates
   * the row when it persists the first turn, so the user's message can render
   * immediately instead of waiting on a create round trip.
   */
  const ensureConversation = useCallback((): string => {
    if (currentConvId) return currentConvId;

    const id = crypto.randomUUID();
    locallyCreatedRef.current.add(id);
    setPendingConvId(id);
    onConversationCreated({
      id,
      title: "New conversation",
      model,
      timestamp: new Date(),
      pinned: false,
      project_id: activeProjectFilter ?? null,
    });
    return id;
  }, [currentConvId, model, activeProjectFilter, onConversationCreated]);

  /**
   * Image generation and deep research are separate endpoints, so they are
   * driven here rather than through the chat transport. Both now persist
   * server-side, so their output survives a reload - it used to live only in
   * React state and vanish when the thread was reopened.
   */
  const runSideChannel = useCallback(
    async (mode: "image" | "research", prompt: string, convId: string) => {
      const label = mode === "image" ? "Create an image" : "Deep research";
      const placeholderId = `${mode}-${crypto.randomUUID()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: `${placeholderId}-req`,
          role: "user" as const,
          parts: [{ type: "text" as const, text: `${label}: ${prompt}` }],
        },
        {
          id: placeholderId,
          role: "assistant" as const,
          parts: [
            {
              type: "text" as const,
              text: mode === "image" ? "Generating image…" : "Starting deep research…",
            },
          ],
        },
      ]);

      const replaceLast = (text: string) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? { ...m, parts: [{ type: "text" as const, text }] }
              : m
          )
        );

      try {
        const endpoint = mode === "image" ? "/api/chat/image" : "/api/chat/research";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "image"
              ? { prompt, conversation_id: convId, companion: sendCtxRef.current.companion }
              : { query: prompt, conversation_id: convId, companion: sendCtxRef.current.companion }
          ),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          replaceLast(`${label} failed: ${err.error ?? res.statusText}`);
          return;
        }

        if (mode === "image") {
          const data = await res.json();
          replaceLast(
            `![Generated image](${data.url})\n\n*${data.revised_prompt || prompt}*`
          );
          return;
        }

        // Deep research streams its own SSE progress events.
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let report = "";
        let buffer = "";

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Split on complete events only - a chunk can cut a line in half.
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            for (const line of event.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6);
              if (payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                if (parsed.type === "progress") replaceLast(`*${parsed.message}*`);
                else if (parsed.type === "result") report = parsed.report;
              } catch {
                // Ignore partial or non-JSON frames.
              }
            }
          }
        }

        if (report) replaceLast(report);
      } catch {
        replaceLast(`${label} failed. Please try again.`);
      }
    },
    [setMessages]
  );

  const handleSend = useCallback(
    async (content: string, attachments?: ChatAttachment[], mode: ComposerMode = "chat") => {
      clearError?.();
      setNotice(null);

      const convId = ensureConversation();
      sendCtxRef.current.conversationId = convId;

      if (mode !== "chat") {
        if (!content) {
          setNotice(
            mode === "image"
              ? "Describe the image you want first."
              : "Say what you would like researched first."
          );
          return;
        }
        scrollToBottom(false);
        await runSideChannel(mode, content, convId);
        return;
      }

      // Files become AI SDK file parts so the model actually receives them.
      let files;
      if (attachments && attachments.length > 0) {
        try {
          files = await Promise.all(
            attachments.map(async (att) => ({
              type: "file" as const,
              mediaType: att.file_type,
              filename: att.filename,
              url: await toDataUrl(att.file),
            }))
          );
        } catch {
          setNotice("Could not read one of those files. The message was not sent.");
          return;
        }
      }

      sendMessage({ text: content, files });
      scrollToBottom(false);
    },
    [clearError, ensureConversation, sendMessage, scrollToBottom, runSideChannel]
  );

  const switchCompanion = useCallback(
    (next: CompanionId) => {
      if (next === companion) return;
      setCompanion(next);
      setModel(COMPANION_META[next].defaultModel);
      // A conversation's agent is fixed at creation, so switching starts a
      // fresh thread rather than re-homing the current one.
      createNewChat();
    },
    [companion, createNewChat]
  );

  // ── message actions ─────────────────────────────────────────────────────

  const handleRegenerate = useCallback(() => {
    regenerate();
  }, [regenerate]);

  const handleFeedback = useCallback((messageId: string, rating: "up" | "down") => {
    setFeedbackMap((prev) => {
      const next = { ...prev };
      if (prev[messageId] === rating) delete next[messageId];
      else next[messageId] = rating;
      return next;
    });

    const clearing = feedbackMap[messageId] === rating;
    const req = clearing
      ? fetch(`/api/messages/${messageId}/feedback`, { method: "DELETE" })
      : fetch(`/api/messages/${messageId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        });

    req
      .then((r) => {
        if (r.ok) return;
        // Roll back rather than showing a rating that was never stored.
        setFeedbackMap((prev) => {
          const next = { ...prev };
          if (clearing) next[messageId] = rating;
          else delete next[messageId];
          return next;
        });
        setNotice("Could not save that rating.");
      })
      .catch(() => setNotice("Could not save that rating."));
  }, [feedbackMap]);

  const handleEditMessage = useCallback(
    (messageIndex: number, newContent: string) => {
      setMessages((prev) => {
        const truncated = prev.slice(0, messageIndex + 1);
        truncated[messageIndex] = {
          ...truncated[messageIndex],
          parts: [{ type: "text" as const, text: newContent }],
        };
        return truncated;
      });
      regenerate();
    },
    [setMessages, regenerate]
  );

  const handleShare = useCallback(async () => {
    if (!currentConvId) return;
    try {
      const res = await fetch(`/api/conversations/${currentConvId}/share`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.share_token) throw new Error("share failed");
      setShareToken(data.share_token);
      await navigator.clipboard.writeText(
        `${window.location.origin}/shared/${data.share_token}`
      );
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setNotice("Could not create a share link.");
    }
  }, [currentConvId]);

  const handleUnshare = useCallback(async () => {
    if (!currentConvId) return;
    try {
      const res = await fetch(`/api/conversations/${currentConvId}/share`, { method: "DELETE" });
      if (!res.ok) throw new Error("unshare failed");
      setShareToken(null);
      setNotice("Share link revoked.");
    } catch {
      setNotice("Could not revoke the share link.");
    }
  }, [currentConvId]);

  const handleExportMarkdown = useCallback(() => {
    const convTitle = sessions.find((s) => s.id === currentConvId)?.title ?? "Conversation";
    downloadMarkdown(
      convTitle,
      messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content:
          m.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("") ?? "",
        model: m.role === "assistant" ? modelLabel : undefined,
      }))
    );
  }, [sessions, currentConvId, messages, modelLabel]);

  const handleSavePrompt = useCallback(
    async (content: string) => {
      const title = content.slice(0, 60).trim();
      if (!title) return;
      try {
        const res = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (!res.ok) throw new Error("save failed");
        loadPrompts();
        setNotice("Saved to your prompts.");
      } catch {
        setNotice("Could not save that prompt.");
      }
    },
    [loadPrompts]
  );

  const lastMsg = messages[messages.length - 1];
  const showThinkingDots = isWaiting && lastMsg?.role === "user";
  const hasThread = !!currentConvId && messages.length > 0;
  const errorInfo = error ? describeError(error) : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-border px-4 py-2">
        <Select value={companion} onValueChange={(v) => switchCompanion(v as CompanionId)}>
          <SelectTrigger className="h-7 w-auto gap-1.5 rounded-full border-brand/30 bg-brand/5 px-3 text-xs font-medium text-brand">
            <Bot className="h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableCompanions.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-sm">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showModelSelector && <ModelSelector value={model} onChange={setModel} plan={plan} />}

        <button
          onClick={() => setWebSearchEnabled((v) => !v)}
          disabled={!canWebSearch}
          title={
            canWebSearch
              ? "Let this agent search the web when it needs to"
              : "Web search is available on Pro and Enterprise"
          }
          className={`flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            webSearchEnabled && canWebSearch
              ? "border-brand bg-brand/10 text-brand"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-3 w-3" />
          Web search
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
              <BookOpen className="h-3 w-3" />
              Prompts
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Saved Prompts</p>
            {savedPrompts.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No saved prompts yet. Save one from any message you have sent.
              </p>
            ) : (
              <div className="max-h-60 space-y-0.5 overflow-y-auto">
                {savedPrompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSend(p.content)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <Sparkles className="h-3 w-3 shrink-0 text-brand" />
                    <span className="flex-1 truncate">{p.title}</span>
                    {p.is_shared && (
                      <Badge variant="secondary" className="text-[9px]">
                        shared
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Always rendered, disabled when unavailable - these used to pop into
            the toolbar mid-session and shift everything sideways. */}
        <div className="h-4 w-px bg-border" />
        <button
          onClick={shareToken ? handleUnshare : handleShare}
          disabled={!hasThread}
          className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          title={shareToken ? "Revoke share link" : "Share conversation"}
        >
          {shareCopied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Link copied</span>
            </>
          ) : (
            <>
              <Share2 className="h-3 w-3" />
              {shareToken ? "Unshare" : "Share"}
            </>
          )}
        </button>
        <button
          onClick={handleExportMarkdown}
          disabled={!hasThread}
          className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          title="Export as Markdown"
        >
          <Download className="h-3 w-3" />
          Export
        </button>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="chat-scroll-container absolute inset-0 overflow-y-auto"
        >
          <div ref={contentRef} className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 && !loadingThread && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center pt-24 text-center"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
                  {companion === "learning" ? (
                    <GraduationCap className="h-8 w-8 text-brand" />
                  ) : companion === "ld" ? (
                    <Users2 className="h-8 w-8 text-brand" />
                  ) : (
                    <LineChart className="h-8 w-8 text-brand" />
                  )}
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {AI_BRAND}
                </p>
                <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                  {activeCompanion.label}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {activeCompanion.description}
                </p>

                {availableCompanions.length > 1 && (
                  <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
                    {availableCompanions.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => switchCompanion(c.id)}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          c.id === companion
                            ? "border-brand/40 bg-brand/5"
                            : "border-border bg-card hover:border-brand/20 hover:bg-accent"
                        }`}
                      >
                        <p className="mb-1 text-sm font-semibold">{c.label}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {c.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-2">
                  {COMPANION_SUGGESTIONS[companion].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="rounded-xl border border-border bg-card px-4 py-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-brand/20 hover:bg-accent hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {loadingThread && (
              <div className="space-y-6 pt-4" aria-label="Loading conversation">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {messages.map((msg, idx) => {
                const isLastAssistant = msg.role === "assistant" && idx === messages.length - 1;
                return (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role as "user" | "assistant"}
                    parts={msg.parts as unknown[]}
                    model={msg.role === "assistant" ? modelLabel : undefined}
                    messageId={msg.id}
                    messageIndex={idx}
                    isStreaming={isLastAssistant && isStreaming}
                    isLastAssistant={isLastAssistant}
                    feedback={feedbackMap[msg.id] ?? null}
                    onRegenerate={isLastAssistant ? handleRegenerate : undefined}
                    onFeedback={msg.role === "assistant" ? handleFeedback : undefined}
                    onEdit={msg.role === "user" ? handleEditMessage : undefined}
                    onSavePrompt={msg.role === "user" ? handleSavePrompt : undefined}
                  />
                );
              })}

              {showThinkingDots && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-1 rounded-full bg-muted-foreground"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activeCompanion.label} is thinking…
                  </span>
                </motion.div>
              )}

              {/* The route returns real, actionable failures - out of credits,
                  budget reached, plan limits. None of them used to be shown. */}
              {errorInfo && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-foreground">{errorInfo.message}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          clearError?.();
                          regenerate();
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
                      >
                        <RotateCw className="h-3 w-3" />
                        Try again
                      </button>
                      {errorInfo.href && (
                        <Link
                          href={errorInfo.href}
                          className="text-xs font-medium text-brand hover:underline"
                        >
                          {errorInfo.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(notice || mutationError) && (
                <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="flex-1">{notice ?? mutationError}</span>
                  <button
                    onClick={() => {
                      setNotice(null);
                      clearMutationError();
                    }}
                    className="shrink-0 font-medium text-foreground hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onStop={stop}
        plan={plan}
        onReject={setNotice}
      />
    </div>
  );
}
