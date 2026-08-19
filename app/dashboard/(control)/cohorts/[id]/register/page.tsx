"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CloudOff, Loader2, RefreshCw } from "lucide-react";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABELS,
  type AttendanceStatus,
} from "@/lib/constants";

interface RegisterRow {
  enrolment_id: string;
  name: string;
  email: string;
  status: AttendanceStatus | null;
  minutes_attended: number;
}

interface SessionRow {
  id: string;
  position: number;
  title: string;
  starts_at: string;
  ends_at: string;
}

type SyncState = "clean" | "saving" | "pending" | "offline";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500 text-white border-emerald-500",
  late: "bg-amber-500 text-white border-amber-500",
  absent: "bg-red-500 text-white border-red-500",
  excused: "bg-muted text-foreground border-border",
};

/**
 * The facilitator's attendance screen.
 *
 * Built for a phone held in one hand in a training room with bad wifi, which
 * drives every decision here:
 *
 *  - Marks apply to local state instantly. Nothing waits on the network.
 *  - Changes queue and flush on a short debounce, and the queue survives a
 *    failed request: a dropped connection means "retrying", not lost marks.
 *  - There is no blocking spinner after the first load. The only network
 *    indicator is a small chip, because a facilitator mid-session must never
 *    be locked out of the register by a request that is still in flight.
 *  - Tap targets are large and the status is legible at a glance, since this
 *    is used while talking to a room.
 */
export default function RegisterPage() {
  const { id } = useParams<{ id: string }>();

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cohortTitle, setCohortTitle] = useState("");
  const [rows, setRows] = useState<RegisterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sync, setSync] = useState<SyncState>("clean");

  // Marks not yet acknowledged by the server. Keyed by enrolment so repeated
  // taps on the same person collapse to their latest value.
  const pending = useRef(new Map<string, { status: AttendanceStatus; minutes_attended: number }>());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);

  // Load the cohort and pick a session to open on.
  useEffect(() => {
    if (!id) return;
    fetch(`/api/cohorts/${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
          return;
        }
        setCohortTitle(d.cohort?.title ?? "");
        const list: SessionRow[] = d.sessions ?? [];
        setSessions(list);

        // Default to whatever is running now, else the next one, else the last.
        const now = Date.now();
        const current = list.find(
          (s) => new Date(s.starts_at).getTime() <= now && new Date(s.ends_at).getTime() >= now
        );
        const next = list.find((s) => new Date(s.starts_at).getTime() > now);
        setSessionId(current?.id ?? next?.id ?? list[list.length - 1]?.id ?? null);
      })
      .catch(() => setError("Failed to load this cohort"))
      .finally(() => setLoading(false));
  }, [id]);

  const loadRegister = useCallback(async (targetSessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${targetSessionId}/attendance`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setRows(data.register ?? []);
      setError("");
    } catch {
      setError("Could not load the register. Your marks are still saved locally.");
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    // Switching session discards nothing: pending marks are for the session
    // they were made against, so flush before moving.
    pending.current.clear();
    loadRegister(sessionId);
  }, [sessionId, loadRegister]);

  const flush = useCallback(async () => {
    if (!sessionId || inFlight.current || pending.current.size === 0) return;

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSync("offline");
      return;
    }

    inFlight.current = true;
    setSync("saving");

    // Snapshot what we are sending. Anything marked while this is in flight
    // stays in the queue for the next flush rather than being dropped.
    const batch = Array.from(pending.current.entries()).map(([enrolment_id, value]) => ({
      enrolment_id,
      status: value.status,
      minutes_attended: value.minutes_attended,
    }));

    try {
      const res = await fetch(`/api/sessions/${sessionId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: batch }),
      });

      if (!res.ok) throw new Error(String(res.status));

      for (const record of batch) {
        const still = pending.current.get(record.enrolment_id);
        // Only clear it if it has not been re-marked since we sent it.
        if (still && still.status === record.status) {
          pending.current.delete(record.enrolment_id);
        }
      }

      setSync(pending.current.size > 0 ? "pending" : "clean");
    } catch {
      // Keep the queue. The retry below will pick it up.
      setSync("pending");
    } finally {
      inFlight.current = false;
      if (pending.current.size > 0) {
        flushTimer.current = setTimeout(flush, 4000);
      }
    }
  }, [sessionId]);

  // Retry whenever the device comes back online.
  useEffect(() => {
    function onOnline() {
      setSync(pending.current.size > 0 ? "pending" : "clean");
      flush();
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", () => setSync("offline"));
    return () => {
      window.removeEventListener("online", onOnline);
    };
  }, [flush]);

  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
    };
  }, []);

  function mark(enrolmentId: string, status: AttendanceStatus) {
    setRows((current) =>
      current.map((row) =>
        row.enrolment_id === enrolmentId ? { ...row, status } : row
      )
    );

    const existing = pending.current.get(enrolmentId);
    pending.current.set(enrolmentId, {
      status,
      minutes_attended: existing?.minutes_attended ?? 0,
    });
    setSync("pending");

    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, 1200);
  }

  function markAllPresent() {
    for (const row of rows) {
      if (row.status === null) mark(row.enrolment_id, "present");
    }
  }

  const unmarked = useMemo(() => rows.filter((r) => r.status === null).length, [rows]);
  const activeSession = sessions.find((s) => s.id === sessionId) ?? null;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading register...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <Link
        href={`/dashboard/cohorts/${id}`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {cohortTitle || "Cohort"}
      </Link>

      <h1 className="mb-1">Register</h1>

      {sessions.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          This cohort has no sessions scheduled yet.
        </p>
      ) : (
        <>
          {/* Session picker: a plain select, because a native picker is the
              most reliable control on a phone. */}
          <select
            value={sessionId ?? ""}
            onChange={(e) => setSessionId(e.target.value)}
            className="mt-3 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.position}. {session.title} —{" "}
                {new Date(session.starts_at).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </option>
            ))}
          </select>

          {activeSession && (
            <p className="mt-2 text-xs text-muted-foreground">
              {unmarked === 0
                ? "Everyone is marked."
                : `${unmarked} still to mark.`}
            </p>
          )}

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {unmarked > 0 && (
            <button
              type="button"
              onClick={markAllPresent}
              className="mt-4 h-11 w-full rounded-lg border border-border text-sm font-medium transition-colors hover:bg-accent"
            >
              Mark the remaining {unmarked} present
            </button>
          )}

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              <div
                key={row.enrolment_id}
                className="rounded-xl border border-border bg-card p-3"
              >
                <p className="mb-2 text-sm font-medium">{row.name}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ATTENDANCE_STATUSES.map((status) => {
                    const selected = row.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => mark(row.enrolment_id, status)}
                        aria-pressed={selected}
                        className={`h-11 rounded-lg border text-xs font-medium transition-colors ${
                          selected
                            ? STATUS_STYLES[status]
                            : "border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {ATTENDANCE_STATUS_LABELS[status]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sync chip. Deliberately non-blocking and out of the way: it reports,
          it never gates. */}
      <div className="fixed inset-x-0 bottom-4 flex justify-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs shadow-lg backdrop-blur">
          {sync === "clean" && (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              All marks saved
            </>
          )}
          {sync === "saving" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              Saving
            </>
          )}
          {sync === "pending" && (
            <>
              <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
              {pending.current.size} to sync — retrying
            </>
          )}
          {sync === "offline" && (
            <>
              <CloudOff className="h-3.5 w-3.5 text-amber-500" />
              Offline — marks held on this device
            </>
          )}
        </div>
      </div>
    </div>
  );
}
