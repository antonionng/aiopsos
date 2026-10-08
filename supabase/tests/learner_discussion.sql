begin;
do $$
declare provider uuid; learner uuid; programme uuid; other_programme uuid; post uuid:=gen_random_uuid(); result jsonb; n integer;
begin
 select p.id into provider from user_profiles p join organisations o on o.id=p.org_id where o.name='Verification only: provider' and p.name='Verification provider' limit 1;
 select a.user_id,a.programme_id into learner,programme from lms_assignments a join lms_programmes p on p.id=a.programme_id where p.created_by=provider limit 1;
 if learner is null then raise exception 'Synthetic verification fixture required'; end if;
 result:=lms_discussion(learner,programme,'Synthetic discussion check',null,post);
 result:=lms_discussion(learner,programme,'Synthetic discussion check',null,post);
 select count(*) into n from lms_discussion_posts where id=post;
 if n<>1 then raise exception 'Duplicate discussion post'; end if;
 perform lms_discussion(provider,programme);
 begin perform lms_discussion(learner,programme,'Changed content',null,post); raise exception 'Duplicate key accepted different text'; exception when sqlstate '22023' then null; end;
 insert into lms_programmes(org_id,title,goal,version_ids,created_by) select org_id,'Isolated discussion','Test only',version_ids,created_by from lms_programmes where id=programme returning id into other_programme;
 begin perform lms_discussion(learner,other_programme); raise exception 'Unassigned learner read another programme'; exception when sqlstate '42501' then null; end;
 begin perform lms_discussion(provider,other_programme,'Cross programme reply',post,gen_random_uuid()); raise exception 'Cross programme reply accepted'; exception when sqlstate '22023' then null; end;
 update lms_programmes set status='archived' where id=programme;
 perform lms_discussion(learner,programme);
 begin perform lms_discussion(learner,programme,'Archived post',null,gen_random_uuid()); raise exception 'Archived post accepted'; exception when sqlstate '22023' then null; end;
 if has_table_privilege('authenticated','public.lms_discussion_posts','SELECT') then raise exception 'Direct browser read allowed'; end if;
end; $$;
rollback;
