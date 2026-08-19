export type UserRole = "super_admin" | "admin" | "manager" | "user";

const ORG_ROLES: UserRole[] = ["super_admin", "admin", "manager"];

export function canViewOrgData(role: UserRole): boolean {
  return ORG_ROLES.includes(role);
}

export function canManageTeam(role: UserRole): boolean {
  return ORG_ROLES.includes(role);
}

export function canGenerateOrgInsights(role: UserRole): boolean {
  return ORG_ROLES.includes(role);
}

export function isEmployee(role: UserRole): boolean {
  return role === "user";
}

/**
 * Whether this user may facilitate cohorts.
 *
 * Facilitation is deliberately NOT a value in `UserRole`. A facilitator is a
 * row in `facilitators`, because facilitation cuts across tenancy: one
 * trainer runs cohorts for several client organisations without being a
 * member of any of them. Putting it in the role enum would force a choice
 * between those two things.
 *
 * The Supabase admin client is imported lazily because this module is also
 * imported by client components, and a static import would drag the
 * service-role client into their bundle graph.
 */
export async function canFacilitate(userId: string): Promise<boolean> {
  if (!userId) return false;
  const { supabaseAdmin } = await import("./supabase/admin");
  const { data } = await supabaseAdmin
    .from("facilitators")
    .select("id")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  return !!data;
}
