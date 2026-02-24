"use client";

import { useState } from "react";
import { Copy, Check, Linkedin, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATURITY_TIERS, DIMENSION_LABELS, type Dimension } from "@/lib/constants";
import type { DimensionScores } from "@/lib/types";

interface ScoreCardProps {
  name: string;
  orgName: string;
  orgLogo?: string | null;
  overallScore: number;
  dimensions: DimensionScores;
  shareUrl?: string;
}

function getTierLabel(score: number): string {
  const tier = MATURITY_TIERS.find((t) => score >= t.min && score <= t.max);
  return tier?.label ?? "Not Assessed";
}

function DimBar({ dim, score }: { dim: Dimension; score: number }) {
  const pct = Math.round((score / 5) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs text-muted-foreground">
        {DIMENSION_LABELS[dim]}
      </span>
      <div className="h-2 flex-1 rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs font-semibold">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export function ScoreCard({
  name,
  orgName,
  orgLogo,
  overallScore,
  dimensions,
  shareUrl,
}: ScoreCardProps) {
  const [copiedSlack, setCopiedSlack] = useState(false);
  const tierLabel = getTierLabel(overallScore);

  const scores = Object.entries(dimensions) as [Dimension, number][];
  const sorted = [...scores].sort((a, b) => b[1] - a[1]);
  const topStrength = sorted[0];
  const biggestOpp = sorted[sorted.length - 1];

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "";
  const finalShareUrl = shareUrl ?? baseUrl;

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalShareUrl)}`;
    window.open(url, "_blank", "width=600,height=600");
  }

  function copySlackMessage() {
    const msg = `I scored ${overallScore.toFixed(1)}/5 (${tierLabel}) on the AI Readiness Assessment at ${orgName}. My top dimension: ${DIMENSION_LABELS[topStrength[0]]} (${topStrength[1].toFixed(1)}). Take yours: ${finalShareUrl}`;
    navigator.clipboard.writeText(msg);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 2000);
  }

  function downloadCard() {
    const el = document.getElementById("score-card-capture");
    if (!el) return;
    import("html2canvas").then(({ default: html2canvas }) => {
      html2canvas(el, { backgroundColor: "#0d0d0d", scale: 2 }).then(
        (canvas) => {
          const link = document.createElement("a");
          link.download = "ai-readiness-score.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      );
    });
  }

  return (
    <div className="space-y-4">
      {/* The card */}
      <div
        id="score-card-capture"
        className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6"
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          {orgLogo ? (
            <img
              src={orgLogo}
              alt={orgName}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand">
              {orgName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{orgName}</p>
          </div>
        </div>

        {/* Score */}
        <div className="mb-6 text-center">
          <p className="text-5xl font-bold tracking-tighter">
            {overallScore.toFixed(1)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {tierLabel}
          </p>
        </div>

        {/* Dimensions */}
        <div className="space-y-2.5">
          {scores.map(([dim, score]) => (
            <DimBar key={dim} dim={dim} score={score} />
          ))}
        </div>

        {/* Highlights */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-500/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-green-500">
              Top Strength
            </p>
            <p className="mt-1 text-sm font-semibold">
              {DIMENSION_LABELS[topStrength[0]]}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {topStrength[1].toFixed(1)} / 5
            </p>
          </div>
          <div className="rounded-lg bg-amber-500/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-amber-500">
              Biggest Opportunity
            </p>
            <p className="mt-1 text-sm font-semibold">
              {DIMENSION_LABELS[biggestOpp[0]]}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {biggestOpp[1].toFixed(1)} / 5
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] text-muted-foreground/50">
          Powered by AIOPSOS
        </p>
      </div>

      {/* Share buttons */}
      <div className="mx-auto flex max-w-md justify-center gap-2">
        <Button variant="outline" size="sm" onClick={shareLinkedIn}>
          <Linkedin className="mr-1.5 h-3.5 w-3.5" />
          LinkedIn
        </Button>
        <Button variant="outline" size="sm" onClick={copySlackMessage}>
          {copiedSlack ? (
            <Check className="mr-1.5 h-3.5 w-3.5 text-brand" />
          ) : (
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          )}
          {copiedSlack ? "Copied!" : "Slack"}
        </Button>
        <Button variant="outline" size="sm" onClick={downloadCard}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Save PNG
        </Button>
      </div>
    </div>
  );
}
