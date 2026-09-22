-- Experiment: Use aggregate functions COUNT, SUM, AVG, MIN and MAX

select
  count(*)                 as total_rows,
  count(dept_id)           as rows_with_dept,      -- ignores NULLs
  count(distinct dept_id)  as distinct_depts,
  sum(salary)              as total_salary,
  round(avg(salary), 2)    as average_salary,
  min(salary)              as lowest_salary,
  max(salary)              as highest_salary,
  min(hired)               as first_hire,
  max(hired)               as last_hire
from public.emp;

-- with groups
select dept_id, count(*), sum(salary), avg(salary), min(salary), max(salary)
from public.emp group by dept_id;

-- other useful aggregates
select string_agg(name, ', ' order by name) as all_names,
       array_agg(salary order by salary)   as salaries
from public.emp;
