-- Keep the historical payment table and ledger foreign keys intact.
-- New card payments use Stripe; existing Mooov rows retain their provider.
alter table public.mooov_payments add column if not exists provider text not null default 'mooov' check(provider in ('mooov','stripe')),
 add column if not exists stripe_session_id text unique,
 add column if not exists stripe_intent_id text unique,
 add column if not exists checkout_title text,
 add column if not exists credit_quantity integer check(credit_quantity>0);
alter table public.agent_course_orders add column if not exists stripe_session_id text unique,
 add column if not exists stripe_intent_id text unique;
create table if not exists public.stripe_payment_events (
 event_id text primary key, payment_id text not null, event_type text not null, created_at timestamptz not null default now()
);
alter table public.stripe_payment_events enable row level security;
revoke all on public.stripe_payment_events from public,anon,authenticated;
grant all on public.stripe_payment_events to service_role;

create function public.academy_reserve_stripe_payment(p_actor uuid,p_org uuid,p_purpose text,p_item uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare payment public.mooov_payments%rowtype; amount integer; currency text; credits integer; title text;
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 if not exists(select 1 from public.user_profiles where id=p_actor and role in ('admin','manager','super_admin'))
 and not exists(select 1 from public.organisations where id=p_org and owner_id=p_actor) then
  raise exception 'An organisation administrator or owner is required to pay' using errcode='42501';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_org::text||p_item::text||p_purpose,9920));
 if p_purpose='credit_pack' then
  select c.price_amount,c.currency,c.credits,c.name||' AI credits' into amount,currency,credits,title from public.credit_packs c where c.id=p_item and c.active;
 elsif p_purpose='cohort' then
  select c.price_amount,c.currency,c.title into amount,currency,title from public.cohorts c where c.id=p_item and c.org_id=p_org and c.paid_at is null;
 else raise exception 'Unknown payment purpose' using errcode='22023'; end if;
 if amount is null or amount<=0 then raise exception 'This item is unavailable or has no price' using errcode='P0002'; end if;
 select * into payment from public.mooov_payments where org_id=p_org and provider='stripe' and purpose=p_purpose and status='pending'
  and (case when p_purpose='credit_pack' then pack_id=p_item else cohort_id=p_item end) order by created_at desc limit 1 for update;
 if payment.id is not null then return to_jsonb(payment); end if;
 insert into public.mooov_payments(payment_id,org_id,initiated_by,purpose,pack_id,cohort_id,amount,currency,provider,credit_quantity,checkout_title)
 values('stripe_'||gen_random_uuid()::text,p_org,p_actor,p_purpose,case when p_purpose='credit_pack' then p_item end,case when p_purpose='cohort' then p_item end,amount,currency,'stripe',credits,title)
 returning * into payment;
 return to_jsonb(payment);
end $$;
revoke all on function public.academy_reserve_stripe_payment(uuid,uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.academy_reserve_stripe_payment(uuid,uuid,text,uuid) to service_role;

-- Receipt and side effects commit together; a database failure stays retryable.
create function public.academy_stripe_payment_event(p_event text,p_type text,p_payment text,p_amount integer,p_currency text,p_session text default null,p_intent text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare payment public.mooov_payments%rowtype; receipt public.stripe_payment_events%rowtype;
begin
 select * into payment from public.mooov_payments where payment_id=p_payment and provider='stripe';
 if payment.id is not null then perform pg_advisory_xact_lock(hashtextextended(payment.org_id::text||coalesce(payment.pack_id,payment.cohort_id)::text||payment.purpose,9920)); end if;
 select * into payment from public.mooov_payments where payment_id=p_payment and provider='stripe' for update;
 if payment.id is null then raise exception 'Stripe payment record not found' using errcode='P0002'; end if;
 if p_amount<>payment.amount or upper(p_currency)<>upper(payment.currency) or p_amount is null or p_currency is null then raise exception 'Payment amount or currency does not match' using errcode='22023'; end if;
 if payment.stripe_session_id is not null and p_session is not null and payment.stripe_session_id<>p_session then raise exception 'Checkout session does not match' using errcode='22023'; end if;
 if payment.stripe_intent_id is not null and p_intent is not null and payment.stripe_intent_id<>p_intent then raise exception 'Payment intent does not match' using errcode='22023'; end if;
 select * into receipt from public.stripe_payment_events where event_id=p_event;
 if receipt.event_id is not null then
  if receipt.payment_id<>p_payment or receipt.event_type<>p_type then raise exception 'Event identity changed' using errcode='22023'; end if;
  return jsonb_build_object('duplicate',true);
 end if;
 if p_type='captured' and payment.status in ('pending','failed','voided') then
  if payment.purpose='credit_pack' then
   if payment.credit_quantity is null then raise exception 'Credit quantity was not recorded'; end if;
   perform public.academy_apply_credit_delta(p_org=>payment.org_id,p_delta=>payment.credit_quantity,p_reason=>'purchase',p_payment=>payment.id,p_description=>'Stripe credit pack purchase');
  elsif payment.purpose='cohort' then
   update public.cohorts set paid_at=coalesce(paid_at,now()) where id=payment.cohort_id and org_id=payment.org_id;
   if not found then raise exception 'Cohort no longer matches the payment'; end if;
  end if;
  update public.mooov_payments set status='captured',captured_at=now(),stripe_session_id=coalesce(stripe_session_id,p_session),stripe_intent_id=coalesce(stripe_intent_id,p_intent) where id=payment.id;
 elsif p_type='refunded' then
  if payment.status='captured' and payment.purpose='credit_pack' then
   perform public.academy_apply_credit_delta(p_org=>payment.org_id,p_delta=>-payment.credit_quantity,p_reason=>'refund',p_payment=>payment.id,p_description=>'Stripe credit pack refund');
  elsif payment.status='captured' and payment.purpose='cohort' then
   update public.cohorts set paid_at=null where id=payment.cohort_id and not exists(select 1 from public.mooov_payments where cohort_id=payment.cohort_id and status='captured' and id<>payment.id);
  end if;
  update public.mooov_payments set status='refunded' where id=payment.id;
 elsif p_type in ('failed','voided') and payment.status='pending' then
  update public.mooov_payments set status=p_type where id=payment.id;
 end if;
 insert into public.stripe_payment_events(event_id,payment_id,event_type) values(p_event,p_payment,p_type);
 return jsonb_build_object('received',true);
end $$;
revoke all on function public.academy_stripe_payment_event(text,text,text,integer,text,text,text) from public,anon,authenticated;
grant execute on function public.academy_stripe_payment_event(text,text,text,integer,text,text,text) to service_role;
-- The wallet writer is service-only; explicitly allow the service role to call it.
grant execute on function public.academy_apply_credit_delta(uuid,integer,text,uuid,uuid,uuid,uuid,text,text,uuid) to service_role;
