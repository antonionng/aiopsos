-- One encouragement email per stall point, so a daily cron cannot write twice.
-- start: paid, and no check passed.
-- continue: at least one check passed, and the course is not finished.
-- sign: every check passed, and the prompt card is not signed.

ALTER TABLE self_serve_purchases
  ADD COLUMN IF NOT EXISTS nudge_start_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS nudge_continue_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS nudge_sign_sent_at timestamptz;
