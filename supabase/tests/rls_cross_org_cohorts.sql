-- ============================================================
-- Row-level security tests for cross-organisation cohorts (034).
--
-- The October tour puts several companies in one cohort. That is
-- only safe if a widened READ on the cohort does not drag anything
-- else across the company boundary with it, so most of what follows
-- is negative assertions: an attending company's admin must see the
-- cohort and their own people, and nothing whatsoever of the company
-- sitting at the next table.
--
-- Run against a database that has migrations 001-034 applied:
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_cross_org_cohorts.sql
--
-- Ids are inlined rather than set with psql variables, so the file is
-- also runnable through any plain SQL client or the Supabase SQL editor.
--
-- Everything happens inside a transaction that is rolled back, so
-- running this leaves no rows behind. It is safe on a branch or a
-- local stack; do not point it at production.
-- ============================================================

BEGIN;

-- ── Fixtures: a delivering org, two attending companies, one
--    company with nobody in the room, one trainer ──────────────

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('d0000000-0000-0000-0000-0000000000d1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'delivery-admin@xorg.test', '', now(), now(), now()),
  ('a0000000-0000-0000-0000-0000000000a1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@xorg.test',       '', now(), now(), now()),
  ('a0000000-0000-0000-0000-0000000000a2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'delegate-a@xorg.test',    '', now(), now(), now()),
  ('b0000000-0000-0000-0000-0000000000b1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@xorg.test',       '', now(), now(), now()),
  ('b0000000-0000-0000-0000-0000000000b2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'delegate-b@xorg.test',    '', now(), now(), now()),
  ('c0000000-0000-0000-0000-0000000000c1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-c@xorg.test',       '', now(), now(), now()),
  ('70000000-0000-0000-0000-000000000071'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'trainer@xorg.test',       '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('d0000000-0000-0000-0000-000000000001'::uuid, 'XOrg Delivery Partner'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'XOrg Company A'),
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'XOrg Company B'),
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'XOrg Company C (not in the room)');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('d0000000-0000-0000-0000-0000000000d1'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'delivery-admin@xorg.test', 'Delivery Admin'),
  ('a0000000-0000-0000-0000-0000000000a1'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-a@xorg.test',        'Admin A'),
  ('a0000000-0000-0000-0000-0000000000a2'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'user',  'delegate-a@xorg.test',     'Delegate A'),
  ('b0000000-0000-0000-0000-0000000000b1'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-b@xorg.test',        'Admin B'),
  ('b0000000-0000-0000-0000-0000000000b2'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'user',  'delegate-b@xorg.test',     'Delegate B'),
  ('c0000000-0000-0000-0000-0000000000c1'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-c@xorg.test',        'Admin C'),
  -- The trainer belongs to the delivering org, but facilitation is what
  -- grants them the room, not membership.
  ('70000000-0000-0000-0000-000000000071'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'user',  'trainer@xorg.test',        'Trainer')
ON CONFLICT (id) DO UPDATE
  SET org_id = EXCLUDED.org_id, role = EXCLUDED.role, name = EXCLUDED.name;

INSERT INTO facilitators (id, user_id, display_name)
VALUES ('70000000-0000-0000-0000-000000000072', '70000000-0000-0000-0000-000000000071'::uuid, 'Trainer');

INSERT INTO courses (id, slug, title, level, status)
VALUES ('70000000-0000-0000-0000-000000000073', 'xorg-test-course', 'XOrg Test Course', 'practitioner', 'published');

-- The shared training day: owned by the DELIVERING org, with delegates
-- from companies A and B in the room.
INSERT INTO cohorts (id, course_id, org_id, facilitator_id, title, delivery_mode, seat_limit)
VALUES ('70000000-0000-0000-0000-000000000074',
        '70000000-0000-0000-0000-000000000073',
        'd0000000-0000-0000-0000-000000000001'::uuid,
        '70000000-0000-0000-0000-000000000072',
        'Kuala Lumpur, day 1', 'in_person', 40);

INSERT INTO sessions (id, cohort_id, position, title, starts_at, ends_at)
VALUES ('70000000-0000-0000-0000-000000000075', '70000000-0000-0000-0000-000000000074',
        1, 'Morning', now(), now() + interval '3 hours');

INSERT INTO enrolments (id, cohort_id, user_id, org_id)
VALUES
  ('70000000-0000-0000-0000-0000000000a5', '70000000-0000-0000-0000-000000000074',
   'a0000000-0000-0000-0000-0000000000a2'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid),
  ('70000000-0000-0000-0000-0000000000b5', '70000000-0000-0000-0000-000000000074',
   'b0000000-0000-0000-0000-0000000000b2'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid);

INSERT INTO attendance (session_id, enrolment_id, status) VALUES
  ('70000000-0000-0000-0000-000000000075', '70000000-0000-0000-0000-0000000000a5', 'present'),
  ('70000000-0000-0000-0000-000000000075', '70000000-0000-0000-0000-0000000000b5', 'present');

INSERT INTO grades (enrolment_id, score, max_score) VALUES
  ('70000000-0000-0000-0000-0000000000a5', 80, 100),
  ('70000000-0000-0000-0000-0000000000b5', 90, 100);

INSERT INTO submissions (id, session_id, enrolment_id, notes) VALUES
  ('70000000-0000-0000-0000-0000000000a6', '70000000-0000-0000-0000-000000000075',
   '70000000-0000-0000-0000-0000000000a5', 'Company A delegate work'),
  ('70000000-0000-0000-0000-0000000000b6', '70000000-0000-0000-0000-000000000075',
   '70000000-0000-0000-0000-0000000000b5', 'Company B delegate work');

-- Per-company QR links, both pointing at the same training day. This is
-- what the live room view aggregates on.
INSERT INTO assessment_links (id, org_id, created_by, token, title, cohort_id) VALUES
  ('70000000-0000-0000-0000-0000000000a7', 'a0000000-0000-0000-0000-000000000001'::uuid,
   'a0000000-0000-0000-0000-0000000000a1'::uuid, 'xorg-a-kl-day1', 'Company A', '70000000-0000-0000-0000-000000000074'),
  ('70000000-0000-0000-0000-0000000000b7', 'b0000000-0000-0000-0000-000000000001'::uuid,
   'b0000000-0000-0000-0000-0000000000b1'::uuid, 'xorg-b-kl-day1', 'Company B', '70000000-0000-0000-0000-000000000074');

-- An unclaimed response against each: nobody has finished signup yet,
-- which is precisely the state the room view has to be able to read.
INSERT INTO pending_responses (id, link_id, session_token) VALUES
  ('70000000-0000-0000-0000-0000000000a8', '70000000-0000-0000-0000-0000000000a7', 'xorg-pending-a'),
  ('70000000-0000-0000-0000-0000000000b8', '70000000-0000-0000-0000-0000000000b7', 'xorg-pending-b');

-- ── Helpers: run a count as a given user, with RLS applied ────

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

-- ── The new read grants ──────────────────────────────────────

DO $$
DECLARE n bigint;
BEGIN
  -- THE central fix: a delegate reads the cohort they are enrolled on,
  -- although their employer is not delivering it. Without this,
  -- /api/my-learning returns an enrolment with no cohort and no
  -- sessions, and the learner sees attendance with nothing to attach
  -- it to.
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM cohorts WHERE id = ''70000000-0000-0000-0000-000000000074''');
  ASSERT n = 1, format('delegate A should read the cohort they are on, saw %s', n);

  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM sessions WHERE cohort_id = ''70000000-0000-0000-0000-000000000074''');
  ASSERT n = 1, format('delegate A should read the cohort sessions, saw %s', n);

  -- An attending company's admin reads the cohort their staff sat.
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM cohorts WHERE id = ''70000000-0000-0000-0000-000000000074''');
  ASSERT n = 1, format('admin A should read the shared cohort, saw %s', n);

  -- NEGATIVE: a company with nobody in the room reads nothing. The new
  -- grant is enrolment-shaped, not "any admin anywhere".
  n := pg_temp.count_as('c0000000-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM cohorts WHERE id = ''70000000-0000-0000-0000-000000000074''');
  ASSERT n = 0, format('admin C has nobody in the room and must NOT read the cohort, saw %s', n);
END $$;

-- ── The containment that makes a shared cohort safe ──────────

DO $$
DECLARE n bigint;
BEGIN
  -- Admin A sees their own delegate's enrolment...
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM enrolments WHERE id = ''70000000-0000-0000-0000-0000000000a5''');
  ASSERT n = 1, format('admin A should see their own delegate enrolment, saw %s', n);

  -- ...and NONE of company B's, in the same cohort. This is the
  -- assertion the whole design rests on.
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM enrolments WHERE id = ''70000000-0000-0000-0000-0000000000b5''');
  ASSERT n = 0, format('admin A must NOT see company B enrolment in the shared cohort, saw %s', n);

  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM attendance WHERE enrolment_id = ''70000000-0000-0000-0000-0000000000b5''');
  ASSERT n = 0, format('admin A must NOT see company B attendance, saw %s', n);

  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM grades WHERE enrolment_id = ''70000000-0000-0000-0000-0000000000b5''');
  ASSERT n = 0, format('admin A must NOT see company B grades, saw %s', n);

  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM submissions WHERE enrolment_id = ''70000000-0000-0000-0000-0000000000b5''');
  ASSERT n = 0, format('admin A must NOT see company B submissions, saw %s', n);

  -- A delegate sees only themselves, even inside their own company.
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM enrolments WHERE id = ''70000000-0000-0000-0000-0000000000b5''');
  ASSERT n = 0, format('delegate A must NOT see another delegate enrolment, saw %s', n);

  -- The trainer running the day reads across every company in it.
  n := pg_temp.count_as('70000000-0000-0000-0000-000000000071',
        'SELECT count(*) FROM enrolments WHERE cohort_id = ''70000000-0000-0000-0000-000000000074''');
  ASSERT n = 2, format('the facilitator should read the whole room, saw %s', n);
END $$;

-- ── Reading the cohort must not confer writing it ────────────

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: an attending company's admin can now READ the cohort.
  -- They must still not be able to edit it.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a0000000-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);

  BEGIN
    UPDATE cohorts SET title = 'hijacked'
    WHERE id = '70000000-0000-0000-0000-000000000074';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;

  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('admin A must NOT be able to edit the delivering org cohort, updated %s rows', affected);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: nor enrol anyone into it.
  PERFORM set_config('request.jwt.claims',
    '{"sub":"a0000000-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);

  BEGIN
    INSERT INTO enrolments (cohort_id, user_id, org_id)
    VALUES ('70000000-0000-0000-0000-000000000074',
            'a0000000-0000-0000-0000-0000000000a1'::uuid,
            'a0000000-0000-0000-0000-000000000001'::uuid);
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    affected := 0;
  END;

  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0,
    format('admin A must NOT be able to enrol into the shared cohort, inserted %s rows', affected);
END $$;

-- ── The room view's read path ────────────────────────────────

DO $$
DECLARE n bigint;
BEGIN
  -- The trainer reads unclaimed responses for every company in the
  -- room. Nobody has signed up yet, so this is the only way the room
  -- profile can fill in live.
  n := pg_temp.count_as('70000000-0000-0000-0000-000000000071',
        'SELECT count(*) FROM pending_responses WHERE id IN (''70000000-0000-0000-0000-0000000000a8'',''70000000-0000-0000-0000-0000000000b8'')');
  ASSERT n = 2, format('the facilitator should read the whole room pending responses, saw %s', n);

  -- Each company still reads only its own link responses, as in 027.
  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM pending_responses WHERE id = ''70000000-0000-0000-0000-0000000000a8''');
  ASSERT n = 1, format('admin A should read their own link responses, saw %s', n);

  n := pg_temp.count_as('a0000000-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM pending_responses WHERE id = ''70000000-0000-0000-0000-0000000000b8''');
  ASSERT n = 0, format('admin A must NOT read company B link responses, saw %s', n);
END $$;

-- ── Recursion guard ──────────────────────────────────────────
--
-- 023 was armed by an anonymous visitor loading the public catalogue,
-- which reached a user_profiles policy that queried user_profiles. Any
-- future change to these helpers should re-run this: if the catalogue
-- stops loading for anon, a policy has started consulting a protected
-- table again.

DO $$
DECLARE n bigint;
BEGIN
  n := pg_temp.count_as_anon(
        'SELECT count(*) FROM courses WHERE id = ''70000000-0000-0000-0000-000000000073''');
  ASSERT n = 1, format('anonymous must still read the published catalogue, saw %s', n);
END $$;

SELECT 'RLS cross-org cohort tests passed' AS result;

ROLLBACK;
