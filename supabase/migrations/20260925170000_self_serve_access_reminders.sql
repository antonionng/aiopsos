-- One reminder a month before access ends and one a week before, each sent once.
ALTER TABLE self_serve_purchases
  ADD COLUMN IF NOT EXISTS access_month_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS access_week_sent_at timestamptz;
