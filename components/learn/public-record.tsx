import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import type { SignedRecord } from "@/lib/self-serve/records";
import "@/app/learn/learn.css";

export function SelfServePublicRecord({ record }: { record: SignedRecord }) {
  const signed = new Date(record.signedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lines = record.artefactFields
    .map((field) => ({ label: field.label, value: (record.artefact?.[field.id] ?? "").trim() }))
    .filter((line) => line.value);

  return (
    <div className="ex-learn">
      <article className="ex-sheet-page">
        <Wordmark size="sm" />
        <p className="ex-eyebrow" style={{ marginTop: 48 }}>
          <span />
          COMPLETED
        </p>
        <h1>{record.title}</h1>
        <p className="ex-signed">{record.signedName}</p>
        <p className="ex-date">{signed}</p>
        <p className="ex-record-line">{record.recordLine}</p>
        {lines.length > 0 ? (
          <div className="ex-artefact">
            <h2>{record.artefactTitle}</h2>
            <dl>
              {lines.map((line) => (
                <div key={line.label}>
                  <dt>{line.label}</dt>
                  <dd>{line.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <p className="ex-disclaimer">
          This record confirms that the named person completed the course and signed the work above. It does not certify compliance with the EU AI Act or any other regulation.
        </p>
        <p className="ex-ref">{record.ref}</p>
        <p className="ex-disclaimer">{record.disclaimer}</p>
      </article>
      <p className="ex-honest">
        Anyone with this reference can open the record. The page does not claim compliance.
      </p>
      <p className="ex-honest">
        <a href={`/api/learn/certificate/${record.ref}`}>Download the PDF</a>
      </p>
      <Link className="ex-back" href="/">
        Experrt home
      </Link>
    </div>
  );
}
