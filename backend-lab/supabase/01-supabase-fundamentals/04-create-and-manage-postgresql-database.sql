-- Experiment: Create and manage a PostgreSQL database using Supabase
-- Run in: Dashboard > SQL Editor. (Every project already has one database called "postgres".)

-- 1. Inspect the server and current database
select version();
select current_database(), current_user, now();

-- 2. Schemas (logical folders inside the database)
create schema if not exists lab;
select schema_name from information_schema.schemata order by 1;

-- 3. Create a table in the new schema
create table lab.courses (
  id     serial primary key,
  code   text unique not null,
  title  text not null
);
insert into lab.courses (code, title) values ('CS101', 'Intro to Programming'), ('CS201', 'Databases');
select * from lab.courses;

-- 4. Manage: list tables and sizes
select table_schema, table_name
from information_schema.tables
where table_schema in ('public', 'lab') order by 1, 2;

select pg_size_pretty(pg_database_size(current_database())) as database_size;

-- 5. Extensions
select extname, extversion from pg_extension;
create extension if not exists pgcrypto;

-- 6. Backups (dashboard: Database > Backups) - free plan keeps daily backups for a limited time

-- 7. Clean up
drop table lab.courses;
drop schema lab;
