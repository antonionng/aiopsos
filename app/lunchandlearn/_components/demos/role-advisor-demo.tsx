"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { DEPARTMENT_INFO } from "./seeded-data";
import { DepartmentDashboard } from "./department-dashboard";
import { StyledMarkdown } from "./markdown-renderer";
import { getMessageText } from "./utils";
import {
  TrendingUp,
  PoundSterling,
  Megaphone,
  Code,
  Layout,
  Settings,
} from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  PoundSterling: <PoundSterling className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  Layout: <Layout className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

function parseRecommendations(text: string): { title: string; content: string }[] {
  const items: { title: string; content: string }[] = [];
  const blocks = text.split(/(?=\d+\.\s+\*\*)/);
  for (const block of blocks) {
    const match = block.match(/^\d+\.\s+\*\*(.+?)\*\*/);
    if (match) {
      items.push({
        title: match[1].trim(),
        content: block.replace(/^\d+\.\s+\*\*.*?\*\*\s*[-:]?\s*/, "").trim(),
      });
    }
  }
  if (items.length === 0 && text.trim()) {
    const h3Blocks = text.split(/(?=###\s)/);
    for (const block of h3Blocks) {
      const match = block.match(/^###\s+(.+?)$/m);
      if (match) {
        items.push({
          title: match[1].trim().replace(/^\d+\.\s*/, ""),
          content: block.replace(/^###\s+.+?$/m, "").trim(),
        });
      }
    }
  }
  return items;
}

function ComplexityBadge({ text }: { text: string }) {
  const lower = text.toLowerCase();
  let color = "bg-zinc-500/20 text-zinc-400";
  let label = "Medium";
  if (lower.includes("low")) { color = "bg-green-500/20 text-green-400"; label = "Low"; }
  else if (lower.includes("high")) { color = "bg-orange-500/20 text-orange-400"; label = "High"; }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>{label}</span>
  );
}

export function RoleAdvisorDemo() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [pendingDept, setPendingDept] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/lunchandlearn",
        body: { mode: "advisor", department: selectedDept },
      }),
    [selectedDept]
  );

  const { messages, sendMessage, status, setMessages } = useChat({ transport });
  const isStreaming = status === "streaming";

  const assistantText = messages
    .filter((m) => m.role === "assistant")
    .map((m) => getMessageText(m))
    .join("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [assistantText]);

  useEffect(() => {
    if (pendingDept && pendingDept === selectedDept) {
      const info = DEPARTMENT_INFO[pendingDept];
      sendMessage({
        role: "user",
        parts: [{
          type: "text",
          text: `Generate 5 specific AI applications for the ${info.label} team at a flood forecasting technology company. Use the live data and department-specific context to make recommendations immediately actionable.`,
        }],
      });
      setPendingDept(null);
    }
  }, [pendingDept, selectedDept, sendMessage]);

  function handleSelect(dept: string) {
    setMessages([]);
    setSelectedDept(dept);
    setPendingDept(dept);
  }

  const recommendations = parseRecommendations(assistantText);

  return (
    <div className="flex h-full flex-col px-6 py-4 md:px-10">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
          7
        </span>
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Application
        </span>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-white md:text-3xl">
        AI For Your Department
      </h2>
      <p className="mb-2 text-sm text-zinc-400">
        Select your team. See your live KPIs alongside tailored AI applications from GPT-5.2.
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE DATA
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          Open-Meteo + Environment Agency
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          Department-specific operational data
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          GPT-5.2 (OpenAI)
        </span>
      </div>

      {/* Department tab bar */}
      <div className="mb-3 flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {Object.entries(DEPARTMENT_INFO).map(([key, dept]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={isStreaming}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all ${
              selectedDept === key
                ? "bg-white/10 text-white"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            } ${isStreaming ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span style={{ color: selectedDept === key ? dept.color : undefined }}>
              {ICONS[dept.icon]}
            </span>
            <span className="hidden md:inline">{dept.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      {!selectedDept ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-zinc-500">Choose a department above to see KPIs and AI applications</p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden md:grid-cols-[280px_1fr]">
          {/* Left: Department dashboard */}
          <div className="overflow-y-auto">
            <DepartmentDashboard department={selectedDept} />
          </div>

          {/* Right: AI recommendations */}
          <div ref={scrollRef} className="overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {!assistantText ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full items-center justify-center gap-3 text-zinc-400"
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                  Analyzing {DEPARTMENT_INFO[selectedDept].label} data...
                </motion.div>
              ) : recommendations.length > 0 ? (
                <motion.div key={selectedDept} className="space-y-2">
                  {recommendations.map((rec, i) => {
                    const complexityMatch = rec.content.match(/complexity[:\s]*\**(low|medium|high)\**/i);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                        style={{ borderLeftWidth: 3, borderLeftColor: DEPARTMENT_INFO[selectedDept].color }}
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                          {complexityMatch && <ComplexityBadge text={complexityMatch[1]} />}
                        </div>
                        <StyledMarkdown content={rec.content} className="text-sm" />
                      </motion.div>
                    );
                  })}
                  {isStreaming && (
                    <span className="inline-block h-3 w-0.5 animate-pulse bg-white" />
                  )}
                </motion.div>
              ) : (
                <motion.div key="raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <StyledMarkdown content={assistantText} />
                  {isStreaming && <span className="inline-block h-3 w-0.5 animate-pulse bg-white" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
