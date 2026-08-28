"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bot, GraduationCap, LineChart, Users } from "lucide-react";

/**
 * "Conversations in action" - a self-playing demo of the three role-based
 * companions. Each companion's thread plays out message by message (with a
 * visible tool call, because the tools are the product), holds, then hands
 * over to the next companion. With reduced motion the threads render
 * complete and the tabs become plain navigation.
 *
 * Scripted, not live: these are honest portrayals of what each companion's
 * toolset can and cannot do - including the insights companion declining an
 * individual-usage question, which is the privacy stance said out loud.
 */

type Line =
  | { kind: "user"; text: string }
  | { kind: "tool"; text: string }
  | { kind: "ai"; text: string };

interface Script {
  id: "learning" | "ld" | "insights";
  label: string;
  audience: string;
  icon: typeof GraduationCap;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  lines: Line[];
}

const SCRIPTS: Script[] = [
  {
    id: "learning",
    label: "Learning agent",
    audience: "For every learner",
    icon: GraduationCap,
    accentText: "text-cat-technology",
    accentBg: "bg-cat-technology-soft",
    accentBorder: "border-cat-technology/40",
    lines: [
      { kind: "user", text: "What should I work on next?" },
      { kind: "tool", text: "Reading your assessment and course history…" },
      {
        kind: "ai",
        text: "Responsible use is your widest gap. Responsible AI Use at Work runs next month - six facilitated hours, and it targets the two habits your assessment flagged.",
      },
      { kind: "user", text: "How am I doing on my current course?" },
      { kind: "tool", text: "Checking your attendance and released grades…" },
      {
        kind: "ai",
        text: "You have attended four of five sessions, and your facilitator has released grades for modules 1–3. The rest follow after Thursday's session.",
      },
    ],
  },
  {
    id: "ld",
    label: "L&D agent",
    audience: "For L&D teams",
    icon: Users,
    accentText: "text-cat-ai",
    accentBg: "bg-cat-ai-soft",
    accentBorder: "border-cat-ai/40",
    lines: [
      { kind: "user", text: "How is the operations cohort doing?" },
      { kind: "tool", text: "Pulling cohort attendance and completions…" },
      {
        kind: "ai",
        text: "Eleven of twelve are on track and attendance sits at 92%. Two people missed session three - the facilitator has already flagged a catch-up.",
      },
      { kind: "user", text: "Who should we train next quarter?" },
      { kind: "tool", text: "Aggregating assessment scores by department…" },
      {
        kind: "ai",
        text: "Finance has the widest gap: tool access scores high but daily practice averages 1.8. A practitioner cohort there closes it fastest.",
      },
    ],
  },
  {
    id: "insights",
    label: "Insights agent",
    audience: "For owners & managers",
    icon: LineChart,
    accentText: "text-cat-robotics",
    accentBg: "bg-cat-robotics-soft",
    accentBorder: "border-cat-robotics/40",
    lines: [
      { kind: "user", text: "What training has Priya completed?" },
      { kind: "tool", text: "Fetching her training record…" },
      {
        kind: "ai",
        text: "Priya completed Prompting and Output Verification in June - full attendance, and her certificate is verifiable by any third party.",
      },
      { kind: "user", text: "And how is she using AI day to day?" },
      {
        kind: "ai",
        text: "That I won't report. Individual usage doesn't exist here - only department aggregates, so people can work without being individually watched. Marketing as a team: 14 active users this month.",
      },
    ],
  },
];

const STEP_MS = 1500;
const HOLD_MS = 3200;

export function CompanionShowcase() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const script = SCRIPTS[active];
  const total = script.lines.length;
  // With reduced motion (or after a manual tab click pauses autoplay) the
  // whole thread is on screen at once.
  const visible = reduceMotion ? total : Math.min(step, total);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const done = step >= total;
    const t = setTimeout(
      () => {
        if (done) {
          setActive((a) => (a + 1) % SCRIPTS.length);
          setStep(0);
        } else {
          setStep((s) => s + 1);
        }
      },
      done ? HOLD_MS : STEP_MS
    );
    return () => clearTimeout(t);
  }, [step, total, reduceMotion, paused, active]);

  const selectTab = (i: number) => {
    setActive(i);
    setStep(reduceMotion ? SCRIPTS[i].lines.length : 1);
    setPaused(true);
  };

  const lines = useMemo(() => script.lines.slice(0, visible), [script, visible]);
  const typing =
    !reduceMotion && visible < total && script.lines[visible]?.kind === "ai";

  return (
    <div>
      {/* Companion tabs */}
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {SCRIPTS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === active;
          return (
            <button
              key={s.id}
              onClick={() => selectTab(i)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isActive
                  ? `${s.accentBorder} ${s.accentBg}`
                  : "border-border bg-card hover:border-foreground/20"
              }`}
              aria-pressed={isActive}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Icon
                  className={`h-4 w-4 ${isActive ? s.accentText : "text-muted-foreground"}`}
                />
                <span className="text-sm font-semibold">{s.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.audience}</p>
              {/* Autoplay progress */}
              {!reduceMotion && !paused && isActive && (
                <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    key={`${s.id}-${active}`}
                    className={`h-full rounded-full ${s.accentText.replace("text-", "bg-")}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(visible / total) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* The conversation */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full ${script.accentBg}`}
          >
            <Bot className={`h-4 w-4 ${script.accentText}`} />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{script.label}</p>
            <p className="text-[11px] text-muted-foreground">{script.audience}</p>
          </div>
        </div>

        <div className="min-h-[19rem] space-y-3 sm:min-h-[17rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            {lines.map((line, i) => (
              <motion.div
                key={`${script.id}-${i}`}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {line.kind === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-background sm:max-w-[70%]">
                      {line.text}
                    </div>
                  </div>
                )}
                {line.kind === "tool" && (
                  <div className="flex">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] ${script.accentText}`}
                    >
                      <motion.span
                        className={`h-1.5 w-1.5 rounded-full ${script.accentText.replace("text-", "bg-")}`}
                        animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      {line.text}
                    </span>
                  </div>
                )}
                {line.kind === "ai" && (
                  <div className="flex">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-muted/40 px-3.5 py-2 text-sm leading-relaxed sm:max-w-[75%]">
                      {line.text}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {typing && (
              <motion.div
                key={`${script.id}-typing-${visible}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex"
              >
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-muted/40 px-3.5 py-2.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
