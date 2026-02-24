-- Migration 019: Seed ag@experrt.com as owner of Previsico and creator of assessment links

-- Ensure owner_id column exists (in case 018 wasn't run)
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL;

-- 1. Set owner_id on Previsico org to the first user with email ag@experrt.com
UPDATE organisations
SET owner_id = (
  SELECT id FROM user_profiles WHERE email = 'ag@experrt.com' LIMIT 1
)
WHERE name = 'Previsico'
  AND owner_id IS NULL;

-- 2. Set created_by on assessment_links if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessment_links') THEN
    UPDATE assessment_links
    SET created_by = (
      SELECT id FROM user_profiles WHERE email = 'ag@experrt.com' LIMIT 1
    )
    WHERE org_id IN (SELECT id FROM organisations WHERE name = 'Previsico')
      AND created_by IS NULL;
  END IF;
END $$;

-- 3. Set created_by on assessments if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') THEN
    UPDATE assessments
    SET created_by = (
      SELECT id FROM user_profiles WHERE email = 'ag@experrt.com' LIMIT 1
    )
    WHERE org_id IN (SELECT id FROM organisations WHERE name = 'Previsico')
      AND created_by IS NULL;
  END IF;
END $$;
