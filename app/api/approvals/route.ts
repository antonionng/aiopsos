import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendApprovalRequestEmail, sendApprovalDecisionEmail } from "@/lib/email";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ requests: [] });
  }

  const { data: requests } = await supabase
    .from("approval_requests")
    .select("*, requester:user_profiles!requested_by(name, email), reviewer:user_profiles!reviewer_id(name, email)")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ requests: requests ?? [], role: profile.role });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return NextResponse.json({ error: "No organisation" }, { status: 400 });
  }

  const { message_id, conversation_id, content_preview } = await req.json();

  const { data: request, error } = await supabase
    .from("approval_requests")
    .insert({
      org_id: profile.org_id,
      message_id: message_id || null,
      conversation_id: conversation_id || null,
      requested_by: user.id,
      content_preview: content_preview || "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: requester } = await supabase
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  await sendApprovalRequestEmail(
    profile.org_id,
    requester?.name ?? "A team member",
    content_preview || ""
  );

  return NextResponse.json({ request });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Only managers/admins can review" }, { status: 403 });
  }

  const { id, status, comment } = await req.json();

  const { error } = await supabase
    .from("approval_requests")
    .update({
      status,
      comment: comment || null,
      reviewer_id: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", profile.org_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: approvalReq } = await supabase
    .from("approval_requests")
    .select("requested_by")
    .eq("id", id)
    .single();

  if (approvalReq) {
    const { data: requester } = await supabase
      .from("user_profiles")
      .select("email, name")
      .eq("id", approvalReq.requested_by)
      .single();

    const { data: reviewer } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (requester) {
      await sendApprovalDecisionEmail(
        requester.email,
        requester.name,
        reviewer?.name ?? "A reviewer",
        status as "approved" | "rejected",
        comment || undefined
      );
    }
  }

  return NextResponse.json({ success: true });
}
