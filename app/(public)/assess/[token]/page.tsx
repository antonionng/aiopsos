"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { BrainCircuit } from "lucide-react";

interface LinkData {
  id: string;
  token: string;
  title: string;
  description: string;
  org: { name: string; logo_url: string | null } | null;
}

export default function PublicAssessPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/public/assess/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setLinkData(data.link);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load assessment");
        setLoading(false);
      });
  }, [token]);

  async function handleComplete(answers: Record<string, number>, meta: { role: string; toolsUsed: string[] }) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/assess/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, respondent_role: meta.role, tools_used: meta.toolsUsed }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      }
      // Store results in sessionStorage for the results page
      sessionStorage.setItem(
        `assess_results_${token}`,
        JSON.stringify({
          scores: data.scores,
          overall: data.overall,
          tier: data.tier,
          session_token: data.session_token,
        })
      );
      router.push(`/assess/${token}/results`);
    } catch {
      setError("Failed to submit assessment");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
            <BrainCircuit className="h-6 w-6 animate-pulse text-brand" />
          </div>
          <p className="text-sm text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Assessment Unavailable</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!linkData) return null;

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-[-0.02em]">
          {linkData.title}
        </h1>
        {linkData.description && (
          <p className="text-sm text-muted-foreground">{linkData.description}</p>
        )}
      </div>

      <AssessmentWizard
        onComplete={handleComplete}
        branding={
          linkData.org
            ? { orgName: linkData.org.name, logoUrl: linkData.org.logo_url }
            : undefined
        }
        submitting={submitting}
      />
    </div>
  );
}
