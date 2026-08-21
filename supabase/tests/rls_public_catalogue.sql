-- ============================================================
-- The public course catalogue must be readable by anonymous
-- visitors, and must not drag any other table into that path.
--
-- This exists because it did not work. Migration 020 gave courses
-- a FOR ALL policy that consulted user_profiles, and migration
-- 002 had left a user_profiles policy that selected from
-- user_profiles. An anonymous read of the catalogue therefore
-- failed with 42P17 and the page rendered empty. Migration 023
-- fixes both halves; this asserts the fix.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_public_catalogue.sql
-- ============================================================

BEGIN;

DO $$
DECLARE n bigint;
BEGIN
  -- Anonymous, exactly as an unauthenticated visitor arrives.
  PERFORM set_config('request.jwt.claims', '', true);
  PERFORM set_config('role', 'anon', true);

  SELECT count(*) INTO n FROM courses WHERE status = 'published';
  ASSERT n > 0, 'an anonymous visitor must be able to read published courses';

  SELECT count(*) INTO n FROM course_modules;
  ASSERT n > 0, 'an anonymous visitor must be able to read published course modules';

  -- NEGATIVE: nothing else in the schema opens up as a side effect.
  SELECT count(*) INTO n FROM user_profiles;
  ASSERT n = 0, format('an anonymous visitor must NOT read user_profiles, saw %s', n);

  SELECT count(*) INTO n FROM cohorts;
  ASSERT n = 0, format('an anonymous visitor must NOT read cohorts, saw %s', n);

  SELECT count(*) INTO n FROM enrolments;
  ASSERT n = 0, format('an anonymous visitor must NOT read enrolments, saw %s', n);

  PERFORM set_config('role', 'none', true);
END $$;

-- A draft course is internal and must not appear publicly.
INSERT INTO courses (slug, title, level, status)
VALUES ('draft-probe', 'Draft Probe', 'practitioner', 'draft');

DO $$
DECLARE n bigint;
BEGIN
  PERFORM set_config('request.jwt.claims', '', true);
  PERFORM set_config('role', 'anon', true);
  SELECT count(*) INTO n FROM courses WHERE slug = 'draft-probe';
  PERFORM set_config('role', 'none', true);
  ASSERT n = 0, format('a draft course must NOT be publicly readable, saw %s', n);
END $$;

SELECT 'public catalogue RLS tests passed' AS result;

ROLLBACK;
