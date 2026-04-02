-- Stores OAuth tokens for third-party integrations (Frame.io etc.)
create table if not exists integrations (
  id          uuid primary key default gen_random_uuid(),
  service     text not null unique,   -- 'frameio'
  access_token  text,
  refresh_token text,
  token_type    text,
  expires_at    timestamptz,
  scope         text,
  account_id    text,                 -- Frame.io account id
  team_id       text,                 -- Frame.io root team id
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table integrations enable row level security;
create policy "Admin full access" on integrations for all using (auth.role() = 'authenticated');
