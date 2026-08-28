"use client";

import { useEffect, useRef, useState } from "react";
import { HONEYPOT_FIELD, FORM_TIMESTAMP_FIELD } from "@/lib/spam-defence";

/**
 * The client half of the silent bot check. Nothing to see and nothing to
 * solve - a visitor never knows it is here.
 *
 * Returns the fields to merge into the submission body, plus the hidden
 * input to render inside the form.
 */
export function useBotGuard() {
  // Set after mount, so it reflects when this visitor actually opened the
  // form rather than when the page was built or cached.
  const startedAtRef = useRef<number | null>(null);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  return {
    /** Spread into the JSON body on submit. */
    fields: () => ({
      [HONEYPOT_FIELD]: honeypot,
      [FORM_TIMESTAMP_FIELD]: startedAtRef.current ?? undefined,
    }),
    honeypot,
    setHoneypot,
  };
}

/**
 * The decoy input. Hidden from sight, from screen readers and from tab order,
 * so no real person can fill it in by accident - but present in the DOM, and
 * attractively named, for a bot that fills every field it finds.
 *
 * Deliberately not `display: none`: some bots skip those. Off-screen with
 * zero opacity reads as a real field to a naive crawler.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>
        Company website (leave this field empty)
      </label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
