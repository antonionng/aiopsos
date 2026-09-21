import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type InboundCapture = {
  request_id: string;
  name: string;
  email: string;
  organisation_name: string;
  message: string;
  source: "contact" | "learning_check" | "guest_agent";
  marketing_consent: boolean;
  assessment_data?: Record<string, unknown>;
};

/** A retry must represent the same submission; it must never overwrite a lead. */
export async function captureInbound(input: InboundCapture) {
  const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  const { error } = await supabaseAdmin.from("course_enquiries").insert({
    ...input,
    submission_hash: hash,
    privacy_version: "2026-09-09",
    consent_recorded_at: new Date().toISOString(),
  });
  if (!error) return { created: true };
  if (error.code === "23505") {
    const { data, error: readError } = await supabaseAdmin.from("course_enquiries")
      .select("submission_hash").eq("request_id", input.request_id).maybeSingle();
    if (!readError && data?.submission_hash === hash) return { created: false };
    throw new Error("Submission reference already used. Please reload and try again.");
  }
  throw new Error("We couldn't save your details. Please try again.");
}
