-- Experiment: Insert records into Supabase tables
-- Uses the "students" table from 00-setup/schema.sql

-- single row
insert into public.students (name, email, course, age)
values ('Asha', 'asha@example.com', 'CSE', 20);

-- multiple rows
insert into public.students (name, email, course, age) values
  ('Ravi',  'ravi@example.com',  'ECE',  21),
  ('Meena', 'meena@example.com', 'CSE',  19),
  ('Kiran', 'kiran@example.com', 'MECH', 22);

-- return the inserted rows
insert into public.students (name, email, course, age)
values ('Divya', 'divya@example.com', 'IT', 20)
returning id, name, created_at;

-- ignore duplicates / upsert
insert into public.students (name, email, course, age) values ('Asha', 'asha@example.com', 'CSE', 20)
on conflict (email) do nothing;

insert into public.students (name, email, course, age) values ('Asha K', 'asha@example.com', 'CSE', 21)
on conflict (email) do update set name = excluded.name, age = excluded.age;

-- insert from a select
-- insert into public.students_archive select * from public.students where age > 21;

select * from public.students order by id;
