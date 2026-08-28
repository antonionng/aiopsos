"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LITERACY_DISCLAIMER } from "@/lib/constants";

interface PackRow {
  id: string;
  period_start: string;
  period_end: string;
  generated_at: string;
}

/** First and last day of the quarter before the one we are in. */
function lastCompleteQuarter(today: Date): { start: string; end: string } {
  const q = Math.floor(today.getUTCMonth() / 3);
  const startMonth = (q - 1) * 3;
  const year = startMonth < 0 ? today.getUTCFullYear() - 1 : today.getUTCFullYear();
  const month = ((startMonth % 12) + 12) % 12;
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 3, 0));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function EvidencePage() {
  const [packs, setPacks] = useState<PackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [declaration, setDeclaration] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/evidence-packs", { cache: "no-store" });
    const data = await res.json();
    if (!data.error) setPacks(data.packs ?? []);
  }, []);

  useEffect(() => {
    // Default to the last complete quarter, which is what an auditor asks for.
    const { start, end } = lastCompleteQuarter(new Date());
    setPeriodStart(start);
    setPeriodEnd(end);
    load().finally(() => setLoading(false));
  }, [load]);

  async function generate() {
    if (!periodStart || !periodEnd) {
      toast.error("Choose a reporting period");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/evidence-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period_start: periodStart,
          period_end: periodEnd,
          declaration,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Could not generate the pack");
        return;
      }
      toast.success("Evidence pack generated");
      await load();
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading evidence packs...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="mb-1">Evidence Packs</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A dated record of the AI literacy measures your organisation has taken
          and the evidence for them: who was assessed, what gap that found, what
          training was delivered and by whom, who attended, how they were graded,
          and what changed in observed practice afterwards.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <h2 className="mb-3 text-sm font-semibold">Generated packs</h2>
          {packs.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                  <FileText className="h-6 w-6 text-brand" />
                </div>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  No packs yet. Generate one for a reporting period and it will be
                  frozen at that moment - regenerating it later produces the same
                  document.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {packs.map((pack) => (
                <Card key={pack.id} className="border-border bg-card">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(pack.period_start).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        –{" "}
                        {new Date(pack.period_end).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Generated{" "}
                        {new Date(pack.generated_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <a href={`/api/evidence-packs/${pack.id}/pdf`}>
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <h2 className="mb-3 text-sm font-semibold">Generate a pack</h2>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="start" className="text-xs">From</Label>
                  <Input
                    id="start"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="bg-surface"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end" className="text-xs">To</Label>
                  <Input
                    id="end"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="bg-surface"
                  />
                </div>
              </div>

              <div className="mb-3 space-y-1.5">
                <Label htmlFor="declaration" className="text-xs">
                  Scope declaration
                </Label>
                <Textarea
                  id="declaration"
                  value={declaration}
                  onChange={(e) => setDeclaration(e.target.value)}
                  placeholder="Which AI systems does your organisation deploy, and in what capacity? This is your statement, and appears in section 1."
                  className="min-h-[110px] bg-surface text-xs"
                />
              </div>

              <Button onClick={generate} disabled={generating} className="w-full" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                {generating ? "Assembling..." : "Generate pack"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">What it will not say</h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {LITERACY_DISCLAIMER}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Departments with fewer than five active users in the period are
                withheld from the observed-practice section, so no figure
                describes an identifiable individual.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
