create index lms_agent_credit_holds_run on public.lms_agent_credit_holds(run_id);
create index lms_agent_credit_holds_org_pending on public.lms_agent_credit_holds(org_id) where state='held';
do $$ declare definition text; begin
 definition:=pg_get_functiondef('public.lms_reserve_agent_credits(uuid,uuid,uuid,int,text,numeric,numeric,numeric,numeric)'::regprocedure);
 if position('or r.lease_until<=now()' in definition)=0 then raise exception 'Unexpected reservation function'; end if;
 execute replace(definition,'or r.lease_until<=now()','or r.lease_until is null or r.lease_until<=now()');
 definition:=pg_get_functiondef('public.lms_release_abandoned_credit_holds()'::regprocedure);
 if position('or r.lease_until<now()' in definition)=0 then raise exception 'Unexpected recovery function'; end if;
 execute replace(definition,'or r.lease_until<now()','or r.lease_until is null or r.lease_until<now()');
end $$;
