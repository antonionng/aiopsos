import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import { MATERIALS_BUCKET, SIGNED_URL_TTL } from "@/lib/materials";

export const dynamic = "force-dynamic";

/**
 * Hand out one pack, as a short-lived signed URL.
 *
 * This route is the access control. The bucket is private and carries no
 * storage.objects policies, so an object is unreachable except through here,
 * and the check is a plain RLS read of the row: if the caller's session can
 * select the material, `academy_can_read_material` has already decided they
 * are in the room. The URL expires in five minutes so a link pasted into a
 * group chat stops working long before it leaves the building.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: material } = await supabase
    .from("course_materials")
    .select("id, filename, storage_path, mime_type")
    .eq("id", id)
    .maybeSingle();

  // RLS filters rather than raises, so "not visible to you" and "does not
  // exist" arrive here identically - and should stay indistinguishable to
  // the caller.
  if (!material) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(String(material.storage_path), SIGNED_URL_TTL, {
      download: String(material.filename),
    });

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "Could not prepare that download" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { url: data.signedUrl, filename: material.filename },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** Withdraw a pack. Graders only, enforced by the delete policy. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  // Read the path first: after the row goes, nothing points at the object.
  const { data: material } = await supabase
    .from("course_materials")
    .select("id, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error, count } = await supabase
    .from("course_materials")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  // A DELETE policy filters the row out rather than raising, so zero rows
  // affected is what "you may read this but not remove it" looks like.
  if (!count) {
    return NextResponse.json(
      { error: "You cannot remove material from this cohort" },
      { status: 403 }
    );
  }

  await supabaseAdmin.storage
    .from(MATERIALS_BUCKET)
    .remove([String(material.storage_path)]);

  return NextResponse.json({ ok: true });
}
