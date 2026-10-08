import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmailSamples } from "@/lib/email";
import { getNotifyEmail } from "@/lib/notify-email";

export const maxDuration = 60;

async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.role === "super_admin";
}

/** Sends every learner and owner email, marked as a test, to the owner inbox. */
export async function POST(req: Request) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let ids: string[] | undefined;
  try {
    const body = (await req.json()) as { ids?: unknown };
    if (Array.isArray(body.ids)) ids = body.ids.filter((id): id is string => typeof id === "string");
  } catch {
    ids = undefined;
  }
  const to = getNotifyEmail();
  try {
    const results = await sendEmailSamples(to, ids);
    return NextResponse.json({ to, results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not send the test emails." },
      { status: 500 }
    );
  }
}
