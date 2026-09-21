-- Downloads go through the authenticated app route, with live membership checks.
drop policy knowledge_storage_read on storage.objects;
create policy knowledge_gateway_only on storage.objects as restrictive for select to authenticated
 using (bucket_id<>'knowledge-base');
