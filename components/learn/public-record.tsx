import Link from "next/link";
import { CertificateArt } from "@/components/learn/certificate-art";
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
      <p className="ex-verified">
        <span aria-hidden="true">✓</span> Verified record, issued by Experrt on {signed}
      </p>
      <CertificateArt
        title={record.title}
        name={record.signedName}
        signedAt={record.signedAt}
        reference={record.ref}
        recordLine={record.recordLine}
      />
      <article className="ex-sheet-page">
        <p className="ex-eyebrow">
          <span />
          THE SIGNED WORK
        </p>
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
      <aside className="ex-record-cta">
        <p>
          {record.title} is a self-paced online course from Experrt. It ends with an assessment and a piece of signed work like the one above.
        </p>
        <Link
          className="ex-button ex-button-dark"
          href={`/learn/${record.slug}?utm_source=verify&utm_medium=referral&utm_campaign=record`}
        >
          See the course
        </Link>
      </aside>
      <Link className="ex-back" href="/learn">
        All self-paced courses
      </Link>
    </div>
  );
}
