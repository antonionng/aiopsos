-- ============================================================
-- Row-level security tests for evidence packs.
--
-- A pack aggregates the whole organisation's training and usage
-- record, so the negatives that matter are: another organisation
-- cannot read it, a plain employee cannot read it, and an issued
-- pack cannot be edited after the fact.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_evidence_packs.sql
--
-- Runs inside a transaction that is rolled back. Safe on a branch
-- or a local stack; do not point it at production.
-- ============================================================

BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@ev.test',  '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'member-a@ev.test', '', now(), now(), now()),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@ev.test',  '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'Ev Org A'),
  ('bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'Ev Org B');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-a@ev.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'user',  'member-a@ev.test', 'Member A'),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, 'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-b@ev.test',  'Admin B')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role;

INSERT INTO evidence_packs (id, org_id, period_start, period_end, payload) VALUES
  ('55555555-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, '2026-04-01', '2026-06-30', '{"version":1}'),
  ('55555555-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001'::uuid, '2026-04-01', '2026-06-30', '{"version":1}');

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
        'SELECT count(*) FROM evidence_packs WHERE id = ''55555555-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should read their own pack, saw %s', n);

  -- NEGATIVE: packs do not cross organisations.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM evidence_packs WHERE id = ''55555555-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT read org B pack, saw %s', n);

  -- NEGATIVE: a plain employee has no business reading the org-wide record.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM evidence_packs WHERE id = ''55555555-0000-0000-0000-000000000001''');
  ASSERT n = 0, format('a plain member must NOT read the evidence pack, saw %s', n);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: a pack is a dated record. Migration 022 grants no UPDATE, so
  -- correcting one means generating a new pack, not editing the old one.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    UPDATE evidence_packs SET payload = '{"tampered":true}'
    WHERE id = '55555555-0000-0000-0000-000000000001';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0, format('an issued pack must NOT be editable, updated %s rows', affected);
END $$;

SELECT 'evidence pack RLS tests passed' AS result;

ROLLBACK;
