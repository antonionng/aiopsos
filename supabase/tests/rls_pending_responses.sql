-- ============================================================
-- Row-level security tests for pending_responses.
--
-- Before migration 027 the only SELECT policy was
-- `claimed_by = auth.uid()`, so an unclaimed response - someone
-- who took the assessment and never finished signing up - was
-- invisible to everyone including the admin who owned the link.
-- That is what made "N responses" always read zero.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_pending_responses.sql
--
-- Runs inside a transaction that is rolled back.
-- ============================================================

BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@pr.test',  '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'member-a@pr.test', '', now(), now(), now()),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@pr.test',  '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'PR Org A'),
  ('bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'PR Org B');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-a@pr.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'user',  'member-a@pr.test', 'Member A'),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, 'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-b@pr.test',  'Admin B')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role;

INSERT INTO assessment_links (id, org_id, created_by, token, title)
VALUES ('cccccccc-0000-0000-0000-000000000001'::uuid,
        'aaaaaaaa-0000-0000-0000-000000000001'::uuid,
        'aaaaaaaa-0000-0000-0000-0000000000a1'::uuid,
        'pr-test-token', 'PR Test');

INSERT INTO pending_responses (id, link_id, session_token, raw_answers,
       confidence_score, practice_score, tools_score, responsible_score, culture_score)
VALUES ('dddddddd-0000-0000-0000-000000000001'::uuid,
        'cccccccc-0000-0000-0000-000000000001'::uuid,
        'pr-session-unclaimed', '{}', 2, 2, 2, 2, 2);

CREATE OR REPLACE FUNCTION pg_temp.count_as(p_user uuid, p_sql text)
RETURNS bigint LANGUAGE plpgsql AS $fn$
DECLARE result bigint;
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', p_user::text)::text, true);
  PERFORM set_config('role', 'authenticated', true);
  EXECUTE p_sql INTO result;
  PERFORM set_config('role', 'none', true);
  RETURN result;
END;
$fn$;

DO $$
DECLARE n bigint;
BEGIN
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM pending_responses WHERE link_id = ''cccccccc-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('org A admin should see the pending response, saw %s', n);

  -- NEGATIVE: pending responses do not cross organisations.
  n := pg_temp.count_as('bbbbbbbb-0000-0000-0000-0000000000b1',
        'SELECT count(*) FROM pending_responses WHERE link_id = ''cccccccc-0000-0000-0000-000000000001''');
  ASSERT n = 0, format('org B admin must NOT see org A responses, saw %s', n);

  -- NEGATIVE: this is staff data; a plain member sees only their own claimed row.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM pending_responses WHERE link_id = ''cccccccc-0000-0000-0000-000000000001''');
  ASSERT n = 0, format('a plain member must NOT see pending responses, saw %s', n);
END $$;

DO $$
DECLARE n bigint;
BEGIN
  -- NEGATIVE: anon may insert (the public assessment) but never read back.
  PERFORM set_config('request.jwt.claims', '', true);
  PERFORM set_config('role', 'anon', true);
  SELECT count(*) INTO n FROM pending_responses;
  PERFORM set_config('role', 'none', true);
  ASSERT n = 0, format('anon must NOT read pending responses, saw %s', n);
END $$;

SELECT 'pending_responses RLS tests passed' AS result;

ROLLBACK;
