alter table public.lms_agent_runs add column dispatch_requested_at timestamptz;
comment on column public.lms_agent_runs.dispatch_requested_at is 'Explicit user start intent. Unstarted drafts are never picked up by scheduled recovery.';
create index lms_agent_recovery_idx on public.lms_agent_runs(updated_at) where dispatch_requested_at is not null and state in ('queued','running');
