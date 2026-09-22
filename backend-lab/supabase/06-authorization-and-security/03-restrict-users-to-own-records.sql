-- Experiment: Restrict users to their own records
-- Each user may only see and change rows where user_id = their own id.

alter table public.notes enable row level security;

-- remove the earlier public policies from experiment 02
drop policy if exists "notes are public to read"  on public.notes;
drop policy if exists "signed-in users can insert" on public.notes;

create policy "own notes: select" on public.notes for select to authenticated
using ((select auth.uid()) = user_id);                                  -- (select ...) is cached => faster

create policy "own notes: insert" on public.notes for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "own notes: update" on public.notes for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);                             -- cannot hand the row to someone else

create policy "own notes: delete" on public.notes for delete to authenticated
using ((select auth.uid()) = user_id);

-- Same idea for the students table (rows created by the current user)
drop policy if exists "lab: open read students"  on public.students;
drop policy if exists "lab: open write students" on public.students;
create policy "own students" on public.students for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- index the column used by the policy for speed
create index if not exists notes_user_id_idx on public.notes(user_id);
