import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Assessment ID required" },
      { status: 400 }
    );
  }

  const { data: assessment, error: assessmentError } = await supabaseAdmin
    .from("assessments")
    .select("org_id, template_id")
    .eq("id", id)
    .single();

  if (assessmentError || !assessment) {
    return NextResponse.json(
      { org_name: null, logo_url: null, completed_count: 0 },
      { status: 200 },
    );
  }

  const { data: org } = await supabaseAdmin
    .from("organisations")
    .select("name, logo_url")
    .eq("id", assessment.org_id)
    .single();

  const { count } = await supabaseAdmin
    .from("assessment_responses")
    .select("id", { count: "exact", head: true })
    .in(
      "assessment_id",
      (
        await supabaseAdmin
          .from("assessments")
          .select("id")
          .eq("org_id", assessment.org_id)
      ).data?.map((a) => a.id) ?? [],
    );

  return NextResponse.json({
    org_name: org?.name ?? null,
    logo_url: org?.logo_url ?? null,
    completed_count: count ?? 0,
    template_id: assessment.template_id ?? "org-wide",
  });
}
