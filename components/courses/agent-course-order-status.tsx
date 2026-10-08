"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Order = {
  title: string;
  course_slug: string;
  status: string;
  assignment_id: string | null;
  assessment_mode: "human" | "ai";
};
export function AgentCourseOrderStatus({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [signIn, setSignIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const check = useCallback(
    async (signal?: AbortSignal) => {
      setBusy(true);
      try {
        const response = await fetch("/api/courses/agents/orders/" + id, {
          cache: "no-store",
          signal,
        });
        if (response.redirected || response.status === 401) {
          setSignIn(true);
          return;
        }
        if (!response.headers.get("content-type")?.includes("application/json"))
          throw new Error(
            "Your payment status could not be checked. Please try again.",
          );
        const result = await response.json();
        if (signal?.aborted) return;
        if (!response.ok)
          throw new Error(
            result.error || "Your payment status could not be checked.",
          );
        setOrder(result);
        setError("");
        return result as Order;
      } catch (cause) {
        if (!signal?.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Your payment status could not be checked.",
          );
      } finally {
        if (!signal?.aborted) setBusy(false);
      }
    },
    [id],
  );
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function poll() {
      const result = await check(controller.signal);
      if (
        !controller.signal.aborted &&
        result?.status === "pending" &&
        ++attempts < 12
      )
        timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [check]);
  return (
    <section
      style={{ maxWidth: 720, margin: "60px auto", padding: "36px 24px" }}
    >
      <p>EXPERRT ACADEMY / COURSE ORDER</p>
      <h1>{order?.title || "Check your course payment"}</h1>
      {signIn ? (
        <p>
          <Link
            href={
              "/login?next=" +
              encodeURIComponent("/courses/agents/checkout/" + id)
            }
          >
            Sign in to check your payment and open your course.
          </Link>
        </p>
      ) : order?.status === "captured" && order.assignment_id ? (
        <>
          <h2>Your course is ready</h2>
          <p>
            Your payment has been confirmed. Open your learning workspace to
            start the lessons, keep your practical work and submit it for
            review. A certificate depends on passing the practical assessment.
          </p>
          <Link href={order.assessment_mode === "ai" ? "/courses/agents/learn/" + id : "/dashboard/learn/" + order.assignment_id}>
            Start your course →
          </Link>
        </>
      ) : order?.status === "refunded" ? (
        <p>
          This order has been refunded. Your learning record is kept, and
          further work on this course is paused.
        </p>
      ) : order && ["failed", "voided"].includes(order.status) ? (
        <p>
          This payment attempt did not complete.{" "}
          <Link href={"/courses/agents/" + order.course_slug}>
            Return to the course page
          </Link>{" "}
          to try again.
        </p>
      ) : (
        <p>
          We are waiting for confirmation from the payment provider. Returning
          to this page does not confirm a payment by itself. You can leave this
          page and return to check the same order; please avoid starting another
          purchase while it is pending.
        </p>
      )}
      {error ? <p role="alert">{error}</p> : null}
      {!signIn && order?.status !== "captured" ? (
        <button type="button" disabled={busy} onClick={() => void check()}>
          {busy ? "Checking payment…" : "Check payment again"}
        </button>
      ) : null}
      <p>
        <Link href="/courses/agents">Explore the agent courses</Link>
      </p>
    </section>
  );
}
