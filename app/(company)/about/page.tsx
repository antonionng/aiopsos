"use client";

import { motion } from "framer-motion";
import { Target, Users, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const VALUES = [
  {
    icon: Target,
    title: "Structured adoption",
    description:
      "AI without strategy is just noise. We help organisations move from scattered tool access to measurable, workflow-embedded impact.",
  },
  {
    icon: Users,
    title: "Equitable access",
    description:
      "Every organisation deserves the tools and strategy to benefit from AI, regardless of size, budget, or technical maturity.",
  },
  {
    icon: Sparkles,
    title: "Practical impact",
    description:
      "We focus on real outcomes — cycle-time compression, decision quality, and capability uplift — not hype or theoretical possibilities.",
  },
];

export default function AboutPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} className="mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          About AIOPSOS
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          We believe AI adoption shouldn't be ad-hoc or exclusive. AIOPSOS
          exists to give every organisation — from startups to enterprises — the
          structure to move from AI access to AI impact.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section variants={fadeUp} custom={1} className="mb-20">
        <h2 className="mb-6 text-2xl font-semibold tracking-[-0.02em]">
          Our mission
        </h2>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="text-lg leading-relaxed text-foreground">
            To democratise structured AI adoption by providing the assessment
            tools, multi-model interfaces, and strategic roadmaps that turn
            fragmented experimentation into measurable organisational
            capability.
          </p>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section variants={fadeUp} custom={2} className="mb-20">
        <h2 className="mb-8 text-2xl font-semibold tracking-[-0.02em]">
          What we believe
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <value.icon className="mb-4 h-6 w-6 text-foreground" />
              <h3 className="mb-2 text-base font-semibold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Founder */}
      <motion.section variants={fadeUp} custom={3}>
        <h2 className="mb-8 text-2xl font-semibold tracking-[-0.02em]">
          Leadership
        </h2>
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
              AG
            </div>
            <div>
              <h3 className="mb-1 text-xl font-semibold">Antonio Giugno</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Founder & AI Architect
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Antonio is a leading AI architect and trainer with deep
                experience helping organisations navigate the shift from
                experimental AI use to strategic, embedded adoption. His work
                spans enterprise AI strategy, multi-model orchestration, and
                building the frameworks that turn AI potential into measurable
                business outcomes.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Antonio founded AIOPSOS with a core conviction: that equitable
                AI access is essential. Every organisation — regardless of scale
                or resources — should have the tools and structure to benefit
                from what AI can deliver.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
