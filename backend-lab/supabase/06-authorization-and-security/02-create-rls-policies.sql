-- Experiment: Create RLS policies (run 01-enable-row-level-security.sql first)
-- Syntax: create policy "name" on table for [select|insert|update|delete|all] to role using (...) with check (...);
--   USING       = which EXISTING rows can be seen / updated / deleted
--   WITH CHECK  = which NEW or changed row values are allowed

drop policy if exists "notes are public to read"  on public.notes;
drop policy if exists "signed-in users can insert" on public.notes;

-- everyone (even anonymous) can read
create policy "notes are public to read"
on public.notes for select
to anon, authenticated
using (true);

-- only signed-in users can insert, and only rows that list themselves as the owner
create policy "signed-in users can insert"
on public.notes for insert
to authenticated
with check (auth.uid() = user_id);

-- list policies
select policyname, cmd, roles, qual, with_check
from pg_policies where tablename = 'notes';

-- change / remove a policy
-- alter policy "notes are public to read" on public.notes to authenticated;
-- drop policy "notes are public to read" on public.notes;
