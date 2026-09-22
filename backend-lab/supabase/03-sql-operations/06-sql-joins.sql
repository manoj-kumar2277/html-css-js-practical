-- Experiment: Implement SQL joins (run 00-sample-data.sql first)

-- INNER JOIN: only rows that match on both sides
select e.name, d.name as department, d.city
from public.emp e
inner join public.dept d on d.id = e.dept_id;

-- LEFT JOIN: all employees, even those without a department (Latha)
select e.name, d.name as department
from public.emp e left join public.dept d on d.id = e.dept_id;

-- RIGHT JOIN: all departments, even those with no employees (Legal)
select d.name as department, e.name
from public.emp e right join public.dept d on d.id = e.dept_id;

-- FULL OUTER JOIN: everything from both tables
select e.name, d.name as department
from public.emp e full outer join public.dept d on d.id = e.dept_id;

-- CROSS JOIN: every combination
select e.name, d.name from public.emp e cross join public.dept d limit 10;

-- SELF JOIN: employee with their manager
select e.name as employee, m.name as manager
from public.emp e left join public.emp m on m.id = e.manager_id;

-- join + aggregate: employees per department (including empty departments)
select d.name, count(e.id) as employees
from public.dept d left join public.emp e on e.dept_id = d.id
group by d.name order by employees desc;
