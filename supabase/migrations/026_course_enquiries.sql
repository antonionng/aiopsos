-- ============================================================
-- 026: Course enquiries
--
-- The assessment tells someone which courses they need and the
-- catalogue describes them, but until now there was no way to say
-- "yes, book that". The recommendation was a dead end.
--
-- An enquiry is a lead for the academy, not tenant data: most
-- arrive from anonymous visitors who have no organisation yet.
-- So anyone may create one, and only super_admin reads them all -
-- with org admins able to see enquiries raised by their own people.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS course_enquiries (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Null for a general enquiry that is not about one course.
  course_id         uuid REFERENCES courses(id) ON DELETE SET NULL,
  -- Null when the enquirer has no account yet, which is the common case.
  org_id            uuid REFERENCES organisations(id) ON DELETE SET NULL,
  created_by        uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  name              text NOT NULL,
  email             text NOT NULL,
  organisation_name text NOT NULL DEFAULT '',
  message           text NOT NULL DEFAULT '',
  -- Rough headcount, so a first reply can be about dates and price
  -- rather than another round of questions.
  seats             int,
  -- Where the enquiry came from, so we can see which surface converts.
  source            text NOT NULL DEFAULT 'course_page'
                      CHECK (source IN ('course_page', 'assessment_results', 'catalogue', 'dashboard')),
  status            text NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'contacted', 'scheduled', 'closed')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_enquiries_course ON course_enquiries(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enquiries_org ON course_enquiries(org_id);
CREATE INDEX IF NOT EXISTS idx_course_enquiries_status ON course_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_course_enquiries_created ON course_enquiries(created_at DESC);

ALTER TABLE course_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone may raise an enquiry, including anonymous visitors. This is the
-- only write anon has anywhere in the schema, and it is intentional: a
-- contact form that requires an account is not a contact form.
DROP POLICY IF EXISTS "Anyone may raise an enquiry" ON course_enquiries;
CREATE POLICY "Anyone may raise an enquiry"
  ON course_enquiries FOR INSERT
  WITH CHECK (true);

-- Deliberately no SELECT for anon. An enquiry contains a name, an email and
-- an organisation, and a public insert policy must never come with a public
-- read policy beside it.
DROP POLICY IF EXISTS "Super admins read enquiries" ON course_enquiries;
CREATE POLICY "Super admins read enquiries"
  ON course_enquiries FOR SELECT
  USING (public.academy_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Org admins read their own enquiries" ON course_enquiries;
CREATE POLICY "Org admins read their own enquiries"
  ON course_enquiries FOR SELECT
  USING (
    org_id IS NOT NULL
    AND org_id = public.academy_org_id()
    AND public.academy_user_role() IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "Super admins manage enquiries" ON course_enquiries;
CREATE POLICY "Super admins manage enquiries"
  ON course_enquiries FOR UPDATE
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');
