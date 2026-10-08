create table if not exists public.lms_discussion_posts (
 id uuid primary key default gen_random_uuid(),
 programme_id uuid not null references public.lms_programmes(id),
 author_id uuid not null references public.user_profiles(id),
 parent_id uuid references public.lms_discussion_posts(id),
 body text not null check(length(trim(body)) between 1 and 4000),
 created_at timestamptz not null default now()
);
create index if not exists lms_discussion_programme_created on public.lms_discussion_posts(programme_id,created_at desc);
create index if not exists lms_discussion_author on public.lms_discussion_posts(author_id);
create index if not exists lms_discussion_parent on public.lms_discussion_posts(parent_id);
alter table public.lms_discussion_posts enable row level security;
revoke all on public.lms_discussion_posts from anon,authenticated;
grant all on public.lms_discussion_posts to service_role;

create or replace function public.lms_discussion(p_actor uuid,p_programme uuid,p_body text default null,p_parent uuid default null,p_request uuid default null) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare actor user_profiles%rowtype; programme lms_programmes%rowtype; previous lms_discussion_posts%rowtype;
begin
 select * into actor from user_profiles where id=p_actor;
 select * into programme from lms_programmes where id=p_programme;
 if actor.id is null or actor.org_id is null or programme.id is null then raise exception 'Discussion not available' using errcode='42501'; end if;
 if not ((actor.role in ('admin','manager','super_admin') and (programme.org_id=actor.org_id or programme.client_org_id=actor.org_id)) or exists(select 1 from lms_assignments where programme_id=programme.id and user_id=actor.id and org_id=actor.org_id)) then raise exception 'Discussion not available to this account' using errcode='42501'; end if;
 if p_body is not null then
  if programme.status<>'active' then raise exception 'This discussion is read-only because the programme is archived' using errcode='22023'; end if;
  if p_request is null or length(trim(p_body)) not between 1 and 4000 then raise exception 'A message and request ID are required' using errcode='22023'; end if;
  if p_parent is not null and not exists(select 1 from lms_discussion_posts where id=p_parent and programme_id=programme.id) then raise exception 'Reply must belong to this programme' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request::text,0));
  select * into previous from lms_discussion_posts where id=p_request;
  if previous.id is not null then
   if previous.author_id<>actor.id or previous.programme_id<>programme.id or previous.body<>trim(p_body) or previous.parent_id is distinct from p_parent then raise exception 'This request was already used for different content' using errcode='22023'; end if;
  else insert into lms_discussion_posts(id,programme_id,author_id,parent_id,body) values(p_request,programme.id,actor.id,p_parent,trim(p_body)); end if;
 end if;
 return jsonb_build_object('posts',coalesce((select jsonb_agg(row_to_json(x) order by x.created_at) from (select d.id,d.parent_id,d.body,d.created_at,u.name as author_name from lms_discussion_posts d join user_profiles u on u.id=d.author_id where d.programme_id=programme.id order by d.created_at desc,d.id limit 100) x),'[]'::jsonb),'read_only',programme.status<>'active');
end; $$;
revoke all on function public.lms_discussion(uuid,uuid,text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.lms_discussion(uuid,uuid,text,uuid,uuid) to service_role;
