create function public.assessment_manage(p_actor uuid,p_org uuid,p_action text,p_id uuid default null,p_response uuid default null,p_title text default null,p_template text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare actor_role text; a public.assessments%rowtype; affected int;
begin
 perform public.lms_assert_workspace(p_actor,p_org,true);
 select role into actor_role from public.user_profiles where id=p_actor;
 if p_action not in ('create','delete','response.delete') or p_action is null then raise exception 'Unsupported action' using errcode='22023'; end if;
 if p_action in ('create','delete') and actor_role not in ('admin','super_admin') then raise exception 'Administrator required' using errcode='42501'; end if;
 if p_action='create' then
  if coalesce(length(trim(p_title)),0)<1 or length(p_title)>200 or coalesce(length(trim(p_template)),0)<1 or length(p_template)>100 then raise exception 'Invalid assessment details' using errcode='22023'; end if;
  insert into public.assessments(org_id,created_by,title,template_id,status) values(p_org,p_actor,trim(p_title),p_template,'active') returning * into a;
  return to_jsonb(a);
 end if;
 select * into a from public.assessments where id=p_id and org_id=p_org for update;
 if not found then raise exception 'Assessment not found' using errcode='P0002'; end if;
 if p_action='delete' then
  delete from public.assessments where id=a.id and org_id=p_org;
 else
  delete from public.assessment_responses where id=p_response and assessment_id=a.id;
  get diagnostics affected=row_count;
  if affected=0 then raise exception 'Response not found' using errcode='P0002'; end if;
 end if;
 return jsonb_build_object('success',true);
end $$;
revoke all on function public.assessment_manage(uuid,uuid,text,uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.assessment_manage(uuid,uuid,text,uuid,uuid,text,text) to service_role;
