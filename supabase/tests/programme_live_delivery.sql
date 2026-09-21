begin;
do $$
declare owner_id uuid := '8fb8f911-3ace-4203-84b2-7d4d258378cd'; fixture_programme uuid := '0ff051a1-396e-405b-9ec6-94620c3e4b94'; fixture_cohort uuid; learner uuid; result jsonb; first_count int;
begin
 insert into cohorts(course_id,org_id,title,delivery_mode,seat_limit) select course_id,org_id,'Verification connected delivery rollback','virtual',0 from cohorts where id='71cad4d4-9b42-4bb4-bec4-3a94bc5b6a48' returning id into fixture_cohort;
 if fixture_cohort is null then raise exception 'Missing verification source'; end if;
 result := lms_live_delivery(owner_id,fixture_programme,fixture_cohort,'link');
 if (result->>'changed')::int<>1 then raise exception 'Link was not created'; end if;
 result := lms_live_delivery(owner_id,fixture_programme,fixture_cohort,'link');
 if (result->>'changed')::int<>0 then raise exception 'Duplicate link'; end if;
 begin perform lms_live_delivery(owner_id,fixture_programme,fixture_cohort,'enrol'); raise exception 'Capacity bypassed'; exception when sqlstate '22023' then null; end;
 update cohorts set seat_limit=100 where id=fixture_cohort;
 result := lms_live_delivery(owner_id,fixture_programme,fixture_cohort,'enrol'); first_count:=(result->>'changed')::int;
 if first_count<1 then raise exception 'No learners enrolled'; end if;
 result := lms_live_delivery(owner_id,fixture_programme,fixture_cohort,'enrol');
 if (result->>'changed')::int<>0 then raise exception 'Duplicate enrolments'; end if;
 select a.user_id into learner from lms_assignments a join user_profiles u on u.id=a.user_id where a.programme_id=fixture_programme and u.role='user' limit 1;
 if learner is null then raise exception 'Learner fixture unavailable'; end if;
 result := lms_live_delivery(learner,fixture_programme);
 if result->>'assignment_id' is null or (result->>'can_manage')::boolean then raise exception 'Invalid learner access'; end if;
 begin perform lms_live_delivery(learner,fixture_programme,fixture_cohort,'enrol'); raise exception 'Learner management allowed'; exception when sqlstate '42501' then null; end;
 begin perform lms_live_delivery(gen_random_uuid(),fixture_programme); raise exception 'Unknown actor allowed'; exception when sqlstate '42501' then null; end;
 begin perform lms_live_delivery(owner_id,'c81af998-c64a-401c-a40a-585e7701f8ba',fixture_cohort,'link'); raise exception 'Cohort relink allowed'; exception when sqlstate '22023' then null; end;
 if has_function_privilege('authenticated','lms_live_delivery(uuid,uuid,uuid,text)','EXECUTE') then raise exception 'Public RPC exposed'; end if;
end $$;
rollback;
