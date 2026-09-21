-- Transactional verification: every synthetic account and change is rolled back.
begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('11111111-1111-4111-a111-000000000001','membership-one@example.invalid','{}'),
 ('11111111-1111-4111-a111-000000000002','membership-two@example.invalid','{}'),
 ('11111111-1111-4111-a111-000000000003','membership-operator@example.invalid','{}');
insert into public.organisations(id,name) values
 ('22222222-2222-4222-a222-000000000001','Membership verification A'),
 ('22222222-2222-4222-a222-000000000002','Membership verification B');
update public.user_profiles set org_id='22222222-2222-4222-a222-000000000001',role='user' where id='11111111-1111-4111-a111-000000000001';
update public.user_profiles set org_id='22222222-2222-4222-a222-000000000002',role='admin' where id='11111111-1111-4111-a111-000000000002';
update public.user_profiles set org_id='22222222-2222-4222-a222-000000000001',role='super_admin' where id='11111111-1111-4111-a111-000000000003';
insert into public.organisation_memberships(user_id,org_id,role,source) values
 ('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000002','trainer','direct');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-000000000001',true);
do $$ begin
 if (select count(*) from public.list_workspace_memberships()) <> 2 then raise exception 'Expected two own memberships'; end if;
 if not exists(select 1 from public.list_workspace_memberships() where role='learner') then raise exception 'Learner role missing'; end if;
 if not exists(select 1 from public.list_workspace_memberships() where role='trainer') then raise exception 'Trainer role missing'; end if;
 if exists(select 1 from public.organisation_memberships where user_id <> auth.uid()) then raise exception 'Peer membership leaked'; end if;
 begin
  update public.organisation_memberships set role='owner' where user_id=auth.uid();
  raise exception 'Unexpected write permission';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.organisation_memberships(user_id,org_id,role,source) values(auth.uid(),'22222222-2222-4222-a222-000000000001','owner','direct');
  raise exception 'Unexpected insert permission';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.organisation_memberships where user_id=auth.uid();
  raise exception 'Unexpected delete permission';
 exception when insufficient_privilege then null; end;
 begin
  perform * from public.organisation_membership_events;
  raise exception 'Audit leaked';
 exception when insufficient_privilege then null; end;
 begin
  perform public.sync_legacy_memberships(auth.uid());
  raise exception 'Unexpected sync permission';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-000000000003',true);
do $$ begin
 if exists(select 1 from public.list_workspace_memberships()) then raise exception 'Operator selection became membership'; end if;
end $$;
reset role;
-- Revocation is rechecked using the same JWT, not cached claims.
update public.organisation_memberships set status='revoked',revoked_at=now()
 where user_id='11111111-1111-4111-a111-000000000001' and org_id='22222222-2222-4222-a222-000000000002';
update public.user_profiles set role='manager' where id='11111111-1111-4111-a111-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-000000000001',true);
do $$ begin
 if (select count(*) from public.list_workspace_memberships()) <> 1 then raise exception 'Revoked member still active'; end if;
 if not exists(select 1 from public.list_workspace_memberships() where role='manager') then raise exception 'Role not synchronised'; end if;
end $$;
reset role;
-- Learning commands must use captured context and recheck membership.
select public.lms_command_scoped('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000001','overview');
do $$ begin
 begin
  perform public.lms_command_scoped('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000002','overview');
  raise exception 'Wrong workspace accepted';
 exception when insufficient_privilege then null; end;
end $$;
insert into public.lms_agent_runs(id,org_id,created_by,kind,goal) values
 ('33333333-3333-4333-a333-000000000001','22222222-2222-4222-a222-000000000001','11111111-1111-4111-a111-000000000001','course','Synthetic permission check');
update public.organisation_memberships set status='revoked',revoked_at=now()
 where user_id='11111111-1111-4111-a111-000000000001' and org_id='22222222-2222-4222-a222-000000000001';
do $$ begin
 begin
  perform public.lms_command('11111111-1111-4111-a111-000000000001','overview');
  raise exception 'Legacy command bypassed revocation';
 exception when insufficient_privilege then null; end;
 begin
  perform public.lms_claim_agent_scoped('11111111-1111-4111-a111-000000000001','33333333-3333-4333-a333-000000000001','22222222-2222-4222-a222-000000000001');
  raise exception 'Revoked task claimed';
 exception when insufficient_privilege then null; end;
 begin
  perform public.lms_claim_agent('33333333-3333-4333-a333-000000000001','22222222-2222-4222-a222-000000000001');
  raise exception 'Legacy claim bypassed revocation';
 exception when insufficient_privilege then null; end;
end $$;
update public.organisation_memberships set status='active',revoked_at=null
 where user_id='11111111-1111-4111-a111-000000000001' and org_id='22222222-2222-4222-a222-000000000001';
select public.lms_claim_agent_scoped('11111111-1111-4111-a111-000000000001','33333333-3333-4333-a333-000000000001','22222222-2222-4222-a222-000000000001');
update public.organisation_memberships set status='suspended'
 where user_id='11111111-1111-4111-a111-000000000001' and org_id='22222222-2222-4222-a222-000000000001';
do $$ begin
 begin
  update public.lms_agent_runs set state='needs_review',proposal='{}' where id='33333333-3333-4333-a333-000000000001';
  raise exception 'Suspended owner saved proposal';
 exception when insufficient_privilege then null; end;
 if (select state from public.lms_agent_runs where id='33333333-3333-4333-a333-000000000001') <> 'running' then raise exception 'Failed proposal changed state'; end if;
end $$;
update public.lms_agent_runs set state='failed' where id='33333333-3333-4333-a333-000000000001';
-- Moving a legacy profile revokes the old membership without restoring a
-- separately managed membership that was explicitly revoked.
update public.user_profiles set org_id='22222222-2222-4222-a222-000000000002' where id='11111111-1111-4111-a111-000000000001';
do $$ begin
 if exists(select 1 from public.organisation_memberships where user_id='11111111-1111-4111-a111-000000000001' and status='active') then raise exception 'Legacy move retained or restored access'; end if;
 if (select count(*) from public.organisation_membership_events where user_id='11111111-1111-4111-a111-000000000001') < 5 then raise exception 'Audit events missing'; end if;
end $$;
-- Proven organisation ownership is distinct from platform role.
update public.organisations set owner_id='11111111-1111-4111-a111-000000000003' where id='22222222-2222-4222-a222-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-000000000003',true);
do $$ begin
 if (select count(*) from public.list_workspace_memberships()) <> 1 then raise exception 'Owner membership missing'; end if;
 if not exists(select 1 from public.list_workspace_memberships() where role='owner') then raise exception 'Owner role missing'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin
  perform * from public.list_workspace_memberships();
  raise exception 'Anonymous list access';
 exception when insufficient_privilege then null; end;
 begin
  perform * from public.organisation_memberships;
  raise exception 'Anonymous table access';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: independent roles, own-row RLS, write denial, operator isolation, revocation, legacy sync, owner sync, audit, scoped commands, revoked claims, blocked proposal persistence and anonymous denial' as verification;
rollback;
