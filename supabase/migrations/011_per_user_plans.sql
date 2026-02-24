-- ============================================================
-- 009: Per-user plan assignment
-- Adds plan_override to user_profiles so admins can assign
-- individual users to different plan tiers.
-- NULL = inherit org plan (preserves current behaviour).
-- Idempotent - safe to run multiple times.
-- ============================================================

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS plan_override text;

-- Add check constraint if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_plan_override_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_plan_override_check
      CHECK (plan_override IS NULL OR plan_override IN ('basic', 'pro', 'enterprise'));
  END IF;
END $$;
