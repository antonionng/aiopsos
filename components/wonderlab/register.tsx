"use client";
import { useState } from "react";
import Link from "next/link";
import { HoneypotField, useBotGuard } from "@/components/form-bot-guard";
export function ParentRegistration({ onCreated }: { onCreated: () => void }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [guardian, setGuardian] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirmation, setConfirmation] = useState(false);
  const guard = useBotGuard();
  if (confirmation)
    return (
      <div className="wl-box">
        <h2>Check your parent email</h2>
        <p>
          Follow the confirmation link to finish creating your account. Then
          sign in to open your family space.
        </p>
        <p className="wl-caption">
          Already registered? Use your existing account or reset its password.
        </p>
        <Link className="wl-button" href="/login?next=%2Fwonderlab%2Ffamily">
          Parent sign in →
        </Link>
      </div>
    );
  return (
    <form
      className="wl-box wl-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const r = await fetch("/api/wonderlab/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              guardian,
              ...guard.fields(),
            }),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setPassword("");
          if (d.confirmation) setConfirmation(true);
          else onCreated();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Create a parent account</h2>
      <p className="wl-caption">
        Use your own email. You will add a child’s nickname after signing in.
      </p>
      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />
      <label>
        Your email
        <input
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={256}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <p className="wl-caption">Use at least 12 characters.</p>
      <label className="wl-check">
        <input
          type="checkbox"
          required
          checked={guardian}
          onChange={(e) => setGuardian(e.target.checked)}
        />
        I am an adult creating an account as a parent or guardian.
      </label>
      <p className="wl-caption">
        Read{" "}
        <Link href="/wonderlab/terms">
          Wonderlab’s access and privacy information
        </Link>{" "}
        before creating an account.
      </p>
      {error && (
        <p role="alert" className="wl-error">
          {error}
        </p>
      )}
      <button disabled={busy} className="wl-button">
        {busy ? "Creating account…" : "Create my parent account"}
      </button>
    </form>
  );
}
