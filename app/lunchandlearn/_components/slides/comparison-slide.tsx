"use client";

import { motion } from "framer-motion";

interface ComparisonSlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  headers: string[];
  rows: { label: string; values: string[] }[];
  footnote?: string;
}

export function ComparisonSlide({
  section,
  sectionNumber,
  title,
  headers,
  rows,
  footnote,
}: ComparisonSlideProps) {
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-xl border border-white/10"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Dimension
              </th>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
                  style={{ color: i === 0 ? "#a1a1aa" : "#d4d4d8" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <motion.tr
                key={ri}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + ri * 0.08 }}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-6 py-4 text-base font-medium text-zinc-200">
                  {row.label}
                </td>
                {row.values.map((v, vi) => (
                  <td key={vi} className="px-6 py-4 text-base text-zinc-400">
                    {v}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {footnote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-sm italic text-zinc-500"
        >
          {footnote}
        </motion.p>
      )}
    </div>
  );
}
