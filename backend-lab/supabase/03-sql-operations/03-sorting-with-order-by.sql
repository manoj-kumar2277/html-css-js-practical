-- Experiment: Implement sorting using ORDER BY

select * from public.emp order by salary;                    -- ascending (default)
select * from public.emp order by salary desc;               -- descending
select * from public.emp order by dept_id asc, salary desc;  -- multiple columns
select * from public.emp order by dept_id nulls last;        -- control NULL position
select * from public.emp order by hired desc limit 3;        -- 3 newest employees
select name, salary from public.emp order by 2 desc;         -- by column number
select name, length(name) as len from public.emp order by len desc, name;
