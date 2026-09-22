"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { LITERACY_DISCLAIMER } from "@/lib/constants";
import { progressStorageKey } from "@/lib/self-serve/engine";
import type { BuildAnswer, CourseProgress } from "@/lib/self-serve/types";

const CARD_LINES = [
  ["role", "Role"],
  ["context", "Context"],
  ["constraints", "Constraints"],
  ["output", "Output"],
] as const;

export function CertificateView({ slug, title }: { slug: string; title: string }) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(progressStorageKey(slug));
      setProgress(raw ? (JSON.parse(raw) as CourseProgress) : { lessons: {} });
    } catch {
      setProgress({ lessons: {} });
    }
  }, [slug]);

  if (!progress) {
    return (
      <main className="ex-outline ex-measure">
        <p className="ex-lede">Opening the record.</p>
      </main>
    );
  }

  if (!progress.ref || !progress.signedName) {
    return (
      <main className="ex-outline ex-measure">
        <p className="ex-lede">The record is issued after you sign your name at the end of the course.</p>
        <Link className="ex-record-link" href={`/learn/${slug}`}>
          Back to the course
        </Link>
      </main>
    );
  }

  const answer = progress.lessons["prompt-card"]?.answer;
  const card =
    answer && typeof answer === "object" && !Array.isArray(answer)
      ? (answer as BuildAnswer)
      : undefined;
  const lines = CARD_LINES.map(([id, label]) => ({
    label,
    value: (card?.[id] ?? "").trim(),
  })).filter((line) => line.value);
  const signed = progress.signedAt
    ? new Date(progress.signedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <article className="ex-sheet-page">
        <Wordmark size="sm" />
        <p className="ex-eyebrow" style={{ marginTop: 48 }}>
          <span />
          COMPLETED
        </p>
        <h1>{title}</h1>
        <p className="ex-signed">{progress.signedName}</p>
        {signed ? <p className="ex-date">{signed}</p> : null}
        {lines.length > 0 ? (
          <div className="ex-artefact">
            <h2>The prompt card</h2>
            <dl>
              {lines.map((line) => (
                <div key={line.label}>
                  <dt>{line.label}</dt>
                  <dd>{line.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <p className="ex-disclaimer">
          This record confirms that the named person completed the course and signed the prompt card above. It does not certify compliance with the EU AI Act or any other regulation.
        </p>
        <p className="ex-ref">{progress.ref}</p>
        <p className="ex-disclaimer">{LITERACY_DISCLAIMER}</p>
      </article>
      <p className="ex-honest">
        This preview is stored only in this browser. You have not been charged. A public record will be available once checkout is connected.
      </p>
      <Link className="ex-back" href="/learn">
        All courses
      </Link>
    </>
  );
}
