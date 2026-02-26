"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  Users,
  Menu,
  Search,
  Plus,
  MessageSquare,
  FolderPlus,
  Paperclip,
  Send,
  Bot,
} from "lucide-react";
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
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const CAPABILITIES = [
  {
    title: "Run one AI workspace for the company",
    description:
      "Manage every AI model, policy, document, and project in one shared workspace. Give each team the same platform with controls that fit how they actually work.",
  },
  {
    title: "Tailor AI by department, not one-size-fits-all",
    description:
      "Route the right model to each function and apply role-specific guardrails. Engineering, finance, legal, and operations each get policies and workflows built for their needs.",
  },
  {
    title: "Ground AI in your docs and projects",
    description:
      "Embed internal documents directly into AI workflows, organise work by project, and collaborate with your team in context. Turn usage into consistent, measurable output.",
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

const WORKSPACE_QUICK_ACTIONS = [
  "Summarise our AI readiness scores",
  "Draft a project status update",
  "What models should our team use?",
  "Help me write a business case for AI",
];

const PROJECT_THREAD = [
  {
    speaker: "Maya",
    role: "human" as const,
    text: "AIOPSOS, draft a customer support launch brief using our Q2 project docs.",
  },
  {
    speaker: "AIOPSOS",
    role: "ai" as const,
    text: "Draft ready. I included rollout phases, owners, and risk controls from your policy set.",
  },
  {
    speaker: "Luca",
    role: "human" as const,
    text: "Great. Add an operations timeline and suggest staffing impact by week.",
  },
  {
    speaker: "AIOPSOS",
    role: "ai" as const,
    text: "Updated with a 6-week timeline and staffing estimates. Finance guardrails are applied.",
  },
  {
    speaker: "Nia",
    role: "human" as const,
    text: "Looks good. I need a compliance summary before sign-off.",
  },
  {
    speaker: "AIOPSOS",
    role: "ai" as const,
    text: "Compliance summary generated and attached. Ready for final approval and engineering handoff.",
  },
] as const;

const COLLAB_STATUSES = ["Draft", "In review", "Approved"] as const;

const COLLAB_PEOPLE = [
  {
    name: "Maya",
    team: "Product",
    avatarPath: "/avatars/maya.svg",
    aiTask: "Reviewing AI-generated brief",
  },
  {
    name: "Luca",
    team: "Operations",
    avatarPath: "/avatars/luca.svg",
    aiTask: "Testing workflow suggestions",
  },
  {
    name: "Nia",
    team: "Finance",
    avatarPath: "/avatars/nia.svg",
    aiTask: "Checking policy compliance output",
  },
  {
    name: "Jon",
    team: "Engineering",
    avatarPath: "/avatars/jon.svg",
    aiTask: "Refining implementation with AI",
  },
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
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % COLLAB_STATUSES.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const activeStatus = COLLAB_STATUSES[statusIdx];

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
            Your company&apos;s
            <br />
            AI workspace.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Most teams have AI access but no shared operating model. AIOPSOS gives
            companies one workspace to manage models, enforce tailored policies,
            embed internal documents, run projects, and collaborate with AI across
            every department.
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
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              How the AI workspace works
            </h2>

            <p className="mb-10 max-w-2xl text-muted-foreground">
              A practical interface for teams to manage models, policies, knowledge, and
              project collaboration in one place.
            </p>

            <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-black/70">
              <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <Menu className="h-4 w-4 text-white/60" />
                  <Image src="/logo.png" alt="AIOPSOS" width={56} height={24} className="h-5 w-auto opacity-90" unoptimized />
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
              </div>
              <div className="grid min-h-[420px] gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
                  <p className="mb-3 text-xs font-medium text-white/80">Conversations</p>
                  <div className="mb-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
                    <Search className="mr-2 inline h-3.5 w-3.5" />
                    Search conversations...
                  </div>
                  <div className="space-y-2 text-sm">
                    <button className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-white/80">
                      <FolderPlus className="h-3.5 w-3.5" />
                      Create a project
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-white/80">
                      <Plus className="h-3.5 w-3.5" />
                      New conversation
                    </button>
                    <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-white/60">
                      Weekly launch prep
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-white/60">
                      Q2 AI policy draft
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-4 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    {["GPT-4o Mini", "Company docs", "Search", "Prompts"].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                      >
                        {chip}
                      </span>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                      {COLLAB_PEOPLE.slice(0, 3).map((person, i) => (
                        <motion.div
                          key={person.name}
                          className="relative h-7 w-7 overflow-hidden rounded-full border border-white/30"
                          animate={
                            reduceMotion
                              ? undefined
                              : { y: [0, -1, 0], opacity: [0.9, 1, 0.9] }
                          }
                          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                        >
                          <Image
                            src={person.avatarPath}
                            alt={`${person.name} avatar`}
                            width={28}
                            height={28}
                            className="h-full w-full object-cover"
                          />
                          <motion.span
                            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black/80 bg-emerald-400"
                            animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center px-2 pb-6 pt-3 text-center">
                    <MessageSquare className="mb-4 h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/70" />
                    <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white/90">
                      How can I help you today?
                    </h3>
                    <p className="mb-6 text-sm text-white/55">
                      Ask anything about your work, projects, or data.
                    </p>
                    <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                      {WORKSPACE_QUICK_ACTIONS.map((prompt, i) => (
                        <motion.div
                          key={prompt}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-white/60"
                          animate={reduceMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
                          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}
                        >
                          {prompt}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-5 w-full max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
                      <p className="mb-2 text-[11px] uppercase tracking-wide text-white/45">
                        Active thread: Customer Support Automation
                      </p>
                      <div className="space-y-2">
                        {PROJECT_THREAD.map((msg, i) => {
                          const person = COLLAB_PEOPLE.find((p) => p.name === msg.speaker);
                          const isAI = msg.role === "ai";
                          return (
                            <motion.div
                              key={`${msg.speaker}-${i}`}
                              className={`flex items-start gap-2 ${isAI ? "" : "justify-start"}`}
                              animate={
                                reduceMotion
                                  ? undefined
                                  : { opacity: [0.65, 1, 0.65] }
                              }
                              transition={{ duration: 3, repeat: Infinity, delay: i * 0.28 }}
                            >
                              {isAI ? (
                                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                                  <Bot className="h-3.5 w-3.5 text-white/75" />
                                </span>
                              ) : (
                                <span className="relative h-6 w-6 overflow-hidden rounded-full border border-white/25">
                                  <Image
                                    src={person?.avatarPath ?? "/avatars/maya.svg"}
                                    alt={`${msg.speaker} avatar`}
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                </span>
                              )}
                              <div className="min-w-0 rounded-lg border border-white/10 bg-black/20 px-2.5 py-1.5">
                                <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-white/45">
                                  {msg.speaker}
                                </p>
                                <p className="text-[11px] text-white/75">{msg.text}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-white/45">
                      <span>Project: Customer Support Automation</span>
                      <motion.span
                        key={activeStatus}
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="rounded-full border border-white/15 px-2 py-0.5 text-white/70"
                      >
                        {activeStatus}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-3.5 w-3.5 text-white/60" />
                      <span className="text-xs text-white/45">Message AIOPSOS...</span>
                      <div className="ml-auto flex items-center gap-1.5">
                        <motion.span
                          className="h-1.5 w-1.5 rounded-full bg-white/50"
                          animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.span
                          className="h-1.5 w-1.5 rounded-full bg-white/50"
                          animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="h-1.5 w-1.5 rounded-full bg-white/50"
                          animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                        />
                        <button className="ml-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 text-white/70">
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {CAPABILITIES.map((c, i) => (
                <div key={c.title} className="bg-card p-8 md:p-10">
                  <h3 className="mb-3 text-lg font-semibold tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="border-y border-border/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="mb-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Project collaboration in motion
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mb-12 max-w-2xl text-muted-foreground">
              Teams collaborate with AI in shared project spaces, hand off work across departments, and keep policy and context attached to every decision.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold">Live project room</p>
                <div className="space-y-3">
                  {COLLAB_PEOPLE.map((person, i) => (
                    <motion.div
                      key={person.name}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                          <img
                            src={person.avatarPath}
                            alt={`${person.name} avatar`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-card bg-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.p
                          className="text-xs text-muted-foreground"
                          animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                          transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.25 }}
                        >
                          with AI
                        </motion.p>
                        <p className="text-[11px] text-muted-foreground">{person.aiTask}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-sm font-semibold">Project timeline + AI handoffs</p>
                <div className="mb-4 rounded-lg border border-border bg-muted/20 p-3">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">AI co-pilot thread</p>
                  <motion.div
                    className="rounded-md border border-border bg-card px-3 py-2 text-xs"
                    animate={reduceMotion ? undefined : { y: [0, -1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    Product asked AI for a rollout draft, operations refined the plan,
                    finance requested compliance checks, and engineering received the final
                    approved handoff.
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {[
                    "Kickoff and requirements aligned",
                    "Knowledge base docs linked to AI project space",
                    "Policy checks completed with AI guardrails",
                    "Launch review approved",
                  ].map((item, i) => (
                    <div key={item} className="relative rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                      <motion.span
                        className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-foreground/70"
                        animate={reduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25] }}
                        transition={{ duration: 1.7, repeat: Infinity, delay: i * 0.28 }}
                      />
                      <p className="pl-2 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
              Use the latest models from OpenAI, Anthropic, Google, and Mistral in
              one place. Intelligent routing and governance controls match the
              right model, policy, and context to each task.
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
                  body: "Department-level routing ensures engineering gets code-optimised models while commercial teams get conversational ones. No one-size-fits-all setup for the entire company.",
                },
                {
                  title: "Company policies built into daily work",
                  body: "PII detection, guardrails, and role-based policy controls are embedded where people actually use AI, so governance becomes part of execution instead of an afterthought.",
                },
                {
                  title: "Projects, documents, and collaboration in context",
                  body: "Attach internal documents, work in shared projects, and collaborate with AI as a team. Track adoption, usage, and ROI so you can scale what works.",
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
                The AI workspace for companies to manage models, policies, and collaboration.
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
