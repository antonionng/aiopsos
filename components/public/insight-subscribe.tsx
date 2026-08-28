"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Email capture for the insights section.
 *
 * One field. The enquiry form already exists for people who want to talk
 * about dates and price; this is for the reader who is not ready for that
 * conversation and would otherwise leave without becoming reachable. Asking
 * for a name or an organisation here would trade a meaningful share of
 * sign-ups for two fields nobody reads.
 *
 * The success copy names the double opt-in explicitly. A reader who is not
 * told to expect a confirmation email assumes they are subscribed, never
 * clicks, and quietly never hears from us again.
 */

type Source = "insights_index" | "insights_article" | "courses" | "use_cases";

export function InsightSubscribe({
  source,
  sourceSlug,
  heading = "Get the next briefing",
  blurb = "One email when a new insight goes up. Usually weekly, often less. No course marketing in between, and one click unsubscribes you from any of them.",
}: {
  source: Source;
  sourceSlug?: string;
  heading?: string;
  blurb?: string;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/public/insights/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, source_slug: sourceSlug ?? null }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="mb-2 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-semibold">Check your inbox</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We have sent a confirmation link to {email}. Click it and you are on
          the list. Nothing is sent until you do.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-2 flex items-center gap-2">
        <Mail className="h-4 w-4 text-brand" />
        <h2 className="text-base font-semibold tracking-[-0.01em]">{heading}</h2>
      </div>
      <p className="mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {blurb}
      </p>

      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@organisation.com"
          aria-label="Email address"
          autoComplete="email"
          className="sm:max-w-xs"
        />
        <Button type="submit" disabled={sending} className="group shrink-0">
          {sending ? "Sending..." : "Subscribe"}
          {!sending && (
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        We use your address for the insights list only. See the{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          privacy notice
        </a>
        .
      </p>
    </div>
  );
}
