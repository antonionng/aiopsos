begin;
do $$
declare
 owner_id uuid := '8fb8f911-3ace-4203-84b2-7d4d258378cd';
 source_id uuid := '71cad4d4-9b42-4bb4-bec4-3a94bc5b6a48';
 test_id uuid; other_id uuid; post_id uuid := gen_random_uuid(); reply_id uuid := gen_random_uuid(); result jsonb;
begin
 insert into cohorts(course_id,org_id,title,delivery_mode) select course_id,(select org_id from user_profiles where id=owner_id),'Verification wall rollback','virtual' from cohorts where id=source_id returning id into test_id;
 if test_id is null then raise exception 'Missing test source'; end if;
 insert into cohorts(course_id,org_id,title,delivery_mode) select course_id,(select org_id from user_profiles where id=owner_id),'Verification second wall rollback','virtual' from cohorts where id=source_id returning id into other_id;
 perform cohort_wall(owner_id,test_id,'Wall test',null,post_id);
 result := cohort_wall(owner_id,test_id,'Wall test',null,post_id);
 if jsonb_array_length(result->'posts')<>1 then raise exception 'Duplicate post'; end if;
 perform cohort_wall(owner_id,test_id,'Reply test',post_id,reply_id);
 begin
  perform cohort_wall(owner_id,other_id,'Wrong wall',post_id,gen_random_uuid());
  raise exception 'Cross-wall reply allowed';
 exception when sqlstate '22023' then null; end;
 begin
  perform cohort_wall(owner_id,test_id,'Changed payload',null,post_id);
  raise exception 'Changed replay allowed';
 exception when sqlstate '22023' then null; end;
 begin
  perform cohort_wall(gen_random_uuid(),test_id);
  raise exception 'Unknown actor allowed';
 exception when sqlstate '42501' then null; end;
 update cohorts set status='cancelled' where id=test_id;
 result := cohort_wall(owner_id,test_id);
 if (result->>'read_only')::boolean is not true then raise exception 'Cancelled wall writable'; end if;
 begin
  perform cohort_wall(owner_id,test_id,'After cancellation',null,gen_random_uuid());
  raise exception 'Cancelled post allowed';
 exception when sqlstate '22023' then null; end;
 update user_profiles set org_id=null, role='manager' where id=owner_id;
 begin
  perform cohort_wall(owner_id,test_id);
  raise exception 'Unrelated org-less actor allowed';
 exception when sqlstate '42501' then null; end;
 if has_table_privilege('authenticated','cohort_wall_posts','SELECT') or has_function_privilege('authenticated','cohort_wall(uuid,uuid,text,uuid,uuid)','EXECUTE') then raise exception 'Direct browser privileges exposed'; end if;
end $$;
rollback;
