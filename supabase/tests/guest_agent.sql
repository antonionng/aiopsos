-- Transactional checks: leave no guest sessions, counters or contact records.
begin;
do $$
declare s jsonb; token text := 'test-' || gen_random_uuid(); ip text := 'test-' || gen_random_uuid(); v_count integer;
begin
  if has_table_privilege('anon','public.guest_agent_sessions','select') or
     has_table_privilege('authenticated','public.guest_agent_sessions','select') or
     has_function_privilege('anon','public.guest_agent_claim(text,text,text)','execute') or
     has_function_privilege('authenticated','public.guest_agent_contact(text,jsonb,text)','execute') then
    raise exception 'Guest data or mutation is exposed';
  end if;
  s := public.guest_agent_claim(token, ip, 'Build a team workshop');
  assert (s->>'turns')::integer = 1;
  begin
    perform public.guest_agent_claim(token, ip, 'Concurrent request');
    raise exception 'Expected busy rejection';
  exception when others then if sqlerrm <> 'GUEST_BUSY' then raise; end if; end;
  update public.guest_agent_sessions set lease_until = null where token_hash = token;
  perform public.guest_agent_claim(token, ip, 'Refine the workshop');
  update public.guest_agent_sessions set lease_until = null where token_hash = token;
  perform public.guest_agent_claim(token, ip, 'One final refinement');
  update public.guest_agent_sessions set lease_until = null where token_hash = token;
  begin
    perform public.guest_agent_claim(token, ip, 'Fourth request');
    raise exception 'Expected session limit';
  exception when others then if sqlerrm <> 'GUEST_COMPLETE' then raise; end if; end;
  select used into v_count from public.guest_agent_limits where bucket = 'ip:' || ip and day = current_date;
  assert v_count = 3, 'Rejected claims must roll back quota consumption';
  update public.guest_agent_sessions set pack = '{"title":"Test pack"}' where token_hash = token;
  perform public.guest_agent_contact(token, '{"email":"visitor@example.com"}', ip);
  perform public.guest_agent_contact(token, '{"email":"visitor@example.com"}', ip);
  begin
    perform public.guest_agent_contact(token, '{"email":"different@example.com"}', ip);
    raise exception 'Expected frozen recipient';
  exception when others then if sqlerrm <> 'GUEST_RECIPIENT' then raise; end if; end;
  select used into v_count from public.guest_agent_limits where bucket = 'mailbox:' || ip and day = current_date;
  assert v_count = 1, 'Retries must not consume additional mailbox quota';
  update public.guest_agent_sessions set expires_at = now() - interval '1 second' where token_hash = token;
  begin
    perform public.guest_agent_contact(token, '{"email":"visitor@example.com"}', ip);
    raise exception 'Expected expiry';
  exception when others then if sqlerrm <> 'GUEST_EXPIRED' then raise; end if; end;
  for i in 1..6 loop perform public.guest_agent_claim(gen_random_uuid()::text, ip, 'A new session'); end loop;
  begin
    perform public.guest_agent_claim(gen_random_uuid()::text, ip, 'Cookie reset cannot bypass limit');
    raise exception 'Expected shared network limit';
  exception when others then if sqlerrm <> 'GUEST_LIMIT' then raise; end if; end;
end;
$$;
rollback;
