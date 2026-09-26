"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { linkedInAddUrl, verifyUrl } from "@/lib/self-serve/share-links";
import { CertificateArt } from "@/components/learn/certificate-art";
import { ReviewForm } from "@/components/learn/review-form";
import { LITERACY_DISCLAIMER } from "@/lib/constants";
import { progressStorageKey } from "@/lib/self-serve/engine";
import type { BuildAnswer, CourseProgress, ResolvedArtefact } from "@/lib/self-serve/types";

export function CertificateView({
  slug,
  title,
  artefact,
  progress: supplied,
  persist = false,
}: {
  slug: string;
  title: string;
  artefact: ResolvedArtefact | null;
  progress?: CourseProgress | null;
  persist?: boolean;
}) {
  const [progress, setProgress] = useState<CourseProgress | null>(supplied ?? null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const ref = progress?.ref;
    if (!ref || !persist) return;
    const key = `experrt:celebrated:${ref}`;
    try {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, "1");
    } catch {
      return;
    }
    const frame = window.requestAnimationFrame(() => setCelebrate(true));
    return () => window.cancelAnimationFrame(frame);
  }, [progress?.ref, persist]);

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

  const answer = artefact ? progress.lessons[artefact.lessonId]?.answer : undefined;
  const card =
    answer && typeof answer === "object" && !Array.isArray(answer)
      ? (answer as BuildAnswer)
      : undefined;
  const lines = (artefact?.fields ?? [])
    .map((field) => ({ label: field.label, value: (card?.[field.id] ?? "").trim() }))
    .filter((line) => line.value);
  const signed = progress.signedAt
    ? new Date(progress.signedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <CertificateArt
        title={title}
        name={progress.signedName}
        signedAt={progress.signedAt ?? null}
        reference={progress.ref}
        recordLine={artefact?.recordLine}
        celebrate={celebrate}
      />
      <article className="ex-sheet-page">
        <p className="ex-eyebrow">
          <span />
          THE WORK YOU SIGNED
        </p>
        {signed ? <p className="ex-date">Signed {signed}</p> : null}
        {lines.length > 0 ? (
          <div className="ex-artefact">
            <h2>{artefact?.title}</h2>
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
          This record confirms that the named person completed the course and signed the work above. It does not certify compliance with the EU AI Act or any other regulation.
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
        <>
          <p className="ex-honest">
            <Link href={`/verify/${progress.ref}`}>Open the public record</Link>
            {" · "}
            <a href={`/api/learn/certificate/${progress.ref}`}>Download the PDF</a>
          </p>
          <div className="ex-share">
            <a
              className="ex-button ex-button-dark"
              href={linkedInAddUrl(title, progress.ref, progress.signedAt)}
              target="_blank"
              rel="noreferrer"
            >
              Add to your LinkedIn profile
            </a>
            <a
              className="ex-button"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl(progress.ref))}`}
              target="_blank"
              rel="noreferrer"
            >
              Share on LinkedIn
            </a>
          </div>
          <ReviewForm slug={slug} title={title} />
        </>
      ) : null}
      <Link className="ex-back" href="/learn">
        All courses
      </Link>
    </>
  );
}
