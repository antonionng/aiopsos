"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Users, Sparkles } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function FounderSection() {
  const [imageError, setImageError] = useState(false);
  return (
    <motion.section variants={fadeUp} custom={3}>
      <h2 className="mb-8 text-2xl font-semibold tracking-[-0.02em]">
        Leadership
      </h2>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            {imageError ? (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground sm:h-28 sm:w-28">
                AG
              </div>
            ) : (
              <Image
                src="/antonio.jpg"
                alt="Antonio Giugno"
                width={112}
                height={112}
                className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div>
            <h3 className="mb-1 text-xl font-semibold">Antonio Giugno</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Founder & AI Architect
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Antonio is a leading AI architect and trainer with deep experience
              helping organisations navigate the shift from experimental AI use to
              strategic, embedded adoption. He has built and scaled multiple
              enterprise AI applications for long term clients. His work spans
              enterprise AI strategy, multi-model orchestration, and building the
              frameworks that turn AI potential into measurable business
              outcomes.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Antonio founded Experrt with a core conviction: that equitable AI
              access is essential. Every organisation, regardless of scale or
              resources, should have the tools and structure to benefit from what
              AI can deliver.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              He serves on the board of multiple tech companies and is a strong
              advocate for responsible AI adoption: right-sized models,
              governance, and measurable outcomes. Dad of four. Passionate about
              applied AI in robotics.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const VALUES = [
  {
    icon: Target,
    title: "Start with curiosity",
    description:
      "Ask what people want to do better. Turn that question into a clear learning priority and a practical next step.",
  },
  {
    icon: Users,
    title: "Make room for practice",
    description:
      "Bring useful materials, expert guidance and real tasks together. Give people the space to try, ask questions and build confidence.",
  },
  {
    icon: Sparkles,
    title: "Make progress visible",
    description:
      "Look at what someone has learned and what they can demonstrate. Keep clear records and choose the next step from evidence.",
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
          About Experrt
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A learning platform for people with big ideas. We bring courses, people and progress together, with expert-led AI and robotics training and practical consulting.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section variants={fadeUp} custom={1} className="mb-20">
        <h2 className="mb-6 text-2xl font-semibold tracking-[-0.02em]">
          Our mission
        </h2>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="text-lg leading-relaxed text-foreground">
            To help curiosity become practical progress. We support training providers, enterprise learning teams and learners with a place to organise learning, practise useful skills and understand what comes next.
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
      <FounderSection />
    </motion.div>
  );
}
