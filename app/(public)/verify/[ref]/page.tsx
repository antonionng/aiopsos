import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, BadgeCheck, ShieldOff } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  COURSE_LEVEL_LABELS,
  DELIVERY_MODE_LABELS,
  LITERACY_DISCLAIMER,
} from "@/lib/constants";
import type { CertificateSnapshot } from "@/lib/types";
import { verifyCertificateMetadata } from "@/lib/public-share-metadata";

export const dynamic = "force-dynamic";

// Individual certificates must not be indexed. They name a person, and a
// search engine is not the audience for them - the holder shares the link.
export const metadata: Metadata = verifyCertificateMetadata();

const REF_PATTERN = /^[0-9A-HJKMNP-TV-Z]{12}$/;

/**
 * Public certificate verification.
 *
 * Readable by anyone with the reference and no account. It deliberately shows
 * only what a third party needs to trust the record - course, dates,
 * facilitator, attendance and grade against the thresholds that applied - and
 * nothing else about the participant or the organisation.
 *
 * Everything is read from the snapshot frozen at issue, so editing a course
 * in the catalogue never changes what an issued certificate asserts.
 */
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const normalised = ref.toUpperCase();

  if (!REF_PATTERN.test(normalised)) notFound();

  const { data } = await supabaseAdmin
    .from("certificates")
    .select("public_ref, issued_at, revoked_at, snapshot")
    .eq("public_ref", normalised)
    .maybeSingle();

  if (!data) notFound();

  const snapshot = (data.snapshot ?? {}) as Partial<CertificateSnapshot>;
  const revoked = !!data.revoked_at;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-6">
          <Link href="/" className="text-sm font-semibold">
            Experrt
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div
          className={`mb-8 flex items-start gap-4 rounded-2xl border p-6 ${
            revoked
              ? "border-destructive/30 bg-destructive/5"
              : "border-emerald-500/30 bg-emerald-500/5"
          }`}
        >
          {revoked ? (
            <ShieldOff className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          ) : (
            <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
          )}
          <div>
            <h1 className="mb-1 text-xl font-semibold">
              {revoked ? "This certificate has been withdrawn" : "Certificate verified"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {revoked
                ? `Withdrawn on ${new Date(data.revoked_at as string).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. It should no longer be relied on.`
                : `Issued on ${new Date(data.issued_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} and recorded by Experrt.`}
            </p>
          </div>
        </div>

        <dl className="mb-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Participant</dt>
            <dd className="text-sm font-medium">{snapshot.participant_name || "—"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Course</dt>
            <dd className="text-sm font-medium">{snapshot.course_title || "—"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Level</dt>
            <dd className="text-sm">
              {snapshot.course_level
                ? COURSE_LEVEL_LABELS[snapshot.course_level]
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Delivery</dt>
            <dd className="text-sm">
              {snapshot.delivery_mode
                ? DELIVERY_MODE_LABELS[snapshot.delivery_mode]
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Dates</dt>
            <dd className="text-sm">
              {snapshot.starts_on
                ? new Date(snapshot.starts_on).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
              {snapshot.ends_on && snapshot.ends_on !== snapshot.starts_on && (
                <>
                  {" – "}
                  {new Date(snapshot.ends_on).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Facilitator</dt>
            <dd className="text-sm">{snapshot.facilitator_name || "—"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Attendance</dt>
            <dd className="text-sm">
              {snapshot.attendance_pct ?? "—"}%
              {snapshot.pass_attendance_pct !== undefined && (
                <span className="text-muted-foreground">
                  {" "}
                  (required: {snapshot.pass_attendance_pct}%)
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">Grade</dt>
            <dd className="text-sm">
              {snapshot.grade_pct === null || snapshot.grade_pct === undefined
                ? "—"
                : `${snapshot.grade_pct}%`}
              {snapshot.pass_grade_pct !== undefined && (
                <span className="text-muted-foreground">
                  {" "}
                  (required: {snapshot.pass_grade_pct}%)
                </span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="mb-1 text-xs text-muted-foreground">Reference</dt>
            <dd className="font-mono text-sm">{data.public_ref}</dd>
          </div>
        </dl>

        {snapshot.facilitator_credentials && snapshot.facilitator_credentials.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold">Facilitator credentials</h2>
            <ul className="space-y-1.5">
              {snapshot.facilitator_credentials.map((credential, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {credential.title}
                  {credential.issuer ? ` — ${credential.issuer}` : ""}
                  {credential.year ? ` (${credential.year})` : ""}
                  {credential.reference ? ` · ref ${credential.reference}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {snapshot.modules && snapshot.modules.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold">Modules delivered</h2>
            <ol className="space-y-2">
              {snapshot.modules.map((module) => (
                <li key={module.position} className="text-sm">
                  <span className="mr-2 text-muted-foreground">{module.position}.</span>
                  {module.title}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {LITERACY_DISCLAIMER}
          </p>
        </div>
      </main>
    </div>
  );
}
