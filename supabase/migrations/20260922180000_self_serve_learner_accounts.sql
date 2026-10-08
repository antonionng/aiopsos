-- A self-serve purchase belongs to an Experrt account once the buyer saves a
-- sign-in. The cookie still opens the course in the browser that paid; the
-- account is how the learner comes back on any device.

ALTER TABLE self_serve_purchases
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS account_linked_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_self_serve_purchases_user
  ON self_serve_purchases (user_id);

CREATE INDEX IF NOT EXISTS idx_self_serve_purchases_email_lower
  ON self_serve_purchases (lower(email));
