"use client";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Compass } from "lucide-react";
import { lmsCommand } from "@/lib/lms/client";
import type { Command, Overview } from "@/lib/lms/schema";
import "./workspace.css";

export function Workspace({
  data,
  title,
  description,
  children,
  action,
}: {
  data?: Overview | null;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="lms-workspace"
      style={
        data?.settings?.accent
          ? ({ "--lms-accent": data.settings.accent } as React.CSSProperties)
          : undefined
      }
    >
      <header className="lms-heading">
        <div>
          <span className="lms-eyebrow">
            {data?.settings?.brand_name || "Experrt learning"} /{" "}
            {data?.can_manage ? "Learning operations" : "Your learning space"}
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
export function LoadingState({
  error,
  retry,
}: {
  error?: string;
  retry?: () => void;
}) {
  return (
    <div className="lms-panel" role={error ? "alert" : "status"}>
      <h2>
        {error
          ? "We couldn't load this workspace"
          : "Opening your learning space…"}
      </h2>
      {error && (
        <>
          <p>{error}</p>
          {error.toLowerCase().includes("sign in") && (
            <ActionLink href="/login">Sign in</ActionLink>
          )}
          {error.includes("Settings") && (
            <ActionLink href="/dashboard/settings">
              Set up my organisation
            </ActionLink>
          )}
          <button className="lms-button" onClick={retry}>
            Try again
          </button>
        </>
      )}
    </div>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="lms-empty">
      <Compass size={32} />
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
export function Stat({
  value,
  label,
  color = "lilac",
}: {
  value: number | string;
  label: string;
  color?: string;
}) {
  return (
    <div className={`lms-stat ${color}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
export function ActionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="lms-button" href={href}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function Notice({ message }: { message: string }) {
  return message ? (
    <p className="lms-notice" role="status">
      {message}
    </p>
  ) : null;
}
export function useMutation(refresh?: () => Promise<void>) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const pending = useRef<{ body: string; key: string } | null>(null);
  const locked = useRef(false);
  async function mutate<T = { id: string }>(
    command: Command,
  ): Promise<T | null> {
    if (locked.current) return null;
    locked.current = true;
    setBusy(true);
    setMessage("");
    const body = JSON.stringify(command);
    if (pending.current?.body !== body)
      pending.current = { body, key: crypto.randomUUID() };
    try {
      const result = await lmsCommand<T>(command, pending.current.key);
      pending.current = null;
      if (refresh) await refresh();
      return result;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
      return null;
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  return { busy, message, setMessage, mutate };
}
export function dateLabel(value?: string | null) {
  return value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No deadline";
}
export function ManagerOnly({
  data,
  children,
}: {
  data: Overview;
  children: ReactNode;
}) {
  return data.can_manage ? (
    children
  ) : (
    <Empty title="Your learning is ready elsewhere">
      <p>This workspace is for learning managers.</p>
      <ActionLink href="/dashboard/learning">Go to my learning</ActionLink>
    </Empty>
  );
}
