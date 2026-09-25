"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLearner } from "@/components/learn/use-learner";

export function BuyCourseButton({
  slug,
  label,
  className = "ex-button ex-button-dark",
}: {
  slug: string;
  label: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const [detail, setDetail] = useState("");
  const learner = useLearner();
  const owned = learner?.signedIn === true && learner.owned.includes(slug);

  async function buy() {
    setPending(true);
    setDetail("");
    try {
      const res = await fetch("/api/learn/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as { url?: string; detail?: string };
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setDetail(data.detail ?? "Checkout is not available yet. Try again in a moment.");
    } catch {
      setDetail("Checkout is not available yet. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (owned) {
    return (
      <div>
        <Link className={className} href={`/learn/${slug}`}>
          Go to your course
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className={className} disabled={pending} onClick={buy}>
        {pending ? "Opening checkout" : label}
        <ArrowRight size={18} />
      </button>
      {detail ? <p className="ex-hint">{detail}</p> : null}
    </div>
  );
}
