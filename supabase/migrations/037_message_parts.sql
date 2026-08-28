-- Assistant messages are more than text: a turn can include tool calls and
-- their results (lib/companions.ts runs a real multi-step tool loop). Until
-- now only `content` was stored, so reopening a thread lost every step the
-- agent took and the transcript read as though the answer arrived from
-- nowhere.
--
-- `content` stays authoritative for full-text search, export and the public
-- shared view; `parts` is the richer render payload.

alter table messages
  add column if not exists parts jsonb;

comment on column messages.parts is
  'AI SDK UIMessage parts for this message (text, tool calls, tool results, reasoning). Nullable: rows written before this column, and plain user messages, have no parts.';

-- ── project files ───────────────────────────────────────────────────────
--
-- The `project-files` bucket was never created, so every upload from the
-- project dialog failed with "Bucket not found" into an empty catch, while
-- the dialog promised "context files that the AI can reference".
--
-- Private, not public: these are a customer's own working documents.

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

drop policy if exists "Owners manage their project files" on storage.objects;
create policy "Owners manage their project files" on storage.objects
  for all using (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] in (
      select p.id::text from projects p where p.user_id = auth.uid()
    )
  );

-- Text extracted at upload time, so the chat route can ground an answer in a
-- project's files without a vector store. Null for types we cannot read.
alter table project_files
  add column if not exists extracted_text text;

comment on column project_files.extracted_text is
  'Plain text pulled out of the file at upload, injected into the system prompt for conversations in this project. Null for binary types.';
