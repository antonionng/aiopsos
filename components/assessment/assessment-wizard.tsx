"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ASSESSMENT_QUESTIONS, type AssessmentQuestion } from "@/lib/scoring";
import {
  DIMENSION_LABELS,
  RESPONDENT_ROLES,
  RESPONDENT_ROLE_LABELS,
  AI_TOOL_OPTIONS,
  type RespondentRole,
  type Dimension,
} from "@/lib/constants";

interface AssessmentWizardProps {
  onComplete: (answers: Record<string, number>, meta: { role: string; toolsUsed: string[] }) => void;
  branding?: { orgName: string; logoUrl?: string | null };
  submitting?: boolean;
  questions?: AssessmentQuestion[];
  dimensionLabels?: Record<string, string>;
}

type Step = "role" | "questions" | "tools";

export function AssessmentWizard({
  onComplete,
  branding,
  submitting,
  questions: questionsProp,
  dimensionLabels: dimensionLabelsProp,
}: AssessmentWizardProps) {
  const questions = questionsProp ?? ASSESSMENT_QUESTIONS;
  const dimLabels = (dimensionLabelsProp ?? DIMENSION_LABELS) as Record<Dimension, string>;

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<RespondentRole | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [swipeDir, setSwipeDir] = useState<1 | -1>(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const totalSteps = totalQuestions + 2;
  const currentStep =
    step === "role" ? 1 : step === "questions" ? currentIndex + 2 : totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  const currentDimension = question?.dimension;
  const dimQuestions = questions.filter(
    (q) => q.dimension === currentDimension
  );
  const dimIndex = dimQuestions.indexOf(question);

  const haptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  function selectAnswer(value: number) {
    haptic();
    setAnswers({ ...answers, [question.id]: value });

    // Auto-advance after 300ms
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      setSwipeDir(1);
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStep("tools");
      }
    }, 300);
  }

  function toggleTool(tool: string) {
    haptic();
    if (tool === "None") {
      setSelectedTools((prev) => (prev.includes("None") ? [] : ["None"]));
      return;
    }
    setSelectedTools((prev) => {
      const without = prev.filter((t) => t !== "None");
      return without.includes(tool)
        ? without.filter((t) => t !== tool)
        : [...without, tool];
    });
  }

  function handleNext() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setSwipeDir(1);
    if (step === "role") {
      setStep("questions");
    } else if (step === "questions") {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStep("tools");
      }
    } else {
      onComplete(answers, { role: role!, toolsUsed: selectedTools });
    }
  }

  function handlePrev() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setSwipeDir(-1);
    if (step === "tools") {
      setStep("questions");
      setCurrentIndex(totalQuestions - 1);
    } else if (step === "questions" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (step === "questions" && currentIndex === 0) {
      setStep("role");
    }
  }

  // Swipe handling
  function handleDragEnd(_: unknown, info: PanInfo) {
    const threshold = 50;
    if (info.offset.x < -threshold && canProceed) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  }

  const canProceed =
    step === "role"
      ? role !== null
      : step === "questions"
        ? answers[question?.id] !== undefined
        : selectedTools.length > 0;

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="mx-auto max-w-2xl min-h-[100dvh] sm:min-h-0 flex flex-col">
      {branding && (
        <div className="mb-8 flex items-center justify-center gap-3">
          {branding.logoUrl && (
            <img
              src={branding.logoUrl}
              alt={branding.orgName}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {branding.orgName}
          </span>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        {/* Sticky progress bar */}
        <div className="mb-8 sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-3 pt-1 -mx-1 px-1">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {step === "role"
                ? "About You"
                : step === "tools"
                  ? "Your AI Toolkit"
                  : `${dimLabels[currentDimension]} - Question ${dimIndex + 1} of ${dimQuestions.length}`}
            </span>
            <span>
              {currentStep} / {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Swipeable content area */}
        <div className="flex-1">
          <AnimatePresence mode="wait" custom={swipeDir}>
            {step === "role" && (
              <motion.div
                key="role-select"
                custom={swipeDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
              >
                <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
                  What best describes your role?
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  This helps us understand perspectives across the organisation. It won&apos;t change your questions.
                </p>
                <div className="space-y-2">
                  {RESPONDENT_ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`w-full rounded-xl border p-4 min-h-[56px] text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                        role === r
                          ? "border-brand bg-brand/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-brand/30"
                      }`}
                    >
                      {RESPONDENT_ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "questions" && (
              <motion.div
                key={question.id}
                custom={swipeDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
              >
                <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
                  {question.text}
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  {question.description}
                </p>

                <div className="space-y-2">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={`w-full rounded-xl border p-4 min-h-[56px] text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                        answers[question.id] === opt.value
                          ? "border-brand bg-brand/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-brand/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-7 w-7 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            answers[question.id] === opt.value
                              ? "bg-brand text-brand-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {opt.value}
                        </div>
                        {opt.label}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "tools" && (
              <motion.div
                key="tools-select"
                custom={swipeDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
              >
                <h2 className="mb-2 text-xl font-semibold tracking-[-0.01em]">
                  Which AI tools do you currently use?
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Select all that apply. This isn&apos;t scored - it helps us understand the tool landscape.
                </p>
                <div className="space-y-2">
                  {AI_TOOL_OPTIONS.map((tool) => {
                    const selected = selectedTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`w-full rounded-xl border p-4 min-h-[56px] text-left text-sm transition-all duration-150 active:scale-[0.98] ${
                          selected
                            ? "border-brand bg-brand/5 text-foreground"
                            : "border-border bg-card text-foreground hover:border-brand/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md text-xs ${
                              selected
                                ? "bg-brand text-brand-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                          </div>
                          {tool}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom-anchored nav (fixed on mobile, normal on desktop) */}
        <div className="mt-8 flex items-center justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={step === "role"}
            className="min-h-[44px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || submitting}
            className="bg-brand text-brand-foreground hover:bg-brand/90 min-h-[44px]"
          >
            {submitting
              ? "Submitting..."
              : step === "tools"
                ? "Submit"
                : "Next"}
            {step !== "tools" && !submitting && (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
