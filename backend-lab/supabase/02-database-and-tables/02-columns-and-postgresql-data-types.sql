-- Experiment: Define columns and PostgreSQL data types

create table public.data_types_demo (
  -- numbers
  id            bigint generated always as identity primary key,
  small_number  smallint,                 -- -32768 .. 32767
  whole_number  integer,                  -- 4 bytes
  big_number    bigint,                   -- 8 bytes
  price         numeric(10,2),            -- exact decimals (use for money)
  ratio         double precision,         -- floating point
  -- text
  short_text    varchar(50),
  any_text      text,                     -- unlimited length (preferred in Postgres)
  fixed_code    char(3),
  -- boolean / dates
  is_active     boolean default true,
  birth_date    date,
  start_time    time,
  created_at    timestamptz default now(), -- always prefer timestamptz
  duration      interval,
  -- special
  external_id   uuid default gen_random_uuid(),
  settings      jsonb default '{}'::jsonb,          -- JSON with indexing support
  tags          text[],                              -- arrays
  ip            inet,
  status        text check (status in ('draft','published'))
);

insert into public.data_types_demo (small_number, whole_number, price, short_text, birth_date, settings, tags, ip)
values (10, 100000, 99.50, 'hello', '2004-05-17', '{"theme":"dark","lang":"en"}', array['a','b'], '192.168.1.1');

select settings->>'theme' as theme, tags[1] as first_tag, extract(year from age(birth_date)) as age
from public.data_types_demo;

select column_name, data_type, character_maximum_length
from information_schema.columns where table_name = 'data_types_demo';

drop table public.data_types_demo;
