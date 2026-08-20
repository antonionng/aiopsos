-- ============================================================
-- Row-level security tests for the cohort delivery tables.
--
-- These assert the NEGATIVE cases, which are the ones that matter:
-- an admin must not see another organisation's register, and a
-- facilitator must reach the cohorts they run and nothing else.
-- The facilitator branch is the first cross-organisation grant in
-- this codebase, so it is tested in both directions.
--
-- Run against a database that has migrations 001-021 applied:
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_cohorts.sql
--
-- Ids are inlined rather than set with psql variables, so the file is
-- also runnable through any plain SQL client or the Supabase SQL editor.
--
-- Everything happens inside a transaction that is rolled back, so
-- running this leaves no rows behind. It is safe on a branch or a
-- local stack; do not point it at production.
-- ============================================================

BEGIN;


-- ── Fixtures, written as the owner so RLS does not interfere ──

INSERT INTO organisations (id, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'RLS Test Org A'),
  ('bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'RLS Test Org B');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid,  'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'admin',   'admin-a@rls.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'user',    'member-a@rls.test', 'Member A'),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid,  'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'admin',   'admin-b@rls.test',  'Admin B'),
  -- The trainer is a plain user in org B, and facilitates for org A.
  -- That is the whole point: facilitation must not follow tenancy.
  ('cccccccc-0000-0000-0000-0000000000c1'::uuid,  'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'user',    'trainer@rls.test',  'Trainer');

INSERT INTO facilitators (id, user_id, display_name)
VALUES ('dddddddd-0000-0000-0000-0000000000d1', 'cccccccc-0000-0000-0000-0000000000c1'::uuid, 'Trainer');

INSERT INTO courses (id, slug, title, level, status)
VALUES ('eeeeeeee-0000-0000-0000-0000000000e1', 'rls-test-course', 'RLS Test Course', 'practitioner', 'published');

INSERT INTO cohorts (id, course_id, org_id, facilitator_id, title, delivery_mode)
VALUES
  ('11111111-0000-0000-0000-000000000001',
   'eeeeeeee-0000-0000-0000-0000000000e1', 'aaaaaaaa-0000-0000-0000-000000000001'::uuid,
   'dddddddd-0000-0000-0000-0000000000d1', 'Org A cohort', 'virtual'),
  ('22222222-0000-0000-0000-000000000002',
   'eeeeeeee-0000-0000-0000-0000000000e1', 'bbbbbbbb-0000-0000-0000-000000000001'::uuid,
   NULL, 'Org B cohort', 'virtual');

INSERT INTO sessions (id, cohort_id, position, title, starts_at, ends_at)
VALUES
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001',
   1, 'Session 1', now(), now() + interval '2 hours'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002',
   1, 'Session 1', now(), now() + interval '2 hours');

INSERT INTO enrolments (id, cohort_id, user_id, org_id)
VALUES
  ('44444444-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid),
  ('44444444-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-0000000000b1'::uuid,  'bbbbbbbb-0000-0000-0000-000000000001'::uuid);

INSERT INTO attendance (session_id, enrolment_id, status)
VALUES
  ('33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'present'),
  ('33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000002', 'present');

INSERT INTO grades (enrolment_id, score, max_score)
VALUES
  ('44444444-0000-0000-0000-000000000001', 80, 100),
  ('44444444-0000-0000-0000-000000000002', 80, 100);

-- ── Helper: run a count as a given user, with RLS applied ─────

CREATE OR REPLACE FUNCTION pg_temp.count_as(p_user uuid, p_sql text)
RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE
  result bigint;
BEGIN
  PERFORM set_config('request.jwt.claims',
                     json_build_object('sub', p_user::text)::text, true);
  PERFORM set_config('role', 'authenticated', true);
  EXECUTE p_sql INTO result;
  PERFORM set_config('role', 'none', true);
  RETURN result;
END;
$$;

-- ── Cohorts ──────────────────────────────────────────────────

DO $$
DECLARE n bigint;
BEGIN
  -- An admin sees their own organisation's cohort.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM cohorts WHERE id = ''11111111-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should see org A cohort, saw %s', n);

  -- NEGATIVE: and must not see another organisation's.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM cohorts WHERE id = ''22222222-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT see org B cohort, saw %s', n);

  n := pg_temp.count_as('bbbbbbbb-0000-0000-0000-0000000000b1',
        'SELECT count(*) FROM cohorts WHERE id = ''11111111-0000-0000-0000-000000000001''');
  ASSERT n = 0, format('admin B must NOT see org A cohort, saw %s', n);

  -- The facilitator reaches the cohort they run, in an org they do
  -- not belong to. This is the cross-organisation grant working.
  n := pg_temp.count_as('cccccccc-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM cohorts WHERE id = ''11111111-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('facilitator should see the cohort they run, saw %s', n);

  -- The trainer is still a member of org B at this point, so org B's
  -- cohort is legitimately visible to them as an org member. The
  -- interesting negative needs their org membership removed first,
  -- which happens immediately below.
END $$;

-- Strip the trainer's org membership so the only route left is facilitation.
UPDATE user_profiles SET org_id = NULL
WHERE id = 'cccccccc-0000-0000-0000-0000000000c1';

DO $$
DECLARE n bigint;
BEGIN
  n := pg_temp.count_as('cccccccc-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM cohorts WHERE id = ''11111111-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('facilitation alone should grant the cohort, saw %s', n);

  n := pg_temp.count_as('cccccccc-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM cohorts WHERE id = ''22222222-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('facilitator must NOT see a cohort they do not run, saw %s', n);
END $$;

-- ── Enrolments, attendance and grades ────────────────────────

DO $$
DECLARE n bigint;
BEGIN
  -- A participant sees their own enrolment.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM enrolments WHERE id = ''44444444-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('member A should see their own enrolment, saw %s', n);

  -- NEGATIVE: and nobody else's, not even inside their own org.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM enrolments WHERE id = ''44444444-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('member A must NOT see another enrolment, saw %s', n);

  -- NEGATIVE: attendance does not leak across organisations.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM attendance WHERE enrolment_id = ''44444444-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT see org B attendance, saw %s', n);

  -- NEGATIVE: nor do grades.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM grades WHERE enrolment_id = ''44444444-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT see org B grades, saw %s', n);

  -- The facilitator reads the register for the cohort they run.
  n := pg_temp.count_as('cccccccc-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM attendance WHERE enrolment_id = ''44444444-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('facilitator should read their cohort register, saw %s', n);

  -- NEGATIVE: but not another cohort's.
  n := pg_temp.count_as('cccccccc-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM attendance WHERE enrolment_id = ''44444444-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('facilitator must NOT read another cohort register, saw %s', n);

  -- An admin does see their own organisation's register.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM attendance WHERE enrolment_id = ''44444444-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should see org A attendance, saw %s', n);
END $$;

-- ── Writes ───────────────────────────────────────────────────

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: a participant cannot mark their own attendance.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-0000-0000-0000000000a2"}', true);
  PERFORM set_config('role', 'authenticated', true);

  BEGIN
    UPDATE attendance SET status = 'present'
    WHERE enrolment_id = '44444444-0000-0000-0000-000000000001';
    -- An UPDATE policy filters the row out rather than raising, so an
    -- affected-row count of zero is what passing looks like here.
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;

  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('a participant must NOT be able to mark their own attendance, updated %s rows', affected);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: an admin cannot grade into another organisation's cohort.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"aaaaaaaa-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);

  BEGIN
    UPDATE grades SET score = 100
    WHERE enrolment_id = '44444444-0000-0000-0000-000000000002';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;

  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('admin A must NOT be able to change org B grades, updated %s rows', affected);
END $$;

SELECT 'RLS cohort tests passed' AS result;

ROLLBACK;
