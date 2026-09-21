"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function ScheduleDelivery({
  courses,
  programmeId,
  onCreated,
}: {
  courses: { id: string; title: string }[];
  programmeId?: string;
  onCreated?: () => void;
}) {
  const router = useRouter(),
    lock = useRef(false),
    saved = useRef<string | null>(null),
    sessionId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [partial, setPartial] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("");
  useEffect(
    () => setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
    [],
  );
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const start = new Date(String(f.get("start"))),
        end = new Date(String(f.get("end")));
      if (!Number.isFinite(start.getTime()) || end <= start)
        throw Error("Choose a finish time after the start.");
      if (!saved.current) {
        const r = await fetch("/api/cohorts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: f.get("course"),
            title: f.get("title"),
            delivery_mode: f.get("mode"),
            location: f.get("location") || null,
            timezone,
            seat_limit: Number(f.get("seats")),
            starts_on: String(f.get("start")).slice(0, 10),
            ends_on: String(f.get("end")).slice(0, 10),
          }),
        });
        const d = await r.json();
        if (!r.ok)
          throw Error(d.error || "Could not create the training group");
        saved.current = d.cohort.id;
        setPartial(d.cohort.id);
      }
      sessionId.current ||= crypto.randomUUID();
      const r = await fetch(`/api/cohorts/${saved.current}/sessions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessions: [
            {
              id: sessionId.current,
              position: 1,
              title: String(f.get("session")),
              starts_at: start.toISOString(),
              ends_at: end.toISOString(),
              join_url: f.get("join") || null,
            },
          ],
        }),
      });
      const d = await r.json();
      if (!r.ok)
        throw Error(
          d.error ||
            "The group was saved, but its session needs another attempt.",
        );
      if(programmeId) {
        for(const action of ["link","enrol"]){
          const response=await fetch(`/api/lms/programmes/${programmeId}/delivery`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,cohort_id:saved.current})});
          const result=await response.json();if(!response.ok)throw Error(result.error||"Could not finish the programme setup. Retry to continue.");
        }
        onCreated?.();
      } else router.push(`/dashboard/cohorts/${saved.current}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save this delivery.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-3xl py-6">
      {!programmeId&&<Link className="text-sm text-brand" href="/dashboard/cohorts">
        ← Live training
      </Link>}
      <h2 className="mb-3 mt-5">Schedule teaching for this group</h2>
      <p className="mb-6 text-muted-foreground">
        {programmeId?"Choose the live-course template and first session. This will confirm places for the learners already assigned to this programme.":"Choose a course and schedule the first session, then add participants."}
      </p>
      <form onSubmit={submit} className="lms-panel lms-form">
        <label>
          What will they learn?
          <select name="course" required disabled={!!partial}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Group name
          <input
            name="title"
            required
            maxLength={300}
            placeholder="AI confidence · October team"
            disabled={!!partial}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Delivery format
            <select name="mode" disabled={!!partial}>
              <option value="virtual">Online</option>
              <option value="in_person">In person</option>
              <option value="blended">Hybrid</option>
            </select>
          </label>
          <label>
            Places available
            <input
              name="seats"
              type="number"
              min={1}
              max={500}
              defaultValue={12}
              required
              disabled={!!partial}
            />
          </label>
        </div>
        <label>
          Venue, if in person
          <input name="location" maxLength={300} disabled={!!partial} />
        </label>
        <h2 className="text-lg font-semibold">First session</h2>
        <label>
          Session title
          <input
            name="session"
            required
            defaultValue="Welcome and first workshop"
          />
        </label>
        <p className="text-sm text-muted-foreground">
          Enter times in your browser’s timezone: {timezone}.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Starts
            <input name="start" type="datetime-local" required />
          </label>
          <label>
            Finishes
            <input name="end" type="datetime-local" required />
          </label>
        </div>
        <label>
          Meeting link, if online
          <input name="join" type="url" placeholder="https://…" />
        </label>
        <p className="text-sm text-muted-foreground">
          Default certificate requirements: 80% attendance and 70% grade.
          Confirm the trainer before delivery. No invitations are sent by this
          form.
        </p>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        {partial && error && !programmeId && (
          <Link className="text-brand" href={`/dashboard/cohorts/${partial}`}>
            Open the saved group →
          </Link>
        )}
        <button
          className="lms-button"
          disabled={busy || !courses.length || !timezone}
        >
          {busy
            ? "Saving…"
            : partial
              ? "Save first session"
              : "Create group & first session"}
        </button>
      </form>
    </div>
  );
}
