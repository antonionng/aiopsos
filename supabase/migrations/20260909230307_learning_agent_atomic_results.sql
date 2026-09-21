-- The execution lease is the immutable result identity, also used for settlement.
create table public.lms_agent_results (
 lease_token uuid primary key references public.lms_agent_credit_holds(lease_token) on delete cascade,
 run_id uuid not null references public.lms_agent_runs(id) on delete cascade,
 org_id uuid not null references public.organisations(id),
 proposal jsonb, summary text not null,
 tokens_in bigint not null check(tokens_in>=0), tokens_out bigint not null check(tokens_out>=0),
 disposition text not null check(disposition in ('needs_review','failed','retained')),
 created_at timestamptz not null default now()
);
alter table public.lms_agent_results enable row level security;
revoke all on public.lms_agent_results from public,anon,authenticated;
grant all on public.lms_agent_results to service_role;
create index lms_agent_results_run on public.lms_agent_results(run_id);

create function public.lms_complete_agent_result(p_actor uuid,p_run uuid,p_lease uuid,p_proposal jsonb,p_summary text,p_tokens_in bigint,p_tokens_out bigint)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.lms_agent_runs%rowtype; h public.lms_agent_credit_holds%rowtype; prior public.lms_agent_results%rowtype; outcome text:='retained'; authorised boolean:=true;
begin
 -- Consistent task-before-hold lock order with reservation. Completion owns no
 -- learner-facing writes: the manager must still review and apply a proposal.
 select * into r from public.lms_agent_runs where id=p_run for update;
 if not found then raise exception 'Task not found' using errcode='P0002'; end if;
 select * into h from public.lms_agent_credit_holds where lease_token=p_lease for update;
 if not found or h.run_id<>p_run or h.actor_id<>p_actor or h.org_id<>r.org_id then
  raise exception 'Result does not belong to this execution' using errcode='42501';
 end if;
 if p_summary is null or length(p_summary)>200000 or p_tokens_in is null or p_tokens_out is null or p_tokens_in<0 or p_tokens_out<0 or octet_length(coalesce(p_proposal,'null'::jsonb)::text)>2000000 then
  raise exception 'Invalid result' using errcode='22023';
 end if;
 select * into prior from public.lms_agent_results where lease_token=p_lease;
 if found then
  if prior.proposal is distinct from p_proposal or prior.summary is distinct from p_summary or prior.tokens_in<>p_tokens_in or prior.tokens_out<>p_tokens_out then
   raise exception 'A different result is already recorded' using errcode='40001';
  end if;
  return jsonb_build_object('state',prior.disposition,'saved',true);
 end if;
 -- Completed output survives cancellation/revocation but is never attached to
 -- a newer attempt or made available through the ordinary workspace API.
 begin
  perform public.lms_assert_workspace(p_actor,r.org_id,true);
  perform public.lms_assert_workspace(r.created_by,r.org_id,true);
 exception when insufficient_privilege then authorised:=false;
 end;
 if authorised and r.state='running' and r.lease_token=p_lease then
  outcome:=case when r.kind='delivery' or (p_proposal is not null and p_proposal<>'null'::jsonb) then 'needs_review' else 'failed' end;
  update public.lms_agent_runs set state=outcome,proposal=p_proposal,summary=p_summary,
   error=case when outcome='failed' then 'The agent could not prepare a valid proposal. Review its explanation and revise the brief.' else null end,
   lease_token=null,lease_until=null,updated_at=now() where id=p_run;
 end if;
 insert into public.lms_agent_results(lease_token,run_id,org_id,proposal,summary,tokens_in,tokens_out,disposition)
 values(p_lease,p_run,r.org_id,p_proposal,p_summary,p_tokens_in,p_tokens_out,outcome);
 if h.state<>'released' then
  perform public.lms_settle_agent_credits(p_lease,p_tokens_in,p_tokens_out);
 else
  update public.lms_agent_credit_holds set reconciliation_note='Completed result arrived after reservation release. Output retained; reconcile provider cost without rebilling.' where lease_token=p_lease;
 end if;
 return jsonb_build_object('state',outcome,'saved',true);
end $$;
revoke all on function public.lms_complete_agent_result(uuid,uuid,uuid,jsonb,text,bigint,bigint) from public,anon,authenticated;
grant execute on function public.lms_complete_agent_result(uuid,uuid,uuid,jsonb,text,bigint,bigint) to service_role;
