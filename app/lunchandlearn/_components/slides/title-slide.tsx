"use client";

import { motion } from "framer-motion";

interface TitleSlideProps {
  title: string;
  subtitle?: string;
  badge?: string;
  footer?: string;
}

export function TitleSlide({ title, subtitle, badge, footer }: TitleSlideProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-zinc-300"
        >
          <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
          {badge}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative max-w-5xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl"
        >
          {subtitle}
        </motion.p>
      )}

      {footer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative mt-12 text-sm text-zinc-600"
        >
          {footer}
        </motion.p>
      )}
    </div>
  );
}
