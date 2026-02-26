"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface PersonSlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string[];
  personal?: string;
}

export function PersonSlide({
  section,
  sectionNumber,
  title,
  name,
  role,
  imageUrl,
  bio,
  personal,
}: PersonSlideProps) {
  const [imageError, setImageError] = useState(false);

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
        className="mb-8 text-4xl font-bold tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex shrink-0"
        >
          {imageError ? (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-zinc-400 sm:h-48 sm:w-48">
              AG
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={name}
              width={192}
              height={192}
              className="h-40 w-40 rounded-full object-cover sm:h-48 sm:w-48"
              onError={() => setImageError(true)}
            />
          )}
        </motion.div>
        <div className="min-w-0 flex-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-2xl font-semibold text-white">{name}</h3>
            <p className="text-sm text-zinc-400">{role}</p>
          </motion.div>
          {bio.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="text-base leading-relaxed text-zinc-300 md:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}
          {personal && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-zinc-400"
            >
              {personal}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
