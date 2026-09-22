-- Experiment: Create tables using Supabase (SQL Editor)

create table if not exists public.departments (
  id   bigint generated always as identity primary key,
  name text not null unique
);

create table if not exists public.employees (
  id            bigint generated always as identity primary key,
  first_name    text not null,
  last_name     text not null,
  email         text unique,
  salary        numeric(10,2) default 0,
  department_id bigint references public.departments(id),
  hired_on      date default current_date
);

-- create table as / like
create table public.employees_backup (like public.employees including all);

-- modify tables
alter table public.employees add column phone text;
alter table public.employees rename column phone to mobile;
alter table public.employees drop column mobile;
alter table public.employees_backup rename to employees_archive;

-- inspect
select table_name from information_schema.tables where table_schema = 'public' order by 1;

-- remove
drop table public.employees_archive;
