/** Enable only after the cohort/billing database migration is approved and applied. */
export function cohortMembershipGuardsEnabled() {
  return process.env.COHORT_MEMBERSHIP_GUARDS_ENABLED === "true";
}
