-- ============================================================
-- 034: Cross-organisation cohorts
--
-- This is the migration 021 promised and 023 did not deliver.
-- 021 left cohorts.org_id nullable "for the partner-run
-- cross-org cohorts that migration 023 introduces"; 023 turned
-- out to be an unrelated RLS recursion fix, so the comments in
-- 020, 021 and app/api/cohorts/route.ts have been pointing at a
-- feature that was never built.
--
-- The October 2026 Malaysia/Indonesia tour needs it: one cohort
-- per training day, with delegates from several companies in the
-- room. cohorts.org_id is the DELIVERING organisation; each
-- enrolments.org_id stays the delegate's own employer, which the
-- enrol route already sets correctly.
--
-- Without this, academy_can_read_cohort grants read only to the
-- cohort's own org, its facilitator, or a super admin. A delegate
-- whose employer is not the delivering org gets their enrolment
-- back from /api/my-learning with no cohort and no sessions:
-- attendance and grades with nothing to attach them to.
--
-- What this migration deliberately does NOT do:
--   * widen academy_can_manage_cohort. Editing, enrolling and
--     issuing certificates stay with the delivering org.
--   * widen academy_can_read_enrolment. An attending company's
--     admins still see only their own people's enrolments,
--     attendance, grades and certificates. That containment is
--     the entire reason a shared cohort is safe, and
--     supabase/tests/rls_cross_org_cohorts.sql asserts it.
--
-- RECURSION. 023 exists because a user_profiles policy selected
-- from user_profiles, and 020's FOR ALL catalogue policy later
-- armed it for anonymous visitors loading /courses. The rule it
-- established is that a policy asks a SECURITY DEFINER helper
-- rather than querying the protected table itself. Every clause
-- added below lives INSIDE such a helper, which runs as its owner
-- and is therefore not subject to RLS on the table it reads, so
-- no cycle is created. Do not inline any of this into a policy
-- body: that is exactly the trap 023 disarmed.
--
-- Verified on a throwaway branch database of ecxsqzvhsydpgstvvxxo on
-- 27 Aug 2026 before being applied to it: the 17 assertions in
-- supabase/tests/rls_cross_org_cohorts.sql passed, and so did all 15 in
-- the pre-existing supabase/tests/rls_cohorts.sql - redefining
-- academy_can_read_cohort regresses none of them. At apply time the
-- project held no cohorts and no enrolments, so both new branches were
-- no-ops against existing data.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

-- ── 1. Tie an assessment link to a training day ──────────────
--
-- The tour gives every attending company its own QR link, so a
-- delegate lands in their own employer's tenant (lib/assess-claim.ts
-- attaches a response to the LINK's org). All of a day's links point
-- at that day's cohort, which is what the live room view aggregates
-- on. Nothing else groups responses by event: assessment_responses
-- has no link_id, no campaign and no source column.
--
-- Nullable, because every link that exists today predates the tour.

ALTER TABLE assessment_links
  ADD COLUMN IF NOT EXISTS cohort_id uuid REFERENCES cohorts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assessment_links_cohort
  ON assessment_links(cohort_id);

-- ── 2. Enrolled delegates can read their own cohort ──────────
--
-- Two new branches, both narrow:
--
--   * the participant themselves, so my-learning resolves the
--     cohort and its sessions;
--   * admins and managers of a company with someone in the room,
--     so an attending company can see the course their staff sat
--     without being able to touch it.
--
-- The org branch is a read grant only. academy_can_manage_cohort
-- is untouched immediately below this, so an attending company's
-- admin still cannot edit the cohort, enrol anyone into it, or
-- issue a certificate from it.

CREATE OR REPLACE FUNCTION public.academy_can_read_cohort(p_cohort uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM cohorts c
    WHERE c.id = p_cohort
      AND (
        public.academy_user_role() = 'super_admin'
        OR (c.org_id IS NOT NULL AND c.org_id = public.academy_org_id())
        OR (c.facilitator_id IS NOT NULL
            AND c.facilitator_id = public.academy_facilitator_id())
        -- New in 034: a delegate reads the cohort they are enrolled on,
        -- whoever is delivering it.
        OR EXISTS (
          SELECT 1 FROM enrolments e
          WHERE e.cohort_id = c.id AND e.user_id = auth.uid()
        )
        -- New in 034: an attending company's staff read the cohort
        -- their own people are on.
        OR EXISTS (
          SELECT 1 FROM enrolments e
          WHERE e.cohort_id = c.id
            AND e.org_id = public.academy_org_id()
            AND public.academy_user_role() IN ('admin', 'manager')
        )
      )
  )
$$;

-- ── 3. The room view's read path ─────────────────────────────
--
-- The live room screen aggregates pending_responses, not
-- assessment_responses: an unclaimed response - someone who took the
-- assessment and never finished signup - never becomes an
-- assessment_response and is invisible to every other aggregate in
-- the product. In a room that is a large share of submissions, and
-- counting them is what lets the profile fill in before anyone has
-- signed up for anything.
--
-- 027 granted org staff read on their own links' pending rows. A
-- cohort's graders now also read the pending rows of every link
-- pointing at that cohort - which is the room they are standing in
-- front of. This does not widen anything for the attending companies:
-- academy_can_grade_cohort is the delivering org's managers plus the
-- facilitator.

CREATE OR REPLACE FUNCTION public.academy_can_read_link(p_link uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM assessment_links l
    WHERE l.id = p_link
      AND (
        public.academy_user_role() = 'super_admin'
        OR (l.org_id = public.academy_org_id()
            AND public.academy_user_role() IN ('admin', 'manager'))
        -- New in 034: the trainer running the day reads the room.
        OR (l.cohort_id IS NOT NULL
            AND public.academy_can_grade_cohort(l.cohort_id))
      )
  )
$$;
