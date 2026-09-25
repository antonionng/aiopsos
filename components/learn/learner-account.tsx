"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgetLearner } from "@/components/learn/use-learner";
import "./learner-account.css";

export function SaveSignInForm({
  email,
  defaultName,
  courseHref,
}: {
  email: string;
  defaultName: string;
  courseHref: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [detail, setDetail] = useState("");
  const [existing, setExisting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setDetail("");
    if (password !== confirm) {
      setDetail("The two passwords are different. Type the same password twice.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/learn/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = (await res.json()) as { ok?: boolean; next?: string; detail?: string; existing?: boolean };
      if (data.ok) {
        forgetLearner();
        router.push(data.next ?? courseHref);
        router.refresh();
        return;
      }
      if (data.existing) setExisting(true);
      setDetail(data.detail ?? "We could not save your sign-in. Try again in a moment.");
    } catch {
      setDetail("We could not save your sign-in. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (existing) {
    return (
      <div className="la-panel">
        <p className="la-note">{detail}</p>
        <SignInForm defaultEmail={email} next={courseHref} />
      </div>
    );
  }

  return (
    <form className="la-panel" onSubmit={submit}>
      <label className="la-field">
        <span>Email</span>
        <input value={email} readOnly aria-readonly="true" />
        <small>This is the email you gave at checkout. You sign in with it.</small>
      </label>
      <label className="la-field">
        <span>Your name</span>
        <input value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} required />
        <small>This is the name that will appear on your signed record.</small>
      </label>
      <label className="la-field">
        <span>Choose a password</span>
        <input
          type="password"
          value={password}
          autoComplete="new-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <small>Use at least eight characters.</small>
      </label>
      <label className="la-field">
        <span>Type the password again</span>
        <input
          type="password"
          value={confirm}
          autoComplete="new-password"
          minLength={8}
          onChange={(event) => setConfirm(event.target.value)}
          required
        />
      </label>
      {detail ? (
        <p className="la-error" role="alert">
          {detail}
        </p>
      ) : null}
      <button type="submit" className="la-button" disabled={pending}>
        {pending ? "Saving your sign-in" : "Save my sign-in and open lesson one"}
        <ArrowRight size={18} />
      </button>
      <Link className="la-quiet" href={courseHref}>
        Open lesson one now and save my sign-in later
      </Link>
    </form>
  );
}

export function SignInForm({ defaultEmail = "", next }: { defaultEmail?: string; next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [detail, setDetail] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setDetail("");
    setPending(true);
    const { error } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setPending(false);
      setDetail("That email and password do not match an account. Check them, or reset your password.");
      return;
    }
    await fetch("/api/learn/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => undefined);
    forgetLearner();
    router.push(next ?? "/learn/my-courses");
    router.refresh();
  }

  return (
    <form className="la-form" onSubmit={submit}>
      <label className="la-field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="la-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {detail ? (
        <p className="la-error" role="alert">
          {detail}
        </p>
      ) : null}
      <button type="submit" className="la-button" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
        <ArrowRight size={18} />
      </button>
      <Link className="la-quiet" href="/forgot-password">
        I have forgotten my password
      </Link>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="la-quiet la-signout"
      onClick={async () => {
        await createClient().auth.signOut();
        forgetLearner();
        router.push("/learn/my-courses");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
