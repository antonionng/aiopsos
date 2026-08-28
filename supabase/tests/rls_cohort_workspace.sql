-- ============================================================
-- Row-level security tests for the cohort workspace (035).
--
-- Participant packs and submitted work sit inside a cohort that may
-- hold several companies at once, so the interesting assertions are
-- again the negative ones: a pack must reach the room it was written
-- for and nobody else, and one delegate must not be able to submit
-- work against another delegate's enrolment.
--
-- Run against a database that has migrations 001-035 applied:
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_cohort_workspace.sql
--
-- Everything happens inside a transaction that is rolled back, so
-- running this leaves no rows behind. It is safe on a branch or a
-- local stack; do not point it at production.
-- ============================================================

BEGIN;

-- ── Fixtures ─────────────────────────────────────────────────

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('a1000000-0000-0000-0000-0000000000a2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'delegate-a@wksp.test', '', now(), now(), now()),
  ('b1000000-0000-0000-0000-0000000000b2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'delegate-b@wksp.test', '', now(), now(), now()),
  ('a1000000-0000-0000-0000-0000000000a1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@wksp.test',    '', now(), now(), now()),
  ('c1000000-0000-0000-0000-0000000000c1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'outsider@wksp.test',   '', now(), now(), now()),
  ('71000000-0000-0000-0000-000000000071'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'trainer@wksp.test',    '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('d1000000-0000-0000-0000-000000000001'::uuid, 'Wksp Delivery'),
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'Wksp Company A'),
  ('b1000000-0000-0000-0000-000000000001'::uuid, 'Wksp Company B'),
  ('c1000000-0000-0000-0000-000000000001'::uuid, 'Wksp Company C');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('a1000000-0000-0000-0000-0000000000a1'::uuid, 'a1000000-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-a@wksp.test',    'Admin A'),
  ('a1000000-0000-0000-0000-0000000000a2'::uuid, 'a1000000-0000-0000-0000-000000000001'::uuid, 'user',  'delegate-a@wksp.test', 'Delegate A'),
  ('b1000000-0000-0000-0000-0000000000b2'::uuid, 'b1000000-0000-0000-0000-000000000001'::uuid, 'user',  'delegate-b@wksp.test', 'Delegate B'),
  ('c1000000-0000-0000-0000-0000000000c1'::uuid, 'c1000000-0000-0000-0000-000000000001'::uuid, 'admin', 'outsider@wksp.test',   'Outsider'),
  ('71000000-0000-0000-0000-000000000071'::uuid, 'd1000000-0000-0000-0000-000000000001'::uuid, 'user',  'trainer@wksp.test',    'Trainer')
ON CONFLICT (id) DO UPDATE
  SET org_id = EXCLUDED.org_id, role = EXCLUDED.role, name = EXCLUDED.name;

INSERT INTO facilitators (id, user_id, display_name)
VALUES ('71000000-0000-0000-0000-000000000072', '71000000-0000-0000-0000-000000000071'::uuid, 'Trainer');

INSERT INTO courses (id, slug, title, level, status)
VALUES ('71000000-0000-0000-0000-000000000073', 'wksp-course', 'Wksp Course', 'practitioner', 'published');

INSERT INTO cohorts (id, course_id, org_id, facilitator_id, title, delivery_mode, seat_limit)
VALUES ('71000000-0000-0000-0000-000000000074', '71000000-0000-0000-0000-000000000073',
        'd1000000-0000-0000-0000-000000000001'::uuid, '71000000-0000-0000-0000-000000000072',
        'Jakarta, day 1', 'in_person', 40);

INSERT INTO sessions (id, cohort_id, position, title, starts_at, ends_at)
VALUES ('71000000-0000-0000-0000-000000000075', '71000000-0000-0000-0000-000000000074',
        1, 'Morning', now(), now() + interval '3 hours');

INSERT INTO enrolments (id, cohort_id, user_id, org_id) VALUES
  ('71000000-0000-0000-0000-0000000000a5', '71000000-0000-0000-0000-000000000074',
   'a1000000-0000-0000-0000-0000000000a2'::uuid, 'a1000000-0000-0000-0000-000000000001'::uuid),
  ('71000000-0000-0000-0000-0000000000b5', '71000000-0000-0000-0000-000000000074',
   'b1000000-0000-0000-0000-0000000000b2'::uuid, 'b1000000-0000-0000-0000-000000000001'::uuid);

INSERT INTO course_materials (id, course_id, cohort_id, title, filename, storage_path, visibility)
VALUES
  -- Reusable across every delivery of the course.
  ('71000000-0000-0000-0000-0000000000e1', '71000000-0000-0000-0000-000000000073', NULL,
   'Participant pack', 'pack.pdf', 'cohort-workspace/course/pack.pdf', 'enrolled'),
  -- This training day's handout.
  ('71000000-0000-0000-0000-0000000000e2', NULL, '71000000-0000-0000-0000-000000000074',
   'Jakarta day 1 handout', 'day1.pdf', 'cohort-workspace/cohort/day1.pdf', 'enrolled'),
  -- A sample, readable by any signed-in user.
  ('71000000-0000-0000-0000-0000000000e3', '71000000-0000-0000-0000-000000000073', NULL,
   'Sample chapter', 'sample.pdf', 'cohort-workspace/course/sample.pdf', 'public');

-- ── Helpers ──────────────────────────────────────────────────

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

CREATE OR REPLACE FUNCTION pg_temp.count_as_anon(p_sql text)
RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE
  result bigint;
BEGIN
  PERFORM set_config('request.jwt.claims', NULL, true);
  PERFORM set_config('role', 'anon', true);
  EXECUTE p_sql INTO result;
  PERFORM set_config('role', 'none', true);
  RETURN result;
END;
$$;

-- ── Reading packs ────────────────────────────────────────────

DO $$
DECLARE n bigint;
BEGIN
  -- A delegate reads this day's handout...
  n := pg_temp.count_as('a1000000-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM course_materials WHERE id = ''71000000-0000-0000-0000-0000000000e2''');
  ASSERT n = 1, format('delegate A should read the cohort handout, saw %s', n);

  -- ...and the pack attached to the course they are sitting.
  n := pg_temp.count_as('a1000000-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM course_materials WHERE id = ''71000000-0000-0000-0000-0000000000e1''');
  ASSERT n = 1, format('delegate A should read the course pack, saw %s', n);

  -- A delegate from the other company in the same room reads the same
  -- material. Packs are per room, not per employer.
  n := pg_temp.count_as('b1000000-0000-0000-0000-0000000000b2',
        'SELECT count(*) FROM course_materials WHERE id = ''71000000-0000-0000-0000-0000000000e2''');
  ASSERT n = 1, format('delegate B should read the cohort handout, saw %s', n);

  -- NEGATIVE: somebody with no enrolment gets neither.
  n := pg_temp.count_as('c1000000-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM course_materials WHERE id IN (''71000000-0000-0000-0000-0000000000e1'',''71000000-0000-0000-0000-0000000000e2'')');
  ASSERT n = 0, format('an unenrolled user must NOT read packs, saw %s', n);

  -- ...but a 'public' sample is readable by any signed-in user.
  n := pg_temp.count_as('c1000000-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM course_materials WHERE id = ''71000000-0000-0000-0000-0000000000e3''');
  ASSERT n = 1, format('a signed-in user should read a public sample, saw %s', n);

  -- NEGATIVE: and anonymous visitors read nothing at all, sample included.
  n := pg_temp.count_as_anon(
        'SELECT count(*) FROM course_materials');
  ASSERT n = 0, format('anonymous must NOT read any material, saw %s', n);

  -- The trainer reads everything for the room they run.
  n := pg_temp.count_as('71000000-0000-0000-0000-000000000071',
        'SELECT count(*) FROM course_materials WHERE id = ''71000000-0000-0000-0000-0000000000e2''');
  ASSERT n = 1, format('the facilitator should read the cohort handout, saw %s', n);
END $$;

-- ── Writing packs ────────────────────────────────────────────

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: a delegate cannot publish material into the room.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a1000000-0000-0000-0000-0000000000a2"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    INSERT INTO course_materials (cohort_id, title, filename, storage_path)
    VALUES ('71000000-0000-0000-0000-000000000074', 'rogue', 'r.pdf', 'p');
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('a delegate must NOT be able to upload material, inserted %s rows', affected);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: nor can an attending company's admin, who can now read the
  -- cohort but does not run it.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a1000000-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    INSERT INTO course_materials (cohort_id, title, filename, storage_path)
    VALUES ('71000000-0000-0000-0000-000000000074', 'rogue', 'r.pdf', 'p');
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('an attending company admin must NOT upload material, inserted %s rows', affected);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- POSITIVE: the trainer running the day can.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"71000000-0000-0000-0000-000000000071"}', true);
  PERFORM set_config('role', 'authenticated', true);
  INSERT INTO course_materials (cohort_id, title, filename, storage_path)
  VALUES ('71000000-0000-0000-0000-000000000074', 'Exercise 2', 'ex2.pdf', 'cohort-workspace/cohort/ex2.pdf');
  GET DIAGNOSTICS affected = ROW_COUNT;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 1,
    format('the facilitator should be able to upload material, inserted %s rows', affected);
END $$;

-- ── Submitting work ──────────────────────────────────────────

DO $$
DECLARE affected integer := 0;
BEGIN
  -- POSITIVE: a delegate submits against their own enrolment.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a1000000-0000-0000-0000-0000000000a2"}', true);
  PERFORM set_config('role', 'authenticated', true);
  INSERT INTO submissions (session_id, enrolment_id, notes, storage_path)
  VALUES ('71000000-0000-0000-0000-000000000075', '71000000-0000-0000-0000-0000000000a5',
          'my work', 'cohort-workspace/submissions/a.pdf');
  GET DIAGNOSTICS affected = ROW_COUNT;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 1,
    format('a delegate should be able to submit their own work, inserted %s rows', affected);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: and not against somebody else's, in the same room.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a1000000-0000-0000-0000-0000000000a2"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    INSERT INTO submissions (session_id, enrolment_id, notes)
    VALUES ('71000000-0000-0000-0000-000000000075', '71000000-0000-0000-0000-0000000000b5', 'not mine');
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('a delegate must NOT submit against another enrolment, inserted %s rows', affected);
END $$;

SELECT 'RLS cohort workspace tests passed' AS result;

ROLLBACK;
