-- A team place is paid for on the team row, so the seat's own purchase records nothing.
ALTER TABLE self_serve_purchases DROP CONSTRAINT IF EXISTS self_serve_purchases_amount_check;
ALTER TABLE self_serve_purchases
  ADD CONSTRAINT self_serve_purchases_amount_check
  CHECK (amount > 0 OR (amount = 0 AND stripe_session_id LIKE 'team\_seat:%'));
