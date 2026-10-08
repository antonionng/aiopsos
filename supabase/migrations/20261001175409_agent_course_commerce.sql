-- Course purchases are separate from organisation credit wallets and cohort fees.
-- These service-only records grant one learner a copy of a reviewed delivery programme.
create table public.agent_course_offers (
 slug text primary key, title text not null,
 version_id uuid not null references public.lms_course_versions(id),
 template_programme_id uuid not null references public.lms_programmes(id),
 amount integer not null default 9900 check(amount=9900), currency text not null default 'GBP' check(currency='GBP'),
 terms_version text not null, terms_url text not null check(terms_url ~ '^https://'), assessment_ready boolean not null default false,
 active boolean not null default false, created_at timestamptz not null default now()
);
create table public.agent_course_orders (
 id uuid primary key default gen_random_uuid(), course_slug text not null references public.agent_course_offers(slug),
 user_id uuid not null references public.user_profiles(id), org_id uuid not null references public.organisations(id),
 payment_provider text not null default 'mooov' check(payment_provider in ('mooov','stripe')),
 request_key uuid not null, payment_id text not null unique check(payment_id ~ '^pay_course_[0-9a-f-]{36}$'),
 title text not null, version_id uuid not null references public.lms_course_versions(id),
 template_programme_id uuid not null references public.lms_programmes(id),
 delivery_plan jsonb not null, terms_version text not null,
 amount integer not null check(amount=9900), currency text not null check(currency='GBP'),
 status text not null default 'pending' check(status in ('pending','captured','failed','voided','refunded')),
 hosted_url text, programme_id uuid references public.lms_programmes(id), assignment_id uuid references public.lms_assignments(id),
 created_at timestamptz not null default now(), captured_at timestamptz,
 unique(user_id,request_key), check(status <> 'captured' or assignment_id is not null)
);
create unique index agent_course_open_order on public.agent_course_orders(user_id,course_slug) where status='pending';
create index agent_course_order_org on public.agent_course_orders(org_id);
create index agent_course_order_assignment on public.agent_course_orders(assignment_id);
create table public.agent_course_payment_events (
 event_id text primary key, payment_id text not null references public.agent_course_orders(payment_id),
 event_type text not null, created_at timestamptz not null default now()
);
do $$ declare t text; begin
 foreach t in array array['agent_course_offers','agent_course_orders','agent_course_payment_events'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant all on public.%I to service_role',t);
 end loop;
end $$;

create function public.agent_course_reserve_order(p_actor uuid,p_org uuid,p_slug text,p_request uuid,p_terms text,p_provider text default 'mooov')
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.agent_course_orders%rowtype; offer public.agent_course_offers%rowtype;
 template public.lms_programmes%rowtype; plan public.lms_delivery_plans%rowtype;
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 if p_provider not in ('mooov','stripe') then raise exception 'Unknown payment provider'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_actor::text,9910));
 select * into o from public.agent_course_orders where user_id=p_actor and request_key=p_request for update;
 if o.id is not null then
  if o.org_id<>p_org or o.course_slug<>p_slug or o.terms_version<>p_terms then raise exception 'This request belongs to different work' using errcode='PT409'; end if;
  return to_jsonb(o);
 end if;
 select * into offer from public.agent_course_offers where slug=p_slug and active and assessment_ready for share;
 if offer.slug is null then raise exception 'This course is not yet available to buy' using errcode='P0002'; end if;
 if offer.terms_version<>p_terms then raise exception 'Read the current course terms before paying' using errcode='PT409'; end if;
 select * into template from public.lms_programmes where id=offer.template_programme_id and status='active' and client_org_id is null for share;
 if template.id is null or template.version_ids is distinct from array[offer.version_id] or
 not exists(select 1 from public.lms_course_versions where id=offer.version_id and org_id=template.org_id) then
  raise exception 'Course delivery needs to be checked before enrolment' using errcode='PT409';
 end if;
 if template.org_id=p_org then raise exception 'Use the internal learning workspace for provider accounts' using errcode='42501'; end if;
 select * into plan from public.lms_delivery_plans where programme_id=template.id and released_at is not null for share;
 if plan.programme_id is null or not exists(select 1 from public.lms_delivery_staff where programme_id=template.id and role='reviewer' and state='accepted' and user_id<>p_actor) then
  raise exception 'Practical assessment is not ready for enrolment' using errcode='PT409';
 end if;
 select * into o from public.agent_course_orders where user_id=p_actor and course_slug=p_slug and status in ('pending','captured') order by (status='captured') desc,created_at desc limit 1 for update;
 if o.id is not null then
  if o.org_id<>p_org then raise exception 'Return to the workspace used for this purchase' using errcode='PT409'; end if;
  return to_jsonb(o);
 end if;
 insert into public.agent_course_orders(course_slug,user_id,org_id,request_key,payment_id,title,version_id,template_programme_id,delivery_plan,terms_version,amount,currency,payment_provider)
 values(offer.slug,p_actor,p_org,p_request,'pay_course_'||gen_random_uuid()::text,offer.title,offer.version_id,template.id,plan.content,offer.terms_version,offer.amount,offer.currency,p_provider) returning * into o;
 return to_jsonb(o);
end $$;
revoke all on function public.agent_course_reserve_order(uuid,uuid,text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.agent_course_reserve_order(uuid,uuid,text,uuid,text,text) to service_role;

-- The event receipt, paid order and learning assignment commit in one transaction.
-- A failed transaction leaves no receipt, so the provider can safely retry it.
create function public.agent_course_payment_event(p_event text,p_type text,p_payment text,p_amount integer default null,p_currency text default null,p_state text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.agent_course_orders%rowtype; template public.lms_programmes%rowtype;
 receipt public.agent_course_payment_events%rowtype; paid public.agent_course_orders%rowtype; programme uuid; assignment uuid;
begin
 select * into o from public.agent_course_orders where payment_id=p_payment;
 if o.id is not null then perform pg_advisory_xact_lock(hashtextextended(o.user_id::text,9910)); end if;
 select * into o from public.agent_course_orders where payment_id=p_payment for update;
 if o.id is null then raise exception 'Course order not found' using errcode='P0002'; end if;
 if (p_amount is not null and p_amount<>o.amount) or (p_currency is not null and p_currency<>o.currency) then raise exception 'Payment amount or currency does not match the order' using errcode='PT409'; end if;
 if p_type in ('payment.captured','payment.succeeded') and p_state is not null and p_state<>'captured' then raise exception 'Payment capture is not confirmed' using errcode='PT409'; end if;
 select * into receipt from public.agent_course_payment_events where event_id=p_event;
 if receipt.event_id is not null then
  if receipt.payment_id<>p_payment or receipt.event_type<>p_type then raise exception 'Payment event identity changed' using errcode='PT409'; end if;
  return jsonb_build_object('duplicate',true,'status',o.status,'assignment_id',o.assignment_id);
 end if;
 if p_type in ('payment.captured','payment.succeeded') and o.status in ('pending','failed','voided') then
  select * into paid from public.agent_course_orders where user_id=o.user_id and course_slug=o.course_slug and version_id=o.version_id and status='captured' order by created_at limit 1;
  if paid.id is not null then
   programme:=paid.programme_id; assignment:=paid.assignment_id;
  else
  select * into template from public.lms_programmes where id=o.template_programme_id;
  if not exists(select 1 from public.lms_delivery_staff where programme_id=template.id and role='reviewer' and state='accepted' and user_id<>o.user_id) then
   raise exception 'Assign a reviewer before completing this paid enrolment' using errcode='PT409';
  end if;
  insert into public.lms_programmes(org_id,title,goal,version_ids,created_by)
  values(template.org_id,o.title,template.goal,array[o.version_id],template.created_by) returning id into programme;
  insert into public.lms_delivery_plans(programme_id,content,provider_approved_by,released_at,updated_by)
  values(programme,o.delivery_plan,template.created_by,now(),template.created_by);
  insert into public.lms_delivery_staff(programme_id,user_id,role,state,invited_by,accepted_at)
  select programme,user_id,role,state,invited_by,accepted_at from public.lms_delivery_staff where programme_id=template.id and state='accepted' and user_id<>o.user_id;
  insert into public.lms_assignments(programme_id,org_id,user_id) values(programme,o.org_id,o.user_id) returning id into assignment;
  end if;
  update public.agent_course_orders set status='captured',captured_at=now(),programme_id=programme,assignment_id=assignment where id=o.id returning * into o;
 elsif p_type='payment.refunded' then
  -- Keep the learning record and evidence; stop further work on the refunded programme.
  update public.agent_course_orders set status='refunded' where id=o.id returning * into o;
  if o.programme_id is not null and not exists(select 1 from public.agent_course_orders where programme_id=o.programme_id and status='captured') then update public.lms_programmes set status='archived' where id=o.programme_id; end if;
 elsif p_type in ('payment.failed','payment.voided') and o.status='pending' then
  update public.agent_course_orders set status=case when p_type='payment.failed' then 'failed' else 'voided' end where id=o.id returning * into o;
 end if;
 insert into public.agent_course_payment_events(event_id,payment_id,event_type) values(p_event,p_payment,p_type);
 return jsonb_build_object('status',o.status,'assignment_id',o.assignment_id);
end $$;
revoke all on function public.agent_course_payment_event(text,text,text,integer,text,text) from public,anon,authenticated;
grant execute on function public.agent_course_payment_event(text,text,text,integer,text,text) to service_role;
