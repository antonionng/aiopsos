"use client";

import { useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import { StyledMarkdown } from "./markdown-renderer";
import { getMessageText } from "./utils";

const STARTER_QUESTIONS = [
  "What's the difference between generative and agentic AI in simple terms?",
  "How should a non-technical team start using AI tomorrow?",
  "What are the biggest risks of AI adoption and how do you manage them?",
  "Can you explain RAG and why it matters for enterprise AI?",
];

export function LiveQADemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/lunchandlearn",
        body: { mode: "qa" },
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });
  const isStreaming = status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleQuestion(question: string) {
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: question }],
    });
  }

  return (
    <div className="flex h-full flex-col px-6 py-4 md:px-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
          8
        </span>
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Open Discussion
        </span>
      </div>

      <h2 className="mb-1 text-3xl font-bold text-white md:text-4xl">
        Live Q&A with GPT-5.2
      </h2>
      <p className="mb-4 text-sm text-zinc-400">
        Ask anything about AI: terminology, strategy, implementation, or what we covered today
      </p>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5"
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-5">
              <div className="rounded-full border border-white/20 bg-white/5 p-4">
                <svg
                  className="h-8 w-8 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <p className="text-zinc-400">Ask the audience: what would you like to know?</p>
              <div className="grid w-full max-w-lg gap-2">
                {STARTER_QUESTIONS.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleQuestion(q)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-6 ${msg.role === "user" ? "flex justify-end" : ""}`}
            >
              {msg.role === "user" ? (
                <div className="max-w-md rounded-xl bg-white/10 px-4 py-2.5 text-sm text-zinc-200">
                  {getMessageText(msg)}
                </div>
              ) : (
                <div className="max-w-none">
                  <StyledMarkdown content={getMessageText(msg)} />
                  {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                    <span className="inline-block h-4 w-1 animate-pulse bg-white" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input") as HTMLInputElement;
              if (input.value.trim()) {
                handleQuestion(input.value.trim());
                input.value = "";
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about AI..."
              disabled={isStreaming}
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
