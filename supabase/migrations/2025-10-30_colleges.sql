-- Colleges table and policies
-- Run this migration in Supabase SQL editor or via CLI

create table if not exists public.colleges (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.colleges enable row level security;

-- Read policy: allow all (including anon) to read active colleges
create policy if not exists "Allow read active colleges" on public.colleges
  for select
  using (active = true);

-- Write policies: allow authenticated users to modify
-- Adjust to restrict to admins in backend; frontend will gate UI by role
create policy if not exists "Allow insert for authenticated" on public.colleges
  for insert
  to authenticated
  with check (true);

create policy if not exists "Allow update for authenticated" on public.colleges
  for update
  to authenticated
  using (true)
  with check (true);

create policy if not exists "Allow delete for authenticated" on public.colleges
  for delete
  to authenticated
  using (true);