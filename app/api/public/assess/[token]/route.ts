import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: link, error } = await supabase
    .from("assessment_links")
    .select("id, token, title, description, active, expires_at, org_id, organisations(name, logo_url)")
    .eq("token", token)
    .eq("active", true)
    .single();

  if (error || !link) {
    return NextResponse.json(
      { error: "Assessment not found or inactive" },
      { status: 404 }
    );
  }

  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This assessment link has expired" },
      { status: 410 }
    );
  }

  const { count } = await supabase
    .from("pending_responses")
    .select("id", { count: "exact", head: true })
    .in(
      "link_id",
      (
        await supabase
          .from("assessment_links")
          .select("id")
          .eq("org_id", link.org_id)
      ).data?.map((l) => l.id) ?? []
    );

  return NextResponse.json({
    link: {
      id: link.id,
      token: link.token,
      title: link.title,
      description: link.description,
      org: link.organisations,
      completed_count: count ?? 0,
    },
  });
}
