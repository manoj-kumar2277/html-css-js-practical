-- Experiment: Execute basic SELECT queries using the Supabase SQL Editor (run 00-sample-data.sql first)

select * from public.emp;
select name, salary from public.emp;
select name, salary * 12 as annual_salary from public.emp;
select distinct dept_id from public.emp;
select name || ' works in dept ' || dept_id as info from public.emp where dept_id is not null;
select count(*) from public.emp;
select * from public.emp limit 3;
select now() as current_time, 2 + 3 as five;
