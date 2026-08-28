"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/** The undo beside "you are unsubscribed". See the resubscribe route. */
export function InsightResubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function resubscribe() {
    setState("sending");
    try {
      const res = await fetch("/api/public/insights/resubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-emerald-500">
        <Check className="h-4 w-4" />
        You are back on the list.
      </p>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={resubscribe} disabled={state === "sending"}>
        {state === "sending" ? "Working..." : "Undo, keep me subscribed"}
      </Button>
      {state === "error" && (
        <p className="mt-2 text-sm text-destructive">
          That did not work. Subscribe again from the insights page.
        </p>
      )}
    </div>
  );
}
