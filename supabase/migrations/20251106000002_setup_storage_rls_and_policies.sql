-- Step 1: Enable RLS
alter table storage.objects enable row level security;

-- Step 2: Create the avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Step 3: Create all necessary policies
-- Public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Authenticated users can upload avatars
create policy "Authenticated users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (lower(storage.extension(name)) in ('png', 'jpg', 'jpeg', 'gif', 'webp'))
  and octet_length(content) < 2097152 -- 2MB limit
);

-- Users can update their own avatars
create policy "Users can update own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  (lower(storage.extension(name)) in ('png', 'jpg', 'jpeg', 'gif', 'webp'))
  and octet_length(content) < 2097152 -- 2MB limit
);

-- Users can delete their own avatars
create policy "Users can delete own avatars"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Step 4: Verify setup
-- Check RLS is enabled
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid = 'storage.objects'::regclass;

-- List all policies
select 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
from pg_policies
where tablename = 'objects'
and schemaname = 'storage';