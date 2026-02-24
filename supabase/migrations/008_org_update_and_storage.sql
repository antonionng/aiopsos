-- ============================================================
-- 006: Org UPDATE policy, storage buckets, profiles, and role fix
-- Safe to re-run (idempotent)
-- ============================================================

-- 0a. Ensure role constraint allows super_admin
--     (migration 002 may not have been applied)
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('super_admin', 'admin', 'manager', 'user'));

-- 0b. Retroactive data fix: create profiles for auth users who
--     registered but have no user_profiles row
INSERT INTO user_profiles (id, email, name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', ''),
  'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Force promote ag@experrt.com to super_admin
UPDATE user_profiles SET role = 'super_admin'
WHERE email = 'ag@experrt.com';

-- Create Previsico org and assign ag@experrt.com to it (if no org exists for them)
DO $$
DECLARE
  previsico_id uuid;
  sa_id uuid;
BEGIN
  SELECT id INTO sa_id FROM user_profiles WHERE email = 'ag@experrt.com' LIMIT 1;

  IF sa_id IS NOT NULL AND (SELECT org_id FROM user_profiles WHERE id = sa_id) IS NULL THEN
    INSERT INTO organisations (name, industry, size)
    VALUES ('Previsico', 'Technology', '10-50')
    RETURNING id INTO previsico_id;

    UPDATE user_profiles SET org_id = previsico_id WHERE id = sa_id;
  END IF;
END $$;

-- Create a default org for non-super_admin users who have no org,
-- and assign them to it
DO $$
DECLARE
  r RECORD;
  new_org_id uuid;
BEGIN
  FOR r IN
    SELECT id, email, COALESCE(
      (SELECT raw_user_meta_data->>'org_name' FROM auth.users a WHERE a.id = user_profiles.id),
      'My Organisation'
    ) AS org_name
    FROM user_profiles
    WHERE org_id IS NULL AND role != 'super_admin'
  LOOP
    INSERT INTO organisations (name) VALUES (r.org_name)
    RETURNING id INTO new_org_id;

    UPDATE user_profiles SET org_id = new_org_id, role = 'admin'
    WHERE id = r.id;
  END LOOP;
END $$;

-- 1. Organisation UPDATE RLS policy
DROP POLICY IF EXISTS "Admins update own org" ON organisations;
CREATE POLICY "Admins update own org" ON organisations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM user_profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'manager', 'super_admin')
    )
  );

-- 2. Auto-promote the first user in each org to admin
--    (only affects users still at default 'user' role who are
--     the earliest member of their org)
UPDATE user_profiles
SET role = 'admin'
WHERE role = 'user'
  AND org_id IS NOT NULL
  AND id = (
    SELECT id FROM user_profiles p2
    WHERE p2.org_id = user_profiles.org_id
    ORDER BY p2.id   -- deterministic pick when no created_at
    LIMIT 1
  );

-- 3. Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Avatar storage policies
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Logo storage policies
DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
CREATE POLICY "Anyone can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Admins upload org logo" ON storage.objects;
CREATE POLICY "Admins upload org logo" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] IN (
      SELECT org_id::text FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins update org logo" ON storage.objects;
CREATE POLICY "Admins update org logo" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] IN (
      SELECT org_id::text FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins delete org logo" ON storage.objects;
CREATE POLICY "Admins delete org logo" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] IN (
      SELECT org_id::text FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
    )
  );
