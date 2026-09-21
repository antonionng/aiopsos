ALTER TABLE public.course_enquiries
  ADD COLUMN IF NOT EXISTS request_id uuid,
  ADD COLUMN IF NOT EXISTS submission_hash text,
  ADD COLUMN IF NOT EXISTS assessment_data jsonb,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_recorded_at timestamptz,
  ADD COLUMN IF NOT EXISTS privacy_version text;
CREATE UNIQUE INDEX IF NOT EXISTS course_enquiries_request_id_key ON public.course_enquiries(request_id) WHERE request_id IS NOT NULL;
ALTER TABLE public.course_enquiries DROP CONSTRAINT IF EXISTS course_enquiries_source_check;
ALTER TABLE public.course_enquiries ADD CONSTRAINT course_enquiries_source_check CHECK (source IN ('course_page','assessment_results','catalogue','dashboard','contact','learning_check'));
COMMENT ON COLUMN public.course_enquiries.assessment_data IS 'Voluntarily submitted learning-check answers and server-calculated priorities. Not employer assessment records.';
