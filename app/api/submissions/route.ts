import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { submissionSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * Record a piece of submitted work.
 *
 * Participants submit against their own enrolment; facilitators may record a
 * submission on someone's behalf, which happens constantly in a room where
 * the work was handed over on paper or a whiteboard. Row-level security
 * enforces both, so this route does not re-check them.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(submissionSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      session_id: input.session_id,
      enrolment_id: input.enrolment_id,
      artefact_url: input.artefact_url || null,
      notes: input.notes,
    })
    .select("id, session_id, enrolment_id, artefact_url, notes, submitted_at")
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ submission: data }, { status: 201 });
}
