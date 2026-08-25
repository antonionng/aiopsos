-- ============================================================
-- Row-level security tests for mooov_payments.
--
-- A payment row names the amount an organisation paid, so the
-- negatives that matter are: another organisation cannot read it,
-- a plain employee cannot read it, and nobody but the service
-- role can create or rewrite one (no write policies exist).
-- The org owner reads via academy_is_org_owner() even when their
-- profile role is only 'user'.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_mooov_payments.sql
--
-- Runs inside a transaction that is rolled back. Safe on a branch
-- or a local stack; do not point it at production.
-- ============================================================

BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@mp.test',  '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'member-a@mp.test', '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000a3'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'owner-a@mp.test',  '', now(), now(), now()),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@mp.test',  '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name, owner_id) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'Pay Org A', 'aaaaaaaa-0000-0000-0000-0000000000a3'::uuid),
  ('bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'Pay Org B', NULL);

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000a1'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-a@mp.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000a2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'user',  'member-a@mp.test', 'Member A'),
  ('aaaaaaaa-0000-0000-0000-0000000000a3'::uuid, 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'user',  'owner-a@mp.test',  'Owner A'),
  ('bbbbbbbb-0000-0000-0000-0000000000b1'::uuid, 'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'admin', 'admin-b@mp.test',  'Admin B')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role;

INSERT INTO mooov_payments (id, payment_id, org_id, purpose, amount, currency, status) VALUES
  ('66666666-0000-0000-0000-000000000001', 'pay_test-a', 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'credit_pack', 1000, 'GBP', 'captured'),
  ('66666666-0000-0000-0000-000000000002', 'pay_test-b', 'bbbbbbbb-0000-0000-0000-000000000001'::uuid, 'credit_pack', 4500, 'GBP', 'captured');

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
        'SELECT count(*) FROM mooov_payments WHERE id = ''66666666-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should read their org payment, saw %s', n);

  -- The owner reads billing even though their profile role is only 'user'.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a3',
        'SELECT count(*) FROM mooov_payments WHERE id = ''66666666-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('the org owner should read the org payment, saw %s', n);

  -- NEGATIVE: payments do not cross organisations.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM mooov_payments WHERE id = ''66666666-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT read org B payment, saw %s', n);

  -- NEGATIVE: a plain employee has no business in billing.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a2',
        'SELECT count(*) FROM mooov_payments WHERE id = ''66666666-0000-0000-0000-000000000001''');
  ASSERT n = 0, format('a plain member must NOT read payments, saw %s', n);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: only the service role writes payments; there is no UPDATE
  -- policy, so even the org admin cannot flip a status.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    UPDATE mooov_payments SET status = 'refunded'
    WHERE id = '66666666-0000-0000-0000-000000000001';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0, format('a payment must NOT be editable by clients, updated %s rows', affected);
END $$;

DO $$
DECLARE inserted integer := 0;
BEGIN
  -- NEGATIVE: no INSERT policy either - checkout goes through the server.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000a1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    INSERT INTO mooov_payments (payment_id, org_id, purpose, amount)
    VALUES ('pay_forged', 'aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'credit_pack', 1);
    GET DIAGNOSTICS inserted = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    inserted := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT inserted = 0, format('clients must NOT insert payments, inserted %s rows', inserted);
END $$;

DO $$
DECLARE n bigint;
BEGIN
  -- NEGATIVE: webhook bookkeeping is invisible to every client role.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000a1',
        'SELECT count(*) FROM mooov_webhook_events');
  ASSERT n = 0, format('webhook events must NOT be client-readable, saw %s', n);
END $$;

SELECT 'mooov payments RLS tests passed' AS result;

ROLLBACK;
