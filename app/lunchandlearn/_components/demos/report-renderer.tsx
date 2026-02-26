"use client";

import { motion } from "framer-motion";
import { FileText, CloudRain, AlertTriangle, Shield, ListChecks, BarChart3 } from "lucide-react";
import { StyledMarkdown } from "./markdown-renderer";
import type { ReactNode } from "react";

interface Section {
  title: string;
  content: string;
}

const SECTION_META: Record<string, { icon: ReactNode; accent: string }> = {
  "executive summary": {
    icon: <FileText className="h-4 w-4" />,
    accent: "border-l-white/30",
  },
  "current conditions": {
    icon: <CloudRain className="h-4 w-4" />,
    accent: "border-l-blue-400/50",
  },
  "active warnings": {
    icon: <AlertTriangle className="h-4 w-4" />,
    accent: "border-l-orange-400/50",
  },
  "risk assessment": {
    icon: <Shield className="h-4 w-4" />,
    accent: "border-l-red-400/50",
  },
  "recommended actions": {
    icon: <ListChecks className="h-4 w-4" />,
    accent: "border-l-green-400/50",
  },
};

function getSectionMeta(title: string): { icon: ReactNode; accent: string } {
  const lower = title.toLowerCase();
  for (const [key, meta] of Object.entries(SECTION_META)) {
    if (lower.includes(key)) return meta;
  }
  return {
    icon: <BarChart3 className="h-4 w-4" />,
    accent: "border-l-zinc-500/50",
  };
}

function parseSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const parts = markdown.split(/(?=^##\s)/m);

  for (const part of parts) {
    const headerMatch = part.match(/^##\s+(.+?)$/m);
    if (headerMatch) {
      sections.push({
        title: headerMatch[1].trim().replace(/^\*+|\*+$/g, ""),
        content: part.replace(/^##\s+.+?$/m, "").trim(),
      });
    } else if (part.trim() && sections.length === 0) {
      sections.push({ title: "Overview", content: part.trim() });
    }
  }

  return sections;
}

function RiskGauge({ warningCount }: { warningCount: number }) {
  const level = warningCount === 0 ? 0 : warningCount <= 3 ? 1 : warningCount <= 7 ? 2 : 3;
  const labels = ["Low", "Moderate", "High", "Critical"];
  const colors = ["#4ade80", "#facc15", "#f97316", "#ef4444"];
  const angle = (level / 3) * 180;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 100 55" className="w-24">
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke={colors[level]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 126} 126`}
        />
        <line
          x1="50"
          y1="50"
          x2={50 + 28 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
          y2={50 - 28 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="3" fill="white" />
      </svg>
      <span className="text-xs font-semibold" style={{ color: colors[level] }}>
        {labels[level]} Risk
      </span>
    </div>
  );
}

interface ReportRendererProps {
  content: string;
  isStreaming: boolean;
  warningCount: number;
}

export function ReportRenderer({ content, isStreaming, warningCount }: ReportRendererProps) {
  const sections = parseSections(content);

  if (!content && !isStreaming) return null;

  if (sections.length === 0 && content) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <StyledMarkdown content={content} />
        {isStreaming && <span className="inline-block h-4 w-1 animate-pulse bg-white" />}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Risk gauge header */}
      {sections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3"
        >
          <div>
            <h3 className="text-sm font-semibold text-white">AI Risk Briefing</h3>
            <p className="text-[10px] text-zinc-500">Generated live from Open-Meteo weather API + Environment Agency Flood Monitoring data</p>
          </div>
          <RiskGauge warningCount={warningCount} />
        </motion.div>
      )}

      {/* Section cards */}
      {sections.map((section, i) => {
        const meta = getSectionMeta(section.title);
        const isLast = i === sections.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-xl border border-white/10 border-l-2 bg-white/[0.02] p-5 ${meta.accent}`}
          >
            <div className="mb-3 flex items-center gap-2 text-zinc-400">
              {meta.icon}
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            </div>
            <StyledMarkdown content={section.content} />
            {isStreaming && isLast && (
              <span className="inline-block h-4 w-1 animate-pulse bg-white" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
