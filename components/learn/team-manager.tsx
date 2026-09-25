"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type TeamSeatView = {
  id: string;
  email: string;
  name: string | null;
  invitedAt: string;
  acceptedAt: string | null;
  passed: number;
  signedAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function TeamManager({
  teamId,
  token,
  seatsLeft,
  open,
  lessons,
  seats,
}: {
  teamId: string;
  token: string | null;
  seatsLeft: number;
  open: boolean;
  lessons: number;
  seats: TeamSeatView[];
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function call(method: "POST" | "DELETE", payload: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/learn/team/invite", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, token, ...payload }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as {
      detail?: string;
      added?: string[];
      skipped?: string[];
      rejected?: string[];
      full?: boolean;
      resent?: string;
    };
    setBusy(false);
    if (!res?.ok) {
      setMessage({ ok: false, text: data?.detail ?? "Something went wrong. Try again." });
      return null;
    }
    router.refresh();
    return data;
  }

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    const data = await call("POST", { text });
    if (!data) return;
    const parts = [];
    if (data.added?.length) parts.push(`Invited ${data.added.length} ${data.added.length === 1 ? "person" : "people"}.`);
    if (data.skipped?.length) parts.push(`Already invited: ${data.skipped.join(", ")}.`);
    if (data.rejected?.length) parts.push(`Could not read: ${data.rejected.join(", ")}.`);
    if (data.full) parts.push("Some were left out because every place is taken.");
    setMessage({ ok: Boolean(data.added?.length), text: parts.join(" ") });
    if (data.added?.length) setText("");
  }

  return (
    <div className="la-team-grid">
      <section className="la-panel" aria-labelledby="invite-title">
        <h2 id="invite-title">Invite people</h2>
        {open && seatsLeft > 0 ? (
          <form className="la-form" onSubmit={invite}>
            <label className="la-field">
              <span>
                Email addresses ({seatsLeft} place{seatsLeft === 1 ? "" : "s"} left)
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder={"sam@company.com\nAisha Khan <aisha@company.com>\nTom Reed, tom@company.com"}
                required
              />
              <small>One person per line. Add a name before the email if you like. Each person gets an email with their own link.</small>
            </label>
            <button className="la-button" type="submit" disabled={busy || !text.trim()}>
              {busy ? "Sending" : "Send invitations"}
            </button>
          </form>
        ) : (
          <p className="la-note">
            {open ? "Every place has been given out." : "The time to send invitations has ended."} Need more
            places? Buy more from the course page, or email hello@experrt.com.
          </p>
        )}
        {message ? (
          <p className={message.ok ? "la-note" : "la-error"} role="status">
            {message.text}
          </p>
        ) : null}
      </section>

      <section className="la-panel" aria-labelledby="people-title">
        <h2 id="people-title">People</h2>
        {seats.length === 0 ? (
          <p className="la-note">Nobody invited yet.</p>
        ) : (
          <ul className="la-seats">
            {seats.map((seat) => {
              const state = seat.signedAt ? "done" : seat.acceptedAt ? "joined" : "invited";
              return (
                <li key={seat.id}>
                  <div>
                    <strong>{seat.name || seat.email}</strong>
                    <small>
                      {seat.name ? `${seat.email} · ` : ""}
                      {state === "done"
                        ? `Finished ${formatDate(seat.signedAt)}`
                        : state === "joined"
                          ? `${seat.passed} of ${lessons} lessons passed`
                          : `Invited ${formatDate(seat.invitedAt)}`}
                    </small>
                  </div>
                  <span className={`la-seat-state is-${state}`}>
                    {state === "done" ? "Finished" : state === "joined" ? "Learning" : "Invited"}
                  </span>
                  {state === "invited" && open ? (
                    <div className="la-seat-actions">
                      <button className="la-quiet" type="button" disabled={busy} onClick={() => call("POST", { resend: seat.id }).then((d) => d && setMessage({ ok: true, text: `Sent again to ${seat.email}.` }))}>
                        Send again
                      </button>
                      <button className="la-quiet" type="button" disabled={busy} onClick={() => call("DELETE", { seatId: seat.id }).then((d) => d && setMessage({ ok: true, text: `Withdrew the invitation to ${seat.email}. The place is free again.` }))}>
                        Withdraw
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
