create table if not exists public.cohort_wall_posts (
 id uuid primary key default gen_random_uuid(),
 cohort_id uuid not null references public.cohorts(id),
 author_id uuid not null references public.user_profiles(id),
 parent_id uuid references public.cohort_wall_posts(id),
 body text not null check(length(trim(body)) between 1 and 4000),
 created_at timestamptz not null default now()
);
create index if not exists cohort_wall_created on public.cohort_wall_posts(cohort_id,created_at desc);
create index if not exists cohort_wall_author on public.cohort_wall_posts(author_id);
create index if not exists cohort_wall_parent on public.cohort_wall_posts(parent_id);
alter table public.cohort_wall_posts enable row level security;
revoke all on public.cohort_wall_posts from anon,authenticated;
grant all on public.cohort_wall_posts to service_role;

create or replace function public.cohort_wall(p_actor uuid,p_cohort uuid,p_body text default null,p_parent uuid default null,p_request uuid default null) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare actor user_profiles%rowtype; cohort cohorts%rowtype; previous cohort_wall_posts%rowtype;
begin
 select * into actor from user_profiles where id=p_actor;
 select * into cohort from cohorts where id=p_cohort;
 if actor.id is null or cohort.id is null then raise exception 'Discussion not available' using errcode='42501'; end if;
 if not coalesce((
  (actor.role in ('admin','manager','super_admin') and cohort.org_id=actor.org_id)
  or exists(select 1 from facilitators f where f.id=cohort.facilitator_id and f.user_id=actor.id and f.active)
  or exists(select 1 from enrolments e where e.cohort_id=cohort.id and e.user_id=actor.id and e.org_id=actor.org_id and e.status in ('enrolled','completed','failed'))
  or (actor.role in ('admin','manager','super_admin') and exists(select 1 from enrolments e where e.cohort_id=cohort.id and e.org_id=actor.org_id and e.status in ('enrolled','completed','failed')))
 ), false) then raise exception 'Wall not available to this account' using errcode='42501'; end if;
 if p_body is not null then
  if cohort.status='cancelled' then raise exception 'This discussion is read-only because the cohort is cancelled' using errcode='22023'; end if;
  if p_request is null or length(trim(p_body)) not between 1 and 4000 then raise exception 'A message and request ID are required' using errcode='22023'; end if;
  if p_parent is not null and not exists(select 1 from cohort_wall_posts where id=p_parent and cohort_id=cohort.id) then raise exception 'Reply must belong to this cohort' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request::text,0));
  select * into previous from cohort_wall_posts where id=p_request;
  if previous.id is not null then
   if previous.author_id<>actor.id or previous.cohort_id<>cohort.id or previous.body<>trim(p_body) or previous.parent_id is distinct from p_parent then raise exception 'This request was already used for different content' using errcode='22023'; end if;
  else insert into cohort_wall_posts(id,cohort_id,author_id,parent_id,body) values(p_request,cohort.id,actor.id,p_parent,trim(p_body)); end if;
 end if;
 return jsonb_build_object('posts',coalesce((select jsonb_agg(row_to_json(x) order by x.created_at) from (select d.id,d.parent_id,d.body,d.created_at,u.name as author_name from cohort_wall_posts d join user_profiles u on u.id=d.author_id where d.cohort_id=cohort.id order by d.created_at desc,d.id limit 100) x),'[]'::jsonb),'read_only',cohort.status='cancelled');
end; $$;
revoke all on function public.cohort_wall(uuid,uuid,text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.cohort_wall(uuid,uuid,text,uuid,uuid) to service_role;
