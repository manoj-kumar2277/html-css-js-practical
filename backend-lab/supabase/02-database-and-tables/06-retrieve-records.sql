-- Experiment: Retrieve records from Supabase tables

select * from public.students;                                    -- everything
select name, course from public.students;                         -- chosen columns
select name as student_name, age as years from public.students;   -- aliases
select distinct course from public.students;                      -- unique values
select * from public.students order by created_at desc limit 3;   -- latest 3
select * from public.students limit 2 offset 2;                   -- pagination
select * from public.students where id = 1;                       -- single row
select count(*) as total from public.students;
select course, count(*) from public.students group by course;
