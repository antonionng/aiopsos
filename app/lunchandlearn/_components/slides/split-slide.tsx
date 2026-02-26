"use client";

import { motion } from "framer-motion";

interface SplitColumn {
  heading: string;
  items: string[];
  accent?: string;
}

interface SplitSlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  left: SplitColumn;
  right: SplitColumn;
}

export function SplitSlide({ section, sectionNumber, title, left, right }: SplitSlideProps) {
  return (
    <div className="flex h-full flex-col justify-center px-12 md:px-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-2 flex items-center gap-3"
      >
        {sectionNumber !== undefined && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-zinc-300">
            {sectionNumber}
          </span>
        )}
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          {section}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[left, right].map((col, ci) => (
          <motion.div
            key={ci}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + ci * 0.15 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3
              className="mb-5 text-xl font-semibold"
              style={{ color: col.accent ?? (ci === 0 ? "#a1a1aa" : "#d4d4d8") }}
            >
              {col.heading}
            </h3>
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: col.accent ?? (ci === 0 ? "#a1a1aa" : "#d4d4d8") }}
                  />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
