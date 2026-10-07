-- Wonderlab is served only through guarded server routes. Browser roles have no
-- table or function privileges, including the parent-authenticated browser.
create table if not exists public.wonderlab_children (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references auth.users(id),
 nickname text not null check(char_length(nickname) between 1 and 30),
 band text not null check(band in ('explorers','inventors','creators','studio')),
 avatar text not null default 'robot', ai_enabled boolean not null default false,
 narration boolean not null default false, deletion_requested_at timestamptz,
 created_at timestamptz not null default now(),
 check(not ai_enabled or band in ('creators','studio'))
);
create index if not exists wonderlab_children_parent on public.wonderlab_children(parent_id);
create table if not exists public.wonderlab_sessions (
 token_hash text primary key, parent_id uuid not null references auth.users(id),
 child_id uuid references public.wonderlab_children(id), kind text not null check(kind in ('parent','child')),
 expires_at timestamptz not null, created_at timestamptz not null default now(),
 check((kind='parent' and child_id is null) or (kind='child' and child_id is not null))
);
create table if not exists public.wonderlab_orders (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references auth.users(id),
 child_id uuid not null references public.wonderlab_children(id), mission_slug text not null,
 content_version text not null, amount integer not null default 2000 check(amount=2000),
 currency text not null default 'gbp' check(currency='gbp'), terms_version text not null,
 state text not null default 'pending' check(state in ('pending','paid','refunded')),
 stripe_session_id text unique, stripe_intent_id text unique,
 purchased_at timestamptz, expires_at timestamptz, generations_used integer not null default 0 check(generations_used between 0 and 30),
 created_at timestamptz not null default now(), unique(child_id,mission_slug)
);
create table if not exists public.wonderlab_payment_events (
 event_id text primary key, order_id uuid not null references public.wonderlab_orders(id),
 kind text not null, created_at timestamptz not null default now()
);
create table if not exists public.wonderlab_progress (
 child_id uuid not null references public.wonderlab_children(id), mission_slug text not null,
 content_version text not null, revision integer not null default 1, answers jsonb not null default '{}',
 creation text not null default '' check(char_length(creation)<=8000), project_checks jsonb not null default '[]',
 passed jsonb not null default '[]', completed boolean not null default false,
 completed_at timestamptz, updated_at timestamptz not null default now(), primary key(child_id,mission_slug)
);
create table if not exists public.wonderlab_generations (
 id uuid primary key, order_id uuid not null references public.wonderlab_orders(id),
 state text not null default 'pending' check(state in ('pending','succeeded','failed')),
 response text, input_tokens integer not null default 0, output_tokens integer not null default 0, estimated_cost_microusd bigint, created_at timestamptz not null default now(), finished_at timestamptz
);
create index if not exists wonderlab_generations_order on public.wonderlab_generations(order_id);
-- Deny direct browser access; ownership and parent/child session scopes are
-- checked by the server before any service-role operation.
do $$ declare t text; begin
 foreach t in array array['wonderlab_children','wonderlab_sessions','wonderlab_orders','wonderlab_payment_events','wonderlab_progress','wonderlab_generations'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public, anon, authenticated',t);
  execute format('grant all on public.%I to service_role',t);
 end loop;
end $$;

create or replace function public.wonderlab_payment_event(p_event text,p_order uuid,p_kind text,p_amount integer,p_currency text,p_session text,p_intent text)
returns void language plpgsql security invoker set search_path=public,pg_temp as $$
declare o wonderlab_orders; begin
 select * into o from wonderlab_orders where id=p_order for update;
 if not found then raise exception 'Unknown order'; end if;
 if p_amount<>o.amount or p_currency<>o.currency then raise exception 'Payment amount mismatch'; end if;
 if o.stripe_session_id is not null and p_session is not null and o.stripe_session_id<>p_session then raise exception 'Session mismatch'; end if;
 if o.stripe_intent_id is not null and p_intent is not null and o.stripe_intent_id<>p_intent then raise exception 'Intent mismatch'; end if;
 if p_kind not in ('paid','refunded') then raise exception 'Unknown event kind'; end if;
 insert into wonderlab_payment_events(event_id,order_id,kind) values(p_event,p_order,p_kind) on conflict do nothing;
 if not found then return; end if;
 if p_kind='refunded' then
  update wonderlab_orders set state='refunded',stripe_intent_id=coalesce(stripe_intent_id,p_intent) where id=o.id;
 elsif o.state='pending' then
  update wonderlab_orders set state='paid',purchased_at=now(),expires_at=now()+interval '12 months',stripe_session_id=coalesce(stripe_session_id,p_session),stripe_intent_id=coalesce(stripe_intent_id,p_intent) where id=o.id;
 end if;
end $$;

create or replace function public.wonderlab_save_progress(p_child uuid,p_parent uuid,p_slug text,p_version text,p_revision integer,p_answers jsonb,p_creation text,p_checks jsonb,p_passed jsonb,p_completed boolean)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare r wonderlab_progress; begin
 perform 1 from wonderlab_children where id=p_child and parent_id=p_parent and deletion_requested_at is null for update;
 if not found then raise exception 'Child unavailable'; end if;
 perform 1 from wonderlab_orders where child_id=p_child and parent_id=p_parent and mission_slug=p_slug and state='paid' and expires_at>now() and content_version=p_version;
 if not found then raise exception 'Access unavailable'; end if;
 select * into r from wonderlab_progress where child_id=p_child and mission_slug=p_slug for update;
 if found then
  if r.revision<>p_revision then raise exception 'Progress conflict'; end if;
  update wonderlab_progress set revision=revision+1,answers=p_answers,creation=p_creation,project_checks=p_checks,passed=p_passed,
   completed=completed or p_completed,completed_at=case when p_completed then coalesce(completed_at,now()) else completed_at end,updated_at=now()
   where child_id=p_child and mission_slug=p_slug returning * into r;
 else
  if p_revision<>0 then raise exception 'Progress conflict'; end if;
  insert into wonderlab_progress(child_id,mission_slug,content_version,answers,creation,project_checks,passed,completed,completed_at)
   values(p_child,p_slug,p_version,p_answers,p_creation,p_checks,p_passed,p_completed,case when p_completed then now() end) returning * into r;
 end if;
 return to_jsonb(r);
end $$;

create or replace function public.wonderlab_reserve_generation(p_id uuid,p_order uuid,p_child uuid)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare o wonderlab_orders; g wonderlab_generations; active_count integer; begin
 select * into o from wonderlab_orders where id=p_order and child_id=p_child for update;
 if not found or o.state<>'paid' or o.expires_at<=now() then raise exception 'Access unavailable'; end if;
 perform 1 from wonderlab_children where id=p_child and ai_enabled and band in ('creators','studio') and deletion_requested_at is null;
 if not found then raise exception 'AI unavailable'; end if;
 select * into g from wonderlab_generations where id=p_id;
 if found then
  if g.order_id<>p_order then raise exception 'Request mismatch'; end if;
  return to_jsonb(g);
 end if;
 select count(*) into active_count from wonderlab_generations where order_id=p_order and state='pending' and created_at>now()-interval '3 minutes';
 if active_count>=1 then raise exception 'A creation is already running'; end if;
 if (select count(*) from wonderlab_generations where order_id=p_order and created_at>now()-interval '1 hour')>=40 then raise exception 'Please return to guided AI later'; end if;
 if o.generations_used+active_count>=30 then raise exception 'Allowance reached'; end if;
 insert into wonderlab_generations(id,order_id) values(p_id,p_order) returning * into g;
 return to_jsonb(g)||jsonb_build_object('reserved',true);
end $$;
create or replace function public.wonderlab_finish_generation(p_id uuid,p_response text,p_input_tokens integer default 0,p_output_tokens integer default 0,p_cost_microusd bigint default null)
returns boolean language plpgsql security invoker set search_path=public,pg_temp as $$
declare g wonderlab_generations; o wonderlab_orders; begin
 select * into g from wonderlab_generations where id=p_id;
 if not found then return false; end if;
 select * into o from wonderlab_orders where id=g.order_id for update;
 select * into g from wonderlab_generations where id=p_id for update;
 if g.state<>'pending' then return g.state='succeeded'; end if;
 if p_response is null or g.created_at<=now()-interval '3 minutes' or o.state<>'paid' or o.expires_at<=now() or o.generations_used>=30 or not exists(select 1 from wonderlab_children where id=o.child_id and ai_enabled and deletion_requested_at is null) then
  update wonderlab_generations set state='failed',finished_at=now() where id=p_id; return false;
 end if;
 update wonderlab_orders set generations_used=generations_used+1 where id=o.id;
 update wonderlab_generations set state='succeeded',response=p_response,input_tokens=greatest(0,p_input_tokens),output_tokens=greatest(0,p_output_tokens),estimated_cost_microusd=p_cost_microusd,finished_at=now() where id=p_id;
 return true;
end $$;
revoke all on function public.wonderlab_payment_event(text,uuid,text,integer,text,text,text) from public,anon,authenticated;
revoke all on function public.wonderlab_save_progress(uuid,uuid,text,text,integer,jsonb,text,jsonb,jsonb,boolean) from public,anon,authenticated;
revoke all on function public.wonderlab_reserve_generation(uuid,uuid,uuid) from public,anon,authenticated;
revoke all on function public.wonderlab_finish_generation(uuid,text,integer,integer,bigint) from public,anon,authenticated;
grant execute on function public.wonderlab_payment_event(text,uuid,text,integer,text,text,text) to service_role;
grant execute on function public.wonderlab_save_progress(uuid,uuid,text,text,integer,jsonb,text,jsonb,jsonb,boolean) to service_role;
grant execute on function public.wonderlab_reserve_generation(uuid,uuid,uuid) to service_role;
grant execute on function public.wonderlab_finish_generation(uuid,text,integer,integer,bigint) to service_role;
