"use client";

import { useEffect, useState } from "react";
import { REVIEW_MAX, REVIEW_MIN, reviewerName, type ReviewNameStyle } from "@/lib/self-serve/reviews";

type Loaded = {
  eligible: boolean;
  signedName?: string;
  review?: { rating: number; body: string; role: string | null; nameStyle: ReviewNameStyle } | null;
};

export function ReviewForm({ slug, title }: { slug: string; title: string }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState("");
  const [role, setRole] = useState("");
  const [nameStyle, setNameStyle] = useState<ReviewNameStyle>("initial");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [existing, setExisting] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(`/api/learn/review?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((res) => res.json() as Promise<Loaded>)
      .then((data) => {
        if (!live) return;
        setLoaded(data);
        if (data.review) {
          setExisting(true);
          setRating(data.review.rating);
          setBody(data.review.body);
          setRole(data.review.role ?? "");
          setNameStyle(data.review.nameStyle);
        }
      })
      .catch(() => live && setLoaded({ eligible: false }));
    return () => {
      live = false;
    };
  }, [slug]);

  if (!loaded?.eligible) return null;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const res = await fetch("/api/learn/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, rating, body, role, nameStyle }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { detail?: string };
    if (!res?.ok) {
      setState("error");
      setMessage(data?.detail ?? "We could not save your review. Try again.");
      return;
    }
    setExisting(true);
    setState("saved");
    setMessage("Thank you. Your review is on the course page.");
  }

  async function remove() {
    setState("saving");
    await fetch("/api/learn/review", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => null);
    setExisting(false);
    setRating(0);
    setBody("");
    setRole("");
    setState("idle");
    setMessage("Your review has been removed.");
  }

  const shown = hover || rating;
  const preview = loaded.signedName ? reviewerName(loaded.signedName, nameStyle) : "";

  return (
    <section className="ex-review-form" id="review" aria-labelledby="review-heading">
      <p className="ex-eyebrow">
        <span />
        {existing ? "YOUR REVIEW" : "REVIEW THE COURSE"}
      </p>
      <h2 id="review-heading">How was {title}?</h2>
      <p className="ex-review-note">
        Your review appears on the course page with a Verified learner badge, because you finished
        the course and signed the record. Be honest. Other people are deciding whether to spend
        their money.
      </p>
      <form onSubmit={save}>
        <div className="ex-stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              className={n <= shown ? "is-on" : ""}
              onMouseEnter={() => setHover(n)}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
        <label className="ex-review-field">
          <span>Your review</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            minLength={REVIEW_MIN}
            maxLength={REVIEW_MAX}
            placeholder="What did you get out of it? What will you do differently at work?"
            required
          />
          <small>
            {body.trim().length}/{REVIEW_MAX}
          </small>
        </label>
        <label className="ex-review-field">
          <span>Your job title (optional)</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} placeholder="Operations lead" />
        </label>
        <fieldset className="ex-review-name">
          <legend>Show my name as</legend>
          <label>
            <input type="radio" checked={nameStyle === "initial"} onChange={() => setNameStyle("initial")} />
            {loaded.signedName ? reviewerName(loaded.signedName, "initial") : "First name and initial"}
          </label>
          <label>
            <input type="radio" checked={nameStyle === "full"} onChange={() => setNameStyle("full")} />
            {loaded.signedName ?? "Full name"}
          </label>
        </fieldset>
        <div className="ex-review-actions">
          <button className="ex-button ex-button-dark" type="submit" disabled={state === "saving" || rating === 0}>
            {state === "saving" ? "Saving" : existing ? "Update review" : "Post review"}
          </button>
          {existing ? (
            <button className="ex-review-remove" type="button" onClick={remove} disabled={state === "saving"}>
              Remove my review
            </button>
          ) : null}
        </div>
        {message ? (
          <p className={state === "error" ? "ex-review-error" : "ex-review-ok"} role="status">
            {message}
          </p>
        ) : null}
        <p className="ex-review-note">Shown as {preview}. Reviews cannot include links.</p>
      </form>
    </section>
  );
}
