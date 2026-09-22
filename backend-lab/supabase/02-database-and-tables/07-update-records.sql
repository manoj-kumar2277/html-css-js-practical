-- Experiment: Update records in Supabase tables

update public.students set age = 21 where email = 'asha@example.com';               -- one row
update public.students set course = 'CSE', age = age + 1 where name = 'Ravi';         -- many columns
update public.students set age = age + 1 where course = 'CSE';                         -- many rows
update public.students set name = upper(name) where id in (1, 2)                      -- IN list
returning id, name, age;                                                                 -- see the result

-- Always use WHERE. Preview first:
select * from public.students where course = 'MECH';
update public.students set course = 'MECHANICAL' where course = 'MECH';

-- conditional update
update public.students
set course = case when age >= 22 then 'Final Year' else course end;
