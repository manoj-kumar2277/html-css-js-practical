-- Experiment: Implement role-based access control (RBAC)
-- Requires: 04-create-admin-and-user-roles.sql  (is_admin())
--   admin -> full access to all products & students
--   user  -> read all products, manage only rows they created

-- PRODUCTS ----------------------------------------------------------
drop policy if exists "lab: open read products"  on public.products;
drop policy if exists "lab: open write products" on public.products;

create policy "products: everyone signed-in can read" on public.products
for select to authenticated using (true);

create policy "products: only admin can insert" on public.products
for insert to authenticated with check (public.is_admin());

create policy "products: only admin can update" on public.products
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "products: only admin can delete" on public.products
for delete to authenticated using (public.is_admin());

-- STUDENTS: owner OR admin --------------------------------------------
drop policy if exists "own students" on public.students;

create policy "students: owner or admin select" on public.students for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());

create policy "students: owner inserts" on public.students for insert to authenticated
with check (user_id = (select auth.uid()) or public.is_admin());

create policy "students: owner or admin update" on public.students for update to authenticated
using (user_id = (select auth.uid()) or public.is_admin())
with check (user_id = (select auth.uid()) or public.is_admin());

create policy "students: owner or admin delete" on public.students for delete to authenticated
using (user_id = (select auth.uid()) or public.is_admin());

-- (Advanced) roles inside the JWT: put role in app_metadata and read it with
--   (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
