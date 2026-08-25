-- 031_invoicing.sql
--
-- Enterprise invoicing. Contract customers (organisations.billing_method =
-- 'invoice', set by a super admin in 029's columns) do not see card
-- checkout: buying a credit pack or paying for a cohort raises a branded
-- PDF invoice with NET terms instead, emailed to the billing contact.
-- Settlement is a bank transfer, acknowledged by a super admin marking
-- the invoice paid - which is the moment credits land in the wallet or
-- the cohort is stamped paid.
--
-- Immutability follows the evidence-pack doctrine: `payload` is frozen at
-- send time and the PDF renders from payload alone, so a regenerated
-- invoice is byte-identical to the one the customer received. Numbers are
-- assigned at send (drafts are unnumbered); the sequence guarantees
-- uniqueness, not gaplessness - a voided draft leaves no hole because it
-- never had a number, and a numbered void remains on file.
--
-- Shared-database rules apply (see 021): additive only, IF NOT EXISTS,
-- no drops.

CREATE SEQUENCE IF NOT EXISTS academy_invoice_number_seq;

CREATE TABLE IF NOT EXISTS billing_invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  text UNIQUE,                -- 'INV-2026-0042', NULL while draft
  org_id          uuid NOT NULL REFERENCES organisations(id),
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
  issue_date      date,
  due_date        date,
  terms_days      int NOT NULL DEFAULT 30,
  currency        text NOT NULL DEFAULT 'GBP',
  subtotal_amount int NOT NULL DEFAULT 0,     -- minor units
  total_amount    int NOT NULL DEFAULT 0,
  payload         jsonb,                      -- frozen at send; the PDF reads ONLY this
  sent_at         timestamptz,
  paid_at         timestamptz,
  marked_paid_by  uuid,
  last_reminder_at timestamptz,
  created_by      uuid,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_org ON billing_invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status ON billing_invoices(status);

CREATE TABLE IF NOT EXISTS billing_invoice_lines (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   uuid NOT NULL REFERENCES billing_invoices(id) ON DELETE CASCADE,
  description  text NOT NULL,
  quantity     int NOT NULL DEFAULT 1,
  unit_amount  int NOT NULL,                  -- minor units
  total_amount int NOT NULL,
  pack_id      uuid REFERENCES credit_packs(id),
  cohort_id    uuid REFERENCES cohorts(id),
  credits      int,                           -- credited to the wallet when paid
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_invoice_lines_invoice
  ON billing_invoice_lines(invoice_id);

-- Now that billing_invoices exists, complete the FK left pending in 030.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'credit_ledger_invoice_id_fkey'
      AND conrelid = 'credit_ledger'::regclass
  ) THEN
    ALTER TABLE credit_ledger
      ADD CONSTRAINT credit_ledger_invoice_id_fkey
      FOREIGN KEY (invoice_id) REFERENCES billing_invoices(id);
  END IF;
END $$;

-- Sequence access for the server: supabase-js has no SELECT nextval(), so
-- number assignment goes through this function. Service-role only - a
-- client has no business consuming invoice numbers.
CREATE OR REPLACE FUNCTION public.academy_next_invoice_number()
RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT nextval('academy_invoice_number_seq')
$$;

REVOKE EXECUTE ON FUNCTION public.academy_next_invoice_number()
  FROM PUBLIC, anon, authenticated;

-- ── RLS helper ───────────────────────────────────────────────
-- Same SECURITY DEFINER rationale as 021: a policy that selects from
-- another RLS-protected table gets that table's policies applied inside
-- it, so the rule lives here once and both policies below stay a single
-- readable predicate. Same linter note: do NOT revoke EXECUTE.

CREATE OR REPLACE FUNCTION public.academy_can_read_invoice(p_invoice uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM billing_invoices i
    WHERE i.id = p_invoice
      AND (
        public.academy_user_role() = 'super_admin'
        OR (
          -- A draft is an internal working document until it is sent.
          i.status <> 'draft'
          AND (
            (i.org_id = public.academy_org_id()
             AND public.academy_user_role() IN ('admin', 'manager'))
            OR public.academy_is_org_owner(i.org_id)
          )
        )
      )
  )
$$;

-- ── RLS ──────────────────────────────────────────────────────
-- Customers see their own issued invoices, never drafts. All writes go
-- through the super-admin API on the service role: no write policies.

ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoice_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org billing audience reads issued invoices" ON billing_invoices;
CREATE POLICY "Org billing audience reads issued invoices"
  ON billing_invoices FOR SELECT
  USING (public.academy_can_read_invoice(id));

DROP POLICY IF EXISTS "Line visibility follows the invoice" ON billing_invoice_lines;
CREATE POLICY "Line visibility follows the invoice"
  ON billing_invoice_lines FOR SELECT
  USING (public.academy_can_read_invoice(invoice_id));
