-- Experiment: Delete records from Supabase tables

-- preview what will be deleted
select * from public.students where email = 'kiran@example.com';

delete from public.students where email = 'kiran@example.com';        -- one row
delete from public.students where age > 60 returning *;               -- return deleted rows
delete from public.students where id in (select id from public.students order by id desc limit 1);

-- remove ALL rows (keeps the table)
-- delete from public.students;           -- logged, can be filtered
-- truncate table public.students restart identity;    -- fast, resets ids

-- drop the table itself
-- drop table public.students;
