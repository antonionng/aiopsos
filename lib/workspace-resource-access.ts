import "server-only";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Revalidate the observed workspace, never trust a previously loaded profile. */
export async function resourceAccessError(client: SupabaseClient, orgId: string | null | undefined, expectedRole?: string) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!orgId) return NextResponse.json({ error: "Select an active workspace to use its resources." }, { status: 403, headers });
  const { data, error } = await client.rpc("current_workspace_access", { p_expected_org: orgId, p_expected_role: expectedRole ?? null });
  if (error) return NextResponse.json({ error: "Workspace access could not be verified. Please retry." }, { status: 503, headers });
  if (data !== true) return NextResponse.json({ error: "Your workspace access has changed. Refresh or contact your administrator." }, { status: 403, headers });
  return null;
}
