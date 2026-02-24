"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DataThresholdGateProps {
  currentCount: number;
  requiredCount: number;
  featureLabel: string;
  description: string;
  children: ReactNode;
  shareHref?: string;
  educationalCards?: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function DataThresholdGate({
  currentCount,
  requiredCount,
  featureLabel,
  description,
  children,
  shareHref = "/dashboard/links",
  educationalCards,
}: DataThresholdGateProps) {
  if (currentCount >= requiredCount) {
    return <>{children}</>;
  }

  const remaining = requiredCount - currentCount;
  const progress = requiredCount > 0 ? (currentCount / requiredCount) * 100 : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-2">
        <h1 className="mb-1">{featureLabel}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </motion.div>

      {/* Progress toward threshold */}
      <motion.div variants={item} className="mt-6">
        <Card className="border-brand/20 bg-brand/5">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                <BarChart3 className="h-4 w-4 text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Collecting data</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentCount === 0
                    ? `This feature needs at least ${requiredCount} assessment responses to generate meaningful insights.`
                    : `${currentCount} of ${requiredCount} responses collected. ${remaining} more needed to unlock this feature.`}
                </p>
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {currentCount} / {requiredCount} responses
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/dashboard/assessment">
                    <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
                      <BrainCircuit className="mr-1.5 h-3.5 w-3.5" />
                      Create Assessment
                    </Button>
                  </Link>
                  <Link href={shareHref}>
                    <Button size="sm" variant="outline">
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      Share with Team
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div variants={item} className="mt-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: BrainCircuit,
                  step: "Step 1",
                  title: "Create an assessment",
                  description: "Set up a readiness assessment in under a minute.",
                },
                {
                  icon: Users,
                  step: "Step 2",
                  title: "Get your team to respond",
                  description: `You need at least ${requiredCount} responses. More responses means better insights.`,
                },
                {
                  icon: BarChart3,
                  step: "Step 3",
                  title: "Unlock insights",
                  description: `Once you reach ${requiredCount} responses, ${featureLabel.toLowerCase()} will be ready.`,
                },
              ].map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  {i < 2 && (
                    <div className="absolute left-[calc(50%+28px)] top-5 hidden h-px w-[calc(100%-56px)] bg-border sm:block" />
                  )}
                  <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{s.step}</p>
                  <h3 className="mb-1 text-sm font-semibold">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Educational cards */}
      {educationalCards && educationalCards.length > 0 && (
        <motion.div variants={item} className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Why this matters</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {educationalCards.map((card) => (
              <Card key={card.title} className="border-border bg-card">
                <CardContent className="pt-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                    <card.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
