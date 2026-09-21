-- Recovery only: disable COHORT_MEMBERSHIP_GUARDS_ENABLED in the app first.
-- Removes this release's guards only; no tables or business records are removed.
begin;
drop function if exists public.lms_live_delivery_scoped(uuid,uuid,uuid,uuid,text);
drop function if exists public.cohort_wall_scoped(uuid,uuid,uuid,text,uuid,uuid);
do $$ declare signature text; definition text; needle text := 'select * into actor from user_profiles where id=p_actor for share; perform public.lms_assert_workspace(p_actor,actor.org_id,false);'; begin
 foreach signature in array array['public.lms_live_delivery(uuid,uuid,uuid,text)','public.cohort_wall(uuid,uuid,text,uuid,uuid)'] loop
  definition := pg_get_functiondef(signature::regprocedure);
  if position(needle in definition)=0 then raise exception 'Guard changed; inspect % before recovery',signature; end if;
  execute replace(definition,needle,'select * into actor from user_profiles where id=p_actor;');
 end loop;
end $$;
do $$ declare t text; begin
 foreach t in array array['cohorts','sessions','enrolments','attendance','submissions','grades','certificates','credit_wallets','credit_ledger','billing_invoices','billing_invoice_lines','mooov_payments','usage_logs'] loop
  execute format('drop policy if exists active_workspace_required on public.%I',t);
 end loop;
end $$;
drop function if exists public.current_workspace_access(uuid,text);
commit;
