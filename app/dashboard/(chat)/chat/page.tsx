"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  BookOpen,
  FileText,
  Bot,
  Sparkles,
  ArrowDown,
  Share2,
  Download,
  Check,
  Globe,
} from "lucide-react";
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
import { ChatInput, type ChatAttachment } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import { MODEL_REGISTRY } from "@/lib/model-router";
import { useChatContext } from "@/components/chat/chat-context";
import { downloadMarkdown } from "@/lib/export-conversation";
import { createClient } from "@/lib/supabase/client";
import { ChatMarketingGate } from "@/components/chat/chat-marketing-gate";

interface Persona {
  id: string;
  name: string;
  system_prompt: string;
  icon: string;
  department_type: string | null;
}

interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  is_shared: boolean;
}

const SCROLL_THRESHOLD = 80;

export default function ChatPage() {
  const {
    activeSession: conversationId,
    activeProjectFilter,
    onConversationCreated,
    updateSessionTitle,
    sessions,
  } = useChatContext();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [model, setModel] = useState("gpt-4o-mini");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [useKnowledge, setUseKnowledge] = useState(false);
  const [pendingConvId, setPendingConvId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("basic");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [pendingSearchResults, setPendingSearchResults] = useState<Array<{ title: string; url: string; content: string }> | null>(null);
  const titleGeneratedRef = useRef(false);
  const convIdRef = useRef<string | null>(null);

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      setUserRole(profile?.role ?? "user");
    }
    checkRole();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const activePersona = personas.find((p) => p.id === selectedPersona);

  const currentConvId = conversationId ?? pendingConvId;

  useEffect(() => {
    convIdRef.current = currentConvId ?? null;
  }, [currentConvId]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          model,
          persona: activePersona?.system_prompt ?? undefined,
          conversation_id: currentConvId ?? undefined,
          web_search_results: pendingSearchResults ?? undefined,
        },
      }),
    [model, activePersona?.system_prompt, currentConvId, pendingSearchResults]
  );

  const chat = useChat({
    transport,
  });
  const { messages, sendMessage, status, setMessages, stop } = chat;
  const reload = (chat as unknown as { reload?: (query?: string) => void }).reload;

  const isLoading = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted";
  const prevStatusRef = useRef(status);

  useEffect(() => {
    const wasStreaming = prevStatusRef.current === "streaming";
    const nowReady = status === "ready";
    prevStatusRef.current = status;

    if (
      wasStreaming &&
      nowReady &&
      currentConvId &&
      !titleGeneratedRef.current &&
      messages.length >= 2
    ) {
      titleGeneratedRef.current = true;
      const convId = currentConvId;
      setTimeout(() => {
        fetch(`/api/conversations/${convId}/title`, { method: "POST" })
          .then((r) => r.json())
          .then((d) => {
            if (d.title) {
              updateSessionTitle(convId, d.title);
            }
          })
          .catch((err) => console.error("Title generation failed:", err));
      }, 2000);
    }
  }, [status, currentConvId, messages.length, updateSessionTitle]);

  useEffect(() => {
    titleGeneratedRef.current = false;
    setPendingConvId(null);
    setFeedbackMap({});
    setShareToken(null);

    if (!conversationId) {
      setMessages([]);
      return;
    }

    fetch(`/api/conversations/${conversationId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.messages && Array.isArray(d.messages)) {
          const uiMessages = d.messages.map(
            (m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: "text" as const, text: m.content }],
            })
          );
          setMessages(uiMessages);

          if (d.messages.length >= 2) {
            titleGeneratedRef.current = true;
          }
        }
      })
      .catch(() => {});
  }, [conversationId, setMessages]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    isAtBottomRef.current = true;
    setShowScrollButton(false);
  }, []);

  const loadPersonas = useCallback(() => {
    fetch("/api/personas")
      .then((r) => r.json())
      .then((d) => setPersonas(d.personas ?? []))
      .catch(() => {});
  }, []);

  const loadPrompts = useCallback(() => {
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => setSavedPrompts(d.prompts ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadPersonas();
    loadPrompts();
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.plan) setUserPlan(d.plan);
      })
      .catch(() => {});
  }, [loadPersonas, loadPrompts]);

  const modelLabel = MODEL_REGISTRY[model]?.label ?? model;

  async function ensureConversation(): Promise<string | null> {
    if (currentConvId) return currentConvId;

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          project_id: activeProjectFilter ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.conversation) {
        const conv = data.conversation;
        convIdRef.current = conv.id;
        flushSync(() => {
          setPendingConvId(conv.id);
          onConversationCreated({
            id: conv.id,
            title: conv.title,
            model: conv.model,
            timestamp: new Date(conv.created_at),
            pinned: false,
            project_id: conv.project_id ?? null,
          });
        });
        return conv.id;
      }
    } catch {
      // continue without persistence
    }
    return null;
  }

  async function handleSend(content: string, attachments?: ChatAttachment[]) {
    scrollToBottom();

    const convId = await ensureConversation();

    if (attachments && attachments.length > 0 && convId) {
      for (const att of attachments) {
        const formData = new FormData();
        formData.append("file", att.file);
        formData.append("conversation_id", convId);
        try {
          const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.url) att.url = data.url;
        } catch {
          // continue even if upload fails
        }
      }
    }

    if (webSearchEnabled && content) {
      try {
        const searchRes = await fetch("/api/chat/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: content }),
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          setPendingSearchResults(searchData.results ?? []);
          await new Promise((r) => setTimeout(r, 50));
        }
      } catch {
        // proceed without search
      }
    }

    sendMessage({ text: content });

    // Clear search results after sending
    if (pendingSearchResults) {
      setTimeout(() => setPendingSearchResults(null), 100);
    }
  }

  function handleWebSearchToggle() {
    setWebSearchEnabled((prev) => !prev);
  }

  async function handleImageGen(prompt: string) {
    if (!prompt) {
      const userPrompt = window.prompt("Describe the image you want to create:");
      if (!userPrompt) return;
      prompt = userPrompt;
    }

    scrollToBottom();
    await ensureConversation();

    setMessages((prev) => [
      ...prev,
      {
        id: `img-req-${Date.now()}`,
        role: "user" as const,
        parts: [{ type: "text" as const, text: `Create an image: ${prompt}` }],
      },
      {
        id: `img-gen-${Date.now()}`,
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: "Generating image..." }],
      },
    ]);

    try {
      const res = await fetch("/api/chat/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            parts: [{ type: "text" as const, text: `Image generation failed: ${err.error}` }],
          };
          return updated;
        });
        return;
      }

      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          parts: [
            {
              type: "text" as const,
              text: `![Generated Image](${data.url})\n\n*${data.revised_prompt || prompt}*`,
            },
          ],
        };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          parts: [{ type: "text" as const, text: "Image generation failed. Please try again." }],
        };
        return updated;
      });
    }
  }

  async function handleDeepResearch(query: string) {
    if (!query) {
      const userQuery = window.prompt("What would you like to research in depth?");
      if (!userQuery) return;
      query = userQuery;
    }

    scrollToBottom();
    const convId = await ensureConversation();

    setMessages((prev) => [
      ...prev,
      {
        id: `research-req-${Date.now()}`,
        role: "user" as const,
        parts: [{ type: "text" as const, text: `Deep research: ${query}` }],
      },
      {
        id: `research-gen-${Date.now()}`,
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: "Starting deep research..." }],
      },
    ]);

    try {
      const res = await fetch("/api/chat/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, conversation_id: convId }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            parts: [{ type: "text" as const, text: `Research failed: ${err.error}` }],
          };
          return updated;
        });
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "progress") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    parts: [{ type: "text" as const, text: `*${parsed.message}*` }],
                  };
                  return updated;
                });
              } else if (parsed.type === "result") {
                fullText = parsed.report;
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }

      if (fullText) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            parts: [{ type: "text" as const, text: fullText }],
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          parts: [{ type: "text" as const, text: "Deep research failed. Please try again." }],
        };
        return updated;
      });
    }
  }

  function handleRegenerate() {
    reload?.();
  }

  function handleFeedback(messageId: string, rating: "up" | "down") {
    const current = feedbackMap[messageId];
    if (current === rating) {
      setFeedbackMap((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      fetch(`/api/messages/${messageId}/feedback`, { method: "DELETE" }).catch(() => {});
    } else {
      setFeedbackMap((prev) => ({ ...prev, [messageId]: rating }));
      fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      }).catch(() => {});
    }
  }

  function handleEditMessage(messageIndex: number, newContent: string) {
    setMessages((prev) => {
      const truncated = prev.slice(0, messageIndex + 1);
      const edited = { ...truncated[messageIndex] };
      edited.parts = [{ type: "text" as const, text: newContent }];
      truncated[messageIndex] = edited;
      return truncated;
    });
    setTimeout(() => reload?.(), 50);
  }

  async function handleShare() {
    if (!currentConvId) return;
    try {
      const res = await fetch(`/api/conversations/${currentConvId}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.share_token) {
        setShareToken(data.share_token);
        const url = `${window.location.origin}/shared/${data.share_token}`;
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      // silently fail
    }
  }

  function handleExportMarkdown() {
    const convTitle =
      sessions.find((s) => s.id === currentConvId)?.title ?? "Conversation";
    const exportMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content:
        m.parts
          ?.filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .map((p) => p.text)
          .join("") ?? "",
      model: m.role === "assistant" ? modelLabel : undefined,
    }));
    downloadMarkdown(convTitle, exportMessages);
  }

  const lastMsg = messages[messages.length - 1];
  const showThinkingDots = isWaiting && lastMsg?.role === "user";

  if (userRole === null) {
    return null;
  }

  if (userRole !== "super_admin") {
    return <ChatMarketingGate />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-center gap-3 border-b border-border py-2 px-4">
        <ModelSelector value={model} onChange={setModel} />

        {personas.length > 0 && (
          <Select value={selectedPersona} onValueChange={setSelectedPersona}>
            <SelectTrigger className="h-7 w-auto gap-1.5 rounded-full border-border bg-surface px-3 text-xs font-medium">
              <Bot className="h-3 w-3" />
              <SelectValue placeholder="No persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No persona</SelectItem>
              {personas.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-sm">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <button
          onClick={() => setUseKnowledge(!useKnowledge)}
          className={`flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
            useKnowledge
              ? "border-brand bg-brand/10 text-brand"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3 w-3" />
          Company docs
        </button>

        <button
          onClick={handleWebSearchToggle}
          className={`flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
            webSearchEnabled
              ? "border-brand bg-brand/10 text-brand"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-3 w-3" />
          Search
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground hover:text-foreground">
              <BookOpen className="h-3 w-3" />
              Prompts
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Saved Prompts
            </p>
            {savedPrompts.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No saved prompts yet. Save a prompt from chat to reuse it.
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

        {currentConvId && messages.length > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={handleShare}
              className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              title="Share conversation"
            >
              {shareCopied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Link copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3" />
                  Share
                </>
              )}
            </button>
            <button
              onClick={handleExportMarkdown}
              className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              title="Export as Markdown"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="chat-scroll-container absolute inset-0 overflow-y-auto scroll-smooth"
        >
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center pt-24 text-center"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
                  <MessageSquare className="h-8 w-8 text-brand" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                  How can I help you today?
                </h2>
                <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                  Ask anything about your work, projects, or data.
                  {activePersona
                    ? ` Using ${activePersona.name} persona.`
                    : ""}
                </p>
                {useKnowledge && (
                  <Badge variant="secondary" className="mt-3 text-xs">
                    <FileText className="mr-1 h-3 w-3" />
                    Company docs enabled
                  </Badge>
                )}

                <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-2">
                  {[
                    "Summarise our AI readiness scores",
                    "Draft a project status update",
                    "What models should our team use?",
                    "Help me write a business case for AI",
                  ].map((suggestion) => (
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

            <div className="space-y-6">
              {messages.map((msg, idx) => {
                const isLastAssistant =
                  msg.role === "assistant" && idx === messages.length - 1;

                return (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role as "user" | "assistant"}
                    content={
                      msg.parts
                        ?.filter(
                          (p): p is { type: "text"; text: string } =>
                            p.type === "text"
                        )
                        .map((p) => p.text)
                        .join("") ?? ""
                    }
                    model={msg.role === "assistant" ? modelLabel : undefined}
                    messageId={msg.id}
                    messageIndex={idx}
                    isStreaming={isLastAssistant && isStreaming}
                    isLastAssistant={isLastAssistant}
                    feedback={feedbackMap[msg.id] ?? null}
                    onRegenerate={isLastAssistant ? handleRegenerate : undefined}
                    onFeedback={msg.role === "assistant" ? handleFeedback : undefined}
                    onEdit={msg.role === "user" ? handleEditMessage : undefined}
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activePersona?.name ?? modelLabel} is thinking…
                  </span>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-px" />
          </div>
        </div>

        {/* Scroll-to-bottom FAB */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onStop={stop}
        plan={userPlan}
        onWebSearch={handleWebSearchToggle}
        onImageGen={handleImageGen}
        onDeepResearch={handleDeepResearch}
      />
    </div>
  );
}
