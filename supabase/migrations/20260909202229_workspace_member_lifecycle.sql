-- Workspace-scoped changes preserve login identity and historical learning data.
create function public.workspace_member_change(p_actor uuid,p_org uuid,p_member uuid,p_action text,p_patch jsonb default '{}'::jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare caller public.user_profiles%rowtype; member public.user_profiles%rowtype; owner_id uuid; next_role text;
begin
 -- Serialise administrator/ownership changes for this organisation.
 select o.owner_id into owner_id from public.organisations o where o.id=p_org for update;
 if not found then raise exception 'Workspace not found' using errcode='P0002'; end if;
 perform public.lms_assert_workspace(p_actor,p_org,true);
 select * into caller from public.user_profiles where id=p_actor;
 if caller.role not in ('admin','super_admin') then raise exception 'Only administrators can manage membership' using errcode='42501'; end if;
 select * into member from public.user_profiles where id=p_member and org_id=p_org for update;
 if not found then raise exception 'Member not found in this workspace' using errcode='P0002'; end if;
 if member.role='super_admin' then raise exception 'Platform administrator accounts cannot be changed here' using errcode='42501'; end if;
 if p_action not in ('update','remove') then raise exception 'Invalid membership action' using errcode='22023'; end if;
 if jsonb_typeof(p_patch) <> 'object' or exists(select 1 from jsonb_object_keys(p_patch) k where k not in ('role','department_id','plan_override')) then raise exception 'Invalid membership changes' using errcode='22023'; end if;
 next_role := coalesce(p_patch->>'role',member.role);
 if next_role not in ('admin','manager','user') then raise exception 'Invalid workspace role' using errcode='22023'; end if;
 if p_member=p_actor and (p_action='remove' or next_role<>member.role) then raise exception 'Another administrator must change your own access' using errcode='42501'; end if;
 if p_member=owner_id and (p_action='remove' or next_role<>'admin') then raise exception 'Transfer workspace ownership before removing or demoting the owner' using errcode='42501'; end if;
 if member.role='admin' and (p_action='remove' or next_role<>'admin') and not exists (
   select 1 from public.user_profiles p join public.organisation_memberships m on m.user_id=p.id and m.org_id=p.org_id
   where p.org_id=p_org and p.id<>p_member and p.role in ('admin','super_admin') and m.status='active'
 ) then raise exception 'Keep at least one active administrator in this workspace' using errcode='42501'; end if;
 if p_patch ? 'plan_override' and caller.role<>'super_admin' then raise exception 'Only platform administrators can change billing entitlements' using errcode='42501'; end if;
 if p_patch ? 'plan_override' and p_patch->>'plan_override' is not null and p_patch->>'plan_override' not in ('basic','pro','enterprise') then raise exception 'Invalid plan' using errcode='22023'; end if;
 if p_patch ? 'department_id' and p_patch->>'department_id' is not null and not exists (
   select 1 from public.departments where id=(p_patch->>'department_id')::uuid and org_id=p_org
 ) then raise exception 'Department does not belong to this workspace' using errcode='42501'; end if;
 if p_action='remove' then
  update public.user_profiles set org_id=null,department_id=null,role='user' where id=p_member;
  update public.organisation_memberships set status='revoked',revoked_at=now() where user_id=p_member and org_id=p_org and status<>'revoked';
 else
  update public.user_profiles set role=next_role,
    department_id=case when p_patch ? 'department_id' then (p_patch->>'department_id')::uuid else department_id end,
    plan_override=case when p_patch ? 'plan_override' then p_patch->>'plan_override' else plan_override end
  where id=p_member;
 end if;
 insert into public.audit_logs(org_id,user_id,action,metadata) values(p_org,p_actor,
   case when p_action='remove' then 'workspace.member_removed' else 'workspace.member_updated' end,
   jsonb_build_object('member_id',p_member,'previous_role',member.role,'changes',p_patch,'identity_preserved',true));
 return jsonb_build_object('success',true,'user_id',p_member,'identity_preserved',true);
end $$;
revoke all on function public.workspace_member_change(uuid,uuid,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.workspace_member_change(uuid,uuid,uuid,text,jsonb) to service_role;
