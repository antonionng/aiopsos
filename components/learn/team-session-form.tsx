"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function TeamSessionForm({
  name,
  courses,
}: {
  name: string;
  courses: { slug: string; title: string }[];
}) {
  const [picked, setPicked] = useState<string[]>(courses.slice(0, 1).map((course) => course.slug));
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [detail, setDetail] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setDetail("");
    try {
      const res = await fetch("/api/learn/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          organisation: form.get("organisation"),
          format: form.get("format"),
          people: form.get("people"),
          timing: form.get("timing"),
          message: form.get("message"),
          courses: picked,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; detail?: string };
      if (data.ok) {
        setState("sent");
        return;
      }
      setDetail(data.detail ?? "That did not send. Try again in a moment.");
    } catch {
      setDetail("That did not send. Try again in a moment.");
    }
    setState("idle");
  }

  if (state === "sent") {
    return (
      <p className="la-note" role="status">
        Thank you. Your enquiry is with the Experrt team, and we will reply by email within two working days.
      </p>
    );
  }

  return (
    <form className="la-form" onSubmit={submit}>
      <label className="la-field">
        <span>Your name</span>
        <input name="name" defaultValue={name} autoComplete="name" required />
      </label>
      <label className="la-field">
        <span>Organisation</span>
        <input name="organisation" autoComplete="organization" />
      </label>
      {courses.length > 0 ? (
        <fieldset className="la-field la-checks">
          <span>Which courses should the session cover?</span>
          {courses.map((course) => (
            <label key={course.slug}>
              <input
                type="checkbox"
                checked={picked.includes(course.slug)}
                onChange={(event) =>
                  setPicked((current) =>
                    event.target.checked
                      ? [...current, course.slug]
                      : current.filter((slug) => slug !== course.slug)
                  )
                }
              />
              {course.title}
            </label>
          ))}
        </fieldset>
      ) : null}
      <label className="la-field">
        <span>Format</span>
        <select name="format" defaultValue="either">
          <option value="in_person">In person, at your office</option>
          <option value="online">Live online</option>
          <option value="either">Either works</option>
        </select>
      </label>
      <div className="la-pair">
        <label className="la-field">
          <span>How many people?</span>
          <input name="people" inputMode="numeric" placeholder="For example, 12" />
        </label>
        <label className="la-field">
          <span>When?</span>
          <input name="timing" placeholder="For example, November" />
        </label>
      </div>
      <label className="la-field">
        <span>Anything else we should know</span>
        <textarea name="message" rows={4} maxLength={3000} />
      </label>
      {detail ? <p className="la-error">{detail}</p> : null}
      <button type="submit" className="la-button" disabled={state === "sending"}>
        {state === "sending" ? "Sending" : "Ask about a team session"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
