-- ============================================================
-- Row-level security tests for enterprise invoicing.
--
-- The negatives that matter: drafts are invisible to the customer
-- until sent, invoices do not cross organisations, plain members
-- see nothing, and nobody outside the service role can rewrite an
-- invoice (no write policies). Line visibility follows the parent
-- invoice through academy_can_read_invoice().
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_invoices.sql
--
-- Runs inside a transaction that is rolled back. Safe on a branch
-- or a local stack; do not point it at production.
-- ============================================================

BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000d1'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-a@inv.test',  '', now(), now(), now()),
  ('aaaaaaaa-0000-0000-0000-0000000000d2'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'member-a@inv.test', '', now(), now(), now()),
  ('bbbbbbbb-0000-0000-0000-0000000000d3'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'admin-b@inv.test',  '', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organisations (id, name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000021'::uuid, 'Invoice Org A'),
  ('bbbbbbbb-0000-0000-0000-000000000021'::uuid, 'Invoice Org B');

INSERT INTO user_profiles (id, org_id, role, email, name) VALUES
  ('aaaaaaaa-0000-0000-0000-0000000000d1'::uuid, 'aaaaaaaa-0000-0000-0000-000000000021'::uuid, 'admin', 'admin-a@inv.test',  'Admin A'),
  ('aaaaaaaa-0000-0000-0000-0000000000d2'::uuid, 'aaaaaaaa-0000-0000-0000-000000000021'::uuid, 'user',  'member-a@inv.test', 'Member A'),
  ('bbbbbbbb-0000-0000-0000-0000000000d3'::uuid, 'bbbbbbbb-0000-0000-0000-000000000021'::uuid, 'admin', 'admin-b@inv.test',  'Admin B')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role;

INSERT INTO billing_invoices (id, invoice_number, org_id, status, total_amount, subtotal_amount) VALUES
  ('77777777-0000-0000-0000-000000000001', 'INV-2026-9001', 'aaaaaaaa-0000-0000-0000-000000000021'::uuid, 'sent',  4500, 4500),
  ('77777777-0000-0000-0000-000000000002', NULL,            'aaaaaaaa-0000-0000-0000-000000000021'::uuid, 'draft', 9600, 9600),
  ('77777777-0000-0000-0000-000000000003', 'INV-2026-9002', 'bbbbbbbb-0000-0000-0000-000000000021'::uuid, 'sent',  1000, 1000);

INSERT INTO billing_invoice_lines (invoice_id, description, quantity, unit_amount, total_amount, credits) VALUES
  ('77777777-0000-0000-0000-000000000001', 'AI credits — Team pack', 1, 4500, 4500, 5000),
  ('77777777-0000-0000-0000-000000000002', 'AI credits — Scale pack', 1, 9600, 9600, 12000),
  ('77777777-0000-0000-0000-000000000003', 'AI credits — Starter pack', 1, 1000, 1000, 1000);

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
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d1',
        'SELECT count(*) FROM billing_invoices WHERE id = ''77777777-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should read their sent invoice, saw %s', n);

  -- NEGATIVE: a draft is internal until it is sent.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d1',
        'SELECT count(*) FROM billing_invoices WHERE id = ''77777777-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT read a draft invoice, saw %s', n);

  -- NEGATIVE: invoices do not cross organisations.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d1',
        'SELECT count(*) FROM billing_invoices WHERE id = ''77777777-0000-0000-0000-000000000003''');
  ASSERT n = 0, format('admin A must NOT read org B invoice, saw %s', n);

  -- NEGATIVE: a plain employee sees no invoices at all.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d2',
        'SELECT count(*) FROM billing_invoices');
  ASSERT n = 0, format('a plain member must NOT read invoices, saw %s', n);

  -- Line visibility follows the invoice.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d1',
        'SELECT count(*) FROM billing_invoice_lines WHERE invoice_id = ''77777777-0000-0000-0000-000000000001''');
  ASSERT n = 1, format('admin A should read their sent invoice lines, saw %s', n);

  -- NEGATIVE: draft lines are as invisible as the draft.
  n := pg_temp.count_as('aaaaaaaa-0000-0000-0000-0000000000d1',
        'SELECT count(*) FROM billing_invoice_lines WHERE invoice_id = ''77777777-0000-0000-0000-000000000002''');
  ASSERT n = 0, format('admin A must NOT read draft invoice lines, saw %s', n);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: an issued invoice is a record; nobody rewrites it from a client.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000d1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    UPDATE billing_invoices SET status = 'paid'
    WHERE id = '77777777-0000-0000-0000-000000000001';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0, format('clients must NOT update invoices, updated %s rows', affected);
END $$;

DO $$
DECLARE denied boolean := false;
BEGIN
  -- NEGATIVE: invoice numbers are not client-consumable.
  PERFORM set_config('request.jwt.claims', '{"sub":"aaaaaaaa-0000-0000-0000-0000000000d1"}', true);
  PERFORM set_config('role', 'authenticated', true);
  BEGIN
    PERFORM public.academy_next_invoice_number();
  EXCEPTION WHEN insufficient_privilege THEN
    denied := true;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT denied, 'clients must NOT be able to call academy_next_invoice_number';
END $$;

SELECT 'invoicing RLS tests passed' AS result;

ROLLBACK;
