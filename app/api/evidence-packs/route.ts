import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { buildEvidencePack } from "@/lib/evidence-pack";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { evidencePackSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Packs generated for this organisation, newest first. */
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evidence_packs")
    .select("id, org_id, period_start, period_end, generated_at, generated_by")
    .order("generated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { packs: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Generate a pack for a period.
 *
 * The assembled payload is stored as-is and never recomputed. Regenerating a
 * pack for the same past period produces a second row with an identical
 * payload rather than mutating the first, because a dated record that can
 * change is not evidence of anything.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!actor.orgId) {
    return NextResponse.json(
      { error: "You must belong to an organisation to generate an evidence pack" },
      { status: 403 }
    );
  }

  const validation = validateBody(evidencePackSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { period_start, period_end, declaration } = validation.data;

  if (period_end < period_start) {
    return NextResponse.json(
      { error: "The period cannot end before it starts" },
      { status: 400 }
    );
  }

  // The period runs to the end of its final day, not to midnight at its start.
  const periodStart = new Date(`${period_start}T00:00:00.000Z`);
  const periodEnd = new Date(`${period_end}T23:59:59.999Z`);

  const payload = await buildEvidencePack(
    actor.orgId,
    periodStart,
    periodEnd,
    declaration
  );

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evidence_packs")
    .insert({
      org_id: actor.orgId,
      period_start,
      period_end,
      generated_by: actor.userId,
      payload,
    })
    .select("id, period_start, period_end, generated_at")
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  await logAudit({
    orgId: actor.orgId,
    userId: actor.userId,
    action: AUDIT_ACTIONS.EVIDENCE_PACK_GENERATED,
    metadata: {
      evidence_pack_id: data.id,
      period_start,
      period_end,
      cohorts: payload.measures.cohorts.length,
      participants: payload.measures.total_participants,
      certificates: payload.records.certificates_issued,
    },
  });

  return NextResponse.json({ pack: data }, { status: 201 });
}
