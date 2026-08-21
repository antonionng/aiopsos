-- ============================================================
-- 023: Fix infinite recursion in the user_profiles RLS policy
--
-- Migration 002 created:
--
--   create policy "Super admins view all profiles" on user_profiles
--     for select using (exists (
--       select 1 from user_profiles p
--       where p.id = auth.uid() and p.role = 'super_admin'));
--
-- A policy on user_profiles that selects from user_profiles. Postgres
-- re-applies the policy to that inner read, and the read fails with
--
--   42P17: infinite recursion detected in policy for relation "user_profiles"
--
-- It stayed dormant for as long as nothing made an unprivileged read
-- reach user_profiles. Migration 020 changed that: its "Super admins
-- manage courses" policy is FOR ALL, so it also runs on SELECT, and an
-- anonymous visitor loading the public course catalogue hit the
-- recursion and got an empty page.
--
-- Two fixes, because either alone would leave the trap armed:
--
--   1. The user_profiles policy now asks a SECURITY DEFINER function
--      instead of querying itself. The function runs as its owner and
--      so is not subject to the policy, which breaks the cycle.
--   2. The catalogue's write policies are split out by command, so the
--      public read path never consults user_profiles at all.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

-- ── 1. The recursion itself ──────────────────────────────────
-- public.academy_user_role() is defined in 021. Despite the prefix it is
-- simply "the tenancy role of the caller", read with SECURITY DEFINER,
-- which is exactly what this policy needs.

DROP POLICY IF EXISTS "Super admins view all profiles" ON user_profiles;
CREATE POLICY "Super admins view all profiles"
  ON user_profiles FOR SELECT
  USING (public.academy_user_role() = 'super_admin');

-- ── 2. Keep user_profiles out of the public catalogue read path ──
-- Splitting FOR ALL into per-command policies means an anonymous SELECT
-- is answered by the published-status policy alone.

DROP POLICY IF EXISTS "Super admins manage courses" ON courses;

DROP POLICY IF EXISTS "Super admins read all courses" ON courses;
CREATE POLICY "Super admins read all courses"
  ON courses FOR SELECT
  USING (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins insert courses" ON courses;
CREATE POLICY "Super admins insert courses"
  ON courses FOR INSERT
  WITH CHECK (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins update courses" ON courses;
CREATE POLICY "Super admins update courses"
  ON courses FOR UPDATE
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins delete courses" ON courses;
CREATE POLICY "Super admins delete courses"
  ON courses FOR DELETE
  USING (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins manage course modules" ON course_modules;

DROP POLICY IF EXISTS "Super admins read all course modules" ON course_modules;
CREATE POLICY "Super admins read all course modules"
  ON course_modules FOR SELECT
  USING (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins insert course modules" ON course_modules;
CREATE POLICY "Super admins insert course modules"
  ON course_modules FOR INSERT
  WITH CHECK (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins update course modules" ON course_modules;
CREATE POLICY "Super admins update course modules"
  ON course_modules FOR UPDATE
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins delete course modules" ON course_modules;
CREATE POLICY "Super admins delete course modules"
  ON course_modules FOR DELETE
  USING (public.academy_user_role() = 'super_admin');
