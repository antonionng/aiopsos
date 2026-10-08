"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Workspace,
  LoadingState,
  Stat,
  Empty,
  dateLabel,
} from "@/components/lms/workspace";
import { transcriptCsv, type TranscriptRecord } from "@/lib/lms/transcript";
export default function Transcript() {
  const [records, setRecords] = useState<TranscriptRecord[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/lms/transcript", {
        cache: "no-store",
      });
      if (response.redirected)
        throw new Error("Sign in again to view your transcript.");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRecords(result.records);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load records.");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const visible =
    records?.filter(
      (r) =>
        (filter === "all" || r.kind === filter) &&
        r.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];
  function download() {
    const url = URL.createObjectURL(
      new Blob([transcriptCsv(visible)], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "experrt-learning-transcript.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Workspace
      title="Every step, in one place."
      description="Your programmes, live training and issued certificates come together in your personal learning transcript."
      action={
        <button className="lms-button" disabled={!records} onClick={download}>
          Download transcript
        </button>
      }
    >
      {error || !records ? (
        <LoadingState error={error} retry={load} />
      ) : (
        <>
          <div className="lms-grid">
            <Stat value={records.length} label="Learning records" />
            <Stat
              value={
                records.filter(
                  (r) => r.completed_at || r.status === "completed",
                ).length
              }
              label="Completed learning"
              color="lime"
            />
            <Stat
              value={
                records.filter(
                  (r) => r.certificate && !r.certificate.revoked_at,
                ).length
              }
              label="Issued, unrevoked certificates"
              color="peach"
            />
          </div>
          <div className="lms-panel lms-form" style={{ marginTop: 24 }}>
            <label>
              Find learning
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your transcript…"
              />
            </label>
            <label>
              Learning format
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All learning</option>
                <option value="programme">Programmes</option>
                <option value="live">Live training</option>
              </select>
            </label>
          </div>
          <div className="lms-grid">
            {visible.map((r) => (
              <article className="lms-panel" key={`${r.kind}:${r.id}`}>
                <span className={`lms-badge ${r.status}`}>
                  {r.kind === "live" ? "Live training" : "Programme"} ·{" "}
                  {r.status}
                </span>
                <h2 style={{ marginTop: 16 }}>{r.title}</h2>
                {r.completed_at && <p>Completed {dateLabel(r.completed_at)}</p>}
                {r.attendance_pct !== null && (
                  <p>
                    Attendance {r.attendance_pct.toFixed(0)}%
                    {r.grade_pct !== null
                      ? ` · Grade ${r.grade_pct.toFixed(0)}%`
                      : ""}
                  </p>
                )}
                <div className="lms-row">
                  <Link className="lms-button secondary" href={r.href}>
                    View learning
                  </Link>
                  {r.certificate && (
                    <Link
                      className="lms-button secondary"
                      href={`/verify/${r.certificate.public_ref}`}
                    >
                      {r.certificate.revoked_at
                        ? "View revoked certificate"
                        : "Verify certificate"}
                    </Link>
                  )}
                </div>
                {r.kind === "programme" && (
                  <p className="lms-muted">
                    This is a programme completion record. It does not
                    automatically issue an accredited certificate.
                  </p>
                )}
              </article>
            ))}
          </div>
          {!visible.length && (
            <Empty title="Your learning story is taking shape">
              <p>
                Assigned programmes and live training will appear here as you
                learn.
              </p>
            </Empty>
          )}
        </>
      )}
    </Workspace>
  );
}
