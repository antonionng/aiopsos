-- ============================================================
-- 027: Funnel hardening
--
-- Two problems, both invisible until you look for them.
--
-- 1. `pending_responses` has exactly one SELECT policy:
--    `claimed_by = auth.uid()`. So an admin looking at their own
--    assessment links counts zero responses no matter how many
--    people have taken it, and the "N people have already taken
--    this" line on the public results page can never render,
--    because both read through a client that satisfies no policy.
--    Worse: an unclaimed response - someone who took the
--    assessment and never finished signup - is invisible to
--    everyone, forever. Org staff can now read the pending rows
--    belonging to their own links.
--
-- 2. `claimed_at` records when a response was attached, which the
--    idempotent claim path in lib/assess-claim.ts wants for
--    diagnosis: `claimed_by` alone cannot distinguish "claimed
--    just now" from "claimed last week during a failed retry".
--
-- Idempotent - safe to run multiple times.
-- ============================================================

ALTER TABLE pending_responses
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

-- Backfill so existing claimed rows are not indistinguishable from
-- unclaimed ones on the new column.
UPDATE pending_responses
SET claimed_at = created_at
WHERE claimed_by IS NOT NULL AND claimed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_pending_responses_claimed
  ON pending_responses(claimed_by);

-- ── Staff read access, scoped to their own organisation's links ──
--
-- SECURITY DEFINER for the usual reason: a policy that reads another
-- RLS-protected table has that table's policies applied inside it,
-- which is both slow and easy to get subtly wrong. Prefixed
-- `academy_` because this is a shared `public` schema and a generic
-- name here once collided with another product's function.
-- Do NOT revoke EXECUTE: RLS evaluates policy expressions with the
-- calling role's privileges, so revoking breaks every policy below.

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
      )
  )
$$;

DROP POLICY IF EXISTS "Org staff read their link responses" ON pending_responses;
CREATE POLICY "Org staff read their link responses"
  ON pending_responses FOR SELECT
  USING (public.academy_can_read_link(link_id));
