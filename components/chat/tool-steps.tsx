"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Loader2, TriangleAlert, Wrench } from "lucide-react";
import { toolLabel } from "@/lib/companion-meta";

/**
 * The agent's tool calls, rendered as steps in the transcript.
 *
 * /api/chat runs a real multi-step loop (stopWhen: stepCountIs(5)), but the
 * transcript used to filter message parts down to `type === "text"` before
 * rendering. Every call the agent made was discarded, so a tool-using turn
 * showed a silent pause and the product read as though it were not agentic
 * at all. These chips are that missing feedback.
 */

export interface ToolStep {
  key: string;
  toolName: string;
  state: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

/** Pulls tool calls out of a message's parts, in the order the agent made them. */
export function toolStepsFromParts(parts: unknown[]): ToolStep[] {
  const steps: ToolStep[] = [];

  for (const raw of parts ?? []) {
    const part = raw as Record<string, unknown>;
    const type = typeof part.type === "string" ? part.type : "";
    if (!type.startsWith("tool-") && type !== "dynamic-tool") continue;

    const toolName =
      typeof part.toolName === "string" ? part.toolName : type.slice("tool-".length);

    steps.push({
      key: (part.toolCallId as string) ?? `${toolName}-${steps.length}`,
      toolName,
      state: typeof part.state === "string" ? part.state : "output-available",
      input: part.input,
      output: part.output,
      errorText: typeof part.errorText === "string" ? part.errorText : undefined,
    });
  }

  return steps;
}

function preview(value: unknown): string {
  if (value === undefined || value === null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function StepRow({ step }: { step: ToolStep }) {
  const [open, setOpen] = useState(false);

  const isError = step.state === "output-error";
  const isDone = step.state === "output-available" || isError;
  const hasDetail = step.input !== undefined || step.output !== undefined || !!step.errorText;

  return (
    <div className="rounded-lg border border-border/70 bg-muted/30">
      <button
        onClick={() => hasDetail && setOpen((v) => !v)}
        disabled={!hasDetail}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default"
      >
        {isError ? (
          <TriangleAlert className="h-3 w-3 shrink-0 text-destructive" />
        ) : isDone ? (
          <Check className="h-3 w-3 shrink-0 text-brand" />
        ) : (
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-brand" />
        )}

        <span className="flex-1 truncate">
          {isError ? `${toolLabel(step.toolName, true)} failed` : toolLabel(step.toolName, isDone)}
          {!isDone && "…"}
        </span>

        {hasDetail && (
          <ChevronRight
            className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {open && hasDetail && (
        <div className="space-y-2 border-t border-border/70 px-2.5 py-2">
          {step.errorText && (
            <p className="text-xs leading-relaxed text-destructive">{step.errorText}</p>
          )}
          {step.input !== undefined && preview(step.input) !== "{}" && (
            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Asked for
              </p>
              <pre className="max-h-40 overflow-auto rounded bg-background/60 p-2 text-[11px] leading-relaxed text-muted-foreground">
                {preview(step.input)}
              </pre>
            </div>
          )}
          {step.output !== undefined && (
            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Found
              </p>
              <pre className="max-h-60 overflow-auto rounded bg-background/60 p-2 text-[11px] leading-relaxed text-muted-foreground">
                {preview(step.output)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ToolSteps({ steps }: { steps: ToolStep[] }) {
  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="mb-3 space-y-1"
    >
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Wrench className="h-2.5 w-2.5" />
        {steps.length === 1 ? "1 step" : `${steps.length} steps`}
      </div>
      {steps.map((step) => (
        <StepRow key={step.key} step={step} />
      ))}
    </motion.div>
  );
}
