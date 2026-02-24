import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Server-side guard: guarantees the current auth user has a
 * `user_profiles` row. Call once per dashboard load so users
 * who slipped past the trigger still get a profile.
 */
export async function ensureProfile(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing } = await supabaseAdmin
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return;

  await supabaseAdmin.from("user_profiles").insert({
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? "",
    role: "user",
  });
}
