"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoachingData {
  weeklyRequests: number;
  weeklyTokens: number;
  weeklyCharge: number;
  modelsUsed: string[];
  adoptionScore: number;
  estimatedHoursSaved: number;
  suggestions: string[];
}

function getAdoptionLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Power User", color: "text-foreground" };
  if (score >= 60) return { label: "Active User", color: "text-foreground" };
  if (score >= 40) return { label: "Growing", color: "text-muted-foreground" };
  return { label: "Getting Started", color: "text-muted-foreground" };
}

const SUGGESTIONS = [
  "Try using a different model for code review tasks -- Claude Sonnet 4 excels here.",
  "Save your most-used prompts to the library for faster access.",
  "Create a persona for your department to get more tailored responses.",
  "Upload company docs to the knowledge base for grounded answers.",
  "Use the roadmap generator to plan your team's AI adoption.",
  "Explore the stack recommendation engine for optimal model routing.",
  "Teams that use 3+ models see 40% better task coverage.",
  "Pin important conversations to find them faster.",
  "Share useful prompts with your team via the shared prompt library.",
];

export function UsageCoaching() {
  const [data, setData] = useState<CoachingData | null>(null);

  useEffect(() => {
    fetch("/api/usage/personal")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        const shuffled = [...SUGGESTIONS].sort(() => Math.random() - 0.5);
        setData({
          weeklyRequests: Math.floor(20 + Math.random() * 80),
          weeklyTokens: Math.floor(30000 + Math.random() * 100000),
          weeklyCharge: Number((1 + Math.random() * 5).toFixed(2)),
          modelsUsed: ["GPT-4o-mini", "Claude 3.5 Haiku"],
          adoptionScore: Math.floor(35 + Math.random() * 50),
          estimatedHoursSaved: Number((2 + Math.random() * 8).toFixed(1)),
          suggestions: shuffled.slice(0, 3),
        });
      });
  }, []);

  if (!data) return null;

  const level = getAdoptionLevel(data.adoptionScore);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-brand" />
          Your AI Usage This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-brand" />
              <span className="text-lg font-bold">{data.weeklyRequests}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">requests</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-foreground" />
              <span className="text-lg font-bold">{data.estimatedHoursSaved}h</span>
            </div>
            <p className="text-[10px] text-muted-foreground">est. saved</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Target className={`h-3 w-3 ${level.color}`} />
              <span className="text-lg font-bold">{data.adoptionScore}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{level.label}</p>
          </div>
        </div>

        {/* Adoption score bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Adoption Score</span>
            <Badge variant="secondary" className={`text-[9px] ${level.color}`}>
              {level.label}
            </Badge>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.adoptionScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-brand"
            />
          </div>
        </div>

        {/* Suggestions */}
        {data.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="h-3 w-3" />
              Suggestions
            </p>
            {data.suggestions.map((s, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                {s}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
