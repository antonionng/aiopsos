do $$ declare definition text; begin
 definition:=pg_get_functiondef('public.lms_delivery_command(uuid,uuid,uuid,text,jsonb,uuid)'::regprocedure);
 if position('score:=score/count_scores/4*100;' in definition)=0 then raise exception 'Expected rubric calculation not found';end if;
 execute replace(definition,'score:=score/count_scores/4*100;', $patch$
 if exists(select 1 from jsonb_array_elements(criteria) c where coalesce((c->>'weight')::numeric,1)<=0 or coalesce((c->>'weight')::numeric,1)>100) then raise exception 'Criterion weights must be between 1 and 100';end if;
 select sum((p_payload->'scores'->>(c->>'id'))::numeric*coalesce((c->>'weight')::numeric,1))/sum(coalesce((c->>'weight')::numeric,1))/4*100 into score from jsonb_array_elements(criteria) c;
 $patch$);
end $$;
