-- =====================================================================
-- Run this ONCE in  Supabase Dashboard > SQL Editor > New query
-- Creates the tables used by the experiments in this project.
-- =====================================================================

-- Students ------------------------------------------------------------
create table if not exists public.students (
  id          bigint generated always as identity primary key,
  name        text        not null,
  email       text        not null unique,
  course      text        not null,
  age         int         check (age >= 15),
  user_id     uuid        default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Products ------------------------------------------------------------
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  name        text          not null,
  price       numeric(10,2) not null check (price >= 0),
  stock       int           not null default 0 check (stock >= 0),
  category    text,
  created_by  uuid          default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz   not null default now()
);

-- Profiles (one row per auth user, holds the role) --------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- auto-create a profile whenever a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Chat messages -------------------------------------------------------
create table if not exists public.messages (
  id          bigint generated always as identity primary key,
  user_id     uuid default auth.uid() references auth.users(id) on delete set null,
  username    text not null default 'anonymous',
  content     text not null check (char_length(content) between 1 and 500),
  created_at  timestamptz not null default now()
);

-- Temporary open access so experiments 01-05 work before RLS is taught.
-- (Experiment folder 06 replaces these with proper policies.)
alter table public.students enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.messages enable row level security;

create policy "lab: open read students"   on public.students for select using (true);
create policy "lab: open write students"  on public.students for all    using (true) with check (true);
create policy "lab: open read products"   on public.products for select using (true);
create policy "lab: open write products"  on public.products for all    using (true) with check (true);
create policy "lab: read profiles"        on public.profiles for select using (true);
create policy "lab: open read messages"   on public.messages for select using (true);
create policy "lab: open write messages"  on public.messages for insert with check (true);
