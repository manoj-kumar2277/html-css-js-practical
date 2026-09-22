-- Experiment: Implement GROUP BY and HAVING

-- employees per department
select dept_id, count(*) as employees from public.emp group by dept_id;

-- average salary per department
select dept_id, round(avg(salary), 2) as avg_salary from public.emp group by dept_id order by avg_salary desc;

-- HAVING filters groups (WHERE filters rows BEFORE grouping)
select dept_id, count(*) as employees
from public.emp
group by dept_id
having count(*) >= 2;

select dept_id, sum(salary) as payroll
from public.emp
where dept_id is not null              -- row filter
group by dept_id
having sum(salary) > 90000             -- group filter
order by payroll desc;

-- group by year
select extract(year from hired) as year, count(*) from public.emp group by 1 order by 1;
