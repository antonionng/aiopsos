create function public.workspace_owner_transfer(p_actor uuid,p_org uuid,p_next_owner uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare previous_owner uuid; caller_role text;
begin
 select owner_id into previous_owner from public.organisations where id=p_org for update;
 if not found then raise exception 'Workspace not found' using errcode='P0002'; end if;
 perform public.lms_assert_workspace(p_actor,p_org,true);
 select role into caller_role from public.user_profiles where id=p_actor;
 if p_actor is distinct from previous_owner and caller_role<>'super_admin' then raise exception 'Only the current owner can transfer workspace ownership' using errcode='42501'; end if;
 if p_next_owner=previous_owner then return jsonb_build_object('success',true,'owner_id',previous_owner); end if;
 perform 1 from public.user_profiles p join public.organisation_memberships m on m.user_id=p.id and m.org_id=p.org_id
 where p.id=p_next_owner and p.org_id=p_org and p.role='admin' and m.status='active' for update of p,m;
 if not found then raise exception 'Choose an active administrator in this workspace' using errcode='42501'; end if;
 update public.organisations set owner_id=p_next_owner where id=p_org;
 insert into public.audit_logs(org_id,user_id,action,metadata) values(p_org,p_actor,'workspace.owner_transferred',jsonb_build_object('previous_owner',previous_owner,'next_owner',p_next_owner));
 return jsonb_build_object('success',true,'owner_id',p_next_owner);
end $$;
revoke all on function public.workspace_owner_transfer(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.workspace_owner_transfer(uuid,uuid,uuid) to service_role;
