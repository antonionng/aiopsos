create table public.team_invitation_reservations (
 email text primary key,
 reservation_id uuid not null,
 org_id uuid not null references public.organisations(id) on delete cascade,
 actor_id uuid not null references public.user_profiles(id) on delete cascade,
 expires_at timestamptz not null,
 check(email=lower(trim(email)))
);
alter table public.team_invitation_reservations enable row level security;
revoke all on public.team_invitation_reservations from public,anon,authenticated;
grant all on public.team_invitation_reservations to service_role;
create function public.reserve_team_invitation(p_actor uuid,p_org uuid,p_email text,p_role text,p_reservation uuid)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare actor_role text; result uuid;
begin
 perform public.lms_assert_workspace(p_actor,p_org,true);
 select role into actor_role from public.user_profiles where id=p_actor;
 if p_role not in ('user','manager','admin') or (actor_role='manager' and p_role<>'user') then raise exception 'An administrator must grant elevated roles' using errcode='42501'; end if;
 if p_email<>lower(trim(p_email)) or length(p_email)>320 then raise exception 'Invalid email' using errcode='22023'; end if;
 if exists(select 1 from public.user_profiles where lower(email)=p_email and org_id is not null) then raise exception 'This person already has workspace access or a pending invitation' using errcode='40001'; end if;
 insert into public.team_invitation_reservations(email,reservation_id,org_id,actor_id,expires_at)
 values(p_email,p_reservation,p_org,p_actor,now()+interval '10 minutes')
 on conflict(email) do update set reservation_id=excluded.reservation_id,org_id=excluded.org_id,actor_id=excluded.actor_id,expires_at=excluded.expires_at
 where team_invitation_reservations.expires_at<now() returning reservation_id into result;
 if result is null then raise exception 'An invitation is already being prepared for this email' using errcode='40001'; end if;
 return result;
end $$;
revoke all on function public.reserve_team_invitation(uuid,uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.reserve_team_invitation(uuid,uuid,text,text,uuid) to service_role;
