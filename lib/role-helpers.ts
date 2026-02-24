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
