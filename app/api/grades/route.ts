import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { gradeSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

const GRADE_COLUMNS =
  "id, enrolment_id, module_id, submission_id, score, max_score, rubric, feedback, graded_by, graded_at";

/**
 * Create or amend a grade.
 *
 * A grade changed after it was first entered is audited as an amendment and
 * carries the previous score. Grade changes after the fact are one of the two
 * things an auditor reviewing a funded claim goes looking for, the other being
 * late register edits.
 */
export async function POST(req: NextRequest) {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const validation = validateBody(gradeSchema, await req.json().catch(() => null));
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data;

  if (input.score > input.max_score) {
    return NextResponse.json(
      { error: "A score cannot exceed the marks available" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id, org_id, cohort_id")
    .eq("id", input.enrolment_id)
    .maybeSingle();

  if (!enrolment) {
    return NextResponse.json({ error: "Enrolment not found" }, { status: 404 });
  }

  const row = {
    enrolment_id: input.enrolment_id,
    module_id: input.module_id ?? null,
    submission_id: input.submission_id ?? null,
    score: input.score,
    max_score: input.max_score,
    rubric: input.rubric ?? {},
    feedback: input.feedback,
    graded_by: actor.userId,
    graded_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data: before } = await supabase
      .from("grades")
      .select(GRADE_COLUMNS)
      .eq("id", input.id)
      .maybeSingle();

    if (!before) return NextResponse.json({ error: "Grade not found" }, { status: 404 });

    const { data: after, error } = await supabase
      .from("grades")
      .update(row)
      .eq("id", input.id)
      .select(GRADE_COLUMNS)
      .single();

    if (error) {
      const status = error.code === "42501" ? 403 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    await logAudit({
      orgId: enrolment.org_id,
      userId: actor.userId,
      action: AUDIT_ACTIONS.GRADE_AMENDED,
      metadata: {
        grade_id: input.id,
        enrolment_id: input.enrolment_id,
        cohort_id: enrolment.cohort_id,
        previous: {
          score: Number(before.score),
          max_score: Number(before.max_score),
          feedback: before.feedback,
        },
        next: { score: after.score, max_score: after.max_score, feedback: after.feedback },
      },
    });

    return NextResponse.json({ grade: after });
  }

  const { data: created, error } = await supabase
    .from("grades")
    .insert(row)
    .select(GRADE_COLUMNS)
    .single();

  if (error) {
    const status = error.code === "42501" ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  await logAudit({
    orgId: enrolment.org_id,
    userId: actor.userId,
    action: AUDIT_ACTIONS.GRADE_CREATED,
    metadata: {
      grade_id: created.id,
      enrolment_id: input.enrolment_id,
      cohort_id: enrolment.cohort_id,
      score: created.score,
      max_score: created.max_score,
    },
  });

  return NextResponse.json({ grade: created }, { status: 201 });
}
