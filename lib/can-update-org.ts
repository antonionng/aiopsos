import type { SupabaseClient } from "@supabase/supabase-js";

export async function canUpdateOrganisation(
  supabase: SupabaseClient,
  profile: { org_id?: string | null; role?: string | null } | null
): Promise<boolean> {
  if (profile?.role === "super_admin") return true;
  if (!profile?.org_id) return false;
  if (["admin", "manager", "super_admin"].includes(profile.role ?? "")) return true;
  if (profile.role !== "user") return false;
  const { count, error } = await supabase
    .from("user_profiles")
    .select("id", { count: "exact", head: true })
    .eq("org_id", profile.org_id);
  if (error || count === null) return false;
  return count === 1;
}
