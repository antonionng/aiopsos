"use client";

import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { CompanionShowcase } from "@/components/marketing/companion-showcase";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Menu,
  Search,
  Plus,
  Paperclip,
  Send,
  Bot,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const PILLARS = [
  {
    title: "Applied AI",
    href: "/courses?category=ai",
    accentBar: "bg-cat-ai",
    accentText: "text-cat-ai",
    description:
      "Using AI on the work your team already does: drafting, analysis, research, summarising a document nobody has time to read. Built around verification habits, because an answer nobody checks is a liability rather than a saving.",
    sharpEdge: "Not prompt tricks. The judgement to know when the output is wrong.",
  },
  {
    title: "Technology adoption",
    href: "/courses?category=technology",
    accentBar: "bg-cat-technology",
    accentText: "text-cat-technology",
    description:
      "The tools your organisation already pays for, actually used. Most companies have more capability sitting unopened in their existing licences than in anything they are about to buy.",
    sharpEdge: "Not a product demo. Your stack, your workflows, your people.",
  },
  {
    title: "Applied robotics",
    href: "/courses?category=robotics",
    accentBar: "bg-cat-robotics",
    accentText: "text-cat-robotics",
    description:
      "Robotics as an operational question rather than an engineering one: what to specify, how to put it into a real process, who owns it, and what happens on the shift when it stops.",
    sharpEdge: "Not how they are built. How they are put to work.",
  },
];

const AGENT_VERBS = [
  {
    title: "It knows you",
    live: true,
    description:
      "Your enrolments, attendance, released grades, certificates and assessment results - it answers from your actual record, not a guess.",
  },
  {
    title: "It plans",
    live: true,
    description:
      "Ask what to learn next and it maps a sequenced path from your measured gaps to the cohorts actually running.",
  },
  {
    title: "It acts",
    live: false,
    description:
      "Soon it will request your seat on the next cohort and put sessions in your calendar - you confirm, a human approves.",
  },
  {
    title: "It checks in",
    live: false,
    description:
      "Between live sessions it will nudge your practice and prep you for what's next - useful, opt-out, never nagging.",
  },
];

const PLATFORM_BENEFITS = [
  {
    title: "Know where each team actually stands",
    description:
      "A five-minute assessment scores every person across five dimensions, by department and by role, so the training answers a measured gap rather than a guess. It is also how we decide what to teach you.",
  },
  {
    title: "Somewhere for the practice to continue",
    description:
      "A governed AI workspace your teams keep using once the trainer has gone home: the right models, your own documents, and guardrails set by your policy rather than by whoever signed up first.",
  },
  {
    title: "Proof the training happened",
    description:
      "Attendance, submissions, grades, facilitator credentials and observed use afterwards, exported as a dated pack. What a funding body, an auditor or a board actually asks to see.",
  },
];

const WHY_NOW = [
  {
    tag: "Adoption",
    title: "The tools arrived before the training did",
    description:
      "Most organisations rolled out AI licences and assumed capability would follow. It did not. Usage clusters in a handful of enthusiasts while everyone else quietly opts out.",
    href: "/insights/unused-ai-licences-training-gap",
    linkLabel: "The licences are paid for. The team was not trained.",
  },
  {
    tag: "Risk",
    title: "Untrained use is the expensive kind",
    description:
      "Staff using AI without a verification habit produce confident, plausible, wrong work — and it reaches customers. The failure is not the tool, it is the absence of a standard for checking it.",
    href: "/insights/ai-output-verification-at-work",
    linkLabel: "An answer nobody checks is a liability",
  },
  {
    tag: "Obligation",
    title: "Enforcement started this month",
    description:
      "EU AI Act Article 4 requires providers and deployers to take measures supporting AI literacy among their staff. National market surveillance authorities began supervising on 2 August 2026.",
    href: "/insights/eu-ai-act-article-4-literacy-for-ld",
    linkLabel: "What L&D actually has to do under Article 4",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Assess",
    description:
      "Distribute the assessment by email, link or QR code. Five dimensions, six maturity tiers, scored by department and by respondent role.",
  },
  {
    number: "02",
    title: "Train",
    description:
      "The gaps map onto the course catalogue. Book a cohort, and a facilitator delivers it live. Attendance, submissions and grades are recorded as it runs.",
  },
  {
    number: "03",
    title: "Evidence",
    description:
      "Export a dated pack: who was trained, on what, by whom, and what changed in observed usage afterwards. The record, not a certificate.",
  },
];

const TRUST_GROUPS = [
  {
    title: "The record",
    items: [
      "Role-proportionate training records",
      "Attendance and grading held per cohort",
      "Facilitator credentials on record",
    ],
  },
  {
    title: "Verification",
    items: [
      "Third-party certificate verification",
      "Dated, frozen evidence packs",
    ],
  },
  {
    title: "Privacy by structure",
    items: [
      "Usage reported by department, never by person",
      "Row-level data isolation per tenant",
      "Automated PII detection and guardrails",
    ],
  },
];




const FOOTER_LINKS = {
  Product: [
    { label: "Experrt AI", href: "/experrt-ai" },
    { label: "Assessment", href: "/ai-readiness-assessment" },
    { label: "AI literacy", href: "/ai-literacy-training" },
    { label: "Academy", href: "/courses" },
    { label: "Use cases", href: "/use-cases" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
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

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Wordmark size="md" />
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <a href="#capabilities" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Experrt AI
              </a>
              <Link href="/ai-literacy-training" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                AI literacy
              </Link>
              <Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Academy
              </Link>
              <Link href="/use-cases" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Use cases
              </Link>
              <Link href="/insights" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Insights
              </Link>
              <a href="#enterprise" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Enterprise
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
        <div className="pointer-events-none absolute inset-0 bg-grid-faint" />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-6 font-display text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-[4.5rem]"
          >
            We train your people to
            <br />
            actually use AI and robotics.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Experrt is a training academy for applied AI, technology and
            robotics. Every course is facilitated live by a trainer, in your
            room or online, and built around your team&apos;s real work — not a
            video library they will never open.
          </motion.p>

          <motion.div variants={fadeUp} custom={3}>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Book a conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="ml-3 inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              See the courses
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* What we train */}
      <section id="what-we-train" className="border-t border-border/40 py-24">
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
              className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              What we train
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-12 max-w-2xl text-muted-foreground"
            >
              Three subjects, one idea behind all of them: putting the
              technology to work inside a real business, with the people who
              have to live with it afterwards.
            </motion.p>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <motion.div key={pillar.title} variants={fadeUp} custom={2}>
                  <Link
                    href={pillar.href}
                    className="group flex h-full flex-col bg-card p-8 transition-colors hover:bg-accent/50 md:p-10"
                  >
                    <span
                      className={`mb-5 h-1 w-10 rounded-full ${pillar.accentBar}`}
                    />
                    <h3 className="mb-3 text-lg font-semibold tracking-[-0.01em]">
                      {pillar.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                    <p className="mb-6 text-sm font-medium text-foreground/80">
                      {pillar.sharpEdge}
                    </p>
                    <span
                      className={`mt-auto inline-flex items-center text-sm font-medium ${pillar.accentText}`}
                    >
                      See the courses
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why now */}
      <section id="why-now" className="border-t border-border/40 py-24">
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
              className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Why now
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-12 max-w-2xl text-muted-foreground"
            >
              Most organisations bought the tools first and are training
              afterwards, if at all. Three things changed that calculation this
              year.
            </motion.p>

            <div className="grid gap-6 md:grid-cols-3">
              {WHY_NOW.map((reason, i) => (
                <motion.div key={reason.title} variants={fadeUp} custom={i}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {reason.tag}
                  </p>
                  <h3 className="mb-2 text-base font-semibold">{reason.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                  <Link
                    href={reason.href}
                    className="mt-4 inline-flex items-center text-sm font-medium text-foreground hover:text-brand"
                  >
                    {reason.linkLabel}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground"
            >
              To be precise about the last one, because plenty of people are
              not: Article 4 requires measures supporting AI literacy among
              staff. It does not require a certificate, and no single course
              makes an organisation compliant. What we produce is a documented,
              role-proportionate record of the training you actually did.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Experrt AI */}
      <section id="capabilities" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Experrt AI
            </p>
            <h2 className="mb-6 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Meet Experrt AI &mdash; your very own learning agent.
            </h2>

            <p className="mb-10 max-w-2xl text-muted-foreground">
              Every member gets an agent that knows their training record and
              acts on it: what they have studied, how it went, and what to do
              next. It works between the live sessions a facilitator runs
              &mdash; never instead of them.
            </p>

            <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-black/70">
              <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <Menu className="h-4 w-4 text-white/60" />
                  <Wordmark size="sm" className="opacity-90" />
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
                      <Plus className="h-3.5 w-3.5" />
                      New conversation
                    </button>
                    <div className="rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-white/85">
                      What should I learn next?
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-white/60">
                      Course check-in
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-white/60">
                      My certificates
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-4 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    {["Experrt AI \u00b7 Learning agent", "GPT-4o Mini"].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-1 flex-col justify-center px-1 pb-6 pt-2">
                    <div className="mx-auto w-full max-w-2xl space-y-3">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/90 px-3.5 py-2 text-sm text-black">
                          What should I work on next?
                        </div>
                      </div>

                      <div className="flex">
                        <motion.span
                          className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 px-2.5 py-1 text-[11px] text-brand"
                          animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                          Reading your assessment and course history&hellip;
                        </motion.span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/15">
                          <Bot className="h-3.5 w-3.5 text-brand" />
                        </span>
                        <div className="min-w-0 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white/85">
                          Responsible use is your widest gap. <span className="font-medium text-white">Responsible AI Use at Work</span> runs
                          next month &mdash; six hours, facilitated live. Want me
                          to map the full path?
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/90 px-3.5 py-2 text-sm text-black">
                          Yes &mdash; plan it.
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/15">
                          <Bot className="h-3.5 w-3.5 text-brand" />
                        </span>
                        <div className="min-w-0 flex-1 rounded-2xl rounded-bl-md border border-brand/25 bg-brand/[0.07] p-3.5">
                          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
                            Your path
                          </p>
                          <div className="space-y-2">
                            {[
                              { step: "1", text: "Responsible AI Use at Work", meta: "next cohort \u00b7 6 hrs live" },
                              { step: "2", text: "Prompting and Output Verification", meta: "the checking habit \u00b7 7 hrs" },
                              { step: "3", text: "Re-assess", meta: "measure what changed" },
                            ].map((row, i) => (
                              <motion.div
                                key={row.step}
                                className="flex items-center gap-2.5"
                                initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.18, duration: 0.3 }}
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                                  {row.step}
                                </span>
                                <span className="text-sm text-white/85">{row.text}</span>
                                <span className="ml-auto text-[11px] text-white/40">{row.meta}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-3.5 w-3.5 text-white/60" />
                      <span className="text-xs text-white/45">Message Experrt AI...</span>
                      <div className="ml-auto flex items-center gap-1.5">
                        <button className="ml-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 text-white/70">
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What makes it an agent */}
            <div className="mb-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {AGENT_VERBS.map((verb) => (
                <div key={verb.title} className="flex flex-col bg-card p-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">{verb.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        verb.live
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {verb.live ? "Live now" : "Rolling out"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {verb.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="mb-12 max-w-2xl text-sm text-muted-foreground">
              And the part your compliance team will ask about: spend is capped
              per person, usage is reported by department and never by
              individual, and Experrt AI never grades work or marks attendance
              &mdash; a live facilitator does that. An agent you can actually
              approve.
            </p>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {PLATFORM_BENEFITS.map((c) => (
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

      {/* Companions */}
      <section className="border-y border-border/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              One agent, three roles
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mb-12 max-w-2xl text-muted-foreground">
              Experrt AI meets each person as their role needs it. Learners get
              help between live sessions, L&amp;D sees cohorts and gaps, and
              owners get answers about their people &mdash; with individual
              privacy built in as a hard rule, not a promise.
            </motion.p>

            <motion.div variants={fadeUp} custom={2}>
              <CompanionShowcase />
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
              How an engagement runs
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

      {/* Enterprise trust */}
      <section id="enterprise" className="border-y border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:gap-16"
          >
            <div>
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              >
                What you get in writing.
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="mb-6 text-muted-foreground">
                When a funding body, an auditor or your board asks what you did
                about AI capability, you hand them a dated pack &mdash; who was
                assessed, who was trained, by whom, and what changed afterwards.
                Not a slide of good intentions.
              </motion.p>
              <motion.p variants={fadeUp} custom={2} className="mb-8 text-sm text-muted-foreground">
                Every item below is a record the platform keeps as the training
                runs, frozen at export so later edits can never rewrite what a
                certificate or a pack already says.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Link
                  href="/docs"
                  className="inline-flex items-center text-sm font-medium text-brand hover:underline"
                >
                  How the records work
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            {/* The evidence-pack document */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="relative rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Evidence pack
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold tracking-tight">
                    Your organisation
                  </p>
                </div>
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0, rotate: -12, scale: 1.15 }}
                  whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.4 }}
                  className="rounded-md border-2 border-brand/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand"
                >
                  Dated &amp; frozen
                </motion.span>
              </div>

              <div className="space-y-6">
                {TRUST_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {group.title}
                    </p>
                    <ul className="space-y-2">
                      {group.items.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.25, delay: i * 0.06 }}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
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
              className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Pricing that follows the training
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-16 max-w-xl text-muted-foreground"
            >
              The platform is free for your whole organisation. You pay for the
              training you book, and for the AI your people actually use &mdash;
              metered, capped, and itemised. No seat licences.
            </motion.p>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Platform */}
              <motion.div
                variants={fadeUp}
                custom={2}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Platform</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight">£0</span>
                    <span className="text-sm text-muted-foreground">for everyone, always</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Unlimited members. No trial clock.
                  </p>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {[
                    "Readiness assessments for the whole workforce",
                    "Scores by department, role and dimension",
                    "Training records, attendance and grades",
                    "Dated evidence packs and certificate verification",
                    "A role-based AI companion for every member",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/register"
                    className="flex h-11 w-full items-center justify-center rounded-full border border-border bg-card text-sm font-semibold transition-colors hover:bg-accent"
                  >
                    Create your organisation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>

              {/* AI usage */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">AI usage</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight">Pay as you go</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Metered at model rates. Nothing when nobody uses it.
                  </p>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {[
                    "Charged per request, at the rate of the model used",
                    "Daily and monthly ceilings per person, on by default",
                    "Itemised by department on your statement",
                    "Learners run on the efficient model automatically",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                  Capped by default &mdash; nobody can run up a bill you did not
                  agree to.
                </div>
              </motion.div>

              {/* Courses */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="relative flex flex-col rounded-2xl border border-brand/40 bg-card p-8 ring-2 ring-brand/60"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-0.5 text-[11px] font-semibold text-brand-foreground">
                  What you come for
                </span>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Courses</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight">Per cohort</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Priced for the cohort, not per licence.
                  </p>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {[
                    "Facilitated live \u2014 in your room or online",
                    "Built around your team's real work",
                    "Attendance taken, work graded by the facilitator",
                    "Certificates any third party can verify",
                    "The records land in your evidence pack automatically",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-2">
                  <Link
                    href="/courses"
                    className="flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                  >
                    Browse the catalogue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-semibold transition-colors hover:bg-accent"
                  >
                    Ask about a cohort
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.p
              variants={fadeUp}
              custom={5}
              className="mt-8 max-w-2xl text-xs text-muted-foreground"
            >
              Cohort pricing depends on course, group size and delivery mode
              &mdash; ask and you will get a number, not a call-back sequence.
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
              Your people, genuinely
              <br />
              capable with this stuff.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mb-10 max-w-md text-muted-foreground"
            >
              Start with the assessment — five minutes per person, and it tells
              you which teams need what. Then we come and teach them.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-10 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
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
              <Wordmark size="md" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                A training academy for applied AI, technology and robotics. Facilitated live, in person and online.
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
              &copy; {new Date().getFullYear()} Experrt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
