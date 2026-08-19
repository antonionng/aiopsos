-- ============================================================
-- 021: Cohort delivery - facilitators, cohorts, sessions,
--      enrolments, attendance, submissions, grades, certificates
--
-- This is the record a funded buyer is audited against. Every
-- government levy and reimbursement scheme asks for attendance
-- records, an assessment mechanism and completion documentation,
-- so these tables are the product, not a side effect of it.
--
-- Commercial decisions encoded here (settled 19 Aug 2026):
--   * A participant always belongs to an organisation, so
--     enrolments.org_id is NOT NULL. cohorts.org_id stays
--     nullable per the brief, for the partner-run cross-org
--     cohorts that migration 023 introduces; until then the API
--     always sets it.
--   * Pricing is per cohort, not per seat, hence the price and
--     Stripe columns on cohorts rather than on enrolments.
--   * A certificate needs BOTH an attendance floor and a pass
--     grade. The thresholds live on the cohort so a funded
--     programme can set its own.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────

-- Facilitation is an attribute, not a tenancy role: a facilitator
-- is a row here, never a value in user_profiles.role. That is what
-- lets one facilitator run cohorts for several organisations
-- without being a member of any of them.
CREATE TABLE IF NOT EXISTS facilitators (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio          text NOT NULL DEFAULT '',
  credentials  jsonb NOT NULL DEFAULT '[]',
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS cohorts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id           uuid NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  org_id              uuid REFERENCES organisations(id) ON DELETE CASCADE,
  facilitator_id      uuid REFERENCES facilitators(id),
  title               text NOT NULL,
  delivery_mode       text NOT NULL CHECK (delivery_mode IN ('in_person', 'virtual', 'blended')),
  location            text,
  timezone            text NOT NULL DEFAULT 'Europe/London',
  seat_limit          int NOT NULL DEFAULT 12,
  starts_on           date,
  ends_on             date,
  status              text NOT NULL DEFAULT 'scheduled'
                        CHECK (status IN ('scheduled', 'running', 'completed', 'cancelled')),
  -- Per-cohort pricing. Minor units (pence/cents) to avoid float money.
  price_amount        int,
  currency            text NOT NULL DEFAULT 'GBP',
  stripe_session_id   text,
  paid_at             timestamptz,
  -- Certificate thresholds. Both must be met; see certificates below.
  pass_attendance_pct numeric(5,2) NOT NULL DEFAULT 80 CHECK (pass_attendance_pct BETWEEN 0 AND 100),
  pass_grade_pct      numeric(5,2) NOT NULL DEFAULT 70 CHECK (pass_grade_pct BETWEEN 0 AND 100),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Timestamps are stored UTC and rendered in cohorts.timezone. Never
-- store wall-clock local time here: cohorts run across the UK, GCC
-- and Southeast Asia simultaneously and cross DST boundaries.
CREATE TABLE IF NOT EXISTS sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id  uuid NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  module_id  uuid REFERENCES course_modules(id) ON DELETE SET NULL,
  position   int NOT NULL,
  title      text NOT NULL,
  starts_at  timestamptz NOT NULL,
  ends_at    timestamptz NOT NULL,
  join_url   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, position),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS enrolments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id     uuid NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id        uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  status        text NOT NULL DEFAULT 'enrolled'
                  CHECK (status IN ('invited', 'enrolled', 'withdrawn', 'completed', 'failed')),
  enrolled_at   timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz,
  UNIQUE (cohort_id, user_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  enrolment_id     uuid NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
  status           text NOT NULL DEFAULT 'absent'
                     CHECK (status IN ('present', 'late', 'absent', 'excused')),
  minutes_attended int NOT NULL DEFAULT 0,
  recorded_by      uuid REFERENCES user_profiles(id),
  recorded_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, enrolment_id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  enrolment_id uuid NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
  artefact_url text,
  notes        text NOT NULL DEFAULT '',
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grades (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrolment_id  uuid NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
  module_id     uuid REFERENCES course_modules(id) ON DELETE SET NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE SET NULL,
  score         numeric(5,2) NOT NULL DEFAULT 0,
  max_score     numeric(5,2) NOT NULL DEFAULT 100 CHECK (max_score > 0),
  rubric        jsonb NOT NULL DEFAULT '{}',
  feedback      text NOT NULL DEFAULT '',
  graded_by     uuid REFERENCES user_profiles(id),
  graded_at     timestamptz NOT NULL DEFAULT now()
);

-- `snapshot` freezes the course title, module list, outcomes, facilitator
-- credentials and the attendance/grade figures as they stood at issue.
-- Later catalogue edits must never rewrite what a certificate says: an
-- auditor is entitled to see what was actually delivered.
CREATE TABLE IF NOT EXISTS certificates (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrolment_id uuid NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
  public_ref   text NOT NULL UNIQUE,
  issued_at    timestamptz NOT NULL DEFAULT now(),
  revoked_at   timestamptz,
  snapshot     jsonb NOT NULL DEFAULT '{}',
  UNIQUE (enrolment_id)
);

-- ── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_facilitators_user ON facilitators(user_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_org ON cohorts(org_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_course ON cohorts(course_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_facilitator ON cohorts(facilitator_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);
CREATE INDEX IF NOT EXISTS idx_sessions_cohort ON sessions(cohort_id);
CREATE INDEX IF NOT EXISTS idx_sessions_starts_at ON sessions(starts_at);
CREATE INDEX IF NOT EXISTS idx_enrolments_cohort ON enrolments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_user ON enrolments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_org ON enrolments(org_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_enrolment ON attendance(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_session ON submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_enrolment ON submissions(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_grades_enrolment ON grades(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_certificates_ref ON certificates(public_ref);

-- ── RLS helpers ──────────────────────────────────────────────
-- Every helper is prefixed `academy_`. That is not decoration: these
-- live in `public`, and a Supabase project may host more than one
-- product. A generic name like `current_org_id()` already exists in
-- at least one target database with a different body (it reads the
-- org from a JWT claim rather than from user_profiles) and around a
-- hundred unrelated RLS policies depend on it. A CREATE OR REPLACE
-- on that name would silently repoint all of them and lock the other
-- product out of its own data. Prefixing makes the collision
-- impossible rather than unlikely.
--
-- These are SECURITY DEFINER on purpose. A policy expression that
-- selects from another RLS-protected table has that table's own
-- policies applied inside it, which makes cross-table rules both
-- slow and easy to get subtly wrong. Encapsulating the rules here
-- keeps every policy below a single readable predicate.
--
-- The facilitator branch is the first cross-organisation grant in
-- this codebase: a facilitator reaches cohorts they run regardless
-- of which org those cohorts belong to, and reaches nothing else.

CREATE OR REPLACE FUNCTION public.academy_user_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.academy_org_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT org_id FROM user_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.academy_facilitator_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT id FROM facilitators WHERE user_id = auth.uid() AND active
$$;

/** Anyone in the cohort's org, the facilitator running it, or a super admin. */
CREATE OR REPLACE FUNCTION public.academy_can_read_cohort(p_cohort uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM cohorts c
    WHERE c.id = p_cohort
      AND (
        public.academy_user_role() = 'super_admin'
        OR (c.org_id IS NOT NULL AND c.org_id = public.academy_org_id())
        OR (c.facilitator_id IS NOT NULL
            AND c.facilitator_id = public.academy_facilitator_id())
      )
  )
$$;

/** Admins and managers of the cohort's own org, or a super admin. */
CREATE OR REPLACE FUNCTION public.academy_can_manage_cohort(p_cohort uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM cohorts c
    WHERE c.id = p_cohort
      AND (
        public.academy_user_role() = 'super_admin'
        OR (c.org_id IS NOT NULL
            AND c.org_id = public.academy_org_id()
            AND public.academy_user_role() IN ('admin', 'manager'))
      )
  )
$$;

/** Whoever may record attendance, submissions and grades: managers plus the facilitator. */
CREATE OR REPLACE FUNCTION public.academy_can_grade_cohort(p_cohort uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT public.academy_can_manage_cohort(p_cohort)
      OR EXISTS (
        SELECT 1 FROM cohorts c
        WHERE c.id = p_cohort
          AND c.facilitator_id IS NOT NULL
          AND c.facilitator_id = public.academy_facilitator_id()
      )
$$;

CREATE OR REPLACE FUNCTION public.academy_owns_enrolment(p_enrolment uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrolments e WHERE e.id = p_enrolment AND e.user_id = auth.uid()
  )
$$;

/** The participant themselves, their org's admins and managers, the facilitator, or a super admin. */
CREATE OR REPLACE FUNCTION public.academy_can_read_enrolment(p_enrolment uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT public.academy_owns_enrolment(p_enrolment)
      OR EXISTS (
        SELECT 1 FROM enrolments e
        WHERE e.id = p_enrolment
          AND public.academy_can_grade_cohort(e.cohort_id)
      )
      OR EXISTS (
        SELECT 1 FROM enrolments e
        WHERE e.id = p_enrolment
          AND e.org_id = public.academy_org_id()
          AND public.academy_user_role() IN ('admin', 'manager', 'super_admin')
      )
$$;

/** Whoever may write attendance, submissions and grades against this enrolment. */
CREATE OR REPLACE FUNCTION public.academy_can_grade_enrolment(p_enrolment uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrolments e
    WHERE e.id = p_enrolment AND public.academy_can_grade_cohort(e.cohort_id)
  )
$$;

-- ── RLS policies ─────────────────────────────────────────────

ALTER TABLE facilitators ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- facilitators: professional detail, readable by any signed-in user
-- because it appears on cohort pages and certificates. A facilitator
-- may edit their own row; only super_admin may create or deactivate one.
DROP POLICY IF EXISTS "Signed-in users read facilitators" ON facilitators;
CREATE POLICY "Signed-in users read facilitators"
  ON facilitators FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Facilitators update their own profile" ON facilitators;
CREATE POLICY "Facilitators update their own profile"
  ON facilitators FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Super admins manage facilitators" ON facilitators;
CREATE POLICY "Super admins manage facilitators"
  ON facilitators FOR ALL
  USING (public.academy_user_role() = 'super_admin')
  WITH CHECK (public.academy_user_role() = 'super_admin');

-- cohorts: split by command because on INSERT the row does not exist
-- yet, so the helper functions have nothing to look up.
DROP POLICY IF EXISTS "Cohort audience reads cohorts" ON cohorts;
CREATE POLICY "Cohort audience reads cohorts"
  ON cohorts FOR SELECT
  USING (public.academy_can_read_cohort(id));

DROP POLICY IF EXISTS "Admins create cohorts" ON cohorts;
CREATE POLICY "Admins create cohorts"
  ON cohorts FOR INSERT
  WITH CHECK (
    public.academy_user_role() = 'super_admin'
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager'))
  );

DROP POLICY IF EXISTS "Admins update cohorts" ON cohorts;
CREATE POLICY "Admins update cohorts"
  ON cohorts FOR UPDATE
  USING (public.academy_can_manage_cohort(id))
  WITH CHECK (public.academy_can_manage_cohort(id));

DROP POLICY IF EXISTS "Admins delete cohorts" ON cohorts;
CREATE POLICY "Admins delete cohorts"
  ON cohorts FOR DELETE
  USING (public.academy_can_manage_cohort(id));

-- sessions
DROP POLICY IF EXISTS "Cohort audience reads sessions" ON sessions;
CREATE POLICY "Cohort audience reads sessions"
  ON sessions FOR SELECT
  USING (public.academy_can_read_cohort(cohort_id));

DROP POLICY IF EXISTS "Managers and facilitators write sessions" ON sessions;
CREATE POLICY "Managers and facilitators write sessions"
  ON sessions FOR ALL
  USING (public.academy_can_grade_cohort(cohort_id))
  WITH CHECK (public.academy_can_grade_cohort(cohort_id));

-- enrolments: a participant sees only their own; admins and managers see
-- their own org's; the facilitator sees the register for cohorts they run.
DROP POLICY IF EXISTS "Enrolment audience reads enrolments" ON enrolments;
CREATE POLICY "Enrolment audience reads enrolments"
  ON enrolments FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.academy_can_grade_cohort(cohort_id)
    OR (org_id = public.academy_org_id()
        AND public.academy_user_role() IN ('admin', 'manager', 'super_admin'))
  );

-- Enrolling someone is an org decision, not a facilitator one.
DROP POLICY IF EXISTS "Admins manage enrolments" ON enrolments;
CREATE POLICY "Admins manage enrolments"
  ON enrolments FOR ALL
  USING (public.academy_can_manage_cohort(cohort_id))
  WITH CHECK (public.academy_can_manage_cohort(cohort_id));

-- attendance
DROP POLICY IF EXISTS "Enrolment audience reads attendance" ON attendance;
CREATE POLICY "Enrolment audience reads attendance"
  ON attendance FOR SELECT
  USING (public.academy_can_read_enrolment(enrolment_id));

DROP POLICY IF EXISTS "Graders write attendance" ON attendance;
CREATE POLICY "Graders write attendance"
  ON attendance FOR ALL
  USING (public.academy_can_grade_enrolment(enrolment_id))
  WITH CHECK (public.academy_can_grade_enrolment(enrolment_id));

-- submissions: participants submit their own work, graders may correct.
DROP POLICY IF EXISTS "Enrolment audience reads submissions" ON submissions;
CREATE POLICY "Enrolment audience reads submissions"
  ON submissions FOR SELECT
  USING (public.academy_can_read_enrolment(enrolment_id));

DROP POLICY IF EXISTS "Participants and graders create submissions" ON submissions;
CREATE POLICY "Participants and graders create submissions"
  ON submissions FOR INSERT
  WITH CHECK (
    public.academy_owns_enrolment(enrolment_id)
    OR public.academy_can_grade_enrolment(enrolment_id)
  );

DROP POLICY IF EXISTS "Graders amend submissions" ON submissions;
CREATE POLICY "Graders amend submissions"
  ON submissions FOR UPDATE
  USING (public.academy_can_grade_enrolment(enrolment_id))
  WITH CHECK (public.academy_can_grade_enrolment(enrolment_id));

DROP POLICY IF EXISTS "Graders delete submissions" ON submissions;
CREATE POLICY "Graders delete submissions"
  ON submissions FOR DELETE
  USING (public.academy_can_grade_enrolment(enrolment_id));

-- grades
DROP POLICY IF EXISTS "Enrolment audience reads grades" ON grades;
CREATE POLICY "Enrolment audience reads grades"
  ON grades FOR SELECT
  USING (public.academy_can_read_enrolment(enrolment_id));

DROP POLICY IF EXISTS "Graders write grades" ON grades;
CREATE POLICY "Graders write grades"
  ON grades FOR ALL
  USING (public.academy_can_grade_enrolment(enrolment_id))
  WITH CHECK (public.academy_can_grade_enrolment(enrolment_id));

-- certificates: issuing is an org act, not a facilitator one. Public
-- verification does not read through this table directly - the verify
-- route uses the service role and returns a fixed, minimal projection.
DROP POLICY IF EXISTS "Enrolment audience reads certificates" ON certificates;
CREATE POLICY "Enrolment audience reads certificates"
  ON certificates FOR SELECT
  USING (public.academy_can_read_enrolment(enrolment_id));

DROP POLICY IF EXISTS "Admins issue certificates" ON certificates;
CREATE POLICY "Admins issue certificates"
  ON certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM enrolments e
      WHERE e.id = certificates.enrolment_id
        AND public.academy_can_manage_cohort(e.cohort_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrolments e
      WHERE e.id = certificates.enrolment_id
        AND public.academy_can_manage_cohort(e.cohort_id)
    )
  );

-- ── Reminder de-duplication ──────────────────────────────────
-- The 24-hour reminder job runs on a schedule and its window overlaps
-- between runs on purpose, so a missed run still catches the session.
-- This table is what stops the overlap turning into duplicate email.

CREATE TABLE IF NOT EXISTS session_reminders (
  session_id   uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  enrolment_id uuid NOT NULL REFERENCES enrolments(id) ON DELETE CASCADE,
  sent_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, enrolment_id)
);

ALTER TABLE session_reminders ENABLE ROW LEVEL SECURITY;

-- Written only by the scheduled job through the service role, which bypasses
-- RLS. No policy grants access to anyone else, which is the intent: this is
-- delivery bookkeeping, not part of the training record.
