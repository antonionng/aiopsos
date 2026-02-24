-- Migration 018: Add owner_id to organisations for per-tenant owner notifications

-- 1. Add owner_id column (nullable, references user_profiles)
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL;

-- 2. Backfill: set owner_id to the first user (by id) in each org
UPDATE organisations o
SET owner_id = (
  SELECT id FROM user_profiles
  WHERE org_id = o.id
  ORDER BY id
  LIMIT 1
)
WHERE owner_id IS NULL;

-- 3. Optional: add index on owner_id for lookups
CREATE INDEX IF NOT EXISTS idx_organisations_owner ON organisations(owner_id);
