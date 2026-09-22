-- Experiment: Implement authenticated-user policies
-- Difference between the Postgres roles used by Supabase:
--   anon           -> not logged in (only the anon key)
--   authenticated  -> logged in (valid JWT)
--   service_role   -> server key, bypasses RLS

-- Public read for anonymous visitors, write only for logged-in users
alter table public.messages enable row level security;
drop policy if exists "lab: open read messages"  on public.messages;
drop policy if exists "lab: open write messages" on public.messages;

create policy "messages: anyone can read" on public.messages
for select to anon, authenticated using (true);

create policy "messages: only authenticated can post as themselves" on public.messages
for insert to authenticated with check (user_id = (select auth.uid()));

create policy "messages: authors can delete own" on public.messages
for delete to authenticated using (user_id = (select auth.uid()));

-- Extra conditions using the JWT
-- only users with a confirmed e-mail:
create policy "messages: verified e-mail only (example)" on public.messages
as restrictive for insert to authenticated
with check ((auth.jwt() ->> 'email_confirmed_at') is not null or true);   -- replace "or true" to enforce

-- only users who signed in with a specific provider
--   (auth.jwt() -> 'app_metadata' ->> 'provider') = 'email'

-- Multi-factor: require AAL2 for sensitive tables
--   (auth.jwt() ->> 'aal') = 'aal2'

select policyname, roles, cmd from pg_policies where tablename = 'messages';
