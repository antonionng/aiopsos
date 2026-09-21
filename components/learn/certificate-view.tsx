"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { LITERACY_DISCLAIMER } from "@/lib/constants";
import type { BuildAnswer, CourseProgress } from "@/lib/self-serve/types";

export function CertificateView({ slug, title }: { slug: string; title: string }) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`experrt-self-serve:${slug}`);
      setProgress(raw ? (JSON.parse(raw) as CourseProgress) : { lessons: {} });
    } catch {
      setProgress({ lessons: {} });
    }
  }, [slug]);

  if (!progress) return null;

  if (!progress.ref || !progress.signedName) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <p className="mb-4 text-sm text-muted-foreground">The certificate is issued after you sign the card.</p>
        <Link href={`/learn/${slug}`} className="text-sm font-medium">
          Back to the course
        </Link>
      </main>
    );
  }

  const card = progress.lessons["prompt-card"]?.answer as BuildAnswer | undefined;

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-2xl border border-border bg-card px-8 py-12 sm:px-12">
        <Wordmark size="sm" />
        <p className="mt-10 text-xs uppercase tracking-[0.16em] text-muted-foreground">Completed</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em]">{title}</h1>
        <p className="mt-8 text-2xl tracking-[-0.02em]">{progress.signedName}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {progress.signedAt
            ? new Date(progress.signedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : null}
        </p>
        <p className="mt-8 text-sm leading-relaxed">
          Signed artefact: a prompt card
          {card?.role ? ` as ${card.role.trim()}.` : "."} This record says the course was completed. It does not certify compliance with the EU AI Act or any other regulation.
        </p>
        <p className="mt-6 font-mono text-sm tracking-[0.12em]">{progress.ref}</p>
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{LITERACY_DISCLAIMER}</p>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        This preview record stays in this browser. A public verify link and PDF are issued when checkout is connected. Nothing here has been charged.
      </p>
      <Link href="/learn" className="mt-6 inline-block text-sm font-medium">
        All courses
      </Link>
    </main>
  );
}
