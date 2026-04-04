-- WaveOS Context Hub
-- Run this in your Supabase SQL editor

create table contexts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default 'Untitled Context',
  raw_text     text not null,
  extracted    jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table context_messages (
  id           uuid primary key default gen_random_uuid(),
  context_id   uuid not null references contexts(id) on delete cascade,
  role         text not null,
  content      text not null,
  created_at   timestamptz not null default now()
);

alter table contexts enable row level security;
alter table context_messages enable row level security;

create policy "Admin full access on contexts"
  on contexts for all to authenticated using (true) with check (true);

create policy "Admin full access on context_messages"
  on context_messages for all to authenticated using (true) with check (true);

create trigger contexts_updated_at
  before update on contexts
  for each row execute function update_updated_at();
