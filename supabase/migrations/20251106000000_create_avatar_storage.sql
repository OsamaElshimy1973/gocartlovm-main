-- First create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable row level security
alter table storage.objects enable row level security;

-- Create policy for public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Create policy for authenticated users to upload their own avatars
create policy "Authenticated users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (lower(storage.extension(name)) = 'png' 
    or lower(storage.extension(name)) = 'jpg'
    or lower(storage.extension(name)) = 'jpeg'
    or lower(storage.extension(name)) = 'gif'
    or lower(storage.extension(name)) = 'webp'
  )
  and octet_length(content) < 2097152 -- 2MB file size limit
);

-- Create policy for users to update their own avatars
create policy "Users can update own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  (lower(storage.extension(name)) = 'png' 
    or lower(storage.extension(name)) = 'jpg'
    or lower(storage.extension(name)) = 'jpeg'
    or lower(storage.extension(name)) = 'gif'
    or lower(storage.extension(name)) = 'webp'
  )
  and octet_length(content) < 2097152 -- 2MB file size limit
);

-- Create policy for users to delete their own avatars
create policy "Users can delete own avatars"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);