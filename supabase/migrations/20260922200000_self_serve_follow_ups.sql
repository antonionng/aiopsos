-- next: one suggestion of the next course, three days after the record is signed.
-- marketing_opt_out_at: the learner asked to stop course suggestions. Reminders
-- about a course they have already bought are not affected.

ALTER TABLE self_serve_purchases
  ADD COLUMN IF NOT EXISTS nudge_next_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS marketing_opt_out_at timestamptz;
