-- ============================================================
-- Row-level security tests for the credit system.
--
-- The negatives that matter: the ledger does not cross orgs and
-- is invisible to plain members; nobody outside the service role
-- can move a balance (no write policies, and the apply function
-- has no client EXECUTE); the pack price list is readable but
-- not editable; settings are super-admin-only.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_credits.sql
--
-- Runs inside a transaction that is rolled back. Safe on a branch
-- or a local stack; do not point it at production.
-- ============================================================

BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000c1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@cr.test',  '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000c2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'member-a@cr.test', '', now(), now(), now()),
  ('bbbbbbbb-0000-0000-0000-0000000000c3'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@cr.test',  '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000011'::uuid, 'Credit Org A'),
  ('bbbbbbbb-0000-0000-0000-000000000011'::uuid, 'Credit Org B');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000c1'::uuid, 'aaaaaaaa-0000-0000-0000-000000000011'::uuid, 'admin', 'admin-a@cr.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000c2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000011'::uuid, 'user',  'member-a@cr.test', 'Member A'),
  ('bbbbbbbb-0000-0000-0000-0000000000c3'::uuid, 'bbbbbbbb-0000-0000-0000-000000000011'::uuid, 'admin', 'admin-b@cr.test',  'Admin B')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role;

INSERT INTO credit_wallets (org_id, balance) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000011'::uuid, 1000),
  ('bbbbbbbb-0000-0000-0000-000000000011'::uuid, 5000);

INSERT INTO credit_ledger (org_id, credits_delta, balance_after, reason, description) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000011'::uuid, 1000, 1000, 'purchase', 'Starter pack'),
  ('bbbbbbbb-0000-0000-0000-000000000011'::uuid, 5000, 5000, 'purchase', 'Team pack');

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
  -- The balance is org-public: the chat UI needs it for every member.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c2',
        'SELECT count(*) FROM credit_wallets WHERE org_id = ''aaaaaaaa-0000-0000-0000-000000000011''');
  ASSERT n = 1, format('a member should read their org wallet, saw %s', n);

  -- NEGATIVE: not another org's wallet, though.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c2',
        'SELECT count(*) FROM credit_wallets WHERE org_id = ''bbbbbbbb-0000-0000-0000-000000000011''');
  ASSERT n = 0, format('a member must NOT read another org wallet, saw %s', n);

  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM credit_ledger WHERE org_id = ''aaaaaaaa-0000-0000-0000-000000000011''');
  ASSERT n = 1, format('admin A should read their org ledger, saw %s', n);

  -- NEGATIVE: the ledger is billing detail; members do not see who spent what.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c2',
        'SELECT count(*) FROM credit_ledger WHERE org_id = ''aaaaaaaa-0000-0000-0000-000000000011''');
  ASSERT n = 0, format('a plain member must NOT read the ledger, saw %s', n);

  -- NEGATIVE: the ledger does not cross organisations.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM credit_ledger WHERE org_id = ''bbbbbbbb-0000-0000-0000-000000000011''');
  ASSERT n = 0, format('admin A must NOT read org B ledger, saw %s', n);

  -- The price list is public to signed-in users.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c2',
        'SELECT count(*) FROM credit_packs WHERE active');
  ASSERT n >= 4, format('members should see the pack price list, saw %s', n);

  -- NEGATIVE: settings (markup, bank details) are not for org admins.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000c1',
        'SELECT count(*) FROM academy_settings');
  ASSERT n = 0, format('org admins must NOT read platform settings, saw %s', n);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: no client writes a balance. Not even their own org's admin.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000c1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    UPDATE credit_wallets SET balance = 999999
    WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000011';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0, format('clients must NOT write wallet balances, updated %s rows', affected);
END $$;

DO $$
DECLARE inserted integer := 0;
BEGIN
  -- NEGATIVE: the ledger is append-only and server-side only.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000c1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    INSERT INTO credit_ledger (org_id, credits_delta, balance_after, reason)
    VALUES ('aaaaaaaa-0000-0000-0000-000000000011'::uuid, 100000, 101000, 'adjustment');
    GET DIAGNOSTICS inserted = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    inserted := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT inserted = 0, format('clients must NOT insert ledger rows, inserted %s rows', inserted);
END $$;

DO $$
DECLARE denied boolean := false;
BEGIN
  -- NEGATIVE: the balance-moving function has no client EXECUTE.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000c1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    PERFORM public.academy_apply_credit_delta(
      'aaaaaaaa-0000-0000-0000-000000000011'::uuid, 100000, 'adjustment');
  EXCEPTION WHEN insufficient_privilege THEN
    denied := true;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT denied, 'clients must NOT be able to call academy_apply_credit_delta';
END $$;

SELECT 'credit system RLS tests passed' AS result;

ROLLBACK;
