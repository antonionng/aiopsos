"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Waves, Building2, Route, Send, CheckCircle2 } from "lucide-react";
import type { WeatherData } from "@/lib/weather-api";
import type { FloodWarning } from "@/lib/flood-api";
import { LiveWeatherMap } from "./live-weather-map";
import { StyledMarkdown } from "./markdown-renderer";
import { getMessageText } from "./utils";

const PHASES = [
  { id: 1, label: "Weather Analysis", icon: <Cloud className="h-4 w-4" /> },
  { id: 2, label: "Flood Assessment", icon: <Waves className="h-4 w-4" /> },
  { id: 3, label: "Asset Risk", icon: <Building2 className="h-4 w-4" /> },
  { id: 4, label: "Response Plan", icon: <Route className="h-4 w-4" /> },
  { id: 5, label: "Communications", icon: <Send className="h-4 w-4" /> },
];

const SUGGESTED_GOALS = [
  "Plan flood response for the East Midlands region",
  "Assess and mitigate risk for insured properties in the Southwest",
  "Prepare emergency sensor deployment plan for active flood zones",
];

function parsePhases(text: string): { phase: number; content: string }[] {
  const parts = text.split(/(?=## PHASE \d)/g);
  return parts
    .filter((part) => /^## PHASE \d/.test(part))
    .map((part) => {
      const numMatch = part.match(/^## PHASE (\d)/);
      return { phase: numMatch ? parseInt(numMatch[1]) : 0, content: part.trim() };
    });
}

function phaseSummary(content: string): string {
  const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("##"));
  const first = lines[0]?.replace(/^[-*]\s*/, "").replace(/\*+/g, "").trim() ?? "";
  return first.length > 100 ? first.slice(0, 97) + "..." : first;
}

function MetricsBar({ currentPhase, warningCount }: { currentPhase: number; warningCount: number }) {
  const metrics = [
    { label: "Areas assessed", value: currentPhase >= 1 ? "9 cities" : "-", active: currentPhase >= 1 },
    { label: "Flood warnings", value: currentPhase >= 2 ? String(warningCount) : "-", active: currentPhase >= 2 },
    { label: "Assets at risk", value: currentPhase >= 3 ? "1,847" : "-", active: currentPhase >= 3 },
    { label: "Response time", value: currentPhase >= 4 ? "<45min" : "-", active: currentPhase >= 4 },
    { label: "Notifications", value: currentPhase >= 5 ? "Sent" : "-", active: currentPhase >= 5 },
  ];

  return (
    <div className="flex items-center gap-1">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: m.active ? 1 : 0.3, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-1 flex-col items-center rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5"
        >
          <span className={`text-xs font-bold ${m.active ? "text-white" : "text-zinc-600"}`}>
            {m.value}
          </span>
          <span className="text-[9px] text-zinc-500">{m.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function AgenticDemo() {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData> | null>(null);
  const [floods, setFloods] = useState<FloodWarning[]>([]);
  const [started, setStarted] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailState, setEmailState] = useState<"idle" | "sent" | "error">("idle");
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasShownModalRef = useRef(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/lunchandlearn",
        body: { mode: "agentic" },
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });
  const isStreaming = status === "streaming";

  const assistantText = messages
    .filter((m) => m.role === "assistant")
    .map((m) => getMessageText(m))
    .join("");

  const parsedPhases = parsePhases(assistantText);
  const currentPhase = parsedPhases.length;
  const phaseFiveContent = parsedPhases
    .find((p) => p.phase === 5)
    ?.content.replace(/^## PHASE \d.*$/m, "")
    .trim();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [assistantText]);

  useEffect(() => {
    if (
      !isStreaming &&
      currentPhase >= 5 &&
      emailState !== "sent" &&
      phaseFiveContent &&
      !hasShownModalRef.current
    ) {
      hasShownModalRef.current = true;
      setShowAgentModal(true);
      setShowReviewPanel(false);
    }
  }, [isStreaming, currentPhase, emailState, phaseFiveContent]);

  const fetchData = useCallback(async () => {
    setFetchingData(true);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch("/api/lunchandlearn/data?type=weather-all"),
        fetch("/api/lunchandlearn/data?type=floods"),
      ]);
      if (wRes.ok) {
        const wData = await wRes.json();
        setWeatherData(wData);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        setFloods(fData.warnings ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setFetchingData(false);
    }
  }, []);

  async function handleStart(goal: string) {
    await fetchData();
    setStarted(true);
    setEmailState("idle");
    hasShownModalRef.current = false;
    sendMessage({ role: "user", parts: [{ type: "text", text: goal }] });
  }

  async function handleSendEmail() {
    if (!phaseFiveContent || sendingEmail) return;
    setSendingEmail(true);
    setEmailState("idle");

    const dateLabel = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await fetch("/api/lunchandlearn/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `AIOPSOS Flood Response Update - ${dateLabel}`,
          content: phaseFiveContent,
        }),
      });

      setEmailState(res.ok ? "sent" : "error");
      if (res.ok) setShowAgentModal(false);
    } catch {
      setEmailState("error");
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div className="flex h-full flex-col px-6 py-4 md:px-10">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
          4
        </span>
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Agentic AI Systems
        </span>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-white md:text-3xl">
        Autonomous Flood Response Agent
      </h2>
      <p className="mb-2 text-sm text-zinc-400">
        Give GPT-5.2 a goal. Watch it plan, analyze live data, and execute autonomously across 5 phases.
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE DATA
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          Open-Meteo API - 9 UK cities
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          Environment Agency Flood Monitoring
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500">
          GPT-5.2 (OpenAI) - Autonomous Agent
        </span>
      </div>

      {!started ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 flex-col items-center justify-center gap-5"
        >
          <p className="text-zinc-400">Set a goal for the autonomous agent:</p>
          <div className="flex w-full max-w-xl flex-col gap-3">
            {SUGGESTED_GOALS.map((goal, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleStart(goal)}
                disabled={fetchingData}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-base text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/5"
              >
                {goal}
              </motion.button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input") as HTMLInputElement;
              if (input.value.trim()) handleStart(input.value.trim());
            }}
            className="flex w-full max-w-xl gap-2"
          >
            <input
              type="text"
              placeholder="Or type a custom goal..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={fetchingData}
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              {fetchingData ? "Loading..." : "Launch Agent"}
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden md:grid-cols-[1fr_340px]">
          {/* Left: Live map reacts to phases */}
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="flex-1 min-h-0">
              <LiveWeatherMap
                weatherData={weatherData}
                floods={floods}
                activePhase={currentPhase}
              />
            </div>
            {/* Bottom metrics bar */}
            <MetricsBar currentPhase={currentPhase} warningCount={floods.length} />
          </div>

          {/* Right: Compact phase cards */}
          <div ref={scrollRef} className="flex flex-col gap-2 overflow-y-auto pr-1">
            {PHASES.map((phase) => {
              const isComplete = currentPhase > phase.id;
              const isActive = currentPhase === phase.id && isStreaming;
              const isPending = currentPhase < phase.id;
              const parsed = parsedPhases.find((p) => p.phase === phase.id);
              const isExpanded = expandedPhase === phase.id;

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                  transition={{ delay: phase.id * 0.08 }}
                  className={`rounded-xl border transition-all ${
                    isActive
                      ? "border-white/30 bg-white/[0.05]"
                      : isComplete
                        ? "border-white/15 bg-white/[0.03]"
                        : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  {/* Phase header */}
                  <button
                    onClick={() => isComplete && setExpandedPhase(isExpanded ? null : phase.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                      isComplete ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        isActive ? "bg-white/15 text-white" : isComplete ? "bg-white/10 text-zinc-300" : "bg-white/5 text-zinc-600"
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : phase.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500">Phase {phase.id}</p>
                      <p className={`text-sm font-medium ${isPending ? "text-zinc-600" : "text-zinc-200"}`}>
                        {phase.label}
                      </p>
                    </div>
                    {isActive && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                    )}
                    {isComplete && (
                      <span className="text-[10px] text-zinc-500">{isExpanded ? "collapse" : "expand"}</span>
                    )}
                  </button>

                  {/* Summary line for completed phases */}
                  {isComplete && !isExpanded && parsed && (
                    <div className="border-t border-white/5 px-4 py-2">
                      <p className="text-xs text-zinc-400 line-clamp-2">{phaseSummary(parsed.content)}</p>
                    </div>
                  )}

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && parsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="max-h-48 overflow-y-auto px-4 py-3">
                          <StyledMarkdown content={parsed.content.replace(/^## PHASE \d.*$/m, "").trim()} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active phase streaming content */}
                  {isActive && parsed && (
                    <div className="max-h-40 overflow-y-auto border-t border-white/5 px-4 py-3">
                      <StyledMarkdown content={parsed.content.replace(/^## PHASE \d.*$/m, "").trim()} />
                      <span className="inline-block h-3 w-0.5 animate-pulse bg-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Completion state - compact when email sent */}
            {!isStreaming && currentPhase >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/20 bg-white/[0.04] p-4 text-center"
              >
                <p className="text-sm font-semibold text-white">Agent Complete</p>
                <p className="text-xs text-zinc-400">All 5 phases executed autonomously</p>
                {emailState === "sent" ? (
                  <p className="mt-2 text-xs font-medium text-green-400">Email sent to ag@experrt.com</p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">Phase 5 communications ready</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Agent completion modal - portalled to body to sit above Leaflet z-index */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showAgentModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: 10000 }}
                className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && setShowAgentModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mx-4 w-full max-w-md rounded-2xl border border-white/20 bg-[#141414] p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <Waves className="h-8 w-8 text-cyan-400" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-white">Flow</p>
                    <p className="mb-6 text-xs text-zinc-500">Autonomous flood response agent</p>
                    <p className="mb-6 text-base leading-relaxed text-zinc-300">
                      Hey Antonio, I have compiled the risk report. Do you want to review or should I send?
                    </p>
                    <div className="flex w-full gap-3">
                      <button
                        onClick={() => setShowReviewPanel(!showReviewPanel)}
                        className="flex-1 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5"
                      >
                        {showReviewPanel ? "Hide" : "Review"}
                      </button>
                      <button
                        onClick={handleSendEmail}
                        disabled={sendingEmail || !phaseFiveContent}
                        className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500 disabled:text-zinc-200"
                      >
                        {sendingEmail ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                  {showReviewPanel && phaseFiveContent && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4 text-left"
                    >
                      <StyledMarkdown content={phaseFiveContent} />
                    </motion.div>
                  )}
                  {emailState === "error" && (
                    <p className="mt-4 text-center text-xs text-red-400">
                      Could not send email. Check RESEND settings and retry.
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
