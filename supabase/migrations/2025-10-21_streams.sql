-- Supabase migration: Streams table + Admin RBAC (idempotent)
-- Re-runnable in staging/production

-- 1) Extensions
create extension if not exists "pgcrypto";

-- 2) Tables
create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists streams_name_idx on public.streams(name);

-- Admins list using Supabase auth users
create table if not exists public.admins (
  user_id uuid primary key,
  created_at timestamptz not null default now(),
  constraint admins_user_fk foreign key (user_id) references auth.users(id) on delete cascade
);

-- 3) Row Level Security (RLS)
alter table public.streams enable row level security;

-- Drop old policies to make this script safe to re-run
DROP POLICY IF EXISTS "Allow public read streams" ON public.streams;
DROP POLICY IF EXISTS "Admins can insert streams" ON public.streams;
DROP POLICY IF EXISTS "Admins can update streams" ON public.streams;
DROP POLICY IF EXISTS "Admins can delete streams" ON public.streams;

-- Read: allow anyone to read streams (public catalog)
CREATE POLICY "Allow public read streams"
  ON public.streams
  FOR SELECT
  USING (true);

-- Write: only users present in public.admins may write
CREATE POLICY "Admins can insert streams"
  ON public.streams
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins can update streams"
  ON public.streams
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins can delete streams"
  ON public.streams
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Optional helper comment: after creating your admin user in Supabase Auth, add them here:
-- INSERT INTO public.admins(user_id)
-- SELECT id FROM auth.users WHERE email = 'admin@example.com';
-- Or use your actual admin’s UUID: INSERT INTO public.admins(user_id) VALUES ('00000000-0000-0000-0000-000000000000');