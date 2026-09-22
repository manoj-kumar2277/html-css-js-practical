-- Experiment: Implement subqueries

-- scalar subquery: earns more than the company average
select name, salary from public.emp
where salary > (select avg(salary) from public.emp);

-- IN subquery: employees of departments located in Chennai or Delhi
select name from public.emp
where dept_id in (select id from public.dept where city in ('Chennai', 'Delhi'));

-- NOT EXISTS: departments with no employees
select d.name from public.dept d
where not exists (select 1 from public.emp e where e.dept_id = d.id);

-- correlated subquery: earns the highest salary in own department
select name, dept_id, salary from public.emp e
where salary = (select max(salary) from public.emp where dept_id = e.dept_id);

-- subquery in FROM (derived table)
select dept_id, avg_sal from (
  select dept_id, avg(salary) as avg_sal from public.emp group by dept_id
) t where avg_sal > 50000;

-- subquery in SELECT
select name, salary, (select round(avg(salary),0) from public.emp) as company_avg from public.emp;

-- ANY / ALL
select name from public.emp where salary > all (select salary from public.emp where dept_id = 2);
