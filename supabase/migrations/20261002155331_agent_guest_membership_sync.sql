-- Respect the existing profile membership synchronisation trigger.
create or replace function public.agent_course_guest_claim(p_guest uuid,p_hash text,p_actor uuid)
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
  insert into public.organisation_memberships(user_id,org_id,role,status,source) values(p_actor,org,'learner','active','direct') on conflict(user_id,org_id) do nothing;
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
