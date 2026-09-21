export type TranscriptRecord = {
  id: string;
  kind: "programme" | "live";
  title: string;
  status: string;
  completed_at: string | null;
  href: string;
  certificate: {
    public_ref: string;
    issued_at: string;
    revoked_at: string | null;
  } | null;
  attendance_pct: number | null;
  grade_pct: number | null;
};
export function transcriptCsv(records: TranscriptRecord[]) {
  const cell = (value: string) =>
    '"' +
    (/^[=+@\-\t\r]/.test(value) ? "'" : "") +
    value.replaceAll('"', '""') +
    '"';
  return (
    "\uFEFF" +
    [
      [
        "Learning",
        "Format",
        "Status",
        "Completed",
        "Attendance %",
        "Grade %",
        "Certificate",
        "Credential status",
      ],
      ...records.map((r) => [
        r.title,
        r.kind,
        r.status,
        r.completed_at || "",
        r.attendance_pct?.toString() || "",
        r.grade_pct?.toString() || "",
        r.certificate?.public_ref || "",
        r.certificate
          ? r.certificate.revoked_at
            ? "Revoked"
            : "Issued"
          : "Not issued",
      ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n")
  );
}
