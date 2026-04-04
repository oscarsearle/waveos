-- WaveOS Social Stats
-- Run this in your Supabase SQL editor

create table social_stats (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null,  -- 'instagram' | 'youtube' | 'tiktok' | 'linkedin'
  followers   integer,
  views       integer,        -- avg views / impressions per post
  likes       integer,
  comments    integer,
  posts       integer,        -- total posts / videos
  notes       text,
  recorded_at date not null default current_date,
  created_at  timestamptz not null default now()
);

alter table social_stats enable row level security;

create policy "Admin full access on social_stats"
  on social_stats for all
  to authenticated
  using (true)
  with check (true);
