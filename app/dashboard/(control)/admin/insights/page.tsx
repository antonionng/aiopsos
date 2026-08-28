"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Article {
  slug: string;
  title: string;
  topic: string;
  publishedAt: string;
  readingMinutes: number;
  sentAt: string | null;
  recipients: number;
  failures: number;
}

interface Counts {
  pending: number;
  confirmed: number;
  unsubscribed: number;
}

/**
 * The insights list, and the button that mails an article to it.
 *
 * Articles live in the repo, so publishing one is a deploy, not a database
 * write. That means nothing can automatically decide the list should be
 * mailed: a deploy touching an unrelated page would otherwise fire a
 * broadcast. Sending is a deliberate press here, behind a confirmation,
 * which is also the right shape for the thing itself. There is no recall on
 * an email that has gone.
 */
export default function AdminInsightsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingSend, setPendingSend] = useState<Article | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/insights");
      if (!res.ok) {
        toast.error("Could not load the insights list.");
        return;
      }
      const data = await res.json();
      setArticles(data.articles ?? []);
      setCounts(data.counts ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function send() {
    if (!pendingSend) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pendingSend.slug }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "The broadcast failed.");
        return;
      }
      toast.success(data.message ?? "Sent.");
      setPendingSend(null);
      await load();
    } catch {
      toast.error("Network error. Nothing further was sent.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">
          Insights list
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone who confirmed a subscription from the public insights pages,
          and which briefings have gone out to them.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts?.confirmed ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mailable. These are the only addresses a broadcast reaches.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" />
              Awaiting confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts?.pending ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Signed up but never clicked the link. Never mailed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unsubscribed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts?.unsubscribed ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Kept on record so they are never re-added by accident.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {article.topic}
                </Badge>
                {article.sentAt ? (
                  <span className="text-xs text-emerald-500">
                    Sent to {article.recipients}
                    {article.failures > 0 && `, ${article.failures} failed`}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Not sent</span>
                )}
              </div>
              <p className="truncate text-sm font-semibold">{article.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Published {article.publishedAt} &middot;{" "}
                {article.readingMinutes} min read
              </p>
            </div>
            <Button
              variant={article.sentAt ? "outline" : "default"}
              className="shrink-0"
              onClick={() => setPendingSend(article)}
            >
              <Send className="mr-1.5 h-4 w-4" />
              {article.sentAt ? "Send to new subscribers" : "Send to list"}
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={!!pendingSend}
        onOpenChange={(open) => !open && !sending && setPendingSend(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send this to the list?</DialogTitle>
            <DialogDescription>
              {pendingSend?.title}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This mails every confirmed subscriber who has not already had this
            briefing, currently up to {counts?.confirmed ?? 0} people. Anyone
            who already received it is skipped. There is no way to recall an
            email once it is sent.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingSend(null)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={send} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send className="mr-1.5 h-4 w-4" />
                  Send now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
