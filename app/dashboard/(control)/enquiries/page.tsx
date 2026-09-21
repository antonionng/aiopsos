"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ASSESSMENT_TEMPLATES } from "@/lib/assessment-templates";
import { Badge } from "@/components/ui/badge";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  organisation_name: string;
  message: string;
  seats: number | null;
  source: string;
  status: string;
  created_at: string;
  marketing_consent: boolean;
  assessment_data: { answers?: Record<string, number> } | null;
  courses: { slug: string; title: string } | null;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  contacted: "outline",
  scheduled: "outline",
  closed: "secondary",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/enquiries", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) throw new Error("We couldn’t load enquiries. Please refresh to try again.");
        setEnquiries(d.enquiries ?? []);
      })
      .catch(() => { if (!cancelled) setError("We couldn’t load enquiries. Please refresh to try again."); })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading enquiries...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="mb-1">Enquiries</h1>
        <p className="text-sm text-muted-foreground">
          Conversations from the contact form, course enquiries and learning checks. Details are saved here before email notifications are attempted.
        </p>
      </div>

      {error ? <p role="alert">{error}</p> : enquiries.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
              <Inbox className="h-6 w-6 text-brand" />
            </div>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              No enquiries yet. They arrive from course pages and from the
              recommendations someone sees after an assessment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <Card key={e.id} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {e.name}
                      {e.organisation_name ? ` · ${e.organisation_name}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.courses ? (
                        <Link
                          href={`/courses/${e.courses.slug}`}
                          target="_blank"
                          className="hover:text-brand"
                        >
                          {e.courses.title}
                        </Link>
                      ) : (
                        "General enquiry"
                      )}
                      {e.seats ? ` · about ${e.seats} people` : ""}
                      {` · from ${e.source.replace(/_/g, " ")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[e.status] ?? "outline"} className="text-[10px]">
                      {e.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {e.message && (
                  <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {e.message}
                  </p>
                )}

                {e.assessment_data?.answers && <details className="mb-4 rounded-xl border border-border p-4"><summary className="cursor-pointer text-sm font-medium">View learning-check answers</summary><dl className="mt-3 space-y-3">{ASSESSMENT_TEMPLATES["training-needs"].questions.filter(q => e.assessment_data?.answers?.[q.id] !== undefined).map(q => <div key={q.id}><dt className="text-sm font-medium">{q.text}</dt><dd className="text-sm text-muted-foreground">{q.options.find(o => o.value === e.assessment_data?.answers?.[q.id])?.label}</dd></div>)}</dl></details>}
                <p className="mb-3 text-xs text-muted-foreground">Marketing updates: {e.marketing_consent ? "Opted in" : "Not subscribed"}</p>
                <a
                  href={`mailto:${e.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-brand"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {e.email}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
