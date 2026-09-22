-- Sample dataset used by experiments 01-08 in this folder. Run this first.
drop table if exists public.emp cascade;
drop table if exists public.dept cascade;

create table public.dept (
  id   int primary key,
  name text not null,
  city text
);
create table public.emp (
  id      int primary key,
  name    text not null,
  salary  numeric(10,2) not null,
  dept_id int references public.dept(id),
  manager_id int,
  hired   date
);

insert into public.dept values (1,'IT','Chennai'), (2,'HR','Mumbai'), (3,'Sales','Delhi'), (4,'Legal','Pune');
insert into public.emp values
  (1,'Asha',   60000, 1, null, '2019-01-15'),
  (2,'Ravi',   45000, 1, 1,    '2020-03-10'),
  (3,'Meena',  52000, 2, 1,    '2018-07-01'),
  (4,'Kiran',  38000, 3, 3,    '2021-11-20'),
  (5,'Divya',  70000, 3, 1,    '2017-05-05'),
  (6,'Suresh', 41000, 1, 2,    '2022-02-14'),
  (7,'Latha',  47000, null, 3, '2023-01-09');
