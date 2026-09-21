-- Keep existing role/ownership policies; add a mandatory current-workspace gate.
do $$ declare t text; begin
 foreach t in array array['knowledge_base_files','saved_prompts','model_personas'] loop
  execute format('create policy active_resource_workspace on public.%I as restrictive for all to authenticated using (public.current_workspace_access(org_id)) with check (public.current_workspace_access(org_id))',t);
 end loop;
end $$;
create policy knowledge_storage_read on storage.objects for select to authenticated
 using (bucket_id='knowledge-base' and (storage.foldername(name))[1] in (select p.org_id::text from public.user_profiles p where p.id=(select auth.uid()) and public.current_workspace_access(p.org_id)));
create policy knowledge_storage_upload on storage.objects for insert to authenticated
 with check (bucket_id='knowledge-base' and (storage.foldername(name))[1] in (select p.org_id::text from public.user_profiles p where p.id=(select auth.uid()) and p.role in ('admin','manager') and public.current_workspace_access(p.org_id)));
create policy knowledge_storage_remove on storage.objects for delete to authenticated
 using (bucket_id='knowledge-base' and (storage.foldername(name))[1] in (select p.org_id::text from public.user_profiles p where p.id=(select auth.uid()) and p.role in ('admin','manager') and public.current_workspace_access(p.org_id)));
