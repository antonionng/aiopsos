-- Fix foreign keys missing ON DELETE clauses

-- assessment_responses.user_id: cascade so user deletion cleans up responses
ALTER TABLE assessment_responses
  DROP CONSTRAINT IF EXISTS assessment_responses_user_id_fkey,
  ADD CONSTRAINT assessment_responses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- assessment_responses.department_id: set null so dept deletion doesn't lose responses
ALTER TABLE assessment_responses
  DROP CONSTRAINT IF EXISTS assessment_responses_department_id_fkey,
  ADD CONSTRAINT assessment_responses_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Also need to make department_id nullable for SET NULL to work
ALTER TABLE assessment_responses ALTER COLUMN department_id DROP NOT NULL;

-- usage_logs.user_id: set null to preserve usage history when user is deleted
ALTER TABLE usage_logs
  DROP CONSTRAINT IF EXISTS usage_logs_user_id_fkey,
  ADD CONSTRAINT usage_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE usage_logs ALTER COLUMN user_id DROP NOT NULL;

-- usage_logs.department_id (if not already set)
ALTER TABLE usage_logs
  DROP CONSTRAINT IF EXISTS usage_logs_department_id_fkey,
  ADD CONSTRAINT usage_logs_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- feature_usage_logs.user_id: set null to preserve billing data
ALTER TABLE feature_usage_logs
  DROP CONSTRAINT IF EXISTS feature_usage_logs_user_id_fkey,
  ADD CONSTRAINT feature_usage_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE feature_usage_logs ALTER COLUMN user_id DROP NOT NULL;

-- knowledge_base_files.uploaded_by: set null (keep file, lose uploader ref)
ALTER TABLE knowledge_base_files
  DROP CONSTRAINT IF EXISTS knowledge_base_files_uploaded_by_fkey,
  ADD CONSTRAINT knowledge_base_files_uploaded_by_fkey
    FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE knowledge_base_files ALTER COLUMN uploaded_by DROP NOT NULL;

-- model_personas.created_by: set null (keep persona, lose creator ref)
ALTER TABLE model_personas
  DROP CONSTRAINT IF EXISTS model_personas_created_by_fkey,
  ADD CONSTRAINT model_personas_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE model_personas ALTER COLUMN created_by DROP NOT NULL;

-- approval_requests.requested_by: cascade
ALTER TABLE approval_requests
  DROP CONSTRAINT IF EXISTS approval_requests_requested_by_fkey,
  ADD CONSTRAINT approval_requests_requested_by_fkey
    FOREIGN KEY (requested_by) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- approval_requests.reviewer_id: set null
ALTER TABLE approval_requests
  DROP CONSTRAINT IF EXISTS approval_requests_reviewer_id_fkey,
  ADD CONSTRAINT approval_requests_reviewer_id_fkey
    FOREIGN KEY (reviewer_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- assessments.created_by: set null (keep assessment, lose creator ref)
ALTER TABLE assessments
  DROP CONSTRAINT IF EXISTS assessments_created_by_fkey,
  ADD CONSTRAINT assessments_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE assessments ALTER COLUMN created_by DROP NOT NULL;

-- assessment_links.created_by: set null
ALTER TABLE assessment_links
  DROP CONSTRAINT IF EXISTS assessment_links_created_by_fkey,
  ADD CONSTRAINT assessment_links_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE assessment_links ALTER COLUMN created_by DROP NOT NULL;

-- audit_logs.user_id: set null to preserve audit trail
ALTER TABLE audit_logs
  DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey,
  ADD CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- message_attachments.uploaded_by: cascade with message
ALTER TABLE message_attachments
  DROP CONSTRAINT IF EXISTS message_attachments_uploaded_by_fkey,
  ADD CONSTRAINT message_attachments_uploaded_by_fkey
    FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE message_attachments ALTER COLUMN uploaded_by DROP NOT NULL;

-- project_files.uploaded_by: set null
ALTER TABLE project_files
  DROP CONSTRAINT IF EXISTS project_files_uploaded_by_fkey,
  ADD CONSTRAINT project_files_uploaded_by_fkey
    FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE project_files ALTER COLUMN uploaded_by DROP NOT NULL;
