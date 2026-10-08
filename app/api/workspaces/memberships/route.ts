import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Read-only migration endpoint. Does not select a workspace or grant access. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const headers = { "Cache-Control": "private, no-store" };
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in to see your workspaces." }, { status: 401, headers });
  }
  // Use the authenticated client: the function derives the actor from auth.uid().
  const { data, error } = await supabase.rpc("list_workspace_memberships");
  if (error) {
    return NextResponse.json({ error: "Your workspaces could not be loaded. Please try again." }, { status: 503, headers });
  }
  return NextResponse.json({ memberships: data ?? [], switchingEnabled: false }, { headers });
}
