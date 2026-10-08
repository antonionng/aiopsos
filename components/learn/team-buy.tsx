"use client";

import { useState } from "react";
import { TEAM_MAX, TEAM_MIN } from "@/lib/self-serve/team-rules";
import "@/components/learn/learner-account.css";

export function TeamBuy({ slug, priceGbp }: { slug: string; priceGbp: number }) {
  const [openForm, setOpenForm] = useState(false);
  const [seats, setSeats] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (n: number) => setSeats(Math.max(TEAM_MIN, Math.min(TEAM_MAX, Math.round(n) || TEAM_MIN)));

  async function buy() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/learn/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, seats }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { url?: string; detail?: string };
    if (data?.url) {
      window.location.assign(data.url);
      return;
    }
    setBusy(false);
    setError(data?.detail ?? "Checkout could not be opened. Try again in a moment.");
  }

  if (!openForm) {
    return (
      <button type="button" className="la-quiet ex-team-open" onClick={() => setOpenForm(true)}>
        Buying for your team? Get several places in one payment
      </button>
    );
  }

  return (
    <div className="la-team-buy">
      <strong>Places for your team</strong>
      <div className="la-team-buy-row">
        <div className="la-stepper">
          <button type="button" aria-label="One fewer place" onClick={() => set(seats - 1)}>
            −
          </button>
          <input
            aria-label="Number of places"
            inputMode="numeric"
            value={seats}
            onChange={(e) => set(Number(e.target.value))}
          />
          <button type="button" aria-label="One more place" onClick={() => set(seats + 1)}>
            +
          </button>
        </div>
        <span>
          {seats} × £{priceGbp} = <strong>£{(seats * priceGbp).toLocaleString("en-GB")}</strong>
        </span>
      </div>
      <small>
        You invite people by email after paying. Each person gets their own sign-in, progress and
        certificate, with 12 months from the day they accept. You get an invoice for your records.
        All sales are final.
      </small>
      <button type="button" className="ex-button ex-button-dark" onClick={buy} disabled={busy}>
        {busy ? "Opening checkout" : `Buy ${seats} places`}
      </button>
      {error ? <p className="la-error">{error}</p> : null}
    </div>
  );
}
