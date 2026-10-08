-- Complimentary access is explicit. It is never recorded as a payment.
alter table public.wonderlab_orders add column granted_at timestamptz;
alter table public.wonderlab_orders add column generation_period_start timestamptz;
alter table public.wonderlab_orders add column grant_reason text;
alter table public.wonderlab_orders drop constraint wonderlab_orders_state_check;
alter table public.wonderlab_orders add constraint wonderlab_orders_state_check check(state in ('pending','paid','refunded','granted'));
alter table public.wonderlab_orders drop constraint wonderlab_orders_amount_check;
alter table public.wonderlab_orders add constraint wonderlab_orders_amount_check check(
 (state='granted' and amount=0 and membership_id is null) or
 (state<>'granted' and ((membership_id is null and amount=2000) or (membership_id is not null and amount=0)))
);
alter table public.wonderlab_orders add constraint wonderlab_complimentary_access_check check(
 state<>'granted' or (expires_at is null and purchased_at is null and granted_at is not null and
 grant_reason is not null and char_length(grant_reason) between 1 and 200 and
 stripe_session_id is null and stripe_intent_id is null)
);

create function public.wonderlab_grant_lifetime_access(p_parent uuid,p_child uuid,p_catalog jsonb)
returns integer language plpgsql security invoker set search_path=public,pg_temp as $$
declare granted integer; begin
 perform 1 from wonderlab_children where id=p_child and parent_id=p_parent and deletion_requested_at is null for update;
 if not found then raise exception 'Child unavailable'; end if;
 if jsonb_typeof(p_catalog) is distinct from 'array' then raise exception 'Full catalogue required'; end if;
 if jsonb_array_length(p_catalog)<>24 or
    (select count(distinct c->>'slug') from jsonb_array_elements(p_catalog) c)<>24 or
    exists(select 1 from jsonb_array_elements(p_catalog) c where coalesce(c->>'slug','')='' or coalesce(c->>'version','')='')
 then raise exception 'Full catalogue required'; end if;
 insert into wonderlab_orders(parent_id,child_id,mission_slug,content_version,amount,terms_version,state,granted_at,grant_reason)
 select p_parent,p_child,c->>'slug',coalesce(
   (select content_version from wonderlab_progress where child_id=p_child and mission_slug=c->>'slug'),c->>'version'),
   0,'complimentary-lifetime-v1','granted',now(),'Complimentary lifetime family access'
 from jsonb_array_elements(p_catalog) c
 on conflict (child_id,mission_slug) where membership_id is null do nothing;
 select count(*) into granted from wonderlab_orders where child_id=p_child and parent_id=p_parent and state='granted'
 and mission_slug in (select c->>'slug' from jsonb_array_elements(p_catalog) c);
 if granted<>24 then raise exception 'Existing lesson purchase needs separate review'; end if;
 return granted;
end $$;
revoke all on function public.wonderlab_grant_lifetime_access(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.wonderlab_grant_lifetime_access(uuid,uuid,jsonb) to service_role;

create or replace function public.wonderlab_save_progress(p_child uuid,p_parent uuid,p_slug text,p_version text,p_revision integer,p_answers jsonb,p_creation text,p_checks jsonb,p_passed jsonb,p_completed boolean)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare r wonderlab_progress; begin
 perform 1 from wonderlab_children where id=p_child and parent_id=p_parent and deletion_requested_at is null for update;
 if not found then raise exception 'Child unavailable'; end if;
 perform 1 from wonderlab_orders where child_id=p_child and parent_id=p_parent and mission_slug=p_slug and (state='granted' or (state='paid' and expires_at>now())) and content_version=p_version;
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
 if not found or not coalesce(o.state='granted' or (o.state='paid' and o.expires_at>now()),false) then raise exception 'Access unavailable'; end if;
 perform 1 from wonderlab_children where id=p_child and ai_enabled and band in ('creators','studio') and deletion_requested_at is null;
 if not found then raise exception 'AI unavailable'; end if;
 -- Complimentary access has the same bounded allowance, renewed each UTC calendar month.
 if o.state='granted' and o.generation_period_start is distinct from date_trunc('month',now() at time zone 'UTC') at time zone 'UTC' then
  update wonderlab_generations set state='failed',finished_at=now() where order_id=o.id and state='pending';
  update wonderlab_orders set generations_used=0,generation_period_start=date_trunc('month',now() at time zone 'UTC') at time zone 'UTC' where id=o.id;
  o.generations_used:=0;
 end if;
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
 if p_response is null or (o.state='granted' and g.created_at < date_trunc('month',now() at time zone 'UTC') at time zone 'UTC') or g.created_at<=now()-interval '3 minutes' or not coalesce(o.state='granted' or (o.state='paid' and o.expires_at>now()),false) or o.generations_used>=30 or not exists(select 1 from wonderlab_children where id=o.child_id and ai_enabled and band in ('creators','studio') and deletion_requested_at is null) then
  update wonderlab_generations set state='failed',finished_at=now() where id=p_id; return false;
 end if;
 update wonderlab_orders set generations_used=generations_used+1 where id=o.id;
 update wonderlab_generations set state='succeeded',response=p_response,input_tokens=greatest(0,p_input_tokens),output_tokens=greatest(0,p_output_tokens),estimated_cost_microusd=p_cost_microusd,finished_at=now() where id=p_id;
 return true;
end $$;
