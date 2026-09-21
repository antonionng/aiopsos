-- Restrictive policies supplement existing role permissions; no new grants.
create policy assessment_active_workspace on public.assessments as restrictive for all to authenticated
 using (public.current_workspace_access(org_id)) with check (public.current_workspace_access(org_id));
create policy response_active_member_read on public.assessment_responses as restrictive for select to authenticated
 using ((select public.current_workspace_access()));
create policy response_active_member_insert on public.assessment_responses as restrictive for insert to authenticated
 with check (exists(select 1 from public.assessments a join public.departments d on d.org_id=a.org_id
 where a.id=assessment_id and d.id=department_id and public.current_workspace_access(a.org_id)));
create policy response_active_member_update on public.assessment_responses as restrictive for update to authenticated
 using ((select public.current_workspace_access()))
 with check (exists(select 1 from public.assessments a join public.departments d on d.org_id=a.org_id
 where a.id=assessment_id and d.id=department_id and public.current_workspace_access(a.org_id)));
create policy response_active_member_delete on public.assessment_responses as restrictive for delete to authenticated
 using ((select public.current_workspace_access()));
create policy invitation_active_workspace on public.assessment_invites as restrictive for all to authenticated
 using (public.current_workspace_access(org_id))
 with check (public.current_workspace_access(org_id) and exists(select 1 from public.assessments a where a.id=assessment_id and a.org_id=assessment_invites.org_id));
-- Links belong to an organisation/template, not an assessment row. Public
-- active-link reads stay available to signed-in visitors from other companies.
create policy link_member_insert on public.assessment_links as restrictive for insert to authenticated
 with check (public.current_workspace_access(org_id));
create policy link_member_update on public.assessment_links as restrictive for update to authenticated
 using (public.current_workspace_access(org_id)) with check (public.current_workspace_access(org_id));
create policy link_member_delete on public.assessment_links as restrictive for delete to authenticated
 using (public.current_workspace_access(org_id));
