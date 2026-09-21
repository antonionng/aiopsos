"use client";
import { useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AcceptInvite() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function accept() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const workspace = params.get("workspace");
    if (!token || !workspace) { setError("Open the complete invitation link from your email."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/accept-invite", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, workspace }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not accept your invitation.");
      window.history.replaceState(null, "", "/accept-invite");
      window.location.assign("/reset-password");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
    <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
      <Link href="/" className="inline-flex" aria-label="Experrt home"><Wordmark size="md" /></Link>
      <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand"><BookOpen aria-hidden="true" size={28} /></div>
      <p className="mt-7 text-sm font-semibold text-brand">YOUR NEXT CHAPTER</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Your team is ready.<br />Join them.</h1>
      <p className="mt-5 leading-relaxed text-muted-foreground">Accept your invitation to open your learning workspace. You’ll choose your own password next.</p>
      <div className="my-7 flex items-center gap-3 text-sm"><CheckCircle2 aria-hidden="true" className="shrink-0 text-brand" size={20} /> Courses, practical activities and feedback, together.</div>
      {error && <p role="alert" className="mb-5 rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}
      <Button className="h-12 w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90" onClick={accept} disabled={busy}>{busy ? "Opening your workspace…" : "Accept invitation"}<ArrowRight aria-hidden="true" size={18} /></Button>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This link is single-use. If you weren’t expecting an invitation, you can leave this page without accepting.</p>
    </section>
  </main>;
}
