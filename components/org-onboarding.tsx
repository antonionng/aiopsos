"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/wordmark";

/**
 * Shown when a signed-in user has no organisation.
 *
 * That state used to be terminal and unexplained: the hub told them to take
 * an assessment, the assessment page said their admin had not created one,
 * and nothing could create or join an org. Two honest branches are offered
 * instead, and neither happens automatically - creating an org for someone
 * who is mid-invite would quietly split them off from their colleagues.
 */
export function OrgOnboarding({ email }: { email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function createOrg(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/organisation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Could not create your organisation.");
        return;
      }
      router.push("/dashboard/hub");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Wordmark size="lg" className="mx-auto mb-6" />
          <h1 className="mb-2 text-2xl font-bold tracking-[-0.02em]">
            One more step
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your account isn&apos;t attached to an organisation yet. Everything
            in Experrt — assessments, cohorts, training records — belongs to
            one.
          </p>
        </div>

        <form
          onSubmit={createOrg}
          className="mb-4 rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Create your organisation</h2>
          </div>
          <div className="mb-3 space-y-1.5">
            <Label htmlFor="org-name" className="text-xs">
              Organisation name
            </Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Northwind Financial"
              required
              className="h-10 bg-surface"
            />
          </div>
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={creating} className="w-full" size="sm">
            {creating ? "Creating..." : "Create and continue"}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              Waiting to join a colleague&apos;s organisation?
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Don&apos;t create one here — that would put you in a separate
            organisation from your team. Ask whoever runs Experrt where you
            work to invite <span className="text-foreground">{email}</span>, or
            send you their assessment link. Both attach you to the right place
            automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
