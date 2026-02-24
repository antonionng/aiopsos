-- ============================================================
-- 010: Assessment templates + RLS fix for super_admin
-- 1. Adds template_id column to assessments
-- 2. Fixes the RLS policy so super_admin can manage assessments
-- Idempotent - safe to run multiple times.
-- ============================================================

-- 1. Add template_id column
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS template_id text NOT NULL DEFAULT 'org-wide';

-- 2. Fix RLS: allow super_admin to manage assessments alongside admin
DROP POLICY IF EXISTS "Admins manage assessments" ON assessments;

CREATE POLICY "Admins manage assessments" ON assessments
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
