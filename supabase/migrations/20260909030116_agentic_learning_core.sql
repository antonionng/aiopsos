-- Additive LMS records. All access goes through the service-only command API.
-- No legacy records or policies are changed.
create table if not exists public.lms_courses (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organisations(id),
 content jsonb not null, revision integer not null default 1 check(revision>0),
 created_by uuid not null references public.user_profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.lms_course_versions (
 id uuid primary key default gen_random_uuid(), course_id uuid not null references public.lms_courses(id), org_id uuid not null references public.organisations(id),
 version integer not null, content jsonb not null, created_by uuid not null references public.user_profiles(id), created_at timestamptz not null default now(), unique(course_id,version)
);
create table if not exists public.lms_clients (
 id uuid primary key default gen_random_uuid(), provider_org_id uuid not null references public.organisations(id), client_org_id uuid not null references public.organisations(id),
 state text not null default 'pending' check(state in ('pending','accepted','declined')), created_at timestamptz not null default now(), responded_by uuid references public.user_profiles(id),
 unique(provider_org_id,client_org_id), check(provider_org_id<>client_org_id)
);
create table if not exists public.lms_programmes (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organisations(id), client_org_id uuid references public.organisations(id),
 title text not null, goal text not null, version_ids uuid[] not null, status text not null default 'active' check(status in ('active','archived')),
 due_at timestamptz, created_by uuid not null references public.user_profiles(id), created_at timestamptz not null default now()
);
create table if not exists public.lms_assignments (
 id uuid primary key default gen_random_uuid(), programme_id uuid not null references public.lms_programmes(id), org_id uuid not null references public.organisations(id),
 user_id uuid not null references public.user_profiles(id), completed_at timestamptz, created_at timestamptz not null default now(), unique(programme_id,user_id)
);
create table if not exists public.lms_activity_progress (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.lms_assignments(id), activity_id uuid not null,
 answer text not null default '', state text not null check(state in ('passed','submitted','returned')), feedback text not null default '',
 revision integer not null default 1, reviewed_by uuid references public.user_profiles(id), observation_context text not null default '', updated_at timestamptz not null default now(), unique(assignment_id,activity_id)
);
create table if not exists public.lms_attempt_history (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.lms_assignments(id), actor_id uuid not null references public.user_profiles(id), action text not null, snapshot jsonb not null, created_at timestamptz not null default now()
);
create index if not exists lms_history_assignment on public.lms_attempt_history(assignment_id);
alter table public.lms_attempt_history enable row level security;
revoke all on public.lms_attempt_history from anon,authenticated;
grant all on public.lms_attempt_history to service_role;
create table if not exists public.lms_agent_runs (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organisations(id), created_by uuid not null references public.user_profiles(id),
 kind text not null check(kind in ('course','programme','delivery')), goal text not null,
 state text not null default 'queued' check(state in ('queued','running','needs_review','completed','failed','cancelled')),
 proposal jsonb, summary text not null default '', error text, result jsonb, attempts integer not null default 0, lease_token uuid, lease_until timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.lms_workspace_settings (
 org_id uuid primary key references public.organisations(id), brand_name text not null, accent text not null default '#7046eb', provider boolean not null default true, enterprise boolean not null default true
);
create table if not exists public.lms_events (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organisations(id), actor_id uuid not null references public.user_profiles(id),
 action text not null, request_key uuid not null, request_hash text not null, response jsonb not null, created_at timestamptz not null default now(), unique(actor_id,request_key)
);
create index if not exists lms_courses_org on public.lms_courses(org_id);
create index if not exists lms_versions_org on public.lms_course_versions(org_id);
create index if not exists lms_programmes_org on public.lms_programmes(org_id);
create index if not exists lms_programmes_client on public.lms_programmes(client_org_id);
create index if not exists lms_assignments_user on public.lms_assignments(user_id);
create index if not exists lms_progress_assignment on public.lms_activity_progress(assignment_id);
create index if not exists lms_runs_org on public.lms_agent_runs(org_id);
create index if not exists lms_events_org on public.lms_events(org_id,created_at desc);
create index if not exists lms_clients_client on public.lms_clients(client_org_id);
-- Deny direct browser-table access, including answer keys. The application
-- authenticates the user before invoking the checked command function below.
alter table public.lms_courses enable row level security;
alter table public.lms_course_versions enable row level security;
alter table public.lms_clients enable row level security;
alter table public.lms_programmes enable row level security;
alter table public.lms_assignments enable row level security;
alter table public.lms_activity_progress enable row level security;
alter table public.lms_agent_runs enable row level security;
alter table public.lms_workspace_settings enable row level security;
alter table public.lms_events enable row level security;
revoke all on public.lms_courses,public.lms_course_versions,public.lms_clients,public.lms_programmes,public.lms_assignments,public.lms_activity_progress,public.lms_agent_runs,public.lms_workspace_settings,public.lms_events from anon,authenticated;
grant all on public.lms_courses,public.lms_course_versions,public.lms_clients,public.lms_programmes,public.lms_assignments,public.lms_activity_progress,public.lms_agent_runs,public.lms_workspace_settings,public.lms_events to service_role;

create or replace function public.lms_command(p_actor uuid,p_action text,p_payload jsonb default '{}'::jsonb,p_request uuid default gen_random_uuid()) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare
 actor public.user_profiles%rowtype; manager boolean; v_result jsonb; item jsonb; activity jsonb; record_id uuid;
 course public.lms_courses%rowtype; prog public.lms_programmes%rowtype; assignment public.lms_assignments%rowtype; progress public.lms_activity_progress%rowtype; run public.lms_agent_runs%rowtype;
 selected uuid[]; target uuid; n integer; total integer; done integer; saved public.lms_events%rowtype; body jsonb; state_value text;
begin
 select * into actor from public.user_profiles where id=p_actor;
 if actor.id is null or actor.org_id is null then raise exception 'Unauthorised workspace' using errcode='42501'; end if;
 manager:=actor.role in ('admin','manager','super_admin');
 if p_action in ('overview','course.get','programme.get','learning.get') then null;
 else
  perform pg_advisory_xact_lock(hashtextextended(p_actor::text||p_request::text,0));
  select * into saved from lms_events where actor_id=p_actor and request_key=p_request;
  if saved.id is not null then
   if saved.action<>p_action or saved.request_hash<>md5(p_payload::text) then raise exception 'Request key was already used for different work' using errcode='22023'; end if;
   return saved.response;
  end if;
 end if;
 if not manager and p_action not in ('overview','learning.get','learning.submit') then raise exception 'A workspace manager is required' using errcode='42501'; end if;

 if p_action='overview' then
  return jsonb_build_object('org_id',actor.org_id,'can_manage',manager,
   'settings',(select to_jsonb(s) from lms_workspace_settings s where s.org_id=actor.org_id),
   'courses',case when manager then coalesce((select jsonb_agg(c order by c.updated_at desc) from lms_courses c where c.org_id=actor.org_id),'[]') else '[]'::jsonb end,
   'versions',case when manager then coalesce((select jsonb_agg(jsonb_build_object('id',v.id,'course_id',v.course_id,'version',v.version,'title',v.content->>'title','created_at',v.created_at)) from lms_course_versions v where v.org_id=actor.org_id),'[]') else '[]'::jsonb end,
   'programmes',coalesce((select jsonb_agg(p order by p.created_at desc) from lms_programmes p where (manager and (p.org_id=actor.org_id or p.client_org_id=actor.org_id)) or exists(select 1 from lms_assignments a where a.programme_id=p.id and a.user_id=p_actor)),'[]'),
   'assignments',coalesce((select jsonb_agg(to_jsonb(a)||jsonb_build_object('title',p.title,'due_at',p.due_at,'learner_name',u.name)) from lms_assignments a join lms_programmes p on p.id=a.programme_id join user_profiles u on u.id=a.user_id where a.user_id=p_actor or (manager and (p.org_id=actor.org_id or a.org_id=actor.org_id))),'[]'),
   'reviews',case when manager then coalesce((select jsonb_agg(to_jsonb(r)||jsonb_build_object('learner_name',u.name,'activity_title',act->>'title','criteria',act->>'criteria','activity_kind',act->>'kind')) from lms_activity_progress r join lms_assignments a on a.id=r.assignment_id join lms_programmes p on p.id=a.programme_id join user_profiles u on u.id=a.user_id join lms_course_versions v on v.id=any(p.version_ids) cross join lateral jsonb_array_elements(v.content->'activities') act where p.org_id=actor.org_id and r.state='submitted' and act->>'id'=r.activity_id::text),'[]') else '[]'::jsonb end,
   'runs',case when manager then coalesce((select jsonb_agg(to_jsonb(r)-'lease_token' order by r.created_at desc) from lms_agent_runs r where r.org_id=actor.org_id),'[]') else '[]'::jsonb end,
   'clients',case when manager then coalesce((select jsonb_agg(to_jsonb(c)||jsonb_build_object('provider_name',o.name,'client_name',cl.name)) from lms_clients c join organisations o on o.id=c.provider_org_id join organisations cl on cl.id=c.client_org_id where actor.org_id in(c.provider_org_id,c.client_org_id)),'[]') else '[]'::jsonb end,
   'members',case when manager then coalesce((select jsonb_agg(jsonb_build_object('id',u.id,'name',u.name,'org_id',u.org_id)) from user_profiles u where u.org_id=actor.org_id or exists(select 1 from lms_clients c where c.provider_org_id=actor.org_id and c.client_org_id=u.org_id and c.state='accepted')),'[]') else '[]'::jsonb end,
   'events',case when manager then coalesce((select jsonb_agg(e) from (select id,action,actor_id,created_at from lms_events where org_id=actor.org_id order by created_at desc limit 100) e),'[]') else '[]'::jsonb end
  );
 elsif p_action='course.get' then
  select * into course from lms_courses where id=(p_payload->>'id')::uuid and org_id=actor.org_id;
  if course.id is null then raise exception 'Course not found' using errcode='P0002'; end if;
  return to_jsonb(course);
 elsif p_action='course.save' then
  body:=p_payload->'content';
  if jsonb_typeof(body)<>'object' or length(trim(body->>'title'))<3 or jsonb_typeof(body->'activities')<>'array' or jsonb_array_length(body->'activities')<1 then raise exception 'Course content is incomplete' using errcode='22023'; end if;
  if (p_payload->>'id') is null then
   insert into lms_courses(org_id,content,created_by) values(actor.org_id,body,p_actor) returning id into record_id;
  else
   select * into course from lms_courses where id=(p_payload->>'id')::uuid and org_id=actor.org_id for update;
   if course.id is null then raise exception 'Course not found' using errcode='P0002'; end if;
   if course.revision<>(p_payload->>'revision')::integer then raise exception 'This course changed. Reload before saving.' using errcode='40001'; end if;
   update lms_courses set content=body,revision=revision+1,updated_at=now() where id=course.id;
   record_id:=course.id;
  end if;
  v_result:=jsonb_build_object('id',record_id);
 elsif p_action='course.publish' then
  select * into course from lms_courses where id=(p_payload->>'id')::uuid and org_id=actor.org_id for update;
  if course.id is null then raise exception 'Course not found' using errcode='P0002'; end if;
  if course.revision<>(p_payload->>'revision')::integer then raise exception 'This course changed. Reload before publishing.' using errcode='40001'; end if;
  select coalesce(max(version),0)+1 into n from lms_course_versions where course_id=course.id;
  insert into lms_course_versions(course_id,org_id,version,content,created_by) values(course.id,actor.org_id,n,course.content,p_actor) returning id into record_id;
  v_result:=jsonb_build_object('id',record_id,'version',n);
 elsif p_action='programme.create' then
  select array_agg(x::uuid) into selected from jsonb_array_elements_text(p_payload->'version_ids') x;
  if coalesce(cardinality(selected),0)<1 or cardinality(selected)<>(select count(distinct x) from unnest(selected) x) or exists(select 1 from unnest(selected) x where not exists(select 1 from lms_course_versions v where v.id=x and v.org_id=actor.org_id)) then raise exception 'Select your published course versions' using errcode='22023'; end if;
  -- Activity ids must be unambiguous across a programme, including versions.
  select count(*),count(distinct a->>'id') into total,n from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') a where v.id=any(selected);
  if total<>n or total=0 then raise exception 'Choose one version of each course with unique activities' using errcode='22023'; end if;
  target:=nullif(p_payload->>'client_org_id','')::uuid;
  if target is not null and not exists(select 1 from lms_clients where provider_org_id=actor.org_id and client_org_id=target and state='accepted') then raise exception 'Client connection has not been accepted' using errcode='42501'; end if;
  insert into lms_programmes(org_id,client_org_id,title,goal,version_ids,due_at,created_by) values(actor.org_id,target,p_payload->>'title',p_payload->>'goal',selected,nullif(p_payload->>'due_at','')::timestamptz,p_actor) returning id into record_id;
  v_result:=jsonb_build_object('id',record_id);
 elsif p_action='programme.get' then
  select * into prog from lms_programmes where id=(p_payload->>'id')::uuid and (org_id=actor.org_id or client_org_id=actor.org_id);
  if prog.id is null then raise exception 'Programme not found' using errcode='P0002'; end if;
  return jsonb_build_object('programme',to_jsonb(prog),'can_edit',prog.org_id=actor.org_id,'courses',(select jsonb_agg(jsonb_build_object('id',v.id,'title',v.content->>'title','version',v.version,'activities',jsonb_array_length(v.content->'activities'))) from lms_course_versions v where id=any(prog.version_ids)), 'assignments',coalesce((select jsonb_agg(to_jsonb(a)||jsonb_build_object('learner_name',u.name)) from lms_assignments a join user_profiles u on u.id=a.user_id where a.programme_id=prog.id and (prog.org_id=actor.org_id or a.org_id=actor.org_id)),'[]'));
 elsif p_action in ('programme.assign','programme.archive') then
  select * into prog from lms_programmes where id=(p_payload->>'id')::uuid and (org_id=actor.org_id or (p_action='programme.assign' and client_org_id=actor.org_id)) for update;
  if prog.id is null then raise exception 'Programme not found' using errcode='P0002'; end if;
  if p_action='programme.archive' then update lms_programmes set status='archived' where id=prog.id; v_result:=jsonb_build_object('id',prog.id);
  else
   if prog.status<>'active' then raise exception 'This programme is archived' using errcode='22023'; end if;
   if prog.client_org_id is not null and not exists(select 1 from lms_clients where provider_org_id=prog.org_id and client_org_id=prog.client_org_id and state='accepted') then raise exception 'Client connection is not active' using errcode='42501'; end if;
   target:=coalesce(prog.client_org_id,actor.org_id); n:=0;
   for item in select * from jsonb_array_elements(p_payload->'user_ids') loop
    if not exists(select 1 from user_profiles where id=(item#>>'{}')::uuid and org_id=target) then raise exception 'Learner is outside this programme audience' using errcode='42501'; end if;
    insert into lms_assignments(programme_id,org_id,user_id) values(prog.id,target,(item#>>'{}')::uuid) on conflict(programme_id,user_id) do nothing;
    get diagnostics done=row_count; n:=n+done;
   end loop;
   v_result:=jsonb_build_object('id',prog.id,'assigned',n);
  end if;
 elsif p_action in ('learning.get','learning.submit') then
  select * into assignment from lms_assignments where id=(p_payload->>'id')::uuid and user_id=p_actor and org_id=actor.org_id for update;
  if assignment.id is null then raise exception 'Learning assignment not found' using errcode='P0002'; end if;
  select * into prog from lms_programmes where id=assignment.programme_id;
  if p_action='learning.get' then
   return jsonb_build_object('assignment',to_jsonb(assignment),'programme',to_jsonb(prog),'activities',(select coalesce(jsonb_agg((a-'correctOption')||jsonb_build_object('course_title',v.content->>'title','version_id',v.id) order by ids.ordinality,acts.ordinality),'[]') from unnest(prog.version_ids) with ordinality ids(id,ordinality) join lms_course_versions v on v.id=ids.id cross join lateral jsonb_array_elements(v.content->'activities') with ordinality acts(a,ordinality)), 'history',coalesce((select jsonb_agg(h order by h.created_at) from lms_attempt_history h where h.assignment_id=assignment.id),'[]'),'progress',coalesce((select jsonb_agg(r) from lms_activity_progress r where assignment_id=assignment.id),'[]'));
  end if;
  if prog.status<>'active' then raise exception 'This programme is archived; records remain available' using errcode='22023'; end if;
  select a into activity from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') a where v.id=any(prog.version_ids) and a->>'id'=p_payload->>'activity_id';
  if activity is null then raise exception 'Activity not found in assigned course version' using errcode='P0002'; end if;
  if exists(select 1 from lms_activity_progress where assignment_id=assignment.id and activity_id=(p_payload->>'activity_id')::uuid and state='passed') then return jsonb_build_object('state','passed'); end if;
  if activity->>'kind'='lesson' then state_value:='passed';
  elsif activity->>'kind'='quiz' then
   if p_payload->>'option' is null or (p_payload->>'option')::int<0 or (p_payload->>'option')::int>=jsonb_array_length(activity->'options') then raise exception 'Choose an answer' using errcode='22023'; end if;
   state_value:=case when (p_payload->>'option')::int=(activity->>'correctOption')::int then 'passed' else 'returned' end;
  else
   if length(trim(coalesce(p_payload->>'answer','')))<3 then raise exception 'Add your work or observation request' using errcode='22023'; end if;
   state_value:='submitted';
  end if;
  insert into lms_activity_progress(assignment_id,activity_id,answer,state,feedback) values(assignment.id,(p_payload->>'activity_id')::uuid,case when activity->>'kind'='quiz' then p_payload->>'option' else coalesce(p_payload->>'answer','') end,state_value,case when state_value='returned' then 'Review the material and try again.' else '' end)
  on conflict(assignment_id,activity_id) do update set answer=excluded.answer,state=excluded.state,feedback=excluded.feedback,reviewed_by=null,observation_context='',revision=lms_activity_progress.revision+1,updated_at=now() returning id into record_id;
  v_result:=jsonb_build_object('id',record_id,'state',state_value);
 elsif p_action='learning.review' then
  select r.* into progress from lms_activity_progress r join lms_assignments a on a.id=r.assignment_id join lms_programmes p on p.id=a.programme_id where r.id=(p_payload->>'id')::uuid and p.org_id=actor.org_id for update of r;
  if progress.id is null then raise exception 'Work not found' using errcode='P0002'; end if;
  if progress.state<>'submitted' or progress.revision<>(p_payload->>'revision')::integer then raise exception 'This work changed. Reload the review queue.' using errcode='40001'; end if;
  select * into assignment from lms_assignments where id=progress.assignment_id for update;
  select * into prog from lms_programmes where id=assignment.programme_id;
  select a into activity from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') a where v.id=any(prog.version_ids) and a->>'id'=progress.activity_id::text;
  if activity->>'kind'='observation' and length(trim(coalesce(p_payload->>'observation_context','')))<10 then raise exception 'Record the task, equipment and observed conditions' using errcode='22023'; end if;
  if p_payload->>'decision' not in('passed','returned') then raise exception 'Invalid review decision' using errcode='22023'; end if;
  update lms_activity_progress set state=p_payload->>'decision',feedback=p_payload->>'feedback',observation_context=coalesce(p_payload->>'observation_context',''),reviewed_by=p_actor,revision=revision+1,updated_at=now() where id=progress.id;
  v_result:=jsonb_build_object('id',progress.id);
 elsif p_action='client.request' then
  target:=(p_payload->>'client_org_id')::uuid;
  if target=actor.org_id or not exists(select 1 from organisations where id=target) then raise exception 'Check the client workspace code' using errcode='22023'; end if;
  insert into lms_clients(provider_org_id,client_org_id) values(actor.org_id,target) on conflict(provider_org_id,client_org_id) do update set state=case when lms_clients.state='declined' then 'pending' else lms_clients.state end returning id into record_id;
  v_result:=jsonb_build_object('id',record_id);
 elsif p_action='client.respond' then
  update lms_clients set state=case when (p_payload->>'accept')::boolean then 'accepted' else 'declined' end,responded_by=p_actor where id=(p_payload->>'id')::uuid and client_org_id=actor.org_id and state='pending' returning id into record_id;
  if record_id is null then raise exception 'Pending connection not found' using errcode='P0002'; end if;
  v_result:=jsonb_build_object('id',record_id);
 elsif p_action='settings.save' then
  insert into lms_workspace_settings(org_id,brand_name,accent,provider,enterprise) values(actor.org_id,p_payload->>'brand_name',p_payload->>'accent',(p_payload->>'provider')::boolean,(p_payload->>'enterprise')::boolean)
  on conflict(org_id) do update set brand_name=excluded.brand_name,accent=excluded.accent,provider=excluded.provider,enterprise=excluded.enterprise;
  v_result:=jsonb_build_object('id',actor.org_id);
 elsif p_action='agent.create' then
  insert into lms_agent_runs(org_id,created_by,kind,goal) values(actor.org_id,p_actor,p_payload->>'kind',p_payload->>'goal') returning id into record_id;
  v_result:=jsonb_build_object('id',record_id);
 elsif p_action in('agent.cancel','agent.retry','agent.approve') then
  select * into run from lms_agent_runs where id=(p_payload->>'id')::uuid and org_id=actor.org_id for update;
  if run.id is null then raise exception 'Agent task not found' using errcode='P0002'; end if;
  if p_action='agent.cancel' then
   if run.state in('completed','cancelled') then raise exception 'This task is already closed' using errcode='22023'; end if;
   update lms_agent_runs set state='cancelled',lease_token=null,lease_until=null,updated_at=now() where id=run.id;
   v_result:=jsonb_build_object('id',run.id);
  elsif p_action='agent.retry' then
   if run.state<>'failed' or run.attempts>=3 then raise exception 'Task cannot be retried' using errcode='22023'; end if;
   update lms_agent_runs set state='queued',error=null,updated_at=now() where id=run.id;
   v_result:=jsonb_build_object('id',run.id);
  else
   if run.state='completed' then return run.result; end if;
   if run.state<>'needs_review' then raise exception 'Task is not ready for approval' using errcode='22023'; end if;
   if run.kind='course' then
    v_result:=lms_command(p_actor,'course.save',jsonb_build_object('content',run.proposal),gen_random_uuid());
   elsif run.kind='programme' then
    v_result:=lms_command(p_actor,'programme.create',run.proposal,gen_random_uuid());
   else v_result:=jsonb_build_object('id',run.id); end if;
   update lms_agent_runs set state='completed',result=v_result,updated_at=now() where id=run.id;
  end if;
 else raise exception 'Unknown learning action' using errcode='22023';
 end if;
 if p_action in('learning.submit','learning.review') then
  insert into lms_attempt_history(assignment_id,actor_id,action,snapshot) select assignment.id,p_actor,p_action,to_jsonb(r) from lms_activity_progress r where r.id=(v_result->>'id')::uuid;
  select count(*) into total from lms_course_versions v cross join lateral jsonb_array_elements(v.content->'activities') a where v.id=any(prog.version_ids);
  select count(*) into done from lms_activity_progress where assignment_id=assignment.id and state='passed';
  if total>0 and total=done then update lms_assignments set completed_at=coalesce(completed_at,now()) where id=assignment.id; end if;
 end if;
 insert into lms_events(org_id,actor_id,action,request_key,request_hash,response) values(actor.org_id,p_actor,p_action,p_request,md5(p_payload::text),v_result);
 return v_result;
end; $$;
revoke all on function public.lms_command(uuid,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.lms_command(uuid,text,jsonb,uuid) to service_role;

-- Atomic leases prevent duplicate worker execution. Expired tasks may be resumed.
create or replace function public.lms_claim_agent(p_id uuid,p_org uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r lms_agent_runs%rowtype;
begin
 select * into r from lms_agent_runs where id=p_id and org_id=p_org for update;
 if r.id is null or r.attempts>=3 or not(r.state='queued' or (r.state='running' and r.lease_until<now())) then return null; end if;
 update lms_agent_runs set state='running',lease_token=gen_random_uuid(),lease_until=now()+interval '120 seconds',attempts=attempts+1,error=null,updated_at=now() where id=p_id returning * into r;
 return to_jsonb(r);
end; $$;
revoke all on function public.lms_claim_agent(uuid,uuid) from public,anon,authenticated;
grant execute on function public.lms_claim_agent(uuid,uuid) to service_role;
