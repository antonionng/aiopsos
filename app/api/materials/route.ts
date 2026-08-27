import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import {
  MATERIALS_BUCKET,
  MAX_MATERIAL_BYTES,
  isAllowedMaterialType,
  materialStoragePath,
} from "@/lib/materials";

export const dynamic = "force-dynamic";

const MATERIAL_COLUMNS =
  "id, course_id, cohort_id, title, description, filename, file_size, mime_type, position, visibility, created_at";

/**
 * Participant packs for a cohort or a course.
 *
 * Reads go through the caller's own session so RLS decides what comes back:
 * `academy_can_read_material` grants the cohort's graders, anyone enrolled on
 * it, and - for a course-scoped pack - anyone enrolled on any cohort of that
 * course. No filtering is repeated here; the policy is the access rule.
 */
export async function GET(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cohortId = req.nextUrl.searchParams.get("cohort_id");
  const courseId = req.nextUrl.searchParams.get("course_id");

  const supabase = await createClient();
  let query = supabase
    .from("course_materials")
    .select(MATERIAL_COLUMNS)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  // A cohort's workspace shows both its own handouts and the reusable pack
  // attached to the course being delivered - that is what a delegate expects
  // to find in one place.
  if (cohortId && courseId) {
    query = query.or(`cohort_id.eq.${cohortId},course_id.eq.${courseId}`);
  } else if (cohortId) {
    query = query.eq("cohort_id", cohortId);
  } else if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { materials: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Upload a pack. Multipart, because this is a file.
 *
 * The row is written through the caller's session so the "Graders add
 * materials" policy decides whether they may - a delegate, or an attending
 * company's admin who can now READ the cohort, both get refused there. The
 * object itself is written with the service role, since the bucket has no
 * storage policies by design.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected a multipart upload" }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  const cohortId = (form.get("cohort_id") as string | null) || null;
  const courseId = (form.get("course_id") as string | null) || null;
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const visibility = String(form.get("visibility") ?? "enrolled");

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!cohortId && !courseId) {
    return NextResponse.json(
      { error: "A pack must belong to a cohort or a course" },
      { status: 400 }
    );
  }
  if (file.size > MAX_MATERIAL_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${Math.floor(MAX_MATERIAL_BYTES / 1024 / 1024)} MB)` },
      { status: 413 }
    );
  }
  if (!isAllowedMaterialType(file.type)) {
    return NextResponse.json(
      { error: `That file type is not accepted (${file.type || "unknown"})` },
      { status: 400 }
    );
  }
  if (visibility !== "enrolled" && visibility !== "public") {
    return NextResponse.json({ error: "Unknown visibility" }, { status: 400 });
  }

  const unique = crypto.randomUUID().slice(0, 8);
  const storagePath = materialStoragePath({ cohortId, courseId }, file.name, unique);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(MATERIALS_BUCKET)
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed", detail: uploadError.message },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_materials")
    .insert({
      course_id: courseId,
      cohort_id: cohortId,
      title: title || file.name,
      description,
      filename: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
      visibility,
      uploaded_by: actor.userId,
    })
    .select(MATERIAL_COLUMNS)
    .single();

  if (error) {
    // RLS refused the row, so the object has no owner and must not be left
    // behind: an orphan in the bucket is invisible to every screen and still
    // costs storage.
    await supabaseAdmin.storage.from(MATERIALS_BUCKET).remove([storagePath]);
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ material: data }, { status: 201 });
}
