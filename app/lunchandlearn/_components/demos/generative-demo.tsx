"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import type { WeatherData } from "@/lib/weather-api";
import type { FloodWarning } from "@/lib/flood-api";
import { LiveWeatherMap } from "./live-weather-map";
import { ReportRenderer } from "./report-renderer";
import { getMessageText } from "./utils";

const SUGGESTED_PROMPTS = [
  "Generate an executive risk briefing for the Midlands region using the live data",
  "Summarize current flood risk for property insurers with actionable insights",
  "Create a stakeholder update email about today's flood conditions",
];

export function GenerativeDemo() {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData> | null>(null);
  const [floods, setFloods] = useState<FloodWarning[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/lunchandlearn",
        body: { mode: "generative" },
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });
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

  async function fetchLiveData() {
    setFetchingData(true);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch("/api/lunchandlearn/data?type=weather-all"),
        fetch("/api/lunchandlearn/data?type=floods"),
      ]);
      if (!wRes.ok || !fRes.ok) throw new Error("Failed to fetch");
      const wData = await wRes.json();
      const fData = await fRes.json();
      setWeatherData(wData);
      setFloods(fData.warnings ?? []);
      setDataLoaded(true);
    } catch {
      setWeatherData({
        loughborough: {
          temperature: 8, humidity: 89, precipitation: 2.1, rain: 1.8,
          windSpeed: 24, windDirection: 220, weatherCode: 63,
          hourlyForecast: { time: [], temperature: [], precipitationProbability: [], precipitation: [] },
        },
      });
      setFloods([]);
      setDataLoaded(true);
    } finally {
      setFetchingData(false);
    }
  }

  function handlePrompt(prompt: string) {
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] });
  }

  return (
    <div className="flex h-full flex-col px-6 py-4 md:px-10">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
          3
        </span>
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Generative AI Deep Dive
        </span>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-white md:text-3xl">
        Live Risk Briefing Generator
      </h2>
      <p className="mb-2 text-sm text-zinc-400">
        GPT-5.2 ingests real-time UK weather and flood data, then generates a structured executive briefing
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
          GPT-5.2 (OpenAI)
        </span>
      </div>

      {!dataLoaded ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchLiveData}
            disabled={fetchingData}
            className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg text-zinc-200 transition-colors hover:bg-white/10"
          >
            {fetchingData ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                Connecting to live APIs...
              </>
            ) : (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Fetch Live UK Data
              </>
            )}
          </motion.button>
          <p className="text-xs text-zinc-600">
            Pulls real-time data from Open-Meteo and Environment Agency APIs
          </p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden md:grid-cols-[1fr_420px]">
          {/* Left: Live weather map (full height) */}
          <div className="min-h-0">
            <LiveWeatherMap
              weatherData={weatherData}
              floods={floods}
              showTimeline
            />
          </div>

          {/* Right: AI output */}
          <div ref={scrollRef} className="overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col justify-center gap-4">
                <p className="text-sm text-zinc-500">
                  Data loaded. Select a prompt to generate a briefing.
                </p>
                <div className="flex w-full flex-col gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handlePrompt(prompt)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
                    if (input.value.trim()) {
                      handlePrompt(input.value.trim());
                      input.value = "";
                    }
                  }}
                  className="flex w-full gap-2"
                >
                  <input
                    type="text"
                    placeholder="Or type a custom prompt..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
                  >
                    Generate
                  </button>
                </form>
              </div>
            ) : (
              <ReportRenderer
                content={assistantText}
                isStreaming={isStreaming}
                warningCount={floods.length}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
