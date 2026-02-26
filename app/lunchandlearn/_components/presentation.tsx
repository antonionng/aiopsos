"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { slides, type SlideType } from "./slide-data";
import { TitleSlide } from "./slides/title-slide";
import { ContentSlide } from "./slides/content-slide";
import { PersonSlide } from "./slides/person-slide";
import { SplitSlide } from "./slides/split-slide";
import { ComparisonSlide } from "./slides/comparison-slide";
import { QuizSlide } from "./slides/quiz-slide";
import { ActivitySlide } from "./slides/activity-slide";
import { GenerativeDemo } from "./demos/generative-demo";
import { AgenticDemo } from "./demos/agentic-demo";
import { RoleAdvisorDemo } from "./demos/role-advisor-demo";
import { LiveQADemo } from "./demos/live-qa-demo";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -800 : 800,
    opacity: 0,
  }),
};

function renderSlide(slide: SlideType) {
  switch (slide.type) {
    case "title":
      return <TitleSlide {...slide} />;
    case "content":
      return <ContentSlide {...slide} />;
    case "person":
      return <PersonSlide {...slide} />;
    case "split":
      return <SplitSlide {...slide} />;
    case "comparison":
      return <ComparisonSlide {...slide} />;
    case "quiz":
      return <QuizSlide {...slide} />;
    case "activity":
      return <ActivitySlide {...slide} />;
    case "demo-generative":
      return <GenerativeDemo />;
    case "demo-agentic":
      return <AgenticDemo />;
    case "demo-advisor":
      return <RoleAdvisorDemo />;
    case "demo-qa":
      return <LiveQADemo />;
  }
}

function isInteractiveSlide(slide: SlideType): boolean {
  return slide.type.startsWith("demo-") || slide.type === "quiz" || slide.type === "activity";
}

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number, dir?: number) => {
      if (index < 0 || index >= totalSlides) return;
      setDirection(dir ?? (index > currentSlide ? 1 : -1));
      setCurrentSlide(index);
    },
    [currentSlide, totalSlides]
  );

  const next = useCallback(() => goTo(currentSlide + 1, 1), [currentSlide, goTo]);
  const prev = useCallback(() => goTo(currentSlide - 1, -1), [currentSlide, goTo]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, toggleFullscreen, goTo, totalSlides]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          {renderSlide(slide)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/60 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {currentSlide < totalSlides - 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/60 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
        {/* Slide counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500">
            {currentSlide + 1} / {totalSlides}
          </span>
          {isInteractiveSlide(slide) && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
              INTERACTIVE
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-white"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">
            ← → navigate · F fullscreen
          </span>
          <button
            onClick={toggleFullscreen}
            className="rounded-md border border-white/10 bg-black/40 p-1.5 text-white/40 backdrop-blur-sm transition-all hover:text-white"
          >
            {isFullscreen ? (
              <Minimize className="h-3.5 w-3.5" />
            ) : (
              <Maximize className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
