-- 029_mooov_payments.sql
--
-- Mooov.money ("Movere") becomes the payment orchestrator for every card
-- payment: cohort/course fees and AI-credit pack top-ups. It fronts
-- Stripe-hosted checkout, so the Stripe direct integration (broken for
-- subscriptions, working only for cohorts) is being retired in stages.
--
-- Two tables, both written exclusively by the service role:
--
--   mooov_payments        one row per payment intent we create. Mooov's
--                         payment-intent schema carries no metadata, so this
--                         row IS the routing record: the webhook looks up
--                         `payment_id` (a "pay_<uuid>" we generate) and acts
--                         on `purpose`. The `status` column doubles as an
--                         idempotency guard: transitions are single UPDATEs
--                         with `WHERE status = 'pending'`.
--
--   mooov_webhook_events  event-id dedupe. Mooov retries webhooks with
--                         backoff and may deliver twice; the PK insert with
--                         ON CONFLICT DO NOTHING is the first of two guards.
--
-- Also adds the billing-method columns to organisations: enterprise
-- customers with a contract pay by invoice rather than card. This is a NEW
-- column, deliberately not a widening of the subscription_status CHECK -
-- several code paths compare that enum and the set must stay closed.
--
-- Shared-database rules apply (see 021): additive only, IF NOT EXISTS
-- everywhere, prefixed names, no drops.

CREATE TABLE IF NOT EXISTS mooov_payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id   text NOT NULL UNIQUE,          -- "pay_<uuid>", sent to Mooov
  org_id       uuid NOT NULL REFERENCES organisations(id),
  initiated_by uuid REFERENCES user_profiles(id),
  purpose      text NOT NULL CHECK (purpose IN ('credit_pack', 'cohort')),
  pack_id      uuid,                          -- FK added in 030 with credit_packs
  cohort_id    uuid REFERENCES cohorts(id),
  amount       int  NOT NULL CHECK (amount > 0),  -- minor units, like cohorts.price_amount
  currency     text NOT NULL DEFAULT 'GBP',
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'captured', 'failed', 'refunded', 'voided')),
  hosted_url   text,
  captured_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mooov_payments_org ON mooov_payments(org_id);
CREATE INDEX IF NOT EXISTS idx_mooov_payments_cohort ON mooov_payments(cohort_id);

CREATE TABLE IF NOT EXISTS mooov_webhook_events (
  event_id     text PRIMARY KEY,
  delivery_id  text,
  event_type   text NOT NULL,
  payload      jsonb NOT NULL,
  received_at  timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error        text
);

-- ── organisations: billing method ────────────────────────────

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS billing_method text NOT NULL DEFAULT 'card',
  ADD COLUMN IF NOT EXISTS invoice_terms_days int NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS invoice_billing_email text,
  ADD COLUMN IF NOT EXISTS invoice_po_reference text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organisations_billing_method_check'
      AND conrelid = 'organisations'::regclass
  ) THEN
    ALTER TABLE organisations
      ADD CONSTRAINT organisations_billing_method_check
      CHECK (billing_method IN ('card', 'invoice'));
  END IF;
END $$;

-- ── RLS helper ───────────────────────────────────────────────
-- Org ownership is a column (organisations.owner_id), not a role, so the
-- billing surfaces need their own predicate. Same SECURITY DEFINER
-- rationale as the 021 helpers; same linter note applies: do NOT revoke
-- EXECUTE from authenticated.

CREATE OR REPLACE FUNCTION public.academy_is_org_owner(p_org uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisations o
    WHERE o.id = p_org AND o.owner_id = auth.uid()
  )
$$;

-- ── RLS ──────────────────────────────────────────────────────
-- Reads: an org's admins/managers, its owner, and super admins see the
-- org's payments. Writes: none - every insert and status transition goes
-- through the service role (checkout routes and the webhook), so the
-- absence of INSERT/UPDATE/DELETE policies is the write protection.

ALTER TABLE mooov_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org billing audience reads payments" ON mooov_payments;
CREATE POLICY "Org billing audience reads payments"
  ON mooov_payments FOR SELECT
  USING (
    public.academy_user_role() = 'super_admin'
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager'))
    OR public.academy_is_org_owner(org_id)
  );

-- Service-role bookkeeping only, like session_reminders: RLS on, no policies.
ALTER TABLE mooov_webhook_events ENABLE ROW LEVEL SECURITY;
