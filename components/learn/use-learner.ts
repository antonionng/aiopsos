"use client";

import { useEffect, useState } from "react";

export type LearnerSession =
  | { signedIn: false }
  | { signedIn: true; name: string; email: string; lms: boolean; owned: string[] };

let cached: { at: number; promise: Promise<LearnerSession> } | null = null;

function loadLearner(): Promise<LearnerSession> {
  if (cached && Date.now() - cached.at < 5000) return cached.promise;
  const promise = fetch("/api/learn/me", { cache: "no-store", credentials: "same-origin" })
    .then((res) => (res.ok ? (res.json() as Promise<LearnerSession>) : { signedIn: false as const }))
    .catch(() => ({ signedIn: false as const }));
  cached = { at: Date.now(), promise };
  return promise;
}

export function forgetLearner() {
  cached = null;
}

/** The signed-in learner, fetched once per navigation so static pages stay cacheable. */
export function useLearner(refreshKey?: string): LearnerSession | null {
  const [session, setSession] = useState<LearnerSession | null>(null);
  useEffect(() => {
    let live = true;
    loadLearner().then((next) => {
      if (live) setSession(next);
    });
    return () => {
      live = false;
    };
  }, [refreshKey]);
  return session;
}
