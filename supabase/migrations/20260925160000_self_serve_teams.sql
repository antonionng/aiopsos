-- Team places: one payment buys several places on a course. The buyer invites
-- people by email; accepting a place creates an ordinary self-serve purchase
-- for that person, so access, progress and records work exactly as for a
-- single buyer. Seat purchases use stripe_session_id "team_seat:<seat id>".

CREATE TABLE IF NOT EXISTS self_serve_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  seats integer NOT NULL CHECK (seats BETWEEN 2 AND 50),
  unit_amount integer NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  buyer_email text,
  buyer_name text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id text NOT NULL UNIQUE,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  manage_token text UNIQUE,
  paid_at timestamptz,
  receipt_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_self_serve_teams_buyer ON self_serve_teams (lower(buyer_email));
CREATE INDEX IF NOT EXISTS idx_self_serve_teams_user ON self_serve_teams (user_id);

CREATE TABLE IF NOT EXISTS self_serve_team_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES self_serve_teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  invite_token text NOT NULL UNIQUE,
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  purchase_id uuid REFERENCES self_serve_purchases(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_self_serve_team_seats_email
  ON self_serve_team_seats (team_id, lower(email));

ALTER TABLE self_serve_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_serve_team_seats ENABLE ROW LEVEL SECURITY;
