-- Compatibility guard: explicit context, no multi-workspace switching yet.
create function public.lms_assert_workspace(p_actor uuid,p_org uuid,p_manager boolean default false)
returns void language plpgsql security invoker set search_path = '' as $$
declare p public.user_profiles%rowtype; m public.organisation_memberships%rowtype;
begin
 select * into p from public.user_profiles where id=p_actor for share;
 if p.id is null or p_org is null or p.org_id is distinct from p_org then
  raise exception 'Workspace changed or access is unavailable. Refresh your workspace.' using errcode='42501';
 end if;
 select * into m from public.organisation_memberships where user_id=p_actor and org_id=p_org for share;
 if m.id is not null and m.status <> 'active' then
  raise exception 'Your membership is no longer active in this workspace.' using errcode='42501';
 end if;
 -- Preserve the existing platform-operator path without creating membership.
 -- Every ordinary account requires a current membership. Role discrepancies
 -- fail closed until the rest of the application can adopt scoped roles.
 if p.role <> 'super_admin' and (m.id is null or not (
   m.role='owner' or m.role=p.role or (m.role='learner' and p.role='user')
 )) then
  raise exception 'Workspace permissions changed. Refresh or contact your administrator.' using errcode='42501';
 end if;
 if p_manager and p.role not in ('admin','manager','super_admin') then
  raise exception 'A learning manager is required.' using errcode='42501';
 end if;
end $$;
revoke all on function public.lms_assert_workspace(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.lms_assert_workspace(uuid,uuid,boolean) to service_role;

-- Guard the old entry point too, including recursive proposal application.
do $$ declare definition text; needle text := 'select * into actor from public.user_profiles where id=p_actor;'; begin
 definition := pg_get_functiondef('public.lms_command(uuid,text,jsonb,uuid)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'Learning command guard location changed; inspect before migrating'; end if;
 definition := replace(definition,needle,
  'select * into actor from public.user_profiles where id=p_actor for share; perform public.lms_assert_workspace(p_actor,actor.org_id,false);');
 execute definition;
end $$;

create function public.lms_command_scoped(p_actor uuid,p_org uuid,p_action text,p_payload jsonb default '{}'::jsonb,p_request uuid default gen_random_uuid())
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 return public.lms_command(p_actor,p_action,p_payload,p_request);
end $$;
revoke all on function public.lms_command_scoped(uuid,uuid,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.lms_command_scoped(uuid,uuid,text,jsonb,uuid) to service_role;

-- Validate the original task owner's authority atomically with lease acquisition
-- and proposal persistence. Failed/cancelled updates remain possible for cleanup.
create function public.lms_guard_agent_authority() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if NEW.state in ('running','needs_review') then
  perform public.lms_assert_workspace(NEW.created_by,NEW.org_id,true);
 end if;
 return NEW;
end $$;
revoke all on function public.lms_guard_agent_authority() from public,anon,authenticated;
create trigger lms_guard_agent_authority before insert or update on public.lms_agent_runs
for each row execute function public.lms_guard_agent_authority();

create function public.lms_claim_agent_scoped(p_actor uuid,p_id uuid,p_org uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,true);
 return public.lms_claim_agent(p_id,p_org);
end $$;
revoke all on function public.lms_claim_agent_scoped(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.lms_claim_agent_scoped(uuid,uuid,uuid) to service_role;
