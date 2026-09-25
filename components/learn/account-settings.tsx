"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { forgetLearner } from "@/components/learn/use-learner";

const MIN_PASSWORD = 8;

function useSaver() {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  async function run(task: () => Promise<string | null>) {
    setState("saving");
    setError("");
    const problem = await task().catch(() => "That did not save. Try again in a moment.");
    if (problem) {
      setError(problem);
      setState("idle");
      return;
    }
    setState("saved");
  }
  return { state, error, run };
}

async function patchProfile(body: Record<string, unknown>): Promise<string | null> {
  const res = await fetch("/api/learn/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.ok) return null;
  const data = (await res.json().catch(() => ({}))) as { detail?: string };
  return data.detail ?? "That did not save. Try again in a moment.";
}

export function NameForm({ name }: { name: string }) {
  const saver = useSaver();
  return (
    <form
      className="la-form"
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("name");
        saver.run(() => patchProfile({ name: value }));
      }}
    >
      <label className="la-field">
        <span>Your name</span>
        <input name="name" defaultValue={name} autoComplete="name" required minLength={2} />
        <small>This is the name printed on your signed records.</small>
      </label>
      {saver.error ? <p className="la-error">{saver.error}</p> : null}
      <button type="submit" className="la-button" disabled={saver.state === "saving"}>
        {saver.state === "saved" ? "Saved" : "Save name"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const saver = useSaver();
  return (
    <form
      className="la-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const password = String(new FormData(form).get("password") ?? "");
        const confirm = String(new FormData(form).get("confirm") ?? "");
        saver.run(async () => {
          if (password.length < MIN_PASSWORD) return `Choose a password of at least ${MIN_PASSWORD} characters.`;
          if (password !== confirm) return "The two passwords do not match.";
          const { error } = await createClient().auth.updateUser({ password });
          if (error) return error.message;
          form.reset();
          return null;
        });
      }}
    >
      <label className="la-field">
        <span>New password</span>
        <input name="password" type="password" autoComplete="new-password" required />
      </label>
      <label className="la-field">
        <span>New password again</span>
        <input name="confirm" type="password" autoComplete="new-password" required />
      </label>
      {saver.error ? <p className="la-error">{saver.error}</p> : null}
      <button type="submit" className="la-button" disabled={saver.state === "saving"}>
        {saver.state === "saved" ? "Password changed" : "Change password"}
      </button>
    </form>
  );
}

export function MarketingToggle({ subscribed }: { subscribed: boolean }) {
  const [on, setOn] = useState(subscribed);
  const saver = useSaver();
  return (
    <div className="la-form">
      <label className="la-checks">
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={on}
            disabled={saver.state === "saving"}
            onChange={(event) => {
              const next = event.target.checked;
              setOn(next);
              saver.run(() => patchProfile({ marketing: next }));
            }}
          />
          Email me suggestions for my next course
        </span>
      </label>
      <small className="la-note">
        Receipts, sign-in emails and reminders about a course you have bought are always sent.
      </small>
      {saver.error ? <p className="la-error">{saver.error}</p> : null}
    </div>
  );
}

export function DeleteAccount() {
  const [confirm, setConfirm] = useState("");
  const saver = useSaver();
  return (
    <form
      className="la-form"
      onSubmit={(event) => {
        event.preventDefault();
        saver.run(async () => {
          const res = await fetch("/api/learn/profile", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirm }),
          });
          if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as { detail?: string };
            return data.detail ?? "We could not close your account. Email hello@experrt.com.";
          }
          await createClient().auth.signOut().catch(() => undefined);
          forgetLearner();
          window.location.assign("/learn?account=closed");
          return null;
        });
      }}
    >
      <label className="la-field">
        <span>Type DELETE to close your account</span>
        <input value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="off" />
        <small>
          This erases your sign-in, your progress and your signed records, and the public record links stop working. Payment records are kept without your name or email because we must keep sales records for tax. No refund is given for courses on the account.
        </small>
      </label>
      {saver.error ? <p className="la-error">{saver.error}</p> : null}
      <button type="submit" className="la-button" disabled={confirm !== "DELETE" || saver.state === "saving"}>
        {saver.state === "saving" ? "Closing your account" : "Close my account"}
      </button>
    </form>
  );
}
