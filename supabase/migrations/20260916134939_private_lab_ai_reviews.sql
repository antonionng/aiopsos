create table public.lms_lab_ai_reviews (
 id uuid primary key default gen_random_uuid(),
 programme_id uuid not null references public.lms_programmes(id),
 assignment_id uuid not null references public.lms_assignments(id),
 activity_id uuid not null,
 progress_id uuid not null references public.lms_activity_progress(id),
 progress_revision integer not null,
 plan_revision integer not null,
 requested_by uuid not null references public.user_profiles(id),
 status text not null default 'queued' check(status in ('queued','running','draft','published','failed','stale')),
 attempts integer not null default 0 check(attempts between 0 and 3),
 claim_token uuid,
 insights jsonb,
 coverage jsonb not null default '[]',
 model text,
 input_tokens integer,
 output_tokens integer,
 error text,
 published_by uuid references public.user_profiles(id),
 published_at timestamptz,
 published_payload jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(progress_id,progress_revision)
);
create index lms_lab_ai_programme on public.lms_lab_ai_reviews(programme_id);
create index lms_lab_ai_assignment on public.lms_lab_ai_reviews(assignment_id);
create index lms_lab_ai_requester on public.lms_lab_ai_reviews(requested_by);
create index lms_lab_ai_publisher on public.lms_lab_ai_reviews(published_by);
create index lms_lab_ai_queue on public.lms_lab_ai_reviews(status,updated_at) where status in ('queued','running','failed');
alter table public.lms_lab_ai_reviews enable row level security;
revoke all on public.lms_lab_ai_reviews from public,anon,authenticated;
grant all on public.lms_lab_ai_reviews to service_role;

-- Queue atomically with a saved practical submission and its immutable file links.
do $$ declare definition text; begin
 definition:=pg_get_functiondef('public.lms_command(uuid,text,jsonb,uuid)'::regprocedure);
 if position('perform lms_delivery_complete(a.id);' in definition)=0 then raise exception 'Expected delivery wrapper not found'; end if;
 execute replace(definition,'perform lms_delivery_complete(a.id);', $patch$
 perform lms_delivery_complete(a.id);
 insert into lms_lab_ai_reviews(programme_id,assignment_id,activity_id,progress_id,progress_revision,plan_revision,requested_by)
 select a.programme_id,a.id,v.activity_id,v.id,v.revision,plan.revision,p_actor from lms_activity_progress v
 where v.assignment_id=a.id and v.activity_id=activity and v.state='submitted'
 on conflict(progress_id,progress_revision) do nothing;
 $patch$);
end $$;

create function public.lms_lab_ai_ensure(p_actor uuid,p_org uuid,p_programme uuid,p_progress uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r text; v lms_activity_progress%rowtype; a lms_assignments%rowtype; plan lms_delivery_plans%rowtype; result jsonb;
begin
 r:=lms_delivery_role(p_actor,p_org,p_programme);
 if r not in ('manager','trainer') then raise exception 'Private AI insights are for the assessment team' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_programme::text,9616));
 select * into v from lms_activity_progress where id=p_progress;
 select * into a from lms_assignments where id=v.assignment_id and programme_id=p_programme;
 select * into plan from lms_delivery_plans where programme_id=p_programme;
 if a.id is null or a.user_id=p_actor or v.state<>'submitted' or plan.released_at is null or not exists(select 1 from lms_programmes where id=p_programme and status='active') then raise exception 'Choose a current submitted practical activity' using errcode='42501'; end if;
 insert into lms_lab_ai_reviews(programme_id,assignment_id,activity_id,progress_id,progress_revision,plan_revision,requested_by)
 values(p_programme,a.id,v.activity_id,v.id,v.revision,plan.revision,p_actor) on conflict(progress_id,progress_revision) do nothing;
 select to_jsonb(d)-'claim_token' into result from lms_lab_ai_reviews d where d.progress_id=v.id and d.progress_revision=v.revision;
 return result;
end $$;

create function public.lms_lab_ai_claim(p_id uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare d lms_lab_ai_reviews%rowtype; v lms_activity_progress%rowtype; programme lms_programmes%rowtype; plan lms_delivery_plans%rowtype; attempt uuid;
begin
 select * into d from lms_lab_ai_reviews where id=p_id for update skip locked;
 if d.id is null or d.attempts>=3 or d.status in ('draft','published','stale') or (d.status='running' and d.updated_at>now()-interval '8 minutes') then return null; end if;
 select * into v from lms_activity_progress where id=d.progress_id;
 select * into programme from lms_programmes where id=d.programme_id;
 select * into plan from lms_delivery_plans where programme_id=d.programme_id;
 if v.state<>'submitted' or v.revision<>d.progress_revision or plan.revision<>d.plan_revision or programme.status<>'active' then update lms_lab_ai_reviews set status='stale',updated_at=now() where id=d.id;return null;end if;
 perform pg_advisory_xact_lock(hashtextextended(programme.org_id::text,9617));
 if (select coalesce(sum(j.attempts),0) from lms_lab_ai_reviews j join lms_programmes p on p.id=j.programme_id where p.org_id=programme.org_id and j.updated_at>now()-interval '1 day')>=200 then
  update lms_lab_ai_reviews set status='failed',error='Daily AI review limit reached. Assessment can continue manually.',updated_at=now() where id=d.id;return null;
 end if;
 update lms_lab_ai_reviews set status='running',attempts=attempts+1,claim_token=gen_random_uuid(),error=null,updated_at=now() where id=d.id returning * into d;
 select id into attempt from lms_attempt_history h where h.assignment_id=d.assignment_id and h.action='learning.submit' and h.snapshot->>'activity_id'=d.activity_id::text order by h.created_at desc,h.id desc limit 1;
 return jsonb_build_object('draft',to_jsonb(d),'provider_org_id',programme.org_id,'progress',to_jsonb(v),'criteria',(select x from jsonb_array_elements(plan.content->'activities') x where x->>'id'=d.activity_id::text),
 'activity',(select x from lms_course_versions cv cross join lateral jsonb_array_elements(cv.content->'activities') x where cv.id=any(programme.version_ids) and x->>'id'=d.activity_id::text limit 1),
 'files',coalesce((select jsonb_agg(f) from lms_delivery_files f where f.attempt_id=attempt),'[]'));
end $$;

create function public.lms_lab_ai_finish(p_id uuid,p_claim uuid,p_insights jsonb,p_coverage jsonb,p_model text,p_input integer,p_output integer,p_error text default null) returns boolean
language plpgsql security invoker set search_path=public,pg_temp as $$
declare d lms_lab_ai_reviews%rowtype; v lms_activity_progress%rowtype;
begin
 select * into d from lms_lab_ai_reviews where id=p_id;
 if d.id is null then return false;end if;
 perform pg_advisory_xact_lock(hashtextextended(d.programme_id::text,9616));
 select * into d from lms_lab_ai_reviews where id=p_id for update;
 if d.status<>'running' or d.claim_token is distinct from p_claim then return false;end if;
 select * into v from lms_activity_progress where id=d.progress_id;
 if v.state<>'submitted' or v.revision<>d.progress_revision then update lms_lab_ai_reviews set status='stale',updated_at=now() where id=d.id;return false;end if;
 update lms_lab_ai_reviews set status=case when p_error is null then 'draft' else 'failed' end,insights=p_insights,coverage=p_coverage,model=p_model,input_tokens=p_input,output_tokens=p_output,error=left(p_error,500),updated_at=now() where id=d.id;
 return true;
end $$;

create function public.lms_lab_ai_publish(p_actor uuid,p_org uuid,p_programme uuid,p_payload jsonb,p_request uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r text; d lms_lab_ai_reviews%rowtype; result jsonb;
begin
 r:=lms_delivery_role(p_actor,p_org,p_programme);
 if r not in ('manager','trainer') then raise exception 'Only the assessment team can publish feedback' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_programme::text,9616));
 select * into d from lms_lab_ai_reviews where id=(p_payload->>'ai_review_id')::uuid and programme_id=p_programme for update;
 if d.id is null or d.progress_id<>(p_payload->>'progress_id')::uuid or d.progress_revision<>(p_payload->>'revision')::integer then raise exception 'This AI review belongs to a different submission' using errcode='PT409'; end if;
 if d.status='published' and d.published_by=p_actor and d.published_payload=p_payload then return jsonb_build_object('published',true);end if;
 if d.status<>'draft' then raise exception 'This private draft is no longer available to publish' using errcode='PT409';end if;
 if p_payload->>'decision' not in ('passed','returned') then raise exception 'Choose a final trainer assessment';end if;
 result:=lms_delivery_command(p_actor,p_org,p_programme,'review',p_payload-'ai_review_id',p_request);
 update lms_lab_ai_reviews set status='published',published_by=p_actor,published_at=now(),published_payload=p_payload,updated_at=now() where id=d.id;
 return result||jsonb_build_object('published',true);
end $$;
do $$ declare f record; begin
 for f in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and proname like 'lms_lab_ai_%' loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  execute format('grant execute on function %s to service_role',f.signature);
 end loop;
end $$;
