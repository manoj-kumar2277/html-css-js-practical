-- Experiment: Create and use database views

-- simple view
create or replace view public.emp_details as
select e.id, e.name, e.salary, d.name as department, d.city
from public.emp e left join public.dept d on d.id = e.dept_id;

select * from public.emp_details where department = 'IT';

-- aggregate view
create or replace view public.dept_summary as
select d.name as department, count(e.id) as employees,
       coalesce(round(avg(e.salary),2), 0) as avg_salary
from public.dept d left join public.emp e on e.dept_id = d.id
group by d.name;

select * from public.dept_summary order by employees desc;

-- security_invoker makes the view obey the RLS of the person querying it (Postgres 15+)
alter view public.dept_summary set (security_invoker = true);

-- materialized view = stored result, refresh manually
create materialized view public.high_earners as select * from public.emp where salary > 50000;
refresh materialized view public.high_earners;
select * from public.high_earners;

-- cleanup
drop materialized view public.high_earners;
drop view public.dept_summary;
drop view public.emp_details;
