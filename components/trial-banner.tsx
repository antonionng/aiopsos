"use client";

import { useState, useEffect } from "react";
import { Crown, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TrialBanner() {
  const [billing, setBilling] = useState<{
    status: string;
    trialEndsAt: string | null;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then(setBilling)
      .catch(() => {});
  }, []);

  if (dismissed || !billing) return null;
  if (billing.status !== "trialing") return null;

  const daysLeft = billing.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(billing.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  if (daysLeft <= 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-2.5 mb-6">
      <Crown className="h-4 w-4 shrink-0 text-foreground" />
      <p className="flex-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Pro trial</span> --{" "}
        {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining.
        All features unlocked.
      </p>
      <Link href="/dashboard/billing">
        <Button size="sm" variant="ghost" className="h-7 text-xs">
          Choose a plan
        </Button>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
