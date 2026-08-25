-- 030_credit_wallet.sql
--
-- AI credits, sold at a margin. Each organisation has one wallet; org
-- admins and the owner top it up by buying credit packs (card via Mooov,
-- or invoice for contract customers - migration 031). Members spend from
-- the shared balance as they use AI features.
--
-- The unit: 1 credit = £0.01 of retail AI usage, where retail = provider
-- cost (USD) x usd_to_gbp x ai_credit_markup. The markup is where the
-- margin lives; pack prices then discount the face value for volume while
-- staying well above provider cost. All knobs are data, not code:
-- `academy_settings` rows and `credit_packs` rows, editable from the
-- super-admin portal.
--
-- Integrity model:
--   * `credit_ledger` is append-only and is the source of truth; the
--     wallet row is the running total. Both move together only inside
--     academy_apply_credit_delta(), a single-transaction SECURITY DEFINER
--     function with no client EXECUTE - the service role is the only
--     caller. No read-modify-write in application code, so no lost
--     updates under concurrency.
--   * Clients get SELECT only (and only their org's rows); the absence of
--     write policies is what makes the ledger append-only from outside.
--
-- Shared-database rules apply (see 021): additive only, IF NOT EXISTS,
-- prefixed function names, no drops.

CREATE TABLE IF NOT EXISTS credit_wallets (
  org_id     uuid PRIMARY KEY REFERENCES organisations(id),
  balance    int NOT NULL DEFAULT 0,   -- credits; may go negative on refund clawback
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               uuid NOT NULL REFERENCES organisations(id),
  credits_delta        int NOT NULL,   -- positive = credit, negative = debit
  balance_after        int NOT NULL,
  reason               text NOT NULL
                       CHECK (reason IN ('purchase', 'invoice_paid', 'usage', 'adjustment', 'refund')),
  usage_log_id         uuid,
  feature_usage_log_id uuid,
  payment_id           uuid REFERENCES mooov_payments(id),
  invoice_id           uuid,           -- FK added in 031 with billing_invoices
  model                text,
  description          text,
  created_by           uuid,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_org_created
  ON credit_ledger(org_id, created_at DESC);

CREATE TABLE IF NOT EXISTS credit_packs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL UNIQUE,
  credits      int NOT NULL CHECK (credits > 0),
  price_amount int NOT NULL CHECK (price_amount > 0),  -- minor units
  currency     text NOT NULL DEFAULT 'GBP',
  active       boolean NOT NULL DEFAULT true,
  sort         int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academy_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- ── the one write path ───────────────────────────────────────
-- Upsert-increment plus ledger insert in one transaction. RETURNING the
-- post-update balance means `balance_after` is exact even when two debits
-- race. EXECUTE is revoked from client roles below - unlike the 021 read
-- helpers, this one mutates, and only the service role may call it.

CREATE OR REPLACE FUNCTION public.academy_apply_credit_delta(
  p_org uuid,
  p_delta int,
  p_reason text,
  p_usage_log uuid DEFAULT NULL,
  p_feature_log uuid DEFAULT NULL,
  p_payment uuid DEFAULT NULL,
  p_invoice uuid DEFAULT NULL,
  p_model text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
) RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  new_balance int;
BEGIN
  INSERT INTO credit_wallets (org_id, balance, updated_at)
  VALUES (p_org, p_delta, now())
  ON CONFLICT (org_id)
  DO UPDATE SET balance = credit_wallets.balance + p_delta, updated_at = now()
  RETURNING balance INTO new_balance;

  INSERT INTO credit_ledger (
    org_id, credits_delta, balance_after, reason,
    usage_log_id, feature_usage_log_id, payment_id, invoice_id,
    model, description, created_by
  ) VALUES (
    p_org, p_delta, new_balance, p_reason,
    p_usage_log, p_feature_log, p_payment, p_invoice,
    p_model, p_description, p_created_by
  );

  RETURN new_balance;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.academy_apply_credit_delta(uuid, int, text, uuid, uuid, uuid, uuid, text, text, uuid)
  FROM PUBLIC, anon, authenticated;

-- ── seeds ────────────────────────────────────────────────────
-- Markup 2.5 on converted provider cost = 60% gross margin at face value.
-- Pack unit prices: 1.00p / 0.90p / 0.80p / 0.70p per credit - the deepest
-- discount still clears ~43% gross margin.

INSERT INTO academy_settings (key, value) VALUES
  ('ai_credit_markup', '2.5'),
  ('usd_to_gbp', '0.80'),
  ('low_balance_threshold_credits', '200'),
  ('invoice_bank_details', '{"account_name": "Experrt Ltd", "sort_code": "", "account_number": "", "reference_hint": "Use the invoice number as the payment reference"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO credit_packs (name, credits, price_amount, currency, sort) VALUES
  ('Starter',    1000,   1000, 'GBP', 1),
  ('Team',       5000,   4500, 'GBP', 2),
  ('Scale',      12000,  9600, 'GBP', 3),
  ('Enterprise', 50000, 35000, 'GBP', 4)
ON CONFLICT (name) DO NOTHING;

-- Now that credit_packs exists, complete the FK left pending in 029.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mooov_payments_pack_id_fkey'
      AND conrelid = 'mooov_payments'::regclass
  ) THEN
    ALTER TABLE mooov_payments
      ADD CONSTRAINT mooov_payments_pack_id_fkey
      FOREIGN KEY (pack_id) REFERENCES credit_packs(id);
  END IF;
END $$;

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_settings ENABLE ROW LEVEL SECURITY;

-- The balance is org-public: every member sees it (the chat UI shows
-- "your org is out of credits"), but the ledger - who spent what on which
-- model - is billing detail for admins, managers, the owner.
DROP POLICY IF EXISTS "Org members read their wallet" ON credit_wallets;
CREATE POLICY "Org members read their wallet"
  ON credit_wallets FOR SELECT
  USING (
    public.academy_user_role() = 'super_admin'
    OR org_id = public.academy_org_id()
  );

DROP POLICY IF EXISTS "Org billing audience reads ledger" ON credit_ledger;
CREATE POLICY "Org billing audience reads ledger"
  ON credit_ledger FOR SELECT
  USING (
    public.academy_user_role() = 'super_admin'
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager'))
    OR public.academy_is_org_owner(org_id)
  );

-- Packs are a price list: active ones visible to any signed-in user;
-- super admins manage the catalogue (split per command - FOR ALL would
-- let the USING row filter stand in for WITH CHECK on inserts).
DROP POLICY IF EXISTS "Signed-in users read active packs" ON credit_packs;
CREATE POLICY "Signed-in users read active packs"
  ON credit_packs FOR SELECT
  USING (auth.uid() IS NOT NULL AND (active OR public.academy_user_role() = 'super_admin'));

DROP POLICY IF EXISTS "Super admins create packs" ON credit_packs;
CREATE POLICY "Super admins create packs"
  ON credit_packs FOR INSERT
  WITH CHECK (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins update packs" ON credit_packs;
CREATE POLICY "Super admins update packs"
  ON credit_packs FOR UPDATE
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');

-- Settings hold pricing knobs and bank details; super_admin reads via
-- the client, the server reads with the service role. Writes go through
-- the super-admin API (service role), so no write policies.
DROP POLICY IF EXISTS "Super admins read settings" ON academy_settings;
CREATE POLICY "Super admins read settings"
  ON academy_settings FOR SELECT
  USING (public.academy_user_role() = 'super_admin');
