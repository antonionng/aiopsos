"use client";

import { motion } from "framer-motion";
import { getTierForScore } from "@/lib/constants";

interface Props {
  score: number;
  maxScore?: number;
}

export function MaturityGauge({ score, maxScore = 5 }: Props) {
  const tier = getTierForScore(score);
  const percentage = (score / maxScore) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={tier.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100),
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>

      {/* Tier label */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: tier.color }}
          />
          Tier {tier.tier}: {tier.label}
        </div>
      </div>
    </div>
  );
}
