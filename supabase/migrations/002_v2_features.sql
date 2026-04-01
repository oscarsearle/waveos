-- WaveOS V2 Schema — Agreements, Deliverables, Testimonials, Invoices
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql

-- =====================
-- AGREEMENTS
-- =====================
create table agreements (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references clients(id) on delete cascade,
  project_id      uuid references projects(id) on delete set null,
  title           text not null,
  template_type   text,                       -- e.g. 'Production Agreement', 'Usage License'
  status          text not null default 'Draft', -- Draft | Sent | Signed | Complete
  file_url        text,                       -- link to signed PDF / Google Doc
  notes           text,
  sent_at         timestamptz,
  signed_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger agreements_updated_at
  before update on agreements
  for each row execute function update_updated_at();

alter table agreements enable row level security;

create policy "Admin full access on agreements"
  on agreements for all
  to authenticated
  using (true)
  with check (true);

-- =====================
-- DELIVERABLES
-- =====================
create table deliverables (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  client_id   uuid not null references clients(id) on delete cascade,
  title       text not null,
  type        text,                     -- video | photo | reel | story | documentary | other
  status      text not null default 'Planned', -- Planned | In Progress | Review | Delivered
  due_date    date,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger deliverables_updated_at
  before update on deliverables
  for each row execute function update_updated_at();

alter table deliverables enable row level security;

create policy "Admin full access on deliverables"
  on deliverables for all
  to authenticated
  using (true)
  with check (true);

-- =====================
-- TESTIMONIALS
-- =====================
create table testimonials (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete cascade,
  project_id  uuid references projects(id) on delete set null,
  quote       text not null,
  status      text not null default 'Requested', -- Requested | Received | Approved
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger testimonials_updated_at
  before update on testimonials
  for each row execute function update_updated_at();

alter table testimonials enable row level security;

create policy "Admin full access on testimonials"
  on testimonials for all
  to authenticated
  using (true)
  with check (true);

-- =====================
-- INVOICES
-- =====================
create table invoices (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients(id) on delete cascade,
  project_id  uuid references projects(id) on delete set null,
  title       text not null,
  amount      numeric not null,
  status      text not null default 'Unpaid', -- Unpaid | Partially Paid | Paid
  due_date    date,
  paid_at     timestamptz,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger invoices_updated_at
  before update on invoices
  for each row execute function update_updated_at();

alter table invoices enable row level security;

create policy "Admin full access on invoices"
  on invoices for all
  to authenticated
  using (true)
  with check (true);
