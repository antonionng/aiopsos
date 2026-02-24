"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  MessageSquare,
  Mic,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Layers,
    title: "Every leading AI model",
    description: "GPT-5.2, Claude Opus, Gemini, Mistral and more -- switch models mid-conversation to get the best answer.",
  },
  {
    icon: Globe,
    title: "Live web search",
    description: "Ground responses in real-time information from the web. No more outdated answers.",
  },
  {
    icon: ImageIcon,
    title: "Image generation",
    description: "Create visuals, diagrams, and assets directly in your conversations.",
  },
  {
    icon: Mic,
    title: "Voice input & output",
    description: "Speak naturally and hear responses read back. Perfect for hands-free workflows.",
  },
  {
    icon: Search,
    title: "Deep research",
    description: "Let AI conduct multi-step research across the web and synthesise comprehensive reports.",
  },
  {
    icon: FileText,
    title: "Company knowledge",
    description: "Upload documents so every response is grounded in your organisation's specific context.",
  },
];

const MODEL_PROVIDERS = [
  { name: "OpenAI", models: "GPT-5.2, GPT-4o, o3-mini" },
  { name: "Anthropic", models: "Claude Opus, Sonnet, Haiku" },
  { name: "Google", models: "Gemini 2.0 Flash, 1.5 Pro" },
  { name: "Mistral", models: "Large, Small" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ChatMarketingGate() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Hero */}
          <motion.div variants={item} className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
              <MessageSquare className="h-8 w-8 text-brand" />
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">
              One platform. Every leading AI model.
            </h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
              Stop switching between ChatGPT, Claude, and Gemini. Access all the world&apos;s best AI models
              in a single workspace, grounded in your company&apos;s knowledge.
            </p>
          </motion.div>

          {/* Model providers */}
          <motion.div variants={item} className="mb-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MODEL_PROVIDERS.map((provider) => (
                <div
                  key={provider.name}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <p className="text-sm font-semibold">{provider.name}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{provider.models}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features grid */}
          <motion.div variants={item} className="mb-10">
            <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Everything you need in one place
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="border-border bg-card">
                  <CardContent className="pt-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                      <feature.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Blurred preview */}
          <motion.div variants={item} className="mb-10">
            <div className="relative overflow-hidden rounded-xl border border-border">
              <div className="pointer-events-none select-none blur-[3px]">
                <div className="bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                      <Bot className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <Badge variant="secondary" className="text-xs">GPT-4o</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm text-muted-foreground">How should we approach AI adoption across our engineering and sales teams?</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-sm text-muted-foreground">Based on your company knowledge base, I'd recommend a phased approach. For engineering, start with code review and documentation tools like GitHub Copilot. For sales, focus on...</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted p-2 text-center text-xs text-muted-foreground">Summarise our AI policy</div>
                      <div className="rounded-lg bg-muted p-2 text-center text-xs text-muted-foreground">Draft a business case</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
                <Sparkles className="mb-3 h-8 w-8 text-brand" />
                <p className="text-sm font-semibold">Your AI workspace awaits</p>
                <p className="mt-1 text-xs text-muted-foreground">Upgrade to Pro to start chatting</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="text-center">
            <Link href="/dashboard/billing">
              <Button size="lg" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                <Zap className="h-4 w-4" />
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              Or ask your admin to upgrade your organisation&apos;s plan.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
