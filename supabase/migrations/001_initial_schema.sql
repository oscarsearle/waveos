-- WaveOS Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =====================
-- CLIENTS
-- =====================
create table clients (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  brand_name      text,
  email           text,
  phone           text,
  instagram       text,
  project_type    text,
  status          text not null default 'Lead',
  project_value   numeric,
  next_action     text,
  notes           text,
  portal_slug     text unique,
  portal_enabled  boolean not null default false,
  portal_password text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =====================
-- PROJECTS
-- =====================
create table projects (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references clients(id) on delete cascade,
  name          text not null,
  description   text,
  deliverables  text,
  stage         text not null default 'Lead',
  shoot_date    date,
  deadline      date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =====================
-- PROPOSALS
-- =====================
create table proposals (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references clients(id) on delete cascade,
  title         text not null,
  scope         text,
  deliverables  text,
  price         numeric,
  add_ons       text,
  timeline      text,
  notes         text,
  status        text not null default 'Draft',
  sent_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =====================
-- LINKS
-- =====================
create table links (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references clients(id) on delete cascade,
  project_id          uuid references projects(id) on delete set null,
  label               text not null,
  url                 text not null,
  is_portal_visible   boolean not null default false,
  created_at          timestamptz not null default now()
);

-- =====================
-- PORTAL UPDATES
-- =====================
create table portal_updates (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients(id) on delete cascade,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- =====================
-- AUTO-UPDATE updated_at
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on clients
  for each row execute function update_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create trigger proposals_updated_at
  before update on proposals
  for each row execute function update_updated_at();

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Enable RLS on all tables
alter table clients enable row level security;
alter table projects enable row level security;
alter table proposals enable row level security;
alter table links enable row level security;
alter table portal_updates enable row level security;

-- Authenticated users (you, the admin) can do everything
create policy "Admin full access on clients"
  on clients for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access on projects"
  on projects for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access on proposals"
  on proposals for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access on links"
  on links for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access on portal_updates"
  on portal_updates for all
  to authenticated
  using (true)
  with check (true);

-- Portal: public read of portal-visible data (via service role in server actions)
-- The service role bypasses RLS, so no extra policy needed for portal reads.
-- portal_password is NEVER returned to the browser — filtered out in server actions.
