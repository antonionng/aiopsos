-- ============================================================
-- 025: OpenAI is the only model provider
--
-- `subscription_plans.allowed_models` still listed Claude, Gemini
-- and Mistral ids from migration 015. Nothing can serve those any
-- more: the provider SDKs are gone and only OPENAI_API_KEY is
-- configured, so a plan advertising them would gate a model the
-- platform then fails to call.
--
-- The choice is commercial as much as technical. The evidence pack
-- and the public sub-processor list have to name every party that
-- touches customer data, and one named provider is a materially
-- easier approval for a regulated buyer than four.
--
-- Idempotent - safe to run multiple times.
-- ============================================================

UPDATE subscription_plans
SET allowed_models = '["gpt-4o-mini"]'
WHERE name = 'basic';

UPDATE subscription_plans
SET allowed_models = '["gpt-5.2","gpt-4o","gpt-4o-mini","o3-mini"]'
WHERE name IN ('pro', 'enterprise');

-- Conversations that stored a retired model id need no migration:
-- getLanguageModel() falls back to gpt-4o for any id not in the registry,
-- so an old thread degrades rather than breaking.
