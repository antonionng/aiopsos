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
