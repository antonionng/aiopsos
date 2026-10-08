-- Membership billing is separate from legacy one-off lesson purchases.
create table public.wonderlab_memberships (
 id uuid primary key default gen_random_uuid(),
 parent_id uuid not null references auth.users(id),
 child_id uuid not null references public.wonderlab_children(id),
 terms_version text not null,
 state text not null default 'pending' check(state in ('pending','incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused')),
 stripe_subscription_id text unique,
 stripe_customer_id text,
 stripe_session_id text unique,
 cancel_at_period_end boolean not null default false,
 ended_at timestamptz,
 paid_until timestamptz,
 allowance_period_start timestamptz,
 last_event_created bigint not null default 0,
 created_at timestamptz not null default now()
);
create unique index wonderlab_one_live_membership on public.wonderlab_memberships(child_id)
 where state not in ('canceled','incomplete_expired');
create table public.wonderlab_membership_invoices (
 invoice_id text primary key,
 membership_id uuid not null references public.wonderlab_memberships(id),
 period_start timestamptz not null,
 period_end timestamptz not null,
 state text not null check(state in ('paid','refunded')),
 check(period_end > period_start)
);
create table public.wonderlab_membership_events (
 event_id text primary key,
 membership_id uuid not null references public.wonderlab_memberships(id),
 created_at timestamptz not null default now()
);
alter table public.wonderlab_orders add column membership_id uuid references public.wonderlab_memberships(id);
alter table public.wonderlab_orders drop constraint wonderlab_orders_child_id_mission_slug_key;
alter table public.wonderlab_orders drop constraint wonderlab_orders_amount_check;
alter table public.wonderlab_orders add constraint wonderlab_orders_amount_check
 check((membership_id is null and amount=2000) or (membership_id is not null and amount=0));
create unique index wonderlab_legacy_lesson_order on public.wonderlab_orders(child_id,mission_slug) where membership_id is null;
create unique index wonderlab_membership_lesson on public.wonderlab_orders(membership_id,mission_slug);

alter table public.wonderlab_memberships enable row level security;
alter table public.wonderlab_membership_invoices enable row level security;
alter table public.wonderlab_membership_events enable row level security;
revoke all on public.wonderlab_memberships,public.wonderlab_membership_invoices,public.wonderlab_membership_events from public,anon,authenticated;
grant all on public.wonderlab_memberships,public.wonderlab_membership_invoices,public.wonderlab_membership_events to service_role;

-- Only verified Stripe events reach this RPC. One lock serialises renewals,
-- duplicate deliveries, quota resets and refunds for the child's membership.
create function public.wonderlab_membership_event(
 p_event text, p_membership uuid, p_created bigint, p_subscription text,
 p_customer text, p_state text, p_cancel boolean, p_ended timestamptz,
 p_invoice text default null, p_kind text default null,
 p_start timestamptz default null, p_end timestamptz default null,
 p_amount integer default null, p_currency text default null,
 p_catalog jsonb default '[]'::jsonb
) returns void language plpgsql security invoker set search_path=public,pg_temp as $$
declare m public.wonderlab_memberships; until_date timestamptz; latest_start timestamptz;
begin
 select * into m from public.wonderlab_memberships where id=p_membership for update;
 if not found then raise exception 'Membership missing'; end if;
 if exists(select 1 from public.wonderlab_membership_events where event_id=p_event) then return; end if;
 if p_subscription is null or p_customer is null or
    (m.stripe_subscription_id is not null and m.stripe_subscription_id<>p_subscription) or
    (m.stripe_customer_id is not null and m.stripe_customer_id<>p_customer) then
   raise exception 'Membership identity mismatch';
 end if;
 if not exists(select 1 from public.wonderlab_children where id=m.child_id and parent_id=m.parent_id) then
   raise exception 'Child ownership mismatch';
 end if;
 if p_created >= m.last_event_created and m.state not in ('canceled','incomplete_expired') then
   update public.wonderlab_memberships set state=p_state,stripe_subscription_id=p_subscription,
    stripe_customer_id=p_customer,cancel_at_period_end=p_cancel,ended_at=p_ended,last_event_created=p_created
    where id=m.id;
 end if;
 if p_invoice is not null then
   if p_kind is null or p_kind not in ('paid','refunded') or p_amount is null or p_amount<>2000 or p_currency is null or p_currency<>'gbp' or
      p_start is null or p_end is null or p_end<=p_start or p_end>p_start+interval '32 days' then
     raise exception 'Invalid membership payment';
   end if;
   if exists(select 1 from public.wonderlab_membership_invoices where invoice_id=p_invoice and membership_id<>m.id) then
     raise exception 'Invoice ownership mismatch';
   end if;
   insert into public.wonderlab_membership_invoices(invoice_id,membership_id,period_start,period_end,state)
    values(p_invoice,m.id,p_start,p_end,p_kind)
    on conflict(invoice_id) do update set state=case
     when wonderlab_membership_invoices.state='refunded' then 'refunded' else excluded.state end;
 end if;
 select max(period_end),max(period_start) into until_date,latest_start
  from public.wonderlab_membership_invoices where membership_id=m.id and state='paid';
 select * into m from public.wonderlab_memberships where id=m.id;
 if until_date is not null and m.ended_at is not null then until_date:=least(until_date,m.ended_at); end if;
 update public.wonderlab_memberships set paid_until=until_date where id=m.id;
 if latest_start is not null and (m.allowance_period_start is null or latest_start>m.allowance_period_start) then
   perform id from public.wonderlab_orders where membership_id=m.id order by id for update;
   -- Old in-flight requests must not consume a renewed month's allowance.
   update public.wonderlab_generations set state='failed',finished_at=now()
    where state='pending' and order_id in(select id from public.wonderlab_orders where membership_id=m.id);
   update public.wonderlab_orders set generations_used=0 where membership_id=m.id;
   update public.wonderlab_memberships set allowance_period_start=latest_start where id=m.id;
 end if;
 update public.wonderlab_orders set expires_at=until_date,
   state=case when until_date is null then 'refunded' else 'paid' end where membership_id=m.id;
 if until_date>now() then
   if jsonb_array_length(p_catalog)<>24 then raise exception 'Full catalogue required'; end if;
   insert into public.wonderlab_orders(parent_id,child_id,mission_slug,content_version,terms_version,
     state,amount,membership_id,purchased_at,expires_at)
   select m.parent_id,m.child_id,c->>'slug',coalesce(
      (select content_version from public.wonderlab_progress where child_id=m.child_id and mission_slug=c->>'slug'),c->>'version'),
     m.terms_version,'paid',0,m.id,now(),until_date from jsonb_array_elements(p_catalog) c
   on conflict(membership_id,mission_slug) do update set expires_at=excluded.expires_at,state='paid';
 end if;
 insert into public.wonderlab_membership_events(event_id,membership_id) values(p_event,m.id);
end $$;
revoke all on function public.wonderlab_membership_event(text,uuid,bigint,text,text,text,boolean,timestamptz,text,text,timestamptz,timestamptz,integer,text,jsonb) from public,anon,authenticated;
grant execute on function public.wonderlab_membership_event(text,uuid,bigint,text,text,text,boolean,timestamptz,text,text,timestamptz,timestamptz,integer,text,jsonb) to service_role;
