"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * "Yes, teach us this."
 *
 * Deliberately short. Anything beyond name, email, organisation and rough
 * headcount is a question better asked in the reply, and every extra field
 * costs enquiries. Works signed out; if the visitor happens to have an
 * account the API attaches their organisation server-side.
 */
export function CourseEnquiryForm({
  courseSlug,
  courseTitle,
  source = "course_page",
  compact = false,
}: {
  courseSlug?: string;
  courseTitle?: string;
  source?: "course_page" | "assessment_results" | "catalogue" | "dashboard";
  compact?: boolean;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation_name: "",
    seats: "",
    message: "",
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: courseSlug ?? null,
          name: form.name,
          email: form.email,
          organisation_name: form.organisation_name,
          message: form.message,
          seats: form.seats ? Number(form.seats) : null,
          source,
        }),
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
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="mb-1 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-semibold">Thank you — that has reached us.</p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          A real person reads these. We will come back within one working day
          with dates, what the session would cover for your team, and what it
          costs. Check your inbox for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {!compact && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {courseTitle
            ? `Tell us a little about your team and we will come back with dates and a price for ${courseTitle}.`
            : "Tell us a little about your team and we will come back with dates and a price."}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="enq-name" className="text-xs">Your name</Label>
          <Input id="enq-name" required value={form.name} onChange={set("name")}
                 placeholder="Jane Smith" className="h-10 bg-surface" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="enq-email" className="text-xs">Work email</Label>
          <Input id="enq-email" type="email" required value={form.email} onChange={set("email")}
                 placeholder="you@company.com" className="h-10 bg-surface" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="enq-org" className="text-xs">Organisation</Label>
          <Input id="enq-org" value={form.organisation_name} onChange={set("organisation_name")}
                 placeholder="Northwind" className="h-10 bg-surface" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="enq-seats" className="text-xs">Roughly how many people</Label>
          <Input id="enq-seats" inputMode="numeric" value={form.seats} onChange={set("seats")}
                 placeholder="12" className="h-10 bg-surface" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="enq-message" className="text-xs">
          Anything we should know? <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea id="enq-message" value={form.message} onChange={set("message")}
                  placeholder="Timing, location, the specific problem you are trying to fix."
                  className="min-h-[70px] bg-surface text-xs" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={sending} className="w-full">
        {sending ? "Sending..." : "Request this course"}
        {!sending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        We use this only to reply to you. No newsletter, no list.
      </p>
    </form>
  );
}
