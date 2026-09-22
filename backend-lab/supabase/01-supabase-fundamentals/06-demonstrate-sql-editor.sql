-- Experiment: Demonstrate the Supabase SQL Editor
-- Dashboard > SQL Editor > "New query". Run with the Run button or Ctrl/Cmd + Enter.
-- Tips: select part of the script to run only that part; click "Save" to keep a snippet;
--       "Templates" (Quickstarts) give ready-made schemas; results show as a grid and can be exported to CSV.

-- 1. Create a table
create table if not exists public.notes (
  id bigint generated always as identity primary key,
  title text not null,
  body text,
  created_at timestamptz default now()
);

-- 2. Insert rows
insert into public.notes (title, body) values
  ('First note', 'Hello Supabase'),
  ('Second note', 'SQL Editor is great');

-- 3. Query
select * from public.notes order by id;

-- 4. Update and delete
update public.notes set body = 'Updated body' where title = 'First note';
delete from public.notes where title = 'Second note';

-- 5. EXPLAIN shows how Postgres runs a query
explain analyze select * from public.notes where id = 1;

-- 6. Useful catalog queries
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'notes';

-- 7. Clean up
drop table public.notes;
