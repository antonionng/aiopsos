"use client";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
export function AgentCoursePurchase({ slug, termsVersion, termsUrl, compact = false }: { slug: string; termsVersion: string; termsUrl: string; compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestKey = useRef<string | null>(null);
  async function buy() {
    if (busy) return;
    setBusy(true); setError("");
    requestKey.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/courses/agents/checkout", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current }, body: JSON.stringify({ slug, terms_version: termsVersion }) });
      if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Checkout could not be opened. Please try again.");
      const result = await response.json();
      if (result.code === "checkout_expired") requestKey.current = null;
      if (!response.ok) throw new Error(result.error || "Checkout could not be opened.");
      if (result.learning_url) window.location.assign(result.learning_url);
      else if (result.url) window.location.assign(result.url);
      else throw new Error("Checkout did not return a payment page. Please try again.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout could not be opened."); setBusy(false);
    }
  }
  return <div className={compact ? "agent-course-purchase agent-course-purchase-compact" : "agent-course-purchase"}>
    {!compact ? <p>Pay securely through Stripe using your email address and card. After payment, save a password or sign in to open your lessons and keep your work. Your £99 course fee includes 12 months of access, practical assessment and an Experrt certificate when you pass.</p> : null}
    <button type="button" className="agent-buy-button" disabled={busy} onClick={buy}>{busy ? "Opening secure checkout…" : "Buy this course for £99"}<ArrowRight size={18} /></button>
    {!compact ? <p className="agent-purchase-terms">You can read the <a href={termsUrl} target="_blank" rel="noopener noreferrer">course terms</a> before paying. You do not need to create an account before checkout.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
  </div>;
}
