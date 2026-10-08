-- Self-serve course purchases.
--
-- Guest checkout: email and card only, no organisation and no /register.
-- Rows are written by the service role from Stripe checkout and the webhook.
-- RLS is on with no policies, same write protection as mooov_webhook_events.

CREATE TABLE IF NOT EXISTS self_serve_purchases (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug                text NOT NULL,
  email                      text,
  buyer_name                 text,
  amount                     int  NOT NULL CHECK (amount > 0),
  currency                   text NOT NULL DEFAULT 'GBP',
  stripe_session_id          text NOT NULL UNIQUE,
  stripe_payment_intent_id   text,
  stripe_customer_id         text,
  status                     text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  access_token               text UNIQUE,
  receipt_sent_at            timestamptz,
  paid_at                    timestamptz,
  created_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_self_serve_purchases_email
  ON self_serve_purchases (email);

CREATE INDEX IF NOT EXISTS idx_self_serve_purchases_slug
  ON self_serve_purchases (course_slug);

CREATE TABLE IF NOT EXISTS self_serve_progress (
  purchase_id      uuid PRIMARY KEY REFERENCES self_serve_purchases(id) ON DELETE CASCADE,
  lessons          jsonb NOT NULL DEFAULT '{}'::jsonb,
  signed_name      text,
  signed_at        timestamptz,
  certificate_ref  text UNIQUE,
  artefact         jsonb,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_self_serve_progress_ref
  ON self_serve_progress (certificate_ref);

ALTER TABLE self_serve_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_serve_progress ENABLE ROW LEVEL SECURITY;
