"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Server,
  MessageSquare,
  ClipboardCheck,
  Mail,
  Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const SERVICES = [
  {
    name: "API",
    description: "Core platform API and backend services",
    icon: Server,
    status: "operational" as const,
  },
  {
    name: "AI Interface",
    description: "Multi-model AI chat and routing",
    icon: MessageSquare,
    status: "operational" as const,
  },
  {
    name: "Assessment Engine",
    description: "Assessment creation, distribution, and scoring",
    icon: ClipboardCheck,
    status: "operational" as const,
  },
  {
    name: "Email Delivery",
    description: "Transactional emails and notifications",
    icon: Mail,
    status: "operational" as const,
  },
  {
    name: "Authentication",
    description: "User authentication and session management",
    icon: Shield,
    status: "operational" as const,
  },
];

const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClassName: "bg-emerald-500",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dotClassName: "bg-amber-500",
  },
  outage: {
    label: "Outage",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    dotClassName: "bg-red-500",
  },
};

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          System Status
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Current operational status of AIOPSOS services.
        </p>
      </motion.div>

      {/* Overall status banner */}
      <motion.div
        variants={fadeUp}
        custom={1}
        className={`mb-10 flex items-center gap-4 rounded-2xl border p-6 ${
          allOperational
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-amber-500/20 bg-amber-500/5"
        }`}
      >
        <CheckCircle2
          className={`h-8 w-8 ${
            allOperational
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        />
        <div>
          <p
            className={`text-lg font-semibold ${
              allOperational
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {allOperational
              ? "All systems operational"
              : "Some systems experiencing issues"}
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Service list */}
      <motion.div variants={fadeUp} custom={2}>
        <h2 className="mb-4 text-lg font-semibold">Services</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {SERVICES.map((service) => {
            const config = STATUS_CONFIG[service.status];
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${config.dotClassName}`}
                  />
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Incident reporting */}
      <motion.div
        variants={fadeUp}
        custom={3}
        className="mt-12 rounded-2xl border border-border bg-card p-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Experiencing an issue?{" "}
          <a
            href="/contact"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
          >
            Report it to our team
          </a>{" "}
          and we'll investigate immediately.
        </p>
      </motion.div>
    </motion.div>
  );
}
