-- Fix model IDs in subscription_plans to match actual provider API IDs
UPDATE subscription_plans
SET allowed_models = '["gpt-4o-mini","claude-haiku-4-5","gemini-2.0-flash","mistral-small-latest"]'
WHERE name = 'basic';

UPDATE subscription_plans
SET allowed_models = '["gpt-5.2","gpt-4o","gpt-4o-mini","o3-mini","claude-opus-4-6","claude-sonnet-4-20250514","claude-haiku-4-5","gemini-2.0-flash","gemini-1.5-pro","mistral-large-latest","mistral-small-latest"]'
WHERE name = 'pro';

UPDATE subscription_plans
SET allowed_models = '["gpt-5.2","gpt-4o","gpt-4o-mini","o3-mini","claude-opus-4-6","claude-sonnet-4-20250514","claude-haiku-4-5","gemini-2.0-flash","gemini-1.5-pro","mistral-large-latest","mistral-small-latest"]'
WHERE name = 'enterprise';
