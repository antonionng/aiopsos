begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('44444444-4444-4444-a444-000000000001','lifecycle-admin@example.invalid','{}'),
 ('44444444-4444-4444-a444-000000000002','lifecycle-learner@example.invalid','{}'),
 ('44444444-4444-4444-a444-000000000003','lifecycle-manager@example.invalid','{}');
insert into organisations(id,name) values ('55555555-5555-4555-a555-000000000001','Lifecycle test'),('55555555-5555-4555-a555-000000000002','Foreign lifecycle test');
update user_profiles set org_id='55555555-5555-4555-a555-000000000001',role=case when id='44444444-4444-4444-a444-000000000001' then 'admin' when id='44444444-4444-4444-a444-000000000003' then 'manager' else 'user' end where id in ('44444444-4444-4444-a444-000000000001','44444444-4444-4444-a444-000000000002','44444444-4444-4444-a444-000000000003');
update organisations set owner_id='44444444-4444-4444-a444-000000000001' where id='55555555-5555-4555-a555-000000000001';
insert into departments(id,org_id,name,type) values('66666666-6666-4666-a666-000000000001','55555555-5555-4555-a555-000000000002','Foreign','hr');
do $$ begin
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000003','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002','update','{"role":"admin"}'); raise exception 'Manager elevated learner'; exception when insufficient_privilege then null; end;
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002','update','{"plan_override":"enterprise"}'); raise exception 'Admin changed billing entitlement'; exception when insufficient_privilege then null; end;
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002','update','{"department_id":"66666666-6666-4666-a666-000000000001"}'); raise exception 'Foreign department assigned'; exception when insufficient_privilege then null; end;
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000001','remove'); raise exception 'Self removal allowed'; exception when insufficient_privilege then null; end;
end $$;

select reserve_team_invitation('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','reservation-only@example.invalid','user','99999999-9999-4999-a999-000000000001');
do $$ begin
 begin perform reserve_team_invitation('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','reservation-only@example.invalid','user','99999999-9999-4999-a999-000000000002'); raise exception 'Concurrent invitation not blocked'; exception when serialization_failure then null; end;
 begin perform reserve_team_invitation('44444444-4444-4444-a444-000000000003','55555555-5555-4555-a555-000000000001','manager-elevation@example.invalid','admin','99999999-9999-4999-a999-000000000003'); raise exception 'Manager reserved elevated invite'; exception when insufficient_privilege then null; end;
end $$;
select workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000003','update','{"role":"admin"}');
do $$ begin
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000003','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000001','remove'); raise exception 'Owner removed'; exception when insufficient_privilege then null; end;
end $$;
update organisation_memberships set status='revoked',revoked_at=now() where user_id='44444444-4444-4444-a444-000000000002';
do $$ begin
 begin perform workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002','update','{"role":"manager"}'); raise exception 'Revoked member reactivated by role edit'; exception when insufficient_privilege then null; end;
end $$;
update organisation_memberships set status='active',revoked_at=null where user_id='44444444-4444-4444-a444-000000000002';
insert into cohorts(id,course_id,org_id,title,delivery_mode) select '77777777-7777-4777-a777-000000000001',id,'55555555-5555-4555-a555-000000000001','Lifecycle evidence fixture','virtual' from courses limit 1;
insert into enrolments(id,cohort_id,user_id,org_id,status) values('88888888-8888-4888-a888-000000000001','77777777-7777-4777-a777-000000000001','44444444-4444-4444-a444-000000000002','55555555-5555-4555-a555-000000000001','enrolled');
insert into grades(enrolment_id,score,max_score) values('88888888-8888-4888-a888-000000000001',80,100);
select workspace_member_change('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002','remove');
do $$ begin
 if not exists(select 1 from auth.users where id='44444444-4444-4444-a444-000000000002') then raise exception 'Login deleted'; end if;
 if not exists(select 1 from user_profiles where id='44444444-4444-4444-a444-000000000002' and org_id is null) then raise exception 'Workspace not detached'; end if;
 if not exists(select 1 from organisation_memberships where user_id='44444444-4444-4444-a444-000000000002' and status='revoked') then raise exception 'Membership not revoked'; end if;
 if not exists(select 1 from grades where enrolment_id='88888888-8888-4888-a888-000000000001' and score=80) then raise exception 'Learning record lost'; end if;
 if not exists(select 1 from audit_logs where org_id='55555555-5555-4555-a555-000000000001' and action='workspace.member_removed' and user_id='44444444-4444-4444-a444-000000000001') then raise exception 'Attribution missing'; end if;
end $$;
do $$ begin
 begin perform workspace_owner_transfer('44444444-4444-4444-a444-000000000003','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000003'); raise exception 'Non-owner transferred ownership'; exception when insufficient_privilege then null; end;
 begin perform workspace_owner_transfer('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000002'); raise exception 'Removed learner made owner'; exception when insufficient_privilege then null; end;
 perform workspace_owner_transfer('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000003');
 if not exists(select 1 from organisations where id='55555555-5555-4555-a555-000000000001' and owner_id='44444444-4444-4444-a444-000000000003') then raise exception 'Owner not transferred'; end if;
 if not exists(select 1 from organisation_memberships where org_id='55555555-5555-4555-a555-000000000001' and user_id='44444444-4444-4444-a444-000000000001' and status='active' and role='admin') then raise exception 'Previous owner lost administrator access'; end if;
 if not exists(select 1 from audit_logs where org_id='55555555-5555-4555-a555-000000000001' and user_id='44444444-4444-4444-a444-000000000001' and action='workspace.owner_transferred') then raise exception 'Ownership audit missing'; end if;
 begin perform workspace_owner_transfer('44444444-4444-4444-a444-000000000001','55555555-5555-4555-a555-000000000001','44444444-4444-4444-a444-000000000001'); raise exception 'Previous owner reclaimed ownership'; exception when insufficient_privilege then null; end;
end $$;
select 'PASS: protected ownership handover, denied elevation and foreign departments, invitation reservations, no role-edit reactivation, preserved login and grades, attributed audit' as verification;
rollback;
