"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  ClipboardCheck,
  MessageSquare,
  GraduationCap,
  Lightbulb,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const GUIDES = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Set up your organisation, invite your team, and configure your first AI workspace.",
    steps: [
      "Create an account and name your organisation",
      "Invite team members via email or shareable link",
      "Configure organisation settings and departments",
      "Assign roles (admin, manager, or member)",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "AI Readiness Assessment",
    description:
      "Measure AI maturity across your organisation with our 5-dimension assessment framework.",
    steps: [
      "Create a new assessment from the Assessment tab",
      "Distribute via email invites, QR code, or public link",
      "Track completion rates in real-time",
      "Review aggregated results and dimension breakdowns",
    ],
  },
  {
    icon: MessageSquare,
    title: "AI Interface",
    description:
      "Access multiple AI models through a unified interface with intelligent routing.",
    steps: [
      "Navigate to the AI Interface from your dashboard",
      "Choose a model or let smart routing pick the best one",
      "Create custom personas for specific use cases",
      "Upload knowledge base documents for context-aware responses",
    ],
  },
  {
    icon: GraduationCap,
    title: "Academy & Course Recommendations",
    description:
      "Turn assessment gaps into facilitated training, by role and by department.",
    steps: [
      "Review recommended courses on your own results page",
      "Open Training Needs on an assessment to see the cohort view by department",
      "Browse the full catalogue at /courses, including modules and outcomes",
      "Courses are delivered live by a facilitator - the platform records delivery, it does not host content",
    ],
  },
  {
    icon: Lightbulb,
    title: "Recommendations & Roadmap",
    description:
      "Get tailored AI stack recommendations and a 90-day adoption roadmap.",
    steps: [
      "Complete an organisation-wide assessment first",
      "Navigate to Recommendations for tool suggestions",
      "Generate your 90-day roadmap with phased milestones",
      "Track progress and update phases as you advance",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Understand adoption patterns, usage metrics, and ROI across your organisation.",
    steps: [
      "View organisation-wide maturity scores",
      "Drill into department-level breakdowns",
      "Track AI interface usage and token consumption",
      "Monitor assessment completion and engagement trends",
    ],
  },
];

const SUBPROCESSORS = [
  {
    name: "Supabase",
    purpose: "Database, authentication and file storage. Holds assessment responses, training records and certificates.",
    region: "London (eu-west-2)",
  },
  {
    name: "OpenAI",
    purpose: "The models behind the AI workspace. Prompts and their responses only; training records are never sent.",
    region: "United States",
  },
  {
    name: "Vercel",
    purpose: "Application hosting and content delivery.",
    region: "London (lhr1)",
  },
  {
    name: "Stripe",
    purpose: "Payment processing. Card details never reach our systems.",
    region: "United States / Ireland",
  },
  {
    name: "Resend",
    purpose: "Transactional email: enrolment confirmations, session reminders, certificates.",
    region: "United States",
  },
];

export default function DocsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Documentation
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          How to assess your workforce, train them by role, and produce the
          records that evidence it.
        </p>
      </motion.div>

      {/* Guides */}
      <div className="space-y-6">
        {GUIDES.map((guide, i) => (
          <motion.div
            key={guide.title}
            variants={fadeUp}
            custom={i + 1}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <guide.icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-lg font-semibold">{guide.title}</h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <ul className="space-y-2">
                  {guide.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sub-processors */}
      <motion.section
        variants={fadeUp}
        custom={GUIDES.length + 1}
        className="mt-12"
      >
        <h2 className="mb-2 text-2xl font-semibold tracking-[-0.02em]">
          Where your data is processed
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Procurement will ask for this, so it is on a public page rather than
          in an email. These are every third party that processes customer data
          on our behalf.
        </p>

        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-5 py-3 font-semibold">Sub-processor</th>
                <th className="px-5 py-3 font-semibold">Purpose</th>
                <th className="px-5 py-3 font-semibold">Region</th>
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map((sp) => (
                <tr key={sp.name} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 font-medium">{sp.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{sp.purpose}</td>
                  <td className="px-5 py-3 text-muted-foreground">{sp.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          We use a single model provider on purpose. One named sub-processor is
          a materially easier approval for a regulated buyer than four, and it
          keeps this table short enough to actually be read. Adding a provider
          would mean updating this page at the same time.
        </p>
      </motion.section>

      {/* Help section */}
      <motion.div
        variants={fadeUp}
        custom={GUIDES.length + 1}
        className="mt-12 rounded-2xl border border-border bg-card p-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Need more help?{" "}
          <a
            href="/contact"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
          >
            Contact our team
          </a>{" "}
          and we'll get back to you within 24 hours.
        </p>
      </motion.div>
    </motion.div>
  );
}
