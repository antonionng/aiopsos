import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { sessionUpsertSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * Replace a cohort's schedule.
 *
 * `starts_at` and `ends_at` arrive as ISO strings with an offset and are
 * stored as `timestamptz`, i.e. UTC. The cohort's `timezone` is what the UI
 * renders them in. Nothing here stores wall-clock local time: cohorts run
 * across the UK, the GCC and Southeast Asia at once and cross DST boundaries
 * mid-course, so a local time without a zone is not a time.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(sessionUpsertSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { sessions } = validation.data;

  const positions = new Set(sessions.map((s) => s.position));
  if (positions.size !== sessions.length) {
    return NextResponse.json(
      { error: "Two sessions share the same position" },
      { status: 400 }
    );
  }

  for (const session of sessions) {
    if (new Date(session.ends_at) <= new Date(session.starts_at)) {
      return NextResponse.json(
        { error: `Session ${session.position} ends before it starts` },
        { status: 400 }
      );
    }
  }

  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("sessions")
    .upsert(
      sessions.map((s) => ({
        ...(s.id ? { id: s.id } : {}),
        cohort_id: id,
        module_id: s.module_id ?? null,
        position: s.position,
        title: s.title,
        starts_at: s.starts_at,
        ends_at: s.ends_at,
        join_url: s.join_url || null,
      })),
      { onConflict: "cohort_id,position" }
    )
    .select("id, module_id, position, title, starts_at, ends_at, join_url");

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ sessions: data ?? [] });
}
