"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface ActivitySlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  description: string;
  prompt: string;
  duration: number;
  tips?: string[];
  tipsHeading?: string;
}

export function ActivitySlide({
  section,
  sectionNumber,
  title,
  description,
  prompt,
  duration,
  tips,
  tipsHeading,
}: ActivitySlideProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
  }, [duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex h-full flex-col items-center justify-center px-12 text-center md:px-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-2 flex items-center gap-3"
      >
        {sectionNumber !== undefined && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
            {sectionNumber}
          </span>
        )}
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          {section}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 max-w-2xl text-lg text-zinc-400"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 max-w-xl rounded-xl border border-white/20 bg-white/5 p-6"
      >
        <p className="text-xl font-medium text-zinc-200">&ldquo;{prompt}&rdquo;</p>
      </motion.div>

      {tips && tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8 max-w-2xl rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            {tipsHeading || "Tips"}
          </p>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={timeLeft <= 30 ? "#ef4444" : "#10b981"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={339.3}
              strokeDashoffset={339.3 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <span
            className={`text-3xl font-mono font-bold ${timeLeft <= 30 ? "text-red-400" : "text-white"}`}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            {isRunning ? "Pause" : timeLeft < duration ? "Resume" : "Start Timer"}
          </button>
          {timeLeft < duration && (
            <button
              onClick={reset}
              className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5"
            >
              Reset
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
