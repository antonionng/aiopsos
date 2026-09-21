create table public.lms_programme_cohorts (
 cohort_id uuid primary key references public.cohorts(id),
 programme_id uuid not null references public.lms_programmes(id),
 created_by uuid not null references public.user_profiles(id),
 created_at timestamptz not null default now()
);
create index lms_programme_cohorts_programme on public.lms_programme_cohorts(programme_id);
alter table public.lms_programme_cohorts enable row level security;
revoke all on public.lms_programme_cohorts from public,anon,authenticated;
grant all on public.lms_programme_cohorts to service_role;
create table public.lms_delivery_events (
 id uuid primary key default gen_random_uuid(),
 programme_id uuid not null references public.lms_programmes(id),
 cohort_id uuid not null references public.cohorts(id),
 actor_id uuid not null references public.user_profiles(id),
 action text not null,
 affected_count integer not null default 0,
 created_at timestamptz not null default now()
);
alter table public.lms_delivery_events enable row level security;
revoke all on public.lms_delivery_events from public,anon,authenticated;
grant all on public.lms_delivery_events to service_role;
create or replace function public.lms_live_delivery(p_actor uuid,p_programme uuid default null,p_cohort uuid default null,p_action text default 'get') returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare actor user_profiles%rowtype; prog lms_programmes%rowtype; cohort cohorts%rowtype; manager boolean; operator boolean; own_assignment uuid; n int:=0; occupied int; existing uuid;
begin
 select * into actor from user_profiles where id=p_actor;
 if actor.id is null or actor.org_id is null then raise exception 'Workspace required' using errcode='42501'; end if;
 if p_programme is null then select programme_id into p_programme from lms_programme_cohorts where cohort_id=p_cohort; end if;
 select * into prog from lms_programmes where id=p_programme;
 if prog.id is null then raise exception 'No linked programme' using errcode='P0002'; end if;
 manager:=coalesce(actor.role in ('admin','manager','super_admin') and (actor.org_id=prog.org_id or actor.org_id=prog.client_org_id),false);
 operator:=coalesce(manager and actor.org_id=prog.org_id,false);
 select id into own_assignment from lms_assignments where programme_id=prog.id and user_id=actor.id and org_id=actor.org_id;
 if not manager and own_assignment is null then raise exception 'Programme not available' using errcode='42501'; end if;
 if p_action not in ('get','link','enrol') then raise exception 'Unknown delivery action' using errcode='22023'; end if;
 if p_action<>'get' then
  if not operator then raise exception 'Only the programme provider can manage live delivery' using errcode='42501'; end if;
  if prog.status<>'active' then raise exception 'Programme is archived' using errcode='22023'; end if;
  if prog.client_org_id is not null and not exists(select 1 from lms_clients where provider_org_id=prog.org_id and client_org_id=prog.client_org_id and state='accepted') then raise exception 'Client connection is not active' using errcode='42501'; end if;
  select * into cohort from cohorts where id=p_cohort and org_id=prog.org_id for update;
  if cohort.id is null then raise exception 'Choose a live group owned by this provider' using errcode='42501'; end if;
  if cohort.status not in ('scheduled','running') then raise exception 'This group is not open for enrolment' using errcode='22023'; end if;
  select programme_id into existing from lms_programme_cohorts where cohort_id=cohort.id;
  if p_action='link' then
   if existing is not null and existing<>prog.id then raise exception 'This group already belongs to another programme' using errcode='22023'; end if;
   insert into lms_programme_cohorts(cohort_id,programme_id,created_by) values(cohort.id,prog.id,actor.id) on conflict(cohort_id) do nothing;
   get diagnostics n=row_count;
  else
   if existing is distinct from prog.id then raise exception 'Link this group first' using errcode='22023'; end if;
   select count(*) into occupied from enrolments where cohort_id=cohort.id and status<>'withdrawn';
   select count(*) into n from lms_assignments a join user_profiles u on u.id=a.user_id and u.org_id=a.org_id where a.programme_id=prog.id and a.org_id=coalesce(prog.client_org_id,prog.org_id) and not exists(select 1 from enrolments e where e.cohort_id=cohort.id and e.user_id=a.user_id);
   if occupied+n>cohort.seat_limit then raise exception 'Not enough places. Increase capacity or use another group.' using errcode='22023'; end if;
   insert into enrolments(cohort_id,user_id,org_id,department_id,status)
    select cohort.id,a.user_id,a.org_id,u.department_id,'enrolled' from lms_assignments a join user_profiles u on u.id=a.user_id and u.org_id=a.org_id where a.programme_id=prog.id and a.org_id=coalesce(prog.client_org_id,prog.org_id)
    on conflict(cohort_id,user_id) do nothing;
   get diagnostics n=row_count;
  end if;
  if n>0 then insert into lms_delivery_events(programme_id,cohort_id,actor_id,action,affected_count) values(prog.id,cohort.id,actor.id,p_action,n); end if;
 end if;
 return jsonb_build_object('programme_id',prog.id,'programme_title',prog.title,'assignment_id',own_assignment,'can_manage',operator,'changed',n,
  'cohorts',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'title',c.title,'status',c.status,'timezone',c.timezone,'location',c.location,'enrolled',exists(select 1 from enrolments e where e.cohort_id=c.id and e.user_id=actor.id and e.org_id=actor.org_id and e.status in ('enrolled','completed','failed')),'sessions',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'title',s.title,'starts_at',s.starts_at,'ends_at',s.ends_at) order by s.starts_at) from sessions s where s.cohort_id=c.id),'[]'::jsonb)) order by c.starts_on) from lms_programme_cohorts l join cohorts c on c.id=l.cohort_id where l.programme_id=prog.id),'[]'::jsonb),
  'available',case when operator then coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'title',c.title)) from cohorts c where c.org_id=prog.org_id and c.status in ('scheduled','running') and not exists(select 1 from lms_programme_cohorts l where l.cohort_id=c.id)),'[]'::jsonb) else '[]'::jsonb end);
end; $$;
revoke all on function public.lms_live_delivery(uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.lms_live_delivery(uuid,uuid,uuid,text) to service_role;
