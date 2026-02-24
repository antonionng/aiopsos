"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  FileIcon,
  Volume2,
  Loader2,
  Square,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatAttachment } from "@/components/chat/chat-input";

interface Props {
  role: "user" | "assistant";
  content: string;
  model?: string;
  messageId?: string;
  isStreaming?: boolean;
  isLastAssistant?: boolean;
  attachments?: ChatAttachment[];
  feedback?: "up" | "down" | null;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, rating: "up" | "down") => void;
  onEdit?: (messageIndex: number, newContent: string) => void;
  messageIndex?: number;
}

export const MessageBubble = memo(function MessageBubble({
  role,
  content,
  model,
  messageId,
  isStreaming,
  isLastAssistant,
  attachments,
  feedback,
  onRegenerate,
  onFeedback,
  onEdit,
  messageIndex,
}: Props) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [ttsState, setTtsState] = useState<"idle" | "loading" | "playing">("idle");
  const ttsAudioRef = React.useRef<HTMLAudioElement | null>(null);

  function handleTts() {
    if (ttsState === "playing") {
      ttsAudioRef.current?.pause();
      if (ttsAudioRef.current) ttsAudioRef.current.currentTime = 0;
      setTtsState("idle");
      return;
    }

    setTtsState("loading");
    fetch("/api/voice/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("TTS failed");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        ttsAudioRef.current = audio;
        audio.onended = () => {
          setTtsState("idle");
          URL.revokeObjectURL(url);
        };
        audio.play();
        setTtsState("playing");
      })
      .catch(() => setTtsState("idle"));
  }

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveEdit() {
    if (onEdit && messageIndex !== undefined) {
      onEdit(messageIndex, editValue);
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditValue(content);
    setIsEditing(false);
  }

  const isImage = (type: string) => type.startsWith("image/");

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="group flex justify-end"
      >
        <div className="max-w-[75%]">
          {/* Attachment thumbnails */}
          {attachments && attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap justify-end gap-2">
              {attachments.map((att) =>
                isImage(att.file_type) ? (
                  <img
                    key={att.id}
                    src={att.url}
                    alt={att.filename}
                    className="h-20 w-20 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground"
                  >
                    <FileIcon className="h-3.5 w-3.5" />
                    <span className="max-w-[100px] truncate">{att.filename}</span>
                  </div>
                )
              )}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full min-h-[60px] rounded-xl border border-border bg-surface px-4 py-2.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  Save & Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="rounded-2xl rounded-br-md bg-brand/10 px-4 py-2.5 text-sm leading-relaxed text-foreground">
                {content}
              </div>
              {onEdit && messageIndex !== undefined && (
                <button
                  onClick={() => {
                    setEditValue(content);
                    setIsEditing(true);
                  }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
                  title="Edit message"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="group"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Bot className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          {model && (
            <div className="mb-1.5 flex items-center gap-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                {model}
              </p>
              {isStreaming && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
              )}
            </div>
          )}
          <div className="prose-chat text-sm leading-relaxed text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                h1: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h4 className="mb-2 mt-4 text-sm font-semibold first:mt-0">
                    {children}
                  </h4>
                ),
                h3: ({ children }) => (
                  <h5 className="mb-2 mt-3 text-sm font-semibold first:mt-0">
                    {children}
                  </h5>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 space-y-1.5 last:mb-0 [&>li]:flex [&>li]:gap-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0 marker:text-brand/60 marker:font-medium">
                    {children}
                  </ol>
                ),
                li: ({ children }) => {
                  return (
                    <li className="text-sm leading-relaxed">
                      {children}
                    </li>
                  );
                },
                code: ({ className, children }) => {
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    const lang = className?.replace("language-", "") || "";
                    return (
                      <div className="group/code relative my-3 overflow-hidden rounded-lg border border-border">
                        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {lang || "code"}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                String(children).replace(/\n$/, "")
                              );
                            }}
                            className="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
                          <code className="font-mono text-foreground/90">
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground/90">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                  <blockquote className="my-3 border-l-2 border-brand/30 pl-3 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand underline underline-offset-2 hover:text-brand/80"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="my-3 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-border bg-muted/50">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-sm">{children}</td>
                ),
                hr: () => <hr className="my-4 border-border" />,
              }}
            >
              {content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="streaming-cursor ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] rounded-full bg-brand" />
            )}
          </div>

          {/* Action bar */}
          {!isStreaming && (
            <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>

              <button
                onClick={handleTts}
                className={`flex h-7 items-center gap-1 rounded-md px-2 text-[11px] transition-colors ${
                  ttsState === "playing"
                    ? "text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={ttsState === "playing" ? "Stop playback" : "Listen"}
              >
                {ttsState === "loading" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : ttsState === "playing" ? (
                  <Square className="h-3 w-3" />
                ) : (
                  <Volume2 className="h-3 w-3" />
                )}
              </button>

              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="Regenerate response"
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </button>
              )}

              {messageId && onFeedback && (
                <>
                  <button
                    onClick={() => onFeedback(messageId, "up")}
                    className={`flex h-7 items-center justify-center rounded-md px-1.5 transition-colors ${
                      feedback === "up"
                        ? "text-green-500"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className={`h-3 w-3 ${feedback === "up" ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => onFeedback(messageId, "down")}
                    className={`flex h-7 items-center justify-center rounded-md px-1.5 transition-colors ${
                      feedback === "down"
                        ? "text-red-500"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    title="Bad response"
                  >
                    <ThumbsDown className={`h-3 w-3 ${feedback === "down" ? "fill-current" : ""}`} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
