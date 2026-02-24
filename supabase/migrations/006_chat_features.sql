-- Chat feature parity: attachments, feedback, sharing

-- Message attachments (files/images uploaded in chat)
create table if not exists message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  file_type text not null,
  file_size bigint not null default 0,
  uploaded_by uuid not null references user_profiles(id),
  created_at timestamptz not null default now()
);

-- Message feedback (thumbs up/down)
create table if not exists message_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  rating text not null check (rating in ('up', 'down')),
  created_at timestamptz not null default now(),
  unique(message_id, user_id)
);

-- Shared conversations
alter table conversations
  add column if not exists share_token text unique,
  add column if not exists shared_at timestamptz;

-- Indexes
create index if not exists idx_message_attachments_conv on message_attachments(conversation_id);
create index if not exists idx_message_attachments_msg on message_attachments(message_id);
create index if not exists idx_message_feedback_msg on message_feedback(message_id);
create index if not exists idx_message_feedback_user on message_feedback(user_id);
create index if not exists idx_conversations_share_token on conversations(share_token) where share_token is not null;

-- Full-text search index on messages for conversation search
create index if not exists idx_messages_content_search on messages using gin(to_tsvector('english', content));

-- RLS
alter table message_attachments enable row level security;
alter table message_feedback enable row level security;

create policy "Users view own attachments" on message_attachments
  for select using (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );

create policy "Users manage own attachments" on message_attachments
  for all using (uploaded_by = auth.uid());

create policy "Users view own feedback" on message_feedback
  for select using (user_id = auth.uid());

create policy "Users manage own feedback" on message_feedback
  for all using (user_id = auth.uid());
