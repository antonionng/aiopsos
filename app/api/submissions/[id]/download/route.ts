import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import { MATERIALS_BUCKET, SIGNED_URL_TTL } from "@/lib/materials";

export const dynamic = "force-dynamic";

/**
 * Open a piece of submitted work, as a short-lived signed URL.
 *
 * Access is decided by reading the row through the caller's own session:
 * `academy_can_read_enrolment` already limits submissions to the participant
 * themselves, the cohort's graders, and admins of the enrolment's OWN
 * organisation. In a room holding several companies that last clause is what
 * stops one company's admin opening another company's delegate's work, so
 * the check belongs there and is not re-implemented here.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: submission } = await supabase
    .from("submissions")
    .select("id, storage_path, artefact_url")
    .eq("id", id)
    .maybeSingle();

  // RLS filters rather than raises, so "not yours" and "does not exist"
  // arrive identically and should stay that way to the caller.
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!submission.storage_path) {
    // A link submission has nothing to sign; hand back what was recorded.
    return NextResponse.json({ url: submission.artefact_url ?? null });
  }

  const path = String(submission.storage_path);
  const filename = path.split("/").pop() ?? "submission";

  const { data, error } = await supabaseAdmin.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL, { download: filename });

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "Could not prepare that download" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { url: data.signedUrl, filename },
    { headers: { "Cache-Control": "no-store" } }
  );
}
