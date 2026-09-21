create role anon; create role authenticated; create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema public,auth to authenticated,anon,service_role;
grant execute on function auth.uid() to authenticated,anon,service_role;
create table public.user_profiles(id uuid primary key references auth.users(id),org_id uuid,role text);
create table public.organisations(id uuid primary key,name text,logo_url text,owner_id uuid references public.user_profiles(id));
grant select on public.user_profiles,public.organisations to service_role;
-- Additive compatibility phase. Existing LMS permissions remain authoritative.
-- No workspace switch or membership-write API is enabled by this migration.
create table public.organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  org_id uuid not null references public.organisations(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','trainer','learner','finance')),
  status text not null default 'active' check (status in ('active','suspended','revoked')),
  source text not null check (source in ('legacy','direct')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, org_id),
  check ((status = 'revoked') = (revoked_at is not null))
);
create index organisation_memberships_org_status on public.organisation_memberships(org_id, status);
alter table public.organisation_memberships enable row level security;
revoke all on public.organisation_memberships from public, anon, authenticated;
grant select on public.organisation_memberships to authenticated;
grant all on public.organisation_memberships to service_role;
create policy membership_self_read on public.organisation_memberships for select to authenticated
  using (user_id = (select auth.uid()));

-- Deliberately retain identifiers when an account/workspace is removed.
-- Only trusted server operations can read this audit history.
create table public.organisation_membership_events (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null,
  user_id uuid not null,
  org_id uuid not null,
  actor_id uuid,
  operation text not null check (operation in ('INSERT','UPDATE','DELETE')),
  previous_role text,
  next_role text,
  previous_status text,
  next_status text,
  source text not null,
  created_at timestamptz not null default now()
);
create index organisation_membership_events_membership on public.organisation_membership_events(membership_id, created_at);
alter table public.organisation_membership_events enable row level security;
revoke all on public.organisation_membership_events from public, anon, authenticated, service_role;
grant select, insert on public.organisation_membership_events to service_role;

create function public.audit_organisation_membership() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    NEW.updated_at := now();
    if (OLD.role, OLD.status, OLD.source) is not distinct from (NEW.role, NEW.status, NEW.source) then return NEW; end if;
  end if;
  insert into public.organisation_membership_events
    (membership_id,user_id,org_id,actor_id,operation,previous_role,next_role,previous_status,next_status,source)
  values (coalesce(NEW.id,OLD.id),coalesce(NEW.user_id,OLD.user_id),coalesce(NEW.org_id,OLD.org_id),auth.uid(),TG_OP,
    OLD.role,NEW.role,OLD.status,NEW.status,coalesce(NEW.source,OLD.source));
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end $$;
revoke all on function public.audit_organisation_membership() from public, anon, authenticated;
create trigger audit_organisation_membership before insert or update or delete on public.organisation_memberships
for each row execute function public.audit_organisation_membership();

-- Mirrors proven legacy access only. A platform operator's selected workspace
-- is not a membership. Ownership must come from organisations.owner_id.
create function public.sync_legacy_memberships(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_user is null then return; end if;
  -- Serialise profile and ownership updates for the same person.
  perform 1 from public.user_profiles where id = p_user for update;
  if not found then return; end if;
  update public.organisation_memberships m set status='revoked',revoked_at=now()
    where m.user_id=p_user and m.source='legacy' and m.status <> 'revoked'
    and not exists (select 1 from public.organisations o where o.id=m.org_id and o.owner_id=p_user)
    and not exists (select 1 from public.user_profiles p where p.id=p_user and p.org_id=m.org_id and p.role <> 'super_admin');
  insert into public.organisation_memberships(user_id,org_id,role,status,source)
    select p_user,o.id,
      case when o.owner_id=p_user then 'owner' when p.role='user' then 'learner' else p.role end,
      'active','legacy'
    from public.organisations o cross join public.user_profiles p
    where p.id=p_user and (o.owner_id=p_user or (p.org_id=o.id and p.role <> 'super_admin'))
  on conflict (user_id,org_id) do update set role=excluded.role,status='active',revoked_at=null
    where organisation_memberships.source='legacy'
      and (organisation_memberships.role,organisation_memberships.status) is distinct from (excluded.role,'active');
end $$;
revoke all on function public.sync_legacy_memberships(uuid) from public, anon, authenticated;

create function public.sync_profile_memberships() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.sync_legacy_memberships(NEW.id);
  return NEW;
end $$;
revoke all on function public.sync_profile_memberships() from public, anon, authenticated;
create trigger sync_profile_memberships after insert or update of org_id,role on public.user_profiles
for each row execute function public.sync_profile_memberships();

create function public.sync_owner_memberships() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then perform public.sync_legacy_memberships(OLD.owner_id); end if;
  perform public.sync_legacy_memberships(NEW.owner_id);
  return NEW;
end $$;
revoke all on function public.sync_owner_memberships() from public, anon, authenticated;
create trigger sync_owner_memberships after insert or update of owner_id on public.organisations
for each row execute function public.sync_owner_memberships();

do $$ declare person record; begin
  for person in select id from public.user_profiles order by id loop
    perform public.sync_legacy_memberships(person.id);
  end loop;
end $$;

-- Own active memberships only; no supplied actor ID and no platform-role bypass.
-- Definer is required to read names where legacy org RLS still limits context.
create function public.list_workspace_memberships()
returns table (membership_id uuid, org_id uuid, name text, logo_url text, role text)
language sql stable security definer set search_path = '' as $$
  select m.id,m.org_id,o.name,o.logo_url,m.role
  from public.organisation_memberships m join public.organisations o on o.id=m.org_id
  where m.user_id=(select auth.uid()) and m.status='active'
  order by lower(o.name),m.org_id
$$;
revoke all on function public.list_workspace_memberships() from public, anon;
grant execute on function public.list_workspace_memberships() to authenticated;
comment on table public.organisation_memberships is 'Compatibility-phase memberships. Legacy profile and owner access is mirrored. Not yet authoritative for LMS switching or mutations.';
-- Compatibility guard: explicit context, no multi-workspace switching yet.
create function public.lms_assert_workspace(p_actor uuid,p_org uuid,p_manager boolean default false)
returns void language plpgsql security invoker set search_path = '' as $$
declare p public.user_profiles%rowtype; m public.organisation_memberships%rowtype;
begin
 select * into p from public.user_profiles where id=p_actor for share;
 if p.id is null or p_org is null or p.org_id is distinct from p_org then
  raise exception 'Workspace changed or access is unavailable. Refresh your workspace.' using errcode='42501';
 end if;
 select * into m from public.organisation_memberships where user_id=p_actor and org_id=p_org for share;
 if m.id is not null and m.status <> 'active' then
  raise exception 'Your membership is no longer active in this workspace.' using errcode='42501';
 end if;
 -- Preserve the existing platform-operator path without creating membership.
 -- Every ordinary account requires a current membership. Role discrepancies
 -- fail closed until the rest of the application can adopt scoped roles.
 if p.role <> 'super_admin' and (m.id is null or not (
   m.role='owner' or m.role=p.role or (m.role='learner' and p.role='user')
 )) then
  raise exception 'Workspace permissions changed. Refresh or contact your administrator.' using errcode='42501';
 end if;
 if p_manager and p.role not in ('admin','manager','super_admin') then
  raise exception 'A learning manager is required.' using errcode='42501';
 end if;
end $$;
revoke all on function public.lms_assert_workspace(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.lms_assert_workspace(uuid,uuid,boolean) to service_role;


-- Stub bodies exercise guard injection only, not existing cohort business logic.
create function public.lms_live_delivery(p_actor uuid,p_programme uuid default null,p_cohort uuid default null,p_action text default 'get') returns jsonb language plpgsql as $$ declare actor user_profiles%rowtype; begin select * into actor from user_profiles where id=p_actor; return '{}'::jsonb; end $$;
create function public.cohort_wall(p_actor uuid,p_cohort uuid,p_body text default null,p_parent uuid default null,p_request uuid default null) returns jsonb language plpgsql as $$ declare actor user_profiles%rowtype; begin select * into actor from user_profiles where id=p_actor; return '{}'::jsonb; end $$;
create table public.cohorts(id int primary key,org_id uuid);
alter table public.cohorts enable row level security;
grant select,insert on public.cohorts to authenticated;
create policy existing_access on public.cohorts for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.cohorts values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.sessions(id int primary key,org_id uuid);
alter table public.sessions enable row level security;
grant select,insert on public.sessions to authenticated;
create policy existing_access on public.sessions for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.sessions values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.enrolments(id int primary key,org_id uuid);
alter table public.enrolments enable row level security;
grant select,insert on public.enrolments to authenticated;
create policy existing_access on public.enrolments for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.enrolments values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.attendance(id int primary key,org_id uuid);
alter table public.attendance enable row level security;
grant select,insert on public.attendance to authenticated;
create policy existing_access on public.attendance for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.attendance values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.submissions(id int primary key,org_id uuid);
alter table public.submissions enable row level security;
grant select,insert on public.submissions to authenticated;
create policy existing_access on public.submissions for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.submissions values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.grades(id int primary key,org_id uuid);
alter table public.grades enable row level security;
grant select,insert on public.grades to authenticated;
create policy existing_access on public.grades for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.grades values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.certificates(id int primary key,org_id uuid);
alter table public.certificates enable row level security;
grant select,insert on public.certificates to authenticated;
create policy existing_access on public.certificates for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.certificates values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.credit_wallets(id int primary key,org_id uuid);
alter table public.credit_wallets enable row level security;
grant select,insert on public.credit_wallets to authenticated;
create policy existing_access on public.credit_wallets for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.credit_wallets values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.credit_ledger(id int primary key,org_id uuid);
alter table public.credit_ledger enable row level security;
grant select,insert on public.credit_ledger to authenticated;
create policy existing_access on public.credit_ledger for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.credit_ledger values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.billing_invoices(id int primary key,org_id uuid);
alter table public.billing_invoices enable row level security;
grant select,insert on public.billing_invoices to authenticated;
create policy existing_access on public.billing_invoices for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.billing_invoices values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.billing_invoice_lines(id int primary key,org_id uuid);
alter table public.billing_invoice_lines enable row level security;
grant select,insert on public.billing_invoice_lines to authenticated;
create policy existing_access on public.billing_invoice_lines for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.billing_invoice_lines values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.mooov_payments(id int primary key,org_id uuid);
alter table public.mooov_payments enable row level security;
grant select,insert on public.mooov_payments to authenticated;
create policy existing_access on public.mooov_payments for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.mooov_payments values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
create table public.usage_logs(id int primary key,org_id uuid);
alter table public.usage_logs enable row level security;
grant select,insert on public.usage_logs to authenticated;
create policy existing_access on public.usage_logs for all to authenticated using (org_id='22222222-2222-4222-a222-000000000001') with check (org_id='22222222-2222-4222-a222-000000000001');
insert into public.usage_logs values(1,'22222222-2222-4222-a222-000000000001'),(2,'22222222-2222-4222-a222-000000000002');
-- Additional restriction only. Existing row policies still decide which records
-- a member, client manager or facilitator may access.
create function public.current_workspace_access(p_expected_org uuid default null,p_expected_role text default null)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
  select 1 from public.user_profiles p
  left join public.organisation_memberships m on m.user_id=p.id and m.org_id=p.org_id
  where p.id=(select auth.uid()) and p.org_id is not null
    and (p_expected_org is null or p.org_id=p_expected_org)
    and (p_expected_role is null or p.role=p_expected_role)
    and (m.id is null or m.status='active')
    and (p.role='super_admin' or (m.id is not null and
      (m.role='owner' or m.role=p.role or (m.role='learner' and p.role='user'))))
 );
$$;
revoke all on function public.current_workspace_access(uuid,text) from public,anon;
grant execute on function public.current_workspace_access(uuid,text) to authenticated;

do $$ declare t text; begin
 foreach t in array array['cohorts','sessions','enrolments','attendance','submissions','grades','certificates','credit_wallets','credit_ledger','billing_invoices','billing_invoice_lines','mooov_payments','usage_logs'] loop
  execute format('create policy active_workspace_required on public.%I as restrictive for all to authenticated using ((select public.current_workspace_access())) with check ((select public.current_workspace_access()))',t);
 end loop;
end $$;

-- Service-role RPC paths must perform their own checks, including old callers.
do $$ declare signature text; definition text; needle text := 'select * into actor from user_profiles where id=p_actor;'; begin
 foreach signature in array array['public.lms_live_delivery(uuid,uuid,uuid,text)','public.cohort_wall(uuid,uuid,text,uuid,uuid)'] loop
  definition := pg_get_functiondef(signature::regprocedure);
  if position(needle in definition)=0 then raise exception 'Guard location changed for %',signature; end if;
  execute replace(definition,needle,'select * into actor from user_profiles where id=p_actor for share; perform public.lms_assert_workspace(p_actor,actor.org_id,false);');
 end loop;
end $$;
create function public.lms_live_delivery_scoped(p_actor uuid,p_org uuid,p_programme uuid default null,p_cohort uuid default null,p_action text default 'get')
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 return public.lms_live_delivery(p_actor,p_programme,p_cohort,p_action);
end $$;
revoke all on function public.lms_live_delivery_scoped(uuid,uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.lms_live_delivery_scoped(uuid,uuid,uuid,uuid,text) to service_role;
create function public.cohort_wall_scoped(p_actor uuid,p_org uuid,p_cohort uuid,p_body text default null,p_parent uuid default null,p_request uuid default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
 perform public.lms_assert_workspace(p_actor,p_org,false);
 return public.cohort_wall(p_actor,p_cohort,p_body,p_parent,p_request);
end $$;
revoke all on function public.cohort_wall_scoped(uuid,uuid,uuid,text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.cohort_wall_scoped(uuid,uuid,uuid,text,uuid,uuid) to service_role;

insert into auth.users values('11111111-1111-4111-a111-000000000001');
insert into public.organisations(id,name) values('22222222-2222-4222-a222-000000000001','Test workspace');
insert into public.user_profiles values('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000001','admin');
set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-a111-000000000001',false);
do $$ begin
 if not public.current_workspace_access() then raise exception 'Active membership blocked'; end if;
 if public.current_workspace_access('22222222-2222-4222-a222-000000000002') then raise exception 'Wrong workspace accepted'; end if;
 if public.current_workspace_access(null,'user') then raise exception 'Stale role accepted'; end if;
end $$;
do $$ begin if (select count(*) from public.cohorts) <> 1 then raise exception 'Active visibility wrong: cohorts'; end if; end $$;
do $$ begin if (select count(*) from public.sessions) <> 1 then raise exception 'Active visibility wrong: sessions'; end if; end $$;
do $$ begin if (select count(*) from public.enrolments) <> 1 then raise exception 'Active visibility wrong: enrolments'; end if; end $$;
do $$ begin if (select count(*) from public.attendance) <> 1 then raise exception 'Active visibility wrong: attendance'; end if; end $$;
do $$ begin if (select count(*) from public.submissions) <> 1 then raise exception 'Active visibility wrong: submissions'; end if; end $$;
do $$ begin if (select count(*) from public.grades) <> 1 then raise exception 'Active visibility wrong: grades'; end if; end $$;
do $$ begin if (select count(*) from public.certificates) <> 1 then raise exception 'Active visibility wrong: certificates'; end if; end $$;
do $$ begin if (select count(*) from public.credit_wallets) <> 1 then raise exception 'Active visibility wrong: credit_wallets'; end if; end $$;
do $$ begin if (select count(*) from public.credit_ledger) <> 1 then raise exception 'Active visibility wrong: credit_ledger'; end if; end $$;
do $$ begin if (select count(*) from public.billing_invoices) <> 1 then raise exception 'Active visibility wrong: billing_invoices'; end if; end $$;
do $$ begin if (select count(*) from public.billing_invoice_lines) <> 1 then raise exception 'Active visibility wrong: billing_invoice_lines'; end if; end $$;
do $$ begin if (select count(*) from public.mooov_payments) <> 1 then raise exception 'Active visibility wrong: mooov_payments'; end if; end $$;
do $$ begin if (select count(*) from public.usage_logs) <> 1 then raise exception 'Active visibility wrong: usage_logs'; end if; end $$;
reset role;
update public.organisation_memberships set status='revoked',revoked_at=now();
set role authenticated;
do $$ begin if public.current_workspace_access() then raise exception 'Revocation ignored'; end if; end $$;
do $$ begin
 if exists(select 1 from public.cohorts) then raise exception 'Revoked read leaked: cohorts'; end if;
 begin insert into public.cohorts values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: cohorts'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.sessions) then raise exception 'Revoked read leaked: sessions'; end if;
 begin insert into public.sessions values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: sessions'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.enrolments) then raise exception 'Revoked read leaked: enrolments'; end if;
 begin insert into public.enrolments values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: enrolments'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.attendance) then raise exception 'Revoked read leaked: attendance'; end if;
 begin insert into public.attendance values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: attendance'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.submissions) then raise exception 'Revoked read leaked: submissions'; end if;
 begin insert into public.submissions values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: submissions'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.grades) then raise exception 'Revoked read leaked: grades'; end if;
 begin insert into public.grades values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: grades'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.certificates) then raise exception 'Revoked read leaked: certificates'; end if;
 begin insert into public.certificates values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: certificates'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.credit_wallets) then raise exception 'Revoked read leaked: credit_wallets'; end if;
 begin insert into public.credit_wallets values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: credit_wallets'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.credit_ledger) then raise exception 'Revoked read leaked: credit_ledger'; end if;
 begin insert into public.credit_ledger values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: credit_ledger'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.billing_invoices) then raise exception 'Revoked read leaked: billing_invoices'; end if;
 begin insert into public.billing_invoices values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: billing_invoices'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.billing_invoice_lines) then raise exception 'Revoked read leaked: billing_invoice_lines'; end if;
 begin insert into public.billing_invoice_lines values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: billing_invoice_lines'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.mooov_payments) then raise exception 'Revoked read leaked: mooov_payments'; end if;
 begin insert into public.mooov_payments values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: mooov_payments'; exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 if exists(select 1 from public.usage_logs) then raise exception 'Revoked read leaked: usage_logs'; end if;
 begin insert into public.usage_logs values(3,'22222222-2222-4222-a222-000000000001'); raise exception 'Revoked write allowed: usage_logs'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
 begin perform public.lms_live_delivery('11111111-1111-4111-a111-000000000001'); raise exception 'Legacy delivery bypass'; exception when insufficient_privilege then null; end;
 begin perform public.cohort_wall('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000001'); raise exception 'Legacy wall bypass'; exception when insufficient_privilege then null; end;
 begin perform public.lms_live_delivery_scoped('11111111-1111-4111-a111-000000000001','22222222-2222-4222-a222-000000000001'); raise exception 'Scoped delivery bypass'; exception when insufficient_privilege then null; end;
end $$;
select 'PASS: 13-table guard read/write denial, active baseline scope, wrong context, stale role and RPC guards' as verification;
