-- Programme-level preparation, delegated delivery and evidence. Existing records
-- remain authoritative. New functions are service-only, never browser RPCs.
create table public.lms_delivery_plans (
 programme_id uuid primary key references public.lms_programmes(id), content jsonb not null,
 revision integer not null default 1, provider_approved_by uuid references public.user_profiles(id),
 client_approved_by uuid references public.user_profiles(id), released_at timestamptz,
 updated_by uuid not null references public.user_profiles(id), updated_at timestamptz not null default now()
);
create table public.lms_delivery_staff (
 programme_id uuid references public.lms_programmes(id), user_id uuid references public.user_profiles(id),
 role text not null check(role in ('trainer','reviewer')), state text not null default 'pending' check(state in ('pending','accepted','revoked')),
 invited_by uuid not null references public.user_profiles(id), accepted_at timestamptz,
 primary key(programme_id,user_id)
);
create index lms_delivery_staff_user on public.lms_delivery_staff(user_id);
create table public.lms_delivery_reviews (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.lms_assignments(id),
 activity_id uuid not null, revision integer not null, reviewer_id uuid not null references public.user_profiles(id),
 scores jsonb not null, feedback text not null, kind text not null check(kind in ('panel','passed','returned')),
 created_at timestamptz not null default now(), unique(assignment_id,activity_id,revision,reviewer_id)
);
create table public.lms_delivery_decisions (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.lms_assignments(id),
 kind text not null check(kind in ('pathway_a','pathway_b','ready','support')), reason text not null,
 actor_id uuid not null references public.user_profiles(id), created_at timestamptz not null default now(), evidence jsonb not null
);
create index lms_delivery_decisions_assignment on public.lms_delivery_decisions(assignment_id,created_at);
create table public.lms_delivery_files (
 id uuid primary key, assignment_id uuid not null references public.lms_assignments(id), activity_id uuid not null,
 uploaded_by uuid not null references public.user_profiles(id), name text not null, bytes integer not null check(bytes between 1 and 4000000),
 sha256 text not null, object_path text not null unique, attempt_id uuid references public.lms_attempt_history(id),
 created_at timestamptz not null default now()
);
create index lms_delivery_files_assignment on public.lms_delivery_files(assignment_id,activity_id);
create table public.lms_lifecycle_events (
 id uuid primary key default gen_random_uuid(), programme_id uuid not null references public.lms_programmes(id),
 actor_id uuid not null references public.user_profiles(id), action text not null, request_id uuid not null,
 payload_hash text not null, result jsonb not null, created_at timestamptz not null default now(), unique(actor_id,request_id)
);
create index lms_lifecycle_events_programme on public.lms_lifecycle_events(programme_id,created_at);
do $$ declare t text; begin
 foreach t in array array['lms_delivery_plans','lms_delivery_staff','lms_delivery_reviews','lms_delivery_decisions','lms_delivery_files','lms_lifecycle_events'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant all on public.%I to service_role',t);
 end loop;
end $$;
insert into storage.buckets(id,name,public,file_size_limit) values('learning-evidence','learning-evidence',false,4000000) on conflict(id) do nothing;

create function public.lms_delivery_role(p_actor uuid,p_org uuid,p_programme uuid) returns text
language plpgsql security invoker set search_path=public,pg_temp as $$
declare p lms_programmes%rowtype; r text; own_role text;
begin
 perform lms_assert_workspace(p_actor,p_org,false);
 select * into p from lms_programmes where id=p_programme for share;
 if p.id is null then raise exception 'Programme unavailable' using errcode='42501'; end if;
 select role into own_role from user_profiles where id=p_actor;
 if own_role in ('admin','manager','super_admin') and p.org_id=p_org then return 'manager'; end if;
 if own_role in ('admin','manager','super_admin') and p.client_org_id=p_org then return 'client'; end if;
 select role into r from lms_delivery_staff where programme_id=p.id and user_id=p_actor and state='accepted' for share;
 if r is not null then return r; end if;
 if exists(select 1 from lms_assignments where programme_id=p.id and user_id=p_actor and org_id=p_org) then return 'learner'; end if;
 raise exception 'You do not have access to this programme' using errcode='42501';
end $$;

create function public.lms_delivery_path(p_assignment uuid) returns text
language sql stable security invoker set search_path=public,pg_temp as $$
 select kind from lms_delivery_decisions where assignment_id=p_assignment and kind in ('pathway_a','pathway_b') order by created_at desc,id desc limit 1
$$;

create function public.lms_delivery_activity_open(p_assignment uuid,p_activity uuid) returns boolean
language plpgsql stable security invoker set search_path=public,pg_temp as $$
declare plan lms_delivery_plans%rowtype; a jsonb; path text;
begin
 select d.* into plan from lms_delivery_plans d join lms_assignments s on s.programme_id=d.programme_id where s.id=p_assignment;
 if plan.programme_id is null then return true; end if;
 if plan.released_at is null then return false; end if;
 select x into a from jsonb_array_elements(plan.content->'activities') x where x->>'id'=p_activity::text;
 if a is null then return false; end if;
 if a->>'stage' in ('baseline','core') then return true; end if;
 path:=lms_delivery_path(p_assignment);
 if a->>'stage' in ('pathway_a','pathway_b') then return path=a->>'stage'; end if;
 if a->>'stage'='capstone' then
  if path is null and exists(select 1 from jsonb_array_elements(plan.content->'activities') x where x->>'stage' in ('pathway_a','pathway_b')) then return false; end if;
  return not exists(select 1 from jsonb_array_elements(plan.content->'activities') x where x->>'stage' in ('core',path)
   and not exists(select 1 from lms_activity_progress r where r.assignment_id=p_assignment and r.activity_id=(x->>'id')::uuid and r.state='passed'));
 end if;
 return false;
end $$;

create function public.lms_delivery_complete(p_assignment uuid) returns void
language plpgsql security invoker set search_path=public,pg_temp as $$
declare plan lms_delivery_plans%rowtype; path text; complete boolean;
begin
 select d.* into plan from lms_delivery_plans d join lms_assignments a on a.programme_id=d.programme_id where a.id=p_assignment;
 if plan.programme_id is null then return; end if;
 path:=lms_delivery_path(p_assignment);
 complete:=plan.released_at is not null and
  (path is not null or not exists(select 1 from jsonb_array_elements(plan.content->'activities') x where x->>'stage' in ('pathway_a','pathway_b'))) and
  not exists(select 1 from jsonb_array_elements(plan.content->'activities') x where (x->>'stage' in ('baseline','core','capstone',path))
   and not exists(select 1 from lms_activity_progress r where r.assignment_id=p_assignment and r.activity_id=(x->>'id')::uuid and
    (r.state='passed' or (x->>'stage'='baseline' and r.state='returned'))));
 update lms_assignments set completed_at=case when complete then coalesce(completed_at,now()) else null end where id=p_assignment;
end $$;

create function public.lms_delivery_command(p_actor uuid,p_org uuid,p_programme uuid,p_action text,p_payload jsonb default '{}',p_request uuid default gen_random_uuid()) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r text; p lms_programmes%rowtype; plan lms_delivery_plans%rowtype; a lms_assignments%rowtype;
 progress lms_activity_progress%rowtype; conf jsonb; activity jsonb; criteria jsonb; item jsonb; result jsonb;
 target uuid; attempt uuid; score numeric; count_scores int; n int; saved lms_lifecycle_events%rowtype;
begin
 perform lms_assert_workspace(p_actor,p_org,false);
 if p_action='list' then
  return coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'title',q.title,'status',q.status,'invitation',s.state))
   from lms_programmes q left join lms_delivery_staff s on s.programme_id=q.id and s.user_id=p_actor and s.state<>'revoked'
   where s.user_id is not null or exists(select 1 from lms_assignments x where x.programme_id=q.id and x.user_id=p_actor and x.org_id=p_org)
   or (exists(select 1 from user_profiles u where u.id=p_actor and u.role in ('admin','manager','super_admin')) and p_org in (q.org_id,q.client_org_id))), '[]');
 end if;
 -- One lock order for every delivery write, including legacy learning commands.
 perform pg_advisory_xact_lock(hashtextextended(p_programme::text,9616));
 if p_action='staff.accept' then
  update lms_delivery_staff set state='accepted',accepted_at=now() where programme_id=p_programme and user_id=p_actor and state='pending';
  if not found then raise exception 'No pending invitation' using errcode='42501'; end if;
 end if;
 r:=lms_delivery_role(p_actor,p_org,p_programme);
 select * into p from lms_programmes where id=p_programme;
 select * into plan from lms_delivery_plans where programme_id=p_programme;
 if p_action='live.get' then
  return jsonb_build_object('groups',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'title',c.title,'status',c.status,
   'sessions',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'title',s.title,'starts_at',s.starts_at,'ends_at',s.ends_at,
    'join_url',case when r in ('manager','trainer') or exists(select 1 from enrolments e where e.cohort_id=c.id and e.user_id=p_actor and e.org_id=p_org and e.status in ('enrolled','completed','failed')) then s.join_url else null end,
    'register',coalesce((select jsonb_agg(jsonb_build_object('enrolment_id',e.id,'assignment_id',a.id,'name',u.name,'status',att.status,'recorded_at',att.recorded_at)) from enrolments e join user_profiles u on u.id=e.user_id
     join lms_assignments a on a.user_id=e.user_id and a.org_id=e.org_id and a.programme_id=p.id
     left join attendance att on att.enrolment_id=e.id and att.session_id=s.id
     where e.cohort_id=c.id and e.status<>'withdrawn' and (r in ('manager','trainer','client') or (r='learner' and e.user_id=p_actor))),'[]')) order by s.starts_at) from sessions s where s.cohort_id=c.id),'[]')))
   from lms_programme_cohorts pc join cohorts c on c.id=pc.cohort_id where pc.programme_id=p.id),'[]'));
 end if;
 if p_action='get' then
  return jsonb_build_object('programme',to_jsonb(p),'role',r,
   'plan',case when r<>'learner' or plan.released_at is not null then to_jsonb(plan) else null end,
   'activities',coalesce((select jsonb_agg((case when r='learner' then x-'correctOption'-'content'-'materials'-'options' else x-'correctOption' end)||jsonb_build_object('course_title',v.content->>'title')) from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') x where v.id=any(p.version_ids) and (r<>'learner' or plan.released_at is not null or plan.programme_id is null)),'[]'),
   'staff',case when r='manager' then coalesce((select jsonb_agg(jsonb_build_object('user_id',s.user_id,'name',u.name,'role',s.role,'state',s.state)) from lms_delivery_staff s join user_profiles u on u.id=s.user_id where s.programme_id=p.id),'[]') else '[]'::jsonb end,
   'records',coalesce((select jsonb_agg(jsonb_build_object('id',x.id,'user_id',x.user_id,'name',u.name,'completed_at',x.completed_at,
    'progress',coalesce((select jsonb_agg(v order by v.updated_at) from lms_activity_progress v where v.assignment_id=x.id),'[]'),
    'history',coalesce((select jsonb_agg(h order by h.created_at,h.id) from lms_attempt_history h where h.assignment_id=x.id),'[]'),
    'files',coalesce((select jsonb_agg(to_jsonb(f)-'object_path'-'uploaded_by' order by f.created_at) from lms_delivery_files f where f.assignment_id=x.id and (f.attempt_id is not null or x.user_id=p_actor)),'[]'),
    'reviews',case when r='learner' then '[]'::jsonb else coalesce((select jsonb_agg(v order by v.created_at,v.id) from lms_delivery_reviews v where v.assignment_id=x.id),'[]') end,
    'decisions',coalesce((select jsonb_agg(d order by d.created_at,d.id) from lms_delivery_decisions d where d.assignment_id=x.id),'[]')) order by u.name,x.id)
    from lms_assignments x join user_profiles u on u.id=x.user_id where x.programme_id=p.id and (r<>'learner' or (x.user_id=p_actor and x.org_id=p_org))),'[]'));
 end if;
 if p_action='staff.accept' then return jsonb_build_object('accepted',true); end if;
 if p.status<>'active' and p_action<>'file.read' then raise exception 'This programme is archived' using errcode='22023'; end if;
 select * into saved from lms_lifecycle_events where actor_id=p_actor and request_id=p_request;
 if saved.id is not null then
  if saved.programme_id<>p.id or saved.action<>p_action or saved.payload_hash<>md5(p_payload::text) then raise exception 'Request identifier already used' using errcode='22023'; end if;
  return saved.result;
 end if;
 if p_action='plan.save' then
  if r not in ('manager','trainer') then raise exception 'Only the programme team can prepare a plan' using errcode='42501'; end if;
  if coalesce(plan.revision,0)<>(p_payload->>'revision')::int then raise exception 'The plan changed. Reload before saving.' using errcode='40001'; end if;
  if plan.released_at is not null then raise exception 'A released assessment plan is fixed. Create a new programme for a new plan.'; end if;
  if exists(select 1 from lms_activity_progress v join lms_assignments x on x.id=v.assignment_id where x.programme_id=p.id) then raise exception 'Prepare the plan before learners start'; end if;
  conf:=p_payload->'plan';
  if jsonb_typeof(conf->'activities') is distinct from 'array' or jsonb_array_length(conf->'activities')=0 then raise exception 'Map the programme activities'; end if;
  select count(*) into n from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') x where v.id=any(p.version_ids);
  if n<>jsonb_array_length(conf->'activities') or n<>(select count(distinct x->>'id') from jsonb_array_elements(conf->'activities') x) then raise exception 'Map each published activity exactly once'; end if;
  for item in select * from jsonb_array_elements(conf->'activities') loop
   select x into activity from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') x where v.id=any(p.version_ids) and x->>'id'=item->>'id';
   if activity is null or item->>'stage' not in ('baseline','core','pathway_a','pathway_b','capstone') then raise exception 'Invalid activity mapping'; end if;
   if activity->>'kind' in ('practice','observation') and jsonb_array_length(item->'criteria')=0 then raise exception 'Every practical activity needs scoring criteria'; end if;
   if activity->>'kind' not in ('practice','observation') and jsonb_array_length(item->'criteria')>0 then raise exception 'Use practical activities for scored skills'; end if;
  end loop;
  insert into lms_delivery_plans(programme_id,content,updated_by) values(p.id,conf,p_actor)
   on conflict(programme_id) do update set content=excluded.content,revision=lms_delivery_plans.revision+1,provider_approved_by=null,client_approved_by=null,updated_by=p_actor,updated_at=now();
  result:=jsonb_build_object('saved',true);
 elsif p_action in ('plan.approve','plan.release') then
  if r not in ('manager','client') then raise exception 'A provider or client manager must approve the plan' using errcode='42501'; end if;
  if plan.programme_id is null or plan.revision<>(p_payload->>'revision')::int then raise exception 'Reload the current plan before approval' using errcode='40001'; end if;
  if p_action='plan.approve' then
   update lms_delivery_plans set provider_approved_by=case when r='manager' then p_actor else provider_approved_by end,
    client_approved_by=case when r='client' then p_actor else client_approved_by end where programme_id=p.id;
  else
   if r<>'manager' or plan.provider_approved_by is null or (p.client_org_id is not null and plan.client_approved_by is null) then raise exception 'Provider and client approvals are required before release' using errcode='42501'; end if;
   update lms_delivery_plans set released_at=coalesce(released_at,now()) where programme_id=p.id;
  end if;
  result:=jsonb_build_object('saved',true);
 elsif p_action in ('staff.invite','staff.revoke') then
  if r<>'manager' then raise exception 'Only the provider manager can change the programme team' using errcode='42501'; end if;
  if p_action='staff.invite' then
   -- Verified login email, not editable profile metadata, binds the invitation.
   select u.id into target from auth.users u join user_profiles v on v.id=u.id where lower(u.email)=lower(p_payload->>'email') and u.email_confirmed_at is not null;
   if target is null then raise exception 'This person must first register and verify their Experrt account'; end if;
   if p_payload->>'role' not in ('trainer','reviewer') then raise exception 'Invalid programme role'; end if;
   if exists(select 1 from lms_assignments where programme_id=p.id and user_id=target) then raise exception 'A learner cannot assess their own programme'; end if;
   insert into lms_delivery_staff(programme_id,user_id,role,invited_by) values(p.id,target,p_payload->>'role',p_actor)
    on conflict(programme_id,user_id) do update set role=excluded.role,state='pending',accepted_at=null,invited_by=p_actor;
  else
   update lms_delivery_staff set state='revoked' where programme_id=p.id and user_id=(p_payload->>'user_id')::uuid;
  end if;
  result:=jsonb_build_object('saved',true);
 elsif p_action in ('session.create','attendance.save') then
  if r not in ('manager','trainer') then raise exception 'Only the delivery team can manage sessions and attendance' using errcode='42501'; end if;
  if p_action='session.create' then
   select c.id into target from cohorts c join lms_programme_cohorts pc on pc.cohort_id=c.id where pc.programme_id=p.id and c.id=(p_payload->>'cohort_id')::uuid and c.status in ('scheduled','running') for update of c;
   if target is null then raise exception 'Choose an active live group linked to this programme' using errcode='42501'; end if;
   insert into sessions(cohort_id,position,title,starts_at,ends_at,join_url) values(target,(select coalesce(max(position),0)+1 from sessions where cohort_id=target),p_payload->>'title',(p_payload->>'starts_at')::timestamptz,(p_payload->>'ends_at')::timestamptz,nullif(p_payload->>'join_url','')) returning id into target;
   result:=jsonb_build_object('id',target);
  else
   select e.id into target from enrolments e join sessions s on s.cohort_id=e.cohort_id join cohorts c on c.id=e.cohort_id join lms_programme_cohorts pc on pc.cohort_id=c.id
    join lms_assignments a on a.programme_id=pc.programme_id and a.user_id=e.user_id and a.org_id=e.org_id
    where pc.programme_id=p.id and s.id=(p_payload->>'session_id')::uuid and e.id=(p_payload->>'enrolment_id')::uuid and e.status<>'withdrawn' and c.status<>'cancelled' and s.starts_at<=now() for update of e;
   if target is null then raise exception 'Attendance is unavailable for this learner or future session' using errcode='42501'; end if;
   select to_jsonb(att) into item from attendance att where att.session_id=(p_payload->>'session_id')::uuid and att.enrolment_id=target for update;
   if (item->>'status') is distinct from (p_payload->>'expected_status') then raise exception 'The register changed. Reload before saving.' using errcode='40001'; end if;
   insert into attendance(session_id,enrolment_id,status,recorded_by) values((p_payload->>'session_id')::uuid,target,p_payload->>'status',p_actor)
    on conflict(session_id,enrolment_id) do update set status=excluded.status,recorded_by=p_actor,recorded_at=now();
   result:=jsonb_build_object('saved',true,'previous',item,'status',p_payload->>'status');
  end if;
 elsif p_action in ('review','decision','file.register','file.read') then
  if p_action='review' then
   select * into progress from lms_activity_progress where id=(p_payload->>'progress_id')::uuid for update;
   select * into a from lms_assignments where id=progress.assignment_id for update;
  elsif p_action='file.read' then
   select * into a from lms_assignments where id=(select assignment_id from lms_delivery_files where id=(p_payload->>'id')::uuid);
  else select * into a from lms_assignments where id=(p_payload->>'assignment_id')::uuid for update;
  end if;
  if a.id is null or a.programme_id<>p.id or (r='learner' and (a.user_id<>p_actor or a.org_id<>p_org)) then raise exception 'Learning record unavailable' using errcode='42501'; end if;
  if p_action='file.read' then
   select to_jsonb(f) into result from lms_delivery_files f where id=(p_payload->>'id')::uuid and (attempt_id is not null or uploaded_by=p_actor);
   if result is null then raise exception 'Evidence unavailable' using errcode='42501'; end if;
   return result;
  end if;
  if plan.released_at is null then raise exception 'Release the assessment plan first'; end if;
  if p_action='file.register' then
   if a.user_id<>p_actor or not lms_delivery_activity_open(a.id,(p_payload->>'activity_id')::uuid) then raise exception 'You can only upload to your own available activity' using errcode='42501'; end if;
   if exists(select 1 from lms_activity_progress where assignment_id=a.id and activity_id=(p_payload->>'activity_id')::uuid and state in ('passed','submitted')) then raise exception 'Wait for review before attaching another attempt'; end if;
   if (select count(*) from lms_delivery_files where assignment_id=a.id and activity_id=(p_payload->>'activity_id')::uuid and attempt_id is null)>=10 then raise exception 'A submission can contain at most ten files'; end if;
   insert into lms_delivery_files(id,assignment_id,activity_id,uploaded_by,name,bytes,sha256,object_path)
    values((p_payload->>'id')::uuid,a.id,(p_payload->>'activity_id')::uuid,p_actor,p_payload->>'name',(p_payload->>'bytes')::int,p_payload->>'sha256',p_payload->>'object_path');
   result:=jsonb_build_object('id',p_payload->>'id');
  elsif p_action='review' then
   if r not in ('manager','trainer','reviewer') or a.user_id=p_actor then raise exception 'An independent assessor is required' using errcode='42501'; end if;
   if progress.state<>'submitted' or progress.revision<>(p_payload->>'revision')::int then raise exception 'This submission changed. Reload before marking.' using errcode='40001'; end if;
   select x into conf from jsonb_array_elements(plan.content->'activities') x where x->>'id'=progress.activity_id::text;
   select x into activity from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') x where v.id=any(p.version_ids) and x->>'id'=progress.activity_id::text;
   if activity->>'kind' not in ('practice','observation') then raise exception 'Only practical work is manually assessed'; end if;
   if r='reviewer' and (conf->>'stage'<>'capstone' or p_payload->>'decision'<>'panel') then raise exception 'Panel reviewers can only review final projects' using errcode='42501'; end if;
   criteria:=conf->'criteria'; score:=0; count_scores:=0;
   if jsonb_typeof(p_payload->'scores') is distinct from 'object' then raise exception 'Score every criterion'; end if;
   for item in select * from jsonb_array_elements(criteria) loop
    if not (p_payload->'scores' ? (item->>'id')) then raise exception 'Score every criterion'; end if;
    if jsonb_typeof(p_payload->'scores'->(item->>'id'))<>'number' or (p_payload->'scores'->>(item->>'id'))::numeric not between 0 and 4 or mod((p_payload->'scores'->>(item->>'id'))::numeric,1)<>0 then raise exception 'Criterion scores must be whole numbers from zero to four'; end if;
    score:=score+(p_payload->'scores'->>(item->>'id'))::numeric; count_scores:=count_scores+1;
   end loop;
   if count_scores=0 or count_scores<>(select count(*) from jsonb_object_keys(p_payload->'scores')) then raise exception 'Use exactly the published criteria'; end if;
   score:=score/count_scores/4*100;
   if p_payload->>'decision'='passed' and conf->>'stage'<>'baseline' and score<(conf->>'passPercent')::numeric then raise exception 'The evidence does not meet the published pass threshold'; end if;
   if p_payload->>'decision'='passed' and conf->>'stage'='capstone' and
    (select count(distinct reviewer_id) from lms_delivery_reviews where assignment_id=a.id and activity_id=progress.activity_id and revision=progress.revision and kind='panel' and reviewer_id<>p_actor)<(plan.content->>'minimumPanelReviews')::int then raise exception 'Independent panel reviews are still required for this submission'; end if;
   if activity->>'kind'='observation' and p_payload->>'decision'<>'panel' and length(trim(coalesce(p_payload->>'observation_context','')))<10 then raise exception 'Describe the observed task and conditions'; end if;
   insert into lms_delivery_reviews(assignment_id,activity_id,revision,reviewer_id,scores,feedback,kind)
    values(a.id,progress.activity_id,progress.revision,p_actor,p_payload->'scores',p_payload->>'feedback',p_payload->>'decision');
   if p_payload->>'decision'<>'panel' then
    update lms_activity_progress set state=p_payload->>'decision',feedback=p_payload->>'feedback',reviewed_by=p_actor,
     observation_context=coalesce(p_payload->>'observation_context',''),revision=revision+1,updated_at=now() where id=progress.id;
    insert into lms_attempt_history(assignment_id,actor_id,action,snapshot)
     select a.id,p_actor,'learning.review',to_jsonb(v)||jsonb_build_object('scores',p_payload->'scores','percent',score,'plan_revision',plan.revision) from lms_activity_progress v where v.id=progress.id;
    perform lms_delivery_complete(a.id);
   end if;
   result:=jsonb_build_object('saved',true,'percent',score);
  else
   if r not in ('manager','trainer') or a.user_id=p_actor then raise exception 'The delivery team must record this decision' using errcode='42501'; end if;
   if length(trim(coalesce(p_payload->>'reason','')))<10 then raise exception 'Record the reason and evidence for this decision'; end if;
   if p_payload->>'kind' in ('pathway_a','pathway_b') then
    if not exists(select 1 from jsonb_array_elements(plan.content->'activities') x where x->>'stage'=p_payload->>'kind') then raise exception 'This pathway is not in the plan'; end if;
    if lms_delivery_path(a.id) is not null then raise exception 'A pathway decision is already recorded'; end if;
    if exists(select 1 from jsonb_array_elements(plan.content->'activities') x where x->>'stage' in ('baseline','core') and not exists(select 1 from lms_activity_progress v where v.assignment_id=a.id and v.activity_id=(x->>'id')::uuid and (v.state='passed' or (x->>'stage'='baseline' and v.state='returned')))) then raise exception 'Complete and assess the common work before pathway routing'; end if;
   elsif p_payload->>'kind'='ready' then
    if r<>'manager' then raise exception 'The programme manager signs off final readiness' using errcode='42501'; end if;
    if a.completed_at is null then raise exception 'Required coursework must be complete before readiness sign-off'; end if;
   elsif p_payload->>'kind'<>'support' then raise exception 'Invalid decision'; end if;
   insert into lms_delivery_decisions(assignment_id,kind,reason,actor_id,evidence) values(a.id,p_payload->>'kind',p_payload->>'reason',p_actor,
    jsonb_build_object('plan_revision',plan.revision,'progress',coalesce((select jsonb_agg(v) from lms_activity_progress v where v.assignment_id=a.id),'[]')));
   perform lms_delivery_complete(a.id);
   result:=jsonb_build_object('saved',true);
  end if;
 else raise exception 'Unknown delivery action';
 end if;
 insert into lms_lifecycle_events(programme_id,actor_id,action,request_id,payload_hash,result) values(p.id,p_actor,p_action,p_request,md5(p_payload::text),result);
 return result;
end $$;

-- All old entry points retain these checks. A direct old review cannot bypass
-- the approved rubric; legacy programmes without a plan behave as before.
alter function public.lms_command(uuid,text,jsonb,uuid) rename to lms_command_before_delivery;
create function public.lms_command(p_actor uuid,p_action text,p_payload jsonb default '{}',p_request uuid default gen_random_uuid()) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare result jsonb; a lms_assignments%rowtype; plan lms_delivery_plans%rowtype; activity uuid; attempt uuid; path text;
begin
 if p_action in ('learning.get','learning.submit','learning.review') then
  select * into a from lms_assignments where id=case when p_action='learning.review' then (select assignment_id from lms_activity_progress where id=(p_payload->>'id')::uuid) else (p_payload->>'id')::uuid end;
  if a.id is not null then
   perform pg_advisory_xact_lock(hashtextextended(a.programme_id::text,9616));
   select * into plan from lms_delivery_plans where programme_id=a.programme_id;
   if plan.programme_id is not null then
    if p_action='learning.review' then raise exception 'Use the programme assessment workspace to mark this work'; end if;
    if p_action='learning.submit' then
     activity:=(p_payload->>'activity_id')::uuid;
     if not coalesce(lms_delivery_activity_open(a.id,activity),false) then raise exception 'This activity is not available in your current stage' using errcode='42501'; end if;
     if exists(select 1 from jsonb_array_elements(plan.content->'activities') x join lms_activity_progress v on v.assignment_id=a.id and v.activity_id=activity where x->>'id'=activity::text and x->>'stage'='baseline' and v.reviewed_by is not null) then raise exception 'The entry assessment is recorded. Continue with your common learning.'; end if;
     if exists(select 1 from lms_activity_progress where assignment_id=a.id and activity_id=activity and state='submitted') then raise exception 'This attempt is awaiting review'; end if;
    end if;
   end if;
  end if;
 end if;
 result:=lms_command_before_delivery(p_actor,p_action,p_payload,p_request);
 if plan.programme_id is not null then
  if p_action='learning.get' then
   -- Hide the other pathway and locked stages, including their materials.
   result:=jsonb_set(result,'{activities}',coalesce((select jsonb_agg(x) from jsonb_array_elements(result->'activities') x where coalesce(lms_delivery_activity_open(a.id,(x->>'id')::uuid),false)),'[]'));
   result:=result||jsonb_build_object('delivery_plan',true,'baseline_activity_ids',coalesce((select jsonb_agg(x->>'id') from jsonb_array_elements(plan.content->'activities') x where x->>'stage'='baseline'),'[]'));
  elsif p_action='learning.submit' then
   select id into attempt from lms_attempt_history where assignment_id=a.id and action='learning.submit' and snapshot->>'activity_id'=activity::text order by created_at desc,id desc limit 1;
   if attempt is not null then
    update lms_delivery_files set attempt_id=attempt where assignment_id=a.id and activity_id=activity and attempt_id is null and uploaded_by=p_actor;
    update lms_attempt_history set snapshot=snapshot||jsonb_build_object('files',coalesce((select jsonb_agg(id) from lms_delivery_files where attempt_id=attempt),'[]')) where id=attempt;
   end if;
   perform lms_delivery_complete(a.id);
  end if;
 end if;
 return result;
end $$;
-- Do not leave the bypass available as a service RPC. The wrapper runs as the
-- service role and needs internal invocation, so keep it in a private schema.
create schema if not exists learning_internal;
revoke all on schema learning_internal from public,anon,authenticated;
grant usage on schema learning_internal to service_role;
alter function public.lms_command_before_delivery(uuid,text,jsonb,uuid) set schema learning_internal;
do $$ declare definition text; begin
 definition:=pg_get_functiondef('public.lms_command(uuid,text,jsonb,uuid)'::regprocedure);
 execute replace(definition,'result:=lms_command_before_delivery(', 'result:=learning_internal.lms_command_before_delivery(');
end $$;
do $$ declare f record; begin
 for f in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and (proname like 'lms_delivery_%' or proname='lms_command') loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  execute format('grant execute on function %s to service_role',f.signature);
 end loop;
end $$;
