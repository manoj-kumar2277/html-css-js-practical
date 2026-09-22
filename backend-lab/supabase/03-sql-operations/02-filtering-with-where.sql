-- Experiment: Implement filtering using WHERE

select * from public.emp where salary > 50000;
select * from public.emp where dept_id = 1 and salary >= 45000;
select * from public.emp where dept_id = 2 or dept_id = 3;
select * from public.emp where dept_id in (1, 3);
select * from public.emp where salary between 40000 and 50000;
select * from public.emp where name like 'M%';          -- starts with M
select * from public.emp where name ilike '%a';         -- ends with a (case-insensitive)
select * from public.emp where dept_id is null;         -- NULL check (never "= null")
select * from public.emp where not dept_id = 1;
select * from public.emp where hired >= '2020-01-01';
