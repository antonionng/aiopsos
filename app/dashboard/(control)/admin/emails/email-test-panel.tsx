"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Sample = {
  id: string;
  audience: "Customer" | "Owner";
  trigger: string;
  subject: string;
  html: string;
};

type Result = { id: string; ok: boolean; error?: string };

export function EmailTestPanel({ samples, notifyEmail }: { samples: Sample[]; notifyEmail: string }) {
  const [sending, setSending] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function send(ids?: string[]) {
    setSending(ids?.[0] ?? "all");
    setMessage(null);
    try {
      const res = await fetch("/api/super-admin/email-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = (await res.json()) as { to?: string; results?: Result[]; error?: string };
      if (!res.ok || !data.results) {
        setMessage(data.error ?? "The test emails could not be sent.");
        return;
      }
      setResults((current) => ({
        ...current,
        ...Object.fromEntries(data.results!.map((result) => [result.id, result])),
      }));
      const failed = data.results.filter((result) => !result.ok).length;
      setMessage(
        failed
          ? `${data.results.length - failed} sent to ${data.to}. ${failed} failed; see the cards below.`
          : `${data.results.length} sent to ${data.to}. Each subject starts with [Test].`
      );
    } catch {
      setMessage("The test emails could not be sent.");
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Emails</h1>
          <p className="text-sm text-muted-foreground">
            Every email a learner or the owner receives, rendered from the live templates with sample
            data. Sending delivers them to {notifyEmail}, which is also where owner alerts go.
          </p>
        </div>
        <Button onClick={() => send()} disabled={sending !== null}>
          {sending === "all" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
          Send all {samples.length} to {notifyEmail}
        </Button>
      </div>
      {message ? <p className="rounded-xl border px-4 py-3 text-sm">{message}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {samples.map((sample) => {
          const result = results[sample.id];
          return (
            <section key={sample.id} className="overflow-hidden rounded-2xl border">
              <div className="space-y-2 border-b p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={sample.audience === "Owner" ? "secondary" : "default"}>
                    {sample.audience === "Owner" ? `Owner · ${notifyEmail}` : "Customer"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => send([sample.id])}
                    disabled={sending !== null}
                  >
                    {sending === sample.id ? (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <Mail className="mr-2 size-3.5" />
                    )}
                    Send test
                  </Button>
                </div>
                <p className="text-sm font-medium">{sample.subject}</p>
                <p className="text-xs text-muted-foreground">{sample.trigger}</p>
                {result ? (
                  <p className={`text-xs ${result.ok ? "text-emerald-600" : "text-destructive"}`}>
                    {result.ok ? "Sent." : `Failed: ${result.error}`}
                  </p>
                ) : null}
              </div>
              <iframe
                title={sample.subject}
                srcDoc={sample.html}
                sandbox=""
                className="h-[560px] w-full bg-[#201C29]"
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
