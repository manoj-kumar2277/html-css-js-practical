-- Experiment: Enable Supabase Realtime
-- Realtime streams row changes from the Postgres WAL to connected clients.
-- Dashboard way: Database > Publications > supabase_realtime > toggle tables   (or Table Editor > table menu > Enable Realtime)

-- 1. Add tables to the realtime publication
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.messages;

-- 2. Verify
select * from pg_publication_tables where pubname = 'supabase_realtime';

-- 3. Include the OLD row on UPDATE / DELETE events (otherwise only the primary key is sent)
alter table public.students replica identity full;
alter table public.messages replica identity full;

-- 4. Remove a table from realtime
-- alter publication supabase_realtime drop table public.messages;

-- Note: realtime respects RLS - a client only receives changes for rows its SELECT policy allows.
