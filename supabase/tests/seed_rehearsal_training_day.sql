-- ============================================================
-- Rehearsal seed: one training day with several companies in it.
--
-- Not a test and not production data. This builds the exact shape the
-- October tour runs - ONE cohort owned by a delivering partner, with
-- delegates from three different employers in the room - so the whole
-- lifecycle can be exercised against a real database before anyone
-- stands up in front of a room in Kuala Lumpur.
--
-- Run it on a Supabase BRANCH database, never on production:
--
--     psql "$BRANCH_DATABASE_URL" -v ON_ERROR_STOP=1 \
--       -f supabase/tests/seed_rehearsal_training_day.sql
--
-- Needs migrations 001-035 and at least one published course. It commits
-- (unlike the rls_*.sql suites, which roll back), because the point is to
-- leave a day sitting there to click through in the app.
--
-- Deliberate spread in the data, so the pass rule is actually exercised
-- rather than just satisfied:
--
--   Nurul   100% attendance, 82%  -> certificate
--   Sari    100% (one 'late')      91%  -> certificate; 'late' counts
--   Lee     100% attendance, 64%  -> refused, grade under the floor
--   Faiz     50% attendance, ungraded -> refused twice over, and its
--            grade is NULL rather than 0, which is the distinction
--            lib/certification.ts exists to preserve
--
-- Four unclaimed pending_responses are included on purpose: in a real
-- room most people submit the assessment and never finish signup, and
-- they are invisible to every aggregate except the live room view.
--
-- Ids are fixed and all-hex so the script is re-runnable and so rows are
-- easy to find by hand. Everything is ON CONFLICT DO NOTHING.
-- ============================================================

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('e0000000-0000-0000-0000-0000000000d1'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','ops@experrt.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000e1'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','trainer@experrt.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000a1'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','admin@acme.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000a2'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','nurul@acme.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000a3'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','faiz@acme.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000b1'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','admin@budi.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000b2'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','sari@budi.test','',now(),now(),now()),
  ('e0000000-0000-0000-0000-0000000000c2'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated','lee@lembah.test','',now(),now(),now())
ON CONFLICT (id) DO NOTHING;

-- One delivering partner, three attending companies.
INSERT INTO organisations (id, name, industry) VALUES
  ('e0000000-0000-0000-0000-0000000000d0'::uuid,'Experrt Delivery Partners','Training'),
  ('e0000000-0000-0000-0000-0000000000a0'::uuid,'Acme Sdn Bhd','Manufacturing'),
  ('e0000000-0000-0000-0000-0000000000b0'::uuid,'PT Budi Jaya','Logistics'),
  ('e0000000-0000-0000-0000-0000000000c0'::uuid,'Lembah Tech','Technology')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profiles (id, org_id, role, email, name, job_title) VALUES
  ('e0000000-0000-0000-0000-0000000000d1'::uuid,'e0000000-0000-0000-0000-0000000000d0'::uuid,'admin','ops@experrt.test','Delivery Ops','Programme Manager'),
  ('e0000000-0000-0000-0000-0000000000e1'::uuid,'e0000000-0000-0000-0000-0000000000d0'::uuid,'user','trainer@experrt.test','Antonio Ng','Lead Facilitator'),
  ('e0000000-0000-0000-0000-0000000000a1'::uuid,'e0000000-0000-0000-0000-0000000000a0'::uuid,'admin','admin@acme.test','Acme HR','Head of L&D'),
  ('e0000000-0000-0000-0000-0000000000a2'::uuid,'e0000000-0000-0000-0000-0000000000a0'::uuid,'user','nurul@acme.test','Nurul Aisyah','Operations Lead'),
  ('e0000000-0000-0000-0000-0000000000a3'::uuid,'e0000000-0000-0000-0000-0000000000a0'::uuid,'user','faiz@acme.test','Faiz Rahman','Line Supervisor'),
  ('e0000000-0000-0000-0000-0000000000b1'::uuid,'e0000000-0000-0000-0000-0000000000b0'::uuid,'admin','admin@budi.test','Budi HR','HR Director'),
  ('e0000000-0000-0000-0000-0000000000b2'::uuid,'e0000000-0000-0000-0000-0000000000b0'::uuid,'user','sari@budi.test','Sari Dewi','Warehouse Manager'),
  ('e0000000-0000-0000-0000-0000000000c2'::uuid,'e0000000-0000-0000-0000-0000000000c0'::uuid,'user','lee@lembah.test','Lee Wei Ming','Engineer')
ON CONFLICT (id) DO UPDATE
  SET org_id = EXCLUDED.org_id, role = EXCLUDED.role,
      name = EXCLUDED.name, job_title = EXCLUDED.job_title;

-- The trainer belongs to the delivering org, but it is the facilitator row
-- that gets them the room - that is the cross-org grant 021 built.
INSERT INTO facilitators (id, user_id, display_name, credentials)
VALUES ('e0000000-0000-0000-0000-0000000000f1','e0000000-0000-0000-0000-0000000000e1'::uuid,'Antonio Ng',
        '[{"title":"Chartered Engineer","issuer":"IET","year":2019}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seats are for the WHOLE ROOM. The column default is 12 and the enrol
-- route enforces the cap inside a loop, so an undersized limit seats part
-- of the room and then starts reporting "full".
INSERT INTO cohorts (id, course_id, org_id, facilitator_id, title, delivery_mode, location, timezone,
                     seat_limit, starts_on, ends_on, status, pass_attendance_pct, pass_grade_pct)
SELECT 'e0000000-0000-0000-0000-000000000c11',
       (SELECT id FROM courses WHERE status = 'published' ORDER BY title LIMIT 1),
       'e0000000-0000-0000-0000-0000000000d0'::uuid,
       'e0000000-0000-0000-0000-0000000000f1',
       'Kuala Lumpur, day 1','in_person','Kuala Lumpur','Asia/Kuala_Lumpur',
       40,'2026-10-14','2026-10-14','scheduled',80,70
ON CONFLICT (id) DO NOTHING;

INSERT INTO sessions (id, cohort_id, position, title, starts_at, ends_at) VALUES
  ('e0000000-0000-0000-0000-000000000511','e0000000-0000-0000-0000-000000000c11',1,'Morning: where AI actually helps','2026-10-14T01:00:00Z','2026-10-14T04:00:00Z'),
  ('e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-000000000c11',2,'Afternoon: working with a model','2026-10-14T05:00:00Z','2026-10-14T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Each enrolment carries the delegate's OWN employer, not the deliverer's.
INSERT INTO enrolments (id, cohort_id, user_id, org_id) VALUES
  ('e0000000-0000-0000-0000-0000000000a5','e0000000-0000-0000-0000-000000000c11','e0000000-0000-0000-0000-0000000000a2'::uuid,'e0000000-0000-0000-0000-0000000000a0'::uuid),
  ('e0000000-0000-0000-0000-0000000000a6','e0000000-0000-0000-0000-000000000c11','e0000000-0000-0000-0000-0000000000a3'::uuid,'e0000000-0000-0000-0000-0000000000a0'::uuid),
  ('e0000000-0000-0000-0000-0000000000b5','e0000000-0000-0000-0000-000000000c11','e0000000-0000-0000-0000-0000000000b2'::uuid,'e0000000-0000-0000-0000-0000000000b0'::uuid),
  ('e0000000-0000-0000-0000-0000000000c5','e0000000-0000-0000-0000-000000000c11','e0000000-0000-0000-0000-0000000000c2'::uuid,'e0000000-0000-0000-0000-0000000000c0'::uuid)
ON CONFLICT (id) DO NOTHING;

INSERT INTO attendance (session_id, enrolment_id, status) VALUES
  ('e0000000-0000-0000-0000-000000000511','e0000000-0000-0000-0000-0000000000a5','present'),
  ('e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000a5','present'),
  ('e0000000-0000-0000-0000-000000000511','e0000000-0000-0000-0000-0000000000a6','present'),
  ('e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000a6','absent'),
  ('e0000000-0000-0000-0000-000000000511','e0000000-0000-0000-0000-0000000000b5','present'),
  ('e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000b5','late'),
  ('e0000000-0000-0000-0000-000000000511','e0000000-0000-0000-0000-0000000000c5','present'),
  ('e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000c5','present')
ON CONFLICT (session_id, enrolment_id) DO NOTHING;

INSERT INTO submissions (id, session_id, enrolment_id, notes, storage_path) VALUES
  ('e0000000-0000-0000-0000-000000000d11','e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000a5','Rota triage exercise','submissions/a5/ab12-rota.pdf'),
  ('e0000000-0000-0000-0000-000000000d12','e0000000-0000-0000-0000-000000000512','e0000000-0000-0000-0000-0000000000b5','Photo of whiteboard','submissions/b5/cd34-board.jpg')
ON CONFLICT (id) DO NOTHING;

-- Two grades are attached to the work they were given for, which is what
-- grades.submission_id has been there for since 021 without a caller.
INSERT INTO grades (enrolment_id, submission_id, score, max_score, feedback) VALUES
  ('e0000000-0000-0000-0000-0000000000a5','e0000000-0000-0000-0000-000000000d11',82,100,'Clear triage logic.'),
  ('e0000000-0000-0000-0000-0000000000b5','e0000000-0000-0000-0000-000000000d12',91,100,'Strong worked example.'),
  ('e0000000-0000-0000-0000-0000000000c5',NULL,64,100,'Needs a second pass.');

-- One reusable course pack, one handout for this day.
INSERT INTO course_materials (id, course_id, cohort_id, title, filename, storage_path, visibility)
SELECT 'e0000000-0000-0000-0000-000000000e11',
       (SELECT id FROM courses WHERE status = 'published' ORDER BY title LIMIT 1),
       NULL,'Participant pack','pack.pdf','courses/rehearsal/pack.pdf','enrolled'
ON CONFLICT (id) DO NOTHING;

INSERT INTO course_materials (id, course_id, cohort_id, title, filename, storage_path, visibility) VALUES
  ('e0000000-0000-0000-0000-000000000e12',NULL,'e0000000-0000-0000-0000-000000000c11','KL day 1 handout','day1.pdf','cohorts/rehearsal/day1.pdf','enrolled')
ON CONFLICT (id) DO NOTHING;

-- One QR link per company, all pointing at the same day. This is what puts
-- a delegate inside their own employer's tenant when they scan.
INSERT INTO assessment_links (id, org_id, created_by, token, title, template_id, cohort_id) VALUES
  ('e0000000-0000-0000-0000-000000000111','e0000000-0000-0000-0000-0000000000a0'::uuid,'e0000000-0000-0000-0000-0000000000d1'::uuid,'acme-sdn-bhd-kuala-lumpur-oct14','Acme Sdn Bhd','training-needs','e0000000-0000-0000-0000-000000000c11'),
  ('e0000000-0000-0000-0000-000000000112','e0000000-0000-0000-0000-0000000000b0'::uuid,'e0000000-0000-0000-0000-0000000000d1'::uuid,'pt-budi-jaya-kuala-lumpur-oct14','PT Budi Jaya','training-needs','e0000000-0000-0000-0000-000000000c11'),
  ('e0000000-0000-0000-0000-000000000113','e0000000-0000-0000-0000-0000000000c0'::uuid,'e0000000-0000-0000-0000-0000000000d1'::uuid,'lembah-tech-kuala-lumpur-oct14','Lembah Tech','training-needs','e0000000-0000-0000-0000-000000000c11')
ON CONFLICT (id) DO NOTHING;

-- Submitted the assessment, never finished signup. Invisible to every
-- aggregate in the product except the live room view, which reads these
-- rows precisely so the room fills in before anyone has an account.
INSERT INTO pending_responses (id, link_id, session_token, template_id, dimension_scores) VALUES
  ('e0000000-0000-0000-0000-000000000211','e0000000-0000-0000-0000-000000000111','reh-a-1','training-needs','{"ai":4.2,"technology":3.1,"robotics":2.0}'::jsonb),
  ('e0000000-0000-0000-0000-000000000212','e0000000-0000-0000-0000-000000000111','reh-a-2','training-needs','{"ai":3.8,"technology":2.9,"robotics":1.5}'::jsonb),
  ('e0000000-0000-0000-0000-000000000213','e0000000-0000-0000-0000-000000000112','reh-b-1','training-needs','{"ai":4.5,"technology":3.4,"robotics":3.9}'::jsonb),
  ('e0000000-0000-0000-0000-000000000214','e0000000-0000-0000-0000-000000000113','reh-c-1','training-needs','{"ai":2.1,"technology":4.4,"robotics":1.2}'::jsonb)
ON CONFLICT (id) DO NOTHING;

SELECT 'rehearsal day seeded: 1 cohort, 3 companies, 4 delegates' AS result;
