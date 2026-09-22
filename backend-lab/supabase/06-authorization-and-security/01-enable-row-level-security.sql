-- Experiment: Enable Row Level Security (RLS)
-- RLS makes Postgres check a policy for EVERY row a user tries to read or write.

-- 1. Create a demo table
create table if not exists public.notes (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  content    text,
  created_at timestamptz default now()
);

-- 2. Enable RLS. With RLS ON and NO policies => nobody (anon/authenticated) can see or change anything.
alter table public.notes enable row level security;
-- Also apply RLS to the table owner (optional, stricter):
-- alter table public.notes force row level security;

-- 3. Check which tables have RLS
select schemaname, tablename, rowsecurity
from pg_tables where schemaname = 'public' order by tablename;

-- 4. Test: this returns 0 rows for API users until a policy exists
--    (the SQL Editor runs as the postgres role, which bypasses RLS)
-- curl "$SUPABASE_URL/rest/v1/notes" -H "apikey: $ANON_KEY"   ->   []

-- 5. Disable (only for experiments)
-- alter table public.notes disable row level security;
