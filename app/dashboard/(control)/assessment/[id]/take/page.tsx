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
import { getTemplateOrDefault } from "@/lib/assessment-templates";
import { RecommendedCourses } from "@/components/recommended-courses";
import type { CourseRecommendation } from "@/lib/types";

export default function TakeAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState<CourseRecommendation[]>([]);
  const [scores, setScores] = useState<ReturnType<typeof calculateDimensionScores> | null>(null);
  const [templateQuestions, setTemplateQuestions] = useState<AssessmentQuestion[] | undefined>(undefined);
  const [templateId, setTemplateId] = useState<string>("org-wide");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessment/${id}/public-info`)
      .then((r) => r.json())
      .then((d) => {
        if (d.template_id) {
          const tmpl = getTemplateOrDefault(d.template_id);
          setTemplateQuestions(tmpl.questions);
          setTemplateId(tmpl.id);
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
      const data = await res.json().catch(() => null);

      // This used to fall back to scoring client-side and render a full
      // "Assessment Complete" screen when the save had failed - so people
      // saw a score, believed they were done, and then found nothing in My
      // Results. A failure to persist has to be shown as a failure.
      if (!res.ok || !data?.scores) {
        setSaveError(
          data?.error ??
            "We could not save your answers. Nothing has been recorded - please try again."
        );
        setSubmitting(false);
        return;
      }

      setScores(data.scores);
      setRecommendedCourses(data.recommended_courses ?? []);
      setSubmitted(true);
    } catch {
      setSaveError(
        "Network error - your answers were not saved. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (saveError) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="mb-2 text-2xl">We could not save your answers</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          {saveError}
        </p>
        <Button onClick={() => setSaveError("")} variant="outline">
          Try again
        </Button>
      </div>
    );
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

        {recommendedCourses.length > 0 && (
          <div className="mb-8 text-left">
            <RecommendedCourses
              recommendations={recommendedCourses}
              heading="Courses matched to your results"
              description="Based on your weakest dimensions and your role. Delivered live by a facilitator."
            />
          </div>
        )}

        <div>
          <Button
            onClick={() => router.push("/dashboard/my-results")}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            View my full results
          </Button>
        </div>
      </motion.div>
    );
  }

  const template = getTemplateOrDefault(templateId);
  return (
    <AssessmentWizard
      onComplete={handleComplete}
      questions={templateQuestions}
      dimensionLabels={template.dimensionLabels}
      askTools={template.askTools}
      submitting={submitting}
    />
  );
}
