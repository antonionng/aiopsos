-- ============================================================
-- Row-level security tests for course enquiries.
--
-- This is the only table in the schema an anonymous visitor may
-- write to, which makes the read side the thing to get right: an
-- enquiry holds a name, an email and an organisation, so a public
-- insert policy must never come with a public read policy beside it.
--
--     psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_course_enquiries.sql
-- ============================================================

BEGIN;

INSERT INTO course_enquiries (id, name, email, organisation_name, message, source)
VALUES ('99999999-0000-0000-0000-000000000001', 'Test Buyer', 'buyer@example.test',
        'Northwind', 'Interested in robotics for our warehouse team.', 'course_page');

DO $$
DECLARE n bigint; ok boolean;
BEGIN
  PERFORM set_config('request.jwt.claims', '', true);
  PERFORM set_config('role', 'anon', true);

  -- A contact form that requires an account is not a contact form.
  BEGIN
    INSERT INTO course_enquiries (name, email, message, source)
    VALUES ('Anon Visitor', 'anon@example.test', 'Can you run this in Manchester?', 'catalogue');
    ok := true;
  EXCEPTION WHEN insufficient_privilege THEN
    ok := false;
  END;
  ASSERT ok, 'an anonymous visitor must be able to raise an enquiry';

  -- NEGATIVE: and must never read one back.
  SELECT count(*) INTO n FROM course_enquiries;
  ASSERT n = 0, format('anon must NOT read enquiries, saw %s', n);

  PERFORM set_config('role', 'none', true);
END $$;

DO $$
DECLARE affected integer := 0;
BEGIN
  -- NEGATIVE: nor edit one.
  PERFORM set_config('role', 'anon', true);
  BEGIN
    UPDATE course_enquiries SET status = 'closed'
    WHERE id = '99999999-0000-0000-0000-000000000001';
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    affected := 0;
  END;
  PERFORM set_config('role', 'none', true);
  ASSERT affected = 0, format('anon must NOT update enquiries, changed %s rows', affected);
END $$;

SELECT 'enquiry RLS tests passed' AS result;

ROLLBACK;
