-- Experiment: Implement primary keys and foreign keys

create table public.teachers (
  id   bigint generated always as identity primary key,       -- PRIMARY KEY (unique + not null)
  name text not null
);

create table public.classes (
  id         bigint generated always as identity,
  title      text not null,
  teacher_id bigint,
  constraint pk_classes primary key (id),
  constraint fk_classes_teacher foreign key (teacher_id)
    references public.teachers(id)
    on delete set null                                         -- when teacher is deleted, keep class
    on update cascade
);

-- composite primary key + cascade delete
create table public.enrollments (
  class_id   bigint references public.classes(id) on delete cascade,
  student_no int,
  enrolled_on date default current_date,
  primary key (class_id, student_no)
);

insert into public.teachers (name) values ('Dr. Rao');
insert into public.classes (title, teacher_id) values ('Databases', 1);
insert into public.enrollments values (1, 101), (1, 102);

-- Violations (uncomment one at a time to see the errors)
-- insert into public.classes (title, teacher_id) values ('Bad', 999);   -- FK violation
-- insert into public.enrollments values (1, 101);                         -- duplicate PK

delete from public.classes where id = 1;                                    -- cascades to enrollments
select count(*) as enrollments_left from public.enrollments;               -- 0

drop table public.enrollments; drop table public.classes; drop table public.teachers;
