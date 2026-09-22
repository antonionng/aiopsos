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

export function CertificateView({
  slug,
  title,
  progress: supplied,
  persist = false,
}: {
  slug: string;
  title: string;
  progress?: CourseProgress | null;
  persist?: boolean;
}) {
  const [progress, setProgress] = useState<CourseProgress | null>(supplied ?? null);

  useEffect(() => {
    if (supplied?.ref) {
      setProgress(supplied);
      return;
    }
    try {
      const raw = window.localStorage.getItem(progressStorageKey(slug));
      setProgress(raw ? (JSON.parse(raw) as CourseProgress) : supplied ?? { lessons: {} });
    } catch {
      setProgress(supplied ?? { lessons: {} });
    }
  }, [slug, supplied]);

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
    answer && typeof answer !== "undefined" && typeof answer === "object" && !Array.isArray(answer)
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
        {persist
          ? "Anyone with the reference can open the public record. The page does not claim compliance."
          : "This preview is stored only in this browser."}
      </p>
      {persist ? (
        <p className="ex-honest">
          <Link href={`/verify/${progress.ref}`}>Open the public record</Link>
          {" · "}
          <a href={`/api/learn/certificate/${progress.ref}`}>Download the PDF</a>
        </p>
      ) : null}
      <Link className="ex-back" href="/learn">
        All courses
      </Link>
    </>
  );
}
