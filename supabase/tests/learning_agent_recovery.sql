begin;
insert into auth.users(id,email,raw_user_meta_data) values('44444444-4444-4444-a444-000000000091','recovery-owner@example.invalid','{}');
insert into organisations(id,name) values('55555555-5555-4555-a555-000000000091','Recovery verification');
update user_profiles set org_id='55555555-5555-4555-a555-000000000091',role='admin' where id='44444444-4444-4444-a444-000000000091';
do $$
declare task uuid; first_claim jsonb; second_claim jsonb; changed integer;
begin
 insert into lms_agent_runs(org_id,created_by,kind,goal) values('55555555-5555-4555-a555-000000000091','44444444-4444-4444-a444-000000000091','delivery','Verification only') returning id into task;
 if exists(select 1 from lms_agent_runs where id=task and dispatch_requested_at is not null) then raise exception 'Draft opted into background recovery'; end if;
 update lms_agent_runs set dispatch_requested_at=now() where id=task;
 first_claim:=lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091');
 if first_claim is null then raise exception 'Initial claim failed'; end if;
 if lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091') is not null then raise exception 'Duplicate worker acquired active lease'; end if;
 update lms_agent_runs set lease_until=now()-interval '1 minute' where id=task;
 second_claim:=lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091');
 if second_claim is null or second_claim->>'lease_token'=first_claim->>'lease_token' or (second_claim->>'attempts')::integer<>2 then raise exception 'Expired work was not recovered with a new lease'; end if;
 update lms_agent_runs set state='needs_review' where id=task and state='running' and lease_token=(first_claim->>'lease_token')::uuid;
 get diagnostics changed=row_count;
 if changed<>0 then raise exception 'Stale worker saved a proposal'; end if;
 update lms_agent_runs set state='cancelled',lease_token=null,lease_until=null where id=task;
 if lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091') is not null then raise exception 'Cancelled work restarted'; end if;
 update lms_agent_runs set state='queued',attempts=3 where id=task;
 if lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091') is not null then raise exception 'Recovery exceeded attempt limit'; end if;
 update lms_agent_runs set state='queued',attempts=0 where id=task;
 update organisation_memberships set status='revoked',revoked_at=now() where org_id='55555555-5555-4555-a555-000000000091' and user_id='44444444-4444-4444-a444-000000000091';
 begin perform lms_claim_agent_scoped('44444444-4444-4444-a444-000000000091',task,'55555555-5555-4555-a555-000000000091'); raise exception 'Revoked owner resumed work'; exception when insufficient_privilege then null; end;
end $$;
select 'PASS: explicit starts, duplicate-worker exclusion, crash recovery, stale proposal denial, cancellation, attempt cap and revoked owner' as verification;
rollback;
