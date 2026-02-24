"use client";

import { motion } from "framer-motion";
import { Tag, Sparkles, Wrench, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

type ChangeType = "feature" | "improvement" | "fix" | "security";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  changes: Change[];
}

const RELEASES: Release[] = [
  {
    version: "1.0.0",
    date: "February 2026",
    title: "Initial Launch",
    changes: [
      {
        type: "feature",
        text: "AI Readiness Assessment engine with 5-dimension maturity framework",
      },
      {
        type: "feature",
        text: "Multi-model AI Interface with intelligent routing (GPT-5.3, Claude Opus 4.6, Gemini 2.0, and more)",
      },
      {
        type: "feature",
        text: "Organisation-wide analytics dashboard with department breakdowns",
      },
      {
        type: "feature",
        text: "AI Stack Recommendation engine based on assessment results",
      },
      {
        type: "feature",
        text: "90-day Adoption Roadmap generator with phased milestones",
      },
      {
        type: "feature",
        text: "Knowledge base upload for context-aware AI responses",
      },
      {
        type: "feature",
        text: "Custom personas for tailored AI interactions",
      },
      {
        type: "feature",
        text: "Team management with role-based access control",
      },
      {
        type: "feature",
        text: "Email-based assessment distribution with QR codes",
      },
      {
        type: "security",
        text: "Enterprise-grade authentication with Supabase Auth",
      },
      {
        type: "security",
        text: "Row-level security policies for data isolation",
      },
    ],
  },
];

const TYPE_CONFIG: Record<
  ChangeType,
  { icon: typeof Tag; label: string; className: string }
> = {
  feature: {
    icon: Sparkles,
    label: "New",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  improvement: {
    icon: Tag,
    label: "Improved",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  fix: {
    icon: Wrench,
    label: "Fixed",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  security: {
    icon: Shield,
    label: "Security",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
};

export default function ChangelogPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Changelog
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Track the latest updates, new features, and improvements to AIOPSOS.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-12">
        {RELEASES.map((release, i) => (
          <motion.article
            key={release.version}
            variants={fadeUp}
            custom={i + 1}
            className="relative"
          >
            {/* Version header */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-sm font-semibold text-background">
                v{release.version}
              </span>
              <span className="text-sm text-muted-foreground">
                {release.date}
              </span>
            </div>

            {/* Release card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-semibold">{release.title}</h2>
              <ul className="space-y-4">
                {release.changes.map((change, idx) => {
                  const config = TYPE_CONFIG[change.type];
                  const Icon = config.icon;
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${config.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {change.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Subscribe */}
      <motion.div
        variants={fadeUp}
        custom={RELEASES.length + 1}
        className="mt-12 rounded-2xl border border-border bg-card p-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Want to be notified of new releases?{" "}
          <a
            href="/contact"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
          >
            Get in touch
          </a>{" "}
          to join our mailing list.
        </p>
      </motion.div>
    </motion.div>
  );
}
