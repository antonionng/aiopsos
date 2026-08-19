"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LITERACY_DISCLAIMER } from "@/lib/constants";

interface GradeRow {
  id: string;
  module_id: string | null;
  score: number;
  max_score: number;
  feedback: string;
  graded_at: string;
}

interface ParticipantProgress {
  enrolment_id: string;
  name: string;
  email: string;
  status: string;
  grades: GradeRow[];
  eligibility: {
    eligible: boolean;
    attendance_pct: number;
    grade_pct: number | null;
    reasons: string[];
  };
  certificate: {
    id: string;
    public_ref: string;
    issued_at: string;
    revoked_at: string | null;
  } | null;
}

interface ProgressData {
  cohort: {
    id: string;
    title: string;
    pass_attendance_pct: number;
    pass_grade_pct: number;
  };
  total_sessions: number;
  modules: { id: string; position: number; title: string }[];
  participants: ParticipantProgress[];
  can_issue: boolean;
}

export default function GradesPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [moduleId, setModuleId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/cohorts/${id}/progress`, { cache: "no-store" });
    const d = await res.json();
    if (!d.error) setData(d);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    load().finally(() => setLoading(false));
  }, [id, load]);

  function openGrader(enrolmentId: string) {
    setOpenFor(enrolmentId);
    setScore("");
    setMaxScore("100");
    setModuleId("");
    setFeedback("");
  }

  async function saveGrade(enrolmentId: string) {
    const numericScore = Number(score);
    const numericMax = Number(maxScore);

    if (!Number.isFinite(numericScore) || !Number.isFinite(numericMax) || numericMax <= 0) {
      toast.error("Enter a score and the marks available");
      return;
    }
    if (numericScore > numericMax) {
      toast.error("A score cannot exceed the marks available");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrolment_id: enrolmentId,
          module_id: moduleId || null,
          score: numericScore,
          max_score: numericMax,
          feedback,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Could not save that grade");
        return;
      }
      toast.success("Grade recorded");
      setOpenFor(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function issueCertificate(enrolmentId: string) {
    const res = await fetch("/api/certificates/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrolment_id: enrolmentId }),
    });
    const result = await res.json();

    if (!res.ok) {
      // The server is the authority on eligibility; surface its reasons
      // verbatim rather than paraphrasing them.
      const reasons: string[] = result.reasons ?? [];
      toast.error(result.error ?? "Could not issue a certificate", {
        description: reasons.join(" "),
      });
      return;
    }

    toast.success("Certificate issued");
    await load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading grades...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Cohort not found</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/dashboard/cohorts/${id}`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {data.cohort.title}
      </Link>

      <h1 className="mb-1">Grades</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        A certificate needs both {data.cohort.pass_attendance_pct}% attendance
        and a {data.cohort.pass_grade_pct}% grade. Grades are weighted by the
        marks available.
      </p>

      <div className="space-y-3">
        {data.participants.map((participant) => {
          const { eligibility } = participant;
          const isOpen = openFor === participant.enrolment_id;

          return (
            <Card key={participant.enrolment_id} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.email}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span
                      className={
                        eligibility.attendance_pct >= data.cohort.pass_attendance_pct
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }
                    >
                      {eligibility.attendance_pct}% attendance
                    </span>
                    <span
                      className={
                        eligibility.grade_pct === null
                          ? "text-muted-foreground"
                          : eligibility.grade_pct >= data.cohort.pass_grade_pct
                            ? "text-emerald-500"
                            : "text-amber-500"
                      }
                    >
                      {eligibility.grade_pct === null
                        ? "Not graded"
                        : `${eligibility.grade_pct}% grade`}
                    </span>
                  </div>
                </div>

                {participant.grades.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {participant.grades.map((grade) => {
                      const courseModule = data.modules.find(
                        (m) => m.id === grade.module_id
                      );
                      return (
                        <p key={grade.id} className="text-xs text-muted-foreground">
                          {courseModule
                            ? `${courseModule.position}. ${courseModule.title}`
                            : "Overall"}
                          :{" "}
                          <span className="text-foreground/80">
                            {grade.score} / {grade.max_score}
                          </span>
                          {grade.feedback ? ` — ${grade.feedback}` : ""}
                        </p>
                      );
                    })}
                  </div>
                )}

                {isOpen ? (
                  <div className="space-y-2 rounded-lg border border-border/60 p-3">
                    <select
                      value={moduleId}
                      onChange={(e) => setModuleId(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-surface px-2 text-sm"
                    >
                      <option value="">Overall</option>
                      {data.modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.position}. {m.title}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <Input
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        inputMode="decimal"
                        placeholder="Score"
                        className="bg-surface"
                      />
                      <Input
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        inputMode="decimal"
                        placeholder="Out of"
                        className="bg-surface"
                      />
                    </div>

                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Feedback for the participant"
                      className="min-h-[70px] bg-surface"
                    />

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveGrade(participant.enrolment_id)} disabled={saving}>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        {saving ? "Saving..." : "Save grade"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setOpenFor(null)}>
                        <X className="mr-1.5 h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openGrader(participant.enrolment_id)}
                    >
                      Add grade
                    </Button>

                    {participant.certificate && !participant.certificate.revoked_at ? (
                      <Link
                        href={`/verify/${participant.certificate.public_ref}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500"
                      >
                        <Award className="h-3.5 w-3.5" />
                        Certificate issued
                      </Link>
                    ) : (
                      data.can_issue && (
                        <Button
                          size="sm"
                          variant={eligibility.eligible ? "default" : "ghost"}
                          disabled={!eligibility.eligible}
                          onClick={() => issueCertificate(participant.enrolment_id)}
                          title={eligibility.reasons.join(" ")}
                        >
                          <Award className="mr-1.5 h-3.5 w-3.5" />
                          Issue certificate
                        </Button>
                      )
                    )}

                    {!eligibility.eligible && eligibility.reasons.length > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {eligibility.reasons[0]}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
        {LITERACY_DISCLAIMER}
      </p>
    </div>
  );
}
