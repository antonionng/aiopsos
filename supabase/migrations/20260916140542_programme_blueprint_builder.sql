create table public.lms_programme_blueprints (
 id uuid primary key default gen_random_uuid(),org_id uuid not null references public.organisations(id),
 title text not null,config jsonb not null,revision integer not null default 1,
 created_by uuid not null references public.user_profiles(id),updated_at timestamptz not null default now()
);
create index lms_blueprint_org on public.lms_programme_blueprints(org_id,updated_at desc);
create index lms_blueprint_creator on public.lms_programme_blueprints(created_by);
create table public.lms_blueprint_runs (
 id uuid primary key default gen_random_uuid(),blueprint_id uuid not null references public.lms_programme_blueprints(id),
 blueprint_revision integer not null,programme_id uuid not null references public.lms_programmes(id),
 actor_id uuid not null references public.user_profiles(id),request_id uuid not null,payload_hash text not null,
 config jsonb not null,created_at timestamptz not null default now(),unique(actor_id,request_id)
);
create index lms_blueprint_run_template on public.lms_blueprint_runs(blueprint_id);
create index lms_blueprint_run_programme on public.lms_blueprint_runs(programme_id);
alter table public.lms_programme_blueprints enable row level security;
alter table public.lms_blueprint_runs enable row level security;
revoke all on public.lms_programme_blueprints,public.lms_blueprint_runs from public,anon,authenticated;
grant all on public.lms_programme_blueprints,public.lms_blueprint_runs to service_role;
create function public.lms_blueprint_command(p_actor uuid,p_org uuid,p_action text,p_payload jsonb,p_request uuid) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare b lms_programme_blueprints%rowtype; run lms_blueprint_runs%rowtype; result jsonb; config jsonb; content jsonb; course jsonb; version jsonb; programme jsonb; versions jsonb:='[]'; item jsonb; new_id uuid; old_id text; mapped jsonb; plan jsonb; activities jsonb;
begin
 perform lms_assert_workspace(p_actor,p_org,true);
 if p_action='list' then return coalesce((select jsonb_agg(jsonb_build_object('id',id,'title',title,'revision',revision,'updated_at',updated_at) order by updated_at desc) from lms_programme_blueprints where org_id=p_org),'[]');end if;
 if p_payload ? 'id' then
  select * into b from lms_programme_blueprints where id=(p_payload->>'id')::uuid and org_id=p_org for update;
  if b.id is null then raise exception 'Template unavailable' using errcode='42501';end if;
 end if;
 if p_action='get' then return to_jsonb(b);end if;
 if p_action='save' then
  if octet_length((p_payload->'config')::text)>500000 then raise exception 'Template is too large';end if;
  if b.id is null then insert into lms_programme_blueprints(org_id,title,config,created_by) values(p_org,left(coalesce(nullif(p_payload->'config'->>'title',''),'Untitled programme'),180),p_payload->'config',p_actor) returning * into b;
  else
   if b.revision<>(p_payload->>'revision')::integer then raise exception 'This template has changed. Reload before saving.' using errcode='PT409';end if;
   update lms_programme_blueprints set config=p_payload->'config',title=left(coalesce(nullif(p_payload->'config'->>'title',''),'Untitled programme'),180),revision=revision+1,updated_at=now() where id=b.id returning * into b;
  end if;
  return to_jsonb(b);
 end if;
 if p_action<>'create_run' or b.id is null then raise exception 'Unknown template action';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_actor::text||p_request::text,9619));
 select * into run from lms_blueprint_runs where actor_id=p_actor and request_id=p_request;
 if run.id is not null then
  if run.blueprint_id<>b.id or run.payload_hash<>md5(p_payload::text) then raise exception 'Request identifier already used' using errcode='PT409';end if;
  return jsonb_build_object('id',run.programme_id);
 end if;
 if b.revision<>(p_payload->>'revision')::integer then raise exception 'This template has changed. Reload before creating a programme.' using errcode='PT409';end if;
 config:=p_payload->'validated_config';plan:=config->'plan';mapped:='[]';
 for content in select * from jsonb_array_elements(config->'courses') loop
  activities:='[]';
  for item in select * from jsonb_array_elements(content->'activities') loop
   old_id:=item->>'id';new_id:=gen_random_uuid();
   activities:=activities||jsonb_build_array(jsonb_set(item,'{id}',to_jsonb(new_id::text)));
   mapped:=mapped||coalesce((select jsonb_agg(jsonb_set(x,'{id}',to_jsonb(new_id::text))) from jsonb_array_elements(plan->'activities') x where x->>'id'=old_id),'[]');
  end loop;
  content:=jsonb_set(content,'{activities}',activities);
  course:=lms_command_scoped(p_actor,p_org,'course.save',jsonb_build_object('content',content),gen_random_uuid());
  version:=lms_command_scoped(p_actor,p_org,'course.publish',jsonb_build_object('id',course->>'id','revision',1),gen_random_uuid());
  versions:=versions||jsonb_build_array(version->>'id');
 end loop;
 programme:=lms_command_scoped(p_actor,p_org,'programme.create',jsonb_build_object('title',p_payload->>'title','goal',config->>'goal','version_ids',versions,'client_org_id',p_payload->'client_org_id'),gen_random_uuid());
 plan:=jsonb_set(plan,'{activities}',mapped);
 perform lms_delivery_command(p_actor,p_org,(programme->>'id')::uuid,'plan.save',jsonb_build_object('revision',0,'plan',plan),gen_random_uuid());
 insert into lms_blueprint_runs(blueprint_id,blueprint_revision,programme_id,actor_id,request_id,payload_hash,config)
 values(b.id,b.revision,(programme->>'id')::uuid,p_actor,p_request,md5(p_payload::text),config);
 return programme;
end $$;
revoke all on function public.lms_blueprint_command(uuid,uuid,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.lms_blueprint_command(uuid,uuid,text,jsonb,uuid) to service_role;
