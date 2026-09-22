-- Run once before the Storage experiments.
-- Creates two buckets and the access policies (Storage is protected by RLS on storage.objects).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('uploads',       'uploads',       true,  5242880, array['image/png','image/jpeg','image/webp','application/pdf','text/plain']),
  ('private-files', 'private-files', false, 5242880, null)
on conflict (id) do nothing;

-- PUBLIC bucket "uploads": anyone can read, only authenticated users can upload/change/delete
drop policy if exists "uploads: public read"          on storage.objects;
drop policy if exists "uploads: authenticated insert" on storage.objects;
drop policy if exists "uploads: owner update"         on storage.objects;
drop policy if exists "uploads: owner delete"         on storage.objects;

create policy "uploads: public read" on storage.objects
for select to anon, authenticated using (bucket_id = 'uploads');

create policy "uploads: authenticated insert" on storage.objects
for insert to authenticated with check (bucket_id = 'uploads');

create policy "uploads: owner update" on storage.objects
for update to authenticated using (bucket_id = 'uploads' and owner = (select auth.uid()));

create policy "uploads: owner delete" on storage.objects
for delete to authenticated using (bucket_id = 'uploads' and owner = (select auth.uid()));

-- PRIVATE bucket: each user only touches files inside a folder named after their user id  ->  <uid>/file.ext
drop policy if exists "private: own folder" on storage.objects;
create policy "private: own folder" on storage.objects
for all to authenticated
using      (bucket_id = 'private-files' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'private-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
