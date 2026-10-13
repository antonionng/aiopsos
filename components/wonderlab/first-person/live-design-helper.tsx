"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LoaderCircle, Sparkles } from "lucide-react";
import {
  applyPracticeRequest,
  validateArcadeDesign,
  type ArcadeDesign,
  type WorldBand,
} from "@/lib/wonderlab/first-person";

type Intent = Partial<Omit<ArcadeDesign, "title">>;
type LiveContext = {
  mode: "practice" | "live-ai";
  child: { id: string; band: WorldBand } | null;
  remaining: number | null;
  reason: string;
};
type Props = {
  current: ArcadeDesign;
  request: string;
  band: WorldBand;
  onApply: (design: ArcadeDesign, explanation: string) => void;
  onBusyChange?: (busy: boolean) => void;
};
const SOURCE = "game-concept-studio";
const older = (band: string) => band === "creators" || band === "studio";

function intentFor(request: string, current: ArcadeDesign): Intent {
  const next = applyPracticeRequest(request, current).design;
  const intent: Intent = {};
  if (next.collectible !== current.collectible) intent.collectible = next.collectible;
  if (next.target !== current.target) intent.target = next.target;
  if (next.palette !== current.palette) intent.palette = next.palette;
  if (next.speed !== current.speed) intent.speed = next.speed;
  if (next.bonus !== current.bonus) intent.bonus = next.bonus;
  if (next.challenge !== current.challenge) intent.challenge = next.challenge;
  return intent;
}
function previewChanges(intent: Intent): string[] {
  const changes: string[] = [];
  if (intent.collectible) changes.push(`You will collect ${intent.collectible === "firefly" ? "fireflies" : `${intent.collectible}s`}.`);
  if (intent.target) changes.push(`You will need to collect ${intent.target} objects before you can finish.`);
  if (intent.palette) changes.push(`Your world will use ${intent.palette} colours.`);
  if (intent.speed) changes.push(`You will move at a ${intent.speed} walking speed.`);
  if (typeof intent.bonus === "boolean") changes.push(intent.bonus ? "Your world will include a golden bonus treasure." : "Your world will have no bonus treasure.");
  if (intent.challenge) changes.push(intent.challenge === "key" ? "You will need to find a key as well as the glowing objects to open the portal." : "Collecting all the glowing objects will open the portal without a key.");
  return changes;
}
function parseContext(value: unknown): LiveContext | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (
    !["practice", "live-ai"].includes(String(data.mode)) ||
    data.allowanceSource !== SOURCE ||
    typeof data.reason !== "string" ||
    data.reason.length > 500
  ) return null;
  const child = data.child && typeof data.child === "object"
    ? data.child as Record<string, unknown> : null;
  if (data.mode === "live-ai" && (
    !child || typeof child.id !== "string" || typeof child.band !== "string" || !older(child.band) ||
    typeof data.remaining !== "number" || !Number.isInteger(data.remaining) || data.remaining < 1 || data.remaining > 30
  )) return null;
  return {
    mode: data.mode as LiveContext["mode"],
    child: child && typeof child.id === "string" && typeof child.band === "string" && older(child.band)
      ? { id: child.id, band: child.band as WorldBand } : null,
    remaining: typeof data.remaining === "number" && Number.isInteger(data.remaining) && data.remaining >= 0 && data.remaining <= 30
      ? data.remaining : null,
    reason: data.reason,
  };
}

/** Raw words are parsed locally; the server receives only the supported changes. */
export function LiveDesignHelper({ current, request, band, onApply, onBusyChange }: Props) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<LiveContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [contextError, setContextError] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const alive = useRef(true);
  const contextController = useRef<AbortController | null>(null);
  const designController = useRef<AbortController | null>(null);
  const attemptedContext = useRef(false);
  const retry = useRef<{ fingerprint: string; requestId: string } | null>(null);
  const callbacks = useRef({ onApply, onBusyChange });
  const latest = useRef({ current, request, band });
  const intent = intentFor(request, current);
  const changes = previewChanges(intent);
  const eligible = older(band) && context?.mode === "live-ai" && !!context.child;

  useEffect(() => {
    callbacks.current = { onApply, onBusyChange };
    latest.current = { current, request, band };
  }, [onApply, onBusyChange, current, request, band]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      contextController.current?.abort();
      designController.current?.abort();
      callbacks.current.onBusyChange?.(false);
    };
  }, []);

  async function loadContext() {
    if (contextController.current || !older(band)) return;
    attemptedContext.current = true;
    const controller = new AbortController();
    contextController.current = controller;
    setLoading(true);
    setContextError("");
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/api/wonderlab/arcade-design", {
        cache: "no-store",
        credentials: "same-origin",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Context unavailable");
      const next = parseContext(await response.json());
      if (!next) throw new Error("Invalid context");
      if (alive.current) setContext(next);
    } catch {
      if (alive.current) setContextError("Live AI is unavailable right now. You can keep creating with prepared practice.");
    } finally {
      window.clearTimeout(timeout);
      contextController.current = null;
      if (alive.current) setLoading(false);
    }
  }

  function toggle() {
    if (busy) return;
    setOpen(!open);
    if (!open && older(band) && !attemptedContext.current) void loadContext();
  }

  async function askAi() {
    if (designController.current || !eligible || !context?.child || !changes.length) return;
    if (!globalThis.crypto?.randomUUID) {
      setMessage("Open Wonderlab using its secure website address to use live AI. Prepared practice is available here.");
      return;
    }
    const snapshot = { ...current };
    const snapshotRequest = request;
    const snapshotBand = band;
    const childId = context.child.id;
    const safeCurrent = { ...snapshot, title: "The Lantern Arcade" };
    const fingerprint = JSON.stringify({ childId, current: safeCurrent, intent });
    if (retry.current?.fingerprint !== fingerprint)
      retry.current = { fingerprint, requestId: crypto.randomUUID() };
    const requestId = retry.current.requestId;
    const controller = new AbortController();
    designController.current = controller;
    setBusy(true);
    setMessage("");
    callbacks.current.onBusyChange?.(true);
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 55000);
    try {
      const response = await fetch("/api/wonderlab/arcade-design", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, requestId, allowanceSource: SOURCE, current: safeCurrent, intent }),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        // These replies confirm that this request was rejected. Timeouts and
        // ambiguous failures keep the UUID so retrying cannot charge twice.
        if ([400, 401, 403, 422].includes(response.status)) retry.current = null;
        if (response.status === 401 || response.status === 403) {
          if (alive.current) setContext(null);
          throw new Error("Ask your grown-up to open an eligible profile in the family area. You can keep using prepared practice.");
        }
        const error = result && typeof result === "object" && "error" in result ? result.error : null;
        throw new Error(typeof error === "string" && error.length <= 500 ? error : "AI could not finish your design. Try again or use prepared practice.");
      }
      const data = result && typeof result === "object" ? result as Record<string, unknown> : null;
      const design = validateArcadeDesign(data?.design);
      if (
        !design || data?.source !== "live-ai" || typeof data.explanation !== "string" ||
        !data.explanation.trim() || data.explanation.length > 350 || /[<>\u0000-\u001f]/u.test(data.explanation)
      ) throw new Error("The AI design could not be opened. Try again to recover it or continue with prepared practice.");
      const expected = { ...safeCurrent, ...intent };
      if (["collectible", "target", "palette", "speed", "bonus", "challenge"].some((key) => design[key as keyof ArcadeDesign] !== expected[key as keyof ArcadeDesign]))
        throw new Error("The AI design did not match these changes. You can continue with prepared practice.");
      if (!alive.current) return;
      // An external update or changed age view must never be overwritten by a
      // response for the previous design, even if the parent missed the lock.
      if (JSON.stringify(latest.current.current) !== JSON.stringify(snapshot) || latest.current.request !== snapshotRequest || latest.current.band !== snapshotBand) {
        setMessage("Your game changed while AI was working, so its response has not replaced your current design. You can use prepared practice for your latest changes.");
        return;
      }
      callbacks.current.onApply(design, data.explanation.trim());
      setMessage("AI gave your design a fictional name and explained your changes. You can now play your creation.");
      setContext((previous) => previous ? {
        ...previous,
        remaining: Math.max(0, (previous.remaining ?? 1) - 1),
        mode: (previous.remaining ?? 1) > 1 ? "live-ai" : "practice",
        reason: (previous.remaining ?? 1) > 1 ? previous.reason : "You have used this game's AI responses. You can keep creating with prepared practice.",
      } : previous);
    } catch (error) {
      if (alive.current) setMessage(timedOut
        ? "AI is taking longer than expected. Your current game is unchanged. You can retry the same request to recover its result or use prepared practice."
        : error instanceof Error && error.name !== "AbortError"
          ? error.message
          : "The connection stopped before we received your design. You can retry the same request or use prepared practice.");
    } finally {
      window.clearTimeout(timeout);
      designController.current = null;
      if (alive.current) {
        setBusy(false);
        callbacks.current.onBusyChange?.(false);
      }
    }
  }

  return (
    <section className="fp-live-helper" aria-busy={busy || loading}>
      <button type="button" className="fp-live-toggle" aria-expanded={open} aria-controls={panelId} onClick={toggle} disabled={busy}>
        <Sparkles size={16} aria-hidden="true" />
        <span>Give your design an AI-created name.</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && <div id={panelId} className="fp-live-panel">
        {!older(band) ? <p>You can build and name your game using prepared practice. This optional live AI tool is for parent-enabled profiles aged 11 to 16.</p> : <>
          <p>The game kit works out supported changes from your words. OpenAI can give that design a fictional name and explain the changes. Your typed words stay on this device.</p>
          {loading && <p className="fp-live-status" role="status"><LoaderCircle size={16} aria-hidden="true" /> We are checking whether live AI is available for this profile.</p>}
          {contextError && <p className="fp-live-status" role="status">{contextError}</p>}
          {!loading && !context && <button type="button" className="fp-live-check" onClick={() => void loadContext()}>Check live AI availability.</button>}
          {!loading && context?.mode === "practice" && <p className="fp-live-status">{context.reason}</p>}
          {!loading && !eligible && <p><Link className="fp-live-family" href="/wonderlab/family">Grown-ups can open a profile in the family area.</Link></p>}
          {eligible && <>
            <p className="fp-live-allowance">This profile has {context?.remaining} Game Concept Studio AI responses remaining. Each successful AI design uses one response from that game. Prepared practice does not use this allowance.</p>
            {changes.length ? <ul className="fp-live-changes">{changes.map((change) => <li key={change}>{change}</li>)}</ul> : <p>Write a supported change before asking AI. You can change the objects, their number, the world colours, walking speed, bonus treasure or whether the portal needs a key.</p>}
            <button type="button" className="fp-live-submit" disabled={busy || !changes.length} onClick={() => void askAi()}>
              {busy ? <LoaderCircle size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
              {busy ? "AI is naming and explaining your design." : "Ask AI to name and explain my design"}
            </button>
          </>}
          {message && <p className="fp-live-status" role="status" aria-live="polite">{message}</p>}
        </>}
      </div>}
    </section>
  );
}
