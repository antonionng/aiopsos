-- Reviews from learners who finished a course and signed the record.
-- One review per purchase. Only the service role reads or writes the table;
-- the course page shows published rows through the server.

CREATE TABLE IF NOT EXISTS self_serve_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL UNIQUE REFERENCES self_serve_purchases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  role text CHECK (role IS NULL OR char_length(role) <= 80),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL CHECK (char_length(body) BETWEEN 20 AND 1200),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_self_serve_reviews_course
  ON self_serve_reviews (course_slug, status, created_at DESC);

ALTER TABLE self_serve_reviews ENABLE ROW LEVEL SECURITY;
