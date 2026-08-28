-- ============================================================
-- 036: Insight subscribers
--
-- The insights section publishes public briefings for the people who
-- commission training, and until now a reader could arrive, read, and
-- leave without ever becoming reachable. This is the list that fixes
-- that: an email, double opt-in, and an unsubscribe that works.
--
-- Double opt-in is not decoration. The audience is EU and UK L&D, HR
-- and risk buyers, so a single-step list built from a text box is not
-- a lawful basis for mailing anyone. A row only becomes mailable once
-- the person clicks the link in the confirmation email.
--
-- No RLS policies are granted to anon here, deliberately. Unlike
-- course_enquiries, every write to this table goes through a server
-- route holding the service-role key, which bypasses RLS. That route
-- has to read before it writes (to re-send a confirmation rather than
-- collide on the unique email), and a public insert policy would have
-- had to come with a public read policy beside it. An email list is
-- exactly the table you do not want anon able to enumerate.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS insight_subscribers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Stored lowercased and trimmed by the route, so the unique index is a
  -- real constraint rather than one that Bob@x.com slips past.
  email              text NOT NULL UNIQUE,
  -- 'pending' until the confirmation link is clicked. Only 'confirmed'
  -- rows are ever mailed a new article.
  status             text NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  -- Two separate secrets on purpose. The unsubscribe token ships in the
  -- footer of every broadcast; the confirm token must not be guessable
  -- from it, or a leaked footer link would let someone confirm an
  -- address that never opted in.
  confirm_token      text NOT NULL,
  unsubscribe_token  text NOT NULL,
  -- Which page the form was on, so we can see which surface converts.
  source             text NOT NULL DEFAULT 'insights_index'
                       CHECK (source IN ('insights_index', 'insights_article', 'courses', 'use_cases')),
  -- The article being read when they signed up, where there was one.
  source_slug        text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  confirmed_at       timestamptz,
  unsubscribed_at    timestamptz,
  -- Set by the broadcast so a resend does not double-mail the list.
  last_sent_slug     text,
  last_sent_at       timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_insight_subscribers_confirm_token
  ON insight_subscribers(confirm_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_insight_subscribers_unsub_token
  ON insight_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_insight_subscribers_status
  ON insight_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_insight_subscribers_created
  ON insight_subscribers(created_at DESC);

ALTER TABLE insight_subscribers ENABLE ROW LEVEL SECURITY;

-- Read is for us only. There is no anon policy of any kind on this table:
-- with RLS enabled and nothing granted, anon gets nothing, which is the
-- intended posture for a list of names and email addresses.
DROP POLICY IF EXISTS "Super admins read subscribers" ON insight_subscribers;
CREATE POLICY "Super admins read subscribers"
  ON insight_subscribers FOR SELECT
  USING (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins manage subscribers" ON insight_subscribers;
CREATE POLICY "Super admins manage subscribers"
  ON insight_subscribers FOR UPDATE
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');

-- ------------------------------------------------------------
-- Broadcast log
--
-- One row per article actually mailed, so the admin screen can say
-- "this went out on that date to that many people" and a second click
-- on the send button is refused rather than mailing the list twice.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS insight_broadcasts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug  text NOT NULL UNIQUE,
  sent_by       uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  recipients    int NOT NULL DEFAULT 0,
  failures      int NOT NULL DEFAULT 0,
  sent_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_insight_broadcasts_sent
  ON insight_broadcasts(sent_at DESC);

ALTER TABLE insight_broadcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins read broadcasts" ON insight_broadcasts;
CREATE POLICY "Super admins read broadcasts"
  ON insight_broadcasts FOR SELECT
  USING (public.academy_user_role() = 'super_admin');
