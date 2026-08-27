import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getActor } from "@/lib/cohorts";
import { submissionSchema, validateBody } from "@/lib/validations";
import {
  MATERIALS_BUCKET,
  MAX_SUBMISSION_BYTES,
  isAllowedMaterialType,
  submissionStoragePath,
} from "@/lib/materials";

export const dynamic = "force-dynamic";

const SUBMISSION_COLUMNS =
  "id, session_id, enrolment_id, artefact_url, storage_path, notes, submitted_at";

/**
 * Record a piece of submitted work.
 *
 * Participants submit against their own enrolment; facilitators may record a
 * submission on someone's behalf, which happens constantly in a room where
 * the work was handed over on paper or a whiteboard. Row-level security
 * enforces both, so this route does not re-check them.
 *
 * Two shapes: JSON for a link or a note, multipart when there is a file. The
 * file goes to the private cohort-workspace bucket and is handed back out
 * through /api/submissions/[id]/download, never as a public URL - a room
 * holds several companies, and one delegate's work is not the room's.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Expected a multipart upload" }, { status: 400 });
    }

    const file = form.get("file") as File | null;
    const sessionId = String(form.get("session_id") ?? "");
    const enrolmentId = String(form.get("enrolment_id") ?? "");
    const notes = String(form.get("notes") ?? "");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!sessionId || !enrolmentId) {
      return NextResponse.json(
        { error: "session_id and enrolment_id are required" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SUBMISSION_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${Math.floor(MAX_SUBMISSION_BYTES / 1024 / 1024)} MB)` },
        { status: 413 }
      );
    }
    if (!isAllowedMaterialType(file.type)) {
      return NextResponse.json(
        { error: `That file type is not accepted (${file.type || "unknown"})` },
        { status: 400 }
      );
    }

    const unique = crypto.randomUUID().slice(0, 8);
    const storagePath = submissionStoragePath(enrolmentId, file.name, unique);

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

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        session_id: sessionId,
        enrolment_id: enrolmentId,
        storage_path: storagePath,
        notes,
      })
      .select(SUBMISSION_COLUMNS)
      .single();

    if (error) {
      // RLS refused the row, so the object belongs to nobody. Leaving it
      // behind would be an invisible, billable orphan.
      await supabaseAdmin.storage.from(MATERIALS_BUCKET).remove([storagePath]);
      const status = error.code === "42501" ? 403 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ submission: data }, { status: 201 });
  }

  const validation = validateBody(submissionSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      session_id: input.session_id,
      enrolment_id: input.enrolment_id,
      artefact_url: input.artefact_url || null,
      notes: input.notes,
    })
    .select(SUBMISSION_COLUMNS)
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ submission: data }, { status: 201 });
}
