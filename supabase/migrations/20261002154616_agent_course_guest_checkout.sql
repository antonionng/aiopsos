-- Pay first, then save a learning account. Guest records are service-only.
create table public.agent_course_guest_checkouts (
 id uuid primary key default gen_random_uuid(), request_key uuid not null unique,
 token_hash text not null check(length(token_hash)=64), payment_id text not null unique,
 course_slug text not null references public.agent_course_offers(slug), title text not null,
 version_id uuid not null references public.lms_course_versions(id), template_programme_id uuid not null references public.lms_programmes(id),
 delivery_plan jsonb not null, learning_pack jsonb not null, terms_version text not null,
 amount integer not null check(amount=9900), currency text not null check(currency='GBP'),
 status text not null default 'pending' check(status in ('pending','paid','failed','voided','refunded')),
 stripe_session_id text unique, stripe_intent_id text unique, hosted_url text,
 email text, buyer_name text, paid_at timestamptz, order_id uuid unique references public.agent_course_orders(id),
 created_at timestamptz not null default now()
);
alter table public.agent_course_guest_checkouts enable row level security;
revoke all on public.agent_course_guest_checkouts from public,anon,authenticated;
grant all on public.agent_course_guest_checkouts to service_role;

create function public.agent_course_guest_reserve(p_slug text,p_request uuid,p_hash text,p_terms text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare g public.agent_course_guest_checkouts%rowtype; o public.agent_course_offers%rowtype; t public.lms_programmes%rowtype; d public.lms_delivery_plans%rowtype;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_request::text,9921));
 select * into g from public.agent_course_guest_checkouts where request_key=p_request for update;
 if g.id is not null then
  if g.token_hash<>p_hash or g.course_slug<>p_slug or g.terms_version<>p_terms then raise exception 'Checkout request does not match' using errcode='42501'; end if;
  return to_jsonb(g);
 end if;
 select * into o from public.agent_course_offers where slug=p_slug and active and assessment_ready and assessment_mode='ai' for share;
 if o.slug is null then raise exception 'This course is not available to buy' using errcode='P0002'; end if;
 if o.terms_version<>p_terms then raise exception 'The course terms have changed. Refresh the page before paying' using errcode='PT409'; end if;
 if o.learning_pack is null or o.learning_pack->>'slug' is distinct from o.slug then raise exception 'The learning pack is not ready' using errcode='PT409'; end if;
 select * into t from public.lms_programmes where id=o.template_programme_id and status='active' and client_org_id is null for share;
 select * into d from public.lms_delivery_plans where programme_id=t.id and released_at is not null for share;
 if t.id is null or t.version_ids is distinct from array[o.version_id] or d.programme_id is null then raise exception 'Course delivery is not ready' using errcode='PT409'; end if;
 insert into public.agent_course_guest_checkouts(request_key,token_hash,payment_id,course_slug,title,version_id,template_programme_id,delivery_plan,learning_pack,terms_version,amount,currency)
 values(p_request,p_hash,'pay_course_'||gen_random_uuid()::text,o.slug,o.title,o.version_id,t.id,d.content,o.learning_pack,o.terms_version,o.amount,o.currency) returning * into g;
 return to_jsonb(g);
end $$;

create function public.agent_course_guest_payment(p_event text,p_payment text,p_type text,p_amount integer,p_currency text,p_session text,p_intent text,p_email text,p_name text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare g public.agent_course_guest_checkouts%rowtype;
begin
 select * into g from public.agent_course_guest_checkouts where payment_id=p_payment for update;
 if g.id is null then raise exception 'Checkout not found' using errcode='P0002'; end if;
 if g.amount<>p_amount or g.currency<>upper(p_currency) or (g.stripe_session_id is not null and p_session is not null and g.stripe_session_id<>p_session) or (g.stripe_intent_id is not null and p_intent is not null and g.stripe_intent_id<>p_intent) then raise exception 'Payment does not match checkout' using errcode='PT409'; end if;
 if p_type='captured' and g.status in ('pending','failed','voided') then
  if nullif(trim(p_email),'') is null then raise exception 'Payment email is missing'; end if;
  update public.agent_course_guest_checkouts set status='paid',email=lower(trim(p_email)),buyer_name=p_name,paid_at=now(),stripe_session_id=coalesce(stripe_session_id,p_session),stripe_intent_id=coalesce(stripe_intent_id,p_intent) where id=g.id returning * into g;
 elsif p_type='refunded' then
  update public.agent_course_guest_checkouts set status='refunded' where id=g.id returning * into g;
  if g.order_id is not null then perform public.agent_course_payment_event(p_event,'payment.refunded',p_payment,p_amount,upper(p_currency),'refunded'); end if;
 elsif p_type in ('failed','voided') and g.status='pending' then
  update public.agent_course_guest_checkouts set status=p_type where id=g.id returning * into g;
 end if;
 return jsonb_build_object('id',g.id,'status',g.status);
end $$;

-- Claim is atomic, checks a verified auth email and never transfers another account's order.
create function public.agent_course_guest_claim(p_guest uuid,p_hash text,p_actor uuid)
returns uuid language plpgsql security invoker set search_path='' as $$
declare g public.agent_course_guest_checkouts%rowtype; u public.user_profiles%rowtype; org uuid; oid uuid;
begin
 select * into g from public.agent_course_guest_checkouts where id=p_guest and token_hash=p_hash for update;
 if g.id is null or g.status<>'paid' then raise exception 'A confirmed purchase is required' using errcode='42501'; end if;
 if not exists(select 1 from auth.users where id=p_actor and lower(email)=g.email and email_confirmed_at is not null and (banned_until is null or banned_until<now())) then raise exception 'Sign in with the email used at checkout' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_actor::text,9910));
 if g.order_id is not null then
  if not exists(select 1 from public.agent_course_orders where id=g.order_id and user_id=p_actor and status='captured') then raise exception 'This course belongs to another account' using errcode='42501'; end if;
  return g.order_id;
 end if;
 if g.paid_at + interval '12 months' <= now() then raise exception 'Your 12 months of access have ended' using errcode='PT409'; end if;
 select * into u from public.user_profiles where id=p_actor for update;
 if u.id is null then raise exception 'Save your learning account first'; end if;
 org:=u.org_id;
 if org is null then
  -- Existing suspended memberships must never be bypassed through a purchase.
  if exists(select 1 from public.organisation_memberships where user_id=p_actor) then raise exception 'Your workspace needs to be checked. Contact Experrt' using errcode='42501'; end if;
  insert into public.organisations(name) values('Personal learning') returning id into org;
  update public.user_profiles set org_id=org where id=p_actor;
  insert into public.organisation_memberships(user_id,org_id,role,status,source) values(p_actor,org,'learner','active','direct');
 end if;
 perform public.lms_assert_workspace(p_actor,org,false);
 if exists(select 1 from public.lms_programmes where id=g.template_programme_id and org_id=org) then raise exception 'Use your personal learning account for this course' using errcode='42501'; end if;
 insert into public.agent_course_orders(course_slug,user_id,org_id,request_key,payment_id,title,version_id,template_programme_id,delivery_plan,terms_version,amount,currency,payment_provider,assessment_mode,learning_pack,stripe_session_id,stripe_intent_id,hosted_url)
 values(g.course_slug,p_actor,org,g.id,g.payment_id,g.title,g.version_id,g.template_programme_id,g.delivery_plan,g.terms_version,g.amount,g.currency,'stripe','ai',g.learning_pack,g.stripe_session_id,g.stripe_intent_id,g.hosted_url) returning id into oid;
 perform public.agent_course_payment_event('guest_claim_'||g.id::text,'payment.captured',g.payment_id,g.amount,g.currency,'captured');
 update public.agent_course_orders set captured_at=g.paid_at where id=oid;
 update public.agent_course_guest_checkouts set order_id=oid where id=g.id;
 return oid;
end $$;
revoke all on function public.agent_course_guest_reserve(text,uuid,text,text),public.agent_course_guest_payment(text,text,text,integer,text,text,text,text,text),public.agent_course_guest_claim(uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.agent_course_guest_reserve(text,uuid,text,text),public.agent_course_guest_payment(text,text,text,integer,text,text,text,text,text),public.agent_course_guest_claim(uuid,text,uuid) to service_role;
