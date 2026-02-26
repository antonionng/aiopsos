"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ContentSlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  footnote?: string;
  aside?: { message: string; features?: string[]; logoUrl?: string };
}

export function ContentSlide({
  section,
  sectionNumber,
  title,
  subtitle,
  bullets,
  footnote,
  aside,
}: ContentSlideProps) {
  return (
    <div
      className={`flex h-full flex-col justify-center px-12 md:px-24 ${aside ? "lg:flex-row lg:items-center lg:gap-12" : ""}`}
    >
      <div className={aside ? "min-w-0 flex-1" : ""}>
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
          className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-3xl text-lg text-zinc-400"
          >
            {subtitle}
          </motion.p>
        )}

        <div className="mt-4 space-y-4 max-w-4xl">
          {bullets.map((bullet, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-zinc-400" />
              <p className="text-lg leading-relaxed text-zinc-200 md:text-xl">{bullet}</p>
            </motion.div>
          ))}
        </div>

        {footnote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm italic text-zinc-500"
          >
            {footnote}
          </motion.p>
        )}
      </div>

      {aside && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-8 lg:mt-0 lg:w-[380px]"
        >
          <Image
            src={aside.logoUrl ?? "/logo.png"}
            alt="AIOPSOS"
            width={120}
            height={40}
            className="mb-5 object-contain object-left"
          />
          <p className="mb-4 text-center text-sm leading-relaxed text-zinc-300">
            {aside.message}
          </p>
          {aside.features && aside.features.length > 0 && (
            <ul className="space-y-2 text-left">
              {aside.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  );
}
