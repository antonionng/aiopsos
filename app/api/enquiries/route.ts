import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/cohorts";

export const dynamic = "force-dynamic";

/**
 * Enquiries this user may see. Row-level security decides: super_admin sees
 * every lead, an org admin sees only those raised by their own people.
 */
export async function GET() {
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_enquiries")
    .select(
      "id, name, email, organisation_name, message, seats, source, status, created_at, courses:course_id(slug, title)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { enquiries: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}
