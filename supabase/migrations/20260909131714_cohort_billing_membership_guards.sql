-- Additional restriction only. Existing row policies still decide which records
-- a member, client manager or facilitator may access.
create function public.current_workspace_access(p_expected_org uuid default null,p_expected_role text default null)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
  select 1 from public.user_profiles p
  left join public.organisation_memberships m on m.user_id=p.id and m.org_id=p.org_id
  where p.id=(select auth.uid()) and p.org_id is not null
    and (p_expected_org is null or p.org_id=p_expected_org)
    and (p_expected_role is null or p.role=p_expected_role)
    and (m.id is null or m.status='active')
    and (p.role='super_admin' or (m.id is not null and
      (m.role='owner' or m.role=p.role or (m.role='learner' and p.role='user'))))
 );
$$;
revoke all on function public.current_workspace_access(uuid,text) from public,anon;
grant execute on function public.current_workspace_access(uuid,text) to authenticated;

do $$ declare t text; begin
 foreach t in array array['cohorts','sessions','enrolments','attendance','submissions','grades','certificates','credit_wallets','credit_ledger','billing_invoices','billing_invoice_lines','mooov_payments','usage_logs'] loop
  execute format('create policy active_workspace_required on public.%I as restrictive for all to authenticated using ((select public.current_workspace_access())) with check ((select public.current_workspace_access()))',t);
 end loop;
end $$;

-- Service-role RPC paths must perform their own checks, including old callers.
do $$ declare signature text; definition text; needle text := 'select * into actor from user_profiles where id=p_actor;'; begin
 foreach signature in array array['public.lms_live_delivery(uuid,uuid,uuid,text)','public.cohort_wall(uuid,uuid,text,uuid,uuid)'] loop
  definition := pg_get_functiondef(signature::regprocedure);
  if position(needle in definition)=0 then raise exception 'Guard location changed for %',signature; end if;
  execute replace(definition,needle,'select * into actor from user_profiles where id=p_actor for share; perform public.lms_assert_workspace(p_actor,actor.org_id,false);');
 end loop;
end $$;
create function public.lms_live_delivery_scoped(p_actor uuid,p_org uuid,p_programme uuid default null,p_cohort uuid default null,p_action text default 'get')
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 return public.lms_live_delivery(p_actor,p_programme,p_cohort,p_action);
end $$;
revoke all on function public.lms_live_delivery_scoped(uuid,uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.lms_live_delivery_scoped(uuid,uuid,uuid,uuid,text) to service_role;
create function public.cohort_wall_scoped(p_actor uuid,p_org uuid,p_cohort uuid,p_body text default null,p_parent uuid default null,p_request uuid default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 return public.cohort_wall(p_actor,p_cohort,p_body,p_parent,p_request);
end $$;
revoke all on function public.cohort_wall_scoped(uuid,uuid,uuid,text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.cohort_wall_scoped(uuid,uuid,uuid,text,uuid,uuid) to service_role;
