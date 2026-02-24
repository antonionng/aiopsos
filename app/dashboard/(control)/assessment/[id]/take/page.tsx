"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import {
  calculateDimensionScores,
  calculateOverallScore,
  type AssessmentQuestion,
} from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSIONS, getTierForScore } from "@/lib/constants";
import { getTemplate } from "@/lib/assessment-templates";

export default function TakeAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState<ReturnType<typeof calculateDimensionScores> | null>(null);
  const [templateQuestions, setTemplateQuestions] = useState<AssessmentQuestion[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessment/${id}/public-info`)
      .then((r) => r.json())
      .then((d) => {
        if (d.template_id) {
          const tmpl = getTemplate(d.template_id);
          setTemplateQuestions(tmpl.questions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleComplete(answers: Record<string, number>, meta: { role: string; toolsUsed: string[] }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessment/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: id,
          answers,
          respondent_role: meta.role,
          tools_used: meta.toolsUsed,
        }),
      });
      const data = await res.json();
      if (data.scores) {
        setScores(data.scores);
      } else {
        const dimScores = calculateDimensionScores(answers, templateQuestions);
        setScores(dimScores);
      }
    } catch {
      const dimScores = calculateDimensionScores(answers, templateQuestions);
      setScores(dimScores);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submitted && scores) {
    const overall = calculateOverallScore(scores);
    const tier = getTierForScore(overall);

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg text-center"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <CheckCircle2 className="h-8 w-8 text-brand" />
        </div>
        <h1 className="mb-2 text-2xl">Assessment Complete</h1>
        <p className="mb-8 text-muted-foreground">
          Your AI maturity score: <strong>{overall.toFixed(1)} / 5</strong>
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DIMENSIONS.map((dim) => (
            <div key={dim} className="rounded-xl border border-border bg-card p-4 text-left">
              <p className="text-xs text-muted-foreground">{DIMENSION_LABELS[dim]}</p>
              <p className="mt-1 text-lg font-bold">{scores[dim].toFixed(1)}</p>
            </div>
          ))}
        </div>

        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
        >
          Tier {tier.tier}: {tier.label}
        </div>

        <div>
          <Button
            onClick={() => router.push(`/dashboard/assessment/${id}/results`)}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            View Full Results
          </Button>
        </div>
      </motion.div>
    );
  }

  return <AssessmentWizard onComplete={handleComplete} questions={templateQuestions} submitting={submitting} />;
}
