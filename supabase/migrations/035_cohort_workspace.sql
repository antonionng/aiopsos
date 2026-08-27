-- ============================================================
-- 035: The cohort workspace - participant packs down, work up
--
-- Replaces the Google Drive step in the delivery workflow. Today
-- a trainer puts participant packs in Drive and collects work back
-- by hand; nothing in the product holds either. knowledge_base_files
-- is org-scoped fuel for the AI companions, not course material, and
-- course_modules.lab_url is a single external link rendered only on
-- the public course page.
--
-- Two directions, one surface:
--   * materials down - a pack attached to a COURSE is reusable
--     across every delivery of it; attached to a COHORT it is that
--     day's handout. Both are needed, hence two nullable FKs and a
--     CHECK that at least one is set.
--   * work up - submissions already exist (021) and POST
--     /api/submissions already works, with RLS enforcing that
--     participants submit against their own enrolment while
--     facilitators may submit on someone's behalf. It simply has no
--     caller and no way to attach a file. storage_path fixes the
--     second half.
--
-- SCOPE. These are handouts supporting live facilitation. This is
-- not video hosting, not SCORM, and not self-paced completion
-- standing in for a facilitated course - the platform records that
-- training happened, it does not replace the trainer.
--
-- STORAGE. The bucket is private and carries no storage.objects
-- policies at all, so nothing but the service role can reach an
-- object directly. Every read is brokered by an API route that
-- checks academy_can_read_material and then issues a short-lived
-- signed URL. In a cohort with several companies in the room, a
-- leaked object path would otherwise cross a company boundary, and
-- URL obscurity is not an access control.
--
-- Verified on a throwaway branch database of ecxsqzvhsydpgstvvxxo on
-- 27 Aug 2026 before being applied to it: the 12 assertions in
-- supabase/tests/rls_cohort_workspace.sql passed, including the two that
-- matter most for a shared room - an unenrolled user reads no packs, and
-- a delegate cannot submit work against another delegate's enrolment.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES cohorts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  filename text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT '',
  position int NOT NULL DEFAULT 0,
  -- 'enrolled': the cohort's participants and graders.
  -- 'public'  : any signed-in user, for a sample pack. Never anonymous.
  visibility text NOT NULL DEFAULT 'enrolled'
    CHECK (visibility IN ('enrolled', 'public')),
  uploaded_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_materials_scope_present
    CHECK (course_id IS NOT NULL OR cohort_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_cohort ON course_materials(cohort_id);

-- Work handed in as a file rather than a link. artefact_url stays for
-- the link case; a submission may have either, or both.
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS storage_path text;

-- ── Access helpers ───────────────────────────────────────────
--
-- See the note in 021 about the Supabase linter and SECURITY DEFINER:
-- do not revoke EXECUTE from these, or every policy below fails with
-- "permission denied for function".

/**
 * Read a pack: super admins, the cohort's graders, anyone enrolled on
 * the cohort it belongs to - or, for a course-scoped pack, anyone
 * enrolled on any cohort of that course. 'public' packs are readable
 * by any signed-in user.
 */
CREATE OR REPLACE FUNCTION public.academy_can_read_material(p_material uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM course_materials m
    WHERE m.id = p_material
      AND (
        public.academy_user_role() = 'super_admin'
        OR (m.visibility = 'public' AND auth.uid() IS NOT NULL)
        OR (m.cohort_id IS NOT NULL
            AND public.academy_can_grade_cohort(m.cohort_id))
        OR (m.cohort_id IS NOT NULL AND EXISTS (
              SELECT 1 FROM enrolments e
              WHERE e.cohort_id = m.cohort_id AND e.user_id = auth.uid()))
        OR (m.course_id IS NOT NULL AND EXISTS (
              SELECT 1 FROM enrolments e
              JOIN cohorts c ON c.id = e.cohort_id
              WHERE c.course_id = m.course_id AND e.user_id = auth.uid()))
        OR (m.course_id IS NOT NULL AND EXISTS (
              SELECT 1 FROM cohorts c
              WHERE c.course_id = m.course_id
                AND public.academy_can_grade_cohort(c.id)))
      )
  )
$$;

/**
 * Write a pack: super admins anywhere; a cohort's graders on their own
 * cohort. Course-scoped packs are catalogue content, and the catalogue
 * has been super-admin-only since 020, so they stay that way.
 */
CREATE OR REPLACE FUNCTION public.academy_can_write_material(
  p_course uuid, p_cohort uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT public.academy_user_role() = 'super_admin'
      OR (p_cohort IS NOT NULL AND public.academy_can_grade_cohort(p_cohort))
$$;

-- ── Policies ─────────────────────────────────────────────────

ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Material audience reads materials" ON course_materials;
CREATE POLICY "Material audience reads materials"
  ON course_materials FOR SELECT
  USING (public.academy_can_read_material(id));

DROP POLICY IF EXISTS "Graders add materials" ON course_materials;
CREATE POLICY "Graders add materials"
  ON course_materials FOR INSERT
  WITH CHECK (public.academy_can_write_material(course_id, cohort_id));

DROP POLICY IF EXISTS "Graders amend materials" ON course_materials;
CREATE POLICY "Graders amend materials"
  ON course_materials FOR UPDATE
  USING (public.academy_can_write_material(course_id, cohort_id))
  WITH CHECK (public.academy_can_write_material(course_id, cohort_id));

DROP POLICY IF EXISTS "Graders remove materials" ON course_materials;
CREATE POLICY "Graders remove materials"
  ON course_materials FOR DELETE
  USING (public.academy_can_write_material(course_id, cohort_id));

-- ── Storage ──────────────────────────────────────────────────
--
-- Private, and deliberately without policies: reads and writes are
-- brokered by API routes running as the service role, after they have
-- checked academy_can_read_material / academy_can_write_material.

INSERT INTO storage.buckets (id, name, public)
VALUES ('cohort-workspace', 'cohort-workspace', false)
ON CONFLICT (id) DO NOTHING;
