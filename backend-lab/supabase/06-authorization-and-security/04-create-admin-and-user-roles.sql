-- Experiment: Create Admin and User roles
-- Roles live in public.profiles.role ('user' | 'admin') - created by 00-setup/schema.sql.

-- 1. Helper functions (SECURITY DEFINER avoids infinite recursion when a policy reads profiles)
create or replace function public.current_role_name()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- 2. Make a user an admin (replace the e-mail with a registered account)
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');

-- 3. Users may read their own profile; admins can read all
drop policy if exists "lab: read profiles" on public.profiles;
create policy "profiles: read own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());

-- 4. Users can edit their own name but must NOT be able to promote themselves
create policy "profiles: update own" on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = (select role from public.profiles where id = auth.uid()));

-- 5. Admin can change any profile (including role)
create policy "profiles: admin update all" on public.profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- 6. Check
select p.id, u.email, p.role from public.profiles p join auth.users u on u.id = p.id;
select public.is_admin() as am_i_admin;      -- run from the client to test
