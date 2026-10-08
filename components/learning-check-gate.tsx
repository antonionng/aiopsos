"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useBotGuard, HoneypotField } from "@/components/form-bot-guard";

export function LearningCheckGate({ categories, answers, scope, onSuccess, onBack }: {
  categories: string[]; answers: Record<string, number>; scope: string; onSuccess: () => void; onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef("");
  const bot = useBotGuard();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/learning-check", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId.current, name, email, organisation_name: organisation, categories, answers, scope,
          capture_consent: consent, marketing_consent: marketing, ...bot.fields() }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "We couldn't save your details. Please try again.");
      onSuccess();
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="lms-panel" style={{ marginTop: 24 }}>
    <h1>Your answers are in. Find your next step.</h1>
    <p>Enter your name and email to unlock your learning priorities and download your snapshot.</p>
    <form onSubmit={submit} className="lms-form" style={{ position: "relative" }}>
      <HoneypotField value={bot.honeypot} onChange={bot.setHoneypot} />
      <label>Name<input required maxLength={200} autoComplete="name" value={name} onChange={e => { setName(e.target.value); requestId.current = ""; }} disabled={busy} /></label>
      <label>Email<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); requestId.current = ""; }} disabled={busy} /></label>
      <label>Organisation (optional)<input maxLength={300} autoComplete="organization" value={organisation} onChange={e => { setOrganisation(e.target.value); requestId.current = ""; }} disabled={busy} /></label>
      <label className="lms-check"><input required type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); requestId.current = ""; }} disabled={busy} />I agree to Experrt saving my details, answers and learning priorities to provide these results. <Link href="/privacy" target="_blank">Privacy notice</Link></label>
      <label className="lms-check"><input type="checkbox" checked={marketing} onChange={e => { setMarketing(e.target.checked); requestId.current = ""; }} disabled={busy} />Send me occasional learning ideas and updates from Experrt. Optional; unsubscribe at any time.</label>
      {error && <p role="alert">{error}</p>}
      <div className="lms-row"><button className="lms-button" disabled={busy || !consent}>{busy ? "Saving your results…" : "Unlock my results"}</button><button type="button" className="lms-button secondary" onClick={onBack} disabled={busy}>Review answers</button></div>
      <p className="lms-muted">This is a self-reported learning check, not a skills test or qualification. Your results are not added to an employer&apos;s records.</p>
    </form>
  </section>;
}
