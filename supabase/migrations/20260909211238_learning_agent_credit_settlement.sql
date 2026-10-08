create table public.lms_agent_credit_holds (
 lease_token uuid primary key,
 run_id uuid not null references public.lms_agent_runs(id) on delete cascade,
 org_id uuid not null references public.organisations(id),
 actor_id uuid not null references public.user_profiles(id),
 reserved int not null check(reserved>0),
 state text not null default 'held' check(state in ('held','settled','released')),
 model text not null,
 input_rate numeric not null check(input_rate>=0), output_rate numeric not null check(output_rate>=0),
 markup numeric not null check(markup>0), fx numeric not null check(fx>0),
 tokens_in bigint, tokens_out bigint, charged int, usage_log_id uuid,
 reconciliation_note text,
 created_at timestamptz not null default now(), settled_at timestamptz
);
alter table public.lms_agent_credit_holds enable row level security;
revoke all on public.lms_agent_credit_holds from public,anon,authenticated;
grant all on public.lms_agent_credit_holds to service_role;
create index lms_agent_credit_holds_pending on public.lms_agent_credit_holds(created_at) where state='held';

create function public.lms_reserve_agent_credits(p_actor uuid,p_run uuid,p_lease uuid,p_max int,p_model text,p_input_rate numeric,p_output_rate numeric,p_markup numeric,p_fx numeric)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.lms_agent_runs%rowtype; h public.lms_agent_credit_holds%rowtype; available int;
begin
 select * into r from public.lms_agent_runs where id=p_run for update;
 if not found then raise exception 'Task not found' using errcode='P0002'; end if;
 perform public.lms_assert_workspace(p_actor,r.org_id,true);
 perform public.lms_assert_workspace(r.created_by,r.org_id,true);
 if r.state<>'running' or r.lease_token is distinct from p_lease or r.lease_until<=now() then raise exception 'Task execution lease changed' using errcode='40001'; end if;
 if p_max is null or p_max<=0 or p_max>100000 or p_model is null or p_input_rate is null or p_output_rate is null or p_markup is null or p_fx is null or p_input_rate<0 or p_output_rate<0 or p_markup<=0 or p_fx<=0 then raise exception 'Invalid reservation' using errcode='22023'; end if;
 select * into h from public.lms_agent_credit_holds where lease_token=p_lease for update;
 if found then
  if h.run_id<>p_run or h.actor_id<>p_actor or h.state<>'held' or h.reserved<>p_max or h.model<>p_model or h.input_rate<>p_input_rate or h.output_rate<>p_output_rate or h.markup<>p_markup or h.fx<>p_fx then raise exception 'Reservation no longer matches this execution' using errcode='40001'; end if;
  return jsonb_build_object('reserved',h.reserved);
 end if;
 select balance into available from public.credit_wallets where org_id=r.org_id for update;
 if not found or available<p_max then raise exception 'Not enough available AI credits to reserve this task' using errcode='P0001'; end if;
 perform public.academy_apply_credit_delta(p_org=>r.org_id,p_delta=>-p_max,p_reason=>'adjustment',p_model=>p_model,p_description=>'Agent reservation: '||p_run::text,p_created_by=>p_actor);
 insert into public.lms_agent_credit_holds(lease_token,run_id,org_id,actor_id,reserved,model,input_rate,output_rate,markup,fx) values(p_lease,p_run,r.org_id,p_actor,p_max,p_model,p_input_rate,p_output_rate,p_markup,p_fx);
 return jsonb_build_object('reserved',p_max);
end $$;

create function public.lms_settle_agent_credits(p_lease uuid,p_tokens_in bigint default null,p_tokens_out bigint default null,p_release_reason text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare h public.lms_agent_credit_holds%rowtype; raw_cost numeric; bill int; usage_id uuid; note text;
begin
 select * into h from public.lms_agent_credit_holds where lease_token=p_lease for update;
 if not found then raise exception 'Reservation not found' using errcode='P0002'; end if;
 if h.state<>'held' then
  if h.tokens_in is distinct from p_tokens_in or h.tokens_out is distinct from p_tokens_out then raise exception 'Settlement already recorded with different usage' using errcode='40001'; end if;
  return jsonb_build_object('state',h.state,'charged',h.charged,'usage_log_id',h.usage_log_id);
 end if;
 if p_tokens_in is null and p_tokens_out is null then
  if coalesce(length(trim(p_release_reason)),0)=0 then raise exception 'Release reason required' using errcode='22023'; end if;
  bill:=0; note:=left(p_release_reason,500);
 else
  if p_tokens_in is null or p_tokens_out is null or p_tokens_in<0 or p_tokens_out<0 then raise exception 'Invalid usage' using errcode='22023'; end if;
  raw_cost:=(p_tokens_in*h.input_rate+p_tokens_out*h.output_rate)/1000;
  bill:=least(h.reserved,case when raw_cost>0 then greatest(1,ceil(round(raw_cost*h.fx*h.markup*100,6))) else 0 end)::int;
  if ceil(round(raw_cost*h.fx*h.markup*100,6))>h.reserved then note:='Usage exceeded reservation; customer charge capped. Reconcile provider cost.'; end if;
  insert into public.usage_logs(org_id,user_id,model,tokens_in,tokens_out,cost,customer_charge,endpoint)
  values(h.org_id,h.actor_id,h.model,p_tokens_in,p_tokens_out,raw_cost,bill::numeric/100,'/api/lms/agents/run') returning id into usage_id;
 end if;
 perform public.academy_apply_credit_delta(p_org=>h.org_id,p_delta=>h.reserved,p_reason=>'adjustment',p_model=>h.model,p_description=>'Agent reservation released: '||h.run_id::text,p_created_by=>h.actor_id);
 if bill>0 then
  perform public.academy_apply_credit_delta(p_org=>h.org_id,p_delta=>-bill,p_reason=>'usage',p_usage_log=>usage_id,p_model=>h.model,p_description=>'Learning agent: '||h.run_id::text,p_created_by=>h.actor_id);
 end if;
 update public.lms_agent_credit_holds set state=case when usage_id is null then 'released' else 'settled' end,tokens_in=p_tokens_in,tokens_out=p_tokens_out,charged=bill,usage_log_id=usage_id,reconciliation_note=note,settled_at=now() where lease_token=p_lease;
 return jsonb_build_object('state',case when usage_id is null then 'released' else 'settled' end,'charged',bill,'usage_log_id',usage_id);
end $$;

create function public.lms_release_abandoned_credit_holds() returns int
language plpgsql security invoker set search_path='' as $$
declare h record; released int:=0;
begin
 for h in select c.lease_token from public.lms_agent_credit_holds c join public.lms_agent_runs r on r.id=c.run_id
 where c.state='held' and c.created_at<now()-interval '10 minutes'
 and (r.state<>'running' or r.lease_token is distinct from c.lease_token or r.lease_until<now()-interval '5 minutes')
 order by c.created_at limit 50 for update of c skip locked loop
  perform public.lms_settle_agent_credits(h.lease_token,null,null,'Interrupted execution: usage unconfirmed, funds returned. Provider cost requires reconciliation.');
  released:=released+1;
 end loop;
 return released;
end $$;
revoke all on function public.lms_reserve_agent_credits(uuid,uuid,uuid,int,text,numeric,numeric,numeric,numeric) from public,anon,authenticated;
revoke all on function public.lms_settle_agent_credits(uuid,bigint,bigint,text) from public,anon,authenticated;
revoke all on function public.lms_release_abandoned_credit_holds() from public,anon,authenticated;
grant execute on function public.lms_reserve_agent_credits(uuid,uuid,uuid,int,text,numeric,numeric,numeric,numeric) to service_role;
grant execute on function public.lms_settle_agent_credits(uuid,bigint,bigint,text) to service_role;
grant execute on function public.lms_release_abandoned_credit_holds() to service_role;
