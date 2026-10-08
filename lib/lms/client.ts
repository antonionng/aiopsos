"use client";
import { useCallback, useEffect, useState } from "react";
import type { Command, Overview } from "./schema";
export async function lmsCommand<T = { id: string }>(
  command: Command,
  requestKey = crypto.randomUUID(),
): Promise<T> {
  const response = await fetch("/api/lms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": requestKey,
    },
    body: JSON.stringify(command),
  });
  if (
    response.redirected &&
    new URL(response.url).pathname.startsWith("/login")
  )
    throw new Error("Sign in again to continue in your learning workspace.");
  if (!response.headers.get("content-type")?.includes("application/json"))
    throw new Error("The learning service did not respond. Please try again.");
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error ?? "We could not complete this action.");
  return data;
}
export function useLearningOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const next = await lmsCommand<Overview>({
        action: "overview",
        payload: {},
      });
      setData(next);
      setError("");
    } catch (cause) {
      setData(null);
      setError(
        cause instanceof Error ? cause.message : "Could not load learning.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { data, error, loading, refresh };
}
