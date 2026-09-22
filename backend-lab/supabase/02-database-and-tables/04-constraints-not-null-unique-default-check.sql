-- Experiment: Implement NOT NULL, UNIQUE, DEFAULT and CHECK constraints

create table public.accounts (
  id         bigint generated always as identity primary key,
  username   text        not null,                                    -- NOT NULL
  email      text        not null unique,                             -- UNIQUE
  role       text        not null default 'member',                   -- DEFAULT
  age        int         check (age between 13 and 120),              -- CHECK (column)
  balance    numeric     not null default 0,
  created_at timestamptz not null default now(),
  constraint chk_username_len check (char_length(username) >= 3),     -- CHECK (named)
  constraint chk_balance      check (balance >= 0),
  constraint uq_username      unique (username)
);

-- valid row (role, balance, created_at come from DEFAULT)
insert into public.accounts (username, email, age) values ('asha', 'asha@x.com', 20);
select * from public.accounts;

-- each of these fails; run individually
-- insert into public.accounts (username, email) values (null, 'a@x.com');       -- NOT NULL violation
-- insert into public.accounts (username, email) values ('ravi', 'asha@x.com');  -- UNIQUE violation
-- insert into public.accounts (username, email, age) values ('kid', 'k@x.com', 5);   -- CHECK violation
-- insert into public.accounts (username, email, balance) values ('neg', 'n@x.com', -10);  -- CHECK violation

-- add / drop constraints later
alter table public.accounts add constraint chk_role check (role in ('member','admin'));
alter table public.accounts drop constraint chk_role;

select conname, contype from pg_constraint where conrelid = 'public.accounts'::regclass;

drop table public.accounts;
