-- Expand organisation details for richer AI context
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS website text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS founded_year int,
  ADD COLUMN IF NOT EXISTS mission text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS products_services text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tech_stack text NOT NULL DEFAULT '';

-- Expand user profiles for personalised AI responses
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS job_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_url text;
