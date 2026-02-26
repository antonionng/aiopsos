"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizSlideProps {
  section: string;
  sectionNumber?: number;
  title: string;
  questions: QuizQuestion[];
}

export function QuizSlide({ section, sectionNumber, title, questions }: QuizSlideProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQ];
  const isFinished = currentQ >= questions.length;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    setCurrentQ((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

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

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 rounded-xl border border-white/20 bg-white/5 p-12"
          >
            <span className="text-6xl font-bold text-white">
              {score}/{questions.length}
            </span>
            <p className="text-xl text-zinc-300">
              {score === questions.length
                ? "Perfect score!"
                : score >= questions.length / 2
                  ? "Great job!"
                  : "Keep learning!"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-sm text-zinc-400">Score: {score}</span>
            </div>

            <p className="mb-8 text-2xl font-semibold text-white">{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let bg = "bg-white/[0.03] border-white/10 hover:border-white/20";
                if (answered) {
                  if (i === q.correct) bg = "bg-white/10 border-white/30";
                  else if (i === selected) bg = "bg-red-500/10 border-red-500/40";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    className={`w-full rounded-xl border p-4 text-left text-lg transition-all ${bg} ${
                      !answered ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-sm font-bold text-zinc-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-zinc-200">{opt}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="mt-6 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
