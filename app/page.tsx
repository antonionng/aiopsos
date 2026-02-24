"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, Sparkles, Users } from "lucide-react";
import {
  SUBSCRIPTION_PLANS,
  PLAN_FEATURES,
  PLAN_MODELS,
  FEATURE_QUOTAS,
  FEATURE_LABELS,
  FEATURE_UNITS,
  type PlanType,
} from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const CAPABILITIES = [
  {
    title: "Assess AI maturity",
    description:
      "Understand where each department sits across five layers of AI readiness, from basic access through to strategic leverage. No guesswork, just data.",
  },
  {
    title: "Embed AI into workflows",
    description:
      "Route the right model to every team with shared standards, prompt libraries, and defined use cases. Move beyond ad-hoc prompting to structured adoption.",
  },
  {
    title: "Measure real impact",
    description:
      "See adoption rates, workflow penetration, and cycle-time compression in one place. Understand what your AI investment is actually delivering.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "Share a 5-minute assessment across your organisation. Instantly see where each department sits on the AI maturity curve.",
  },
  {
    number: "02",
    title: "Activate",
    description:
      "Get a tailored 90-day adoption roadmap with defined use cases, workflow integration targets, and model recommendations for every team.",
  },
  {
    number: "03",
    title: "Measure",
    description:
      "See adoption rates, workflow penetration, and efficiency gains. Review progress at Day 90 and decide whether to expand, refine, or recalibrate.",
  },
];

const MODELS = [
  { name: "GPT-5.3", provider: "OpenAI" },
  { name: "Claude Opus 4.6", provider: "Anthropic" },
  { name: "GPT-4o", provider: "OpenAI" },
  { name: "Claude Sonnet 4", provider: "Anthropic" },
  { name: "Gemini 2.0 Flash", provider: "Google" },
  { name: "Mistral Large", provider: "Mistral" },
  { name: "o3-mini", provider: "OpenAI" },
  { name: "Claude 3.5 Haiku", provider: "Anthropic" },
];

const TRUST = [
  "Enterprise-grade governance",
  "Multi-model routing under one interface",
  "Automated PII detection and guardrails",
  "Compliance-ready logging",
  "Department-level cost visibility",
  "Role-based access policies",
  "Prompt injection protection",
  "SSO-ready authentication",
];

const FOOTER_LINKS = {
  Product: [
    { label: "Assessment", href: "/dashboard/assessment" },
    { label: "Recommendations", href: "/dashboard/recommend" },
    { label: "Roadmap", href: "/dashboard/roadmap" },
    { label: "AI Interface", href: "/dashboard/chat" },
    { label: "Analytics", href: "/dashboard/analytics" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="AIOPSOS" width={120} height={48} className="h-10 w-auto" unoptimized />
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <a href="#capabilities" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Product
              </a>
              <a href="#enterprise" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Enterprise
              </a>
              <a href="#models" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Models
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fadeUp} custom={0} className="mb-8 flex justify-center">
            <Image src="/logo.png" alt="AIOPSOS" width={200} height={200} className="h-24 w-auto" unoptimized />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-6 text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-[4.5rem]"
          >
            From AI access
            <br />
            to AI impact.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Most organisations have AI tools. Few have a strategy. AIOPSOS helps
            you assess maturity, embed AI into real workflows, and measure
            efficiency gains across every department.
          </motion.p>

          <motion.div variants={fadeUp} custom={3}>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-16 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              How structured AI adoption works
            </motion.h2>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {CAPABILITIES.map((c, i) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  custom={i}
                  className="bg-card p-8 md:p-10"
                >
                  <h3 className="mb-3 text-lg font-semibold tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-16 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Your 90-day path to measurable AI impact
            </motion.h2>

            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                <motion.div key={step.number} variants={fadeUp} custom={i}>
                  <span className="mb-6 block text-5xl font-bold tracking-tight text-border">
                    {step.number}
                  </span>
                  <h3 className="mb-3 text-base font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Multi-model */}
      <section id="models" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Every model. One interface.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-16 max-w-lg text-muted-foreground"
            >
              Choose between every cutting-edge model from OpenAI, Anthropic,
              Google, and Mistral. Intelligent routing picks the best model for
              each task.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
            >
              {MODELS.map((m) => (
                <div key={m.name} className="bg-card p-6">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.provider}
                  </p>
                </div>
              ))}
            </motion.div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {[
                {
                  title: "Right model, right team",
                  body: "Department-level routing ensures engineering gets code-optimised models while commercial teams get conversational ones. No one-size-fits-all.",
                },
                {
                  title: "Responsible adoption by design",
                  body: "PII detection, prompt guardrails, and structured access policies ensure your teams adopt AI safely and in line with your governance standards.",
                },
                {
                  title: "Understand your AI investment",
                  body: "See token usage, cost per department, and ROI in one place. Make informed decisions about where to expand and where to optimise.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-card p-8 md:p-10">
                  <h3 className="mb-3 text-base font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise trust */}
      <section id="enterprise" className="border-y border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-16 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Built for enterprise.
            </motion.h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((item, i) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-border bg-card px-5 py-4"
                >
                  <p className="text-sm font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-16 max-w-lg text-muted-foreground"
            >
              Every plan includes unlimited free seats for AI readiness assessments.
              Pay only for premium AI features your team needs.
            </motion.p>

            <div className="grid gap-6 lg:grid-cols-3">
              {(["basic", "pro", "enterprise"] as const).map((planKey, idx) => {
                const plan = SUBSCRIPTION_PLANS[planKey];
                const features = PLAN_FEATURES[planKey];
                const models = PLAN_MODELS[planKey];
                const quotas = FEATURE_QUOTAS[planKey];

                return (
                  <motion.div
                    key={planKey}
                    variants={fadeUp}
                    custom={idx + 2}
                    className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                      planKey === "enterprise"
                        ? "border-foreground/20 ring-1 ring-foreground/10"
                        : planKey === "pro"
                        ? "border-border ring-1 ring-border"
                        : "border-border"
                    }`}
                  >
                    {planKey === "pro" && (
                      <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-semibold text-background">
                        Most Popular
                      </span>
                    )}
                    {planKey === "enterprise" && (
                      <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-semibold text-background">
                        Best Value
                      </span>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight">
                          £{plan.monthlyPricePerSeat}
                        </span>
                        <span className="text-sm text-muted-foreground">/user/month</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Paid from £{plan.monthlyPricePerSeat * plan.minSeats}/mo ({plan.minSeats}+ seats)
                      </p>
                    </div>

                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                      <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs font-medium">Unlimited free seats for assessments</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        {models.length} AI models included
                      </span>
                    </div>

                    <div className="flex-1 space-y-2.5">
                      {[
                        { label: "Knowledge base", on: features.knowledgeBase },
                        { label: "Custom personas", on: features.personas },
                        { label: "Team collaboration", on: features.teamCollaboration },
                        { label: "Approval workflows", on: features.approvalWorkflows },
                        { label: "Stack recommendation", on: features.stackRecommendation },
                        { label: "Roadmap generator", on: features.roadmapGenerator },
                        { label: "Advanced analytics", on: features.advancedAnalytics },
                        { label: "PDF export", on: features.pdfExport },
                        { label: "Web search", on: features.webSearch },
                        { label: "Voice chat", on: features.voiceChat },
                        { label: "Image generation", on: features.imageGeneration },
                        { label: "Deep research", on: features.deepResearch },
                      ].map((f) => (
                        <div key={f.label} className="flex items-center gap-2.5 text-sm">
                          {f.on ? (
                            <Check className="h-4 w-4 shrink-0 text-foreground" />
                          ) : (
                            <X className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                          )}
                          <span className={f.on ? "" : "text-muted-foreground/50"}>
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(quotas.voice > 0 || quotas.web_search > 0 || quotas.image_gen > 0 || quotas.deep_research > 0) && (
                      <div className="mt-5 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Included per seat / month
                        </p>
                        <div className="space-y-0.5">
                          {(["voice", "web_search", "image_gen", "deep_research"] as const).map((f) =>
                            quotas[f] > 0 ? (
                              <p key={f} className="text-xs">
                                <span className="font-medium">{quotas[f]}</span>{" "}
                                <span className="text-muted-foreground">
                                  {FEATURE_UNITS[f]} ({FEATURE_LABELS[f]})
                                </span>
                              </p>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}

                    {planKey === "enterprise" && (
                      <div className="mt-4 space-y-1.5">
                        {["SSO & SAML authentication", "Dedicated customer success manager", "Custom model fine-tuning", "Priority support with SLA"].map((perk) => (
                          <div key={perk} className="flex items-center gap-2 text-xs">
                            <Sparkles className="h-3 w-3 shrink-0 text-foreground" />
                            <span className="font-medium">{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <Link
                        href="/register"
                        className={`flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-opacity hover:opacity-90 ${
                          planKey === "enterprise"
                            ? "bg-foreground text-background"
                            : "border border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.p
              variants={fadeUp}
              custom={6}
              className="mt-8 text-center text-xs text-muted-foreground"
            >
              All plans include unlimited team members for AI readiness assessments.
              Paid seats unlock premium AI features. 14-day Pro trial included.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl"
            >
              Give your teams the structure
              <br />
              to succeed with AI.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mb-10 max-w-md text-muted-foreground"
            >
              Assess maturity in under 10 minutes. Get a 90-day roadmap
              to measurable impact. 14-day Pro trial included.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-10 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
            {/* Brand column */}
            <div className="md:col-span-1">
              <Image src="/logo.png" alt="AIOPSOS" width={100} height={40} className="h-9 w-auto" unoptimized />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Structured AI adoption for the modern organisation.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <p className="mb-4 text-sm font-medium">{section}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AIOPSOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
