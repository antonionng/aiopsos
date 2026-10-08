do $$ declare definition text; needle text := 'next_role := coalesce(p_patch->>''role'',member.role);'; begin
 definition := pg_get_functiondef('public.workspace_member_change(uuid,uuid,uuid,text,jsonb)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'Member command guard location changed'; end if;
 execute replace(definition,needle,
  'if p_action=''update'' and not exists(select 1 from public.organisation_memberships where user_id=p_member and org_id=p_org and status=''active'') then raise exception ''Restore membership explicitly before editing access'' using errcode=''42501''; end if; ' || needle);
end $$;
