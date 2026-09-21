begin;
insert into auth.users(id,email,raw_user_meta_data) values('44444444-4444-4444-a444-000000000081','credit-test@example.invalid','{}');
insert into organisations(id,name) values('55555555-5555-4555-a555-000000000081','Credit settlement verification');
update user_profiles set org_id='55555555-5555-4555-a555-000000000081',role='admin' where id='44444444-4444-4444-a444-000000000081';
insert into credit_wallets(org_id,balance) values('55555555-5555-4555-a555-000000000081',100);
do $$ declare r uuid; l uuid; outcome jsonb; mode text; begin
 foreach mode in array array['normal','cancelled','revoked','conflict','replaced','released','missing'] loop
  update organisation_memberships set status='active',revoked_at=null where user_id='44444444-4444-4444-a444-000000000081';
  l:=gen_random_uuid();
  insert into lms_agent_runs(org_id,created_by,kind,goal,state,lease_token,lease_until) values('55555555-5555-4555-a555-000000000081','44444444-4444-4444-a444-000000000081','delivery','Atomic result fixture','running',l,now()+interval '2 minutes') returning id into r;
  perform lms_reserve_agent_credits('44444444-4444-4444-a444-000000000081',r,l,24,'test-model',0.001,0.001,1,1);
  if mode='cancelled' then update lms_agent_runs set state='cancelled',lease_token=null where id=r; end if;
  if mode='revoked' then update organisation_memberships set status='revoked',revoked_at=now() where user_id='44444444-4444-4444-a444-000000000081'; end if;
  if mode='replaced' then update lms_agent_runs set lease_token=gen_random_uuid() where id=r; end if;
  if mode='released' then perform lms_settle_agent_credits(l,null,null,'Test interrupted release'); end if;
  if mode='missing' then update lms_agent_runs set kind='course' where id=r; end if;
  if mode='conflict' then
   perform lms_settle_agent_credits(l,500,500);
   begin
    perform lms_complete_agent_result('44444444-4444-4444-a444-000000000081',r,l,null,'Saved explanation',1000,1000);
    raise exception 'Conflicting usage accepted';
   exception when serialization_failure then null; end;
   if exists(select 1 from lms_agent_results where lease_token=l) or (select state from lms_agent_runs where id=r)<>'running' then raise exception 'Failed settlement did not roll back result/task'; end if;
  else
   outcome:=lms_complete_agent_result('44444444-4444-4444-a444-000000000081',r,l,null,'Saved explanation',1000,1000);
   if outcome->>'state'<>(case when mode in ('normal','released') then 'needs_review' when mode='missing' then 'failed' else 'retained' end) then raise exception 'Wrong completion disposition: %',outcome; end if;
   perform lms_complete_agent_result('44444444-4444-4444-a444-000000000081',r,l,null,'Saved explanation',1000,1000);
   if (select count(*) from lms_agent_results where lease_token=l)<>1 then raise exception 'Duplicate or missing result'; end if;
   if mode<>'released' and (select count(*) from usage_logs where id=(select usage_log_id from lms_agent_credit_holds where lease_token=l))<>1 then raise exception 'Missing usage'; end if;
   if mode='released' and (select state from lms_agent_credit_holds where lease_token=l)<>'released' then raise exception 'Released reservation rebilled'; end if;
   if mode='replaced' and (select lease_token from lms_agent_runs where id=r)=l then raise exception 'New worker overwritten'; end if;
   if mode='cancelled' and (select state from lms_agent_runs where id=r)<>'cancelled' then raise exception 'Cancellation overwritten'; end if;
   if mode='revoked' and (select proposal from lms_agent_runs where id=r) is not null then raise exception 'Revoked output attached'; end if;
   begin
    perform lms_complete_agent_result('44444444-4444-4444-a444-000000000081',r,l,null,'Changed explanation',1000,1000);
    raise exception 'Changed result accepted';
   exception when serialization_failure then null; end;
  end if;
 end loop;
 if has_table_privilege('authenticated','lms_agent_results','SELECT') or has_function_privilege('authenticated','lms_complete_agent_result(uuid,uuid,uuid,jsonb,text,bigint,bigint)','EXECUTE') then raise exception 'Private results exposed'; end if;
end $$;
select 'PASS: atomic completion, repeat/conflict handling, cancellation/revocation retention, rollback and service-only access' as verification;
rollback;
