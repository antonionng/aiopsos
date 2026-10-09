-- Versioned game checkpoints are separate from previously purchased lesson records.
create table public.wonderlab_adventure_progress (
 child_id uuid not null references public.wonderlab_children(id) on delete cascade,
 mission_slug text not null,
 game_version text not null,
 revision integer not null default 1 check (revision > 0),
 state jsonb not null check (jsonb_typeof(state) = 'object'),
 completed boolean not null default false,
 updated_at timestamptz not null default now(),
 primary key (child_id, mission_slug, game_version)
);
alter table public.wonderlab_adventure_progress enable row level security;
revoke all on public.wonderlab_adventure_progress from anon, authenticated;
grant all on public.wonderlab_adventure_progress to service_role;
-- Parent reads go through the reauthenticated family API. Browser roles have no table access.

-- Only the server may call this function after evaluating an allowed game action.
create function public.wonderlab_save_adventure(p_child uuid,p_parent uuid,p_slug text,p_version text,p_revision integer,p_state jsonb,p_completed boolean)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare saved public.wonderlab_adventure_progress;
begin
 if not exists (select 1 from public.wonderlab_children where id=p_child and parent_id=p_parent and deletion_requested_at is null) then raise exception 'Profile unavailable'; end if;
 if not exists (select 1 from public.wonderlab_orders where child_id=p_child and parent_id=p_parent and mission_slug=p_slug and (state='granted' or (state='paid' and expires_at>now()))) then raise exception 'Access unavailable'; end if;
 if p_revision<0 or jsonb_typeof(p_state)<>'object' or p_state->>'version' is distinct from p_version then raise exception 'Invalid checkpoint'; end if;
 -- Serialise the initial insert as well as later saves for the same checkpoint.
 perform pg_advisory_xact_lock(hashtextextended(p_child::text || ':' || p_slug || ':' || p_version, 0));
 select * into saved from public.wonderlab_adventure_progress where child_id=p_child and mission_slug=p_slug and game_version=p_version for update;
 if found then
   if saved.revision<>p_revision then raise exception 'Progress conflict'; end if;
   update public.wonderlab_adventure_progress set state=p_state,completed=(completed or p_completed),revision=revision+1,updated_at=now()
   where child_id=p_child and mission_slug=p_slug and game_version=p_version returning * into saved;
 else
   if p_revision<>0 then raise exception 'Progress conflict'; end if;
   insert into public.wonderlab_adventure_progress(child_id,mission_slug,game_version,state,completed) values(p_child,p_slug,p_version,p_state,p_completed) returning * into saved;
 end if;
 return to_jsonb(saved);
end $$;
revoke all on function public.wonderlab_save_adventure(uuid,uuid,text,text,integer,jsonb,boolean) from public,anon,authenticated;
grant execute on function public.wonderlab_save_adventure(uuid,uuid,text,text,integer,jsonb,boolean) to service_role;
