-- Project: Role-Based Admin Dashboard using Supabase Authentication and RLS  (database part)
-- Run AFTER 00-setup/schema.sql. Then open 07-role-based-admin-dashboard.html.

-- 1. role helper (SECURITY DEFINER = no recursion inside policies)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- 2. PROFILES: users read own, admins read all; only admins change roles
drop policy if exists "lab: read profiles" on public.profiles;
drop policy if exists "profiles: read own or admin" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "profiles: admin update all" on public.profiles;

create policy "profiles: read own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());

create policy "profiles: update own name" on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = (select role from public.profiles where id = auth.uid()));

create policy "profiles: admin update all" on public.profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- 3. PRODUCTS: everyone signed-in reads, admin writes
drop policy if exists "lab: open read products"  on public.products;
drop policy if exists "lab: open write products" on public.products;
drop policy if exists "products: everyone signed-in can read" on public.products;
drop policy if exists "products: only admin can insert" on public.products;
drop policy if exists "products: only admin can update" on public.products;
drop policy if exists "products: only admin can delete" on public.products;

create policy "products: read" on public.products for select to authenticated using (true);
create policy "products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete" on public.products for delete to authenticated using (public.is_admin());

-- 4. STUDENTS: user sees own, admin sees all
drop policy if exists "lab: open read students"  on public.students;
drop policy if exists "lab: open write students" on public.students;
drop policy if exists "own students" on public.students;
drop policy if exists "students: owner or admin select" on public.students;
drop policy if exists "students: owner inserts" on public.students;
drop policy if exists "students: owner or admin update" on public.students;
drop policy if exists "students: owner or admin delete" on public.students;

create policy "students: select own or admin" on public.students for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "students: insert own" on public.students for insert to authenticated with check (user_id = (select auth.uid()) or public.is_admin());
create policy "students: update own or admin" on public.students for update to authenticated using (user_id = (select auth.uid()) or public.is_admin()) with check (user_id = (select auth.uid()) or public.is_admin());
create policy "students: delete own or admin" on public.students for delete to authenticated using (user_id = (select auth.uid()) or public.is_admin());

-- 5. Dashboard statistics function (admin only)
create or replace function public.admin_stats()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
  return json_build_object(
    'users',    (select count(*) from public.profiles),
    'admins',   (select count(*) from public.profiles where role = 'admin'),
    'students', (select count(*) from public.students),
    'products', (select count(*) from public.products)
  );
end; $$;
revoke execute on function public.admin_stats() from anon;

-- 6. Make yourself the first admin (replace the e-mail):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
