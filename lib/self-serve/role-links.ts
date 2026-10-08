/** Internal links that stop the /learn/for/* landers remaining orphan pages. */

export const ROLE_LINKS = [
  { slug: "finance-teams", path: "/learn/for/finance-teams", label: "Courses for finance teams" },
  { slug: "hr-teams", path: "/learn/for/hr-teams", label: "Courses for HR teams" },
  { slug: "legal-teams", path: "/learn/for/legal-teams", label: "Courses for legal teams" },
  { slug: "operations-teams", path: "/learn/for/operations-teams", label: "Courses for operations teams" },
  { slug: "line-managers", path: "/learn/for/line-managers", label: "Courses for line managers" },
  { slug: "l-and-d-teams", path: "/learn/for/l-and-d-teams", label: "Courses for L&D teams" },
] as const;

export const HR_COMPARE = {
  path: "/learn/compare/ai-courses-for-hr-uk",
  label: "How Experrt compares with other UK AI courses for HR",
} as const;

export const LITERACY_COMPARE = {
  path: "/learn/compare/ai-literacy-courses-uk",
  label: "How Experrt compares with other UK AI literacy courses",
} as const;

export function otherRoleLinks(slug: string) {
  return ROLE_LINKS.filter((role) => role.slug !== slug);
}
