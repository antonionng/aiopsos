-- AI assessment is explicit and separate from existing human-reviewed programmes.
alter table public.agent_course_offers add column assessment_mode text not null default 'human' check(assessment_mode in ('human','ai')),
 add column learning_pack jsonb;
alter table public.agent_course_orders add column assessment_mode text not null default 'human' check(assessment_mode in ('human','ai')),
 add column learning_pack jsonb;
create table public.agent_course_work (
 order_id uuid primary key references public.agent_course_orders(id), work jsonb not null default '{}', updated_at timestamptz not null default now()
);
create table public.agent_course_assessments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.agent_course_orders(id),
 request_key uuid not null, submission jsonb not null, state text not null default 'running' check(state in ('running','complete','failed')),
 result jsonb, model text, error text, input_tokens integer, output_tokens integer,
 created_at timestamptz not null default now(), finished_at timestamptz, unique(order_id,request_key)
);
create index agent_assessment_order on public.agent_course_assessments(order_id,created_at desc);
create table public.agent_course_certificates (
 order_id uuid primary key references public.agent_course_orders(id), public_ref uuid not null unique default gen_random_uuid(),
 assessment_id uuid not null references public.agent_course_assessments(id), learner_name text not null,
 snapshot jsonb not null, issued_at timestamptz not null default now()
);
create table public.agent_course_report_emails (
 assessment_id uuid primary key references public.agent_course_assessments(id),
 sent_at timestamptz, claimed_at timestamptz, attempts integer not null default 0, error text,
 created_at timestamptz not null default now()
);
do $$ declare t text; begin
 foreach t in array array['agent_course_work','agent_course_assessments','agent_course_certificates','agent_course_report_emails'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant all on public.%I to service_role',t);
 end loop;
end $$;
create or replace function public.agent_course_reserve_order(p_actor uuid,p_org uuid,p_slug text,p_request uuid,p_terms text,p_provider text default 'mooov')
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
 if offer.assessment_mode='ai' and (offer.learning_pack is null or offer.learning_pack->>'slug' is distinct from offer.slug) then raise exception 'The course learning pack is not ready' using errcode='PT409'; end if;
 if offer.terms_version<>p_terms then raise exception 'Read the current course terms before paying' using errcode='PT409'; end if;
 select * into template from public.lms_programmes where id=offer.template_programme_id and status='active' and client_org_id is null for share;
 if template.id is null or template.version_ids is distinct from array[offer.version_id] or
 not exists(select 1 from public.lms_course_versions where id=offer.version_id and org_id=template.org_id) then
  raise exception 'Course delivery needs to be checked before enrolment' using errcode='PT409';
 end if;
 if template.org_id=p_org then raise exception 'Use the internal learning workspace for provider accounts' using errcode='42501'; end if;
 select * into plan from public.lms_delivery_plans where programme_id=template.id and released_at is not null for share;
 if plan.programme_id is null or (offer.assessment_mode='human' and not exists(select 1 from public.lms_delivery_staff where programme_id=template.id and role='reviewer' and state='accepted' and user_id<>p_actor)) then
  raise exception 'Practical assessment is not ready for enrolment' using errcode='PT409';
 end if;
 select * into o from public.agent_course_orders where user_id=p_actor and course_slug=p_slug and status in ('pending','captured') order by (status='captured') desc,created_at desc limit 1 for update;
 if o.id is not null then
  if o.org_id<>p_org then raise exception 'Return to the workspace used for this purchase' using errcode='PT409'; end if;
  return to_jsonb(o);
 end if;
 insert into public.agent_course_orders(course_slug,user_id,org_id,request_key,payment_id,title,version_id,template_programme_id,delivery_plan,terms_version,amount,currency,payment_provider,assessment_mode,learning_pack)
 values(offer.slug,p_actor,p_org,p_request,'pay_course_'||gen_random_uuid()::text,offer.title,offer.version_id,template.id,plan.content,offer.terms_version,offer.amount,offer.currency,p_provider,offer.assessment_mode,offer.learning_pack) returning * into o;
 return to_jsonb(o);
end $$;
revoke all on function public.agent_course_reserve_order(uuid,uuid,text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.agent_course_reserve_order(uuid,uuid,text,uuid,text,text) to service_role;

-- The event receipt, paid order and learning assignment commit in one transaction.
-- A failed transaction leaves no receipt, so the provider can safely retry it.
create or replace function public.agent_course_payment_event(p_event text,p_type text,p_payment text,p_amount integer default null,p_currency text default null,p_state text default null)
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
  if o.assessment_mode='human' and not exists(select 1 from public.lms_delivery_staff where programme_id=template.id and role='reviewer' and state='accepted' and user_id<>o.user_id) then
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

-- An order lock makes attempt limits and idempotency durable across servers.
create function public.agent_course_assessment_start(p_actor uuid,p_org uuid,p_order uuid,p_request uuid,p_submission jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.agent_course_orders%rowtype; a public.agent_course_assessments%rowtype;
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 select * into o from public.agent_course_orders where id=p_order and user_id=p_actor and org_id=p_org for update;
 if o.id is null or o.status<>'captured' or o.assessment_mode<>'ai' then raise exception 'A paid AI-assessed course is required' using errcode='42501'; end if;
 if o.captured_at + interval '12 months' < now() then raise exception 'Course access has ended' using errcode='42501'; end if;
 select * into a from public.agent_course_assessments where order_id=o.id and request_key=p_request;
 if a.id is not null then
  if a.submission<>p_submission then raise exception 'This request belongs to a different submission' using errcode='PT409'; end if;
  return jsonb_build_object('attempt',to_jsonb(a),'claimed',false);
 end if;
 if not exists(select 1 from public.user_profiles where id=p_actor and length(trim(name))>=2) then raise exception 'Add your name to your profile before submitting your assessment' using errcode='PT409'; end if;
 update public.agent_course_assessments set state='failed',error='Assessment timed out. Please retry.',finished_at=now() where order_id=o.id and state='running' and created_at<now()-interval '5 minutes';
 if (select count(*) from public.agent_course_assessments where order_id=o.id and state='complete')>=20 then raise exception 'The twenty included assessments have been used. Contact Experrt for help.' using errcode='PT409'; end if;
 if (select count(*) from public.agent_course_assessments where order_id=o.id)>=40 then raise exception 'Assessment retries need support. Contact Experrt for help.' using errcode='PT409'; end if;
 if exists(select 1 from public.agent_course_certificates where order_id=o.id) then raise exception 'Your course certificate has already been issued' using errcode='PT409'; end if;
 if exists(select 1 from public.agent_course_assessments where order_id=o.id and state='running' and created_at>now()-interval '5 minutes') then raise exception 'Your assessment is still being prepared' using errcode='PT409'; end if;
 if (select count(*) from public.agent_course_assessments where order_id=o.id and created_at>now()-interval '24 hours' and state<>'failed')>=3 then raise exception 'You can submit up to three assessments in 24 hours. Use the feedback before trying again.' using errcode='PT409'; end if;
 insert into public.agent_course_assessments(order_id,request_key,submission) values(o.id,p_request,p_submission) returning * into a;
 return jsonb_build_object('attempt',to_jsonb(a),'claimed',true);
end $$;
create function public.agent_course_assessment_finish(p_attempt uuid,p_result jsonb,p_model text,p_input integer,p_output integer,p_error text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.agent_course_assessments%rowtype; o public.agent_course_orders%rowtype; n text; passed boolean;
begin
 select order_id into o.id from public.agent_course_assessments where id=p_attempt;
 select * into o from public.agent_course_orders where id=o.id for update;
 select * into a from public.agent_course_assessments where id=p_attempt for update;
 if a.id is null then raise exception 'Assessment not found'; end if;
 if a.state<>'running' then return to_jsonb(a); end if;
 perform public.lms_assert_workspace(o.user_id,o.org_id,false);
 if o.status<>'captured' or a.created_at<now()-interval '5 minutes' then raise exception 'Assessment access or lease has ended' using errcode='PT409'; end if;
 if p_error is not null then
  update public.agent_course_assessments set state='failed',error=p_error,finished_at=now() where id=a.id returning * into a;
  return to_jsonb(a);
 end if;
 if p_result->>'policy' is distinct from 'experrt-agent-ai-v1' or jsonb_array_length(p_result->'skills')<>6 then raise exception 'Assessment policy does not match'; end if;
 if (select count(distinct x->>'id') from jsonb_array_elements(p_result->'skills') x where x->>'id' in ('task','authority','implementation','verification','recovery','value'))<>6 then raise exception 'Assessment skills do not match'; end if;
 if exists(select 1 from jsonb_array_elements(p_result->'skills') x where x->>'score' is null or (x->>'score')::numeric not between 0 and 4 or trunc((x->>'score')::numeric)<>(x->>'score')::numeric) then raise exception 'Assessment score is invalid'; end if;
 passed:=not exists(select 1 from jsonb_array_elements(p_result->'skills') x where (x->>'score')::integer<3);
 if passed is distinct from (p_result->>'passed')::boolean then raise exception 'Assessment pass rule does not match'; end if;
 insert into public.agent_course_report_emails(assessment_id) values(a.id) on conflict do nothing;
 update public.agent_course_assessments set state='complete',result=p_result,model=p_model,input_tokens=p_input,output_tokens=p_output,finished_at=now() where id=a.id returning * into a;
 if passed then
  select name into n from public.user_profiles where id=o.user_id;
  if n is null or length(trim(n))<2 then raise exception 'Add your name to your profile before certification'; end if;
  insert into public.agent_course_certificates(order_id,assessment_id,learner_name,snapshot)
  values(o.id,a.id,n,jsonb_build_object('title',o.title,'version',o.learning_pack->>'version','skills',p_result->'skills','assessment','AI assessment of submitted practical evidence','policy',p_result->>'policy','limitations',p_result->'limitations','qualification','Experrt certificate; not external accreditation'));
 end if;
 return to_jsonb(a);
end $$;
revoke all on function public.agent_course_assessment_start(uuid,uuid,uuid,uuid,jsonb),public.agent_course_assessment_finish(uuid,jsonb,text,integer,integer,text) from public,anon,authenticated;
grant execute on function public.agent_course_assessment_start(uuid,uuid,uuid,uuid,jsonb),public.agent_course_assessment_finish(uuid,jsonb,text,integer,integer,text) to service_role;
