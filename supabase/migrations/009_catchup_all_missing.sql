-- ============================================================
-- 007: Consolidated catch-up migration
-- Ensures ALL schema from migrations 002_billing through 006 exists.
-- Fully idempotent - safe to run multiple times.
-- ============================================================

-- ==================== FROM 002_billing: Billing & plans ====================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  stripe_price_id text,
  allowed_models jsonb NOT NULL DEFAULT '[]',
  price_per_seat numeric(8,2) NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO subscription_plans (name, allowed_models, price_per_seat, currency) VALUES
  ('basic', '["gpt-4o-mini","claude-3-5-haiku-20241022","gemini-2.0-flash","mistral-small-latest"]', 39.00, 'GBP'),
  ('pro', '["gpt-5.3","gpt-4o","gpt-4o-mini","o3-mini","claude-opus-4.6","claude-sonnet-4-20250514","claude-3-5-haiku-20241022","gemini-2.0-flash","gemini-1.5-pro","mistral-large-latest","mistral-small-latest"]', 79.00, 'GBP')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS subscription_plan_id uuid REFERENCES subscription_plans(id),
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  ADD COLUMN IF NOT EXISTS seat_count int NOT NULL DEFAULT 5;

-- Add check constraint for subscription_status if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'organisations_subscription_status_check'
  ) THEN
    ALTER TABLE organisations ADD CONSTRAINT organisations_subscription_status_check
      CHECK (subscription_status IN ('trialing','active','past_due','canceled','incomplete'));
  END IF;
END $$;

ALTER TABLE usage_logs
  ADD COLUMN IF NOT EXISTS customer_charge numeric(10,6) NOT NULL DEFAULT 0;

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS folder text,
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS knowledge_base_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  department_type text,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  system_prompt text NOT NULL,
  icon text NOT NULL DEFAULT 'bot',
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  requested_by uuid NOT NULL REFERENCES user_profiles(id),
  reviewer_id uuid REFERENCES user_profiles(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  comment text,
  content_preview text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_kb_files_org ON knowledge_base_files(org_id);
CREATE INDEX IF NOT EXISTS idx_kb_files_dept ON knowledge_base_files(department_id);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_user ON saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_org ON saved_prompts(org_id);
CREATE INDEX IF NOT EXISTS idx_model_personas_org ON model_personas(org_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_org ON approval_requests(org_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_conversations_folder ON conversations(user_id, folder);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read subscription plans' AND tablename = 'subscription_plans') THEN
    CREATE POLICY "Anyone can read subscription plans" ON subscription_plans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view org knowledge base' AND tablename = 'knowledge_base_files') THEN
    CREATE POLICY "Users view org knowledge base" ON knowledge_base_files FOR SELECT USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users upload to org knowledge base' AND tablename = 'knowledge_base_files') THEN
    CREATE POLICY "Users upload to org knowledge base" ON knowledge_base_files FOR INSERT WITH CHECK (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins delete knowledge base files' AND tablename = 'knowledge_base_files') THEN
    CREATE POLICY "Admins delete knowledge base files" ON knowledge_base_files FOR DELETE USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own and shared prompts' AND tablename = 'saved_prompts') THEN
    CREATE POLICY "Users view own and shared prompts" ON saved_prompts FOR SELECT USING (
      user_id = auth.uid() OR (is_shared = true AND org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own prompts' AND tablename = 'saved_prompts') THEN
    CREATE POLICY "Users manage own prompts" ON saved_prompts FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view org personas' AND tablename = 'model_personas') THEN
    CREATE POLICY "Users view org personas" ON model_personas FOR SELECT USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage personas' AND tablename = 'model_personas') THEN
    CREATE POLICY "Admins manage personas" ON model_personas FOR ALL USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view org approval requests' AND tablename = 'approval_requests') THEN
    CREATE POLICY "Users view org approval requests" ON approval_requests FOR SELECT USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users create approval requests' AND tablename = 'approval_requests') THEN
    CREATE POLICY "Users create approval requests" ON approval_requests FOR INSERT WITH CHECK (requested_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Managers resolve approval requests' AND tablename = 'approval_requests') THEN
    CREATE POLICY "Managers resolve approval requests" ON approval_requests FOR UPDATE USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
    );
  END IF;
END $$;

-- ==================== FROM 003: Enhanced profiles ====================

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS website text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS founded_year int,
  ADD COLUMN IF NOT EXISTS mission text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS products_services text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tech_stack text NOT NULL DEFAULT '';

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS job_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- ==================== FROM 004: Projects ====================

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project ON conversations(project_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own projects' AND tablename = 'projects') THEN
    CREATE POLICY "Users view own projects" ON projects FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own projects' AND tablename = 'projects') THEN
    CREATE POLICY "Users manage own projects" ON projects FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view project files' AND tablename = 'project_files') THEN
    CREATE POLICY "Users view project files" ON project_files FOR SELECT USING (
      project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage project files' AND tablename = 'project_files') THEN
    CREATE POLICY "Users manage project files" ON project_files FOR ALL USING (
      project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- ==================== FROM 005: Chat features ====================

CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  uploaded_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating text NOT NULL CHECK (rating IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS share_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS shared_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_message_attachments_conv ON message_attachments(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_msg ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_msg ON message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_user ON message_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_share_token ON conversations(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own attachments' AND tablename = 'message_attachments') THEN
    CREATE POLICY "Users view own attachments" ON message_attachments FOR SELECT USING (
      conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own attachments' AND tablename = 'message_attachments') THEN
    CREATE POLICY "Users manage own attachments" ON message_attachments FOR ALL USING (uploaded_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own feedback' AND tablename = 'message_feedback') THEN
    CREATE POLICY "Users view own feedback" ON message_feedback FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own feedback' AND tablename = 'message_feedback') THEN
    CREATE POLICY "Users manage own feedback" ON message_feedback FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ==================== FROM 006_enterprise: Enterprise features ====================

ALTER TABLE subscription_plans
  DROP CONSTRAINT IF EXISTS subscription_plans_name_check;
ALTER TABLE subscription_plans
  ADD CONSTRAINT subscription_plans_name_check
  CHECK (name IN ('basic', 'pro', 'enterprise'));

CREATE TABLE IF NOT EXISTS feature_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  feature text NOT NULL CHECK (feature IN ('voice', 'web_search', 'image_gen', 'deep_research')),
  units numeric(10,2) NOT NULL DEFAULT 1,
  cost numeric(10,6) NOT NULL DEFAULT 0,
  customer_charge numeric(10,6) NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_org ON feature_usage_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON feature_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage_logs(feature);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created ON feature_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_feature_usage_org_feature_month ON feature_usage_logs(org_id, feature, created_at);

ALTER TABLE feature_usage_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own org feature usage' AND tablename = 'feature_usage_logs') THEN
    CREATE POLICY "Users view own org feature usage" ON feature_usage_logs FOR SELECT USING (
      org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own feature usage' AND tablename = 'feature_usage_logs') THEN
    CREATE POLICY "Users insert own feature usage" ON feature_usage_logs FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;
