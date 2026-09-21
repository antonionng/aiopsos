-- Private guest workspace. Only server routes with service_role can access it.
create table public.guest_agent_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '12 hours',
  turns integer not null default 0 check (turns between 0 and 3),
  briefs jsonb not null default '[]',
  pack jsonb,
  messages jsonb not null default '[]',
  progress jsonb not null default '[]',
  lease uuid,
  lease_until timestamptz,
  contact jsonb,
  user_sent boolean not null default false,
  lead_sent boolean not null default false
);
alter table public.guest_agent_sessions enable row level security;
revoke all on public.guest_agent_sessions from public, anon, authenticated;
grant all on public.guest_agent_sessions to service_role;

create table public.guest_agent_limits (
  bucket text not null,
  day date not null default current_date,
  used integer not null default 0,
  primary key (bucket, day)
);
alter table public.guest_agent_limits enable row level security;
revoke all on public.guest_agent_limits from public, anon, authenticated;
grant all on public.guest_agent_limits to service_role;

create function public.guest_agent_quota(p_bucket text, p_limit integer)
returns void language plpgsql security invoker set search_path = public as $$
declare v_used integer;
begin
  insert into guest_agent_limits(bucket, used) values(p_bucket, 1)
  on conflict(bucket, day) do update set used = guest_agent_limits.used + 1
  returning used into v_used;
  if v_used > p_limit then raise exception 'GUEST_LIMIT'; end if;
end;
$$;

-- Locking the session and consuming shared quotas in one transaction prevents
-- parallel requests, fresh cookies and multiple server instances bypassing caps.
create function public.guest_agent_claim(p_token text, p_ip text, p_brief text)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare s guest_agent_sessions; v_lease uuid := gen_random_uuid();
begin
  perform guest_agent_quota('global:generation', 200);
  perform guest_agent_quota('ip:' || p_ip, 9);
  insert into guest_agent_sessions(token_hash) values(p_token) on conflict do nothing;
  select * into s from guest_agent_sessions where token_hash = p_token for update;
  if s.expires_at <= now() then raise exception 'GUEST_EXPIRED'; end if;
  if s.turns >= 3 or s.contact is not null then raise exception 'GUEST_COMPLETE'; end if;
  if s.lease_until > now() then raise exception 'GUEST_BUSY'; end if;
  update guest_agent_sessions set turns = turns + 1,
    briefs = briefs || jsonb_build_array(p_brief), lease = v_lease,
    progress = '["Brief received"]',
    lease_until = now() + interval '2 minutes'
    where id = s.id returning * into s;
  return to_jsonb(s);
end;
$$;

create function public.guest_agent_contact(p_token text, p_contact jsonb, p_mailbox text)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare s guest_agent_sessions;
begin
  select * into s from guest_agent_sessions where token_hash = p_token for update;
  if s.id is null or s.expires_at <= now() then raise exception 'GUEST_EXPIRED'; end if;
  if s.pack is null or s.lease_until > now() then raise exception 'GUEST_BUSY'; end if;
  if s.contact is not null and s.contact <> p_contact then raise exception 'GUEST_RECIPIENT'; end if;
  if s.contact is null then
    perform guest_agent_quota('mailbox:' || p_mailbox, 3);
    update guest_agent_sessions set contact = p_contact where id = s.id returning * into s;
  end if;
  return to_jsonb(s);
end;
$$;
revoke all on function public.guest_agent_quota(text, integer) from public, anon, authenticated;
revoke all on function public.guest_agent_claim(text, text, text) from public, anon, authenticated;
revoke all on function public.guest_agent_contact(text, jsonb, text) from public, anon, authenticated;
grant execute on function public.guest_agent_quota(text, integer) to service_role;
grant execute on function public.guest_agent_claim(text, text, text) to service_role;
grant execute on function public.guest_agent_contact(text, jsonb, text) to service_role;

alter table public.course_enquiries drop constraint course_enquiries_source_check;
alter table public.course_enquiries add constraint course_enquiries_source_check
  check (source in ('course_page','assessment_results','catalogue','dashboard','contact','learning_check','guest_agent'));
